import { NextResponse } from "next/server";
import { getOrCreateStudent, getRecentSessions, getConceptProgress, getFlashcards } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const student = await getOrCreateStudent();
    const sessions = await getRecentSessions(student.id);
    const concepts = await getConceptProgress(student.id);
    const cards = await getFlashcards(student.id);

    return NextResponse.json({
      success: true,
      student: { id: student.id, name: student.name },
      sessions: sessions.map((s) => ({
        id: s.id, topic: s.topic, questionCount: s.questionCount,
        completed: s.completedQuestions, score: s.understandingScore,
        startedAt: s.startedAt, completedAt: s.completedAt,
      })),
      concepts: concepts.map((c) => ({
        concept: c.concept, score: c.masteryScore, status: c.status,
      })),
      flashcardCount: cards.length,
    });
  } catch (err) {
    console.error("Student data error:", err);
    return NextResponse.json({ success: false, error: "Failed to load data" }, { status: 500 });
  }
}
