import { db } from "@repo/db"
import { publicProcedure } from "../trpc"

export const imagesListHandler = publicProcedure.query(() => {
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
