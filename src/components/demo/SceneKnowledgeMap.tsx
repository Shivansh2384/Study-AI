"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RotateCcw, ArrowLeft, Sparkles, TrendingUp } from "lucide-react";

interface KnowledgeArea {
  name: string;
  concepts: {
    name: string;
    beforeStatus: "mastered" | "developing" | "gap";
    afterStatus: "mastered" | "developing" | "gap";
  }[];
}

const knowledgeAreas: KnowledgeArea[] = [
  {
    name: "Photosynthesis",
    concepts: [
      { name: "Purpose", beforeStatus: "mastered", afterStatus: "mastered" },
      { name: "Glucose Storage", beforeStatus: "mastered", afterStatus: "mastered" },
    ],
  },
  {
    name: "Cellular Respiration",
    concepts: [
      { name: "Purpose", beforeStatus: "developing", afterStatus: "mastered" },
      { name: "ATP Production", beforeStatus: "gap", afterStatus: "developing" },
    ],
  },
  {
    name: "Energy Transfer",
    concepts: [
      { name: "Transformation Principle", beforeStatus: "gap", afterStatus: "mastered" },
    ],
  },
];

const statusConfig = {
  mastered: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Mastered", glow: "shadow-[0_0_8px_rgba(52,211,153,0.4)]" },
  developing: { dot: "bg-amber-400", text: "text-amber-400", label: "Developing", glow: "shadow-[0_0_8px_rgba(251,191,36,0.4)]" },
  gap: { dot: "bg-rose-400", text: "text-rose-400", label: "Gap", glow: "shadow-[0_0_8px_rgba(251,113,133,0.4)]" },
};

const smooth = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] };

export default function SceneKnowledgeMap({ onRestart }: { onRestart: () => void }) {
  const [showAfter, setShowAfter] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowAfter(true), 2200);
    const t2 = setTimeout(() => setShowSummary(true), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-2 mb-4"
      >
        <Brain className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-tiny font-mono text-cyan-400/80 uppercase tracking-[0.2em]">
          {!showAfter ? "Knowledge Map \u2014 Before" : "Knowledge Map \u2014 Updated"}
        </span>
      </motion.div>

      {/* Map + Summary side by side on desktop */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Knowledge Map — 3 columns */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...smooth }}
          className="lg:col-span-3 rounded-xl border border-cyan-400/15 bg-gradient-to-b from-neuro-900/80 to-neuro-950/60 overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.05)]"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={showAfter ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.6 }}
                className="h-2 w-2 rounded-full bg-cyan-400"
              />
              <span className="text-sm font-semibold text-white">{"Emma\u2019s Understanding"}</span>
            </div>
            <div className="flex items-center gap-3 text-[9px]">
              <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-slate-500">Mastered</span></div>
              <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-400" /><span className="text-slate-500">Developing</span></div>
              <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-400" /><span className="text-slate-500">Gap</span></div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {knowledgeAreas.map((area, areaIdx) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + areaIdx * 0.12, ...smooth }}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
              >
                <h3 className="text-sm font-semibold text-white mb-2">{area.name}</h3>
                <div className="space-y-1.5">
                  {area.concepts.map((concept) => {
                    const status = showAfter ? concept.afterStatus : concept.beforeStatus;
                    const config = statusConfig[status];
                    const changed = showAfter && concept.beforeStatus !== concept.afterStatus;
                    return (
                      <motion.div
                        key={concept.name}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-md transition-all duration-700 ${changed ? "bg-emerald-400/[0.08] border border-emerald-400/20" : "bg-white/[0.01]"}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <motion.div
                            animate={changed ? { scale: [1, 1.4, 1] } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className={`h-2 w-2 rounded-full transition-colors duration-700 ${config.dot} ${changed ? config.glow : ""}`}
                          />
                          <span className="text-sm text-slate-300">{concept.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {changed && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5, duration: 0.4 }}
                              className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                            >
                              Improved
                            </motion.span>
                          )}
                          <span className={`text-micro font-medium transition-colors duration-700 ${config.text}`}>{config.label}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Summary panel — 2 columns */}
        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              {/* Session stats */}
              <div className="rounded-xl border border-cyan-400/15 bg-gradient-to-b from-cyan-400/[0.05] to-transparent p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-300">Session Complete</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center rounded-md bg-neuro-950/60 p-2">
                    <p className="text-lg font-bold text-emerald-400">1</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Fixed</p>
                  </div>
                  <div className="text-center rounded-md bg-neuro-950/60 p-2">
                    <p className="text-lg font-bold text-cyan-400">+64%</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Gain</p>
                  </div>
                  <div className="text-center rounded-md bg-neuro-950/60 p-2">
                    <p className="text-lg font-bold text-violet-400">4 min</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Time</p>
                  </div>
                </div>
                <div className="rounded-md border border-white/[0.06] bg-neuro-950/40 p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {"NeuroLearn identified Emma\u2019s thinking pattern, guided her to discover the answer, and corrected her understanding."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Final message + actions */}
              <div className="text-center">
                <p className="text-lg font-bold text-white mb-1">This is NeuroLearn AI.</p>
                <p className="text-xs text-slate-400 mb-4">
                  {"Not a quiz app. Not a chatbot. "}
                  <span className="text-cyan-400">A system that fixes how students think.</span>
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="/"
                    className="group flex items-center gap-2 rounded-lg border border-slate-700 bg-white/[0.02] px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-all"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Home
                  </a>
                  <button
                    onClick={onRestart}
                    className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] transition-all hover:scale-[1.03]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Watch Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
