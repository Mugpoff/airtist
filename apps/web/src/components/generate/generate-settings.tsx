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
  gender: z.enum(
    config.generationSettings.gender.items.map((item) => item.value),
    zodMessages.gender.invalid,
  ),
  age: z
    .int(zodMessages.age.invalid)
    .min(config.generationSettings.age.min, zodMessages.age.min)
    .max(config.generationSettings.age.max, zodMessages.age.max),
  weight: z
    .int(zodMessages.weight.invalid)
    .min(config.generationSettings.weight.min, zodMessages.weight.min)
    .max(config.generationSettings.weight.max, zodMessages.weight.max),
  ethnicity: z.enum(
    config.generationSettings.ethnicity.items.map((item) => item.value),
    zodMessages.ethnicity.invalid,
  ),
})

export const GenerateSettings = () => {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      gender: "male",
      age: 25,
      weight: 70,
      ethnicity: "white",
    },
    mode: "onTouched",
  })
  const t = useTranslations()
  const [settings, setSettings] = useAtom(settingsAtom)

  const onSubmit = (data: z.infer<typeof settingsSchema>) => {
    setSettings({
      gender: data.gender,
      age: data.age,
      weight: data.weight,
      ethnicity: data.ethnicity,
    })
    setOpen(false)
    form.reset(data)
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />}>
          <HugeiconsIcon icon={Settings05Icon} />
          {t("home.generate.settings", {
            gender: settings.gender,
            ethnicity: settings.ethnicity,
            age: settings.age,
            weight: settings.weight.toString(),
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
                <NumberInputField
                  name="age"
                  control={form.control}
                  label={t("global.age")}
                  min={config.generationSettings.age.min}
                  max={config.generationSettings.age.max}
                />
                <NumberInputField
                  name="weight"
                  control={form.control}
                  label={t("global.weight")}
                  min={config.generationSettings.weight.min}
                  max={config.generationSettings.weight.max}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  name="gender"
                  control={form.control}
                  label={t("global.gender.title")}
                  items={config.generationSettings.gender.items.map((item) => ({
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
