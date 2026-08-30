import { PrismaClient } from "@prisma/client";

// PrismaClient membaca DATABASE_URL otomatis dari environment variable
export const prisma = new PrismaClient();
