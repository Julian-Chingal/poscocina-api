/*
  Warnings:

  - You are about to drop the column `child_product_id` on the `combo_items` table. All the data in the column will be lost.
  - You are about to drop the column `combo_product_id` on the `combo_items` table. All the data in the column will be lost.
  - You are about to drop the column `isRequired` on the `combo_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `recipe_items` table. All the data in the column will be lost.
  - You are about to drop the `product_modifiers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[combo_variant_id,child_variant_id]` on the table `combo_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ingredient_id,location_id]` on the table `inventory_stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_variant_id,ingredient_id]` on the table `recipe_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `child_variant_id` to the `combo_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `combo_variant_id` to the `combo_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `inventory_stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_id` to the `recipe_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `stock_movements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "combo_items" DROP CONSTRAINT "combo_items_child_product_id_fkey";

-- DropForeignKey
ALTER TABLE "combo_items" DROP CONSTRAINT "combo_items_combo_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_modifiers" DROP CONSTRAINT "product_modifiers_product_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_items" DROP CONSTRAINT "recipe_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_ingredient_id_fkey";

-- DropIndex
DROP INDEX "combo_items_combo_product_id_child_product_id_key";

-- DropIndex
DROP INDEX "inventory_stock_ingredient_id_key";

-- DropIndex
DROP INDEX "recipe_items_product_id_ingredient_id_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "combo_items" DROP COLUMN "child_product_id",
DROP COLUMN "combo_product_id",
DROP COLUMN "isRequired",
ADD COLUMN     "child_variant_id" TEXT NOT NULL,
ADD COLUMN     "combo_variant_id" TEXT NOT NULL,
ADD COLUMN     "price_override" DECIMAL(10,2),
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "inventory_stock" ADD COLUMN     "location_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "use_recipe" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "combo_type" TEXT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "track_stock" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "recipe_items" DROP COLUMN "product_id",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "product_variant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" ADD COLUMN     "cost" DECIMAL(10,4),
ADD COLUMN     "location_id" TEXT NOT NULL,
ADD COLUMN     "product_variant_id" TEXT,
ALTER COLUMN "ingredient_id" DROP NOT NULL;

-- DropTable
DROP TABLE "product_modifiers";

-- CreateTable
CREATE TABLE "modifier_groups" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "min_select" INTEGER NOT NULL DEFAULT 0,
    "max_select" INTEGER NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "modifier_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier_options" (
    "id" TEXT NOT NULL,
    "modifier_group_id" TEXT NOT NULL,
    "ingredient_id" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ingredient_quantity" DECIMAL(10,4),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "modifier_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_slots" (
    "id" TEXT NOT NULL,
    "combo_product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "min_select" INTEGER NOT NULL DEFAULT 1,
    "max_select" INTEGER NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "combo_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_slot_options" (
    "id" TEXT NOT NULL,
    "combo_slot_id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "price_override" DECIMAL(10,2),
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "combo_slot_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_stock" (
    "id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variant_stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "modifier_groups_product_id_idx" ON "modifier_groups"("product_id");

-- CreateIndex
CREATE INDEX "modifier_options_modifier_group_id_idx" ON "modifier_options"("modifier_group_id");

-- CreateIndex
CREATE INDEX "combo_slots_combo_product_id_idx" ON "combo_slots"("combo_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "combo_slot_options_combo_slot_id_product_variant_id_key" ON "combo_slot_options"("combo_slot_id", "product_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "variant_stock_product_variant_id_location_id_key" ON "variant_stock"("product_variant_id", "location_id");

-- CreateIndex
CREATE INDEX "combo_items_combo_variant_id_idx" ON "combo_items"("combo_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "combo_items_combo_variant_id_child_variant_id_key" ON "combo_items"("combo_variant_id", "child_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_ingredient_id_location_id_key" ON "inventory_stock"("ingredient_id", "location_id");

-- CreateIndex
CREATE INDEX "product_variants_product_id_idx" ON "product_variants"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_items_product_variant_id_ingredient_id_key" ON "recipe_items"("product_variant_id", "ingredient_id");

-- CreateIndex
CREATE INDEX "stock_movements_ingredient_id_created_at_idx" ON "stock_movements"("ingredient_id", "created_at");

-- CreateIndex
CREATE INDEX "stock_movements_product_variant_id_created_at_idx" ON "stock_movements"("product_variant_id", "created_at");

-- CreateIndex
CREATE INDEX "stock_movements_location_id_idx" ON "stock_movements"("location_id");

-- CreateIndex
CREATE INDEX "stock_movements_reference_idx" ON "stock_movements"("reference");

-- AddForeignKey
ALTER TABLE "modifier_groups" ADD CONSTRAINT "modifier_groups_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_options" ADD CONSTRAINT "modifier_options_modifier_group_id_fkey" FOREIGN KEY ("modifier_group_id") REFERENCES "modifier_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_options" ADD CONSTRAINT "modifier_options_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_items" ADD CONSTRAINT "combo_items_combo_variant_id_fkey" FOREIGN KEY ("combo_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_items" ADD CONSTRAINT "combo_items_child_variant_id_fkey" FOREIGN KEY ("child_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_slots" ADD CONSTRAINT "combo_slots_combo_product_id_fkey" FOREIGN KEY ("combo_product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_slot_options" ADD CONSTRAINT "combo_slot_options_combo_slot_id_fkey" FOREIGN KEY ("combo_slot_id") REFERENCES "combo_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_slot_options" ADD CONSTRAINT "combo_slot_options_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock" ADD CONSTRAINT "inventory_stock_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_stock" ADD CONSTRAINT "variant_stock_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_stock" ADD CONSTRAINT "variant_stock_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
