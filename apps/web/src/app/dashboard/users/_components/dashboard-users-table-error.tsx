import { Alert02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@repo/ui/base/button"
import { Checkbox } from "@repo/ui/base/checkbox"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/base/empty"
import { Frame } from "@repo/ui/base/frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/base/table"
import { useTranslations } from "next-intl"

type Props = {
  onRetry: () => void
}

export const DashboardUsersTableError = ({ onRetry }: Props) => {
  const t = useTranslations()

  return (
    <Frame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox disabled />
            </TableHead>
            <TableHead>{t("global.name")}</TableHead>
            <TableHead>{t("global.email")}</TableHead>
            <TableHead>{t("global.role")}</TableHead>
            <TableHead>{t("global.banned")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6}>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia
                    variant="icon"
                    className="text-destructive-foreground"
                  >
                    <HugeiconsIcon icon={Alert02Icon} />
                  </EmptyMedia>
                  <EmptyTitle>{t("dashboard.users.error.title")}</EmptyTitle>
                  <EmptyDescription>
                    {t("dashboard.users.error.description")}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={onRetry}>{t("global.retry")}</Button>
                </EmptyContent>
              </Empty>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Frame>
  )
}
