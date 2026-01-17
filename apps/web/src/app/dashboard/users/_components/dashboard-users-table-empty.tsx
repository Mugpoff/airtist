import { FileEmpty01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@repo/ui/base/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/base/empty"
import { TableCell, TableRow } from "@repo/ui/base/table"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { DashboardUsersTableCreateDialog } from "./dashboard-users-table-create-dialog"

export const DashboardUsersTableEmpty = () => {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" })
  const t = useTranslations()

  return (
    <TableRow>
      <TableCell colSpan={6}>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={FileEmpty01Icon} />
            </EmptyMedia>
            <EmptyTitle>{t("dashboard.users.empty.title")}</EmptyTitle>
            <EmptyDescription>
              {t("dashboard.users.empty.description")}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-row gap-2">
              <DashboardUsersTableCreateDialog />
              {query.length > 0 && (
                <Button variant="outline" onClick={() => setQuery("")}>
                  {t("global.resetQuery")}
                </Button>
              )}
            </div>
          </EmptyContent>
        </Empty>
      </TableCell>
    </TableRow>
  )
}
