"use client"

import { LightRays } from "@repo/ui/backgrounds/light-rays"
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/base/tooltip"
import { ShimmerButton } from "@repo/ui/buttons/shimmer-button"
import { useTranslations } from "next-intl"
import type React from "react"
import { SignOutButton } from "@/components/ui/sign-out-button"
import { ThemeSwitch } from "@/components/ui/theme-switch"
import { LanguageSelector } from "../ui/language-selector"
import { GenerateDropzone } from "./generate-dropzone"

const tooltipHandle = TooltipCreateHandle<React.ComponentType>()

export const GenerateContent = () => {
  const t = useTranslations("home.tooltips")

  return (
    <div className="relative flex size-full flex-col justify-center gap-4">
      <div className="-m-16 absolute top-0 not-dark:hidden h-[600px] w-screen">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fff"
          raysSpeed={0.5}
          lightSpread={0.8}
          rayLength={1.2}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          followMouse
        />
      </div>
      <GenerateDropzone />
      <div className="grid grid-cols-3">
        <div>part 1</div>
        <div className="flex justify-center">
          <ShimmerButton className="px-12">Generate</ShimmerButton>
        </div>
        <TooltipProvider>
          <div className="flex items-center justify-end gap-2">
            <TooltipTrigger
              handle={tooltipHandle}
              payload={() => <span>{t("theme")}</span>}
              render={<div />}
            >
              <ThemeSwitch />
            </TooltipTrigger>
            <TooltipTrigger
              handle={tooltipHandle}
              payload={() => <span>{t("language")}</span>}
              render={<div />}
            >
              <LanguageSelector />
            </TooltipTrigger>
            <TooltipTrigger
              handle={tooltipHandle}
              payload={() => <span>{t("signOut")}</span>}
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
  )
}
