import { useState, useEffect } from "react";
import { EngineStage } from "../types";
import { 
  Flame, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Info, 
  RefreshCw, 
  Zap, 
  Play, 
  Pause, 
  Gauge, 
  Sparkles,
  Volume2
} from "lucide-react";

interface Props {
  stages: EngineStage[];
  onUnlockBadge: (badgeId: string) => void;
  lang: "en" | "fr";
}

export function EngineCycle({ stages, onUnlockBadge, lang }: Props) {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [cycledIds, setCycledIds] = useState<string[]>([stages[0].id]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [throttleVal, setThrottleVal] = useState<number>(1); // 1 = Idle, 2 = Cruising, 3 = Redline Maximum
  const [smoothAngle, setSmoothAngle] = useState<number>(0);

  // Map each stage configuration to its natural physics cylinder degree
  let baseDegrees = 0;
  const currentStageId = stages[activeStageIndex]?.id;
  if (currentStageId === "intake") {
    baseDegrees = 330;
  } else if (currentStageId === "power") {
    baseDegrees = 60;
  } else {
    baseDegrees = 180;
  }

  // Map throttle level to delay (ms) per stroke and virtual diagnostic RPM
  const getSimulatedTelemetry = () => {
    switch (throttleVal) {
      case 1:
        return { delay: 900, rpm: 1450, sound: "chug... cough... chug..." };
      case 2:
        return { delay: 450, rpm: 4800, sound: "vrrrrooooom-pop-vrrrrooom!" };
      case 3:
        return { delay: 200, rpm: 8250, sound: "screeech-braaaaap-braaaaap!" };
      default:
        return { delay: 1000, rpm: 0, sound: "Engine Off" };
    }
  };

  const { delay, rpm, sound } = getSimulatedTelemetry();

  // Map dynamic angular subdivisions directly to structural thermodynamic phases
  const getStageFromAngle = (angle: number): number => {
    const norm = ((angle % 360) + 360) % 360;
    if (norm >= 270 || norm < 30) {
      const idx = stages.findIndex((s) => s.id === "intake");
      return idx !== -1 ? idx : 0;
    } else if (norm >= 30 && norm < 150) {
      const idx = stages.findIndex((s) => s.id === "power");
      return idx !== -1 ? idx : 1;
    } else {
      const idx = stages.findIndex((s) => s.id !== "intake" && s.id !== "power");
      return idx !== -1 ? idx : 2;
    }
  };

  const computedStageIndex = isPlaying ? getStageFromAngle(smoothAngle) : activeStageIndex;
  const activeStage = stages[computedStageIndex] || stages[0];

  // Synchronize smoothAngle to baseDegrees if not playing
  useEffect(() => {
    if (!isPlaying) {
      setSmoothAngle(baseDegrees);
    }
  }, [isPlaying, activeStageIndex, baseDegrees]);

  // High-performance continuous animation loop (60 frames per second)
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const tickFrame = (now: number) => {
      const deltaMs = now - lastTime;
      lastTime = now;

      // Throttle 1 (Idle): 1 rev / 2.7 sec -> 360 / 2700 = 0.1333 deg/ms
      // Throttle 2 (Cruise): 1 rev / 1.35 sec -> 360 / 1350 = 0.2667 deg/ms
      // Throttle 3 (Redline): 1 rev / 0.6 sec -> 360 / 600 = 0.6 deg/ms
      let degPerMs = 0.1333;
      if (throttleVal === 2) {
        degPerMs = 0.2667;
      } else if (throttleVal === 3) {
        degPerMs = 0.6;
      }

      setSmoothAngle((prevAngle) => prevAngle + degPerMs * deltaMs);
      animationFrameId = requestAnimationFrame(tickFrame);
    };

    animationFrameId = requestAnimationFrame(tickFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, throttleVal]);

  // Sync computed index and unlock badges
  useEffect(() => {
    if (!isPlaying) return;
    
    const activeStageId = stages[computedStageIndex]?.id;
    if (!activeStageId) return;

    setCycledIds((prev) => {
      if (!prev.includes(activeStageId)) {
        const updated = [...prev, activeStageId];
        if (updated.length === stages.length) {
          setTimeout(() => onUnlockBadge("badge_engine"), 45);
        }
        return updated;
      }
      return prev;
    });
  }, [computedStageIndex, isPlaying, stages, onUnlockBadge]);

  const togglePlay = () => {
    if (isPlaying) {
      // Capture the current computed stage when pausing to avoid UI jumps
      setActiveStageIndex(computedStageIndex);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setIsPlaying(false); // Pause auto playback
    const nextIndex = (activeStageIndex + 1) % stages.length;
    setActiveStageIndex(nextIndex);
    const nextId = stages[nextIndex].id;
    if (!cycledIds.includes(nextId)) {
      const updated = [...cycledIds, nextId];
      setCycledIds(updated);
      if (updated.length === stages.length) {
        onUnlockBadge("badge_engine");
      }
    }
  };

  const handleSelect = (idx: number) => {
    setIsPlaying(false); // Pause auto playback
    setActiveStageIndex(idx);
    const selectedId = stages[idx].id;
    if (!cycledIds.includes(selectedId)) {
      const updated = [...cycledIds, selectedId];
      setCycledIds(updated);
      if (updated.length === stages.length) {
        onUnlockBadge("badge_engine");
      }
    }
  };

  // Define Crank Radius and Connecting Rod Length for perfect, non-shifting visual alignment
  const R = 13; // Crank radius in unit coordinate pixels
  const L = 38; // Connecting rod length in unit coordinate pixels
  const crankCenterY = 105;

  const theta = (smoothAngle * Math.PI) / 180;

  // Slider-crank exact kinematics:
  // crank pin rotates around (50, 105)
  const crankPinX = 50 + R * Math.sin(theta);
  const crankPinY = crankCenterY - R * Math.cos(theta);

  // solve for wrist pin Y: distance squared = (crankPinX - wristPinX)^2 + (crankPinY - wristPinY)^2 = L^2
  const wristPinX = 50;
  const wristPinY = crankPinY - Math.sqrt(L * L - Math.pow(crankPinX - 50, 2));

  // Piston body coordinates anchored strictly relative to wrist pin
  const pistonWidth = 46;
  const pistonHeight = 35;
  const pistonX = 27;
  const pistonY = wristPinY - 18; // Keep centered with wrist pin

  // Dynamic engine buzz vibration amplitude proportional to RPM
  const isVibrating = isPlaying;
  const vibrateIntensity = throttleVal === 3 ? 1.0 : throttleVal === 2 ? 0.6 : 0.3;
  const jitterX = isVibrating ? Math.sin(smoothAngle * 5) * vibrateIntensity : 0;
  const jitterY = isVibrating ? Math.cos(smoothAngle * 5) * vibrateIntensity * 0.7 : 0;

  // On-screen sound visual effects label
  const getCycleFlashText = () => {
    if (activeStage.id === "intake") return "Sucking Fuel!";
    if (activeStage.id === "power") return "BOOM!";
    return "Smoke Escaping!";
  };

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-2xl p-6 shadow-xl">
      <div className="border-b border-gray-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
            2-Stroke Thermodynamic Cylinder Lab
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Explore the physics of a 2-stroke internal combustion engine. Toggle auto-play to run the cycle engine at variable RPM speeds!
          </p>
        </div>

        {/* Live System Speed Toggle */}
        <div className="flex items-center gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800 self-start md:self-auto">
          <button
            id="play-engine-toggle"
            onClick={togglePlay}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlaying
                ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse"
                : "bg-emerald-500 text-black hover:bg-emerald-400"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Auto-Play
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Visual Engine Cross-section (Left 6 Columns) */}
        <div className="lg:col-span-6 bg-[#0b0f19] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-start relative min-h-[420px] overflow-hidden">
          
          <div className="absolute top-3 left-3 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-[10px] font-mono text-gray-400 z-10">
            ENGINE BLOCK CROSS-SECTION
          </div>
          
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-orange-400 font-mono text-[10px] z-10">
            <Zap className="w-3" /> Spark: {activeStage.id === "power" ? "FIRING!" : "OFF"}
          </div>

          {/* Spark Ignition Text Flash Overlay */}
          {isPlaying && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black/80 px-2.5 py-1 rounded border border-gray-800 text-[9px] font-mono text-amber-500 tracking-wider uppercase animate-bounce z-10 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-red-500" />
              {getCycleFlashText()}
            </div>
          )}

          {/* Engine Cylinder Diagram with absolute Jitter applied */}
          <div 
            className="w-full max-w-[280px] h-[260px] relative mt-8 transition-transform duration-75"
            style={{ transform: `translate(${jitterX}px, ${jitterY}px)` }}
          >
            <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
              
              {/* Outer cylinder cooling fins */}
              <path d="M 25 15 L 20 15 M 25 25 L 18 25 M 25 35 L 15 35 M 25 45 L 15 45 M 25 55 L 18 55 M 25 65 L 20 65 M 25 75 L 21 75 M 25 85 L 22 85" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 75 15 L 80 15 M 75 25 L 82 25 M 75 35 L 85 35 M 75 45 L 85 45 M 75 55 L 82 55 M 75 65 L 80 65 M 75 75 L 79 75 M 75 85 L 78 85" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />

              {/* Engine cylinder wall casing (extended to y=100 and left open at the bottom so the skeleton can expand) */}
              <path d="M 25 100 L 25 13 A 3 3 0 0 1 28 10 L 72 10 A 3 3 0 0 1 75 13 L 75 100" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Spark Plug on top */}
              <rect x="45" y="0" width="10" height="10" fill="#374151" stroke="#9ca3af" strokeWidth="1" />
              <line x1="50" y1="5" x2="50" y2="10" stroke="#f59e0b" strokeWidth="2" />
              
              {/* Electric blue spark visual during Power Ignition code */}
              {activeStage.id === "power" && (
                <g>
                  {/* Neon lightning lines */}
                  <path d="M 45 11 L 49 14 L 51 11 L 55 14" stroke="#60a5fa" strokeWidth="3" strokeLinejoin="round" />
                  <circle cx="50" cy="12" r="3.5" className="fill-blue-400 animate-ping opacity-75" />
                </g>
              )}

              {/* Vents & Intake / Exhaust Ports */}
              {/* Exhaust Port on the Right (open or closed) */}
              {activeStage.id === "exhaust" ? (
                <>
                  <rect x="73" y="45" width="8" height="10" className="fill-orange-500/20 stroke-orange-400" strokeWidth="1" />
                  {/* Smoke exhaust escaping particles */}
                  <circle cx="82" cy="48" r="1.5" className="fill-gray-500 animate-ping" />
                  <circle cx="85" cy="45" r="2.5" className="fill-gray-600/80 animate-pulse" />
                </>
              ) : (
                <rect x="73" y="45" width="8" height="10" className="fill-gray-950 stroke-gray-800" strokeWidth="1" />
              )}

              {/* Intake Port on Left (open or closed) */}
              {activeStage.id === "intake" ? (
                <>
                  <rect x="19" y="55" width="8" height="10" className="fill-blue-500/20 stroke-blue-400" strokeWidth="1" />
                  {/* Incoming fuel-air blue droplets */}
                  <circle cx="16" cy="60" r="1.5" className="fill-blue-400 animate-pulse" />
                  <circle cx="21" cy="58" r="1" className="fill-blue-300" />
                </>
              ) : (
                <rect x="19" y="55" width="8" height="10" className="fill-gray-950 stroke-gray-800" strokeWidth="1" />
              )}

              {/* Combustion Fuel State Fill (Inside Cylinder - dynamically sized to follow the piston crown) */}
              {activeStage.id === "power" ? (
                // Exploding hot orange flame
                <rect x="26.5" y="11.5" width="47" height={pistonY - 11.5} rx="1.5" className="fill-orange-600/30 stroke-red-500/10" />
              ) : activeStage.id === "intake" ? (
                // Sucking blue pressurized cool charge
                <rect x="26.5" y="11.5" width="47" height={pistonY - 11.5} rx="1.5" className="fill-blue-600/20" />
              ) : (
                // Evacuating smoky exhaust green
                <rect x="26.5" y="11.5" width="47" height={pistonY - 11.5} rx="1.5" className="fill-emerald-600/10" />
              )}

              {/* Dynamic Piston & Realistic Connected Linkage */}
              <g>
                {/* Piston Body */}
                <rect x={pistonX} y={pistonY} width={pistonWidth} height={pistonHeight} rx="3" fill="#4d5562" stroke="#d1d5db" strokeWidth="1.5" />
                {/* Piston head compression seals */}
                <line x1={pistonX + 1} y1={pistonY + 4} x2={pistonX + pistonWidth - 1} y2={pistonY + 4} stroke="#1f2937" strokeWidth="1" />
                <line x1={pistonX + 1} y1={pistonY + 8} x2={pistonX + pistonWidth - 1} y2={pistonY + 8} stroke="#1f2937" strokeWidth="1" />
              </g>

              {/* Golden Fire combustion thrust arrow pointing force downward */}
              {activeStage.id === "power" && (
                <g className="text-red-500 animate-bounce">
                  <line x1="50" y1="18" x2="50" y2="30" stroke="currentColor" strokeWidth="3" />
                  <path d="M 46 26 L 50 30 L 54 26" fill="none" stroke="currentColor" strokeWidth="3" />
                </g>
              )}

              {/* Blue vacuum intake suction arrow pointing upward */}
              {activeStage.id === "intake" && (
                <g className="text-cyan-400 animate-bounce">
                  <line x1="50" y1="50" x2="50" y2="38" stroke="currentColor" strokeWidth="3" />
                  <path d="M 46 42 L 50 38 L 54 42" fill="none" stroke="currentColor" strokeWidth="3" />
                </g>
              )}

              {/* Wrist Pivot Center Pin */}
              <circle cx={wristPinX} cy={wristPinY} r="4" fill="#111827" stroke="#9ca3af" strokeWidth="1.5" />

              {/* Dynamic Pivot Linkage Rod */}
              <line 
                x1={wristPinX} 
                y1={wristPinY} 
                x2={crankPinX} 
                y2={crankPinY} 
                stroke="#9ca3af" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
              />

              {/* Round Flywheel Web */}
              <circle cx="50" cy={crankCenterY} r="14" fill="#111827" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="3,2" />
              
              {/* Rotating crank heavy spacer pin */}
              <circle cx={crankPinX} cy={crankPinY} r="3" fill="#f59e0b" stroke="#000" strokeWidth="0.5" />
              <line x1="50" y1={crankCenterY} x2={crankPinX} y2={crankPinY} stroke="#f59e0b" strokeWidth="2.5" />

              {/* Crank Axle Shaft center */}
              <circle cx="50" cy={crankCenterY} r="4.5" fill="#f59e0b" stroke="#4b5563" />

            </svg>
          </div>

          {/* Sparky Piston Stage Title indicator */}
          <div className="mt-6 flex flex-col items-center gap-1 w-full max-w-[280px]">
            <div className="flex items-center gap-2">
              {activeStage.pistonPosition === "up" ? (
                <ArrowUpCircle className="w-5 h-5 text-cyan-400 animate-pulse" />
              ) : (
                <ArrowDownCircle className="w-5 h-5 text-red-500 animate-pulse" />
              )}
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                Stroke: {activeStage.pistonPosition.toUpperCase()}STROKE PHASE
              </span>
            </div>

            {/* Simulated Live RPM Gauge Readout */}
            <div className="w-full bg-gray-950 p-2.5 rounded-lg border border-gray-900 mt-2 flex items-center justify-between font-mono text-[10px] text-gray-400">
              <span className="flex items-center gap-1 text-gray-500">
                <Gauge className="w-3.5 h-3.5" /> TELEMETRY
              </span>
              <span className="text-amber-500 font-bold">{isPlaying ? `${rpm} RPM` : "0 RPM (STANBY)"}</span>
              <span className="text-gray-500 truncate max-w-[100px]">{sound}</span>
            </div>
          </div>
        </div>

        {/* Explain mechanics and physics (Right 6 Columns) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Custom Interactive Tab list for Stages */}
            <div className="flex gap-2 p-1.5 bg-[#0b0f19] border border-gray-800 rounded-xl">
              {stages.map((stage, sIdx) => {
                const isActive = sIdx === activeStageIndex;
                const isCycled = cycledIds.includes(stage.id);
                return (
                  <button
                    key={stage.id}
                    id={`stage-tab-${stage.id}`}
                    onClick={() => handleSelect(sIdx)}
                    className={`flex-1 text-center py-2 px-1 text-[10px] md:text-xs font-bold font-mono rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-[#0b0f19] shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {isCycled && <span className="mr-0.5 text-xs">✓</span>}
                    {stage.id.toUpperCase()}
                  </button>
                );
              })}
            </div>

            {/* Dynamic RPM / Throttle Level Selector */}
            <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-amber-500 uppercase flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Gas Handle Throttle (RPM Speed)
                </h4>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase text-gray-300 bg-gray-900">
                  {throttleVal === 1 ? "IDLE SPEED" : throttleVal === 2 ? "CRUISING LOAD" : "REDLINE MAXIMUM!"}
                </span>
              </div>

              {/* Slider Controller */}
              <div className="space-y-2">
                <input
                  type="range"
                  id="engine-throttle-input"
                  min="1"
                  max="3"
                  value={throttleVal}
                  onChange={(e) => setThrottleVal(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-gray-800 rounded-lg outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500 px-1">
                  <span>Idle (1,450 RPM)</span>
                  <span>Cruise (4,800 RPM)</span>
                  <span>Redline (8,250 RPM)</span>
                </div>
              </div>

              {isPlaying && (
                <div className="bg-amber-950/20 border border-amber-900/10 p-2.5 rounded text-[11px] leading-relaxed text-amber-300 flex items-center gap-1.5 font-sans">
                  <Volume2 className="w-4 h-4 text-orange-400 flex-shrink-0 animate-bounce" />
                  <span>
                    <strong>Telemetry Warning:</strong> Going full redline throttles in heavy mud will trigger thermal exhaust friction stress! Always pace engine load.
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-[10px] text-amber-500 tracking-wider font-mono font-bold uppercase block mb-1">
                  Active Thermodynamic Phase
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                  {activeStage.name}
                </h3>
              </div>

              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
                {activeStage.description}
              </p>

              {/* Valve Vent Info block */}
              <div className="bg-[#0b0f19] border border-gray-900 p-3.5 rounded-xl font-mono text-xs">
                <div className="flex justify-between items-center text-gray-500 border-b border-gray-900 pb-1.5 mb-1.5">
                  <span>GAS PORTS MATRIX</span>
                  <span>STATUS</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Cylinder Chamber vents:</span>
                  <span className="font-bold text-cyan-400">{activeStage.ventStatus}</span>
                </div>
              </div>

              {/* Applied physical law box */}
              <div className="p-4 bg-cyan-950/20 border border-cyan-800/20 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs text-cyan-400 font-bold uppercase font-mono tracking-wide">
                    The Science & Engineering Behind It
                  </h4>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-sans">
                    {activeStage.physicsNotion}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <span className="text-[10px] text-gray-500 font-mono">
              🔄 Tracked completion: {cycledIds.length} / {stages.length} stages cycled
            </span>
            <button
              id="next-stroke-btn"
              onClick={handleNext}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-[#0b0f19] hover:text-white font-mono text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-115 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Ignite Next Cycle Phase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
