import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Hotspot } from "../types";
import { UI_TRANSLATIONS } from "../locales";
import {
  ShieldCheck,
  Info,
  Sparkles,
  AlertOctagon,
  CheckCircle,
  Eye,
  Compass,
  Activity,
  Award,
  CircleDot,
  Wrench,
  Gauge
} from "lucide-react";

interface Props {
  hotspots: Hotspot[];
  onUnlockBadge: (badgeId: string) => void;
  lang: "en" | "fr";
}

// Define the 3 coordinate mappings for dynamic spatial realignment based on perspective
const viewCoords: Record<string, Record<string, { x: number; y: number }>> = {
  profile: {
    brakes: { x: 14, y: 38 },          // Front caliper is near fork, rear caliper is near frame
    sprocket: { x: 15, y: 72 },         // Rear spokes drive wheel
    engine_mount: { x: 49, y: 72 },     // Frame central bottom V bracket
    chain_tensioner: { x: 33, y: 78 },   // Chain guide idler pulley
    fuel_tank: { x: 58, y: 30 },        // Fuel tank on top tube
    kill_switch: { x: 70, y: 24 }        // Left handlebar near grips
  },
  top: {
    brakes: { x: 86, y: 50 },          // Caliper brake controls
    sprocket: { x: 16, y: 27 },         // Left side sprocket alignment runout
    engine_mount: { x: 46, y: 50 },     // Midline engine stabilization block
    chain_tensioner: { x: 30, y: 31 },   // Chain run guide roller
    fuel_tank: { x: 47, y: 44 },        // Spine layout fuel tank
    kill_switch: { x: 72, y: 16 }        // Handlebar switch wire connector
  },
  cross_section: {
    brakes: { x: 11, y: 84 },          // Marginal coordinate
    sprocket: { x: 12, y: 72 },         // Drive connection layout
    engine_mount: { x: 50, y: 68 },     // Diagonal downtube clamp fit
    chain_tensioner: { x: 18.5, y: 64 }, // Dynamic intake path clearance
    fuel_tank: { x: 53, y: 19 },        // Fuel direct feed petcock line
    kill_switch: { x: 36, y: 12 }        // CDI plug wire grounding terminal
  }
};

// Torque target mapping
const targetTorques: Record<string, { target: number; tolerance: number; description: string }> = {
  brakes: { target: 12.0, tolerance: 1.5, description: "Standard secure clamp for fork brake boss bolts." },
  sprocket: { target: 18.0, tolerance: 2.0, description: "Star-pattern spoke compression target. Do not crush spokes." },
  engine_mount: { target: 22.0, tolerance: 2.5, description: "V-bracket torque to survive intense crank vibration harmonics." },
  chain_tensioner: { target: 15.0, tolerance: 1.5, description: "Strap-lock clamping torque to avoid wheel-jamming spining pivot." },
  fuel_tank: { target: 6.0, tolerance: 1.0, description: "Soft metal clamp target to avoid cylinder wall thread stripping." },
  kill_switch: { target: 4.5, tolerance: 0.8, description: "Light hinge tension to allow override shifting under extreme impact." }
};

const targetTorquesFr: Record<string, string> = {
  brakes: "Serrage standard de sécurité pour les étriers de frein de fourche.",
  sprocket: "Serrage croisé des rayons pour la roue arrière. Ne pliez pas les rayons.",
  engine_mount: "Bride en V pour surmonter l'intense vibration harmonique du vilebrequin.",
  chain_tensioner: "Bride à vis d'arrêt pour empêcher le galet tendeur de pivoter dans les rayons.",
  fuel_tank: "Seuil de serrage modéré pour enrayer le cisaillement des filets en aluminium.",
  kill_switch: "Serrage de charnière modéré facilitant les ajustements de guidon lors de chocs."
};

