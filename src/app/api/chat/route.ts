import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ reply: "AI service is not available right now." });

    const { messages, topic, question, misconception } = await request.json();

    const systemPrompt = `You are NeuroLearn AI, a supportive biology tutor helping a student understand "${topic}".

The student just answered this question incorrectly: "${question}"
${misconception ? `The misconception detected was: "${misconception}"` : ""}

Your role:
- Help the student understand the concept through conversation
- Ask guiding questions rather than lecturing
- Be encouraging and patient
- Use simple, clear language
- When the student shows understanding, congratulate them specifically
- Keep responses short (2-4 sentences max)
- Never say "wrong" or "incorrect" — guide them instead
- If they say they understand, verify with a quick question before confirming

You are NOT a generic chatbot. Stay focused on this specific biology concept.`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (response.status === 429) {
      return NextResponse.json({ reply: "", rateLimited: true });
    }

    if (!response.ok) {
      return NextResponse.json({ reply: "", error: true });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "", error: true });
  }
}
