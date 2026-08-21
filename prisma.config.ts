import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Lokasi schema utama
  schema: "prisma/schema.prisma",

  // Konfigurasi migrations & seed
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  // Database URL
  datasource: {
    url: env("DATABASE_URL"),
  },
});
