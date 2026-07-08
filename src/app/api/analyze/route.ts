import { NextRequest, NextResponse } from "next/server";
import { analyzeStudentResponse } from "@/lib/ai";
import type { AnalyzeRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, studentAnswer, subject, topic } = body as Partial<AnalyzeRequest>;

    if (!question || !studentAnswer || !subject || !topic) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await analyzeStudentResponse(
      { question, studentAnswer, subject, topic, correctAnswer: body.correctAnswer, subtopic: body.subtopic, previousContext: body.previousContext },
      [] // No DB misconceptions — using built-in prompt knowledge
    );

    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
