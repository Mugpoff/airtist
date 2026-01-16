import type { GenerationPreset } from "@repo/config"

export const isPresetAdult = (preset: GenerationPreset) => {
  return preset === "MAN_ADULT" || preset === "WOMAN_ADULT"
}
