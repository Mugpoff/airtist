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
import { dashboardUsersTableColumns } from "@/app/dashboard/users/_components/dashboard-users-table-columns"

export const DashboardUsersTable = () => {
  const t = useTranslations("global")
  const [query] = useQueryState("q", { defaultValue: "" })
  const { data, isLoading, error } = useQuery({
    queryKey: ["users-list", query],
    queryFn: async () => {
      const users = await authClient.admin.listUsers({
        query: { searchValue: query },
      })

      return users.data
    },
  })
  const table = useReactTable({
    data: data?.users ?? [],
    columns: dashboardUsersTableColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  console.log(data, isLoading, error)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>

  console.log(data)

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
        </TableBody>
      </Table>
    </Frame>
  )
}
