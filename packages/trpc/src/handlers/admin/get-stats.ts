import { db } from "@repo/db"
import { adminProcedure } from "../../trpc"

export const adminGetStatsHandler = adminProcedure.query(async () => {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    bannedUsers,
    totalImages,
    activeUsers,
    newUsersLast7Days,
    imagesLast7Days,
  ] = await Promise.all([
    // Total users
    db.users.count(),
    // Banned users
    db.users.count({ where: { banned: true } }),
    // Total images generated
    db.generatedImages.count(),
    // Active users (users who generated images in last 7 days)
    db.users.count({
      where: {
        images: {
          some: {
            createdAt: { gte: sevenDaysAgo },
          },
        },
      },
    }),
    // New users in last 7 days
    db.users.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    // Images generated in last 7 days
    db.generatedImages.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    }),
  ])

  return {
    totalUsers,
    bannedUsers,
    totalImages,
    activeUsers,
    newUsersLast7Days,
    imagesLast7Days,
  }
})
