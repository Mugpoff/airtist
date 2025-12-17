import { auth } from "@repo/auth/server"
import { cacheClient } from "@repo/cache"
import { config } from "@repo/config"
import { db } from "@repo/db"
import { openRouterClient } from "@/utils/openrouter-client"

export const createTrpcContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  })

  return {
    auth,
    session,
    db,
    config,
    cache: cacheClient,
    openRouter: openRouterClient,
  }
}
