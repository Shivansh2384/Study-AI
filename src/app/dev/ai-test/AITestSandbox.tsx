"use client";

import { useState, useRef } from "react";
import {
  Brain,
  Send,
  Loader2,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
  Lightbulb,
  Sparkles,
  MessageCircle,
  Zap,
  ChevronDown,
  Beaker,
  Copy,
  Check,
} from "lucide-react";
import type { AnalyzeResponse, Analysis, DetectedMisconception } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════════════
   TEST FIXTURE DATA
   ═══════════════════════════════════════════════════════════════════════════ */

interface TestCase {
  label: string;
  question: string;
  answer: string;
  correctAnswer: string;
}

const CATEGORIES: { name: string; color: string; tests: TestCase[] }[] = [
  {
    name: "Incorrect Answers",
    color: "rose",
    tests: [
      {
        label: "Energy creation myth",
        question: "What is the role of cellular respiration?",
        answer: "Cellular respiration creates energy.",
        correctAnswer:
          "To break down glucose and release ATP for cellular work",
      },
      {
        label: "Photosynthesis reversal",
        question: "What is the role of cellular respiration?",
        answer: "Plants perform respiration to make sunlight.",
        correctAnswer:
          "To break down glucose and release ATP for cellular work",
      },
      {
        label: "ATP as food",
        question: "What is ATP and why is it important?",
        answer: "ATP is food for the cell.",
        correctAnswer:
          "ATP is adenosine triphosphate, the immediate energy currency produced in mitochondria for all cellular work",
      },
    ],
  },
  {
    name: "Partially Correct",
    color: "amber",
    tests: [
      {
        label: "Correct process, vague mechanism",
        question: "What is the role of cellular respiration?",
        answer:
          "Cellular respiration helps cells make ATP from glucose.",
        correctAnswer:
          "To break down glucose and release ATP for cellular work",
      },
      {
        label: "Good chain, missing detail",
        question:
          "What is the relationship between photosynthesis and cellular respiration?",
        answer:
          "Plants use sunlight to make glucose, which cells later use for energy.",
        correctAnswer:
          "They are complementary: photosynthesis stores energy in glucose, cellular respiration releases it as ATP",
      },
    ],
  },
  {
    name: "Correct / Advanced",
    color: "emerald",
    tests: [
      {
        label: "Textbook-level answer",
        question: "What is the role of cellular respiration?",
        answer:
          "Cellular respiration converts the chemical energy stored in glucose into ATP through a series of metabolic reactions.",
        correctAnswer:
          "To break down glucose and release ATP for cellular work",
      },
      {
        label: "Complementary processes",
        question:
          "What is the relationship between photosynthesis and cellular respiration?",
        answer:
          "Photosynthesis stores energy in glucose, while cellular respiration releases that stored energy to produce ATP.",
        correctAnswer:
          "They are complementary: photosynthesis stores energy in glucose, cellular respiration releases it as ATP",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AITestSandbox() {
  const [question, setQuestion] = useState(
    "What is the role of cellular respiration?"
  );
  const [answer, setAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(
    "To break down glucose and release ATP for cellular work"
  );
  const [topic, setTopic] = useState("Cell Energy");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [requestTime, setRequestTime] = useState("");
  const [copied, setCopied] = useState(false);
  const startRef = useRef(0);

  async function handleSubmit() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setResult(null);
    startRef.current = Date.now();
    setRequestTime(new Date().toLocaleTimeString());

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          studentAnswer: answer.trim(),
          correctAnswer: correctAnswer || undefined,
          subject: "Biology",
          topic,
        }),
      });
      const data: AnalyzeResponse = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: "Network error." });
    } finally {
      setElapsed(Date.now() - startRef.current);
      setLoading(false);
    }
  }

  function loadTest(t: TestCase) {
    setQuestion(t.question);
    setAnswer(t.answer);
    setCorrectAnswer(t.correctAnswer);
    setResult(null);
  }

  function handleCopyJSON() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-neuro-950 text-white">
      {/* Header */}
      <header className="border-b border-white/[0.04] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/30">
              <Beaker className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">
                AI Testing Sandbox
              </h1>
              <p className="text-micro text-slate-500">
                Internal QA — not visible to users
              </p>
            </div>
          </div>
          <a href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            {"← Back to app"}
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left: Input panel ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Test fixtures */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Quick Test Fixtures
              </p>
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="mb-3 last:mb-0">
                  <p
                    className={`text-micro font-semibold mb-1.5 ${
                      cat.color === "rose"
                        ? "text-rose-400"
                        : cat.color === "amber"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {cat.name}
                  </p>
                  <div className="space-y-1">
                    {cat.tests.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => loadTest(t)}
                        className="w-full text-left rounded-md border border-white/[0.04] bg-white/[0.01] px-3 py-2 text-xs text-slate-400 hover:text-white hover:border-white/[0.1] hover:bg-white/[0.03] transition-all"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom input form */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Custom Input
              </p>

              <div>
                <label className="text-micro text-slate-500 mb-1 block">
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-md border border-white/[0.08] bg-neuro-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/40"
                >
                  <option value="Cell Energy">Cell Energy</option>
                  <option value="Photosynthesis">Photosynthesis</option>
                  <option value="Cellular Respiration">
                    Cellular Respiration
                  </option>
                  <option value="ATP">ATP</option>
                </select>
              </div>

              <div>
                <label className="text-micro text-slate-500 mb-1 block">
                  Question
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-white/[0.08] bg-neuro-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/40 resize-none"
                />
              </div>

              <div>
                <label className="text-micro text-slate-500 mb-1 block">
                  Student Answer
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={3}
                  placeholder={"Type or load a test fixture\u2026"}
                  className="w-full rounded-md border border-white/[0.08] bg-neuro-950 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-400/40 resize-none"
                />
              </div>

              <div>
                <label className="text-micro text-slate-500 mb-1 block">
                  Correct Answer (optional)
                </label>
                <textarea
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-white/[0.08] bg-neuro-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-400/40 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? "Analyzing\u2026" : "Analyze"}
                </button>
                {result && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-xs text-slate-400 hover:text-white transition-all"
                    title="Rerun same prompt"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Rerun
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Results panel ── */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.03] p-6 flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                <div>
                  <p className="text-sm font-medium text-cyan-300">
                    Analyzing thinking pattern...
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Querying Groq with misconception database context
                  </p>
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-10 text-center">
                <Brain className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  Load a test fixture or enter a custom answer to begin.
                </p>
              </div>
            )}

            {!loading && result && (
              <ResultDisplay
                result={result}
                elapsed={elapsed}
                requestTime={requestTime}
                onCopy={handleCopyJSON}
                copied={copied}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESULT DISPLAY
   ═══════════════════════════════════════════════════════════════════════════ */

function ResultDisplay({
  result,
  elapsed,
  requestTime,
  onCopy,
  copied,
}: {
  result: AnalyzeResponse;
  elapsed: number;
  requestTime: string;
  onCopy: () => void;
  copied: boolean;
}) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="space-y-4">
      {/* Meta bar */}
      <div className="flex items-center justify-between text-micro text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {requestTime}
          </div>
          <span>{"•"}</span>
          <span
            className={
              elapsed < 3000
                ? "text-emerald-400"
                : elapsed < 6000
                ? "text-amber-400"
                : "text-rose-400"
            }
          >
            {(elapsed / 1000).toFixed(2)}s
          </span>
          <span>{"•"}</span>
          <span>{result.success ? "✓ Success" : "✗ Error"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            className="flex items-center gap-1 text-micro text-slate-600 hover:text-slate-300 transition-colors"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? "Copied" : "JSON"}
          </button>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center gap-1 text-micro text-slate-600 hover:text-slate-300 transition-colors"
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                showRaw ? "rotate-180" : ""
              }`}
            />
            Raw
          </button>
        </div>
      </div>

      {/* Error state */}
      {!result.success && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4">
          <p className="text-sm text-rose-300 font-medium mb-1">
            Analysis Failed
          </p>
          <p className="text-xs text-slate-400">{result.error}</p>
        </div>
      )}

      {/* Success state */}
      {result.success && result.analysis && (
        <AnalysisDisplay analysis={result.analysis} />
      )}

      {/* Raw JSON */}
      {showRaw && (
        <div className="rounded-xl border border-white/[0.06] bg-neuro-950 p-4 overflow-auto max-h-96">
          <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function AnalysisDisplay({ analysis: a }: { analysis: Analysis }) {
  const correctnessConfig = {
    correct: {
      label: "Correct",
      color: "text-emerald-400",
      border: "border-emerald-400/20",
      bg: "bg-emerald-400/[0.05]",
      icon: CheckCircle2,
    },
    partially_correct: {
      label: "Partially Correct",
      color: "text-cyan-400",
      border: "border-cyan-400/20",
      bg: "bg-cyan-400/[0.05]",
      icon: AlertCircle,
    },
    incorrect: {
      label: "Incorrect",
      color: "text-amber-400",
      border: "border-amber-400/20",
      bg: "bg-amber-400/[0.05]",
      icon: AlertCircle,
    },
  };
  const cc = correctnessConfig[a.correctness];
  const Icon = cc.icon;

  return (
    <div className="space-y-4">
      {/* Correctness + Pattern */}
      <div className={`rounded-xl border ${cc.border} ${cc.bg} p-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${cc.color}`} />
            <span className={`text-sm font-semibold ${cc.color}`}>
              {cc.label}
            </span>
          </div>
          {a.reasoningPattern && (
            <span className="text-micro bg-white/[0.06] text-slate-300 px-2 py-0.5 rounded-full">
              {a.reasoningPattern}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {a.encouragement}
        </p>
      </div>

      {/* Mental model gap */}
      {a.mentalModelGap && a.correctness !== "correct" && (
        <div className="rounded-lg border border-violet-400/15 bg-violet-400/[0.04] p-3">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-micro font-semibold text-violet-300 mb-0.5">
                Mental Model Gap
              </p>
              <p className="text-sm text-slate-300">{a.mentalModelGap}</p>
            </div>
          </div>
        </div>
      )}

      {/* Guided question */}
      {a.guidedQuestion && a.correctness !== "correct" && (
        <div className="rounded-lg border border-cyan-400/15 bg-gradient-to-r from-violet-400/[0.05] to-cyan-400/[0.03] p-3">
          <div className="flex items-start gap-2">
            <MessageCircle className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-micro font-semibold text-violet-300 mb-0.5">
                Guided Question
              </p>
              <p className="text-sm text-white font-medium">
                {a.guidedQuestion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Misconceptions */}
      {a.misconceptions.map((m, i) => (
        <MisconceptionCard key={i} m={m} />
      ))}

      {/* Concepts */}
      {(a.concepts.mastered.length > 0 ||
        a.concepts.developing.length > 0 ||
        a.concepts.needsAttention.length > 0) && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-micro font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Concept Breakdown
          </p>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <ConceptList
              items={a.concepts.mastered}
              label="Mastered"
              color="text-emerald-400"
            />
            <ConceptList
              items={a.concepts.developing}
              label="Developing"
              color="text-amber-400"
            />
            <ConceptList
              items={a.concepts.needsAttention}
              label="Needs Attention"
              color="text-rose-400"
            />
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-3">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-micro font-semibold text-cyan-300 mb-0.5">
              AI Summary
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {a.analysisSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MisconceptionCard({ m }: { m: DetectedMisconception }) {
  const barColor =
    m.confidence >= 75
      ? "from-amber-500 to-amber-400"
      : m.confidence >= 60
      ? "from-amber-500/70 to-amber-400/70"
      : "from-slate-500 to-slate-400";

  return (
    <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-4 space-y-3">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">
              {m.name}
            </span>
          </div>
          <span className="text-sm font-bold font-mono text-amber-400">
            {m.confidence}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-neuro-800/80 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
            style={{ width: `${m.confidence}%` }}
          />
        </div>
        {m.summary && (
          <p className="mt-2 text-xs text-slate-400 italic">{m.summary}</p>
        )}
      </div>

      {/* Explanation */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
        <p className="text-micro font-semibold text-slate-400 uppercase tracking-wider">
          Explanation
        </p>
        {m.explanation.strength && (
          <Row
            icon={CheckCircle2}
            color="text-emerald-400"
            label="Strength"
            text={m.explanation.strength}
          />
        )}
        {m.explanation.thinkingGap && (
          <Row
            icon={AlertCircle}
            color="text-amber-400"
            label="Thinking Gap"
            text={m.explanation.thinkingGap}
          />
        )}
        {m.explanation.importance && (
          <Row
            icon={Lightbulb}
            color="text-violet-400"
            label="Why It Matters"
            text={m.explanation.importance}
          />
        )}
      </div>

      {/* Why */}
      {m.whyItHappens && (
        <Row
          icon={Brain}
          color="text-slate-400"
          label="Root Cause"
          text={m.whyItHappens}
        />
      )}

      {/* Correction strategy */}
      <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] p-3 space-y-2">
        <p className="text-micro font-semibold text-cyan-300 uppercase tracking-wider">
          Correction Strategy
        </p>
        {m.correctionStrategy.learningGoal && (
          <Row
            icon={Target}
            color="text-cyan-400"
            label="Goal"
            text={m.correctionStrategy.learningGoal}
          />
        )}
        {m.correctionStrategy.keyConcept && (
          <Row
            icon={Sparkles}
            color="text-cyan-400"
            label="Key Concept"
            text={m.correctionStrategy.keyConcept}
          />
        )}
        {m.correctionStrategy.reflectionQuestion && (
          <Row
            icon={MessageCircle}
            color="text-cyan-400"
            label="Reflect"
            text={m.correctionStrategy.reflectionQuestion}
          />
        )}
        {m.correctionStrategy.nextStep && (
          <Row
            icon={Zap}
            color="text-emerald-400"
            label="Next Step"
            text={m.correctionStrategy.nextStep}
          />
        )}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  color,
  label,
  text,
}: {
  icon: React.ElementType;
  color: string;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className={`h-3.5 w-3.5 ${color} mt-0.5 flex-shrink-0`} />
      <p className="text-xs text-slate-300 leading-relaxed">
        <span className={`${color} font-medium`}>{label}: </span>
        {text}
      </p>
    </div>
  );
}

function ConceptList({
  items,
  label,
  color,
}: {
  items: string[];
  label: string;
  color: string;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className={`text-micro font-semibold ${color} mb-1`}>{label}</p>
      {items.map((c, i) => (
        <p key={i} className="text-slate-400 mb-0.5">
          {"• "}
          {c}
        </p>
      ))}
    </div>
  );
}
