"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, ArrowDown, Sparkles } from "lucide-react";

const smooth = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] };

export default function SceneBreakthrough({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 900),
      setTimeout(() => setPhase(2), 2800),
      setTimeout(() => setPhase(3), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex items-center gap-2 mb-5"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
        />
        <span className="text-tiny font-mono text-emerald-400/80 uppercase tracking-[0.2em]">Understanding Transformation</span>
      </motion.div>

      {/* Before / After — side by side on desktop, stacked on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ...smooth }}
        className="w-full max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={smooth}
            className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="text-tiny font-semibold text-rose-300 uppercase tracking-wider">Before</span>
            </div>
            <p className="text-base text-white font-medium">
              {"\u201CCells "}
              <span className="text-rose-400 opacity-60">create</span>
              {" energy.\u201D"}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">Energy made from nothing</p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.8 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <ArrowDown className="h-5 w-5 text-emerald-400 md:rotate-[-90deg]" />
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ ...smooth, delay: 0.15 }}
            className="rounded-xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/[0.08] to-cyan-400/[0.04] p-4 shadow-[0_0_30px_rgba(52,211,153,0.06)]"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-tiny font-semibold text-emerald-300 uppercase tracking-wider">After</span>
            </div>
            <p className="text-base text-white font-medium">
              {"\u201CCells "}
              <span className="text-emerald-400">transform</span>
              {" energy into "}
              <span className="text-cyan-400">ATP</span>
              {".\u201D"}
            </p>
            <p className="mt-1.5 text-xs text-slate-400">Energy converted, not created</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Resolution */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 w-full max-w-2xl"
          >
            <div className="rounded-xl border border-cyan-400/15 bg-gradient-to-b from-cyan-400/[0.04] to-transparent p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 border border-emerald-400/20">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold text-white">Misconception Resolved</span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Verified
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    {"Emma now understands living systems transform energy, not create it."}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-md bg-neuro-950/60 p-2 text-center">
                      <p className="text-base font-bold text-emerald-400">+64%</p>
                      <p className="text-[9px] text-slate-500">Understanding</p>
                    </div>
                    <div className="rounded-md bg-neuro-950/60 p-2 text-center">
                      <p className="text-base font-bold text-cyan-400">4 min</p>
                      <p className="text-[9px] text-slate-500">Time Spent</p>
                    </div>
                    <div className="rounded-md bg-neuro-950/60 p-2 text-center">
                      <p className="text-base font-bold text-violet-400">1</p>
                      <p className="text-[9px] text-slate-500">Pattern Fixed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={onNext}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all duration-300 hover:scale-[1.03] mx-auto"
              >
                View Updated Knowledge Map
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
