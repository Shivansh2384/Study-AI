"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Brain, Sparkles, CheckCircle2, AlertCircle, ArrowRight, LogOut,
  Target, Send, Loader2, MessageCircle, BookOpen, RotateCcw, Settings2,
} from "lucide-react";
import type { AnalyzeResponse, Analysis, DetectedMisconception } from "@/lib/types";
import {
  createInitialSession, updateStatsFromAnalysis, updateMisconceptions,
  updateConcepts, generateFlashcardsFromAnalysis,
  type SessionData, type Flashcard, type LearningStats,
  type MisconceptionRecord, type InsightRecord,
} from "@/lib/learning-data";
import { getBuiltinQuestions } from "@/lib/builtin-questions";

/* ═══════════════════════════════════════════════════════════════════════════ */

interface MCOption { letter: string; text: string }
interface LQ { id: number; questionText: string; correctAnswer: string; options: MCOption[]; difficulty: number; mode: "mc" | "written" }
interface LogEntry { id: string; question: string; answer: string; correctness: Analysis["correctness"]; ts: number }
interface ChatMsg { role: "user" | "assistant"; content: string }
type Phase = "home" | "setup" | "config" | "loading" | "learning" | "review" | "result";
type QStyle = "mc" | "written" | "mixed";
interface Cfg { topic: string; count: number; style: QStyle }

function parseOpts(r: unknown): MCOption[] { if (!r) return []; try { const p = typeof r === "string" ? JSON.parse(r) : r; if (!Array.isArray(p)) return []; return p.filter((o: Record<string, unknown>) => o.letter && o.text).map((o: Record<string, unknown>) => ({ letter: String(o.letter), text: String(o.text) })); } catch { return []; } }
function style(qs: { id: number; questionText: string; correctAnswer: string; options: MCOption[]; difficulty: number }[], s: QStyle): LQ[] { return qs.map((q) => { const mc = q.options.length >= 2; if (s === "written") return { ...q, options: [], mode: "written" as const }; if (s === "mc") return mc ? { ...q, mode: "mc" as const } : { ...q, mode: "written" as const }; return mc ? { ...q, mode: Math.random() < 0.5 ? "mc" as const : "written" as const } : { ...q, mode: "written" as const }; }); }
function isRight(q: LQ, l: string): boolean { if (!q.correctAnswer) return false; const s = q.options.find((o) => o.letter === l); if (!s) return false; const a = q.correctAnswer.toLowerCase().trim(), b = s.text.toLowerCase().trim(); return b === a || a.includes(b) || b.includes(a); }
function okAnalysis(q: LQ): Analysis { return { correctness: "correct", misconceptions: [], guidedQuestion: "", analysisSummary: "", reasoningPattern: "", mentalModelGap: "", encouragement: "Correct! You got it right.", concepts: { mastered: [q.questionText.substring(0, 50)], developing: [], needsAttention: [] }, flashcards: [] }; }

async function smartFetch(url: string, body: object, setT: (v: string) => void): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; msg: string }> {
  const t0 = Date.now();
  for (let i = 0; i < 5; i++) {
    if (Date.now() - t0 > 60000) return { ok: false, msg: "Please try again in about a minute." };
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.rateLimited || (typeof d.error === "string" && /rate.limit|429|busy/i.test(d.error))) {
        if (Date.now() - t0 > 55000) return { ok: false, msg: "Please try again in about a minute." };
        setT(`Thinking${".".repeat((i % 3) + 1)}`);
        await new Promise((r) => setTimeout(r, Math.min(3000 * (i + 1), 10000)));
        continue;
      }
      if (d.success === false && d.error) return { ok: false, msg: String(d.error) };
      return { ok: true, data: d };
    } catch { if (i < 4) { setT("Connecting..."); await new Promise((r) => setTimeout(r, 2000)); continue; } return { ok: false, msg: "Could not connect. Please try again." }; }
  }
  return { ok: false, msg: "Please try again." };
}

const TOPICS = ["Cell Energy", "Photosynthesis", "Cellular Respiration", "ATP"];
const COUNTS = [5, 8, 10, 15];

/* ═══════════════════════════════════════════════════════════════════════════ */

interface HomeData { sessions: { id: number; topic: string; score: number; completed: number; questionCount: number; startedAt: string; completedAt: string | null }[]; concepts: { concept: string; score: number; status: string }[]; flashcardCount: number }

