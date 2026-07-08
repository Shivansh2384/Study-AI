/* ═══════════════════════════════════════════════════════════════════════════
   AI Service — SERVER ONLY
   Main orchestrator. Calls Groq, validates response, retries if needed.
   Guarantees the frontend always receives a usable response.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { AnalyzeRequest, AnalyzeResponse } from "./types";
import {
  GROQ_API_URL,
  MODEL,
  MAX_TOKENS,
  TEMPERATURE,
  getApiKey,
} from "./ai-config";
import type { TopicContext } from "./ai-config";
import { buildSystemPrompt, buildUserPrompt } from "./ai-prompt";
import {
  parseAIAnalysis,
  buildFallbackAnalysis,
  buildRetryInstruction,
} from "./ai-parse";
import { extractGuidedQuestion } from "./ai-guided";

export type { TopicContext };
export type { KnownMisconception } from "./ai-config";

const REQUEST_TIMEOUT_MS = 15_000;

/** Build topic context from DB data + request info. */
export function buildLearningContext(
  req: AnalyzeRequest,
  knownMisconceptions: import("./ai-config").KnownMisconception[]
): TopicContext {
  const topicGoals: Record<string, { goal: string; expected: string }> = {
    "Cell Energy": {
      goal: "Understand how cells transform stored energy into usable ATP through complementary processes of photosynthesis and cellular respiration",
      expected:
        "Students should distinguish between energy storage (photosynthesis → glucose) and energy release (cellular respiration → ATP), understand that energy is transformed not created, and identify the correct organelles for each process",
    },
  };

  const goals = topicGoals[req.topic] ?? {
    goal: `Develop conceptual understanding of ${req.topic}`,
    expected: `Accurate understanding of core ${req.topic} concepts`,
  };

  return {
    subtopic: req.subtopic ?? req.topic,
    learningGoal: goals.goal,
    expectedUnderstanding: goals.expected,
    knownMisconceptions,
  };
}

/** Send a single request to Groq with timeout protection. */
async function callGroq(
  systemPrompt: string,
  userPrompt: string
): Promise<{ ok: true; content: string } | { ok: false; error: string }> {
  try {
    const apiKey = getApiKey();
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS
    );

    let response: Response;
    try {
      response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: TEMPERATURE,
          max_tokens: MAX_TOKENS,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(`Groq API error ${response.status}:`, errorBody.substring(0, 200));

      if (response.status === 429) {
        return {
          ok: false,
          error:
            "AI analysis is temporarily busy. Please wait a moment and try again.",
        };
      }
      if (response.status >= 500) {
        return {
          ok: false,
          error:
            "The AI service is experiencing issues. Please try again shortly.",
        };
      }
      return {
        ok: false,
        error:
          "We couldn't complete the analysis right now. Please try again.",
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        ok: false,
        error: "The AI returned an empty response. Please try again.",
      };
    }

    return { ok: true, content };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error("Groq API request timed out");
      return {
        ok: false,
        error:
          "The analysis took too long. Please try again in a moment.",
      };
    }

    const isNetworkError =
      err instanceof TypeError && String(err.message).includes("fetch");
    if (isNetworkError) {
      console.error("Network error calling Groq:", err);
      return {
        ok: false,
        error:
          "Could not connect to the AI service. Please check your connection and try again.",
      };
    }

    console.error("Unexpected error calling Groq:", err);
    return {
      ok: false,
      error:
        "We couldn't fully analyze your response right now. Please try again in a moment.",
    };
  }
}

/**
 * Main entry point — analyzes a student's response.
 *
 * Guarantees:
 * - The frontend ALWAYS receives a usable AnalyzeResponse
 * - Errors are logged server-side, never exposed to the user
 * - If the AI cannot identify a misconception, an educational
 *   "Let's Explore" fallback is returned instead of an error
 */
export async function analyzeStudentResponse(
  req: AnalyzeRequest,
  knownMisconceptions?: import("./ai-config").KnownMisconception[]
): Promise<AnalyzeResponse> {
  try {
    const context = buildLearningContext(req, knownMisconceptions ?? []);
    const systemPrompt = buildSystemPrompt(context);
    const userPrompt = buildUserPrompt(req);

    // ── Attempt 1 ──
    const firstCall = await callGroq(systemPrompt, userPrompt);

    if (!firstCall.ok) {
      // Network/timeout/rate-limit error — return the user-friendly message
      return { success: false, error: firstCall.error };
    }

    const firstParse = parseAIAnalysis(firstCall.content);
    if (firstParse) {
      // Ensure guided question is populated
      if (!firstParse.guidedQuestion) {
        firstParse.guidedQuestion = extractGuidedQuestion(
          firstParse,
          req.question,
          req.topic
        );
      }
      return { success: true, analysis: firstParse };
    }

    // ── Attempt 2 — retry with correction instructions ──
    console.warn(
      "First AI response was not valid JSON, retrying with correction..."
    );

    const retryCall = await callGroq(
      systemPrompt,
      buildRetryInstruction(firstCall.content)
    );

    if (retryCall.ok) {
      const retryParse = parseAIAnalysis(retryCall.content);
      if (retryParse) {
        if (!retryParse.guidedQuestion) {
          retryParse.guidedQuestion = extractGuidedQuestion(
            retryParse,
            req.question,
            req.topic
          );
        }
        return { success: true, analysis: retryParse };
      }
    }

    // ── Both attempts returned invalid JSON — use educational fallback ──
    console.error(
      "Both AI attempts returned invalid JSON. Returning educational fallback."
    );
    return {
      success: true,
      analysis: buildFallbackAnalysis(
        req.studentAnswer,
        req.question,
        req.topic
      ),
    };
  } catch (err) {
    // Catch-all: even unexpected errors produce a safe response
    console.error("Unexpected error in analyzeStudentResponse:", err);
    return {
      success: true,
      analysis: buildFallbackAnalysis(
        req.studentAnswer,
        req.question,
        req.topic
      ),
    };
  }
}
