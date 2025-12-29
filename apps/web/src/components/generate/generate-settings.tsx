import { zodResolver } from "@hookform/resolvers/zod"
import { Settings05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { config } from "@repo/config"
import { Button } from "@repo/ui/base/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/base/dialog"
import { Form } from "@repo/ui/base/form"
import { NumberInputField } from "@repo/ui/fields/number-input-field"
import { SelectField } from "@repo/ui/fields/select-field"
import { SubmitButton } from "@repo/ui/fields/submit-button"
import { useAtom } from "jotai"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { settingsAtom } from "@/atoms/settings-atom"
import { zodMessages } from "@/utils/zod-messages"

const settingsSchema = z.object({
  preset: z.enum(
    config.generationSettings.preset.items.map((item) => item.value),
    zodMessages.preset.invalid,
  ),
  ethnicity: z.enum(
    config.generationSettings.ethnicity.items.map((item) => item.value),
    zodMessages.ethnicity.invalid,
  ),
  background: z.enum(
    config.generationSettings.background.items.map((item) => item.value),
    zodMessages.background.invalid,
  ),
  weight: z
    .int(zodMessages.weight.invalid)
    .min(config.generationSettings.weight.min, zodMessages.weight.min)
    .max(config.generationSettings.weight.max, zodMessages.weight.max),
})

export const GenerateSettings = () => {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      preset: config.generationSettings.preset.default,
      weight: config.generationSettings.weight.default,
      ethnicity: config.generationSettings.ethnicity.default,
      background: config.generationSettings.background.default,
    },
    mode: "onTouched",
  })
  const t = useTranslations()
  const [settings, setSettings] = useAtom(settingsAtom)

  const onSubmit = (data: z.infer<typeof settingsSchema>) => {
    setSettings((prev) => ({
      ...prev,
      preset: data.preset,
      weight: data.weight,
      ethnicity: data.ethnicity,
      background: data.background,
    }))
    setOpen(false)
    form.reset(data)
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />}>
          <HugeiconsIcon icon={Settings05Icon} />
          {t("home.generate.settings", {
            preset: settings.preset,
            ethnicity: settings.ethnicity,
            weight: settings.weight.toString(),
            background: settings.background,
          })}
        </DialogTrigger>
        <DialogPopup showCloseButton>
          <Form
            className="contents"
            onSubmit={form.handleSubmit(onSubmit)}
            form={form}
          >
            <DialogHeader>
              <DialogTitle>{t("home.generate.title")}</DialogTitle>
              <DialogDescription>
                {t("home.generate.description")}
              </DialogDescription>
            </DialogHeader>
            <DialogPanel className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  name="preset"
                  control={form.control}
                  label={t("global.preset.title")}
                  items={config.generationSettings.preset.items.map((item) => ({
                    label: t(item.label),
                    value: item.value,
                  }))}
                />
                <SelectField
                  name="ethnicity"
                  control={form.control}
                  label={t("global.ethnicity.title")}
                  items={config.generationSettings.ethnicity.items.map(
                    (item) => ({
                      label: t(item.label),
                      value: item.value,
                    }),
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <NumberInputField
                  name="weight"
                  control={form.control}
                  label={t("global.weight")}
                  min={config.generationSettings.weight.min}
                  max={config.generationSettings.weight.max}
                />
                <SelectField
                  name="background"
                  control={form.control}
                  label={t("global.background.title")}
                  items={config.generationSettings.background.items.map(
                    (item) => ({
                      label: t(item.label),
                      value: item.value,
                    }),
                  )}
                />
              </div>
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>
                {t("global.cancel")}
              </DialogClose>
              <SubmitButton submittingText={t("global.saving")}>
                {t("global.save")}
              </SubmitButton>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </div>
  )
}
