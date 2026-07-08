import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { students, questions } from "./schema";

async function seed() {
  const url = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
  const isNeon = url.includes("neon.tech");
  const pool = new Pool({ connectionString: url, ssl: isNeon ? { rejectUnauthorized: false } : undefined });
  const db = drizzle(pool);

  console.log("Seeding NeuroLearn database...\n");

  // Create default student
  const [student] = await db.insert(students).values({ name: "Emma" }).returning();
  console.log(`  Student: ${student.name} (id: ${student.id})`);

  // Seed some questions
  const qs = await db.insert(questions).values([
    { topic: "Cell Energy", concept: "Cellular Respiration", questionText: "What is the primary role of cellular respiration?", questionType: "multiple_choice", difficulty: 2, correctAnswer: "To break down glucose and release ATP for cellular work", options: JSON.stringify([{ letter: "A", text: "To break down glucose and release ATP for cellular work" }, { letter: "B", text: "To create new energy from sunlight and water" }, { letter: "C", text: "To store energy in glucose molecules" }, { letter: "D", text: "To transport oxygen throughout the cell" }]) },
    { topic: "Cell Energy", concept: "ATP", questionText: "Where is glucose primarily broken down to produce ATP?", questionType: "multiple_choice", difficulty: 2, correctAnswer: "In the mitochondria during cellular respiration", options: JSON.stringify([{ letter: "A", text: "In the mitochondria during cellular respiration" }, { letter: "B", text: "In the chloroplast during photosynthesis" }, { letter: "C", text: "In the cytoplasm during glycolysis" }, { letter: "D", text: "In the cell membrane during osmosis" }]) },
    { topic: "Cell Energy", concept: "Photosynthesis", questionText: "What is the primary purpose of photosynthesis?", questionType: "multiple_choice", difficulty: 2, correctAnswer: "To convert light energy into chemical energy stored in glucose", options: JSON.stringify([{ letter: "A", text: "To convert light energy into chemical energy stored in glucose" }, { letter: "B", text: "To produce oxygen for animals to breathe" }, { letter: "C", text: "To break down carbon dioxide" }, { letter: "D", text: "To create ATP directly from sunlight" }]) },
    { topic: "Cell Energy", concept: "Energy Flow", questionText: "What is the relationship between photosynthesis and cellular respiration?", questionType: "multiple_choice", difficulty: 3, correctAnswer: "They are complementary: photosynthesis stores energy in glucose, respiration releases it as ATP", options: JSON.stringify([{ letter: "A", text: "They are complementary: photosynthesis stores energy, respiration releases it" }, { letter: "B", text: "They are the same process in different organelles" }, { letter: "C", text: "Photosynthesis creates energy, respiration destroys it" }, { letter: "D", text: "They both produce oxygen" }]) },
    { topic: "Cell Energy", concept: "ATP", questionText: "What is ATP and why is it important?", questionType: "written", difficulty: 3, correctAnswer: "ATP is adenosine triphosphate, the cell's immediate energy currency used for all cellular work" },
  ]).returning();

  console.log(`  Questions: ${qs.length} seeded`);
  console.log("\nDone.");
  await pool.end();
}

seed().catch((err) => { console.error("Seed error:", err); process.exit(1); });
