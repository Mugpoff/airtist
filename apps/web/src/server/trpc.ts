import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@repo/trpc";

export type { AppRouter } from "@repo/trpc";

export const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({})
  });
