import { useState } from "react";
import { 
  Wrench, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  Award
} from "lucide-react";

interface BoltState {
  id: number;
  name: string;
  position: { x: number; y: number };
  currentTorque: number; // 0 to 100%
  snug: boolean; // snug tight (first pass 30%)
  final: boolean; // spec tight (second pass 100%)
}

export function TorqueGuide() {
  const initialBolts: BoltState[] = [
    { id: 1, name: "Bolt A (Top-Left)", position: { x: 28, y: 28 }, currentTorque: 0, snug: false, final: false },
    { id: 2, name: "Bolt B (Bottom-Right)", position: { x: 72, y: 72 }, currentTorque: 0, snug: false, final: false },
    { id: 3, name: "Bolt C (Top-Right)", position: { x: 72, y: 28 }, currentTorque: 0, snug: false, final: false },
    { id: 4, name: "Bolt D (Bottom-Left)", position: { x: 28, y: 72 }, currentTorque: 0, snug: false, final: false }
  ];

  const [bolts, setBolts] = useState<BoltState[]>(initialBolts);
  const [stepNumber, setStepNumber] = useState<number>(0); // 0 to 8 states of the star pattern sequence
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [wrenchRotation, setWrenchRotation] = useState<number>(0);
  const [lastClickedBoltId, setLastClickedBoltId] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Correct star sequence of bolt IDs for a 2-pass sequence:
  // First pass (Snug tightness to 30% to stabilize the metal bracket evenly)
  // 1. Bolt 1 (Top-Left)
  // 2. Bolt 2 (Bottom-Right) - diagonal cross
  // 3. Bolt 3 (Top-Right)
  // 4. Bolt 4 (Bottom-Left) - diagonal cross
  // Second pass (Final Torque Spec to 100%)
  // 5. Bolt 1 (Top-Left)
  // 6. Bolt 2 (Bottom-Right)
  // 7. Bolt 3 (Top-Right)
  // 8. Bolt 4 (Bottom-Left)
  const CORRECT_SEQUENCE = [1, 2, 3, 4, 1, 2, 3, 4];

  const playSynthesizedTone = (freq: number, duration: number, type: "sine" | "sawtooth" | "triangle" = "sine") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Browsers block sound until user gesture
    }
  };

  const handleBoltClick = (targetId: number) => {
    if (success) return;

    setErrorMessage(null);
    const expectedBoltId = CORRECT_SEQUENCE[stepNumber];

    if (targetId !== expectedBoltId) {
      // Mechanical penalty warning: uneven stress
      playSynthesizedTone(150, 0.25, "sawtooth");
      setErrorMessage(
        `Wrong Bolt! You attempted to tighten Bolt ${targetId} out of order. Doing so places asymmetric stress on the aluminum casing, which leads to hair-line stress cracks when the high-frequency 2-stroke vibration begins.`
      );
      return;
    }

    // Success step
    playSynthesizedTone(440 + stepNumber * 70, 0.18, "sine");
    setLastClickedBoltId(targetId);
    setWrenchRotation(prev => prev + 45);

    // Update bolt status
    const isFirstPass = stepNumber < 4;
    const nextBolts = bolts.map((b) => {
      if (b.id === targetId) {
        if (isFirstPass) {
          return { ...b, snug: true, currentTorque: 35 };
        } else {
          return { ...b, final: true, currentTorque: 100 };
        }
      }
      return b;
    });

    setBolts(nextBolts);
    const nextStep = stepNumber + 1;
    setStepNumber(nextStep);

    if (nextStep === 8) {
      setSuccess(true);
      playSynthesizedTone(1046, 0.4, "triangle");
    }
  };

  const handleReset = () => {
    setBolts(initialBolts);
    setStepNumber(0);
    setErrorMessage(null);
    setSuccess(false);
    setLastClickedBoltId(null);
    playSynthesizedTone(300, 0.15, "sine");
  };

  // Determine stress visual colors for the metal body gradient base on sequence correct actions
  // If user got an error, show a red spot near the wrong sides.
  const getBracketStressClass = () => {
    if (errorMessage) return "from-rose-900/40 to-slate-900 stroke-rose-500/30";
    if (success) return "from-emerald-950/30 via-emerald-900/10 to-slate-900 stroke-emerald-500/25";
    if (stepNumber > 4) return "from-cyan-950/20 to-slate-900 stroke-cyan-500/20";
    if (stepNumber > 0) return "from-amber-950/15 to-slate-900 stroke-amber-500/15";
    return "from-slate-900 to-slate-950 stroke-gray-800/40";
  };

  return (
    <div id="torque-combustion-guide" className="bg-[#111827] border border-[#374151] rounded-2xl p-5 md:p-6 shadow-xl mb-6 select-none animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-850 pb-4 mb-5 gap-3">
        <div>
          <span className="flex items-center gap-1.5 text-xs text-amber-400 font-mono tracking-widest uppercase font-semibold">
            <Wrench className="w-4 h-4 text-amber-500" />
            Star Sequence & Mechanical Strain
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white mt-1">
            Engine Mount Star-Pattern Torque Spec Classroom
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-gray-400 pointer-events-auto cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={() => setSoundEnabled(!soundEnabled)}
              className="rounded accent-amber-500 bg-gray-950 border-gray-850 cursor-pointer"
            />
            Mechanical Audio Tones
          </label>
          <button
            onClick={handleReset}
            className="p-1 px-2.5 bg-gray-900 hover:bg-gray-850 text-gray-300 rounded-lg text-[10px] font-mono border border-gray-800 uppercase flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset Sim
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Playfield Area Left (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-gray-850 rounded-xl p-4 flex flex-col items-center justify-between relative min-h-[350px] overflow-hidden">
          
          {/* Stress Warning Flasher */}
          {errorMessage && (
            <div className="absolute top-3 left-3 right-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2 text-[11px] rounded-lg flex items-start gap-1.5 z-20 animate-pulse leading-snug">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Medal */}
          {success && (
            <div className="absolute top-3 left-3 right-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 p-2 text-xs rounded-lg flex items-center justify-between gap-1.5 z-20">
              <span className="flex items-center gap-1.5 font-bold">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                STAR PATTERN COMPLETED: 1.2 Nm Uniform Tension Lock!
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
                PERFECT
              </span>
            </div>
          )}

          {/* Dynamic Instructions */}
          {!errorMessage && !success && (
            <div className="w-full bg-gray-950/80 p-2.5 border border-gray-900 rounded-lg text-center text-xs text-gray-400 max-w-sm mx-auto z-10 font-mono">
              {stepNumber < 4 ? (
                <span>
                  Pass 1: Click the next bolt diagonally to apply light{" "}
                  <strong className="text-amber-400 font-bold">Snug Torque (35%)</strong>!
                </span>
              ) : (
                <span>
                  Pass 2: Click the same sequence to crank down to{" "}
                  <strong className="text-cyan-400 font-bold">Specs final Torque (100%)</strong>!
                </span>
              )}
            </div>
          )}

          {/* Engine Mount Schematic with Bolts */}
          <div className="relative w-full max-w-[280px] h-[220px] my-6 flex items-center justify-center">
            
            {/* SVG Plate Layout representing aluminum frame mount V-plate */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="clamp-stress" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="transition-all duration-700" stopOpacity="0.45" />
                  <stop offset="100%" className="transition-all duration-700" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Bicycle central frame frame tube schematic behind bracket */}
              <rect x="42" y="5" width="16" height="90" rx="3.5" fill="#1f2937" stroke="#374151" strokeWidth="0.8" />

              {/* Stress Plate background */}
              <rect
                x="15"
                y="15"
                width="70"
                height="70"
                rx="14"
                className={`transition-all duration-700 fill-gray-900/70 border-2 ${getBracketStressClass()}`}
                strokeWidth="2.2"
              />

              {/* Star line guidelines */}
              <g className="transition-all duration-500" opacity={stepNumber > 0 ? "0.35" : "0.75"}>
                {/* diagonal 1 to 2 */}
                <line x1="28" y1="28" x2="72" y2="72" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                {/* lateral 2 to 3 */}
                <line x1="72" y1="72" x2="72" y2="28" stroke="#374151" strokeWidth="0.8" strokeDasharray="3 3" />
                {/* diagonal 3 to 4 */}
                <line x1="72" y1="28" x2="28" y2="72" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                {/* lateral 4 to 1 */}
                <line x1="28" y1="72" x2="28" y2="28" stroke="#374151" strokeWidth="0.8" strokeDasharray="3 3" />
              </g>

              {/* Guide arrows indicating progression pattern */}
              <path d="M 36 28 L 64 64" stroke="#f59e0b" strokeWidth="0.8" fill="none" opacity={stepNumber === 0 ? 0.8 : 0.08} />
              <path d="M 72 64 L 72 36" stroke="#f59e0b" strokeWidth="0.8" fill="none" opacity={stepNumber === 1 ? 0.8 : 0.08} />
              <path d="M 64 28 L 36 64" stroke="#f59e0b" strokeWidth="0.8" fill="none" opacity={stepNumber === 2 ? 0.8 : 0.08} />
              <path d="M 28 64 L 28 36" stroke="#f59e0b" strokeWidth="0.8" fill="none" opacity={stepNumber === 3 ? 0.8 : 0.08} />
            </svg>

            {/* Render 4 interactive click bolts */}
            {bolts.map((bolt) => {
              const isSelectedToClick = CORRECT_SEQUENCE[stepNumber] === bolt.id && !success;
              const torquePercentage = bolt.currentTorque;

              return (
                <button
                  key={bolt.id}
                  id={`block-bolt-${bolt.id}`}
                  onClick={() => handleBoltClick(bolt.id)}
                  style={{ left: `${bolt.position.x}%`, top: `${bolt.position.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  {/* Wiggle/Glow highlight indicator if bolt is current sequence model */}
                  {isSelectedToClick && (
                    <span className="absolute inset-0 h-10 w-10 -m-2 bg-amber-500/10 rounded-full animate-ping pointer-events-none"></span>
                  )}

                  {/* Circular torque gauge */}
                  <div className="relative flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        className="stroke-gray-800"
                        strokeWidth="3.2"
                        fill="#0b0f19"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        className={`transition-all duration-500 ease-out fill-transparent ${
                          bolt.final
                            ? "stroke-emerald-400"
                            : bolt.snug
                            ? "stroke-amber-400"
                            : "stroke-gray-700"
                        }`}
                        strokeWidth="3.2"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (113 * torquePercentage) / 100}
                      />
                    </svg>

                    {/* Actual threaded hex bolt center graphic */}
                    <div
                      className={`absolute rounded-full h-6 w-6 border-2 flex items-center justify-center transition-all ${
                        bolt.final
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                          : bolt.snug
                          ? "bg-amber-500/20 border-amber-400 text-amber-300 font-semibold"
                          : "bg-gray-900 border-gray-750 text-gray-500"
                      }`}
                    >
                      {/* Interactive bolt identifier label */}
                      <span className="text-[10px] font-mono font-bold">
                        {bolt.id}
                      </span>
                    </div>

                    {/* Inner rotate action wrench icon */}
                    {isSelectedToClick && (
                      <div 
                        className="absolute -top-3 -right-3 p-1 bg-amber-500 text-black rounded-md transform transition-transform duration-300 scale-90"
                        style={{ transform: `rotate(${wrenchRotation}deg) scale(0.9)` }}
                      >
                        <Wrench className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Absolute positioning detail note */}
                  <span className="absolute top-11.5 left-1/2 transform -translate-x-1/2 text-[8px] font-mono font-semibold whitespace-nowrap bg-gray-950 px-1 py-0.5 rounded border border-gray-800 text-gray-400 group-hover:text-white">
                    {torquePercentage === 0 ? "0%" : torquePercentage < 100 ? `${torquePercentage}% Snug` : "100% SPEC!"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Torque Progression Status Track */}
          <div className="w-full bg-gray-950/70 border border-gray-900 p-2.5 rounded-lg flex items-center justify-between text-[11px] font-mono z-10">
            <span className="text-gray-500 uppercase tracking-widest text-[9px]">Star Progression:</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((s_idx) => {
                const isActive = stepNumber === s_idx;
                const isPassed = stepNumber > s_idx;
                return (
                  <div
                    key={s_idx}
                    className={`h-2 text-[9px] font-bold px-1.5 rounded flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-amber-400 text-[#0b0f19] scale-110 font-bold"
                        : isPassed
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/35"
                        : "bg-gray-900 text-gray-600 border border-gray-950"
                    }`}
                  >
                    B{CORRECT_SEQUENCE[s_idx]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conceptual Teacher Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold rounded-md uppercase tracking-wider">
                Vibration Physics
              </span>
              <span className="text-[10px] text-gray-500 font-mono">ADULT ADVISOR NOTE</span>
            </div>

            <h4 className="text-sm font-bold text-white tracking-wide">
              Why Tighten Engine Mounts in a "Star Pattern"?
            </h4>

            <div className="text-xs text-Gray-300 space-y-3 leading-relaxed">
              <p>
                A high speed 2-stroke engine converts fuel energy into violent linear inertia (piston going up and down at up to 6,000 RPM). This generates intense radial mechanical vibrations.
              </p>
              <div className="p-3 bg-gray-950/35 border border-gray-850 rounded-xl space-y-2 text-gray-400 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-rose-400">🚨</span>
                  <span>
                    <strong className="text-gray-300 font-semibold">Uneven Clamping Warn:</strong> fully tightening a single bolt first tilts the steel mounting adapter plates, introducing high shear focus stress points and misaligning thread runs.
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-cyan-400">💡</span>
                  <span>
                    <strong className="text-gray-300 font-semibold">Star Sequence Cure:</strong> By alternating diagonally, you distribute compression forces uniformly. Doing so prevents casting fractures and frame-crimping slips.
                  </span>
                </div>
              </div>
              <p>
                For premium security, mechanics recommend a <strong className="text-white">dual-pass process</strong>. First snug all bolts to 35% tension so the surfaces square up, then apply full specified standard torque (usually <strong>18–22 Nm</strong>) in the identical diagonal pattern.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-gray-850 text-xs text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle className={`w-3.5 h-3.5 ${success ? "text-emerald-500" : "text-gray-700"}`} />
              Classroom state: {success ? "COMPLETED" : "IN PROGRESS"}
            </span>
            <span className="font-mono text-[9px] text-gray-600">UNIFORM_TENSION_VERIFY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
