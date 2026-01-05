import { protectedProcedure } from "../trpc"

export const driveStatusHandler = protectedProcedure.query(async ({ ctx }) => {
  const row = await ctx.db.driveConnections.findFirst({
    where: { userId: ctx.session.user.id },
    select: { id: true },
  })

  return { connected: Boolean(row) }
})
