import { env as cacheEnv } from "@repo/cache/env"
import { env as dbEnv } from "@repo/db/env"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  extends: [dbEnv, cacheEnv],
  server: {
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI ||
    (process.env.NODE_ENV === "production" &&
      process.env.npm_lifecycle_event === "typecheck"),
})
