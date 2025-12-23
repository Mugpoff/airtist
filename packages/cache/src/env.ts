import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    DRAGONFLY_URL: z.url(),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI ||
    (process.env.NODE_ENV === "production" &&
      process.env.npm_lifecycle_event === "typecheck"),
})
