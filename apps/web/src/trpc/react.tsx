"use client"

import type { AppRouter } from "@repo/trpc"
import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import {
  createTRPCClient,
  httpBatchStreamLink,
  httpLink,
  isNonJsonSerializable,
  loggerLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import { useState } from "react"
import SuperJSON from "superjson"
import { env } from "@/env"
import { createQueryClient } from "./query-client"

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient()
  }

  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = createQueryClient()
  }

  return clientQueryClientSingleton
}

export const trpc = createTRPCReact<AppRouter>()
export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>()

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        splitLink({
          condition: (op) => op.type === "subscription",
          true: unstable_httpSubscriptionLink({
            url: `${getBaseUrl()}/api/trpc`,
            transformer: SuperJSON,
          }),
          false: splitLink({
            condition: (op) => isNonJsonSerializable(op.input),
            true: httpLink({
              url: `${getBaseUrl()}/api/trpc`,
              transformer: {
                serialize: (data) => data,
                deserialize: SuperJSON.deserialize,
              },
              headers() {
                const headers = new Headers()
                headers.set("x-trpc-source", "nextjs-react")
                return headers
              },
            }),
            false: httpBatchStreamLink({
              transformer: SuperJSON,
              url: `${getBaseUrl()}/api/trpc`,
              headers() {
                const headers = new Headers()
                headers.set("x-trpc-source", "nextjs-react")
                return headers
              },
            }),
          }),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          {props.children}
        </TRPCProvider>
      </trpc.Provider>
    </QueryClientProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin
  return env.BETTER_AUTH_URL
}
