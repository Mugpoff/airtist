import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
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

    DRAGONFLY_URL: z.url(),
    DATABASE_URL: z.url(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
