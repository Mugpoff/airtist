import { STUDIO_AGE_RANGES } from "@repo/trpc/constants"
import { useEffect, useState } from "react"

const ethnicities = [
  "ASIAN",
  "BLACK",
  "ARAB",
  "WHITE",
  "LATINO",
  "METISSE",
] as const

export type Ethnicity = (typeof ethnicities)[number]

export type ModelsInfoShape = {
  defaultModel: string
  promptDefault: string
  models: string[]
  categories: Array<{ id: string }>
  backgrounds: Array<{ id: string; label: string }>
}

export const useGenerateForm = (modelsInfo: ModelsInfoShape) => {
  const [prompt, setPrompt] = useState(modelsInfo.promptDefault)
  const [model, setModel] = useState<string>(modelsInfo.defaultModel)
  const [category, setCategory] = useState<string>(
    modelsInfo.categories[0]?.id ?? "",
  )
  const [background, setBackground] = useState<string>(
    modelsInfo.backgrounds[0]?.id ?? "",
  )
  const [ethnicity, setEthnicity] = useState<Ethnicity>("WHITE")
  const [height, setHeight] = useState("175")
  const [age, setAge] = useState("22")
  const [files, setFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    const range = STUDIO_AGE_RANGES[category as keyof typeof STUDIO_AGE_RANGES]
    if (!range) return
    setAge(range.min.toString())
    if (category.includes("BABY")) setHeight("80")
    else if (category.includes("CHILD")) setHeight("130")
    else if (category.includes("PRETEEN")) setHeight("155")
    else if (category.includes("TEEN")) setHeight("165")
    else setHeight("175")
  }, [category])

  const buildFormData = () => {
    const fd = new FormData()
    fd.set("prompt", prompt)
    fd.set("model", model)
    fd.set("category", category)
    fd.set("background", background)
    fd.set("ethnicity", ethnicity)
    fd.set("height", height)
    fd.set("age", age)

    for (const f of files) {
      fd.append("images", f)
    }

    if (imageUrls.length > 0) {
      fd.set("imageUrls", JSON.stringify(imageUrls))
    }

    return fd
  }

  return {
    prompt,
    setPrompt,
    model,
    setModel,
    category,
    setCategory,
    background,
    setBackground,
    ethnicity,
    setEthnicity,
    height,
    setHeight,
    age,
    setAge,
    files,
    setFiles,
    imageUrls,
    setImageUrls,
    buildFormData,
  }
}
