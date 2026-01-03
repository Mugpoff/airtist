"use client"

import type { AppRouter } from "@repo/trpc"
import { Button } from "@repo/ui/base/button"
import { Card, CardContent, CardFooter } from "@repo/ui/base/card"
import { toastManager } from "@repo/ui/base/toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TRPCClientError } from "@trpc/client"
import type { inferRouterOutputs } from "@trpc/server"
import { useAtomValue } from "jotai"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { FaRegTrashCan } from "react-icons/fa6"
import { isGeneratingAtom } from "@/atoms/is-generating-atom"
import { useTRPC } from "@/trpc/react"
import { toCdnUrl } from "@/utils/to-cdn-url"

type ImageOutput =
  inferRouterOutputs<AppRouter>["images"]["list"]["items"][number]
type ImageWithUrl = ImageOutput & { imageUrl: string }

type Props = {
  items: ImageOutput[]
}

export function GenerateGallery({ items }: Props) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const isGenerating = useAtomValue(isGeneratingAtom)

  const deleteImageMutation = useMutation({
    ...trpc.images.delete.mutationOptions(),
    onSuccess: () => {
      toastManager.add({
        title: "Image supprimée",
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: trpc.images.list.queryKey() })
    },
    onError: (error: TRPCClientError<AppRouter>) => {
      toastManager.add({
        title: "Erreur lors de la suppression",
        description: error.message,
        type: "error",
      })
    },
  })

  const imagesWithUrl = useMemo(() => {
    return items.filter(
      (image): image is ImageWithUrl => typeof image.imageUrl === "string",
    )
  }, [items])

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
      deleteImageMutation.mutate({ id })
    }
  }

  return (
    <section>
      <h2 className="mb-4 font-semibold text-2xl tracking-tight">Galerie</h2>

      {imagesWithUrl.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {imagesWithUrl.map((image) => (
            <Card key={image.id} className="group relative overflow-hidden">
              <Link href={`/images/${image.id}`} className="block">
                <CardContent className="p-0">
                  <div
                    className="relative"
                    style={{
                      paddingTop: `${(image.height / image.width) * 100}%`,
                    }}
                  >
                    <Image
                      src={toCdnUrl(image.imageUrl)}
                      alt={image.prompt}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                </CardContent>
              </Link>

              <CardFooter className="flex items-center justify-between p-4">
                <Link
                  href={`/images/${image.id}`}
                  className="flex-1 truncate text-muted-foreground text-sm hover:underline"
                >
                  {image.prompt}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  disabled={deleteImageMutation.isPending || isGenerating}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(image.id)
                  }}
                >
                  <FaRegTrashCan className="size-4" />
                  <span className="sr-only">Supprimer</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">Aucune image générée.</p>
        </div>
      )}
    </section>
  )
}
