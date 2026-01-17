import {
  Cancel01Icon,
  MoreHorizontalIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Session } from "@repo/auth/server"
import { Button } from "@repo/ui/base/button"
import { Checkbox } from "@repo/ui/base/checkbox"
import { Menu, MenuPopup, MenuTrigger } from "@repo/ui/base/menu"
import type { ColumnDef } from "@tanstack/react-table"
import { DashboardUsersTableBanButton } from "@/app/dashboard/users/_components/dashboard-users-table-ban-button"

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
    accessorKey: "banned",
    header: "banned",
    cell: ({ row }) => {
      const user = row.original

      if (user.banned) {
        return (
          <HugeiconsIcon icon={Tick02Icon} className="text-muted-foreground" />
        )
      }

      return (
        <HugeiconsIcon icon={Cancel01Icon} className="text-muted-foreground" />
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
