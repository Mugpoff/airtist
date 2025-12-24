import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { publicProcedure } from "../trpc"
import { deletePng } from "../utils/storage-client"

export const imagesDeleteHandler = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const image = await db.generatedImages.findUnique({
      where: { id: input.id },
    })

    if (!image) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Image not found",
      })
    }

    await db.generatedImages.delete({
      where: { id: input.id },
    })

    if (image.objectKey) {
      try {
        await deletePng(image.objectKey)
      } catch {
        // fail silently
      }
    }

    return { success: true }
  })
