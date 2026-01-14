import { z } from "zod"
import { adminProcedure } from "../../trpc"

const BanUserSchema = z.object({
  userId: z.string().uuid(),
  banReason: z.string().optional(),
  banExpiresInDays: z.number().min(1).optional(),
})

export const adminBanUserHandler = adminProcedure
  .input(BanUserSchema)
  .mutation(async ({ input, ctx }) => {
    const { userId, banReason, banExpiresInDays } = input

    // Calculate ban expiration date if provided
    const banExpires = banExpiresInDays
      ? new Date(Date.now() + banExpiresInDays * 24 * 60 * 60 * 1000)
      : null

    // Use Better-Auth admin API to ban user
    const result = await ctx.auth.api.banUser({
      body: {
        userId,
        banReason: banReason ?? "Banned by administrator",
        banExpiresIn: banExpiresInDays
          ? banExpiresInDays * 24 * 60 * 60
          : undefined,
      },
    })

    return {
      success: true,
      user: result,
      banExpires,
    }
  })
