import { DashboardSidebar } from "@/components/dashboard/sidebar/dashboard-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex w-full">
      <DashboardSidebar />
      <div className="flex w-full justify-center">{children}</div>
    </main>
  )
}
