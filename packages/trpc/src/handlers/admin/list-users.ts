import { db } from "@repo/db"
import { z } from "zod"
import { adminProcedure } from "../../trpc"

const ListUsersSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "email", "name"]).default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  filterBanned: z.boolean().optional(),
})

export const adminListUsersHandler = adminProcedure
  .input(ListUsersSchema)
  .query(async ({ input }) => {
    const { limit, offset, search, sortBy, sortDirection, filterBanned } = input

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ]
    }

    if (filterBanned !== undefined) {
      where.banned = filterBanned
    }

    const [users, total] = await Promise.all([
      db.users.findMany({
        where,
        orderBy: { [sortBy]: sortDirection },
        take: limit,
        skip: offset,
        select: {
          id: true,
          createdAt: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          banned: true,
          banReason: true,
          banExpires: true,
          _count: {
            select: {
              images: true,
            },
          },
        },
      }),
      db.users.count({ where }),
    ])

    return {
      users: users.map((user) => ({
        ...user,
        imagesCount: user._count.images,
        _count: undefined,
      })),
      total,
      limit,
      offset,
    }
  })
