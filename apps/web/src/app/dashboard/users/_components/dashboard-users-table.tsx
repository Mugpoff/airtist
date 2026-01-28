"use client"

import { authClient } from "@repo/auth/client"
import { config } from "@repo/config"
import { Frame } from "@repo/ui/base/frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/base/table"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { type AppConfig, type MessageKeys, useTranslations } from "next-intl"
import { parseAsInteger, useQueryState } from "nuqs"
import { DataTablePagination } from "@/app/dashboard/users/_components/data-table-pagination"
import { dashboardUsersTableColumns } from "./dashboard-users-table-columns"
import { DashboardUsersTableEmpty } from "./dashboard-users-table-empty"
import { DashboardUsersTableError } from "./dashboard-users-table-error"
import { DashboardUsersTableSkeleton } from "./dashboard-users-table-skeleton"

export const DashboardUsersTable = () => {
  const t = useTranslations()
  const [query] = useQueryState("q", { defaultValue: "" })
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(config.pagination.defaultPerPage),
  )
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users-list", query, page, perPage],
    queryFn: () =>
      authClient.admin.listUsers({
        query: {
          searchValue: query,
          limit: perPage,
          offset: (page - 1) * perPage,
        },
      }),
    select: ({ data }) => data,
    placeholderData: keepPreviousData,
  })
  const table = useReactTable({
    data: data?.users ?? [],
    columns: dashboardUsersTableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: data?.total ?? 0,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: perPage,
      },
    },
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
                            ("global." +
                              header.column.columnDef.header) as MessageKeys<
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
        <DataTablePagination
          table={table}
          totalText={t("dashboard.users.total", {
            total: table.getRowCount().toString(),
          })}
        />
      </Table>
    </Frame>
  )
}
