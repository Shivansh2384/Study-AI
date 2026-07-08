"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Target, Lightbulb } from "lucide-react";

const smooth = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] };

export default function SceneMisconception({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2800),
      setTimeout(() => setPhase(3), 4600),
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
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
        />
        <span className="text-tiny font-mono text-cyan-400/80 uppercase tracking-[0.2em]">
          {phase < 1 ? "Analyzing thinking pattern\u2026" : "Learning Pattern Detected"}
        </span>
      </motion.div>

      {/* Main analysis card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ...smooth }}
        className="w-full max-w-2xl rounded-xl border border-cyan-400/20 bg-gradient-to-b from-cyan-400/[0.06] via-cyan-400/[0.02] to-transparent overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.06)]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-cyan-400/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-400/10 border border-cyan-400/20">
              <Brain className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">NeuroLearn AI Analysis</p>
              <p className="text-micro text-slate-500">Deep pattern recognition</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-micro text-slate-600 font-mono">Confidence</span>
            <span className="text-sm font-bold text-cyan-400">92%</span>
          </div>
        </div>

        <div className="p-5 space-y-3.5">
          {/* Phase 1: Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
            transition={smooth}
            className="rounded-lg border border-amber-400/20 bg-gradient-to-r from-amber-400/[0.08] to-amber-400/[0.02] p-4"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400/15">
                <Target className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-amber-300">Energy Direction Confusion</span>
            </div>
            <p className="text-sm text-white font-medium leading-relaxed mb-2">
              {"Emma is confusing "}
              <span className="text-amber-300">energy transformation</span>
              {" with "}
              <span className="text-cyan-300">energy creation</span>
              {"."}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {"She understands energy is involved, but the "}
              <span className="text-white">direction of energy flow</span>
              {" is unclear in her mental model."}
            </p>
          </motion.div>

          {/* Phase 2: AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 8 }}
            transition={smooth}
            className="rounded-lg border border-white/[0.08] bg-neuro-950/40 p-4"
          >
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-400/10 flex-shrink-0 mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div>
                <p className="text-tiny font-semibold text-cyan-300 uppercase tracking-wider mb-1.5">AI Insight</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {"Her answer \u201Ccreate new energy\u201D reveals she hasn\u2019t internalized a core principle: "}
                  <span className="text-white font-medium">{"living systems don\u2019t create energy \u2014 they convert it"}</span>
                  {"."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Phase 3: Why */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 8 }}
            transition={smooth}
            className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.03] p-4"
          >
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-400/10 flex-shrink-0 mt-0.5">
                <Lightbulb className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-tiny font-semibold text-emerald-300 uppercase tracking-wider mb-1.5">Why This Happens</p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {"This is the "}
                  <span className="text-white font-medium">#3 most common misconception</span>
                  {" in cell biology. Emma has "}
                  <span className="text-emerald-300">the right foundation</span>
                  {" \u2014 she just needs the right question to unlock it."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-5 flex flex-col items-center gap-3"
      >
        <p className="text-xs text-slate-500 text-center max-w-sm">
          {"Instead of telling Emma she\u2019s wrong, NeuroLearn will guide her to "}
          <span className="text-cyan-400">discover the answer herself</span>
          {"."}
        </p>
        <button
          onClick={onNext}
          className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all duration-300 hover:scale-[1.03]"
        >
          Watch Guided Discovery
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  );
}
