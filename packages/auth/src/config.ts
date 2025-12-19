import { cacheClient } from "@repo/cache"
import { config } from "@repo/config"
import { db } from "@repo/db"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
  appName: config.general.name,
  database: prismaAdapter(db, {
    provider: "postgresql",
    transaction: true,
    usePlural: true,
  }),
  secondaryStorage: cacheClient.users.auth,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: config.auth.minPasswordLength,
    maxPasswordLength: config.auth.maxPasswordLength,
    requireEmailVerification: false,
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: config.auth.cookieMaxAge,
      strategy: "jwe",
      refreshCache: true,
    },
  },
  advanced: { database: { generateId: "uuid" } },
  experimental: { joins: true },
  plugins: [nextCookies()],
})

export type Session = (typeof auth)["$Infer"]["Session"]
