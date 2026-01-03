"use client"

import { Button } from "@repo/ui/base/button"
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/base/card"
import { Input } from "@repo/ui/base/input"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useTRPC } from "@/trpc/react"

type Props = {
  onImported: (urls: string[]) => void
}

export function DrivePicker({ onImported }: Props) {
  const trpc = useTRPC()

  const { data, isLoading, error } = useQuery(
    trpc.drive.listImages.queryOptions({ limit: 30 }),
  )

  const importMutation = useMutation({
    ...trpc.drive.importImages.mutationOptions(),
  })

  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    const items = data?.items ?? []
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((x) => x.name.toLowerCase().includes(q))
  }, [data, query])

  const selectedIds = useMemo(() => {
    return Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k)
  }, [selected])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Chargement Google Drive...
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Google Drive indisponible.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="font-medium">Google Drive</div>
        <div className="text-muted-foreground text-sm">
          {selectedIds.length} sélectionnée(s)
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un fichier"
          disabled={importMutation.isPending}
        />

        <div className="max-h-80 overflow-auto rounded-md border">
          <div className="divide-y">
            {filtered.map((f) => (
              <label
                key={f.id}
                className="flex cursor-pointer items-center gap-3 p-3"
              >
                <input
                  type="checkbox"
                  checked={Boolean(selected[f.id])}
                  disabled={importMutation.isPending}
                  onChange={(e) => {
                    setSelected((prev) => ({
                      ...prev,
                      [f.id]: e.target.checked,
                    }))
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{f.name}</div>
                  <div className="truncate text-muted-foreground text-xs">
                    {f.mimeType}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={importMutation.isPending}
          onClick={() => {
            setSelected({})
          }}
        >
          Reset
        </Button>
        <Button
          type="button"
          disabled={selectedIds.length === 0 || importMutation.isPending}
          onClick={async () => {
            const res = await importMutation.mutateAsync({
              fileIds: selectedIds,
            })
            onImported(res.items.map((x) => x.url))
            setSelected({})
          }}
        >
          Importer
        </Button>
      </CardFooter>
    </Card>
  )
}
