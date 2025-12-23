import { db } from "@repo/db"
import { protectedProcedure } from "../trpc"

export const imagesListHandler = protectedProcedure.query(() => {
  return db.generatedImages.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      prompt: true,
      model: true,
      width: true,
      height: true,
      imageUrl: true,
    },
  })
})
