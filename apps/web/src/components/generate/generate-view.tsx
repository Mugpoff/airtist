"use client"

import { toastManager } from "@repo/ui/base/toast"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useSetAtom } from "jotai"
import { useQueryState } from "nuqs"
import { isGeneratingAtom } from "@/atoms/is-generating-atom"
import { trpc, useTRPC } from "@/trpc/react"
import { GenerateForm } from "./generate-form"
import { GenerateGallery } from "./generate-gallery"

export function GenerateView() {
  const t = useTRPC()
  const queryClient = useQueryClient()
  const setIsGenerating = useSetAtom(isGeneratingAtom)

  const [activeJobId, setActiveJobId] = useQueryState("jobId")

  const { data: history } = useSuspenseQuery(
    t.images.list.queryOptions({ limit: 50, offset: 0 }),
  )
  const { data: modelsInfo } = useSuspenseQuery(t.images.models.queryOptions())

  trpc.onGenerateProgress.useSubscription(
    { jobId: activeJobId ?? "" },
    {
      enabled: !!activeJobId,
      onData: (data) => {
        if (data.step === "completed") {
          toastManager.add({ title: "Génération réussie !", type: "success" })
          queryClient.invalidateQueries({ queryKey: t.images.list.queryKey() })
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
  )

  const generateMutation = useMutation({
    ...t.images.generateStudio.mutationOptions(),
    onSuccess: (data) => {
      if (data.jobId) {
        setActiveJobId(data.jobId)
      } else {
        toastManager.add({
          title: "Image chargée depuis le cache",
          type: "success",
        })
        queryClient.invalidateQueries({ queryKey: t.images.list.queryKey() })
        setIsGenerating(false)
      }
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
