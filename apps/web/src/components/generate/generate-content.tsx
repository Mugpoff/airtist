"use client"

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
import { useAtomValue, useSetAtom } from "jotai"
import { useTranslations } from "next-intl"
import type React from "react"
import { pageIndexAtom } from "@/atoms/canvas-atom"
import { settingsAtom } from "@/atoms/settings-atom"
import { LanguageSelector } from "@/components/ui/language-selector"
import { SignOutButton } from "@/components/ui/sign-out-button"
import { ThemeSwitch } from "@/components/ui/theme-switch"
import { useTRPC } from "@/trpc/react"
import { GenerateDropzone } from "./generate-dropzone"
import { GenerateSettings } from "./settings/generate-settings"

const tooltipHandle = TooltipCreateHandle<React.ComponentType>()

export const GenerateContent = () => {
  const t = useTranslations("home")
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation(
    trpc.images.generateStudio.mutationOptions(),
  )
  const settings = useAtomValue(settingsAtom)
  const setPageIndex = useSetAtom(pageIndexAtom)

  const handleClick = () => {
    const formData = new FormData()

    formData.set("prompt", "Studio fashion model wearing the outfit")
    formData.set("model", "google/gemini-3-pro-image-preview")
    formData.set("category", "MAN_ADULT")
    formData.set("background", settings.background)
    formData.set("ethnicity", settings.ethnicity.toUpperCase())
    formData.set("height", "170")
    formData.set("age", "25")
    formData.set("aspectRatio", "1:1")

    for (const file of settings.files) {
      formData.append("images", file)
    }

    mutate(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.images.list.queryKey(),
        })

        setPageIndex(1)
      },
      onError: (error) => {
        toastManager.add({
          title: t("generate.error"),
          type: "error",
        })

        console.error(error)
      },
    })
  }

  return (
    <div className="relative size-full">
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
      <div className="flex size-full max-w-6xl flex-col justify-center gap-8 place-self-center p-16">
        <GenerateSettings />
        <GenerateDropzone isGenerating={isPending} />
        <div className="grid grid-cols-3 items-center">
          <div />
          <div className="flex justify-center">
            <ShimmerButton
              className="px-12"
              onClick={handleClick}
              disabled={settings.files.length === 0 || isPending}
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
