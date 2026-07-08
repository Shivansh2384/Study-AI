import { ArrowRight, Sparkles, Brain, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section id="demo" className="relative py-28 lg:py-36">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-cyan-500/8 to-violet-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA card */}
          <div className="relative rounded-3xl border border-cyan-400/15 bg-gradient-to-b from-neuro-900/80 to-neuro-950/80 backdrop-blur-xl overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-violet-500/10 to-transparent pointer-events-none" />

            <div className="relative p-10 md:p-16 text-center">
              {/* Icon */}
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/20 mb-8">
                <Brain className="h-8 w-8 text-cyan-400" />
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                <span className="text-white">Ready to see what you </span>
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  actually know?
                </span>
              </h2>

              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
                Take a 5-question diagnostic. Get your personalized Knowledge Map.
                Discover misconceptions you didn&apos;t know you had. It takes less
                than 5 minutes.
              </p>

              {/* CTA button */}
              <a
                href="/demo"
                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-10 py-4 text-lg font-semibold text-white shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.45)] transition-all duration-300 hover:scale-[1.03]"
              >
                <Zap className="h-5 w-5" />
                Start Your Diagnostic
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>

              <p className="mt-5 text-sm text-slate-600">
                No account required for the demo • Free forever for students
              </p>

              {/* Trust indicators */}
              <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">AI-Powered</p>
                    <p className="text-xs text-slate-500">Adaptive diagnostics</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-400/10">
                    <Brain className="h-4 w-4 text-violet-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Science-Based</p>
                    <p className="text-xs text-slate-500">Cognitive research</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10">
                    <Zap className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">5 Minutes</p>
                    <p className="text-xs text-slate-500">To reveal your gaps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
