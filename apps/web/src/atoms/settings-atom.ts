import { config } from "@repo/config"
import { atom } from "jotai"

type Settings = {
  preset: (typeof config.generationSettings.preset.items)[number]["value"]
  weight: number
  ethnicity: (typeof config.generationSettings.ethnicity.items)[number]["value"]
  background: (typeof config.generationSettings.background.items)[number]["value"]
  files: File[]
}

export const settingsAtom = atom<Settings>({
  preset: config.generationSettings.preset.default,
  weight: config.generationSettings.weight.default,
  ethnicity: config.generationSettings.ethnicity.default,
  background: config.generationSettings.background.default,
  files: [],
})
