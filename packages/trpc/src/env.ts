import { env as authEnv } from "@repo/auth/env"
import { env as cacheEnv } from "@repo/cache/env"
import { env as dbEnv } from "@repo/db/env"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  extends: [authEnv, dbEnv, cacheEnv],

  /**
   * Specify your shared environment variables schema here.
   */
  shared: {},

  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    OPENROUTER_API_KEY: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  clientPrefix: "NEXT_PUBLIC_",
  client: {},

  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
