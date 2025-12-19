-- AlterTable
ALTER TABLE "generated_images" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "objectKey" TEXT,
ALTER COLUMN "imageData" DROP NOT NULL;
