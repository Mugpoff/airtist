import { protectedProcedure } from "../trpc"

export const driveListConnectionsHandler = protectedProcedure.query(
  async ({ ctx }) => {
    const items = await ctx.db.driveConnections.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        googleAccountId: true,
        email: true,
        scope: true,
        expiresAt: true,
        createdAt: true,
      },
    })

    return { items }
  },
)
