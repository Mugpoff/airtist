import { adminBanUserHandler } from "../handlers/admin/ban-user"
import { adminGetStatsHandler } from "../handlers/admin/get-stats"
import { adminListUsersHandler } from "../handlers/admin/list-users"
import { adminUnbanUserHandler } from "../handlers/admin/unban-user"
import { createTRPCRouter } from "../trpc"

export const adminRouter = createTRPCRouter({
  listUsers: adminListUsersHandler,
  getStats: adminGetStatsHandler,
  banUser: adminBanUserHandler,
  unbanUser: adminUnbanUserHandler,
})
