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
import {
  createTRPCClient,
  httpBatchStreamLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client"
import type { inferRouterOutputs } from "@trpc/server"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaRegTrashCan } from "react-icons/fa6"
import SuperJSON from "superjson"
import { useTRPC } from "@/trpc/react"

type ImageOutput = inferRouterOutputs<AppRouter>["images"]["list"][number]
type ImageWithUrl = ImageOutput & { imageUrl: string }
type GenerationProgress = {
  step:
    | "STARTING"
    | "SENDING_TO_AI"
    | "WAITING_FOR_AI"
    | "DOWNLOADING_IMAGE"
    | "UPLOADING_TO_STORAGE"
    | "SAVING_TO_DB"
    | "COMPLETED"
    | "FAILED"
  message?: string
}

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

  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null)
  const [generationStatus, setGenerationStatus] = useState<string>("")
  const [progressValue, setProgressValue] = useState(0)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: images } = useSuspenseQuery(trpc.images.list.queryOptions())

  useEffect(() => {
    if (!currentRequestId) return

    const vanillaClient = createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => op.type === "subscription",
          true: unstable_httpSubscriptionLink({
            url: `/api/trpc`,
            transformer: SuperJSON,
          }),
          false: httpBatchStreamLink({
            transformer: SuperJSON,
            url: `/api/trpc`,
          }),
        }),
      ],
    })

    const subscription = vanillaClient.images.onProgress.subscribe(
      { requestId: currentRequestId },
      {
        onData: (result: unknown) => {
          const data = result as GenerationProgress

          setGenerationStatus(data.message || data.step)

          switch (data.step) {
            case "STARTING":
              setProgressValue(10)
              break
            case "SENDING_TO_AI":
              setProgressValue(30)
              break
            case "WAITING_FOR_AI":
              setProgressValue(50)
              break
            case "DOWNLOADING_IMAGE":
              setProgressValue(70)
              break
            case "UPLOADING_TO_STORAGE":
              setProgressValue(85)
              break
            case "SAVING_TO_DB":
              setProgressValue(95)
              break
            case "COMPLETED":
              setProgressValue(100)
              setCurrentRequestId(null)
              break
            case "FAILED":
              setCurrentRequestId(null)
              break
          }
        },
        onError: (err) => {
          console.error("Subscription error:", err)
        },
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [currentRequestId])

  const generateImageMutation = useMutation({
    ...trpc.images.generate.mutationOptions(),
    onSuccess: () => {
      toastManager.add({
        title: "Image générée avec succès !",
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: trpc.images.list.queryKey() })
      if (currentRequestId) setCurrentRequestId(null)
      setGenerationStatus("")
      setProgressValue(0)
    },
    onError: (error: TRPCClientError<AppRouter>) => {
      toastManager.add({
        title: "Erreur lors de la génération",
        description: error.message,
        type: "error",
      })
      setCurrentRequestId(null)
      setGenerationStatus("")
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

    const newRequestId = crypto.randomUUID()

    setCurrentRequestId(newRequestId)
    setGenerationStatus("Démarrage...")
    setProgressValue(5)

    generateImageMutation.mutate({
      prompt,
      aspectRatio,
      clientRequestId: newRequestId,
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
      deleteImageMutation.mutate({ id })
    }
  }

  const imagesWithUrl = images.filter(
    (image): image is ImageWithUrl => !!image.imageUrl,
  )

  const isGenerating = generateImageMutation.isPending

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
                disabled={isGenerating}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="aspect-ratio-select">Format</label>
              <Select
                value={aspectRatio}
                onValueChange={(value) => {
                  if (value) setAspectRatio(value)
                }}
                disabled={isGenerating}
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

            {isGenerating && (
              <div className="space-y-2 py-2">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>{generationStatus}</span>
                  <span>{progressValue}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
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
                      disabled={deleteImageMutation.isPending}
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
