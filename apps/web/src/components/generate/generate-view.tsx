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
import Link from "next/link"
import { useMemo, useState } from "react"
import { FaRegTrashCan } from "react-icons/fa6"
import { useTRPC } from "@/trpc/react"

type ImageOutput = inferRouterOutputs<AppRouter>["images"]["list"][number]
type ImageWithUrl = ImageOutput & { imageUrl: string }

const ethnicities = ["ASIAN", "BLACK", "ARAB", "WHITE"] as const
type Ethnicity = (typeof ethnicities)[number]

const aspectRatios = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
] as const
type AspectRatio = (typeof aspectRatios)[number]

const toCdnUrl = (url: string) => {
  const marker = "/images/"
  const idx = url.indexOf(marker)
  if (idx === -1) return url
  return `/cdn${url.slice(idx)}`
}

export function GenerateView() {
  const [prompt, setPrompt] = useState(
    "Studio fashion model wearing the outfit",
  )
  const [ethnicity, setEthnicity] = useState<Ethnicity>("WHITE")
  const [height, setHeight] = useState("175")
  const [age, setAge] = useState("25")
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1")
  const [files, setFiles] = useState<File[]>([])

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: images } = useSuspenseQuery(trpc.images.list.queryOptions())
  const { data: modelsInfo } = useSuspenseQuery(
    trpc.images.models.queryOptions(),
  )

  const [model, setModel] = useState<string>(modelsInfo.defaultModel)

  const generateStudioMutation = useMutation({
    ...trpc.images.generateStudio.mutationOptions(),
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

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toastManager.add({
        title: "Le prompt ne peut pas être vide",
        type: "error",
      })
      return
    }

    if (files.length < 1) {
      toastManager.add({
        title: "Ajoute au moins une image de vêtement",
        type: "error",
      })
      return
    }

    if (!(modelsInfo.models as string[]).includes(model)) {
      toastManager.add({
        title: "Modèle invalide",
        type: "error",
      })
      return
    }

    const fd = new FormData()
    fd.set("prompt", prompt)
    fd.set("model", model)
    fd.set("ethnicity", ethnicity)
    fd.set("height", height)
    fd.set("age", age)
    fd.set("aspectRatio", aspectRatio)

    for (const f of files) {
      fd.append("images", f)
    }

    generateStudioMutation.mutate(fd)
  }

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
      deleteImageMutation.mutate({ id })
    }
  }

  const imagesWithUrl = useMemo(() => {
    return images.filter((image): image is ImageWithUrl => !!image.imageUrl)
  }, [images])

  const isGenerating = generateStudioMutation.isPending

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Générer une nouvelle image studio</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt-input">Prompt</label>
              <Input
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label>Model</label>
                <Select
                  value={model}
                  onValueChange={(value) => {
                    if (value) setModel(value)
                  }}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelsInfo.models.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label>Ethnicity</label>
                <Select
                  value={ethnicity}
                  onValueChange={(value) => {
                    if (value) setEthnicity(value as Ethnicity)
                  }}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ethnicities.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label>Format</label>
                <Select
                  value={aspectRatio}
                  onValueChange={(value) => {
                    if (value) setAspectRatio(value as AspectRatio)
                  }}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <label>Height (cm)</label>
                <Input
                  inputMode="numeric"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <label>Age</label>
                <Input
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label>Clothing images</label>
              <Input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/avif,image/heic"
                disabled={isGenerating}
                onChange={(e) => {
                  const list = e.target.files
                  if (!list) {
                    setFiles([])
                    return
                  }
                  setFiles(Array.from(list))
                }}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? "Génération..." : "Générer"}
            </Button>
          </CardFooter>
        </Card>

        <section>
          <h2 className="mb-4 font-semibold text-2xl tracking-tight">
            Galerie
          </h2>

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
      </div>
    </div>
  )
}
