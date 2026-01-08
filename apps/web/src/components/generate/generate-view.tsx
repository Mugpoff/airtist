"use client"

import type { AppRouter } from "@repo/trpc"
import { toastManager } from "@repo/ui/base/toast"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { TRPCClientError } from "@trpc/client"
import type { inferRouterOutputs } from "@trpc/server"
import { useSetAtom } from "jotai"
import { isGeneratingAtom } from "@/atoms/is-generating-atom"
import { useTRPC } from "@/trpc/react"
import { GenerateForm } from "./generate-form"
import { GenerateGallery } from "./generate-gallery"

type ModelsInfo = inferRouterOutputs<AppRouter>["images"]["models"]

type Props = {
  isAuthed: boolean
}

export function GenerateView({ isAuthed }: Props) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const setIsGenerating = useSetAtom(isGeneratingAtom)

  const { data: history } = useSuspenseQuery(
    trpc.images.list.queryOptions({ limit: 50, offset: 0 }),
  )
  const { data: modelsInfo } = useSuspenseQuery(
    trpc.images.models.queryOptions(),
  ) as { data: ModelsInfo }

  const generateStudioMutation = useMutation({
    ...trpc.images.generateStudio.mutationOptions(),
    onMutate: () => {
      setIsGenerating(true)
    },
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
    onSettled: () => {
      setIsGenerating(false)
    },
  })

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <GenerateForm
          modelsInfo={modelsInfo}
          isAuthed={isAuthed}
          onGenerate={(fd) => generateStudioMutation.mutate(fd)}
        />
        <GenerateGallery items={history.items} />
      </div>
    </div>
  )
}
