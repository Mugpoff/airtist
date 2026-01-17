import {
  CheckmarkCircle03Icon,
  MoreHorizontalIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Session } from "@repo/auth/server"
import { Badge } from "@repo/ui/base/badge"
import { Button } from "@repo/ui/base/button"
import { Checkbox } from "@repo/ui/base/checkbox"
import { Menu, MenuPopup, MenuTrigger } from "@repo/ui/base/menu"
import type { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

export const dashboardUsersTableColumns: ColumnDef<Session["user"]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "role",
    header: "role",
  },
  {
    header: "status",
    cell: ({ row }) => {
      const user = row.original
      const t = useTranslations("global")

      if (user.banned) {
        return (
          <Badge className="rounded-full px-2 py-1" variant="outline">
            <HugeiconsIcon
              icon={UnavailableIcon}
              className="size-3.5 text-destructive-foreground"
            />
            {t("banned")}
          </Badge>
        )
      }

      return (
        <Badge className="rounded-full px-2 py-1" variant="outline">
          <HugeiconsIcon
            icon={CheckmarkCircle03Icon}
            className="size-3.5 text-success-foreground"
          />
          {t("active")}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Menu>
        <MenuTrigger render={<Button variant="ghost" size="icon" />}>
          <HugeiconsIcon icon={MoreHorizontalIcon} />
        </MenuTrigger>
        <MenuPopup>
          <DashboardUsersTableBanButton userId={row.original.id} />
        </MenuPopup>
      </Menu>
    ),
  },
]
