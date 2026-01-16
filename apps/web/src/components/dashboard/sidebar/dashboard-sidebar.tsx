"use client"

import { AnalyticsUpIcon, UserListIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { config } from "@repo/config"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@repo/ui/base/sidebar"
import { Logo } from "@repo/ui/icons/Logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardSidebarFooter } from "@/components/dashboard/sidebar/dashboard-sidebar-footer"

export const DashboardSidebar = () => {
  const pathname = usePathname()

  return (
    <section className="w-fit">
      <SidebarProvider>
        <Sidebar variant="inset" className="[&>div]:gap-4">
          <SidebarHeader className="select-none p-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-foreground"
            >
              <Logo className="size-7" />
              <h1 className="font-semibold text-2xl tracking-tight">
                {config.general.name}
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/" />}
                isActive={pathname === "/dashboard"}
              >
                <HugeiconsIcon icon={AnalyticsUpIcon} />
                Tableau de bord
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarGroup>
              <SidebarGroupLabel>Utilisateurs</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/" />}
                    isActive={pathname === "/users"}
                  >
                    <HugeiconsIcon icon={UserListIcon} />
                    Liste des utilisateurs
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <DashboardSidebarFooter />
        </Sidebar>
      </SidebarProvider>
    </section>
  )
}
