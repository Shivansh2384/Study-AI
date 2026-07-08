/* ═══════════════════════════════════════════════════════════════════════════
   Shared types for NeuroLearn AI analysis pipeline.
   Used by both the API route (server) and dashboard UI (client).
   ═══════════════════════════════════════════════════════════════════════════ */

/** What the client sends to POST /api/analyze */
export interface AnalyzeRequest {
  question: string;
  studentAnswer: string;
  correctAnswer?: string;
  subject: string;
  topic: string;
  subtopic?: string;
  previousContext?: string;
}

/** Topic context injected into the AI prompt (server-side only) */
export interface LearningContext {
  subject: string;
  topic: string;
  subtopic: string;
  learningGoal: string;
  expectedUnderstanding: string;
  knownMisconceptionNames: string[];
}

/** Structured explanation of the misconception */
export interface MisconceptionExplanation {
  strength: string;
  thinkingGap: string;
  importance: string;
}

/** Personalized correction strategy */
export interface CorrectionStrategy {
  learningGoal: string;
  keyConcept: string;
  reflectionQuestion: string;
  nextStep: string;
}

/** A single misconception detected by the AI */
export interface DetectedMisconception {
  name: string;
  confidence: number;
  summary: string;
  explanation: MisconceptionExplanation;
  correctionStrategy: CorrectionStrategy;
  whyItHappens: string;
}

/** Concept mastery breakdown */
export interface ConceptBreakdown {
  mastered: string[];
  developing: string[];
  needsAttention: string[];
}

/** AI-generated flashcard */
export interface AIFlashcard {
  front: string;
  back: string;
}

/** Full analysis object returned from POST /api/analyze */
export interface Analysis {
  correctness: "correct" | "partially_correct" | "incorrect";
  misconceptions: DetectedMisconception[];
  guidedQuestion: string;
  analysisSummary: string;
  reasoningPattern: string;
  mentalModelGap: string;
  encouragement: string;
  concepts: ConceptBreakdown;
  flashcards: AIFlashcard[];
}

/** Full response returned from POST /api/analyze */
export interface AnalyzeResponse {
  success: boolean;
  analysis?: Analysis;
  error?: string;
}
