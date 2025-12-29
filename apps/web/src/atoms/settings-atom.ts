import { config } from "@repo/config"
import { atom } from "jotai"

type Settings = {
  gender: (typeof config.generationSettings.gender.items)[number]["value"]
  age: number
  weight: number
  ethnicity: (typeof config.generationSettings.ethnicity.items)[number]["value"]
  files: File[]
}

export const settingsAtom = atom<Settings>({
  gender: config.generationSettings.gender.default,
  age: config.generationSettings.age.default,
  weight: config.generationSettings.weight.default,
  ethnicity: config.generationSettings.ethnicity.default,
  files: [],
})
