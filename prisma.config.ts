import { defineConfig } from "prisma/config";

export default defineConfig({
  // Lokasi schema utama
  schema: "prisma/schema.prisma",

  // Konfigurasi migrations & seed
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Catatan: DATABASE_URL dikonfigurasi via env var di runtime (src/config/prisma.ts)
  // Tidak perlu didefinisikan di sini agar `prisma generate` bisa berjalan tanpa env var
});
