import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background p-8">{children}</main>
    </div>
  )
}
