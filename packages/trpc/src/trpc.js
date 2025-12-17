import { initTRPC } from "@trpc/server";
const t = initTRPC.context().create();
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
