import {
  Cancel01Icon,
  CheckmarkCircle03Icon,
  LegalHammerIcon,
  MoreHorizontalIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Session } from "@repo/auth/server"
import { Badge } from "@repo/ui/base/badge"
import { Button } from "@repo/ui/base/button"
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@repo/ui/base/menu"
import { Popover, PopoverPopup, PopoverTrigger } from "@repo/ui/base/popover"
import type { ColumnDef } from "@tanstack/react-table"
import { useFormatter, useNow, useTranslations } from "next-intl"
import { useState } from "react"
import { DashboardUsersTableBanDialog } from "@/app/dashboard/users/_components/dashboard-users-table-ban-dialog"
import { DashboardUsersTableUnbanDialog } from "@/app/dashboard/users/_components/dashboard-users-table-unban-dialog"
import { useAuth } from "@/stores/auth-store"

export const dashboardUsersTableColumns: ColumnDef<Session["user"]>[] = [
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
      const t = useTranslations()
      const format = useFormatter()
      const now = useNow()

      if (user.banned && user.banReason && user.banExpires) {
        return (
          <Popover>
            <PopoverTrigger
              openOnHover
              render={
                <Badge
                  className="cursor-help select-none rounded-full px-2 py-1"
                  variant="outline"
                />
              }
              nativeButton={false}
            >
              <HugeiconsIcon
                icon={UnavailableIcon}
                className="size-3.5 text-destructive-foreground"
              />
              {t("global.banned")}
            </PopoverTrigger>
            <PopoverPopup className="max-w-80">
              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  {t("dashboard.users.unban.unbanningIn", {
                    relativeTime: format.relativeTime(user.banExpires, now),
                    dateTime: format.dateTime(user.banExpires, {
                      dateStyle: "long",
                      timeStyle: "short",
                    }),
                  })}
                </p>
                <div className="flex flex-col text-sm">
                  <p className="font-medium text-muted-foreground text-xs uppercase">
                    {t("global.reason")}
                  </p>
                  <p>{user.banReason}</p>
                </div>
              </div>
            </PopoverPopup>
          </Popover>
        )
      }

      return (
        <Badge className="select-none rounded-full px-2 py-1" variant="outline">
          <HugeiconsIcon
            icon={CheckmarkCircle03Icon}
            className="size-3.5 text-success-foreground"
          />
          {t("global.active")}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [banDialogOpen, setBanDialogOpen] = useState(false)
      const [unbanDialogOpen, setUnbanDialogOpen] = useState(false)
      const { user: currentUser } = useAuth()
      const t = useTranslations("global")
      const user = row.original

      if (currentUser?.id === user.id) {
        return null
      }

      return (
        <>
          <Menu>
            <MenuTrigger render={<Button variant="ghost" size="icon" />}>
              <HugeiconsIcon icon={MoreHorizontalIcon} />
            </MenuTrigger>
            <MenuPopup>
              {user.banned && (
                <MenuItem onClick={() => setUnbanDialogOpen(true)}>
                  <HugeiconsIcon icon={Cancel01Icon} />
                  {t("unban")}
                </MenuItem>
              )}
              {!user.banned && (
                <MenuItem
                  variant="destructive"
                  onClick={() => setBanDialogOpen(true)}
                >
                  <HugeiconsIcon icon={LegalHammerIcon} />
                  {t("ban")}
                </MenuItem>
              )}
            </MenuPopup>
          </Menu>
          <DashboardUsersTableBanDialog
            userId={user.id}
            userName={user.name}
            open={banDialogOpen}
            onOpenChange={setBanDialogOpen}
          />
          <DashboardUsersTableUnbanDialog
            userId={user.id}
            userName={user.name}
            open={unbanDialogOpen}
            onOpenChange={setUnbanDialogOpen}
          />
        </>
      )
    },
  },
]
