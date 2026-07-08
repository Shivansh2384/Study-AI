import { AlertTriangle, BookOpen, Clock, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    color: "rose",
    title: "Students don't know what they don't know",
    description:
      "87% of students cannot accurately identify their own knowledge gaps. They study topics they already know while ignoring the concepts actually causing them to fail.",
    stat: "87%",
    statLabel: "misidentify gaps",
  },
  {
    icon: BookOpen,
    color: "amber",
    title: "Current tools measure answers, not understanding",
    description:
      "Quiz apps tell students \"Wrong. The answer is B.\" They never explain why the student thought it was A. The misconception survives, and the same mistake repeats on the real test.",
    stat: "0",
    statLabel: "apps explain why",
  },
  {
    icon: Clock,
    color: "violet",
    title: "Studying harder doesn't mean learning better",
    description:
      "Students spend hours re-reading notes and watching videos. This creates the illusion of competence — they recognize material when they see it but can't apply it under pressure.",
    stat: "4hrs",
    statLabel: "wasted studying",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative py-28 lg:py-36">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/5 px-4 py-1.5 mb-6">
            <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-xs font-medium text-rose-300 tracking-wide uppercase">
              The Problem
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-white">Hard work doesn&apos;t guarantee </span>
            <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
              real learning.
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Every year, millions of students study for hours and still fail.
            Not because they&apos;re not smart enough — but because no tool shows them
            the real source of their confusion.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <ProblemCard key={i} {...p} index={i} />
          ))}
        </div>

        {/* Student quote */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="glass-light rounded-2xl p-8 text-center">
            <p className="text-lg md:text-xl text-slate-300 italic leading-relaxed">
              &quot;I studied for 4 hours and still got a C. I don&apos;t know what
              I&apos;m doing wrong.&quot;
            </p>
            <p className="mt-4 text-sm text-slate-500">
              — A frustration shared by millions of students every semester
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  icon: Icon,
  color,
  title,
  description,
  stat,
  statLabel,
}: {
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  index: number;
}) {
  const colorMap: Record<string, { border: string; bg: string; text: string; statText: string; iconBg: string }> = {
    rose: {
      border: "border-rose-500/15 hover:border-rose-500/30",
      bg: "bg-rose-500/5",
      text: "text-rose-400",
      statText: "text-rose-400",
      iconBg: "bg-rose-500/10",
    },
    amber: {
      border: "border-amber-500/15 hover:border-amber-500/30",
      bg: "bg-amber-500/5",
      text: "text-amber-400",
      statText: "text-amber-400",
      iconBg: "bg-amber-500/10",
    },
    violet: {
      border: "border-violet-500/15 hover:border-violet-500/30",
      bg: "bg-violet-500/5",
      text: "text-violet-400",
      statText: "text-violet-400",
      iconBg: "bg-violet-500/10",
    },
  };

  const c = colorMap[color] ?? colorMap.rose;

  return (
    <div
      className={`rounded-2xl border ${c.border} ${c.bg} p-7 transition-all duration-300 hover:translate-y-[-2px]`}
    >
      <div
        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.iconBg} mb-5`}
      >
        <Icon className={`h-5 w-5 ${c.text}`} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-3 leading-snug">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-5">{description}</p>
      <div className="flex items-baseline gap-2 pt-4 border-t border-white/5">
        <span className={`text-2xl font-bold ${c.statText}`}>{stat}</span>
        <span className="text-xs text-slate-500">{statLabel}</span>
      </div>
    </div>
  );
}
