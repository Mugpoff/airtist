import { getTranslations } from "next-intl/server"
import { DashboardUsersTable } from "@/app/dashboard/users/_components/dashboard-users-table"
import { DashboardUsersTableHeader } from "@/app/dashboard/users/_components/dashboard-users-table-header"
import { DashboardCard } from "@/components/dashboard/dashboard-card"

export default async function Page() {
  const t = await getTranslations("dashboard.users")

  return (
    <DashboardCard title={t("title")} description={t("description")}>
      <DashboardUsersTableHeader />
      <DashboardUsersTable />
    </DashboardCard>
  )
}
