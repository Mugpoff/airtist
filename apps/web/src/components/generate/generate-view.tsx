"use client"

import type { AppRouter } from "@repo/trpc"
import { Button } from "@repo/ui/base/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/base/card"
import { Input } from "@repo/ui/base/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/base/select"
import { toastManager } from "@repo/ui/base/toast"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { TRPCClientError } from "@trpc/client"
import type { inferRouterOutputs } from "@trpc/server"
import Image from "next/image"
import { useState } from "react"
import { useTRPC } from "@/trpc/react"

type ImageOutput = inferRouterOutputs<AppRouter>["images"]["list"][number]
type ImageWithUrl = ImageOutput & { imageUrl: string }

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"]

const toCdnUrl = (url: string) => {
  const marker = "/images/"
  const idx = url.indexOf(marker)

  if (idx === -1) {
    return url
  }

  return `/cdn${url.slice(idx)}`
}

export function GenerateView() {
  const [prompt, setPrompt] = useState(
    "A cute cat astronaut in space, photorealistic",
  )
  const [aspectRatio, setAspectRatio] = useState("1:1")

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: images } = useSuspenseQuery(trpc.images.list.queryOptions())

  const generateImageMutation = useMutation({
    ...trpc.images.generate.mutationOptions(),
    onSuccess: () => {
      toastManager.add({
        title: "Image générée avec succès !",
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: trpc.images.list.queryKey() })
    },
    onError: (error: TRPCClientError<AppRouter>) => {
      toastManager.add({
        title: "Erreur lors de la génération",
        description: error.message,
        type: "error",
      })
    },
  })

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toastManager.add({
        title: "Le prompt ne peut pas être vide",
        type: "error",
      })
      return
    }

    generateImageMutation.mutate({ prompt, aspectRatio })
  }

  const imagesWithUrl = images.filter(
    (image): image is ImageWithUrl => !!image.imageUrl,
  )

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Générer une nouvelle image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt-input">Prompt</label>
              <Input
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Un renard dans un style Ghibli..."
                disabled={generateImageMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="aspect-ratio-select">Format</label>
              <Select
                value={aspectRatio}
                onValueChange={(value) => {
                  if (value) setAspectRatio(value)
                }}
                disabled={generateImageMutation.isPending}
              >
                <SelectTrigger id="aspect-ratio-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aspectRatios.map((ratio) => (
                    <SelectItem key={ratio} value={ratio}>
                      {ratio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={generateImageMutation.isPending}
              className="w-full sm:w-auto"
            >
              {generateImageMutation.isPending
                ? "Génération en cours..."
                : "Générer"}
            </Button>
          </CardFooter>
        </Card>

        <section>
          <h2 className="font-semibold mb-4 text-2xl tracking-tight">
            Galerie
          </h2>
          {imagesWithUrl.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {imagesWithUrl.map((image) => (
                <Card key={image.id} className="overflow-hidden">
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
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4">
                    <p className="text-muted-foreground text-sm truncate">
                      {image.prompt}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                Aucune image générée pour le moment.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
