import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const isPrisma =
  process.env.npm_lifecycle_event === "prisma" ||
  process.argv.some((arg) => arg.includes("prisma"))

export const env = createEnv({
  shared: {},
  server: {
    DATABASE_URL: z.string().url(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: process.env,
  skipValidation:
    isPrisma || !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
