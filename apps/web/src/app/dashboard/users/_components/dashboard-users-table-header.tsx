"use client"

import { SearchInput } from "@repo/ui/stylistic/search-input"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { DashboardUsersTableCreateDialog } from "./dashboard-users-table-create-dialog"

export const DashboardUsersTableHeader = () => {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" })
  const _t = useTranslations()

  return (
    <div className="flex items-center justify-between">
      <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} />
      <DashboardUsersTableCreateDialog />
    </div>
  )
}
