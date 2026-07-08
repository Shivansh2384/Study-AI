/* ═══════════════════════════════════════════════════════════════════════════
   Learning Data Service — SHARED (server + client)
   Business logic for tracking student learning progress.
   Separated from UI components for reusability and testability.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { Analysis } from "./types";

/* ─── Core Data Models ─── */

export interface StudentProfile {
  id: string;
  name: string;
  subject: string;
  topic: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface LearningStats {
  totalQuestions: number;
  correct: number;
  partial: number;
  incorrect: number;
  understanding: number;
  improvement: number;
  sessionsCompleted: number;
}

export interface MisconceptionRecord {
  id: string;
  name: string;
  concept: string;
  confidence: number;
  status: "resolved" | "developing" | "needs-attention";
  firstDetected: number;
  lastUpdated: number;
}

export interface ConceptProgress {
  name: string;
  mastery: "mastered" | "developing" | "needs-attention";
  confidence: number;
  lastPracticed: number;
}

export interface InsightRecord {
  id: string;
  text: string;
  concept: string;
  recommendation: string;
  timestamp: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  concept: string;
  source: "ai" | "misconception";
}

export interface SessionData {
  profile: StudentProfile;
  stats: LearningStats;
  misconceptions: MisconceptionRecord[];
  concepts: ConceptProgress[];
  insights: InsightRecord[];
  flashcards: Flashcard[];
}

/* ─── Calculations ─── */

export function calculateUnderstanding(stats: LearningStats): number {
  if (stats.totalQuestions === 0) return 50;
  const score = ((stats.correct * 3 + stats.partial * 1) / (stats.totalQuestions * 3)) * 100;
  return Math.round(Math.max(10, Math.min(100, score)));
}

export function calculateImprovement(prev: number, current: number): number {
  if (prev === 0) return 0;
  return Math.round(((current - prev) / prev) * 100);
}

/* ─── State Updaters ─── */

export function updateStatsFromAnalysis(
  stats: LearningStats,
  analysis: Analysis
): LearningStats {
  const isCorrect = analysis.correctness === "correct";
  const isPartial = analysis.correctness === "partially_correct";
  const bonus = isCorrect ? 6 : isPartial ? 2 : 0;

  const newStats: LearningStats = {
    ...stats,
    totalQuestions: stats.totalQuestions + 1,
    correct: stats.correct + (isCorrect ? 1 : 0),
    partial: stats.partial + (isPartial ? 1 : 0),
    incorrect: stats.incorrect + (!isCorrect && !isPartial ? 1 : 0),
    understanding: Math.min(100, stats.understanding + bonus),
    improvement: bonus,
    sessionsCompleted: stats.sessionsCompleted,
  };

  newStats.understanding = calculateUnderstanding(newStats);
  return newStats;
}

export function updateMisconceptions(
  existing: MisconceptionRecord[],
  analysis: Analysis
): MisconceptionRecord[] {
  const map = new Map(existing.map((m) => [m.name, m]));
  const now = Date.now();

  for (const m of analysis.misconceptions) {
    const prev = map.get(m.name);
    map.set(m.name, {
      id: prev?.id ?? `m-${now}-${Math.random().toString(36).slice(2, 6)}`,
      name: m.name,
      concept: m.correctionStrategy.keyConcept || m.name,
      confidence: m.confidence,
      status: m.confidence >= 75 ? "needs-attention" : "developing",
      firstDetected: prev?.firstDetected ?? now,
      lastUpdated: now,
    });
  }

  return Array.from(map.values());
}

export function updateConcepts(
  existing: ConceptProgress[],
  analysis: Analysis
): ConceptProgress[] {
  const map = new Map(existing.map((c) => [c.name, c]));
  const now = Date.now();

  const addConcept = (name: string, mastery: ConceptProgress["mastery"]) => {
    const prev = map.get(name);
    const rank = { mastered: 3, developing: 2, "needs-attention": 1 };
    const newMastery = prev && rank[prev.mastery] > rank[mastery] ? prev.mastery : mastery;
    map.set(name, { name, mastery: newMastery, confidence: 0, lastPracticed: now });
  };

  for (const c of analysis.concepts.mastered) addConcept(c, "mastered");
  for (const c of analysis.concepts.developing) addConcept(c, "developing");
  for (const c of analysis.concepts.needsAttention) addConcept(c, "needs-attention");

  return Array.from(map.values());
}

export function generateFlashcardsFromAnalysis(analysis: Analysis): Flashcard[] {
  const cards: Flashcard[] = [];
  const now = Date.now();

  for (const m of analysis.misconceptions) {
    if (m.correctionStrategy.keyConcept) {
      cards.push({
        id: `fc-${now}-${cards.length}`,
        front: m.correctionStrategy.reflectionQuestion || `What is the correct understanding of ${m.name}?`,
        back: m.correctionStrategy.keyConcept,
        concept: m.name,
        source: "misconception",
      });
    }
    if (m.explanation.thinkingGap && m.explanation.strength) {
      cards.push({
        id: `fc-${now}-${cards.length}`,
        front: `Why is it incorrect to say: "${m.explanation.thinkingGap.substring(0, 80)}"?`,
        back: m.explanation.importance || m.correctionStrategy.keyConcept,
        concept: m.name,
        source: "ai",
      });
    }
  }

  return cards;
}

export function createInitialSession(name: string, subject: string, topic: string): SessionData {
  return {
    profile: { id: `s-${Date.now()}`, name, subject, topic, level: "beginner" },
    stats: { totalQuestions: 0, correct: 0, partial: 0, incorrect: 0, understanding: 50, improvement: 0, sessionsCompleted: 0 },
    misconceptions: [],
    concepts: [],
    insights: [],
    flashcards: [],
  };
}
