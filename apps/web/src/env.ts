import { env as authEnv } from "@repo/auth/env"
import { env as dbEnv } from "@repo/db/env"
import { env as trpcEnv } from "@repo/trpc/env"
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  extends: [authEnv, dbEnv, trpcEnv],
  shared: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  },
  server: {},
  client: {},
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    !!process.env.CI ||
    (process.env.NODE_ENV === "production" &&
      process.env.npm_lifecycle_event === "typecheck"),
})
