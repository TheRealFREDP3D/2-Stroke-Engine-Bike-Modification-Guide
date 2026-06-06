import { useState } from "react";
import { Hotspot } from "../types";
import { ShieldCheck, Info, Sparkles, AlertOctagon, CheckCircle } from "lucide-react";

interface Props {
  hotspots: Hotspot[];
  onUnlockBadge: (badgeId: string) => void;
}

export function BikeHotspots({ hotspots, onUnlockBadge }: Props) {
  const [selectedId, setSelectedId] = useState<string>("brakes");
  const [visitedIds, setVisitedIds] = useState<string[]>(["brakes"]);

  const selectedHotspot = hotspots.find((h) => h.id === selectedId) || hotspots[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (!visitedIds.includes(id)) {
      const nextVisited = [...visitedIds, id];
      setVisitedIds(nextVisited);
      if (nextVisited.length === hotspots.length) {
        onUnlockBadge("badge_inspect");
      }
    }
  };

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-2xl p-6 shadow-xl">
      <div className="border-b border-gray-800 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-sans font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
          Interactive 3D Chassis Safety Inspection
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Select or hover each critical hardware node on the frame to audit mechanical safety warnings before starting your build journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Interactive Schematic Frame (Left 7 cols) */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-gray-800 rounded-xl relative p-4 flex flex-col items-center justify-center min-h-[350px] overflow-hidden group">
          <div className="absolute top-3 left-3 bg-gray-900/85 backdrop-blur-md px-3 py-1 text-[10px] font-mono text-gray-400 uppercase rounded-full border border-gray-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Live Diagram Audit Gauge
          </div>

          <div className="absolute top-3 right-3 bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-mono text-amber-400 rounded-full">
            Inspected: {visitedIds.length} / {hotspots.length}
          </div>

          {/* Bike SVG Vector Diagram */}
          <div className="relative w-full max-w-[500px] h-full flex items-center justify-center py-6">
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
              {/* Spokes indicator */}
              <circle cx="15" cy="45" r="7.5" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 3" />
              
              {/* Front Wheel */}
              <circle cx="85" cy="45" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
              <circle cx="85" cy="45" r="9.2" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="85" cy="45" r="1.5" fill="currentColor" />
              {/* Spokes indicator */}
              <circle cx="85" cy="45" r="7.5" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 3" />

              {/* Rear Sprocket representation */}
              <circle cx="15" cy="45" r="4" className="text-amber-500/25 stroke-amber-500/60" strokeWidth="1.2" />

              {/* Handlebar Stem and Forks */}
              <line x1="85" y1="45" x2="75" y2="18" stroke="currentColor" strokeWidth="1.2" />
              <line x1="75" y1="18" x2="70" y2="17" stroke="currentColor" strokeWidth="1.5" />

              {/* Main Frame Triangle */}
              {/* Rear hub to Bottom Bracket */}
              <line x1="15" y1="45" x2="48" y2="45" stroke="currentColor" strokeWidth="1.4" />
              {/* Bottom Bracket to seatpost */}
              <line x1="48" y1="45" x2="44" y2="24" stroke="currentColor" strokeWidth="1.4" />
              {/* Seatpost down to Rear hub */}
              <line x1="44" y1="24" x2="15" y2="45" stroke="currentColor" strokeWidth="1.2" />
              {/* Bottom Bracket up to Headtube */}
              <line x1="48" y1="45" x2="75" y2="22" stroke="currentColor" strokeWidth="1.4" />
              {/* Headtube down to seatpost (Toptube) */}
              <line x1="75" y1="22" x2="44" y2="24" stroke="currentColor" strokeWidth="1.4" />

              {/* Seat */}
              <path d="M 40 22 Q 44 21 48 23" stroke="currentColor" strokeWidth="2.5" />

              {/* Engine Block Block Schematic */}
              <rect x="42" y="38" width="10" height="7" rx="1.5" className="fill-gray-900 stroke-amber-500/40" strokeWidth="1" />
              {/* Exhaust line */}
              <path d="M 48 44 Q 52 50 64 50" stroke="currentColor" strokeWidth="1.5" />
              <rect x="64" y="48.5" width="10" height="3" rx="0.5" stroke="currentColor" strokeWidth="0.8" />

              {/* Fuel Tank Outline */}
              <path d="M 46 21 C 52 20, 60 20, 68 22 C 60 25, 52 25, 46 21 Z" className="fill-cyan-950/20 stroke-cyan-500/40" strokeWidth="1" />

              {/* Chain Links */}
              <line x1="46" y1="42" x2="15" y2="44" className="stroke-amber-400/40" strokeWidth="0.7" strokeDasharray="3 2" />
              <line x1="46" y1="44" x2="15" y2="46" className="stroke-amber-400/40" strokeWidth="0.7" strokeDasharray="3 2" />
            </svg>

            {/* Hotspots Absolute Coordinates */}
            {hotspots.map((spot) => {
              const isSelected = spot.id === selectedId;
              const hasVisited = visitedIds.includes(spot.id);
              return (
                <button
                  key={spot.id}
                  id={`hotspot-btn-${spot.id}`}
                  onClick={() => handleSelect(spot.id)}
                  style={{ left: `${spot.coords.x}%`, top: `${spot.coords.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group/btn z-10"
                >
                  {/* Outer waves */}
                  <span
                    className={`absolute inline-flex h-8 h-8 w-8 w-8 rounded-full opacity-60 transition-transform duration-500 scale-100 ${
                      isSelected
                        ? "animate-ping bg-amber-400"
                        : hasVisited
                        ? "bg-emerald-500/30 group-hover/btn:animate-ping"
                        : "bg-rose-500/35 animate-pulse"
                    }`}
                  ></span>

                  {/* Inner Core */}
                  <span
                    className={`relative inline-flex rounded-full h-4.5 w-4.5 border-2 items-center justify-center text-[9px] font-mono font-bold font-sans transition-all duration-300 ${
                      isSelected
                        ? "bg-amber-400 text-[#0b0f19] border-white scale-120 shadow-lg shadow-amber-400/20"
                        : hasVisited
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : "bg-rose-600 text-white border-rose-450 hover:bg-rose-500"
                    }`}
                  >
                    {hasVisited ? "✓" : "!"}
                  </span>

                  {/* Tooltip on Hover */}
                  <span className="pointer-events-none absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-gray-750 text-white text-[10px] py-1 px-2.5 rounded font-mono font-semibold whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                    {spot.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prompt warning of unvisited */}
          <div className="w-full text-center py-2 px-4 bg-gray-950/40 border-t border-gray-900/60 flex items-center justify-between text-xs font-mono text-gray-500 mt-auto">
            <span>💡 Click glowing points to examine technical hazards!</span>
            <span>{visitedIds.length === hotspots.length ? "🛠️ ALL AUDITED" : "❌ PENDING NODES"}</span>
          </div>
        </div>

        {/* Selected Node Inspector Details Sidebar (Right 5 cols) */}
        <div className="lg:col-span-5 bg-gray-900/40 border border-gray-800 rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-3.5">
              <div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    selectedHotspot.importance === "CRITICAL"
                      ? "bg-rose-600/10 text-rose-450 border-rose-500/30"
                      : "bg-amber-600/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {selectedHotspot.importance} NODE
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1.5 leading-tight">
                  {selectedHotspot.name}
                </h3>
              </div>
            </div>

            <div className="bg-gray-950/40 border border-gray-900 rounded-xl p-3.5 mb-5 space-y-2">
              <h4 className="text-xs text-amber-500 font-bold font-mono tracking-wider flex items-center gap-1.5 uppercase">
                <AlertOctagon className="w-4 h-4 text-amber-500" />
                The Danger Scenario
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed md:text-sm">
                {selectedHotspot.description}
              </p>
            </div>

            {/* Mechanics & Safety Checklists inside panel */}
            <div className="space-y-4">
              {/* Safety Shield block */}
              <div className="flex gap-3">
                <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0 h-fit">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Sparky's Safety Protocol</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {selectedHotspot.safetyProtocol}
                  </p>
                </div>
              </div>

              {/* Technical Classroom physics block */}
              <div className="flex gap-3">
                <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 shrink-0 h-fit">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Mechanics Physics Note</h4>
                  <p className="text-xs text-gray-450 mt-1 leading-relaxed font-mono">
                    {selectedHotspot.mechanicNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className={`w-4 h-4 ${visitedIds.includes(selectedHotspot.id) ? "text-emerald-500" : "text-gray-700"}`} />
              Node audit: {visitedIds.includes(selectedHotspot.id) ? "COMPLETE" : "PENDING"}
            </span>
            <span className="font-mono text-[10px]">ID: {selectedHotspot.id.toUpperCase()}_CHECK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
