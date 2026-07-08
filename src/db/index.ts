import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const isNeon = databaseUrl.includes("neon.tech");

const globalForDb = globalThis as typeof globalThis & {
  __neuroLearnPool?: Pool;
};

export const pool =
  globalForDb.__neuroLearnPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: isNeon ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__neuroLearnPool = pool;
}

export const db = drizzle(pool);
