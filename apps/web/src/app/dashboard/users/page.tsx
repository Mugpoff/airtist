import { getTranslations } from "next-intl/server"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { DashboardUsersTable } from "./_components/dashboard-users-table"
import { DashboardUsersTableHeader } from "./_components/dashboard-users-table-header"

export default async function Page() {
  const t = await getTranslations("dashboard.users")

  return (
    <DashboardCard title={t("title")} description={t("description")}>
      <DashboardUsersTableHeader />
      <DashboardUsersTable />
    </DashboardCard>
  )
}
