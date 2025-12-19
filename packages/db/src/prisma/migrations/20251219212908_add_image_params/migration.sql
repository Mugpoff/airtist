/*
  Warnings:

  - You are about to drop the column `imageData` on the `generated_images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "generated_images" DROP COLUMN "imageData",
ADD COLUMN     "aspectRatio" TEXT;
