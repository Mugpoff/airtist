import { publicProcedure } from "../trpc"

export const pingHandler = publicProcedure.query(() => "pong")
