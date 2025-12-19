import { appRouter, createTRPCContext } from "@repo/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

export const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
      }),
  })
