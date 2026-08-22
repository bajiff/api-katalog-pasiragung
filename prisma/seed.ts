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
  let superAdmin = await prisma.user.findFirst({
    where: { role: "super_admin" },
  });

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin123!",
      12
    );

    superAdmin = await prisma.user.create({
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
  } else {
    console.log("✅ Super admin already exists, skipping super admin seed.");
  }

  // --- Seed Categories ---
  console.log("🌱 Seeding categories...");
  const categoryNames = ["Makanan", "Minuman", "Kerajinan", "Jasa", "Pertanian"];
  const createdCategories = [];

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdCategories.push(category);
  }
  console.log(`✅ Seeded ${createdCategories.length} categories.`);

  // --- Seed Products ---
  console.log("🌱 Seeding sample products...");
  const makananCategory = createdCategories.find(c => c.name === "Makanan")!;
  const minumanCategory = createdCategories.find(c => c.name === "Minuman")!;

  const sampleProducts = [
    {
      name: "Keripik Kalentong Khas Pasiragung",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      stockStatus: "belum_tersedia" as const,
      categoryId: makananCategory.id,
      whatsappNumber: "6289876543210",
      description: "Kalentong asli buatan UMKM Desa Pasiragung yang renyah dan gurih, sangat cocok untuk camilan keluarga dan sudah bersertifikat halal.",
      ownerName: "Ibu Harni",
      productionSystem: "pre_order" as const,
      netWeight: "200 gram",
      price: 15000,
      flavorVariants: ["Original", "Manis"],
      composition: "Beras ketan, gula putih, gula merah, vanili, air, garam",
      createdBy: superAdmin.id,
    },
    {
      name: "Keripik Pisang Khas Pasiragung",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      stockStatus: "tersedia" as const,
      categoryId: makananCategory.id,
      whatsappNumber: "6281234567890",
      description: "Keripik pisang asli buatan UMKM Desa Pasiragung yang renyah dan gurih, sangat cocok untuk camilan dan disarankan untuk nyetok yang banyak.",
      ownerName: "Ibu Siti",
      productionSystem: "ready_stock" as const,
      netWeight: "250 gram",
      price: 15000,
      flavorVariants: ["Original", "Balado", "Coklat"],
      composition: "Pisang kepok pilihan, minyak sawit, bumbu perasa",
      createdBy: superAdmin.id,
    },
    {
      name: "Kopi Bubuk Robusta Pasiragung",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      stockStatus: "belum_tersedia" as const,
      categoryId: minumanCategory.id,
      whatsappNumber: "6289876543210",
      description: "Kopi bubuk robusta hasil panen petani lokal dengan cita rasa kuat dan aroma khas pegunungan.",
      ownerName: "Pak Budi",
      productionSystem: "pre_order" as const,
      netWeight: "150 gram",
      price: 25000,
      flavorVariants: ["Original"],
      composition: "100% Biji kopi robusta",
      createdBy: superAdmin.id,
    },
  ];

  for (const prod of sampleProducts) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: prod.name }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: prod
      });
    }
  }
  console.log(`✅ Seeded sample products.`);
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
