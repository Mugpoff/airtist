import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@repo/ui/base/button"
import { Checkbox } from "@repo/ui/base/checkbox"
import { Frame } from "@repo/ui/base/frame"
import { Skeleton } from "@repo/ui/base/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/base/table"
import { useTranslations } from "next-intl"

export const DashboardUsersTableSkeleton = () => {
  const t = useTranslations("global")

  return (
    <Frame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox disabled />
            </TableHead>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead>{t("banned")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: we don't have a unique key
            <TableRow key={index}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="size-6" />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" disabled>
                  <HugeiconsIcon icon={MoreHorizontalIcon} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Frame>
  )
}
