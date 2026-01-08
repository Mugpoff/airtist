-- CreateTable
CREATE TABLE "drive_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "googleAccountId" TEXT NOT NULL,
    "email" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "scope" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "drive_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "drive_connections_userId_idx" ON "drive_connections"("userId");

-- AddForeignKey
ALTER TABLE "drive_connections" ADD CONSTRAINT "drive_connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
