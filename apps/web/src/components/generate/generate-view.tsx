"use client"

import { toastManager } from "@repo/ui/base/toast"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useSubscription } from "@trpc/tanstack-react-query"
import { useSetAtom } from "jotai"
import { useQueryState } from "nuqs"
import { isGeneratingAtom } from "@/atoms/is-generating-atom"
import { useTRPC } from "@/trpc/react"
import { GenerateForm } from "./generate-form"
import { GenerateGallery } from "./generate-gallery"

export function GenerateView() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const setIsGenerating = useSetAtom(isGeneratingAtom)

  const [activeJobId, setActiveJobId] = useQueryState("jobId")

  const { data: history } = useSuspenseQuery(
    trpc.images.list.queryOptions({ limit: 50, offset: 0 }),
  )
  const { data: modelsInfo } = useSuspenseQuery(
    trpc.images.models.queryOptions(),
  )

  useSubscription(
    trpc.onGenerateProgress.subscriptionOptions(
      { jobId: activeJobId ?? "" },
      {
        enabled: !!activeJobId,
        onData: (data) => {
          if (data.step === "completed") {
            toastManager.add({ title: "Génération réussie !", type: "success" })
            queryClient.invalidateQueries({
              queryKey: trpc.images.list.queryKey(),
            })
            setIsGenerating(false)
            setActiveJobId(null)
          }

          if (data.step === "failed") {
            toastManager.add({
              title: "Erreur",
              description: data.error,
              type: "error",
            })
            setIsGenerating(false)
            setActiveJobId(null)
          }
        },
      },
    ),
  )

  const generateMutation = useMutation({
    ...trpc.images.generateStudio.mutationOptions(),
    onSuccess: async (data) => {
      if (data.jobId) {
        setActiveJobId(data.jobId)

        return
      }

      toastManager.add({
        title: "Image chargée depuis le cache",
        type: "success",
      })

      await queryClient.invalidateQueries({
        queryKey: trpc.images.list.queryKey(),
      })

      setIsGenerating(false)
    },
    onError: (error) => {
      toastManager.add({
        title: "Erreur",
        description: error.message,
        type: "error",
      })

      setIsGenerating(false)
    },
  })

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <GenerateForm
          // biome-ignore lint/suspicious/noExplicitAny: need to check models procedure
          modelsInfo={modelsInfo as any}
          onGenerate={(fd) => {
            setIsGenerating(true)
            generateMutation.mutate(fd)
          }}
        />
        <GenerateGallery items={history.items} />
      </div>
    </div>
  )
}
