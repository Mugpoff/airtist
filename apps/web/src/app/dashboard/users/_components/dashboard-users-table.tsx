"use client"

import { authClient } from "@repo/auth/client"
import { Frame } from "@repo/ui/base/frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/base/table"
import { useQuery } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { type AppConfig, type MessageKeys, useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { dashboardUsersTableColumns } from "./dashboard-users-table-columns"
import { DashboardUsersTableEmpty } from "./dashboard-users-table-empty"
import { DashboardUsersTableError } from "./dashboard-users-table-error"
import { DashboardUsersTableSkeleton } from "./dashboard-users-table-skeleton"

export const DashboardUsersTable = () => {
  const t = useTranslations("global")
  const [query] = useQueryState("q", { defaultValue: "" })
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users-list", query],
    queryFn: () =>
      authClient.admin.listUsers({ query: { searchValue: query } }),
    select: ({ data }) => data,
  })
  const table = useReactTable({
    data: data?.users ?? [],
    columns: dashboardUsersTableColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <DashboardUsersTableSkeleton />
  if (error) return <DashboardUsersTableError onRetry={refetch} />

  return (
    <Frame>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === "string"
                        ? t(
                            header.column.columnDef.header as MessageKeys<
                              AppConfig["Messages"],
                              "global"
                            >,
                          )
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length > 0 &&
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {table.getRowModel().rows?.length === 0 && (
            <DashboardUsersTableEmpty />
          )}
        </TableBody>
      </Table>
    </Frame>
  )
}
