-- AlterTable
ALTER TABLE "generated_images" ADD COLUMN     "cachedTokens" INTEGER,
ADD COLUMN     "completionTokens" INTEGER,
ADD COLUMN     "cost" DECIMAL(65,30),
ADD COLUMN     "promptTokens" INTEGER,
ADD COLUMN     "totalTokens" INTEGER;
