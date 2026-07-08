import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, topic, count, style } = body as {
      subject?: string;
      topic?: string;
      count?: number;
      style?: string;
    };

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Missing topic" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "AI service not configured" },
        { status: 503 }
      );
    }

    const numQ = Math.min(count ?? 5, 15);
    const wantMC = style === "mc" || style === "mixed";

    const prompt = `Generate exactly ${numQ} educational diagnostic questions about "${topic}" for a high school student.

The questions should test conceptual understanding of the topic.

${wantMC ? `Make ALL questions multiple choice with exactly 4 options (A, B, C, D). One option must be the correct answer. The other 3 should be plausible but wrong — based on real student misconceptions.` : `Make all questions open-ended written response questions that test conceptual understanding.`}

Return ONLY a valid JSON object with this structure:
{
  "questions": [
    {
      "questionText": "The question",
      "correctAnswer": "The full correct answer text"${wantMC ? `,
      "options": [
        {"letter": "A", "text": "First option"},
        {"letter": "B", "text": "Second option"},
        {"letter": "C", "text": "Third option"},
        {"letter": "D", "text": "Fourth option"}
      ]` : `,
      "options": null`},
      "difficulty": 3
    }
  ]
}

Rules:
- Every question must be about the given topic
- Test conceptual understanding, not memorization
- For MC: correctAnswer text must EXACTLY match one option's text
- Vary difficulty between 2 and 4
- Return ONLY the JSON object`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an educational question generator. Return only valid JSON. No markdown.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to generate questions" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { success: false, error: "Empty AI response" },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content);
    // The AI might return { questions: [...] } or [...] or other wrappers
    let questions: Record<string, unknown>[] = [];
    if (Array.isArray(parsed)) {
      questions = parsed;
    } else if (typeof parsed === "object" && parsed !== null) {
      // Find the first array value in the object
      for (const val of Object.values(parsed)) {
        if (Array.isArray(val) && val.length > 0) {
          questions = val as Record<string, unknown>[];
          break;
        }
      }
    }

    // Normalize — handle multiple possible field names
    const valid = questions
      .filter((q) => {
        const qt = q.questionText ?? q.question_text ?? q.question;
        const ca = q.correctAnswer ?? q.correct_answer ?? q.answer;
        return qt && ca;
      })
      .map((q, i: number) => ({
        id: -(i + 100),
        questionText: String(q.questionText ?? q.question_text ?? q.question),
        correctAnswer: String(q.correctAnswer ?? q.correct_answer ?? q.answer),
        options: q.options ?? null,
        difficulty: Number(q.difficulty ?? 3),
      }));

    return NextResponse.json({ success: true, questions: valid });
  } catch (err) {
    console.error("Generate questions error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
