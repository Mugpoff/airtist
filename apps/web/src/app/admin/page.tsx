"use client"

import {
  Cancel01Icon,
  Image01Icon,
  UserIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/base/card"
import { Skeleton } from "@repo/ui/base/skeleton"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useTRPC } from "@/trpc/react"

export default function AdminDashboardPage() {
  const t = useTranslations("admin.dashboard")
  const trpc = useTRPC()
  const { data: stats, isLoading } = useQuery(
    trpc.admin.getStats.queryOptions(),
  )

  const statCards = [
    {
      titleKey: "stats.totalUsers" as const,
      value: stats?.totalUsers,
      icon: UserMultiple02Icon,
      color: "text-blue-500",
    },
    {
      titleKey: "stats.activeUsers" as const,
      value: stats?.activeUsers,
      icon: UserIcon,
      color: "text-green-500",
    },
    {
      titleKey: "stats.bannedUsers" as const,
      value: stats?.bannedUsers,
      icon: Cancel01Icon,
      color: "text-red-500",
    },
    {
      titleKey: "stats.totalImages" as const,
      value: stats?.totalImages,
      icon: Image01Icon,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.titleKey}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                {t(stat.titleKey)}
              </CardTitle>
              <HugeiconsIcon
                icon={stat.icon}
                className={`size-4 ${stat.color}`}
              />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="font-bold text-2xl">{stat.value ?? 0}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">
              {t("stats.newUsersWeek")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="font-bold text-2xl">
                +{stats?.newUsersLast7Days ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">
              {t("stats.imagesWeek")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="font-bold text-2xl">
                +{stats?.imagesLast7Days ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
