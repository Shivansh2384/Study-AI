"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Sparkles } from "lucide-react";

const smooth = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] };

export default function SceneIntro({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex items-center gap-2 mb-5"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-node-pulse" />
        <span className="text-tiny font-mono text-slate-500 uppercase tracking-[0.2em]">
          Live Diagnostic Session
        </span>
      </motion.div>

      {/* Compact profile + topic side by side on larger screens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl rounded-2xl border border-cyan-400/15 bg-gradient-to-b from-cyan-400/[0.05] to-transparent overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.08)] mb-5"
      >
        <div className="relative p-5 md:p-6 flex flex-col md:flex-row items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <span className="text-2xl font-bold bg-gradient-to-br from-cyan-300 to-violet-300 bg-clip-text text-transparent">E</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-md bg-emerald-500 border-2 border-neuro-950 flex items-center justify-center">
              <Brain className="h-2.5 w-2.5 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <h1 className="text-xl font-bold text-white mb-0.5">Emma</h1>
            <p className="text-xs text-slate-400 mb-3">{"\u00B7 Biology Student \u00B7 Junior Year \u00B7"}</p>
            <div className="rounded-lg bg-neuro-950/60 border border-white/[0.06] p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-tiny font-medium text-slate-400">Current Topic</span>
                <span className="text-micro font-mono text-slate-600 ml-auto">AP Biology</span>
              </div>
              <p className="text-sm font-semibold text-white">{"Cell Energy: Photosynthesis & Respiration"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Analysis teaser */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, ...smooth }}
        className="w-full max-w-2xl rounded-xl border border-amber-400/15 bg-amber-400/[0.03] p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-left">
            <p className="text-tiny font-semibold text-amber-300 uppercase tracking-wider mb-1">
              NeuroLearn Analysis Preview
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {"Emma understands many parts of cell energy, but "}
              <span className="text-amber-300 font-medium">one hidden misconception</span>
              {" is preventing deeper understanding."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, ...smooth }}
        onClick={onNext}
        className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-[1.03]"
      >
        Begin Diagnostic Session
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="mt-2.5 text-xs text-slate-600"
      >
        Watch NeuroLearn discover what traditional tools miss
      </motion.p>
    </div>
  );
}
