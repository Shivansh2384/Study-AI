import {
  ClipboardList,
  Brain,
  Lightbulb,
  Target,
  MessageSquareText,
  TrendingUp,
  ArrowDown,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Select a Topic",
    description:
      "Choose what you're studying — like Cell Energy in Biology. Our system covers the concept landscape.",
    color: "slate",
    detail: "30 seconds",
  },
  {
    number: "02",
    icon: Brain,
    title: "Diagnostic Assessment",
    description:
      "Answer 5 adaptive questions. They get harder or easier based on your responses — pinpointing exactly where your understanding breaks.",
    color: "cyan",
    detail: "2 minutes",
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Knowledge Map Reveals",
    description:
      "See a visual map of your true understanding. Mastered concepts glow green. Misconceptions are flagged in amber. Gaps appear in red.",
    color: "violet",
    detail: "Instant",
  },
  {
    number: "04",
    icon: Target,
    title: "Targeted Practice",
    description:
      "AI generates questions that attack your specific weak points. No wasted time on things you already know.",
    color: "emerald",
    detail: "3-5 minutes",
  },
  {
    number: "05",
    icon: MessageSquareText,
    title: "Explain It Back",
    description:
      "Prove your understanding by explaining the concept in your own words. Our AI evaluates the depth and accuracy of your explanation.",
    color: "amber",
    detail: "1 minute",
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "See Your Growth",
    description:
      "Your Knowledge Map updates in real-time. See exactly which misconceptions you've fixed and what to tackle next.",
    color: "cyan",
    detail: "Continuous",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 lg:py-36 bg-neuro-900/30">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-4 py-1.5 mb-6">
            <Brain className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-medium text-violet-300 tracking-wide uppercase">
              The Mastery Loop
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-white">From confusion to mastery </span>
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              in minutes.
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Every step produces visible progress. You always know where you are
            and where you&apos;re going.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={i}>
              <StepCard {...step} />
              {i < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-px h-6 bg-gradient-to-b from-white/10 to-white/5" />
                    <ArrowDown className="h-4 w-4 text-slate-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Loop indicator */}
        <div className="mt-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/15 bg-cyan-400/5 px-6 py-3">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-node-pulse" />
            <span className="text-sm text-cyan-300 font-medium">
              The loop repeats — each cycle deepens understanding
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
  color,
  detail,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  detail: string;
}) {
  const colorMap: Record<string, { border: string; text: string; iconBg: string; numText: string }> = {
    slate: {
      border: "border-slate-700/40",
      text: "text-slate-400",
      iconBg: "bg-slate-700/30",
      numText: "text-slate-600",
    },
    cyan: {
      border: "border-cyan-400/15",
      text: "text-cyan-400",
      iconBg: "bg-cyan-400/10",
      numText: "text-cyan-400/40",
    },
    violet: {
      border: "border-violet-400/15",
      text: "text-violet-400",
      iconBg: "bg-violet-400/10",
      numText: "text-violet-400/40",
    },
    emerald: {
      border: "border-emerald-400/15",
      text: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
      numText: "text-emerald-400/40",
    },
    amber: {
      border: "border-amber-400/15",
      text: "text-amber-400",
      iconBg: "bg-amber-400/10",
      numText: "text-amber-400/40",
    },
  };

  const c = colorMap[color] ?? colorMap.slate;

  return (
    <div
      className={`group rounded-2xl border ${c.border} bg-neuro-950/40 p-6 transition-all duration-300 hover:bg-neuro-950/60 hover:translate-x-1`}
    >
      <div className="flex items-start gap-5">
        {/* Number + Icon */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-mono font-bold ${c.numText}`}>
            {number}
          </span>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.iconBg}`}>
            <Icon className={`h-5 w-5 ${c.text}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <span className="hidden sm:inline-flex text-micro font-mono text-slate-600 uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-full flex-shrink-0">
              {detail}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
