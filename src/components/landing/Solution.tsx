import {
  Brain,
  Search,
  Map,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Misconception Detection",
    description:
      "Our AI doesn't just mark answers wrong — it identifies the specific misconception causing the error. \"You're confusing cellular respiration with photosynthesis\" is infinitely more useful than \"Incorrect.\"",
    color: "cyan",
    badge: "Core Innovation",
  },
  {
    icon: Map,
    title: "Knowledge Mapping",
    description:
      "A real-time visual map of your understanding. See exactly which concepts you've mastered, which have misconceptions, and where you have gaps — not just a percentage score.",
    color: "violet",
    badge: "Visual Intelligence",
  },
  {
    icon: Target,
    title: "Targeted Practice",
    description:
      "Stop wasting time on things you already know. NeuroLearn generates practice questions that target your specific gaps — the exact concepts holding you back.",
    color: "emerald",
    badge: "Personalized",
  },
];

const differentiators = [
  {
    tool: "ChatGPT",
    problem: "Gives answers instantly, creating dependency",
    neurolearn: "Guides you to discover answers yourself",
  },
  {
    tool: "Quiz Apps",
    problem: "\"Wrong. The answer is B.\" No explanation.",
    neurolearn: "Names your exact misconception and fixes it",
  },
  {
    tool: "Video Platforms",
    problem: "Same content for everyone, passive watching",
    neurolearn: "Diagnoses YOUR gaps, then targets them",
  },
  {
    tool: "AI Tutors",
    problem: "Chat-based, no persistent understanding model",
    neurolearn: "Builds a Knowledge Map that evolves with you",
  },
];

export default function Solution() {
  return (
    <section id="solution" className="relative py-28 lg:py-36">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 mb-6">
            <Brain className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300 tracking-wide uppercase">
              The Solution
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-white">Don&apos;t study harder. </span>
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Study smarter.
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            NeuroLearn AI is the first diagnostic learning platform that identifies{" "}
            <em>why</em> you&apos;re struggling, not just <em>that</em> you are.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>

        {/* Misconception Demo */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              See the difference
            </h3>
            <p className="mt-3 text-slate-400">
              What happens when a student gets a question wrong.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="rounded-2xl border border-slate-700/50 bg-neuro-900/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Traditional App
                </span>
              </div>
              <div className="rounded-xl bg-neuro-950/80 p-5 font-mono text-sm">
                <p className="text-slate-500">Q: Where does the Calvin Cycle occur?</p>
                <p className="mt-2 text-rose-400">
                  ✗ Your answer: Thylakoid membrane
                </p>
                <p className="mt-1 text-slate-400">
                  ✓ Correct answer: Stroma
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-slate-600 text-xs">Score: 2/5 (40%)</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500 italic">
                Student learns what was wrong. Doesn&apos;t learn why they thought it.
              </p>
            </div>

            {/* NeuroLearn */}
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-node-pulse" />
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  NeuroLearn AI
                </span>
              </div>
              <div className="rounded-xl bg-neuro-950/60 p-5 text-sm">
                <p className="text-slate-500 font-mono">Q: Where does the Calvin Cycle occur?</p>
                <p className="mt-2 text-rose-400 font-mono">
                  ✗ Your answer: Thylakoid membrane
                </p>
                <div className="mt-4 pt-4 border-t border-cyan-400/10">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-cyan-300 text-xs uppercase tracking-wider mb-2">
                        Misconception Detected
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        You&apos;re confusing{" "}
                        <span className="text-cyan-300 font-medium">light-dependent</span>{" "}
                        and{" "}
                        <span className="text-cyan-300 font-medium">light-independent</span>{" "}
                        reactions. The thylakoid membrane handles light reactions. The Calvin Cycle{" "}
                        is light-independent and occurs in the{" "}
                        <span className="text-emerald-400 font-medium">stroma</span>.
                      </p>
                      <p className="mt-3 text-slate-400 text-xs">
                        💡 Think of it: Light hits the membrane first, then the results move to the stroma for the Calvin Cycle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-cyan-400/80 font-medium">
                Student understands the root cause → won&apos;t repeat the mistake.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Why NeuroLearn AI is different
            </h3>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-3 bg-neuro-900/80">
              <div className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tool
              </div>
              <div className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Their Approach
              </div>
              <div className="px-6 py-4 text-xs font-semibold text-cyan-400/70 uppercase tracking-wider">
                NeuroLearn AI
              </div>
            </div>
            {differentiators.map((d, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 border-t border-white/5 ${
                  i % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"
                }`}
              >
                <div className="px-6 py-4 flex items-center">
                  <span className="text-sm font-medium text-slate-300">{d.tool}</span>
                </div>
                <div className="px-6 py-4 flex items-center">
                  <span className="text-sm text-slate-500">{d.problem}</span>
                </div>
                <div className="px-6 py-4 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-cyan-300 font-medium">{d.neurolearn}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile card stack */}
          <div className="md:hidden space-y-4">
            {differentiators.map((d, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-sm font-semibold text-white mb-2">{d.tool}</p>
                <p className="text-xs text-slate-500 mb-3">{d.problem}</p>
                <div className="flex items-start gap-2 pt-3 border-t border-white/5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-cyan-300 font-medium">{d.neurolearn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  badge: string;
}) {
  const colorMap: Record<string, { border: string; bg: string; text: string; iconBg: string; badgeBg: string; badgeText: string }> = {
    cyan: {
      border: "border-cyan-400/15 hover:border-cyan-400/30",
      bg: "hover:bg-cyan-400/5",
      text: "text-cyan-400",
      iconBg: "bg-cyan-400/10",
      badgeBg: "bg-cyan-400/10 border-cyan-400/20",
      badgeText: "text-cyan-300",
    },
    violet: {
      border: "border-violet-400/15 hover:border-violet-400/30",
      bg: "hover:bg-violet-400/5",
      text: "text-violet-400",
      iconBg: "bg-violet-400/10",
      badgeBg: "bg-violet-400/10 border-violet-400/20",
      badgeText: "text-violet-300",
    },
    emerald: {
      border: "border-emerald-400/15 hover:border-emerald-400/30",
      bg: "hover:bg-emerald-400/5",
      text: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
      badgeBg: "bg-emerald-400/10 border-emerald-400/20",
      badgeText: "text-emerald-300",
    },
  };

  const c = colorMap[color] ?? colorMap.cyan;

  return (
    <div
      className={`group rounded-2xl border ${c.border} ${c.bg} bg-neuro-900/30 p-7 transition-all duration-300 hover:translate-y-[-2px]`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.iconBg}`}>
          <Icon className={`h-5 w-5 ${c.text}`} />
        </div>
        <span
          className={`text-micro font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${c.badgeBg} ${c.badgeText}`}
        >
          {badge}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
