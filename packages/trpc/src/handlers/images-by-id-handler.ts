import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { publicProcedure } from "../trpc"

export const imagesByIdHandler = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const image = await db.generatedImages.findUnique({
      where: { id: input.id },
    })

    if (!image) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Image not found.",
      })
    }

    return {
      ...image,
      cost: image.cost?.toString() ?? null,
    }
  })
