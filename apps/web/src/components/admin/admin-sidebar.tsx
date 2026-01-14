"use client"

import {
  ChartHistogramIcon,
  Home09Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@repo/ui/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

type NavItem = {
  href: string
  icon: typeof ChartHistogramIcon
  labelKey: "dashboard" | "users"
}

const adminNavItems: NavItem[] = [
  {
    href: "/admin",
    icon: ChartHistogramIcon,
    labelKey: "dashboard",
  },
  {
    href: "/admin/users",
    icon: UserMultiple02Icon,
    labelKey: "users",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const t = useTranslations("admin")

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <HugeiconsIcon icon={Home09Icon} className="size-5" />
          <span className="font-semibold">{t("sidebar.backToApp")}</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-2 px-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
          {t("sidebar.administration")}
        </p>
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href as "/admin" | "/admin/users"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <HugeiconsIcon icon={item.icon} className="size-4" />
              {t(`sidebar.${item.labelKey}`)}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
