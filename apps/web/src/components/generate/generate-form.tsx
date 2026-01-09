"use client"

import { STUDIO_AGE_RANGES } from "@repo/trpc/constants"
import { Button } from "@repo/ui/base/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/base/card"
import { Input } from "@repo/ui/base/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/base/select"
import { toastManager } from "@repo/ui/base/toast"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { Suspense } from "react"
import { isGeneratingAtom } from "@/atoms/is-generating-atom"
import { useTRPC } from "@/trpc/react"
import { DrivePicker } from "./drive-picker"
import { GoogleConnectButton } from "./google-connect-button"
import type { Ethnicity, ModelsInfoShape } from "./use-generate-form"
import { useGenerateForm } from "./use-generate-form"

const ethnicities = [
  "ASIAN",
  "BLACK",
  "ARAB",
  "WHITE",
  "LATINO",
  "METISSE",
] as const

type Props = {
  modelsInfo: ModelsInfoShape
  onGenerate: (fd: FormData) => void
}

function DriveSection({
  disabled: _,
  onImported,
}: {
  disabled: boolean
  onImported: (urls: string[]) => void
}) {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.drive.status.queryOptions())

  if (!data.connected) {
    return (
      <div className="rounded-md border p-4">
        <div className="mb-3 text-muted-foreground text-sm">
          Google Drive non connecté.
        </div>
        <GoogleConnectButton />
      </div>
    )
  }

  return <DrivePicker onImported={onImported} />
}

export function GenerateForm({ modelsInfo, onGenerate }: Props) {
  const isGenerating = useAtomValue(isGeneratingAtom)
  const form = useGenerateForm(modelsInfo)

  const handleGenerate = () => {
    if (!form.prompt.trim()) {
      toastManager.add({
        title: "Le prompt ne peut pas être vide",
        type: "error",
      })
      return
    }

    if (form.files.length < 1 && form.imageUrls.length < 1) {
      toastManager.add({
        title: "Ajoute au moins une image de vêtement",
        type: "error",
      })
      return
    }

    const ageNum = parseInt(form.age, 10)
    const range =
      STUDIO_AGE_RANGES[form.category as keyof typeof STUDIO_AGE_RANGES]
    if (range && (ageNum < range.min || ageNum > range.max)) {
      toastManager.add({
        title: "Âge non autorisé",
        description: `L'âge pour cette catégorie doit être entre ${range.min} et ${range.max} ans.`,
        type: "error",
      })
      return
    }

    onGenerate(form.buildFormData())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générer une nouvelle image studio</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="prompt-input">Prompt</label>
          <Input
            id="prompt-input"
            value={form.prompt}
            onChange={(e) => form.setPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label>Modèle IA</label>
            <Select
              value={form.model}
              onValueChange={(value) => {
                if (value) form.setModel(value)
              }}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelsInfo.models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Genre / Âge</label>
            <Select
              value={form.category}
              onValueChange={(value) => {
                if (value) form.setCategory(value)
              }}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelsInfo.categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Arrière-plan</label>
            <Select
              value={form.background}
              onValueChange={(value) => {
                if (value) form.setBackground(value)
              }}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelsInfo.backgrounds.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Ethnicity</label>
            <Select
              value={form.ethnicity}
              onValueChange={(value) => {
                if (value) form.setEthnicity(value as Ethnicity)
              }}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ethnicities.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Height (cm)</label>
            <Input
              inputMode="numeric"
              value={form.height}
              onChange={(e) => form.setHeight(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <label>Age</label>
            <Input
              inputMode="numeric"
              value={form.age}
              onChange={(e) => form.setAge(e.target.value)}
              disabled={isGenerating}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label>Clothing images (local)</label>
          <Input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/avif,image/heic"
            disabled={isGenerating}
            onChange={(e) => {
              const list = e.target.files
              if (!list) {
                form.setFiles([])
                return
              }
              form.setFiles(Array.from(list))
            }}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm">
              Images importées: {form.imageUrls.length}
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={isGenerating || form.imageUrls.length === 0}
              onClick={() => form.setImageUrls([])}
            >
              Vider
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="rounded-md border p-4 text-muted-foreground text-sm">
                Chargement Google Drive...
              </div>
            }
          >
            <DriveSection
              disabled={isGenerating}
              onImported={(urls) => {
                form.setImageUrls((prev) => {
                  const set = new Set([...prev, ...urls])
                  return Array.from(set)
                })
              }}
            />
          </Suspense>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Génération..." : "Générer"}
        </Button>
      </CardFooter>
    </Card>
  )
}
