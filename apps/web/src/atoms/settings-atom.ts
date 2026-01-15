import { config } from "@repo/config"
import { atom } from "jotai"

export type Settings = {
  preset: (typeof config.generationSettings.preset.values)[number]
  weight: number
  age: number
  ethnicity: (typeof config.generationSettings.ethnicity.values)[number]
  background: (typeof config.generationSettings.background.values)[number]
  prompt: string
  files: File[]
}

const initialSettings: Settings = {
  preset: config.generationSettings.preset.default,
  age: config.generationSettings.age.default,
  weight: config.generationSettings.weight.default,
  ethnicity: config.generationSettings.ethnicity
    .default as (typeof config.generationSettings.ethnicity.values)[number],
  background: config.generationSettings.background
    .default as (typeof config.generationSettings.background.values)[number],
  prompt: config.generationSettings.prompt.default,
  files: [],
}

export const settingsAtom = atom(initialSettings)
