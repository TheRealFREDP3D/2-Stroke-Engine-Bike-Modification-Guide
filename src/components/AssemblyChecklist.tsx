import { useState } from "react";
import { AssemblyStep } from "../types";
import { CheckSquare, Square, Shield, Wrench, Sparkles, BookOpen, ChevronRight, Check } from "lucide-react";

interface Props {
  steps: AssemblyStep[];
  onTaskToggle: (stepId: string, taskId: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export function AssemblyChecklist({ steps, onTaskToggle, onUnlockBadge }: Props) {
  const [activeStepId, setActiveStepId] = useState<string>(steps[0].id);

  // Calculate stats
  const totalTasks = steps.reduce((sum, s) => sum + s.subtasks.length, 0);
  const completedTasks = steps.reduce(
    (sum, s) => sum + s.subtasks.filter((t) => t.done).length,
    0
  );
  
  const completionPercent = Math.round((completedTasks / totalTasks) * 100);

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];

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

      {/* Main split workbench layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Selector Left Rail */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs text-gray-500 font-mono tracking-widest block mb-2 uppercase">Mounting Stages</span>
          {steps.map((step) => {
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
                    <span className={task.done ? "line-through text-gray-500" : ""}>
                      {task.text}
                    </span>
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
          <button
            id="badge-claim-btn"
            onClick={() => onUnlockBadge("badge_checklist")}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-mono text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
          >
            Claim Badge Code
          </button>
        </div>
      )}
    </div>
  );
}
