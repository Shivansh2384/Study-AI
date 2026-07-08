/* ═══════════════════════════════════════════════════════════════════════════
   AI Configuration — SERVER ONLY
   Constants and configuration for the AI analysis pipeline.
   ═══════════════════════════════════════════════════════════════════════════ */

export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const MODEL = "llama-3.1-8b-instant";
export const MAX_TOKENS = 1200;

/**
 * Lower temperature = more deterministic, factual, consistent responses.
 * 0.15 is aggressive but appropriate for a structured diagnostic tool
 * that must produce reliable, repeatable output.
 */
export const TEMPERATURE = 0.15;

export function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }
  return key;
}

/** A known misconception loaded from the database */
export interface KnownMisconception {
  name: string;
  summary: string;
  explanation: string;
  rootCause: string;
  correctModel: string;
  recommendedStep: string;
  triggerAnswers: string[];
}

/** Topic-level learning context, built from DB + config */
export interface TopicContext {
  subtopic: string;
  learningGoal: string;
  expectedUnderstanding: string;
  knownMisconceptions: KnownMisconception[];
}
