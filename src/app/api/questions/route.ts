import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const topic = request.nextUrl.searchParams.get("topic");
    if (!topic) {
      return NextResponse.json({ success: true, questions: [] });
    }

    const rows = await db.select().from(questions).where(eq(questions.topic, topic));
    return NextResponse.json({ success: true, questions: rows });
  } catch (err) {
    console.error("Questions API error:", err);
    // Return empty — built-in questions will be used as fallback
    return NextResponse.json({ success: true, questions: [] });
  }
}
