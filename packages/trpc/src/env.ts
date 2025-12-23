import { env as authEnv } from "@repo/auth/env"
import { env as cacheEnv } from "@repo/cache/env"
import { env as dbEnv } from "@repo/db/env"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  extends: [authEnv, cacheEnv, dbEnv],
  server: {
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_HTTP_REFERER: z.url(),
    OPENROUTER_APP_TITLE: z.string().min(1),

    MINIO_ENDPOINT: z.string().min(1),
    MINIO_REGION: z.string().min(1),
    MINIO_ACCESS_KEY: z.string().min(1),
    MINIO_SECRET_KEY: z.string().min(1),
    MINIO_BUCKET: z.string().min(1),
    MINIO_PUBLIC_ENDPOINT: z.url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI ||
    (process.env.NODE_ENV === "production" &&
      process.env.npm_lifecycle_event === "typecheck"),
})
