import { MessageSquareText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function ExplainBack() {
  return (
    <section className="relative py-28 lg:py-36">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-1.5 mb-6">
              <MessageSquareText className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300 tracking-wide uppercase">
                Proof of Understanding
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-white">Can you </span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                explain it back?
              </span>
            </h2>
            <p className="mt-5 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Recognizing the right answer isn&apos;t the same as understanding it.
              NeuroLearn asks students to explain concepts in their own words —
              then evaluates their depth of understanding.
            </p>
          </div>

          {/* Explain It Back Demo */}
          <div className="rounded-2xl border border-emerald-400/10 bg-neuro-900/60 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.06)]">
            {/* Top bar */}
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-3 text-xs text-slate-500 font-mono">
                explain-back / cell-energy
              </span>
            </div>

            <div className="p-6 md:p-8">
              {/* Prompt */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Challenge
                </span>
                <p className="mt-2 text-base text-white font-medium leading-relaxed">
                  In your own words, explain why plants need both sunlight and
                  carbon dioxide for photosynthesis. What role does each play?
                </p>
              </div>

              {/* Student answer */}
              <div className="rounded-xl border border-white/5 bg-neuro-950/60 p-5 mb-6">
                <span className="text-micro font-semibold text-slate-600 uppercase tracking-wider">
                  Student&apos;s Explanation
                </span>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed italic">
                  &quot;The plant uses sunlight as energy to power the chemical
                  reaction. Carbon dioxide comes in through the stomata and
                  provides the carbon atoms. The plant uses water too, and
                  together they make glucose which the plant uses for food.&quot;
                </p>
              </div>

              {/* AI Evaluation */}
              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-300">
                    AI Understanding Analysis
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      <span className="text-emerald-300 font-medium">Correct:</span>{" "}
                      Sunlight provides energy to power the reaction
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      <span className="text-emerald-300 font-medium">Correct:</span>{" "}
                      CO₂ provides carbon atoms for building glucose
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      <span className="text-emerald-300 font-medium">Correct:</span>{" "}
                      Mentions water as a necessary reactant
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      <span className="text-amber-300 font-medium">Missing:</span>{" "}
                      Didn&apos;t explain that oxygen is released as a byproduct — this
                      is the link to why animals need plants
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="mt-5 pt-4 border-t border-emerald-400/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Understanding Level</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-emerald-400">75%</span>
                      <span className="text-xs text-slate-500">→ Strong foundation, one gap to fill</span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-xs text-slate-500">Previous</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-bold text-slate-600 line-through">42%</span>
                      <span className="text-xs text-emerald-400 font-medium">+33%</span>
                    </div>
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
