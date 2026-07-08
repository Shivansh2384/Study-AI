/* ═══════════════════════════════════════════════════════════════════════════
   Database Service Layer — SERVER ONLY
   All database operations in one place.
   ═══════════════════════════════════════════════════════════════════════════ */

import { db } from "@/db";
import {
  students, learningSessions, questions, studentAnswers,
  aiAnalyses, flashcards, conceptProgress,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Analysis } from "./types";

/* ─── Students ─── */

export async function getOrCreateStudent(name: string = "Student") {
  const existing = await db.select().from(students).limit(1);
  if (existing.length > 0) return existing[0];
  const [student] = await db.insert(students).values({ name }).returning();
  return student;
}

/* ─── Sessions ─── */

export async function createSession(studentId: number, topic: string, questionCount: number) {
  const [session] = await db.insert(learningSessions).values({
    studentId, topic, questionCount,
  }).returning();
  return session;
}

export async function completeSession(sessionId: number, score: number, completed: number) {
  await db.update(learningSessions)
    .set({ completedAt: new Date(), understandingScore: score, completedQuestions: completed })
    .where(eq(learningSessions.id, sessionId));
}

export async function getRecentSessions(studentId: number, limit: number = 10) {
  return db.select().from(learningSessions)
    .where(eq(learningSessions.studentId, studentId))
    .orderBy(desc(learningSessions.startedAt))
    .limit(limit);
}

/* ─── Answers ─── */

export async function saveAnswer(
  studentId: number, sessionId: number, questionText: string,
  answerText: string, isCorrect: boolean, correctness: string, questionId?: number,
) {
  const [answer] = await db.insert(studentAnswers).values({
    studentId, sessionId, questionId, questionText, answerText, isCorrect, correctness,
  }).returning();
  return answer;
}

/* ─── AI Analyses ─── */

export async function saveAnalysis(answerId: number, analysis: Analysis) {
  const m = analysis.misconceptions[0];
  await db.insert(aiAnalyses).values({
    answerId,
    misconceptionName: m?.name ?? null,
    confidenceScore: m?.confidence ?? null,
    reasoningGap: m?.explanation?.thinkingGap ?? null,
    explanation: analysis.analysisSummary,
    correctionStrategy: m?.correctionStrategy?.nextStep ?? null,
    guidedQuestion: analysis.guidedQuestion,
    fullResponse: analysis as unknown as Record<string, unknown>,
  });
}

/* ─── Flashcards ─── */

export async function saveFlashcard(
  studentId: number, answerId: number,
  front: string, back: string, misconception: string, concept: string,
) {
  await db.insert(flashcards).values({
    studentId, sourceAnswerId: answerId,
    frontText: front, backText: back, misconception, concept,
  });
}

export async function getFlashcards(studentId: number) {
  return db.select().from(flashcards)
    .where(eq(flashcards.studentId, studentId))
    .orderBy(desc(flashcards.createdAt));
}

export async function updateFlashcardMastery(id: number, status: string) {
  await db.update(flashcards)
    .set({ masteryStatus: status, updatedAt: new Date() })
    .where(eq(flashcards.id, id));
}

/* ─── Concept Progress ─── */

export async function updateConceptProgress(
  studentId: number, concept: string, score: number, status: string,
) {
  const existing = await db.select().from(conceptProgress)
    .where(eq(conceptProgress.studentId, studentId))
    .limit(100);

  const found = existing.find((c) => c.concept === concept);
  if (found) {
    // Only upgrade, never downgrade
    const rank = { mastered: 3, developing: 2, needs_attention: 1 } as Record<string, number>;
    const newStatus = (rank[status] ?? 0) > (rank[found.status] ?? 0) ? status : found.status;
    const newScore = Math.max(found.masteryScore, score);
    await db.update(conceptProgress)
      .set({ masteryScore: newScore, status: newStatus, lastUpdated: new Date() })
      .where(eq(conceptProgress.id, found.id));
  } else {
    await db.insert(conceptProgress).values({ studentId, concept, masteryScore: score, status });
  }
}

export async function getConceptProgress(studentId: number) {
  return db.select().from(conceptProgress)
    .where(eq(conceptProgress.studentId, studentId));
}
