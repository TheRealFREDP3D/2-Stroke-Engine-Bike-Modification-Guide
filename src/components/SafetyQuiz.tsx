import { useState } from "react";
import { QuizQuestion } from "../types";
import { ShieldCheck, ArrowRight, Check, X, RefreshCw, Trophy } from "lucide-react";

interface Props {
  questions: QuizQuestion[];
  onUnlockBadge: (badgeId: string) => void;
  lang: "en" | "fr";
}

export function SafetyQuiz({ questions, onUnlockBadge, lang }: Props) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [answersLog, setAnswersLog] = useState<{ [qIdx: number]: { selected: number; correct: boolean } }>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQuestion = questions[currentIdx];

  const handleOptionSelect = (optIdx: number) => {
    if (hasSubmitted) return;
    setSelectedOpt(optIdx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || hasSubmitted) return;
    const isCorrect = selectedOpt === currentQuestion.correctIndex;
    setAnswersLog((prev) => ({
      ...prev,
      [currentIdx]: { selected: selectedOpt, correct: isCorrect },
    }));
    setHasSubmitted(true);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setHasSubmitted(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
      // Check if scored 100%
      const values = Object.values({
        ...answersLog,
        [currentIdx]: { selected: selectedOpt!, correct: selectedOpt === currentQuestion.correctIndex },
      }) as { selected: number; correct: boolean }[];
      const score = values.filter((v) => v.correct).length;
      if (score === questions.length) {
        onUnlockBadge("badge_quiz");
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setHasSubmitted(false);
    setAnswersLog({});
    setQuizFinished(false);
  };

  const totalScore = (Object.values(answersLog) as { selected: number; correct: boolean }[]).filter((v) => v.correct).length;

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-2xl p-6 shadow-xl">
      <div className="border-b border-gray-800 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-sans font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Mechanic Garage Workshop Trivia Quiz
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Prove your mechanical master status! Score 100% to lock down your builder certificate.
        </p>
      </div>

      {quizFinished ? (
        /* Results View */
        <div className="py-8 text-center max-w-md mx-auto space-y-5 animate-fade-in">
          <div className="inline-flex items-center justify-center p-5 bg-amber-500/10 border border-amber-500/20 rounded-full text-4xl">
            🏆
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Workshop Quiz Complete!</h3>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Score card: <span className="text-amber-400 font-bold">{totalScore} / {questions.length} Correct</span>
            </p>
          </div>

          <div className="p-4 bg-gray-900 border border-gray-850 rounded-xl space-y-2.5 text-xs text-left antialiased">
            {totalScore === questions.length ? (
              <p className="text-emerald-400 leading-relaxed font-semibold">
                🎉 Absolutely stellar! You answered all questions perfectly. You've proven you understand 2-stroke fluid mixing, star tightening, stress concentration cracks, and emergency safety CDI cutoff buttons! Unlocked the <strong>Certified Safe builder</strong> badge!
              </p>
            ) : (
              <p className="text-yellow-400 leading-relaxed">
                🛠️ Great effort, Builder! You scored {totalScore}/{questions.length}. To earn the Certified Safe Builder badge, read through Sparky's explanations and try again for a perfect 100% score!
              </p>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              id="quiz-restart-btn"
              onClick={handleRestart}
              className="px-5 py-2.5 border border-gray-700 hover:border-gray-500 text-white font-mono text-xs rounded-lg uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all text-center"
            >
              <RefreshCw className="w-4 h-4" /> Reset Workshop Quiz
            </button>
          </div>
        </div>
      ) : (
        /* Active Question View */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Question Left Pane */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-400 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                {currentQuestion.category} Trivia
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                QUESTION {currentIdx + 1} OF {questions.length}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-bold text-white leading-relaxed antialiased">
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedOpt === optIdx;
                const isCorrectAns = optIdx === currentQuestion.correctIndex;
                let optionStyle = "bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700";

                if (hasSubmitted) {
                  if (isCorrectAns) {
                    optionStyle = "bg-emerald-950/20 border-emerald-500/40 text-emerald-300";
                  } else if (isSelected) {
                    optionStyle = "bg-rose-950/20 border-rose-500/40 text-rose-300";
                  } else {
                    optionStyle = "bg-gray-900/40 border-gray-850 opacity-40";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/5";
                }

                return (
                  <button
                    key={optIdx}
                    id={`quiz-opt-${currentIdx}-${optIdx}`}
                    onClick={() => handleOptionSelect(optIdx)}
                    disabled={hasSubmitted}
                    className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all duration-200 flex items-start gap-3 group relative cursor-pointer ${optionStyle}`}
                  >
                    <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-gray-700 text-[10px] font-mono group-hover:bg-gray-800">
                      {hasSubmitted ? (
                        isCorrectAns ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3px]" />
                        ) : isSelected ? (
                          <X className="w-3.5 h-3.5 text-rose-400 stroke-[3px]" />
                        ) : (
                          String.fromCharCode(65 + optIdx)
                        )
                      ) : (
                        String.fromCharCode(65 + optIdx)
                      )}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Actions Panel */}
            <div className="pt-4 border-t border-gray-850 flex items-center justify-between gap-3">
              <span className="text-[10px] text-gray-500 font-mono">
                🔥 Locked: {Object.keys(answersLog).length} answers submitted
              </span>
              
              {!hasSubmitted ? (
                <button
                  id="quiz-submit-btn"
                  onClick={handleSubmit}
                  disabled={selectedOpt === null}
                  className={`px-5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedOpt !== null
                      ? "bg-amber-400 text-[#0b0f19] hover:brightness-110 active:scale-95 font-bold"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Verify Selection
                </button>
              ) : (
                <button
                  id="quiz-next-btn"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-110 active:scale-95 font-mono text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {currentIdx + 1 < questions.length ? "Proceed Ahead" : "Finish Review"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sparky Classroom Explainer Right Pane (Only shown after submit) */}
          <div className="md:col-span-5 h-full">
            {hasSubmitted ? (
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-4 animate-fade-in h-full">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${selectedOpt === currentQuestion.correctIndex ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-450"}`}>
                    🏆
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                      {selectedOpt === currentQuestion.correctIndex ? "SOLDER DIRECTLY!" : "RE-TOOL NEEDED!"}
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      Mechanics Analysis
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-300 leading-relaxed font-sans bg-gray-950/40 p-3 rounded-lg border border-gray-900">
                  {currentQuestion.explanation}
                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-800/10 rounded-lg flex gap-2">
                  <span className="text-cyan-400 text-xs">💡</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-serif italic">
                    "Take your time, buddy. Every mechanical friction or alignment rule we learn here keeps you riding long after class graduation!" — Sparky
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gray-800 rounded-xl p-6 text-center text-gray-500 py-16 text-xs font-mono">
                📌 Submit an answer above to display Sparky's physical mechanics breakdown explanations here dynamically.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
