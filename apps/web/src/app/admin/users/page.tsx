"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { UsersTable } from "@/components/admin/users-table"

export default function AdminUsersPage() {
  const t = useTranslations("admin.users")
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <UsersTable search={search} onSearchChange={setSearch} />
    </div>
  )
}