export default function DashboardView() {
  const { data: authSession, status: authStatus } = useSession();
  const router = useRouter();

  // Redirect to sign in only when definitively not authenticated
  useEffect(() => {
    if (authStatus === "unauthenticated") router.replace("/signin");
  }, [authStatus, router]);

  const [phase, setPhase] = useState<Phase>("home");
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [homeLoading, setHomeLoading] = useState(true);
  const [custom, setCustom] = useState("");
  const [cfg, setCfg] = useState<Cfg>({ topic: "", count: 8, style: "mixed" });
  const [sess, setSess] = useState<SessionData>(createInitialSession("", "Biology", ""));
  const [qs, setQs] = useState<LQ[]>([]);
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [think, setThink] = useState("Thinking...");
  const [result, setResult] = useState<Analysis | null>(null);
  const [err, setErr] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [loadErr, setLoadErr] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatIn, setChatIn] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [chatQ, setChatQ] = useState("");
  const [chatMis, setChatMis] = useState("");
  const [dbStudentId, setDbStudentId] = useState<number | null>(null);
  const [dbSessionId, setDbSessionId] = useState<number | null>(null);

  const topic = cfg.topic;
  const q = qs[qi];

  // Load learning history on mount
  useEffect(() => {
    fetch("/api/student-data").then((r) => r.json()).then((d) => {
      if (d.success) setHomeData(d);
    }).catch(() => {}).finally(() => setHomeLoading(false));
  }, []);

  // Refresh home data when returning to home
  function goHome() {
    reset();
    setPhase("home");
    setHomeLoading(true);
    fetch("/api/student-data").then((r) => r.json()).then((d) => { if (d.success) setHomeData(d); }).catch(() => {}).finally(() => setHomeLoading(false));
  }

  function pickTopic(t: string) { setCfg((c) => ({ ...c, topic: t })); setPhase("config"); }

  async function go() {
    setSess(createInitialSession("", "Biology", cfg.topic));
    setPhase("loading"); setQi(0); setResult(null); setAns(""); setSel(null); setErr(""); setLog([]); setFlipped(new Set()); setMastered(new Set()); setLoadErr(""); setChat([]);
    // Start DB session (non-blocking — if it fails, app still works)
    try { const r = await fetch("/api/save-progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start-session", studentName: "Student", topic: cfg.topic, questionCount: cfg.count }) }); const d = await r.json(); if (d.success) { setDbStudentId(d.studentId); setDbSessionId(d.sessionId); } } catch {}
    const mc = cfg.style === "mc" || cfg.style === "mixed";
    let all: { id: number; questionText: string; correctAnswer: string; options: MCOption[]; difficulty: number }[] = [];

    // 1. Try DB
    try { const r = await fetch(`/api/questions?subject=Biology&topic=${encodeURIComponent(cfg.topic)}`); const d = await r.json(); if (d.success && d.questions?.length > 0) all = d.questions.map((q: Record<string, unknown>) => ({ id: Number(q.id), questionText: String(q.questionText ?? q.question_text), correctAnswer: String(q.correctAnswer ?? q.correct_answer ?? ""), options: parseOpts(q.options), difficulty: Number(q.difficulty ?? 3) })); } catch {}

    // 2. Try AI generation (non-blocking — if it fails, we still have built-in)
    if (all.length < cfg.count) {
      try {
        const r = await smartFetch("/api/generate-questions", { subject: "Biology", topic: cfg.topic, count: cfg.count - all.length, style: mc ? "mc" : "written" }, setThink);
        if (r.ok) { const g = ((r.data.questions as Record<string, unknown>[]) || []).map((q, i) => ({ id: -(i + 1), questionText: String(q.questionText ?? q.question_text ?? q.question), correctAnswer: String(q.correctAnswer ?? q.correct_answer ?? q.answer ?? ""), options: parseOpts(q.options), difficulty: Number(q.difficulty ?? 3) })); all = [...all, ...g]; }
      } catch {}
    }

    // 3. Built-in questions as guaranteed fallback
    if (all.length < cfg.count) {
      const builtin = getBuiltinQuestions(cfg.topic, cfg.count - all.length);
      const mapped = builtin.map((q, i) => ({ id: -(100 + i), questionText: q.questionText, correctAnswer: q.correctAnswer, options: q.options ? q.options.map((o) => ({ letter: o.letter, text: o.text })) : [], difficulty: q.difficulty }));
      all = [...all, ...mapped];
    }

    if (!all.length) { setLoadErr("Could not load questions. Try a different topic."); setPhase("config"); return; }
    setQs(style(all, cfg.style).sort(() => Math.random() - 0.5).slice(0, cfg.count)); setPhase("learning");
  }

  async function submit() {
    const txt = q?.mode === "mc" && sel ? (q.options.find((o) => o.letter === sel)?.text ?? "") : ans.trim();
    if (!txt || busy || !q) return;
    // MC correct → instant
    if (q.mode === "mc" && sel && isRight(q, sel)) { const a = okAnalysis(q); setResult(a); proc(a, q.questionText, txt); return; }
    setBusy(true); setErr(""); setResult(null); setThink("Thinking...");
    const r = await smartFetch("/api/analyze", { question: q.questionText, studentAnswer: txt, correctAnswer: q.correctAnswer || undefined, subject: "Biology", topic }, setThink);
    if (r.ok && (r.data as { analysis?: Analysis }).analysis) {
      const a = (r.data as { analysis: Analysis }).analysis;
      setResult(a); proc(a, q.questionText, txt);
      if (a.correctness !== "correct") { setChatQ(q.questionText); setChatMis(a.misconceptions[0]?.name || ""); const first = a.guidedQuestion || a.misconceptions[0]?.correctionStrategy?.reflectionQuestion || "Let\u2019s work through this. What part is confusing?"; setChat([{ role: "assistant", content: first }]); }
    } else {
      // AI failed — build a local "incorrect" result so the student can still continue
      const fallback: Analysis = { correctness: "incorrect", misconceptions: [], guidedQuestion: "", analysisSummary: q.correctAnswer ? `The correct answer is: ${q.correctAnswer}` : "Let\u2019s review this concept together.", reasoningPattern: "", mentalModelGap: "", encouragement: "That\u2019s not quite right, but every attempt helps you learn.", concepts: { mastered: [], developing: [], needsAttention: [] }, flashcards: [] };
      setResult(fallback); proc(fallback, q.questionText, txt);
      setChatQ(q.questionText); setChatMis("");
      setChat([{ role: "assistant", content: q.correctAnswer ? `The correct answer is: ${q.correctAnswer}. What part was tricky for you?` : "Let\u2019s work through this together. What was your reasoning?" }]);
    }
    setBusy(false);
  }

  function proc(a: Analysis, question: string, answer: string) {
    setLog((p) => [{ id: `${Date.now()}`, question, answer, correctness: a.correctness, ts: Date.now() }, ...p]);
    setSess((p) => { const s = updateStatsFromAnalysis(p.stats, a); const m = updateMisconceptions(p.misconceptions, a); const c = updateConcepts(p.concepts, a); const fc1 = (a.flashcards || []).map((f, i) => ({ id: `f${Date.now()}${i}`, front: f.front, back: f.back, concept: a.reasoningPattern, source: "ai" as const })); const fc2 = generateFlashcardsFromAnalysis(a); const ins: InsightRecord = { id: `i${Date.now()}`, text: a.analysisSummary, concept: a.reasoningPattern, recommendation: a.guidedQuestion, timestamp: Date.now() }; return { ...p, stats: s, misconceptions: m, concepts: c, flashcards: [...fc1, ...fc2, ...p.flashcards].filter((f, i, a) => a.findIndex((x) => x.front === f.front) === i), insights: [ins, ...p.insights].slice(0, 10) }; });
    // Save to DB (non-blocking)
    if (dbStudentId && dbSessionId) {
      fetch("/api/save-progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save-answer", studentId: dbStudentId, sessionId: dbSessionId, questionText: question, answerText: answer, isCorrect: a.correctness === "correct", correctness: a.correctness, analysis: a }) }).catch(() => {});
    }
  }

  async function sendChat() {
    if (!chatIn.trim() || chatBusy) return;
    const u: ChatMsg = { role: "user", content: chatIn.trim() };
    const msgs = [...chat, u]; setChat(msgs); setChatIn(""); setChatBusy(true);
    const r = await smartFetch("/api/chat", { messages: msgs, topic, question: chatQ, misconception: chatMis }, setThink);
    if (r.ok && (r.data as { reply?: string }).reply) setChat([...msgs, { role: "assistant", content: String((r.data as { reply: string }).reply) }]);
    else setChat([...msgs, { role: "assistant", content: "Give me a moment... try again shortly." }]);
    setChatBusy(false);
  }

  function next() {
    setResult(null); setAns(""); setSel(null); setErr(""); setChat([]);
    if (qi < qs.length - 1) { setQi((i) => i + 1); }
    else {
      // Complete session in DB
      if (dbSessionId) { fetch("/api/save-progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "complete-session", sessionId: dbSessionId, score: sess.stats.understanding, completed: sess.stats.totalQuestions }) }).catch(() => {}); }
      if (sess.flashcards.length > 0) setPhase("review"); else setPhase("result");
    }
  }
  function reset() { setPhase("home"); setCustom(""); setCfg({ topic: "", count: 8, style: "mixed" }); setQs([]); setQi(0); setResult(null); setAns(""); setSel(null); setSess(createInitialSession("", "Biology", "")); setLog([]); setFlipped(new Set()); setMastered(new Set()); setLoadErr(""); setChat([]); setChatIn(""); }

  if (authStatus === "loading" || authStatus === "unauthenticated") {
    return <div className="min-h-screen flex items-center justify-center bg-neuro-950"><div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 animate-pulse" /></div>;
  }

  return (
    <div className="min-h-screen bg-neuro-950 bg-grid">
      <div className="pointer-events-none fixed inset-0"><div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[150px]" /><div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[150px]" /></div>
      <header className="relative z-20 border-b border-white/[0.04] bg-neuro-950/80 backdrop-blur-xl sticky top-0">
        <div className="mx-auto max-w-6xl px-6 flex h-14 items-center justify-between">
          <a href="/" className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_16px_rgba(34,211,238,0.2)]"><Brain className="h-4 w-4 text-white" strokeWidth={2.5} /></div><span className="text-sm font-bold tracking-tight"><span className="text-white">Neuro</span><span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Learn</span><span className="ml-1 text-micro font-semibold text-cyan-400/60 uppercase tracking-wider">AI</span></span></a>
          <div className="flex items-center gap-3">
            {phase === "setup" && <button onClick={() => setPhase("home")} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Back</button>}
            {["learning", "review", "result"].includes(phase) && <><div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]"><div className="h-2 w-2 rounded-full bg-emerald-400" /><span className="text-xs text-slate-300">{topic}</span></div><button onClick={goHome} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Home</button></>}
            {authSession?.user && (
              <div className="flex items-center gap-2">
                {authSession.user.image ? <img src={authSession.user.image} alt="" className="h-7 w-7 rounded-full border border-white/[0.1]" /> : <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 flex items-center justify-center"><span className="text-micro font-bold text-cyan-300">{authSession.user.name?.[0] ?? "U"}</span></div>}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-micro text-slate-600 hover:text-slate-400 transition-colors"><LogOut className="h-3 w-3" /></button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-8 pb-20">
        <AnimatePresence mode="wait">
          {phase === "home" && <W k="h"><Home data={homeData} loading={homeLoading} onStart={() => setPhase("setup")} userName={authSession?.user?.name ?? undefined} /></W>}
          {phase === "setup" && <W k="s"><Setup onPick={pickTopic} custom={custom} onCustom={setCustom} /></W>}
          {phase === "config" && <W k="c"><Config cfg={cfg} onCfg={setCfg} onGo={go} onBack={() => setPhase("setup")} err={loadErr} /></W>}
          {phase === "loading" && <W k="ld"><div className="flex flex-col items-center pt-24"><motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 flex items-center justify-center mb-5"><Brain className="h-6 w-6 text-cyan-400" /></motion.div><p className="text-sm font-medium text-cyan-300">{think}</p></div></W>}
          {phase === "learning" && q && <W k="l"><Learn q={q} qi={qi} total={qs.length} topic={topic} ans={ans} onAns={setAns} sel={sel} onSel={setSel} onSubmit={submit} busy={busy} think={think} result={result} err={err} onClearErr={() => setErr("")} onNext={next} stats={sess.stats} chat={chat} chatIn={chatIn} onChatIn={setChatIn} onSendChat={sendChat} chatBusy={chatBusy} /></W>}
          {phase === "review" && <W k="v"><Review cards={sess.flashcards} flipped={flipped} mastered={mastered} onFlip={(id) => setFlipped((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; })} onMaster={(id) => setMastered((s) => new Set(s).add(id))} onDone={() => setPhase("result")} /></W>}
          {phase === "result" && <W k="r"><Results sess={sess} log={log} onRestart={goHome} /></W>}
        </AnimatePresence>
      </main>
    </div>
  );
}

function W({ k, children }: { k: string; children: React.ReactNode }) { return <motion.div key={k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>{children}</motion.div>; }

/* ═══ HOME — Learning Intelligence Center ═══ */
function Home({ data, loading, onStart, userName }: { data: HomeData | null; loading: boolean; onStart: () => void; userName?: string }) {
  const sessions = data?.sessions ?? [];
  const concepts = data?.concepts ?? [];
  const totalAnswered = sessions.reduce((a, s) => a + s.completed, 0);
  const avgScore = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + s.score, 0) / sessions.length) : 0;
  const strengths = concepts.filter((c) => c.status === "mastered");
  const growth = concepts.filter((c) => c.status !== "mastered");
  const lastSession = sessions[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-white mb-1">{userName ? <>Welcome, <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">{userName.split(" ")[0]}</span></> : "Learning Intelligence"}</h1>
        <p className="text-sm text-slate-400">Your personalized learning companion</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { v: loading ? "-" : `${avgScore || 50}%`, l: "Understanding", c: "text-cyan-400" },
          { v: loading ? "-" : `${totalAnswered}`, l: "Answered", c: "text-emerald-400" },
          { v: loading ? "-" : `${sessions.length}`, l: "Sessions", c: "text-violet-400" },
          { v: loading ? "-" : `${strengths.length}`, l: "Mastered", c: "text-amber-400" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
            <p className="text-micro text-slate-500 mt-0.5">{s.l}</p>
          </motion.div>
        ))}
      </div>

      {/* Strengths & Growth — only show if there's data */}
      {concepts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] p-4">
              <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="h-4 w-4 text-emerald-400" /><span className="text-sm font-semibold text-white">Strengths</span></div>
              <div className="space-y-1.5">{strengths.slice(0, 4).map((c, i) => <div key={i} className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-sm text-slate-300">{c.concept}</span></div>)}</div>
            </div>
          )}
          {growth.length > 0 && (
            <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.03] p-4">
              <div className="flex items-center gap-2 mb-3"><Target className="h-4 w-4 text-amber-400" /><span className="text-sm font-semibold text-white">Growth Areas</span></div>
              <div className="space-y-1.5">{growth.slice(0, 4).map((c, i) => <div key={i} className="flex items-center gap-2"><div className={`h-1.5 w-1.5 rounded-full ${c.status === "developing" ? "bg-cyan-400" : "bg-amber-400"}`} /><span className="text-sm text-slate-300">{c.concept}</span></div>)}</div>
            </div>
          )}
        </div>
      )}

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-cyan-400" /><span className="text-sm font-semibold text-white">Recent Sessions</span></div>
          <div className="space-y-2">{sessions.slice(0, 5).map((s) => {
            const acc = s.questionCount > 0 ? Math.round((s.completed / s.questionCount) * 100) : 0;
            return (
              <div key={s.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2.5">
                  <div className={`h-2 w-2 rounded-full ${s.score >= 70 ? "bg-emerald-400" : s.score >= 40 ? "bg-cyan-400" : "bg-amber-400"}`} />
                  <span className="text-sm text-white">{s.topic}</span>
                </div>
                <div className="flex items-center gap-3 text-micro text-slate-500">
                  <span>{s.score}%</span>
                  <span>{s.completed}/{s.questionCount}q</span>
                  <span>{new Date(s.startedAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}</div>
        </div>
      )}

      {/* Recommendation */}
      <div className="rounded-xl border border-cyan-400/15 bg-gradient-to-r from-cyan-400/[0.05] to-violet-400/[0.03] p-5">
        <div className="flex items-center gap-2 mb-2"><Brain className="h-4 w-4 text-cyan-400" /><span className="text-sm font-semibold text-cyan-300">Recommended Next Step</span></div>
        <p className="text-sm text-slate-300 mb-4">
          {growth.length > 0
            ? `Practice "${growth[0].concept}" to strengthen your understanding.`
            : sessions.length > 0
            ? "Great progress! Try a new topic to expand your knowledge."
            : "Start your first learning session to begin building your knowledge profile."
          }
        </p>
        <button onClick={onStart} className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all hover:scale-[1.02]">
          Start Practice Session <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

/* ═══ SETUP ═══ */
function Setup({ onPick, custom, onCustom }: { onPick: (t: string) => void; custom: string; onCustom: (v: string) => void }) {
  return (<div className="flex flex-col items-center text-center pt-12 max-w-lg mx-auto"><div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 flex items-center justify-center mx-auto mb-5"><Brain className="h-7 w-7 text-cyan-400" /></div><h1 className="text-3xl font-bold text-white mb-2">What do you want to learn?</h1><p className="text-sm text-slate-400 mb-8">Pick a topic or type your own.</p><div className="w-full space-y-3">{TOPICS.map((t) => <button key={t} onClick={() => onPick(t)} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] transition-all flex items-center gap-3"><BookOpen className="h-4 w-4 text-violet-400" /><span className="text-sm text-white">{t}</span></button>)}<div className="pt-2 flex gap-3"><input type="text" value={custom} onChange={(e) => onCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && custom.trim()) onPick(custom.trim()); }} placeholder="Type any topic" className="flex-1 rounded-xl border border-white/[0.08] bg-neuro-950/60 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400/40 transition-all" /><button onClick={() => { if (custom.trim()) onPick(custom.trim()); }} disabled={!custom.trim()} className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40 transition-all">Go</button></div></div></div>);
}

/* ═══ CONFIG ═══ */
function Config({ cfg, onCfg, onGo, onBack, err }: { cfg: Cfg; onCfg: (c: Cfg) => void; onGo: () => void; onBack: () => void; err: string }) {
  return (<div className="max-w-md mx-auto pt-10 text-center"><h2 className="text-2xl font-bold text-white mb-1">{cfg.topic}</h2><p className="text-sm text-slate-400 mb-6">Set up your session</p>{err && <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.03] p-3 text-sm text-amber-300 mb-4">{err}</div>}<div className="space-y-5"><div><p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Questions</p><div className="grid grid-cols-4 gap-2">{COUNTS.map((n) => <button key={n} onClick={() => onCfg({ ...cfg, count: n })} className={`rounded-lg border py-2.5 text-sm font-semibold transition-all ${cfg.count === n ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : "border-white/[0.06] text-slate-400 hover:border-white/[0.12]"}`}>{n}</button>)}</div></div><div><p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Style</p><div className="grid grid-cols-3 gap-2">{([["mc", "Multiple Choice"], ["written", "Written"], ["mixed", "Mixed"]] as [QStyle, string][]).map(([v, l]) => <button key={v} onClick={() => onCfg({ ...cfg, style: v })} className={`rounded-lg border py-2.5 text-sm font-medium transition-all ${cfg.style === v ? "border-violet-400/50 bg-violet-400/10 text-violet-300" : "border-white/[0.06] text-slate-400 hover:border-white/[0.12]"}`}>{l}</button>)}</div></div><div className="flex gap-3 pt-2"><button onClick={onBack} className="flex-1 rounded-xl border border-white/[0.08] py-3 text-sm text-slate-400 hover:text-white transition-all">Back</button><button onClick={onGo} className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 py-3 text-sm font-semibold text-white hover:scale-[1.02] transition-all">Start</button></div></div></div>);
}

/* ═══ LEARNING — The core experience ═══ */
function Learn({ q, qi, total, topic, ans, onAns, sel, onSel, onSubmit, busy, think, result, err, onClearErr, onNext, stats, chat, chatIn, onChatIn, onSendChat, chatBusy }: {
  q: LQ; qi: number; total: number; topic: string; ans: string; onAns: (v: string) => void; sel: string | null; onSel: (v: string | null) => void; onSubmit: () => void; busy: boolean; think: string; result: Analysis | null; err: string; onClearErr: () => void; onNext: () => void; stats: LearningStats; chat: ChatMsg[]; chatIn: string; onChatIn: (v: string) => void; onSendChat: () => void; chatBusy: boolean;
}) {
  const mc = q.mode === "mc" && q.options.length >= 2;
  const hasAns = mc ? !!sel : !!ans.trim();
  const wrong = result && result.correctness !== "correct";
  const right = result?.correctness === "correct";
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3"><div className="flex-1 h-1 rounded-full bg-neuro-800/80 overflow-hidden"><motion.div animate={{ width: `${((qi + (result ? 1 : 0)) / total) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" transition={{ duration: 0.5 }} /></div><span className="text-micro text-slate-500 font-mono">{qi + 1}/{total}</span><span className="text-micro text-slate-600">{stats.understanding}%</span></div>

      {/* Question */}
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
        <div className="flex items-center gap-2 mb-3"><div className="h-2 w-2 rounded-full bg-cyan-400 animate-node-pulse" /><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{topic}</span><span className={`text-micro px-2 py-0.5 rounded-full ml-auto ${mc ? "bg-violet-400/10 text-violet-300" : "bg-cyan-400/10 text-cyan-300"}`}>{mc ? "Multiple Choice" : "Written"}</span></div>
        <p className="text-base font-medium text-white leading-relaxed">{q.questionText}</p>
      </div>

      {/* Answer input — only when no result */}
      {!result && !err && (<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
        {mc ? <div className="space-y-2">{q.options.map((o) => { const s = sel === o.letter; return <button key={o.letter} onClick={() => onSel(o.letter)} disabled={busy} className={`w-full rounded-xl border p-3.5 flex items-center gap-3 text-left transition-all ${s ? "border-violet-400/50 bg-violet-400/10" : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12]"}`}><span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${s ? "bg-violet-400/20 text-violet-300" : "bg-white/[0.04] text-slate-500"}`}>{o.letter}</span><span className={`text-sm ${s ? "text-white font-medium" : "text-slate-400"}`}>{o.text}</span>{s && <CheckCircle2 className="h-4 w-4 text-violet-400 ml-auto" />}</button>; })}</div>
        : <textarea value={ans} onChange={(e) => onAns(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); } }} placeholder="Type your answer" rows={2} className="w-full rounded-xl border border-white/[0.08] bg-neuro-950/60 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-400/40 transition-all resize-none" />}
        <div className="flex justify-end"><button onClick={onSubmit} disabled={!hasAns || busy} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02]">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit</button></div>
      </motion.div>)}

      {/* Loading */}
      <AnimatePresence>{busy && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4 flex items-center gap-3"><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" /><span className="text-sm text-cyan-300">{think}</span></motion.div>}</AnimatePresence>

      {/* Error */}
      {err && <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.03] p-4 flex items-start gap-3"><AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" /><div><p className="text-sm text-amber-300 mb-1">{err}</p><button onClick={onClearErr} className="text-xs text-cyan-400">Try again</button></div></div>}

      {/* ═══ CORRECT ═══ */}
      {right && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 text-center"><CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" /><p className="text-lg font-bold text-emerald-300">Correct!</p><p className="text-sm text-slate-400 mt-1">{result.encouragement}</p></div>
        <button onClick={onNext} className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] mx-auto">{qi < total - 1 ? "Next Question" : "Finish"} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></button>
      </motion.div>}

      {/* ═══ WRONG — Clean banner + insight + inline chat ═══ */}
      {wrong && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Simple banner */}
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
          <div className="flex items-center gap-2 mb-1.5"><AlertCircle className="h-5 w-5 text-amber-400" /><span className="text-sm font-semibold text-amber-300">Not quite right</span>{result.reasoningPattern && <span className="text-micro bg-amber-400/10 text-amber-300/80 px-2 py-0.5 rounded-full ml-auto">{result.reasoningPattern}</span>}</div>
          <p className="text-sm text-slate-300 leading-relaxed">{result.analysisSummary || result.encouragement}</p>
        </div>

        {/* Inline chat */}
        <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3"><MessageCircle className="h-4 w-4 text-violet-400" /><span className="text-sm font-semibold text-white">{"Let\u2019s work through this"}</span></div>
          <div className="space-y-2.5 max-h-[40vh] overflow-y-auto mb-3 pr-1">
            {chat.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${m.role === "user" ? "bg-violet-400/10 border border-violet-400/15" : "bg-white/[0.03] border border-white/[0.06]"}`}>
                  {m.role === "assistant" && <div className="flex items-center gap-1 mb-1"><Sparkles className="h-3 w-3 text-cyan-400" /><span className="text-micro text-cyan-300 font-semibold">NeuroLearn</span></div>}
                  <p className="text-sm text-slate-300 leading-relaxed">{m.content}</p>
                </div>
              </motion.div>
            ))}
            {chatBusy && <div className="flex justify-start"><div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3.5 py-2.5 flex items-center gap-2"><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="h-2 w-2 rounded-full bg-cyan-400" /><span className="text-sm text-slate-400">{think}</span></div></div>}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2">
            <input type="text" value={chatIn} onChange={(e) => onChatIn(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") onSendChat(); }} placeholder="Type your question" disabled={chatBusy} className="flex-1 rounded-lg border border-white/[0.08] bg-neuro-950/60 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-400/40 transition-all" />
            <button onClick={onSendChat} disabled={!chatIn.trim() || chatBusy} className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-40 transition-all"><Send className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Continue button */}
        <button onClick={onNext} className="group flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-5 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-400/[0.1] transition-all mx-auto"><CheckCircle2 className="h-4 w-4" /> I understand, continue</button>
      </motion.div>}
    </div>
  );
}

/* ═══ REVIEW ═══ */
function Review({ cards, flipped, mastered, onFlip, onMaster, onDone }: { cards: Flashcard[]; flipped: Set<string>; mastered: Set<string>; onFlip: (id: string) => void; onMaster: (id: string) => void; onDone: () => void }) {
  const rem = cards.filter((f) => !mastered.has(f.id));
  return (<div className="max-w-2xl mx-auto pt-4"><div className="text-center mb-6"><Sparkles className="h-8 w-8 text-violet-400 mx-auto mb-3" /><h2 className="text-2xl font-bold text-white mb-1">Review Your Gaps</h2><p className="text-sm text-slate-400">{rem.length} remaining</p></div>{rem.length > 0 ? <div className="space-y-3">{rem.map((c) => { const f = flipped.has(c.id); return <div key={c.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"><button onClick={() => onFlip(c.id)} className="w-full p-4 text-left"><div className="flex justify-between mb-1"><span className="text-micro text-slate-500">{f ? "Answer" : "Question"}</span><RotateCcw className="h-3 w-3 text-slate-600" /></div><p className="text-sm text-white">{f ? c.back : c.front}</p></button>{f && <div className="border-t border-white/[0.04] px-4 py-2.5 flex justify-between"><button onClick={() => onFlip(c.id)} className="text-xs text-slate-500">Again</button><button onClick={() => onMaster(c.id)} className="text-xs text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Got it</button></div>}</div>; })}</div> : <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-6 text-center"><CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" /><p className="text-emerald-300">All reviewed!</p></div>}<div className="mt-6 text-center"><button onClick={onDone} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03]">See Results <ArrowRight className="h-4 w-4" /></button></div></div>);
}

/* ═══ RESULTS ═══ */
function Results({ sess, log, onRestart }: { sess: SessionData; log: LogEntry[]; onRestart: () => void }) {
  const s = sess.stats; const acc = s.totalQuestions > 0 ? Math.round((s.correct / s.totalQuestions) * 100) : 0;
  return (<div className="max-w-2xl mx-auto space-y-5 pt-4"><div className="text-center mb-4"><CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" /><h2 className="text-2xl font-bold text-white mb-1">Session Complete</h2><p className="text-sm text-slate-400">{sess.profile.topic}</p></div><div className="grid grid-cols-4 gap-3">{[{ v: `${s.understanding}%`, l: "Understanding", c: "text-cyan-400" }, { v: `${s.correct}`, l: "Correct", c: "text-emerald-400" }, { v: `${acc}%`, l: "Accuracy", c: "text-violet-400" }, { v: `${s.totalQuestions}`, l: "Questions", c: "text-slate-300" }].map((x, i) => <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center"><p className={`text-xl font-bold ${x.c}`}>{x.v}</p><p className="text-micro text-slate-500">{x.l}</p></div>)}</div>{sess.misconceptions.length > 0 && <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"><p className="text-sm font-semibold text-white mb-2">Patterns Detected</p>{sess.misconceptions.map((p) => <div key={p.id} className="flex items-center justify-between py-1.5"><div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${p.status === "needs-attention" ? "bg-amber-400" : "bg-cyan-400"}`} /><span className="text-sm text-white">{p.name}</span></div><span className="text-xs font-mono text-amber-400/70">{p.confidence}%</span></div>)}</div>}<div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"><p className="text-sm font-semibold text-white mb-2">Log</p>{log.map((e) => <div key={e.id} className="flex items-center gap-2 py-1.5"><div className={`h-1.5 w-1.5 rounded-full ${e.correctness === "correct" ? "bg-emerald-400" : e.correctness === "partially_correct" ? "bg-cyan-400" : "bg-amber-400"}`} /><p className="text-sm text-slate-300 truncate flex-1">{e.answer}</p></div>)}</div><div className="text-center pt-2"><button onClick={onRestart} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03]">New Session <ArrowRight className="h-4 w-4" /></button></div></div>);
}
