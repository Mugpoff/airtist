import { generateImageHandler } from "./handlers/generate-image-handler";
import { createTRPCRouter, publicProcedure } from "./trpc";
export const appRouter = createTRPCRouter({
    health: publicProcedure.query(() => "ok"),
    image: {
        generate: generateImageHandler,
    },
});
