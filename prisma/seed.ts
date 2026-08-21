import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: "super_admin" },
  });

  if (existingSuperAdmin) {
    console.log("✅ Super admin already exists, skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin123!",
    12
  );

  const superAdmin = await prisma.user.create({
    data: {
      name: process.env.SUPER_ADMIN_NAME || "Super Admin",
      email: process.env.SUPER_ADMIN_EMAIL || "admin@pasiragung.desa.id",
      password: hashedPassword,
      role: "super_admin",
      status: "approved",
      registrationToken: crypto.randomBytes(32).toString("hex"),
    },
  });

  console.log(`✅ Super admin created: ${superAdmin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
