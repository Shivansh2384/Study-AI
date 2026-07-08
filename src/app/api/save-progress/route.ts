import { NextRequest, NextResponse } from "next/server";
import {
  getOrCreateStudent, createSession, completeSession,
  saveAnswer, saveAnalysis, saveFlashcard, updateConceptProgress,
} from "@/lib/db-service";
import type { Analysis } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "start-session") {
      const student = await getOrCreateStudent(body.studentName || "Student");
      const session = await createSession(student.id, body.topic, body.questionCount);
      return NextResponse.json({ success: true, studentId: student.id, sessionId: session.id });
    }

    if (action === "save-answer") {
      const { studentId, sessionId, questionText, answerText, isCorrect, correctness, analysis } = body;
      const answer = await saveAnswer(studentId, sessionId, questionText, answerText, isCorrect, correctness);

      if (analysis) {
        const a = analysis as Analysis;
        await saveAnalysis(answer.id, a);

        // Save flashcards from analysis
        if (a.flashcards) {
          for (const fc of a.flashcards) {
            await saveFlashcard(studentId, answer.id, fc.front, fc.back, a.reasoningPattern, a.reasoningPattern);
          }
        }

        // Update concept progress
        if (a.concepts) {
          for (const c of a.concepts.mastered) await updateConceptProgress(studentId, c, 100, "mastered");
          for (const c of a.concepts.developing) await updateConceptProgress(studentId, c, 50, "developing");
          for (const c of a.concepts.needsAttention) await updateConceptProgress(studentId, c, 20, "needs_attention");
        }
      }

      return NextResponse.json({ success: true, answerId: answer.id });
    }

    if (action === "complete-session") {
      await completeSession(body.sessionId, body.score, body.completed);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Save progress error:", err);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}
