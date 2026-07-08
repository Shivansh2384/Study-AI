/* ═══════════════════════════════════════════════════════════════════════════
   Guided Question Generator — SERVER ONLY
   Generates personalized Socratic questions from analysis results.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { Analysis } from "./types";

/**
 * Extract or generate the best guided question from an analysis.
 * Priority:
 * 1. The reflection question from the highest-confidence misconception
 * 2. A question synthesized from the mental model gap
 * 3. A generic exploratory question for the topic
 */
export function extractGuidedQuestion(
  analysis: Omit<Analysis, "guidedQuestion">,
  question: string,
  topic: string
): string {
  // 1. Use the primary misconception's reflection question if available
  if (analysis.misconceptions.length > 0) {
    // Sort by confidence descending to pick the strongest match
    const sorted = [...analysis.misconceptions].sort(
      (a, b) => b.confidence - a.confidence
    );
    const primary = sorted[0];
    if (primary.correctionStrategy.reflectionQuestion) {
      return primary.correctionStrategy.reflectionQuestion;
    }
  }

  // 2. Synthesize from the mental model gap
  if (analysis.mentalModelGap) {
    return `Based on your thinking, consider this: ${analysis.mentalModelGap} What would change in your answer if that were true?`;
  }

  // 3. Generic educational fallback based on topic
  return `Think about the key concepts in ${topic}. What part of your answer are you most confident about, and why?`;
}

/**
 * Generate a fallback guided question when the AI cannot identify
 * a specific misconception. These are designed to be exploratory
 * and safe — they encourage thinking without making assumptions.
 */
export function generateFallbackQuestion(
  question: string,
  topic: string
): string {
  // Use the original question to create a meta-cognitive prompt
  const starters = [
    `Let's think about this differently: ${question} What is the most important concept you need to understand to answer this?`,
    `Before answering, what do you already know about ${topic} that might help you think through this?`,
    `If you had to explain your answer to a friend, what would be the key idea you'd want them to understand?`,
  ];

  // Deterministic selection based on question length
  const idx = question.length % starters.length;
  return starters[idx];
}
