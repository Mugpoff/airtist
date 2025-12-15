import { cacheClient } from "@repo/cache"
import { config } from "@repo/config"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  appName: config.general.name,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 50,
    requireEmailVerification: true,
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  secondaryStorage: cacheClient.users.auth,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: config.auth.cookieMaxAge,
      strategy: "jwe",
      refreshCache: true,
    },
  },
})
