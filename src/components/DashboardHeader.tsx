import { ClipboardCheck, Flame, ShieldAlert, Award, Wrench, Tv } from "lucide-react";
import { Achievement } from "../types";

interface Props {
  achievements: Achievement[];
  assemblyProgressPercent: number;
}

export function DashboardHeader({ achievements, assemblyProgressPercent }: Props) {
  const getIcon = (name: string, isUnlocked: boolean) => {
    const cls = `w-8 h-8 ${isUnlocked ? "scale-110 duration-500 text-amber-400" : "opacity-40 text-gray-500 animate-pulse"}`;
    switch (name) {
      case "ClipboardCheck":
        return <ClipboardCheck className={`${cls} text-amber-400`} />;
      case "Flame":
        return <Flame className={`${cls} text-orange-500`} />;
      case "ShieldAlert":
        return <ShieldAlert className={`${cls} text-emerald-400`} />;
      case "Wrench":
        return <Wrench className={`${cls} text-cyan-400`} />;
      case "Tv":
        return <Tv className={`${cls} text-fuchsia-400`} />;
      default:
        return <Wrench className={`${cls}`} />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.status === "unlocked").length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-2xl p-6 md:p-8 shadow-xl max-w-7xl mx-auto mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
              School Project Workbench [14-Year-Old Safe Setup]
            </span>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold font-bold">
              Generic Engine Kit Guide
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight leading-tight">
            Motorized Bike <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Builder & Safety Lab</span>
          </h1>
          <p className="mt-3 text-gray-450 text-sm md:text-base max-w-2xl leading-relaxed">
            Welcome to the ultimate engineering companion! This guide helps you mount a small gas engine onto a mountain bike frame safely. 
            Learn <strong>friction</strong>, <strong>reduction ratios</strong>, and <strong>combustion mechanics</strong>, while earning workshop badges as your checklist progresses!
          </p>
        </div>

        {/* Dynamic Dual Metrics Area */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0 select-none">
          {/* Achievements Progress Circle */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center gap-4 flex-1 sm:flex-initial min-w-[250px]">
            <div className="relative flex items-center justify-center shrink-0">
              {/* SVGCircle progress indicator */}
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-gray-800"
                  strokeWidth="4.5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-amber-500 transition-all duration-1000 ease-out"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray={151}
                  strokeDashoffset={151 - (151 * progressPercent) / 100}
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-white">{progressPercent}%</span>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Workshop Badges</div>
              <div className="text-base font-bold text-white mb-0.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> {unlockedCount} / {achievements.length} Unlocked
              </div>
              <div className="text-[10px] text-gray-500">Earn badges inside tabs</div>
            </div>
          </div>

          {/* Assembly Checklist Progress Circle */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center gap-4 flex-1 sm:flex-initial min-w-[250px]">
            <div className="relative flex items-center justify-center shrink-0">
              {/* SVGCircle progress indicator */}
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-gray-800"
                  strokeWidth="4.5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray={151}
                  strokeDashoffset={151 - (151 * assemblyProgressPercent) / 100}
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-white">{assemblyProgressPercent}%</span>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Checklist Steps</div>
              <div className="text-base font-bold text-white mb-0.5 flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4 text-emerald-400" /> {assemblyProgressPercent}% Complete
              </div>
              <div className="text-[10px] text-gray-500">Track build check stages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {achievements.map((a) => {
          const isUnlocked = a.status === "unlocked";
          return (
            <div
              key={a.id}
              className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
                isUnlocked
                  ? "bg-gradient-to-br from-gray-900 to-gray-800 border-amber-500/50 shadow-md shadow-amber-500/5"
                  : "bg-gray-900/40 border-gray-850 opacity-60"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isUnlocked ? "bg-amber-500/10 border border-amber-500/20" : "bg-gray-800"
                }`}
              >
                {getIcon(a.icon, isUnlocked)}
              </div>
              <div className="overflow-hidden">
                <h4 className={`text-xs font-bold leading-tight ${isUnlocked ? "text-white" : "text-gray-400"}`}>
                  {a.title}
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-snug">
                  {a.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
