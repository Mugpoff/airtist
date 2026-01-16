import type { GenerationPreset } from "@repo/config"

export const isPresetBaby = (preset: GenerationPreset) => {
  return preset === "MAN_BABY" || preset === "WOMAN_BABY"
}
