/* ═══════════════════════════════════════════════════════════════════════════
   AI Response Parser — SERVER ONLY
   Parses, validates, and normalizes AI responses.
   Includes retry-with-correction and safe fallback logic.
   ═══════════════════════════════════════════════════════════════════════════ */

import type {
  Analysis,
  DetectedMisconception,
  MisconceptionExplanation,
  CorrectionStrategy,
  ConceptBreakdown,
} from "./types";

/**
 * Attempt to parse the AI's raw string content into a validated Analysis.
 * Returns null if the content is not valid JSON or fails validation.
 */
export function parseAIAnalysis(raw: string): Analysis | null {
  try {
    const parsed = JSON.parse(raw);
    return validateAndNormalize(parsed);
  } catch {
    return null;
  }
}

/** Normalize + validate the parsed object into a guaranteed Analysis shape. */
function validateAndNormalize(
  obj: Record<string, unknown>
): Analysis | null {
  const rawCorrectness = String(obj.correctness ?? obj.isCorrect ?? "");
  let correctness: Analysis["correctness"];

  if (rawCorrectness === "correct" || rawCorrectness === "true") {
    correctness = "correct";
  } else if (
    rawCorrectness === "partially_correct" ||
    rawCorrectness === "partial"
  ) {
    correctness = "partially_correct";
  } else {
    correctness = "incorrect";
  }

  const rawMisconceptions = Array.isArray(obj.misconceptions)
    ? obj.misconceptions
    : [];

  const misconceptions: DetectedMisconception[] = rawMisconceptions.map(
    (m: Record<string, unknown>) => {
      const rawExplanation = (m.explanation ?? {}) as Record<string, unknown>;
      const explanation: MisconceptionExplanation =
        typeof rawExplanation === "string"
          ? {
              strength: String(m.understanding ?? ""),
              thinkingGap: String(m.thinkingGap ?? m.thinking_gap ?? ""),
              importance: rawExplanation,
            }
          : {
              strength: String(
                rawExplanation.strength ?? m.understanding ?? ""
              ),
              thinkingGap: String(
                rawExplanation.thinkingGap ??
                  rawExplanation.thinking_gap ??
                  m.thinkingGap ??
                  m.thinking_gap ??
                  ""
              ),
              importance: String(rawExplanation.importance ?? ""),
            };

      const rawStrategy = (m.correctionStrategy ??
        m.correction_strategy ??
        {}) as Record<string, unknown>;
      const correctionStrategy: CorrectionStrategy =
        typeof rawStrategy === "string"
          ? {
              learningGoal: "",
              keyConcept: rawStrategy,
              reflectionQuestion: String(
                m.guidedQuestion ?? m.guided_question ?? ""
              ),
              nextStep: String(
                m.recommendedStep ??
                  m.recommended_next_step ??
                  m.nextStep ??
                  ""
              ),
            }
          : {
              learningGoal: String(
                rawStrategy.learningGoal ?? rawStrategy.learning_goal ?? ""
              ),
              keyConcept: String(
                rawStrategy.keyConcept ??
                  rawStrategy.key_concept ??
                  m.hint ??
                  ""
              ),
              reflectionQuestion: String(
                rawStrategy.reflectionQuestion ??
                  rawStrategy.reflection_question ??
                  m.guidedQuestion ??
                  m.guided_question ??
                  ""
              ),
              nextStep: String(
                rawStrategy.nextStep ??
                  rawStrategy.next_step ??
                  m.recommendedStep ??
                  m.recommended_next_step ??
                  ""
              ),
            };

      return {
        name: String(m.name ?? "Unknown Pattern"),
        confidence: clampNumber(m.confidence, 0, 100, 50),
        summary: String(
          m.summary ?? m.description ?? explanation.thinkingGap ?? ""
        ),
        explanation,
        correctionStrategy,
        whyItHappens: String(
          m.whyItHappens ?? m.why_this_happens ?? m.rootCause ?? ""
        ),
      };
    }
  );

  const rawConcepts = (obj.concepts ?? {}) as Record<string, unknown>;
  const concepts: ConceptBreakdown = {
    mastered: toStringArray(rawConcepts.mastered),
    developing: toStringArray(rawConcepts.developing),
    needsAttention: toStringArray(
      rawConcepts.needsAttention ?? rawConcepts.needs_attention
    ),
  };

  if (
    concepts.mastered.length === 0 &&
    concepts.developing.length === 0 &&
    concepts.needsAttention.length === 0
  ) {
    if (correctness === "correct") {
      concepts.mastered.push("Core concept understanding");
    } else {
      concepts.needsAttention.push("Concept under review");
    }
  }

  // Extract guided question — prefer top-level, fall back to primary misconception
  let guidedQuestion = String(
    obj.guidedQuestion ?? obj.guided_question ?? ""
  );
  if (!guidedQuestion && misconceptions.length > 0) {
    guidedQuestion = misconceptions[0].correctionStrategy.reflectionQuestion;
  }

  return {
    correctness,
    misconceptions,
    guidedQuestion,
    analysisSummary: String(
      obj.analysisSummary ?? obj.analysis_summary ?? obj.overallInsight ?? ""
    ),
    reasoningPattern: String(
      obj.reasoningPattern ??
        obj.reasoning_pattern ??
        obj.thinkingPattern ??
        ""
    ),
    mentalModelGap: String(
      obj.mentalModelGap ?? obj.mental_model_gap ?? ""
    ),
    encouragement: String(obj.encouragement ?? ""),
    concepts,
    flashcards: parseFlashcards(obj.flashcards),
  };
}

function parseFlashcards(raw: unknown): { front: string; back: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((f: Record<string, unknown>) => f && typeof f.front === "string" && typeof f.back === "string")
    .map((f: Record<string, unknown>) => ({ front: String(f.front), back: String(f.back) }));
}

/**
 * Build an educational fallback when the AI cannot confidently identify
 * a misconception or returns unparseable content.
 * This is NOT an error — it's a meaningful "Let's Explore" response.
 */
export function buildFallbackAnalysis(
  studentAnswer: string,
  question: string,
  topic: string
): Analysis {
  return {
    correctness: "partially_correct",
    misconceptions: [],
    guidedQuestion: `Think about the key concepts in ${topic}. What part of your answer are you most confident about, and why?`,
    analysisSummary:
      "Your answer shows you're thinking about this topic, but it doesn't clearly match a specific learning pattern we track. Let's strengthen your understanding by working through the concept together.",
    reasoningPattern: "Exploring Your Thinking",
    mentalModelGap:
      "Your current understanding may have some gaps that need clarification. Let's work through them step by step.",
    encouragement:
      "Every attempt at answering builds your understanding. The fact that you're engaging with this material is already progress.",
    concepts: {
      mastered: [],
      developing: ["Topic engagement"],
      needsAttention: ["Core concept clarity"],
    },
    flashcards: [],
  };
}

/** Build the correction prompt for a retry after invalid JSON. */
export function buildRetryInstruction(badContent: string): string {
  return `Your previous response was not valid JSON. Here is what you returned:

${badContent.substring(0, 500)}

Please respond again with ONLY a valid JSON object matching the required format. No markdown, no code fences, no explanation text. Just the raw JSON object.`;
}

/* ─── Helpers ─── */

function clampNumber(
  val: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const n = Number(val);
  if (isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.filter((v) => typeof v === "string" && v.length > 0);
  }
  return [];
}
