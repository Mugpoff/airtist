"use client"

import { pageIndexAtom } from "@/atoms/canvas-atom"
import { settingsAtom } from "@/atoms/settings-atom"
import { LanguageSelector } from "@/components/ui/language-selector"
import { SignOutButton } from "@/components/ui/sign-out-button"
import { ThemeSwitch } from "@/components/ui/theme-switch"
import { useTRPC } from "@/trpc/react"
import { config } from "@repo/config"
import type { AppRouter } from "@repo/trpc"
import { LightRays } from "@repo/ui/backgrounds/light-rays"
import { toastManager } from "@repo/ui/base/toast"
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/base/tooltip"
import { ShimmerButton } from "@repo/ui/buttons/shimmer-button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TRPCClientErrorLike } from "@trpc/client"
import { useSubscription } from "@trpc/tanstack-react-query"
import { useAtomValue, useSetAtom } from "jotai"
import { useTranslations } from "next-intl"
import type React from "react"
import { useState } from "react"
import { GenerateDropzone } from "./generate-dropzone"
import { GenerateSettings } from "./settings/generate-settings"

const tooltipHandle = TooltipCreateHandle<React.ComponentType>()

const toFriendlyError = (error: TRPCClientErrorLike<AppRouter>) => {
  const message = error.message.toLowerCase()
  if (message.includes("âge") || message.includes("age")) {
    return "Âge incompatible avec ce preset. Ajuste l’âge ou la catégorie."
  }
  if (message.includes("prompt incompatible")) {
    return "Le prompt ne correspond pas au preset choisi. Modifie le prompt ou la catégorie."
  }
  if (message.includes("images requises")) {
    return "Ajoute au moins une image de vêtement pour générer."
  }
  return ""
}

export const GenerateContent = () => {
  const t = useTranslations("home")
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { mutate } = useMutation(trpc.images.generateStudio.mutationOptions())
  const settings = useAtomValue(settingsAtom)
  const setPageIndex = useSetAtom(pageIndexAtom)
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const { status, reset } = useSubscription(
    trpc.onGenerateProgress.subscriptionOptions(
      { jobId: activeJobId ?? "" },
      {
        enabled: !!activeJobId,
        onData: async (data) => {
          if (data.step === "completed") {
            await queryClient.invalidateQueries({
              queryKey: trpc.images.list.queryKey(),
            })

            reset()
            setPageIndex(1)
            setActiveJobId(null)
          }

          if (data.step === "failed") {
            toastManager.add({
              title: "Erreur",
              description: data.error,
              type: "error",
            })

            reset()
            setActiveJobId(null)
          }
        },
      },
    ),
  )

  const handleClick = () => {
    const formData = new FormData()

    formData.set("prompt", settings.prompt)
    formData.set("category", settings.preset)
    formData.set("background", settings.background)
    formData.set("ethnicity", settings.ethnicity)
    formData.set("age", settings.age.toString())
    formData.set("model", config.generationSettings.model.default)
    formData.set("height", "170")
    formData.set("aspectRatio", "1:1")

    for (const file of settings.files) {
      formData.append("images", file)
    }

    mutate(formData, {
      onSuccess: (data) => {
        setActiveJobId(data.jobId)
      },
      onError: (error) => {
        const friendlyMessage = toFriendlyError(error)
        toastManager.add({
          title: friendlyMessage || t("generationError"),
          type: "error",
        })
      },
    })
  }

  return (
    <div className="relative flex size-full justify-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden not-dark:opacity-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.5}
          lightSpread={0.8}
          rayLength={1.2}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          followMouse
        />
      </div>
      <div className="flex size-full max-w-6xl flex-col justify-center gap-8 p-16">
        <GenerateSettings />
        <GenerateDropzone isGenerating={status === "pending"} />
        <div className="grid grid-cols-3 items-center">
          <div />
          <div className="flex justify-center">
            <ShimmerButton
              className="px-12"
              onClick={handleClick}
              disabled={settings.files.length === 0 || status === "pending"}
            >
              Generate
            </ShimmerButton>
          </div>
          <TooltipProvider>
            <div className="flex items-center justify-end gap-2">
              <TooltipTrigger
                handle={tooltipHandle}
                payload={() => <span>{t("tooltips.theme")}</span>}
                render={<div />}
              >
                <ThemeSwitch />
              </TooltipTrigger>
              <TooltipTrigger
                handle={tooltipHandle}
                payload={() => <span>{t("tooltips.language")}</span>}
                render={<div />}
              >
                <LanguageSelector />
              </TooltipTrigger>
              <TooltipTrigger
                handle={tooltipHandle}
                payload={() => <span>{t("tooltips.signOut")}</span>}
                render={<div />}
              >
                <SignOutButton />
              </TooltipTrigger>
            </div>

            <Tooltip handle={tooltipHandle}>
              {({ payload: Payload }) => (
                <TooltipPopup>
                  {Payload !== undefined && <Payload />}
                </TooltipPopup>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
