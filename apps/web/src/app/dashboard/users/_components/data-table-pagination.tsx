import { config } from "@repo/config"
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/base/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/base/select"
import { TableCell, TableFooter, TableRow } from "@repo/ui/base/table"
import type { Table } from "@tanstack/react-table"
import { parseAsInteger, useQueryState } from "nuqs"
import { useEffect } from "react"

type Props<TData extends Record<string, unknown>> = {
  table: Table<TData>
  totalText: string
}

export const DataTablePagination = <TData extends Record<string, unknown>>({
  table,
  totalText,
}: Props<TData>) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(config.pagination.defaultPerPage),
  )
  const items = config.pagination.perPageOptions.map((item) => ({
    label: item,
    value: item,
  }))

  const handlePerPageChange = async (value: number | null) => {
    if (value) {
      setPerPage(value)
    }
  }

  useEffect(() => {
    if (page < 1 || page > table.getPageCount()) {
      setPage(1)
    }
  }, [page, setPage, table.getPageCount])

  useEffect(() => {
    if (
      !config.pagination.perPageOptions.includes(
        perPage as (typeof config.pagination.perPageOptions)[number],
      )
    ) {
      setPerPage(config.pagination.defaultPerPage)
    }
  }, [perPage, setPerPage])

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={1} className="text-muted-foreground">
          {totalText}
        </TableCell>
        <TableCell colSpan={99}>
          <div className="flex items-center justify-end gap-4">
            <Select
              items={items}
              value={perPage}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="min-w-auto max-w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Pagination className="m-0 w-fit">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => setPage((prev) => prev - 1)}
                  />
                </PaginationItem>
                {table.getCanPreviousPage() && (
                  <PaginationItem>
                    <PaginationButton
                      onClick={() => setPage((prev) => prev - 1)}
                    >
                      {page - 1}
                    </PaginationButton>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationButton isActive>{page}</PaginationButton>
                </PaginationItem>
                {table.getCanNextPage() && (
                  <PaginationItem>
                    <PaginationButton
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      {page + 1}
                    </PaginationButton>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    disabled={!table.getCanNextPage()}
                    onClick={() => setPage((prev) => prev + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  )
}
