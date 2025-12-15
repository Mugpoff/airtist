import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return "http://localhost:3000";
};

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`
    })
  ]
});
