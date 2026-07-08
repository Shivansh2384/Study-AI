import { Brain, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neuro-950 bg-grid px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 mb-6">
          <Brain className="h-8 w-8 text-cyan-400/60" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">404</h1>
        <p className="text-slate-400 mb-8">
          This page doesn&apos;t exist yet. NeuroLearn is still learning.
        </p>
        <a
          href="/"
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all duration-300 hover:scale-[1.03]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </a>
      </div>
    </div>
  );
}
