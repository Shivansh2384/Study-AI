"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Lightbulb, ChevronRight } from "lucide-react";

const hints = [
  { question: "Where is energy stored in the cell?", answer: "In glucose molecules" },
  { question: "Where does the cell need usable energy?", answer: "In all cellular activities" },
  { question: "How could stored energy become usable?", answer: "By transforming glucose into ATP through cellular respiration" },
];

const mainQuestion = "If glucose stores energy, why do cells break it down during cellular respiration?";
const smooth = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] };

export default function SceneGuided({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showBreakthrough, setShowBreakthrough] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setRevealedHints([0]), 2500),
      setTimeout(() => setRevealedHints([0, 1]), 4500),
      setTimeout(() => setRevealedHints([0, 1, 2]), 6500),
      setTimeout(() => setShowBreakthrough(true), 8500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-2 mb-4"
      >
        <Lightbulb className="h-3.5 w-3.5 text-violet-400" />
        <span className="text-tiny font-mono text-violet-400/70 uppercase tracking-[0.2em]">Guided Discovery</span>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ...smooth }}
        className="w-full max-w-2xl rounded-xl border border-violet-400/15 bg-gradient-to-b from-violet-400/[0.04] to-transparent overflow-hidden"
      >
        {/* Header with question */}
        <div className="px-5 py-3.5 border-b border-violet-400/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-tiny font-semibold text-cyan-300 uppercase tracking-wider">NeuroLearn asks</span>
          </div>
          <p className="text-base text-white font-medium leading-relaxed">{mainQuestion}</p>
        </div>

        {/* Hints */}
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2.5"
          >
            <p className="text-micro text-slate-500 uppercase tracking-wider mb-2">Progressive hints</p>
            {hints.map((hint, i) => {
              const isRevealed = revealedHints.includes(i);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: isRevealed ? 1 : 0.2, x: isRevealed ? 0 : -6 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`rounded-lg border px-3.5 py-2.5 transition-colors duration-500 ${
                    isRevealed ? "border-violet-400/20 bg-violet-400/[0.05]" : "border-white/[0.04] bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-micro font-bold mt-0.5 transition-colors duration-500 ${isRevealed ? "bg-violet-400/20 text-violet-300" : "bg-white/[0.06] text-slate-600"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium transition-colors duration-500 ${isRevealed ? "text-white" : "text-slate-600"}`}>{hint.question}</p>
                      <AnimatePresence>
                        {isRevealed && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <ChevronRight className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                              <p className="text-sm text-slate-400">{hint.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Breakthrough */}
      <AnimatePresence>
        {showBreakthrough && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 w-full max-w-2xl"
          >
            <div className="rounded-xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/[0.06] to-cyan-400/[0.03] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 border border-emerald-400/20">
                  <span className="text-base font-bold text-emerald-300">E</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-tiny font-semibold text-emerald-300 uppercase tracking-wider">Emma realizes</span>
                    <span className="text-[9px] text-emerald-400/60 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">Breakthrough</span>
                  </div>
                  <p className="text-sm text-white leading-relaxed">
                    {"\u201COh! Cells don\u2019t "}
                    <em>create</em>
                    {" energy \u2014 they "}
                    <em>transform</em>
                    {" it! Glucose has stored energy, and respiration converts it into ATP.\u201D"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-400 mb-4">
                {"NeuroLearn didn\u2019t give the answer. "}
                <span className="text-white font-medium">She discovered it herself.</span>
              </p>
              <button
                onClick={onNext}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all duration-300 hover:scale-[1.03] mx-auto"
              >
                See the Transformation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typing dots */}
      {!showBreakthrough && revealedHints.length === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex items-center gap-2 text-slate-500 text-sm">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          {"Emma is connecting the concepts\u2026"}
        </motion.div>
      )}
    </div>
  );
}
