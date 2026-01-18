import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@repo/ui/base/button"
import { Frame } from "@repo/ui/base/frame"
import { Skeleton } from "@repo/ui/base/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-56" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className="w-fit">
                <Skeleton className="h-5 w-18 rounded-full" />
              </TableCell>
              <TableCell className="flex justify-end">
                <Button variant="ghost" size="icon" disabled>
                  <HugeiconsIcon icon={MoreHorizontalIcon} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1}>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell colSpan={99}>
              <div className="flex items-center justify-end gap-4">
                <Skeleton className="h-8 w-20" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Frame>
  )
}
