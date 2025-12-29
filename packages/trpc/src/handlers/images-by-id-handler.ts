import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../trpc"

export const imagesByIdHandler = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const image = await db.generatedImages.findUnique({
      where: { id: input.id, userId: ctx.session.user.id },
    })

    if (!image) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Image not found.",
      })
    }

    return image
  })
