-- AlterTable
ALTER TABLE "generated_images" ADD COLUMN     "cacheKey" UUID;

-- CreateTable
CREATE TABLE "generated_image_cache" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "requestId" TEXT,
    "aspectRatio" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "cachedTokens" INTEGER,
    "cost" TEXT,

    CONSTRAINT "generated_image_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "generated_image_cache_hash_key" ON "generated_image_cache"("hash");

-- CreateIndex
CREATE INDEX "generated_images_userId_createdAt_idx" ON "generated_images"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "generated_images_cacheKey_idx" ON "generated_images"("cacheKey");

-- AddForeignKey
ALTER TABLE "generated_images" ADD CONSTRAINT "generated_images_cacheKey_fkey" FOREIGN KEY ("cacheKey") REFERENCES "generated_image_cache"("id") ON DELETE SET NULL ON UPDATE CASCADE;
