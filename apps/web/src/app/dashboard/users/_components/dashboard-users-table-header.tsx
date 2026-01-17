"use client"

import { SearchInput } from "@repo/ui/stylistic/search-input"
import { useQueryState } from "nuqs"

export const DashboardUsersTableHeader = () => {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" })

  return (
    <div>
      <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
  )
}
