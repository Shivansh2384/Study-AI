import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Misconceptions are now embedded in the AI prompt system, not a separate DB table
  return NextResponse.json({ success: true, misconceptions: [] });
}
