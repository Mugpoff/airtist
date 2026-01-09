import { db } from "@repo/db"
import { z } from "zod"
import { protectedProcedure } from "../../trpc"

const PaginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

const FiltersSchema = z.object({
  model: z.string().optional(),
  category: z.string().optional(),
})

export const imagesListHandler = protectedProcedure
  .input(z.object({ ...PaginationSchema.shape, ...FiltersSchema.shape }))
  .query(async ({ input, ctx }) => {
    const { limit, offset, model, category } = input
    const userId = ctx.session.user.id

    const where: Record<string, unknown> = { userId }

    if (model) {
      where.model = model
    }

    if (category) {
      where.prompt = { contains: category.toLowerCase() }
    }

    const [items, total] = await Promise.all([
      db.generatedImages.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          createdAt: true,
          prompt: true,
          model: true,
          width: true,
          height: true,
          imageUrl: true,
        },
      }),
      db.generatedImages.count({ where }),
    ])

    return { items, total, limit, offset }
  })
