import { appRouter } from "@repo/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

export type { AppRouter } from "@repo/trpc"

export const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  })