export function BikeHotspots({ hotspots, onUnlockBadge, lang }: Props) {
  const [selectedId, setSelectedId] = useState<string>("brakes");
  const [visitedIds, setVisitedIds] = useState<string[]>(["brakes"]);
  const [activePerspective, setActivePerspective] = useState<"profile" | "top" | "cross_section">("profile");

  // Torque calibration states
  const [sliderValue, setSliderValue] = useState<number>(3);
  const [calibratedNodes, setCalibratedNodes] = useState<Record<string, boolean>>({});
  const [showToleranceHelper, setShowToleranceHelper] = useState(true);

  const selectedHotspot = hotspots.find((h) => h.id === selectedId) || hotspots[0];
  const targetSpecRaw = targetTorques[selectedId] || { target: 10, tolerance: 1, description: "" };
  const targetSpec = {
    ...targetSpecRaw,
    description: lang === "fr" ? (targetTorquesFr[selectedId] || targetSpecRaw.description) : targetSpecRaw.description
  };

  const t = UI_TRANSLATIONS[lang];

  // Sync slider value when active selected node shifts
  useEffect(() => {
    // Generate a default uncalibrated state if not yet locked
    if (calibratedNodes[selectedId]) {
      setSliderValue(targetSpec.target);
    } else {
      // Provide a random loose value as mechanical default starting point
      const offset = (Math.random() > 0.5 ? 1 : -1) * (targetSpec.tolerance * 2 + Math.random() * 4);
      const startingVal = Math.max(1, Math.round((targetSpec.target + offset) * 10) / 10);
      setSliderValue(startingVal);
    }
  }, [selectedId]);

  // Audio synthesizer utilizing the Web Audio API (cross-browser safe)
  const playAppSound = (type: "click" | "success" | "calibrate" | "error" | "gear") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(780, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === "calibrate") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === "gear") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(330, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
      } else if (type === "success") {
        const now = ctx.currentTime;
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.18); // C6
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.setValueAtTime(0.04, now + 0.18);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start();
        osc.stop(now + 0.4);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.21);
      }
    } catch (e) {
      // Fallback if browser security sandboxes audio
    }
  };

  const handleSelect = (id: string) => {
    playAppSound("click");
    setSelectedId(id);
    if (!visitedIds.includes(id)) {
      const nextVisited = [...visitedIds, id];
      setVisitedIds(nextVisited);
      if (nextVisited.length === hotspots.length) {
        onUnlockBadge("badge_inspect");
      }
    }
  };

  const changePerspective = (view: "profile" | "top" | "cross_section") => {
    playAppSound("gear");
    setActivePerspective(view);
  };

  const toggleTorqueCalibration = () => {
    const isWithinBounds = Math.abs(sliderValue - targetSpec.target) <= targetSpec.tolerance;
    if (isWithinBounds) {
      playAppSound("success");
      const nextCalib = { ...calibratedNodes, [selectedId]: true };
      setCalibratedNodes(nextCalib);

      // Check if all 6 hotspots are completely calibrated inside green specs
      const verifiedCount = Object.keys(nextCalib).filter((k) => nextCalib[k]).length;
      if (verifiedCount === hotspots.length) {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#f59e0b", "#10b981", "#3b82f6", "#ffffff"]
          });
        }, 300);
      }
    } else {
      playAppSound("error");
      // Flash slider warning
    }
  };

  const isCurrentCalibrated = calibratedNodes[selectedId] || false;
  const totalCalibratedCount = Object.keys(calibratedNodes).filter((k) => calibratedNodes[k]).length;

  // Render proper background blueprint based on active perspective
  const renderPerspectiveSVG = () => {
    switch (activePerspective) {
      case "top":
        return (
          <svg
            className="w-full h-auto text-gray-700 stroke-gray-700/65"
            viewBox="0 0 100 60"
            fill="none"
            strokeWidth="0.8"
          >
            {/* Guide Grid Pattern */}
            <defs>
              <pattern id="grid-top" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(245,158,11,0.04)" strokeWidth="0.15" />
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#grid-top)" />

            {/* Rear Wheel (Top profile) */}
            <rect x="12" y="24" width="4.5" height="12" rx="1.2" fill="#1f2937" stroke="currentColor" strokeWidth="0.4" />
            <line x1="8" y1="30" x2="16.5" y2="30" stroke="currentColor" strokeWidth="0.7" />

            {/* Front Wheel (Top profile) */}
            <rect x="83.5" y="24" width="4.5" height="12" rx="1.2" fill="#1f2937" stroke="currentColor" strokeWidth="0.4" />
            <line x1="80" y1="30" x2="88" y2="30" stroke="currentColor" strokeWidth="0.7" />

            {/* Frame Central Backbone */}
            <path d="M 14.5 30 Q 30 29.5 46 30 Q 64 30 83.5 30" stroke="currentColor" strokeWidth="1.2" />

            {/* Wide Handlebars */}
            <path d="M 68 18 Q 72 30 75 30 Q 72 30 68 42" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="68" cy="18" r="1.3" fill="currentColor" />
            <circle cx="68" cy="42" r="1.3" fill="currentColor" />

            {/* Top view Fuel Tank */}
            <rect x="42" y="26" width="18" height="8" rx="4" className="fill-cyan-950/20 stroke-cyan-500/40" strokeWidth="1" />
            <circle cx="45" cy="30" r="1.2" fill="#06b6d4" /> {/* Petcock cover */}

            {/* Top Cylinder Cooling Fins representation */}
            <rect x="34.5" y="27" width="8" height="6" rx="1.5" className="fill-gray-900 stroke-amber-500/50" strokeWidth="1.1" />
            <line x1="36" y1="28.5" x2="41" y2="28.5" stroke="currentColor" strokeWidth="0.5" />
            <line x1="36" y1="30" x2="41" y2="30" stroke="currentColor" strokeWidth="0.5" />
            <line x1="36" y1="31.5" x2="41" y2="31.5" stroke="currentColor" strokeWidth="0.5" />

            {/* Engine Drive Sprocket (Left side offset) */}
            <circle cx="14.5" cy="27" r="1.7" className="fill-transparent stroke-rose-400" strokeWidth="0.9" />

            {/* Live Drive Chain Straight-run (Highly Parallel, emerald highlighted) */}
            <line x1="14.5" y1="27.5" x2="35.5" y2="28.2" className="stroke-emerald-400/80" strokeWidth="1.1" />
            <line x1="14.5" y1="26.5" x2="35.5" y2="27.2" className="stroke-emerald-500/70" strokeWidth="0.6" strokeDasharray="1.5 1.5" />

            {/* Bicycle human chain right path */}
            <line x1="14.5" y1="32.5" x2="39.5" y2="32.5" stroke="currentColor" strokeWidth="0.45" strokeDasharray="2 1.5" />

            {/* Laser Parallelism Guideline */}
            <line x1="8" y1="27" x2="68" y2="27" className="stroke-cyan-500/10" strokeWidth="0.4" strokeDasharray="6 3" />
            
            {/* Visual alignment check marks */}
            <text x="21" y="24" className="fill-emerald-400 font-mono text-[4px]" stroke="none">PARALLEL: 0.1° SKEW</text>
          </svg>
        );

      case "cross_section":
        return (
          <svg
            className="w-full h-auto text-gray-700 stroke-gray-700/65"
            viewBox="0 0 100 60"
            fill="none"
            strokeWidth="0.8"
          >
            {/* Guide Grid Pattern */}
            <defs>
              <pattern id="grid-cs" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(6,182,212,0.04)" strokeWidth="0.15" />
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#grid-cs)" />

            {/* Big zoomed Structural Frame members */}
            <line x1="4" y1="8" x2="96" y2="8" stroke="currentColor" strokeWidth="2.8" opacity="0.25" /> {/* Top bar */}
            <line x1="18" y1="8" x2="18" y2="52" stroke="currentColor" strokeWidth="2.8" opacity="0.3" />  {/* Seat post */}
            <line x1="18" y1="8" x2="88" y2="50" stroke="currentColor" strokeWidth="2.8" opacity="0.3" />  {/* Downtube */}

            {/* Zoomed Crankcase block */}
            <circle cx="34" cy="38" r="12" className="fill-gray-950 stroke-gray-750" strokeWidth="1.2" />
            <circle cx="34" cy="38" r="10.8" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Piston Cylinder fins zoomed */}
            <rect x="28" y="16" width="12" height="13" rx="1.2" className="fill-gray-900 stroke-amber-500/40" strokeWidth="1" />
            <rect x="25" y="18.5" width="18" height="1.2" rx="0.4" fill="currentColor" />
            <rect x="24" y="21.5" width="20" height="1.2" rx="0.4" fill="currentColor" />
            <rect x="25" y="24.5" width="18" height="1.2" rx="0.4" fill="currentColor" />
            <rect x="26" y="27.5" width="16" height="1.2" rx="0.4" fill="currentColor" />

            {/* Red Spark Plug thread cap */}
            <rect x="32.5" y="11" width="3" height="5.2" rx="0.6" className="fill-rose-600/90 stroke-red-400" strokeWidth="0.5" />
            <line x1="34" y1="8" x2="34" y2="11" className="stroke-red-400" strokeWidth="0.8" />

            {/* Carburetor space block */}
            <rect x="15" y="22" width="10" height="9" rx="1" className="fill-gray-900 stroke-gray-700" strokeWidth="0.8" />
            <circle cx="20" cy="26.5" r="3.2" className="fill-gray-950 stroke-gray-800" strokeWidth="0.5" />

            {/* Thermal clearances guide overlays */}
            <path d="M 45 10 Q 55 12 34 22" className="stroke-cyan-400/90" strokeWidth="1.1" strokeDasharray="2 1.5" fill="none" />
            <circle cx="48" cy="13" r="2.2" className="fill-cyan-950 stroke-cyan-400" strokeWidth="0.6" /> {/* Fuel filter line */}

            {/* Direct Frame Attachment V Clamps */}
            <rect x="40.5" y="29" width="3" height="4.5" rx="0.5" className="fill-amber-500 stroke-amber-400" strokeWidth="0.3" />
            <rect x="16.5" y="32.5" width="3" height="4.5" rx="0.5" className="fill-amber-500 stroke-amber-400" strokeWidth="0.3" />

            {/* Exhaust flow routing profile */}
            <path d="M 37.5 29 Q 55 36 74 36" stroke="currentColor" strokeWidth="1.6" />
            <rect x="74" y="34.5" width="18" height="3" rx="0.4" fill="currentColor" />
          </svg>
        );

      case "profile":
      default:
        return (
          <svg
            className="w-full h-auto text-gray-800 stroke-gray-700/60 transition-transform group-hover:scale-[1.01] duration-500"
            viewBox="0 0 100 60"
            fill="none"
            strokeWidth="0.8"
          >
            {/* Back Wheel */}
            <circle cx="15" cy="45" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="15" cy="45" r="9.2" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="15" cy="45" r="1.5" fill="currentColor" />
            <circle cx="15" cy="45" r="7.5" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 3" />
            
            {/* Front Wheel */}
            <circle cx="85" cy="45" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="85" cy="45" r="9.2" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="85" cy="45" r="1.5" fill="currentColor" />
            <circle cx="85" cy="45" r="7.5" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 3" />

            {/* Rear Sprocket representation */}
            <circle cx="15" cy="45" r="4" className="text-amber-500/25 stroke-amber-500/60" strokeWidth="1.2" />

            {/* Handlebar Stem and Forks */}
            <line x1="85" y1="45" x2="75" y2="18" stroke="currentColor" strokeWidth="1.2" />
            <line x1="75" y1="18" x2="70" y2="17" stroke="currentColor" strokeWidth="1.5" />

            {/* Main Frame Triangle */}
            <line x1="15" y1="45" x2="48" y2="45" stroke="currentColor" strokeWidth="1.4" />
            <line x1="48" y1="45" x2="44" y2="24" stroke="currentColor" strokeWidth="1.4" />
            <line x1="44" y1="24" x2="15" y2="45" stroke="currentColor" strokeWidth="1.2" />
            <line x1="48" y1="45" x2="75" y2="22" stroke="currentColor" strokeWidth="1.4" />
            <line x1="75" y1="22" x2="44" y2="24" stroke="currentColor" strokeWidth="1.4" />

            {/* Seat */}
            <path d="M 40 22 Q 44 21 48 23" stroke="currentColor" strokeWidth="2.5" />

            {/* Engine Block Block Schematic */}
            <rect x="42" y="38" width="10" height="7" rx="1.5" className="fill-gray-900 stroke-amber-500/40" strokeWidth="1" />
            <path d="M 48 44 Q 52 50 64 50" stroke="currentColor" strokeWidth="1.5" />
            <rect x="64" y="48.5" width="10" height="3" rx="0.5" stroke="currentColor" strokeWidth="0.8" />

            {/* Fuel Tank Outline */}
            <path d="M 46 21 C 52 20, 60 20, 68 22 C 60 25, 52 25, 46 21 Z" className="fill-cyan-950/20 stroke-cyan-500/40" strokeWidth="1" />

            {/* Chain Links */}
            <line x1="46" y1="42" x2="15" y2="44" className="stroke-amber-400/40" strokeWidth="0.7" strokeDasharray="3 2" />
            <line x1="46" y1="44" x2="15" y2="46" className="stroke-amber-400/40" strokeWidth="0.7" strokeDasharray="3 2" />
          </svg>
        );
    }
  };

  const selectedCoordinates = viewCoords[activePerspective] || viewCoords.profile;

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-2xl p-4 md:p-6 shadow-xl select-none">
      <div className="border-b border-gray-800 pb-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            {t.hotspots_title}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {t.hotspots_subtitle}
          </p>
        </div>

        {/* Dynamic overall calibration checklist badge indicator */}
        <div className="flex items-center gap-2.5 bg-gray-900 px-3.2 py-1.8 rounded-xl border border-gray-800">
          <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Gauge className="w-4 h-4" />
          </span>
          <div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">
              {lang === "fr" ? "COUPLES DE SERRAGE" : "TORQUE COUPLINGS"}
            </div>
            <div className="text-xs font-bold text-white">
              {totalCalibratedCount} / {hotspots.length} {lang === "fr" ? "Calibrés" : "Calibrated"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Schematic Frame (Left 7 cols) */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-gray-800 rounded-xl relative p-4 flex flex-col items-center justify-center min-h-[380px] overflow-hidden group">
          
          {/* TOP BUTTONS: PERSPECTIVE TOGGLES */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gray-950/80 backdrop-blur-md p-1 border border-gray-800 rounded-xl z-20">
            <button
              onClick={() => changePerspective("profile")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activePerspective === "profile"
                  ? "bg-amber-500 text-black font-bold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Compass className="w-3 h-3" />
              {lang === "fr" ? "Profil Gauche" : "Left Profile"}
            </button>
            <button
              onClick={() => changePerspective("top")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activePerspective === "top"
                  ? "bg-amber-500 text-black font-bold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Activity className="w-3 h-3" />
              {lang === "fr" ? "Alignement Supérieur" : "Top down Alignment"}
            </button>
            <button
              onClick={() => changePerspective("cross_section")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activePerspective === "cross_section"
                  ? "bg-amber-500 text-black font-bold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Eye className="w-3 h-3" />
              {lang === "fr" ? "Rayons X Cylindre" : "Cylinder X-Ray"}
            </button>
          </div>

          <div className="absolute top-3 right-3 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-[10px] font-mono text-amber-400 rounded-full z-20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
            {lang === "fr" ? "Contrôles Visités" : "Audited Checks"}: {visitedIds.length} / {hotspots.length}
          </div>

          {/* Render Active SVG perspective */}
          <div className="relative w-full max-w-[500px] h-full flex items-center justify-center py-10 my-4 transition-all duration-500">
            {renderPerspectiveSVG()}

            {/* Hotspots Absolute coordinates dynamically realignment mapped */}
            {hotspots.map((spot) => {
              const viewCoord = selectedCoordinates[spot.id] || { x: 50, y: 50 };
              const isSelected = spot.id === selectedId;
              const hasVisited = visitedIds.includes(spot.id);
              const isCalibrated = calibratedNodes[spot.id] || false;

              return (
                <button
                  key={spot.id}
                  id={`hotspot-btn-${spot.id}`}
                  onClick={() => handleSelect(spot.id)}
                  style={{ left: `${viewCoord.x}%`, top: `${viewCoord.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group/btn z-10 p-2 cursor-pointer outline-none focus:outline-none"
                >
                  {/* Outer glowing warning/success ping arcs */}
                  <span
                    className={`absolute inset-0 rounded-full opacity-60 transition-transform duration-500 scale-105 ${
                      isSelected
                        ? "animate-ping bg-amber-400"
                        : isCalibrated
                        ? "bg-emerald-400/20 group-hover/btn:animate-ping"
                        : hasVisited
                        ? "bg-cyan-500/20 group-hover/btn:animate-ping"
                        : "bg-rose-500/35 animate-pulse"
                    }`}
                  ></span>

                  {/* Inner technical core badge indicator */}
                  <span
                    className={`relative flex items-center justify-center rounded-full h-5.5 w-5.5 border-1.5 text-[10px] font-mono font-bold transition-all duration-300 ${
                      isSelected
                        ? "bg-amber-400 text-[#0b0f19] border-white scale-120 shadow-lg shadow-amber-400/30"
                        : isCalibrated
                        ? "bg-emerald-500 text-white border-emerald-300"
                        : hasVisited
                        ? "bg-cyan-600 text-white border-cyan-400 hover:bg-cyan-500"
                        : "bg-rose-600 text-white border-rose-400 hover:bg-rose-500"
                    }`}
                  >
                    {isCalibrated ? "✓" : hasVisited ? "!" : "?"}
                  </span>

                  {/* Text label underneath */}
                  <span className="pointer-events-none absolute bottom-7.5 left-1/2 transform -translate-x-1/2 bg-gray-950/90 border border-gray-800 text-white text-[9px] py-0.5 px-2 rounded-md font-mono font-bold whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200">
                    {spot.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer stats bar inside map */}
          <div className="w-full text-center py-2 px-4 bg-gray-950/40 border-t border-gray-900/60 flex items-center justify-between text-[11px] font-mono text-gray-400 mt-auto">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {lang === "fr" ? "Perspective :" : "Perspective:"} <strong className="text-gray-200 uppercase">{activePerspective.replace("_", " ")}</strong>
            </span>
            <span className="text-gray-500">
              {totalCalibratedCount === hotspots.length
                ? (lang === "fr" ? "🏆 TOUS LES POINTS SONT CALIBRÉS !" : "🏆 ALL NODES CALIBRATED PERFECTLY!")
                : (lang === "fr" ? `Il reste ${hotspots.length - totalCalibratedCount} couples à valider` : `${hotspots.length - totalCalibratedCount} coupling torque checks remain`)}
            </span>
          </div>
        </div>

        {/* Selected Node Inspector Details Sidebar (Right 5 cols) */}
        <div className="lg:col-span-5 bg-gray-900/40 border border-gray-800 rounded-xl p-4 md:p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span
                  className={`text-[9.5px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                    selectedHotspot.importance === "CRITICAL"
                      ? "bg-rose-600/10 text-rose-400 border-rose-500/20"
                      : "bg-amber-600/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {selectedHotspot.importance} {lang === "fr" ? "INSPECTION DU POINT" : "INSPECT NODE"}
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5 leading-tight">
                  {selectedHotspot.name}
                </h3>
              </div>
            </div>

            {/* Danger Scenario description */}
            <div className="bg-gray-950/40 border border-gray-900 rounded-xl p-3 space-y-2">
              <h4 className="text-[10px] text-rose-400 font-bold font-mono tracking-wider flex items-center gap-1.5 uppercase">
                <AlertOctagon className="w-3.5 h-3.5" />
                {lang === "fr" ? "Le Scénario de Danger" : "The Danger Scenario"}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {selectedHotspot.description}
              </p>
            </div>

            {/* Safety Protocol */}
            <div className="flex gap-3">
              <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0 h-fit">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {lang === "fr" ? "Protocole de Sécurité d'Atelier" : "Workshop Safety Protocol"}
                </h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {selectedHotspot.safetyProtocol}
                </p>
              </div>
            </div>

            {/* Dynamic Physics / Mechanic Equation Note */}
            <div className="flex gap-3 pt-1">
              <span className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 shrink-0 h-fit">
                <Info className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {lang === "fr" ? "Note Scientifique & Mécanique" : "Student Mechanical Physics Note"}
                </h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed font-mono">
                  {selectedHotspot.mechanicNote}
                </p>
              </div>
            </div>

            {/* Interactive Torque Wrench coupling tuner */}
            <div className="border-t border-gray-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-sans tracking-wide">
                  <Wrench className="w-3.5 h-3.5 text-amber-500" />
                  {lang === "fr" ? "Calibrage du Couple de Fixation" : "Coupling Torque calibrator"}
                </h4>
                <span className="text-[10px] text-gray-500 font-mono">
                  {lang === "fr" ? "CIBLE" : "TARGET"} : <strong className="text-amber-400">{targetSpec.target} Nm</strong> (±{targetSpec.tolerance})
                </span>
              </div>

              {/* Slider tuner graphic representation */}
              <div className="bg-gray-950/80 border border-gray-850 p-3.5 rounded-xl space-y-3.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-500">{lang === "fr" ? "Tension Actuelle :" : "Tightness:"}</span>
                  <span className={`font-bold ${
                    Math.abs(sliderValue - targetSpec.target) <= targetSpec.tolerance
                      ? "text-emerald-400"
                      : "text-amber-500"
                  }`}>
                    {sliderValue.toFixed(1)} Nm
                  </span>
                </div>

                <div className="relative pt-1 flex items-center">
                  <input
                    id="torque-calibrator-slider"
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={sliderValue}
                    onChange={(e) => {
                      setSliderValue(parseFloat(e.target.value));
                      // Periodically ping soft micro-tone
                      if (Math.random() > 0.6) playAppSound("click");
                    }}
                    className="w-full accent-amber-500 bg-gray-800 h-1.5 rounded-lg cursor-pointer outline-none my-1"
                  />
                  
                  {/* Graphical helper bar zone representing acceptable tolerance range */}
                  {showToleranceHelper && (
                    <div
                      className="absolute bg-emerald-500/20 border-l border-r border-emerald-400/40 h-2 top-0"
                      style={{
                        left: `${((targetSpec.target - targetSpec.tolerance) / 30) * 100}%`,
                        width: `${((targetSpec.tolerance * 2) / 30) * 100}%`
                      }}
                    ></div>
                  )}
                </div>

                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>{lang === "fr" ? "0.0 Nm (Desserré)" : "0.0 Nm (Loose)"}</span>
                  <span>15.0 Nm</span>
                  <span>30.0 Nm (Max)</span>
                </div>

                <div className="pt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    id="torque-lock-btn"
                    onClick={toggleTorqueCalibration}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer select-none transition-all ${
                      Math.abs(sliderValue - targetSpec.target) <= targetSpec.tolerance
                        ? "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95"
                        : "bg-gray-850 text-gray-400 border border-gray-800 hover:border-gray-700 active:scale-95 text-xs"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isCurrentCalibrated 
                      ? (lang === "fr" ? "Calibré ✓ Serrage Verrouillé" : "Calibrated ✓ Lock Tension") 
                      : (lang === "fr" ? "Verrouiller le serrage cible" : "Lock In Spec Tension")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className={`w-3.5 h-3.5 ${isCurrentCalibrated ? "text-emerald-500" : "text-gray-750"}`} />
              {lang === "fr" ? "Audit de tension :" : "Calibration audit:"} {isCurrentCalibrated ? (lang === "fr" ? "CONFORME ✓" : "COMPLETE") : (lang === "fr" ? "NON SERRÉ" : "PENDING LIMITS")}
            </span>
            <span className="font-mono text-[9px] text-gray-600">ID: {selectedHotspot.id.toUpperCase()}_CLAMP_CHECK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
