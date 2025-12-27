/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `generated_images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "generated_images" ADD COLUMN     "hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "generated_images_hash_key" ON "generated_images"("hash");
