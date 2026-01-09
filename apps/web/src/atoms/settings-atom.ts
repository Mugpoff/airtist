import { config } from "@repo/config"
import { atom } from "jotai"

type Settings = {
  preset: (typeof config.generationSettings.preset.values)[number]
  weight: number
  age: number
  ethnicity: (typeof config.generationSettings.ethnicity.values)[number]
  background: (typeof config.generationSettings.background.values)[number]
  prompt: string
  files: File[]
}

export const settingsAtom = atom<Settings>({
  preset: config.generationSettings.preset.default,
  age: config.generationSettings.age.default,
  weight: config.generationSettings.weight.default,
  ethnicity: config.generationSettings.ethnicity.default,
  background: config.generationSettings.background.default,
  prompt: "Studio fashion model wearing the outfit",
  files: [],
})
