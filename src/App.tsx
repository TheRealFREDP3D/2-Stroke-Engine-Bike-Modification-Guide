import { useState } from "react";
import { MOTORS_HOTSPOTS, ENGINE_STAGES, SAFETY_QUIZ, WORKSHOP_ACHIEVEMENTS, ASSEMBLY_STEPS, VIDEO_GUIDES } from "./data";
import { DashboardHeader } from "./components/DashboardHeader";
import { BikeHotspots } from "./components/BikeHotspots";
import { EngineCycle } from "./components/EngineCycle";
import { AssemblyChecklist } from "./components/AssemblyChecklist";
import { SafetyQuiz } from "./components/SafetyQuiz";
import { VideoTutorials } from "./components/VideoTutorials";
import { ShieldAlert, Flame, Wrench, GraduationCap, ShieldCheck, Video } from "lucide-react";
import { AssemblyStep, Achievement } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"hotspots" | "engine" | "checklist" | "video" | "quiz">("hotspots");
  const [achievements, setAchievements] = useState<Achievement[]>(WORKSHOP_ACHIEVEMENTS);
  const [assemblySteps, setAssemblySteps] = useState<AssemblyStep[]>(ASSEMBLY_STEPS);

  const handleUnlockBadge = (badgeId: string) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === badgeId ? { ...a, status: "unlocked" } : a))
    );
  };

  const handleTaskToggle = (stepId: string, taskId: string) => {
    setAssemblySteps((prevSteps) => {
      const updated = prevSteps.map((step) => {
        if (step.id !== stepId) return step;
        return {
          ...step,
          subtasks: step.subtasks.map((task) => {
            if (task.id !== taskId) return task;
            return { ...task, done: !task.done };
          }),
        };
      });

      // Recalculate if all are complete
      const totalCount = updated.reduce((sum, s) => sum + s.subtasks.length, 0);
      const doneCount = updated.reduce((sum, s) => sum + s.subtasks.filter((t) => t.done).length, 0);
      if (doneCount === totalCount) {
        handleUnlockBadge("badge_checklist");
      }
      return updated;
    });
  };

  // Calculate overall assembly steps completion
  const totalTasks = assemblySteps.reduce((sum, s) => sum + s.subtasks.length, 0);
  const completedTasks = assemblySteps.reduce(
    (sum, s) => sum + s.subtasks.filter((t) => t.done).length,
    0
  );
  const assemblyProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Top Banner Warning */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-mono font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 relative z-50">
        <ShieldAlert className="w-4 h-4 animate-bounce" />
        <span>STUDENT SETUP PROTOCOL: Always wear safety eyeglasses and perform building exercises with adult parent supervision!</span>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        
        {/* Main Dashboard Badge Progress */}
        <DashboardHeader achievements={achievements} assemblyProgressPercent={assemblyProgressPercent} />

        {/* Tab Selection Row */}
        <div className="flex border-b border-gray-800 overflow-x-auto gap-2 scrollbar-none pb-px">
          <button
            id="tab-hotspots"
            onClick={() => setActiveTab("hotspots")}
            className={`py-3.5 px-5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "hotspots"
                ? "border-amber-500 text-amber-500 bg-amber-500/5 rounded-t-xl"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Stage 1: Safety Hotspots
          </button>
          
          <button
            id="tab-engine"
            onClick={() => setActiveTab("engine")}
            className={`py-3.5 px-5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "engine"
                ? "border-amber-500 text-amber-500 bg-amber-500/5 rounded-t-xl"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4" />
            Stage 2: 2-Stroke Engine Lab
          </button>

          <button
            id="tab-checklist"
            onClick={() => setActiveTab("checklist")}
            className={`py-3.5 px-5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "checklist"
                ? "border-amber-500 text-amber-500 bg-amber-500/5 rounded-t-xl"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Wrench className="w-4 h-4" />
            Stage 3: Assembly Checklist
          </button>

          <button
            id="tab-video"
            onClick={() => setActiveTab("video")}
            className={`py-3.5 px-5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "video"
                ? "border-amber-500 text-amber-500 bg-amber-500/5 rounded-t-xl"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" />
            Stage 4: Step-by-Step Videos
          </button>

          <button
            id="tab-quiz"
            onClick={() => setActiveTab("quiz")}
            className={`py-3.5 px-5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "quiz"
                ? "border-amber-500 text-amber-500 bg-amber-500/5 rounded-t-xl"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Stage 5: Builder Safety Quiz
          </button>
        </div>

        {/* Tab Contents */}
        <div className="transition-all duration-300">
          {activeTab === "hotspots" && (
            <BikeHotspots hotspots={MOTORS_HOTSPOTS} onUnlockBadge={handleUnlockBadge} />
          )}

          {activeTab === "engine" && (
            <EngineCycle stages={ENGINE_STAGES} onUnlockBadge={handleUnlockBadge} />
          )}

          {activeTab === "checklist" && (
            <AssemblyChecklist
              steps={assemblySteps}
              onTaskToggle={handleTaskToggle}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {activeTab === "video" && (
            <VideoTutorials
              videos={VIDEO_GUIDES}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {activeTab === "quiz" && (
            <SafetyQuiz questions={SAFETY_QUIZ} onUnlockBadge={handleUnlockBadge} />
          )}
        </div>

      </main>

      {/* Simplified, Beautiful Footer */}
      <footer className="border-t border-gray-905 bg-[#0b0f19] mt-16 py-8 px-4 text-center text-xs text-gray-500 select-none">
        <p>© Motorized Bike Safe-Builder Workshop — Created for Science Project Demonstrations.</p>
        <p className="mt-1">Safety First, Torque Second!</p>
      </footer>
    </div>
  );
}
