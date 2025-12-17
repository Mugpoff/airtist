import { initTRPC } from "@trpc/server"
import type { createTrpcContext } from "@/context"

const t = initTRPC.context<typeof createTrpcContext>().create()

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware
export const mergeRouters = t.mergeRouters
