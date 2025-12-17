import { PrismaPg } from "@prisma/adapter-pg"
import { config } from "@repo/config"
import { env } from "./env"
import { PrismaClient } from "./generated/prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
})

export const db =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log: config.env.isDevelopment ? ["query", "error", "warn"] : ["error"],
  })

if (config.env.isDevelopment) globalThis.prisma = db

export * from "./generated/prisma/client"
