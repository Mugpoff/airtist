"use client"

import { Button } from "@repo/ui/base/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/react"

type Props = {
  parentId: string | null
  disabled: boolean
  onOpenFolder: (id: string) => void
}

export function DriveFolders({ parentId, disabled, onOpenFolder }: Props) {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(
    trpc.drive.listFolders.queryOptions({
      view: "ROOT",
      parentId: parentId ?? undefined,
      limit: 200,
    }),
  )

  return (
    <div className="space-y-2">
      <div className="text-muted-foreground text-sm">Dossiers</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {data.items.map((f) => (
          <Button
            key={f.id}
            type="button"
            variant="secondary"
            className="justify-start truncate"
            disabled={disabled}
            onClick={() => onOpenFolder(f.id)}
          >
            {f.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
