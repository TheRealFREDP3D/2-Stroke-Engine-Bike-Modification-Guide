import { useState, useEffect } from "react";
import { VideoGuide, VideoChapter } from "../types";
import { 
  Play, 
  Tv, 
  CheckCircle2, 
  AlertTriangle, 
  Atom, 
  Clock, 
  Cpu, 
  ChevronRight, 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  Wrench,
  ThumbsUp
} from "lucide-react";

interface VideoTutorialsProps {
  videos: VideoGuide[];
  onUnlockBadge: (badgeId: string) => void;
  lang: "en" | "fr";
}

export function VideoTutorials({ videos, onUnlockBadge, lang }: VideoTutorialsProps) {
  const [activeGuideIdx, setActiveGuideIdx] = useState(0);
  const [selectedChapterTime, setSelectedChapterTime] = useState("0:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const [confirmedSafety, setConfirmedSafety] = useState<Record<string, boolean>>({});
  
  // Quiz verification per video
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<string, string>>({});

  const activeGuide = videos[activeGuideIdx] || videos[0];

  useEffect(() => {
    // Reset chapter and playback when switching videos
    setSelectedChapterTime("0:00");
    setIsPlaying(false);
  }, [activeGuideIdx]);

  // Convert "1:25" into seconds for YouTube ?start=
  const getSeconds = (timeStr: string) => {
    const parts = timeStr.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 0;
  };

  const activeSeconds = getSeconds(selectedChapterTime);
  const embedUrl = `${activeGuide.youtubeUrl}?start=${activeSeconds}&rel=0&modestbranding=1&showinfo=0&autoplay=${isPlaying ? 1 : 0}`;

  const handleChapterClick = (chapter: VideoChapter) => {
    setSelectedChapterTime(chapter.time);
    setIsPlaying(true);
  };

  const handleSafetyToggle = (guideId: string) => {
    const updated = {
      ...confirmedSafety,
      [guideId]: !confirmedSafety[guideId]
    };
    setConfirmedSafety(updated);

    // Verify if all videos have their safety checklist cleared
    const allCleared = videos.every(v => updated[v.id] === true);
    if (allCleared) {
      onUnlockBadge("badge_video");
    }
  };

  // Video quiz questions to maximize interactive education
  const videoQuizzes: Record<string, { question: string; options: string[]; correctIdx: number; successMsg: string; failMsg: string }> = {
    v_sprocket: {
      question: "Which pattern must be used to tighten the sprocket spokes backing bolts?",
      options: [
        "In a continuous circle pattern around the hub.",
        "An opposing cross/star pattern, in small gradual increments.",
        "Hand-tight option without use of wrench sets."
      ],
      correctIdx: 1,
      successMsg: "Exactly! Tightening opposing sides in a star pattern draws the sprocket flush without skewing it off-center.",
      failMsg: "Incorrect. Circle tightening causes uneven stress distribution and warp runout."
    },
    v_engine: {
      question: "Why should you avoid drilling a custom engine mount hole in your frame steel tube?",
      options: [
        "It decreases bicycle trade-in value.",
        "It ruins the frame paint.",
        "It concentrates micro-stress where vibrations can crack and snap the raw frame tube."
      ],
      correctIdx: 2,
      successMsg: "Splendid safety reasoning! Bicycle tubing is structural. Drilling introduces focal stress points that break under motor buzz.",
      failMsg: "Not quite. Tubing safety is compromised by drilling holes directly into structural paths."
    },
    v_chain: {
      question: "What is the optimal chain vertical sag measurement for high-load chains?",
      options: [
        "Exactly 1/2 of an inch of flexible travel.",
        "3 inches to allow the sprocket maximum slide room.",
        "Zero sag—it should be tight like a guitar wire."
      ],
      correctIdx: 0,
      successMsg: "Perfect! 1/2 inch of slack avoids motor torque choke-stalls and safeguards against link jumps.",
      failMsg: "Try again! Too loose chain drops gears; too tight stresses bearings."
    },
    v_fuel: {
      question: "What break-in fuel ratio is standard for the first two tanks of 2-stroke gasoline?",
      options: [
        "Straight fuel without oil mix.",
        "16:1 or 20:1 high oil saturation ratio.",
        "100:1 fuel filter mix."
      ],
      correctIdx: 1,
      successMsg: "Correct! The new cylinder needs rich 2-stroke lubrication (16:1 or 20:1) to clean burrs and seal the piston rings.",
      failMsg: "No! Pure gas or dry combinations will toast the cylinder in minutes."
    }
  };

  const currentQuiz = videoQuizzes[activeGuide.id];

  const handleSelectQuizOption = (optIdx: number) => {
    setUserAnswers({ ...userAnswers, [activeGuide.id]: optIdx });
  };

  const handleSubmitQuiz = () => {
    const selected = userAnswers[activeGuide.id];
    if (selected === undefined) return;

    const isCorrect = selected === currentQuiz.correctIdx;
    setQuizSubmitted({ ...quizSubmitted, [activeGuide.id]: true });
    setQuizFeedback({
      ...quizFeedback,
      [activeGuide.id]: isCorrect ? currentQuiz.successMsg : currentQuiz.failMsg
    });
  };

  // Status counters
  const totalCompletedSafety = videos.filter(v => confirmedSafety[v.id]).length;

  return (
    <div id="video-school-suite" className="space-y-8">
      {/* Visual Hub Introduction */}
      <div className="bg-gradient-to-r from-gray-900 via-[#111827] to-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Stage 5 Tutorial Lab
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Videos viewed: {totalCompletedSafety}/{videos.length}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight">
            2-Stroke Motorized Bicycle Assembly School
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
            Welcome to the multimedia workshop! Beginners should watch these animated visual procedures before hoisting, adjusting gears, or blending fuel. Click dynamic chapters to skip the video directly to technical steps.
          </p>
        </div>

        {/* Cinematic Progress Badge */}
        <div className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex items-center gap-4 w-full md:w-auto h-20">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-lg text-black">
            <Tv className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-gray-500">
              Video Milestone Status
            </div>
            <div className="text-sm font-bold text-gray-200">
              {totalCompletedSafety === videos.length ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Cinema Scholar Earned!
                </span>
              ) : (
                <span>Clear {videos.length} Safety Keys</span>
              )}
            </div>
            {/* Tiny Progress bar */}
            <div className="w-36 bg-gray-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(totalCompletedSafety / videos.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Deck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Interactive Player Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cinema Frame */}
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative group">
            
            {/* Custom Interactive Click to Play Cover if not yet started */}
            {!isPlaying ? (
              <div className="relative aspect-video w-full flex items-center justify-center bg-cover bg-center transition-all duration-300"
                   style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${activeGuide.thumbnailUrl})` }}>
                
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="px-2.5 py-1 text-[10px] font-mono tracking-wide uppercase bg-black/80 text-amber-500 rounded border border-amber-500/30">
                    {activeGuide.category}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-mono tracking-wide bg-black/80 text-gray-300 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activeGuide.duration}
                  </span>
                </div>

                <div className="text-center p-6 space-y-4 max-w-lg z-10">
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500 text-black hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                        onClick={() => setIsPlaying(true)}>
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                    {activeGuide.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Click play to boot the educational instruction tutorial. Skip chapters below directly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full">
                <iframe
                  id={`video-player-${activeGuide.id}`}
                  src={embedUrl}
                  title={activeGuide.title}
                  className="w-full h-full border-0 absolute top-0 left-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Sub-status Indicator Ribbon */}
            <div className="bg-gray-950 px-5 py-3 border-t border-gray-900 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                Offline Simulator Stream
              </span>
              <span>Playing from: {selectedChapterTime}</span>
            </div>
          </div>

          {/* Interactive Chapter Timestamps Navigation */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Dynamic Video Chapters (Click to Jump Video)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeGuide.chapters.map((chapter) => (
                <button
                  key={`${activeGuide.id}-chapter-${chapter.time}`}
                  id={`chapter-jump-${chapter.time}`}
                  onClick={() => handleChapterClick(chapter)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer group ${
                    selectedChapterTime === chapter.time 
                      ? "bg-amber-500/10 border-amber-500/40 text-white" 
                      : "bg-gray-950/60 border-gray-800 text-gray-300 hover:border-gray-700 hover:bg-gray-900"
                  }`}
                >
                  <span className="px-2 py-0.5 mt-0.5 rounded text-[10px] font-mono tracking-tight font-bold bg-gray-800 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                    {chapter.time}
                  </span>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold font-sans group-hover:text-amber-400 transition-colors">
                      {chapter.title}
                    </div>
                    <div className="text-[11px] text-gray-400 font-sans line-clamp-1">
                      {chapter.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Safety Check sheet & Science Principle Drawer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Interactive Safety Takeaway */}
            <div className="bg-gradient-to-b from-[#111827] to-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-500 font-mono font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  Supervisor Safety Mandate
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {activeGuide.safetyPrecaution}
                </p>
                <div className="bg-rose-950/30 border border-rose-900/30 text-rose-200 p-3 rounded-xl text-[11px] leading-relaxed">
                  <strong>Student Warning:</strong> Always have an adult relative or science club instructor clear mechanical modifications before attempting a test ride.
                </div>
              </div>

              {/* Check and Save button */}
              <button
                id={`safety-confirm-${activeGuide.id}`}
                onClick={() => handleSafetyToggle(activeGuide.id)}
                className={`w-full mt-4 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  confirmedSafety[activeGuide.id]
                    ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
                    : "bg-amber-500 text-black hover:bg-amber-400 shadow-md shadow-amber-500/10"
                }`}
              >
                {confirmedSafety[activeGuide.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 fill-emerald-400 text-black" />
                    Safety Takeaways Cleared!
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Secure & Complete Safety Principle
                  </>
                )}
              </button>
            </div>

            {/* Mechanics Explanation */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-xs uppercase tracking-wider">
                <Atom className="w-4 h-4 animate-spin-slow" />
                Mechanical Physics Insight
              </div>
              <div className="space-y-2.5">
                <div className="px-3 py-1.5 rounded-lg bg-indigo-900/10 text-indigo-300 text-[11px] font-mono border border-indigo-900/20 inline-block">
                  Physics: {activeGuide.category}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {activeGuide.mechanicConcept}
                </p>
                <div className="border-t border-gray-800/80 pt-3 flex items-center gap-2 text-xs text-gray-400">
                  <Wrench className="w-3.5 h-3.5 text-gray-500" />
                  <span>Workshop Guideline Ref: D-094</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Understanding Checklist Quiz Block */}
          {currentQuiz && (
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h4 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-amber-500" />
                  Quick Check: Verify Assembly Mastery
                </h4>
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                  Continuous Evaluation
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-200 font-bold leading-relaxed">
                  {currentQuiz.question}
                </p>

                <div className="space-y-2">
                  {currentQuiz.options.map((option, idx) => {
                    const isSelected = userAnswers[activeGuide.id] === idx;
                    const isSubmitted = quizSubmitted[activeGuide.id];
                    const isCorrectOption = idx === currentQuiz.correctIdx;

                    let optionStyle = "border-gray-800 bg-gray-950/60 text-gray-300 hover:bg-gray-900 hover:border-gray-700";
                    if (isSelected) {
                      optionStyle = "border-amber-500 bg-amber-500/5 text-amber-400";
                    }
                    if (isSubmitted) {
                      if (isCorrectOption) {
                        optionStyle = "border-emerald-500/60 bg-emerald-500/5 text-emerald-400";
                      } else if (isSelected) {
                        optionStyle = "border-rose-500/60 bg-rose-500/5 text-rose-400";
                      }
                    }

                    return (
                      <button
                        key={`${activeGuide.id}-option-${idx}`}
                        onClick={() => !isSubmitted && handleSelectQuizOption(idx)}
                        disabled={isSubmitted}
                        className={`w-full p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                      >
                        <span className="font-sans">{option}</span>
                        {isSubmitted && isCorrectOption && (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-emerald-950" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {quizSubmitted[activeGuide.id] ? (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed font-sans ${
                  userAnswers[activeGuide.id] === currentQuiz.correctIdx
                    ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-300"
                    : "bg-rose-950/20 border-rose-900/30 text-rose-300"
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1.5 text-xs">
                    {userAnswers[activeGuide.id] === currentQuiz.correctIdx ? (
                      <>
                        <ThumbsUp className="w-4 h-4" /> Correct Answer!
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" /> Review Recommended
                      </>
                    )}
                  </div>
                  {quizFeedback[activeGuide.id]}
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={userAnswers[activeGuide.id] === undefined}
                    className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      userAnswers[activeGuide.id] === undefined
                        ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
                        : "bg-amber-500 text-black hover:bg-amber-400 shadow"
                    }`}
                  >
                    Submit Quick Check
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Tutorials Directory Column */}
        <div id="video-guides-sidebar" className="space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-lg">
            
            <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
                <Cpu className="w-4.5 h-4.5 text-indigo-400" />
                Select Tutorial Module
              </h3>
              <span className="text-[10px] font-mono text-gray-500 uppercase font-black">
                {videos.length} videos
              </span>
            </div>

            {/* Video List */}
            <div className="space-y-3">
              {videos.map((guide, idx) => {
                const isActive = activeGuideIdx === idx;
                const isCleared = confirmedSafety[guide.id] === true;

                return (
                  <button
                    key={guide.id}
                    id={`select-video-${guide.id}`}
                    onClick={() => setActiveGuideIdx(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 relative ${
                      isActive 
                        ? "bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-amber-500/50 shadow-md" 
                        : "bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900"
                    }`}
                  >
                    {/* Small preview block */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-900 border border-gray-800">
                      <img 
                        src={guide.thumbnailUrl} 
                        alt={guide.title}
                        className="w-full h-full object-cover grayscale-30 group-hover:grayscale-0"
                        referrerPolicy="no-referrer"
                      />
                      {/* Duration badge */}
                      <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-mono text-gray-300">
                        {guide.duration}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.5 text-[8px] font-mono tracking-widest uppercase rounded bg-gray-900 border border-gray-800 text-amber-500">
                          {guide.category}
                        </span>
                        {isCleared && (
                          <span className="px-1.5 py-0.5 text-[8.5px] font-mono rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-0.5 border border-emerald-500/10">
                            Clear
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight truncate">
                        {guide.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 line-clamp-2 mt-1 leading-snug">
                        {guide.description}
                      </p>
                    </div>

                    <div className="absolute right-3.5 text-gray-500">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Solder's Helpful Guide Tip Box */}
          <div className="bg-gradient-to-tr from-gray-950 to-amber-950/15 border border-amber-900/20 p-5 rounded-2xl relative shadow-md">
            <div className="absolute -top-3.5 -right-3 w-16 h-16 text-amber-500/10 select-none pointer-events-none">
              <Cpu className="w-full h-full" />
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Wrench className="w-4 h-4 animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Sparky's Shop Lesson
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  "Hey kiddo! Sprocket alignment isn't just about speed. An off-center sprocket rotates like a cam, pulling the mechanical chain tighter on one side. This stretches standard spoke wires and can break your motor cover! Take your time with the rag-joint clamp."
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
