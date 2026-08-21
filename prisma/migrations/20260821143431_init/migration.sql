-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'admin');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('pending', 'awaiting_verification', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('tersedia', 'belum_tersedia');

-- CreateEnum
CREATE TYPE "ProductionSystem" AS ENUM ('pre_order', 'ready_stock');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'admin',
    "status" "AccountStatus" NOT NULL DEFAULT 'pending',
    "registration_token" TEXT NOT NULL,
    "verification_code_hash" TEXT,
    "verification_code_expires_at" TIMESTAMP(3),
    "verification_attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT,
    "stock_status" "StockStatus" NOT NULL,
    "category_id" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "production_system" "ProductionSystem" NOT NULL,
    "net_weight" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "flavor_variants" JSONB NOT NULL,
    "composition" TEXT NOT NULL,
    "nib_number" TEXT,
    "halal_certificate_number" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_registration_token_key" ON "users"("registration_token");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
