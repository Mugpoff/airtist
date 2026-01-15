import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "./router"

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

export { type AppRouter, appRouter } from "./router"
export { createTRPCContext } from "./trpc"
export * from "./utils/image-models"
export * from "./utils/studio-constants"
