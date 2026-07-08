import { Brain, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-neuro-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
              <Brain className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold tracking-tight">
              <span className="text-white">Neuro</span>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Learn
              </span>
              <span className="ml-1 text-micro font-semibold text-cyan-400/70 uppercase tracking-wider">
                AI
              </span>
            </span>
          </div>

          {/* Mission */}
          <p className="text-sm text-slate-500 text-center max-w-md">
            Turning studying from guesswork into science.
            <br />
            <span className="text-slate-600">
              Built for the Congressional App Challenge.
            </span>
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600 flex items-center gap-1.5">
              Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for students
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} NeuroLearn AI. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Diagnostic learning powered by artificial intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
