import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-in-up opacity-0 anim-delay-1 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300 tracking-wide uppercase">
              AI-Powered Diagnostic Learning
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up opacity-0 anim-delay-2 max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] font-black leading-[1.05] tracking-tight">
            <span className="text-white">Students know they&apos;re wrong.</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift">
              We show them why.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up opacity-0 anim-delay-3 mt-6 max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed">
            NeuroLearn AI diagnoses the specific misconceptions holding students
            back, maps their true understanding, and guides them from confusion
            to mastery — in minutes, not hours.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-in-up opacity-0 anim-delay-4 mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a
              href="/demo"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.45)] transition-all duration-300 hover:scale-[1.03]"
            >
              See It In Action
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-8 py-3.5 text-base font-medium text-slate-300 hover:text-white hover:border-slate-600 hover:bg-white/10 transition-all duration-300"
            >
              How It Works
            </a>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-in-up opacity-0 anim-delay-6 mt-20 w-full max-w-3xl">
            <div className="glass rounded-2xl px-6 py-5 grid grid-cols-3 divide-x divide-cyan-400/10">
              <div className="flex flex-col items-center gap-1 px-4">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  87%
                </span>
                <span className="text-xs md:text-sm text-slate-500 text-center">
                  of students misidentify their own knowledge gaps
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 to-violet-300 bg-clip-text text-transparent">
                  3×
                </span>
                <span className="text-xs md:text-sm text-slate-500 text-center">
                  faster mastery with targeted misconception feedback
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  5 min
                </span>
                <span className="text-xs md:text-sm text-slate-500 text-center">
                  to reveal gaps that take weeks to discover
                </span>
              </div>
            </div>
          </div>

          {/* Knowledge Map Preview */}
          <div className="animate-fade-in-up opacity-0 anim-delay-7 mt-16 w-full max-w-4xl">
            <KnowledgeMapPreview />
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neuro-950 to-transparent pointer-events-none" />
    </section>
  );
}

/* ─── Inline Knowledge Map Preview ─── */
function KnowledgeMapPreview() {
  return (
    <div className="relative rounded-2xl border border-cyan-400/10 bg-neuro-900/80 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.08)]">
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-3 text-xs text-slate-500 font-mono">
          neurolearn.ai / knowledge-map / biology
        </span>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-node-pulse" />
          <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Your Knowledge Map — Cell Energy
          </span>
        </div>

        {/* Map nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mastered concept */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Mastered
              </span>
              <span className="text-xs font-mono text-emerald-400/60">94%</span>
            </div>
            <p className="text-sm font-medium text-white">Chloroplast Structure</p>
            <p className="mt-1 text-xs text-slate-500">
              You correctly identify organelle functions.
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-emerald-900/50 overflow-hidden">
              <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
            </div>
          </div>

          {/* Misconception found */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 transition-all hover:border-amber-500/40 hover:bg-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Misconception
              </span>
              <span className="text-xs font-mono text-amber-400/60">52%</span>
            </div>
            <p className="text-sm font-medium text-white">Light Reactions</p>
            <p className="mt-1 text-xs text-slate-500">
              You&apos;re confusing where ATP is produced.
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-amber-900/50 overflow-hidden">
              <div className="h-full w-[52%] rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
            </div>
          </div>

          {/* Gap found */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 transition-all hover:border-rose-500/40 hover:bg-rose-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Gap Found
              </span>
              <span className="text-xs font-mono text-rose-400/60">18%</span>
            </div>
            <p className="text-sm font-medium text-white">Electron Transport</p>
            <p className="mt-1 text-xs text-slate-500">
              Fundamental misunderstanding detected.
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-rose-900/50 overflow-hidden">
              <div className="h-full w-[18%] rounded-full bg-gradient-to-r from-rose-500 to-rose-400" />
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="mt-6 rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-cyan-400/10">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cyan-300">AI Insight</p>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                &quot;You understand the big picture of photosynthesis, but you&apos;re{" "}
                confusing{" "}
                <span className="text-cyan-300 font-medium">where reactions occur</span>.{" "}
                Specifically, you mix up thylakoid membrane vs. stroma{" "}
                processes. Let&apos;s fix that.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
