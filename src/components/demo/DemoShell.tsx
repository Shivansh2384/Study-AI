"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, ChevronRight, RotateCcw } from "lucide-react";

import SceneIntro from "./SceneIntro";
import SceneQuestion from "./SceneQuestion";
import SceneWrongAnswer from "./SceneWrongAnswer";
import SceneMisconception from "./SceneMisconception";
import SceneGuided from "./SceneGuided";
import SceneBreakthrough from "./SceneBreakthrough";
import SceneKnowledgeMap from "./SceneKnowledgeMap";

const TOTAL_SCENES = 7;

const sceneLabels = [
  "Meet Emma",
  "The Question",
  "Traditional vs NeuroLearn",
  "Misconception Detected",
  "Guided Discovery",
  "Breakthrough",
  "Knowledge Map",
];

export default function DemoShell() {
  const [scene, setScene] = useState(0);

  const next = useCallback(() => {
    setScene((s) => Math.min(s + 1, TOTAL_SCENES - 1));
  }, []);

  const restart = useCallback(() => {
    setScene(0);
  }, []);

  const prev = useCallback(() => {
    setScene((s) => Math.max(s - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const isLast = scene === TOTAL_SCENES - 1;

  return (
    <div className="relative h-screen flex flex-col bg-neuro-950 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[140px] animate-glow-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[140px] animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Compact top bar — logo + breadcrumb + live indicator in one row */}
      <header className="relative z-20 flex items-center justify-between px-5 md:px-8 h-12 border-b border-white/[0.04] flex-shrink-0">
        <a href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
            <Brain className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight">
            <span className="text-white">Neuro</span>
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Learn</span>
            <span className="ml-1 text-[9px] font-semibold text-cyan-400/60 uppercase tracking-wider">AI</span>
          </span>
        </a>

        {/* Desktop breadcrumb — inline in header */}
        <div className="hidden md:flex items-center gap-1">
          {sceneLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <span
                className={`text-micro font-medium tracking-wide transition-colors duration-300 ${
                  i === scene
                    ? "text-cyan-400"
                    : i < scene
                    ? "text-slate-500"
                    : "text-slate-700"
                }`}
              >
                {label}
              </span>
              {i < sceneLabels.length - 1 && (
                <ChevronRight className={`h-2.5 w-2.5 ${i < scene ? "text-slate-600" : "text-slate-800"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: current scene label */}
        <div className="flex md:hidden items-center gap-2">
          <span className="text-tiny font-medium text-cyan-400">{sceneLabels[scene]}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-tiny font-mono text-slate-600 uppercase tracking-widest">
            Live Demo
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-20 h-[2px] bg-white/[0.04] flex-shrink-0">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-violet-400"
          initial={{ width: "0%" }}
          animate={{ width: `${((scene + 1) / TOTAL_SCENES) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* Main scene area — fills remaining viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-8 py-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-4xl"
          >
            {scene === 0 && <SceneIntro onNext={next} />}
            {scene === 1 && <SceneQuestion onNext={next} />}
            {scene === 2 && <SceneWrongAnswer onNext={next} />}
            {scene === 3 && <SceneMisconception onNext={next} />}
            {scene === 4 && <SceneGuided onNext={next} />}
            {scene === 5 && <SceneBreakthrough onNext={next} />}
            {scene === 6 && <SceneKnowledgeMap onRestart={restart} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Compact bottom controls */}
      <footer className="relative z-20 flex items-center justify-between px-5 md:px-8 h-10 border-t border-white/[0.04] flex-shrink-0">
        <button
          onClick={restart}
          className="flex items-center gap-1 text-tiny text-slate-600 hover:text-slate-400 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Restart
        </button>

        <span className="text-micro font-mono text-slate-700">
          {scene + 1} / {TOTAL_SCENES}
        </span>

        {!isLast ? (
          <button
            onClick={next}
            className="flex items-center gap-1 text-tiny text-cyan-400/70 hover:text-cyan-400 transition-colors group"
          >
            Continue
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : (
          <span className="text-tiny text-slate-700">End of demo</span>
        )}
      </footer>
    </div>
  );
}
