"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Target } from "lucide-react";

const options = [
  { letter: "A", text: "To break down glucose and release ATP for cellular work" },
  { letter: "B", text: "To create new energy from sunlight and water" },
  { letter: "C", text: "To store energy in glucose molecules" },
  { letter: "D", text: "To transport oxygen throughout the cell" },
];

const smooth = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] };

export default function SceneQuestion({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 2000),
      setTimeout(() => { setSelectedIdx(1); setPhase(2); }, 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-3 mb-5"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
          <Target className="h-3 w-3 text-cyan-400" />
          <span className="text-tiny font-semibold text-cyan-300">Diagnostic Question</span>
        </div>
        <span className="text-tiny text-slate-600">3 of 5</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ...smooth }}
        className="w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden"
      >
        <div className="border-b border-white/[0.04] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-node-pulse" />
            <span className="text-tiny font-semibold text-slate-400 uppercase tracking-wider">{"\u2014 Cell Energy"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="h-3 w-3" />
            <span className="text-tiny font-mono">0:42</span>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-base md:text-lg font-medium text-white leading-relaxed">
            {"What is the "}
            <span className="text-cyan-300">primary role</span>
            {" of cellular respiration in living organisms?"}
          </p>
        </div>

        <div className="px-5 pb-4 space-y-2">
          {options.map((opt, i) => {
            const isSelected = selectedIdx === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                className={`rounded-lg border px-3.5 py-2.5 flex items-center gap-3 transition-all duration-700 ${
                  isSelected
                    ? "border-violet-400/40 bg-violet-400/10 shadow-[0_0_16px_rgba(167,139,250,0.1)]"
                    : "border-white/[0.06] bg-white/[0.01]"
                }`}
              >
                <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-tiny font-bold transition-colors duration-700 ${isSelected ? "bg-violet-400/20 text-violet-300" : "bg-white/[0.04] text-slate-500"}`}>
                  {opt.letter}
                </span>
                <span className={`text-sm transition-colors duration-700 flex-1 ${isSelected ? "text-white font-medium" : "text-slate-400"}`}>
                  {opt.text}
                </span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-[9px] font-semibold text-violet-300 bg-violet-400/10 px-2 py-0.5 rounded-full whitespace-nowrap"
                  >
                    {"\u2190 Emma"}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Status area */}
      <div className="mt-5 text-center">
        {phase < 2 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }} className="flex items-center gap-2 text-slate-500 text-sm">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            {"Emma is thinking\u2026"}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={smooth} className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-left">
                <p className="text-tiny text-slate-500 mb-0.5">{"\u2019s confidence"}</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-slate-800">
                    <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.0, delay: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400" />
                  </div>
                  <span className="text-xs font-semibold text-violet-300">85%</span>
                </div>
              </div>
              <div className="h-6 w-px bg-white/[0.06]" />
              <p className="text-tiny text-slate-500">{"\u201CI studied this twice\u201D"}</p>
            </div>

            <p className="text-sm text-slate-400">
              {"Emma selected "}
              <span className="text-violet-300 font-semibold">B: To create new energy</span>
            </p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              onClick={onNext}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all duration-300 hover:scale-[1.03]"
            >
              See the Result
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
