import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

// Buat connection pool via driver pg (bukan Prisma engine)
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,                     // max connections
  connectionTimeoutMillis: 5000, // timeout 5 detik
  idleTimeoutMillis: 30000,    // idle timeout 30 detik
});

// Buat adapter
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient dengan adapter
export const prisma = new PrismaClient({ adapter });
