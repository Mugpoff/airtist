import { createHash } from "node:crypto"

export type StudioHashInput = {
  prompt: string
  model: string
  category: string
  background: string
  ethnicity: string
  age: number
  height: number
  aspectRatio: string
}

export const generateStudioHash = (input: StudioHashInput) => {
  const str = JSON.stringify(input)
  return createHash("sha256").update(str).digest("hex")
}
