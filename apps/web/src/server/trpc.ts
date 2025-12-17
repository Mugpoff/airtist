import { appRouter, createTrpcContext } from "@repo/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

export const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () =>
      createTrpcContext({
        headers: req.headers,
      }),
  })
