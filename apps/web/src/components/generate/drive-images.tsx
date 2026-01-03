"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/react"
import { DriveThumb } from "./drive-thumb"

type View = "ROOT" | "RECENT" | "SHARED"

type Item = {
  id: string
  name: string
  mimeType: string
}

type Props = {
  view: View
  parentId: string | null
  pageToken: string | null
  query: string
  selected: Record<string, boolean>
  disabled: boolean
  onToggle: (id: string) => void
  onNextPage: (nextPageToken: string) => void
}

export function DriveImages({
  view,
  parentId,
  pageToken,
  query,
  selected,
  disabled,
  onToggle,
  onNextPage,
}: Props) {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(
    trpc.drive.listItems.queryOptions({
      view,
      parentId: view === "ROOT" ? (parentId ?? undefined) : undefined,
      limit: 30,
      pageToken: pageToken ?? undefined,
    }),
  )

  const items = data.items as Item[]
  const nextPage = data.nextPageToken

  const q = query.trim().toLowerCase()
  const filtered = q
    ? items.filter((x) => x.name.toLowerCase().includes(q))
    : items

  return (
    <div className="space-y-2">
      <div className="text-muted-foreground text-sm">Images</div>

      <div className="max-h-96 overflow-auto rounded-md border p-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((f) => {
            const isSelected = Boolean(selected[f.id])
            return (
              <button
                key={f.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggle(f.id)}
                className={[
                  "rounded-md border p-2 text-left transition",
                  isSelected
                    ? "border-primary"
                    : "border-border hover:border-muted-foreground/40",
                ].join(" ")}
              >
                <DriveThumb fileId={f.id} name={f.name} />
                <div className="mt-2 truncate text-sm">{f.name}</div>
              </button>
            )
          })}
        </div>
      </div>

      {nextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onNextPage(nextPage)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Charger plus
          </button>
        </div>
      )}
    </div>
  )
}
