import { getTranslations } from "next-intl/server"
import { DashboardCard } from "@/components/dashboard/dashboard-card"

export default async function Page() {
  const t = await getTranslations("dashboard")

  return (
    <DashboardCard title={t("title")} description={t("description")}>
      <p>bjeguhreguehrguehgege ieruhg erighei gheighu</p>
    </DashboardCard>
  )
}
