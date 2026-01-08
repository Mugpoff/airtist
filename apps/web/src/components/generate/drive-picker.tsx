"use client"

import { Button } from "@repo/ui/base/button"
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/base/card"
import { Input } from "@repo/ui/base/input"
import { useMutation } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useTRPC } from "@/trpc/react"
import { DriveFolders } from "./drive-folders"
import { DriveImages } from "./drive-images"

type View = "ROOT" | "RECENT" | "SHARED"

type Props = {
  onImported: (urls: string[]) => void
}

export function DrivePicker({ onImported }: Props) {
  const trpc = useTRPC()

  const [view, setView] = useState<View>("ROOT")
  const [parentId, setParentId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [pageToken, setPageToken] = useState<string | null>(null)

  const importMutation = useMutation({
    ...trpc.drive.importImages.mutationOptions(),
  })

  const selectedIds = useMemo(() => {
    return Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k)
  }, [selected])

  const isBusy = importMutation.isPending

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="font-medium">Google Drive</div>
          <div className="text-muted-foreground text-sm">
            {selectedIds.length} sélectionnée(s)
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={view === "ROOT" ? "default" : "secondary"}
            disabled={isBusy}
            onClick={() => {
              setView("ROOT")
              setParentId(null)
              setPageToken(null)
              setSelected({})
            }}
          >
            Mon Drive
          </Button>
          <Button
            type="button"
            variant={view === "RECENT" ? "default" : "secondary"}
            disabled={isBusy}
            onClick={() => {
              setView("RECENT")
              setParentId(null)
              setPageToken(null)
              setSelected({})
            }}
          >
            Récents
          </Button>
          <Button
            type="button"
            variant={view === "SHARED" ? "default" : "secondary"}
            disabled={isBusy}
            onClick={() => {
              setView("SHARED")
              setParentId(null)
              setPageToken(null)
              setSelected({})
            }}
          >
            Partagés
          </Button>
        </div>

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un fichier"
          disabled={isBusy}
        />

        {view === "ROOT" && (
          <div className="flex items-center justify-between gap-3">
            <div className="text-muted-foreground text-sm">
              Dossier: {parentId ?? "root"}
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={isBusy || parentId === null}
              onClick={() => {
                setParentId(null)
                setPageToken(null)
                setSelected({})
              }}
            >
              Retour root
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {view === "ROOT" && (
          <DriveFolders
            parentId={parentId}
            disabled={isBusy}
            onOpenFolder={(id) => {
              setParentId(id)
              setPageToken(null)
              setSelected({})
            }}
          />
        )}

        <DriveImages
          view={view}
          parentId={parentId}
          pageToken={pageToken}
          query={query}
          selected={selected}
          disabled={isBusy}
          onToggle={(id) => {
            setSelected((prev) => ({
              ...prev,
              [id]: !prev[id],
            }))
          }}
          onNextPage={(next) => {
            setPageToken(next)
          }}
        />
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={isBusy}
          onClick={() => setSelected({})}
        >
          Reset
        </Button>
        <Button
          type="button"
          disabled={selectedIds.length === 0 || isBusy}
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
