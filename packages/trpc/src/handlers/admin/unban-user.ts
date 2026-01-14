import { z } from "zod"
import { adminProcedure } from "../../trpc"

const UnbanUserSchema = z.object({
  userId: z.string().uuid(),
})

export const adminUnbanUserHandler = adminProcedure
  .input(UnbanUserSchema)
  .mutation(async ({ input, ctx }) => {
    const { userId } = input

    // Use Better-Auth admin API to unban user
    const result = await ctx.auth.api.unbanUser({
      body: {
        userId,
      },
    })

    return {
      success: true,
      user: result,
    }
  })
