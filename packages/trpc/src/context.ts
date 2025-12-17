import { auth } from "../../auth/src/server"
import { cacheClient } from "../../cache/src"
import { config } from "../../config/src"
import { db } from "../../db/src"
import { openRouterClient } from "./utils/openrouter-client"

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
