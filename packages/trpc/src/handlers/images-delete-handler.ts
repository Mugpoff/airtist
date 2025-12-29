import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../trpc"
import { deletePng } from "../utils/storage-client"

export const imagesDeleteHandler = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const image = await db.generatedImages.findUnique({
      where: { id: input.id, userId: ctx.session.user.id },
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
      } catch {}
    }

    return { success: true }
  })
