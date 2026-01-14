"use client"

import {
  Cancel01Icon,
  Search01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/base/avatar"
import { Badge } from "@repo/ui/base/badge"
import { Button } from "@repo/ui/base/button"
import { Input } from "@repo/ui/base/input"
import { Skeleton } from "@repo/ui/base/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/base/table"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useTRPC } from "@/trpc/react"
import { BanUserDialog } from "./ban-user-dialog"
import { UnbanUserDialog } from "./unban-user-dialog"

type Props = {
  search: string
  onSearchChange: (value: string) => void
}

export function UsersTable({ search, onSearchChange }: Props) {
  const t = useTranslations("admin.users")
  const [page, setPage] = useState(0)
  const limit = 10

  const trpc = useTRPC()
  const { data, isLoading, refetch } = useQuery(
    trpc.admin.listUsers.queryOptions({
      limit,
      offset: page * limit,
      search: search || undefined,
    }),
  )

  const [banDialogUser, setBanDialogUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)

  const [unbanDialogUser, setUnbanDialogUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground"
          />
          <Input
            placeholder={t("search")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.email")}</TableHead>
              <TableHead>{t("table.role")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.images")}</TableHead>
              <TableHead>{t("table.joined")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              ["row-1", "row-2", "row-3", "row-4", "row-5"].map((key) => (
                <TableRow key={key}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  <p className="text-muted-foreground">{t("empty")}</p>
                </TableCell>
              </TableRow>
            ) : (
              data?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {t(`roles.${user.role as "admin" | "user"}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.banned ? (
                      <Badge variant="destructive" className="gap-1">
                        <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                        {t("status.banned")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <HugeiconsIcon icon={Tick01Icon} className="size-3" />
                        {t("status.active")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.imagesCount}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== "admin" &&
                      (user.banned ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setUnbanDialogUser({
                              id: user.id,
                              name: user.name,
                              email: user.email,
                            })
                          }
                        >
                          {t("actions.unban")}
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setBanDialogUser({
                              id: user.id,
                              name: user.name,
                              email: user.email,
                            })
                          }
                        >
                          {t("actions.ban")}
                        </Button>
                      ))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      <BanUserDialog
        user={banDialogUser}
        onClose={() => setBanDialogUser(null)}
        onSuccess={() => {
          setBanDialogUser(null)
          refetch()
        }}
      />

      <UnbanUserDialog
        user={unbanDialogUser}
        onClose={() => setUnbanDialogUser(null)}
        onSuccess={() => {
          setUnbanDialogUser(null)
          refetch()
        }}
      />
    </div>
  )
}
