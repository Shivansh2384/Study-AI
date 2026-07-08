import {
  pgTable, serial, text, integer, boolean, timestamp, jsonb, real,
} from "drizzle-orm/pg-core";

/* ═══════════════════════════════════════════════════════════════════════════
   STUDENTS
   ═══════════════════════════════════════════════════════════════════════════ */

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Student"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════════════════════
   LEARNING SESSIONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const learningSessions = pgTable("learning_sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  topic: text("topic").notNull(),
  questionCount: integer("question_count").notNull().default(0),
  completedQuestions: integer("completed_questions").notNull().default(0),
  understandingScore: integer("understanding_score").notNull().default(50),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

/* ═══════════════════════════════════════════════════════════════════════════
   QUESTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  concept: text("concept").notNull().default(""),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull().default("multiple_choice"),
  difficulty: integer("difficulty").notNull().default(3),
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════════════════════
   STUDENT ANSWERS
   ═══════════════════════════════════════════════════════════════════════════ */

export const studentAnswers = pgTable("student_answers", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  sessionId: integer("session_id").references(() => learningSessions.id),
  questionId: integer("question_id"),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  correctness: text("correctness").notNull().default("incorrect"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════════════════════
   AI ANALYSES
   ═══════════════════════════════════════════════════════════════════════════ */

export const aiAnalyses = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  answerId: integer("answer_id").references(() => studentAnswers.id),
  misconceptionName: text("misconception_name"),
  confidenceScore: real("confidence_score"),
  reasoningGap: text("reasoning_gap"),
  explanation: text("explanation"),
  correctionStrategy: text("correction_strategy"),
  guidedQuestion: text("guided_question"),
  fullResponse: jsonb("full_response"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════════════════════
   FLASHCARDS
   ═══════════════════════════════════════════════════════════════════════════ */

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  sourceAnswerId: integer("source_answer_id").references(() => studentAnswers.id),
  frontText: text("front_text").notNull(),
  backText: text("back_text").notNull(),
  misconception: text("misconception"),
  concept: text("concept"),
  masteryStatus: text("mastery_status").notNull().default("needs_review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════════════════════
   CONCEPT PROGRESS
   ═══════════════════════════════════════════════════════════════════════════ */

export const conceptProgress = pgTable("concept_progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  concept: text("concept").notNull(),
  masteryScore: real("mastery_score").notNull().default(0),
  status: text("status").notNull().default("needs_attention"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});
