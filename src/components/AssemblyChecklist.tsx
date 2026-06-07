import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { AssemblyStep } from "../types";
import { MOTORS_HOTSPOTS } from "../data";
import { ASSEMBLY_STEPS_FR } from "../data_fr";
import { ASSEMBLY_STEPS } from "../data";
import { UI_TRANSLATIONS } from "../locales";
import { generateAssemblyPDF } from "../utils/pdfGenerator";
import { TorqueGuide } from "./TorqueGuide";
import { 
  CheckSquare, 
  Square, 
  Shield, 
  Wrench, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Check,
  FileText,
  Printer,
  Calendar,
  User,
  PenSquare,
  ChevronDown,
  ChevronUp,
  Download,
  Glasses,
  Scissors,
  Droplet,
  Zap,
  Hammer,
  Layers
} from "lucide-react";

const TOOL_CONFIGS: Record<string, { icon: any; color: string }> = {
  safety_glasses: { icon: Glasses, color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  wrench_10mm: { icon: Wrench, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  wrench_12mm: { icon: Wrench, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  wrench_14mm: { icon: Wrench, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  torque_wrench: { icon: Wrench, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  spoke_wrench: { icon: Wrench, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  allen_keys: { icon: Wrench, color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" },
  scissors: { icon: Scissors, color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
  chain_breaker: { icon: Scissors, color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
  pliers: { icon: Wrench, color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
  screwdriver: { icon: Wrench, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  electrical_tape: { icon: Layers, color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" },
  measuring_cup: { icon: Droplet, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  spark_plug_socket: { icon: Zap, color: "text-red-400 bg-red-400/10 border-red-400/20" },
  rag: { icon: FileText, color: "text-gray-400 bg-gray-400/10 border-gray-400/20" },
  degreaser: { icon: Droplet, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
  threadlocker: { icon: Droplet, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  rubber_shims: { icon: Layers, color: "text-gray-400 bg-gray-400/10 border-gray-400/20" },
};

interface Props {
  steps: AssemblyStep[];
  onTaskToggle: (stepId: string, taskId: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  lang: "en" | "fr";
}

export function AssemblyChecklist({ steps, onTaskToggle, onUnlockBadge, lang }: Props) {
  const [activeStepId, setActiveStepId] = useState<string>(steps[0].id);

  const t = UI_TRANSLATIONS[lang];
  const currentLangSteps = lang === "fr" ? ASSEMBLY_STEPS_FR : ASSEMBLY_STEPS;
  const localizedSteps = currentLangSteps.map((localizedStep) => {
    const parentStep = steps.find((s) => s.id === localizedStep.id) || localizedStep;
    return {
      ...localizedStep,
      subtasks: localizedStep.subtasks.map((localizedSub) => {
        const parentSub = parentStep.subtasks.find((sub) => sub.id === localizedSub.id);
        return {
          ...localizedSub,
          done: parentSub ? parentSub.done : false
        };
      })
    };
  });

  // Exporter state
  const [showExporter, setShowExporter] = useState(false);
  const [projectName, setProjectName] = useState(() => localStorage.getItem("motorized_project_name") || "Cruiser 2-Stroke Conversion");
  const [builderName, setBuilderName] = useState(() => localStorage.getItem("motorized_builder_name") || "Student & Parent Team");
  const [dateStr, setDateStr] = useState(() => localStorage.getItem("motorized_build_date") || new Date().toISOString().split("T")[0]);
  const [fieldNotes, setFieldNotes] = useState(() => localStorage.getItem("motorized_field_notes") || "");
  const [isExporting, setIsExporting] = useState(false);

  // Calculate stats
  const totalTasks = localizedSteps.reduce((sum, s) => sum + s.subtasks.length, 0);
  const completedTasks = localizedSteps.reduce(
    (sum, s) => sum + s.subtasks.filter((t) => t.done).length,
    0
  );
  
  const completionPercent = Math.round((completedTasks / totalTasks) * 100);

  const activeStep = localizedSteps.find((s) => s.id === activeStepId) || localizedSteps[0];

  const fireCelebrationConfetti = () => {
    // 1st wave left
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#ffffff"],
    });
    // 1st wave right
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#ffffff"],
    });

    // 2nd wave center (with small delay)
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#3b82f6", "#fa5252", "#ffffff"],
      });
    }, 300);
  };

  // Monitor checklist completions and trigger auto-confetti burst
  useEffect(() => {
    if (completionPercent === 100) {
      const shownCelebrationBefore = sessionStorage.getItem("checklist_celebrated");
      if (!shownCelebrationBefore) {
        fireCelebrationConfetti();
        sessionStorage.setItem("checklist_celebrated", "true");
      }
    } else {
      // If a task is deselected, reset the flag to allow celebrated satisfaction once re-completed
      sessionStorage.removeItem("checklist_celebrated");
    }
  }, [completionPercent]);

  const updateProjectName = (val: string) => {
    setProjectName(val);
    localStorage.setItem("motorized_project_name", val);
  };
  const updateBuilderName = (val: string) => {
    setBuilderName(val);
    localStorage.setItem("motorized_builder_name", val);
  };
  const updateDateStr = (val: string) => {
    setDateStr(val);
    localStorage.setItem("motorized_build_date", val);
  };
  const updateFieldNotes = (val: string) => {
    setFieldNotes(val);
    localStorage.setItem("motorized_field_notes", val);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      generateAssemblyPDF({
        projectName,
        builderName,
        dateStr,
        fieldNotes,
        steps,
        hotspots: MOTORS_HOTSPOTS,
        completionPercent,
        totalTasks,
        completedTasks,
      });
      setIsExporting(false);
    }, 1200);
  };

  const appendNotePreset = (presetText: string) => {
    const updatedNotes = fieldNotes ? `${fieldNotes}\n- ${presetText}` : `- ${presetText}`;
    updateFieldNotes(updatedNotes);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Medium":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "Challenging":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Supervised":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div id="assembly-checklist-panel" className="bg-[#111827] border border-[#374151] rounded-2xl p-6 shadow-xl">
      {/* Mini Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-5 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-500" />
            Interactive Assembly Workbook
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Carefully log your progression. Every fastener matters! Keep your safety eyewear snug.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="w-full sm:w-auto min-w-[200px] bg-gray-900 border border-gray-800 rounded-xl p-3">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="text-gray-400">BUILD PROGRESS</span>
            <span className="text-amber-400 font-bold">{completedTasks} / {totalTasks} Tasks ({completionPercent}%)</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* PDF Documentation & Print Export Center */}
      <div className="mb-8 bg-gray-900/40 border border-gray-800/80 rounded-2xl p-4 md:p-5 transition-all duration-300">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm md:text-base font-sans font-bold text-white flex items-center gap-2">
                Project Report & PDF Documentation Exporter
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
                  PDF Export
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Generate and download a certified laboratory report of your build and safety checklist for sign-off.
              </p>
            </div>
          </div>
          
          <button
            id="toggle-pdf-center-btn"
            onClick={() => setShowExporter(!showExporter)}
            className="px-4 py-2 bg-gray-850 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-xs text-gray-200 font-sans font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95"
          >
            {showExporter ? (
              <>
                <ChevronUp className="w-4 h-4 text-amber-400" />
                Hide Control Panel
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 text-amber-500" />
                Configure PDF Report ({completionPercent}% Ready)
              </>
            )}
          </button>
        </div>

        {showExporter && (
          <div className="mt-6 pt-5 border-t border-gray-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
            {/* Form Fields Left (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1">
                Report Metadata Settings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project Name Field */}
                <div>
                  <label className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider block mb-1.5">
                    Scientific Project Name
                  </label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
                    <input
                      id="pdf-project-name-input"
                      type="text"
                      className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-100 placeholder-gray-600 font-sans outline-none transition-all"
                      placeholder="e.g. Cruiser 2-Stroke Conversion"
                      value={projectName}
                      onChange={(e) => updateProjectName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Lead Builder(s) Field */}
                <div>
                  <label className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider block mb-1.5">
                    Lead Builders / Team Names
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
                    <input
                      id="pdf-builder-name-input"
                      type="text"
                      className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-100 placeholder-gray-600 font-sans outline-none transition-all"
                      placeholder="e.g. Student & Parent"
                      value={builderName}
                      onChange={(e) => updateBuilderName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Build Log Date Field */}
              <div>
                <label className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider block mb-1.5">
                  Compilation / Logging Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
                  <input
                    id="pdf-date-input"
                    type="date"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-100 placeholder-gray-600 font-mono outline-none transition-all"
                    value={dateStr}
                    onChange={(e) => updateDateStr(e.target.value)}
                  />
                </div>
              </div>

              {/* Journal Notes Field */}
              <div>
                <label className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider block mb-1.5">
                  Builder's Field Notes & Safety Observations
                </label>
                <div className="relative">
                  <PenSquare className="absolute left-3 top-3 w-4 h-4 text-gray-600" />
                  <textarea
                    id="pdf-field-notes-textarea"
                    rows={4}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 placeholder-gray-650 font-sans outline-none transition-all resize-none leading-relaxed"
                    placeholder="Describe custom tolerances, engine heat shims, spark gaps, compression fits or personal lessons learned in this motorized project..."
                    value={fieldNotes}
                    onChange={(e) => updateFieldNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">
                  Click to Insert Quick Journal presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    id="preset-btn-sprocket"
                    onClick={() => appendNotePreset("Adjusted all 9 sprocket bolts in cross-star progression; checked alignment with radial runout indicators, zero off-center wiggle.")}
                    className="text-[10px] px-2.5 py-1.5 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white rounded-lg transition-all cursor-pointer active:scale-95 hover:bg-gray-850"
                  >
                    🔍 Sprocket Tune
                  </button>
                  <button
                    type="button"
                    id="preset-btn-fuel"
                    onClick={() => appendNotePreset("Accurately mixed synthetic 2-cycle lubricant with regular gas at a pristine 40:1 break-in ratio to prevent mechanical lockup.")}
                    className="text-[10px] px-2.5 py-1.5 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white rounded-lg transition-all cursor-pointer active:scale-95 hover:bg-gray-850"
                  >
                    🧪 Gas/Oil ratio
                  </button>
                  <button
                    type="button"
                    id="preset-btn-resonance"
                    onClick={() => appendNotePreset("Sealed the V-frame metal mounts with rubber damping templates to prevent body damage and decouple high-RPM harmonics.")}
                    className="text-[10px] px-2.5 py-1.5 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white rounded-lg transition-all cursor-pointer active:scale-95 hover:bg-gray-850"
                  >
                    🔒 Frame Mounts
                  </button>
                  <button
                    type="button"
                    id="preset-btn-chain"
                    onClick={() => appendNotePreset("Tightened roller tensioner plate and verified chain sag holds snugly at precisely 1/2 inch under push testing.")}
                    className="text-[10px] px-2.5 py-1.5 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white rounded-lg transition-all cursor-pointer active:scale-95 hover:bg-gray-850"
                  >
                    ⚙️ Chain Tension
                  </button>
                </div>
              </div>
            </div>

            {/* Document Preview & triggers Right (5 cols) */}
            <div className="md:col-span-5 bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-3 text-center">
                  Live Report Layout Sheet
                </h4>
                
                {/* Schematic representation of 2-page document */}
                <div className="space-y-3">
                  {/* Page 1 Mini Mock */}
                  <div className="bg-gray-900 rounded-lg p-2.5 border border-gray-850 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <span className="text-gray-300 font-mono">Page 1: Project Profile & Hotspots</span>
                    </div>
                    <span className="text-gray-500 font-mono">Page 1</span>
                  </div>

                  {/* Page 2 Mini Mock */}
                  <div className="bg-gray-900 rounded-lg p-2.5 border border-gray-850 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-gray-300 font-mono">Page 2: Checklist Logs & Sign-offs</span>
                    </div>
                    <span className="text-gray-500 font-mono">Page 2</span>
                  </div>

                  {/* Interactive status meter */}
                  <div className="mt-4 border-t border-gray-900 pt-3 space-y-1.5 text-[11px] text-gray-400">
                    <div className="flex justify-between items-center">
                      <span>Verified Checkpoints:</span>
                      <span className="font-mono text-gray-200">{completedTasks} / {totalTasks} items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Safety Precautions:</span>
                      <span className="font-mono text-emerald-400 font-semibold">6 System Checks Ready</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Certification Sign-off:</span>
                      <span className="font-mono text-cyan-400">Double Signature Panel</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Export Button */}
              <div className="mt-6 pt-4 border-t border-gray-900">
                <button
                  type="button"
                  id="pdf-download-action-btn"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className={`w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer transition-all active:scale-[0.98] ${
                    isExporting ? "opacity-80 pointer-events-none brightness-90" : "hover:brightness-110"
                  }`}
                >
                  {isExporting ? (
                    <>
                      <Printer className="w-4 h-4 animate-spin text-white" />
                      Formatting Documentation...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export Printable PDF Summary
                    </>
                  )}
                </button>
                <span className="text-[9px] text-gray-500 font-mono text-center block mt-2 leading-relaxed">
                  Generates an A4 PDF complete with branding metadata, safety protocols, logged assembly steps, and adult advisor sign-off blocks.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Visual Guide to Torque Specs and Star Pattern tightening */}
      <TorqueGuide lang={lang} />

      {/* Main split workbench layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Selector Left Rail */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs text-gray-500 font-mono tracking-widest block mb-2 uppercase">Mounting Stages</span>
          {localizedSteps.map((step) => {
            const stepCompletedCount = step.subtasks.filter((t) => t.done).length;
            const isStepAllDone = stepCompletedCount === step.subtasks.length;
            const isSelected = step.id === activeStepId;

            return (
              <button
                key={step.id}
                id={`step-btn-${step.id}`}
                onClick={() => setActiveStepId(step.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-gradient-to-r from-gray-900 to-gray-800 border-amber-500/80 text-white shadow-md shadow-amber-500/5 translate-x-1"
                    : "bg-gray-900/56 border-gray-800 text-gray-300 hover:bg-gray-900/80 hover:border-gray-700"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-gray-500 block">PHASE {step.id.replace("step", "")}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getDifficultyColor(step.difficulty)} font-semibold font-mono`}>
                      {step.difficulty}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold truncate pr-2">{step.title}</h4>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-16 bg-gray-800 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1"
                        style={{ width: `${(stepCompletedCount / step.subtasks.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {stepCompletedCount}/{step.subtasks.length} Checkpoints
                    </span>
                  </div>
                </div>
                {isStepAllDone ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400 stroke-[3px]" />
                  </span>
                ) : (
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-amber-400 rotate-90" : "text-gray-500"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Step Active Panel */}
        <div className="lg:col-span-8 bg-gray-900/60 border border-gray-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            {/* Header / Difficulty Badge */}
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-800 pb-4 mb-4">
              <div>
                <span className="text-xs text-amber-500 font-mono tracking-wider uppercase font-semibold">
                  {activeStep.phase} Mode
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  {activeStep.title}
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-mono font-medium ${getDifficultyColor(activeStep.difficulty)}`}>
                🔧 Complexity: {activeStep.difficulty}
              </span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {activeStep.description}
            </p>

            {/* Subtasks checklist */}
            <div className="space-y-3 mb-6">
              <span className="text-xs text-gray-500 font-mono tracking-widest block uppercase">Interactive Tasks Checklist</span>
              {activeStep.subtasks.map((task) => (
                <button
                  key={task.id}
                  id={`task-toggle-${task.id}`}
                  onClick={() => onTaskToggle(activeStep.id, task.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3.5 group ${
                    task.done
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : "bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700 hover:bg-gray-900/80"
                  }`}
                >
                  <span className="mt-0.5 shrink-0 transition-transform group-active:scale-95 duration-200">
                    {task.done ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-600 group-hover:text-gray-400" />
                    )}
                  </span>
                  <div className="flex-1 text-sm leading-relaxed">
                    <span className={task.done ? "line-through text-gray-500 block" : "block text-white"}>
                      {task.text}
                    </span>
                    {task.tools && task.tools.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="text-[10px] text-gray-500 font-mono">
                          {(t as any).checklist_required_tools || "Required Tools:"}
                        </span>
                        {task.tools.map((toolId) => {
                          const config = TOOL_CONFIGS[toolId] || { icon: Wrench, color: "text-gray-400 bg-gray-400/10 border-gray-400/20" };
                          const IconComp = config.icon;
                          const toolLabel = (t as any)[`tool_${toolId}`] || toolId;
                          return (
                            <div
                              key={toolId}
                              className={`relative group/tool flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono select-none ${config.color}`}
                              title={toolLabel}
                            >
                              <IconComp className="w-3 h-3 shrink-0" />
                              <span>{toolLabel}</span>
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tool:block z-45 bg-gray-950 border border-gray-800 text-white text-[10px] px-2.5 py-1 rounded-md shadow-2xl tracking-wide font-sans whitespace-nowrap">
                                🔧 {toolLabel}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lower Informational Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t border-gray-800 pt-5">
            {/* Sparky's Wise Tip */}
            <div className="bg-amber-950/10 border border-amber-900/30 rounded-xl p-4 flex gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs text-amber-400 font-bold uppercase font-mono tracking-wide">Sparky's Wise Tip</h5>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {activeStep.sparkyTip}
                </p>
              </div>
            </div>

            {/* Core Mechanic Theory */}
            <div className="bg-cyan-950/10 border border-cyan-900/30 rounded-xl p-4 flex gap-3">
              <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs text-cyan-400 font-bold uppercase font-mono tracking-wide">Mechanics Classroom</h5>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {activeStep.mechanicConcept}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion congratulations */}
      {completionPercent === 100 && (
        <div className="mt-8 bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-500/30 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce-slow">
          <div className="flex items-center gap-3.5">
            <span className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-2xl">
              🏆
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Full Mechanical Assembly Checklist Completed!</h3>
              <p className="text-xs text-gray-400 mt-0.5 md:max-w-xl">
                Whoa! You have bolted down the frame blocks, centered the rear drive sprocket, piped gravity fuel siphons, and synchronized clutch sliding. You earned the <strong>Master Assembler Badge</strong>!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <button
              id="confetti-celebration-btn"
              onClick={fireCelebrationConfetti}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 border border-amber-400/20 text-black font-sans text-xs font-bold rounded-lg uppercase tracking-wider hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Celebrate Again
            </button>
            <button
              id="badge-claim-btn"
              onClick={() => onUnlockBadge("badge_checklist")}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-mono text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              Claim Badge Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
