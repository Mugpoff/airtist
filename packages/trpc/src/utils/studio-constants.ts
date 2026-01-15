import { config, PRESET_METADATA } from "@repo/config"
import { z } from "zod"

export const StudioCategorySchema = z.enum(
  config.generationSettings.preset.values,
)

export type StudioCategory = z.infer<typeof StudioCategorySchema>

const presetMetadata = PRESET_METADATA as Record<
  StudioCategory,
  {
    label: string
    ageRange: { min: number; max: number }
  }
>

export const STUDIO_CATEGORIES = Object.fromEntries(
  Object.entries(presetMetadata).map(([preset, metadata]) => [
    preset,
    metadata.label,
  ]),
) as Record<StudioCategory, string>

export const STUDIO_AGE_RANGES = Object.fromEntries(
  Object.entries(presetMetadata).map(([preset, metadata]) => [
    preset,
    metadata.ageRange,
  ]),
) as Record<StudioCategory, { min: number; max: number }>

export const StudioBackgroundSchema = z.enum(
  config.generationSettings.background.values,
)

export type StudioBackground = z.infer<typeof StudioBackgroundSchema>

export const STUDIO_BACKGROUNDS: Record<StudioBackground, string> = {
  STUDIO_WHITE: "Fond Blanc Pur (E-commerce)",
  STUDIO_GREY: "Fond Gris Neutre",
  STUDIO_DARK_GREY: "Fond Gris Anthracite",
  STUDIO_BLACK: "Fond Noir Artistique",
  STUDIO_BEIGE: "Fond Beige (Chaleureux)",
}

export const BACKGROUND_PROMPTS: Record<StudioBackground, string> = {
  STUDIO_WHITE: "pure white studio background, seamless infinite white",
  STUDIO_GREY: "neutral grey studio paper background",
  STUDIO_DARK_GREY: "dark charcoal grey studio background",
  STUDIO_BLACK: "pitch black studio background, dramatic lighting",
  STUDIO_BEIGE: "soft warm beige studio wall background",
}

export const EthnicitySchema = z.enum(
  config.generationSettings.ethnicity.values,
)
