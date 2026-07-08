"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X, Sparkles, Brain, AlertTriangle } from "lucide-react";

const smooth = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] };

export default function SceneWrongAnswer({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-2 mb-5"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        <span className="text-tiny font-mono text-slate-500 uppercase tracking-[0.2em]">Response Analysis</span>
      </motion.div>

      {/* Split comparison */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Traditional */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -14 }}
          transition={{ ...smooth, delay: 0.1 }}
          className="rounded-xl border border-rose-500/20 bg-rose-500/[0.02] overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-rose-500/10 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10">
              <X className="h-3.5 w-3.5 text-rose-400" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-300">Traditional App</p>
              <p className="text-micro text-slate-600">Answer-based feedback</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="rounded-lg bg-neuro-950/60 p-3">
              <div className="flex items-center gap-2 mb-2">
                <X className="h-3 w-3 text-rose-400" />
                <span className="text-tiny font-semibold text-rose-300">Incorrect</span>
              </div>
              <p className="text-sm text-slate-400 mb-1"><span className="text-rose-300/80">You:</span>{" To create new energy"}</p>
              <p className="text-sm text-slate-400"><span className="text-emerald-300/80">Answer:</span>{" To release ATP"}</p>
            </div>
            <p className="text-xs text-slate-600 text-center">Score: 2/5 (40%)</p>
            <div className="rounded-md bg-white/[0.02] p-2.5 border border-white/[0.04]">
              <p className="text-tiny text-slate-500 text-center italic">{"\u201CThat\u2019s it. Move on.\u201D"}</p>
            </div>
          </div>
        </motion.div>

        {/* NeuroLearn */}
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 14 }}
          transition={{ ...smooth, delay: 0.1 }}
          className="rounded-xl border border-cyan-400/20 bg-gradient-to-b from-cyan-400/[0.04] to-transparent overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.05)]"
        >
          <div className="px-4 py-3 border-b border-cyan-400/10 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-400/10">
              <Brain className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cyan-300">NeuroLearn AI</p>
              <p className="text-micro text-slate-500">Pattern-based analysis</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="rounded-lg bg-neuro-950/40 border border-cyan-400/10 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span className="text-tiny font-semibold text-cyan-300">Pattern Detected</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{"We noticed a pattern in Emma\u2019s reasoning."}</p>
            </div>
            <div className="rounded-lg bg-amber-400/[0.05] border border-amber-400/15 p-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium mb-0.5">Energy Creation vs. Transformation</p>
                  <p className="text-tiny text-slate-400 leading-relaxed">
                    {"Emma believes energy is "}
                    <span className="text-amber-300">created</span>
                    {" instead of "}
                    <span className="text-cyan-300">transformed</span>
                    {"."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Key difference */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 12 }}
        transition={{ ...smooth, delay: 0.2 }}
        className="mt-6 max-w-2xl text-center"
      >
        <div className="inline-flex items-center gap-3 rounded-full bg-white/[0.03] border border-white/[0.06] px-4 py-2 mb-4">
          <div className="h-px w-6 bg-gradient-to-r from-transparent to-slate-600" />
          <span className="text-tiny text-slate-400 font-medium">The Critical Difference</span>
          <div className="h-px w-6 bg-gradient-to-l from-transparent to-slate-600" />
        </div>

        <p className="text-lg md:text-xl font-bold text-white leading-snug mb-2">
          {"Traditional systems identify "}
          <span className="text-rose-400">the answer</span>
          {"."}<br />
          {"NeuroLearn identifies "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">the thinking</span>
          {" behind it."}
        </p>

        <p className="text-xs text-slate-500 mb-5">
          {"Knowing the right answer doesn\u2019t fix the misconception that caused the mistake."}
        </p>

        <button
          onClick={onNext}
          className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all duration-300 hover:scale-[1.03] mx-auto"
        >
          See What NeuroLearn Found
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  );
}
