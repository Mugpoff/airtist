import { z } from "zod"

export const StudioCategorySchema = z.enum([
  "MAN_CHILD",
  "MAN_PRETEEN",
  "MAN_TEEN",
  "MAN_ADULT",
  "WOMAN_CHILD",
  "WOMAN_PRETEEN",
  "WOMAN_TEEN",
  "WOMAN_ADULT",
])

export type StudioCategory = z.infer<typeof StudioCategorySchema>

export const STUDIO_CATEGORIES: Record<StudioCategory, string> = {
  MAN_CHILD: "Garçon (Enfant)",
  MAN_PRETEEN: "Garçon (Pré-adolescent)",
  MAN_TEEN: "Homme (Adolescent)",
  MAN_ADULT: "Homme (Adulte)",
  WOMAN_CHILD: "Fille (Enfant)",
  WOMAN_PRETEEN: "Fille (Pré-adolescente)",
  WOMAN_TEEN: "Femme (Adolescente)",
  WOMAN_ADULT: "Femme (Adulte)",
}

export const STUDIO_AGE_RANGES: Record<
  StudioCategory,
  { min: number; max: number }
> = {
  MAN_CHILD: { min: 6, max: 12 },
  WOMAN_CHILD: { min: 6, max: 12 },
  MAN_PRETEEN: { min: 13, max: 15 },
  WOMAN_PRETEEN: { min: 13, max: 15 },
  MAN_TEEN: { min: 16, max: 18 },
  WOMAN_TEEN: { min: 16, max: 18 },
  MAN_ADULT: { min: 19, max: 100 },
  WOMAN_ADULT: { min: 19, max: 100 },
}

export const StudioBackgroundSchema = z.enum([
  "STUDIO_WHITE",
  "STUDIO_GREY",
  "STUDIO_DARK_GREY",
  "STUDIO_BLACK",
  "STUDIO_BEIGE",
])

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
