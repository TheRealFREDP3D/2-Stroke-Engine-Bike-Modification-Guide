import { useState } from "react";
import { MOTORS_HOTSPOTS, ENGINE_STAGES, SAFETY_QUIZ, WORKSHOP_ACHIEVEMENTS, ASSEMBLY_STEPS, VIDEO_GUIDES } from "./data";
import { MOTORS_HOTSPOTS_FR, ENGINE_STAGES_FR, SAFETY_QUIZ_FR, WORKSHOP_ACHIEVEMENTS_FR, ASSEMBLY_STEPS_FR, VIDEO_GUIDES_FR } from "./data_fr";
import { UI_TRANSLATIONS } from "./locales";
import { DashboardHeader } from "./components/DashboardHeader";
import { BikeHotspots } from "./components/BikeHotspots";
import { EngineCycle } from "./components/EngineCycle";
import { AssemblyChecklist } from "./components/AssemblyChecklist";
import { SafetyQuiz } from "./components/SafetyQuiz";
import { SolderChat } from "./components/SolderChat";
import { VideoTutorials } from "./components/VideoTutorials";
import { ShieldAlert, Flame, Wrench, GraduationCap, ShieldCheck, Video, MessageSquare } from "lucide-react";
import { AssemblyStep, Achievement } from "./types";

export default function App() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [activeTab, setActiveTab] = useState<"hotspots" | "engine" | "checklist" | "video" | "quiz" | "chat">("hotspots");
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

  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Top Banner Warning with Language toggler */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-mono py-2.5 px-4 flex flex-col sm:flex-row justify-between items-center gap-2 relative z-50 shadow-md">
        <div className="flex items-center gap-2 font-bold justify-center">
          <ShieldAlert className="w-4 h-4 animate-bounce shrink-0" />
          <span>{t.safety_test_banner}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-0.5 rounded cursor-pointer transition-all border font-bold text-[10px] ${
              lang === "en" ? "bg-white text-orange-650 border-white" : "bg-transparent text-white border-white/40 hover:bg-white/10"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("fr")}
            className={`px-2 py-0.5 rounded cursor-pointer transition-all border font-bold text-[10px] ${
              lang === "fr" ? "bg-white text-orange-650 border-white" : "bg-transparent text-white border-white/40 hover:bg-white/10"
            }`}
          >
            FR
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        
        {/* Main Dashboard Badge Progress */}
        <DashboardHeader achievements={achievements} assemblyProgressPercent={assemblyProgressPercent} lang={lang} />

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
            {t.tab_hotspots}
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
            {t.tab_engine}
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
            {t.tab_checklist}
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
            {t.tab_video}
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
            {t.tab_quiz}
          </button>

          <button
            id="tab-chat"
            onClick={() => setActiveTab("chat")}
            className={`py-3.5 px-5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "chat"
                ? "border-amber-500 text-amber-500 bg-amber-500/5 rounded-t-xl"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {t.tab_chat}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="transition-all duration-300">
          {activeTab === "hotspots" && (
            <BikeHotspots hotspots={lang === "fr" ? MOTORS_HOTSPOTS_FR : MOTORS_HOTSPOTS} onUnlockBadge={handleUnlockBadge} lang={lang} />
          )}

          {activeTab === "engine" && (
            <EngineCycle stages={lang === "fr" ? ENGINE_STAGES_FR : ENGINE_STAGES} onUnlockBadge={handleUnlockBadge} lang={lang} />
          )}

          {activeTab === "checklist" && (
            <AssemblyChecklist
              steps={assemblySteps}
              onTaskToggle={handleTaskToggle}
              onUnlockBadge={handleUnlockBadge}
              lang={lang}
            />
          )}

          {activeTab === "video" && (
            <VideoTutorials
              videos={lang === "fr" ? VIDEO_GUIDES_FR : VIDEO_GUIDES}
              onUnlockBadge={handleUnlockBadge}
              lang={lang}
            />
          )}

          {activeTab === "quiz" && (
            <SafetyQuiz questions={lang === "fr" ? SAFETY_QUIZ_FR : SAFETY_QUIZ} onUnlockBadge={handleUnlockBadge} lang={lang} />
          )}

          {activeTab === "chat" && (
            <SolderChat onUnlockBadge={handleUnlockBadge} lang={lang} />
          )}
        </div>

      </main>

      {/* Simplified, Beautiful Footer */}
      <footer className="border-t border-gray-950 bg-[#0b0f19] mt-16 py-8 px-4 text-center text-xs text-gray-500 select-none">
        <p>{t.footer_copyright}</p>
        <p className="mt-1">{t.footer_motto}</p>
      </footer>
    </div>
  );
}
