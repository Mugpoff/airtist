import type { AppRouter } from "@repo/trpc"
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""
  return "http://localhost:3000"
}

export const trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>> =
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
  })
