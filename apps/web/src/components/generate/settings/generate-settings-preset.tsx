import {
  Baby01Icon,
  ChildIcon,
  ManIcon,
  WomanIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { config } from "@repo/config"
import { Button } from "@repo/ui/base/button"
import { Field, FieldLabel } from "@repo/ui/base/field"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@repo/ui/base/number-field"
import {
  type PopoverCreateHandle,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@repo/ui/base/popover"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/base/select"
import { useAtom, useAtomValue } from "jotai"
import { useTranslations } from "next-intl"
import { settingsAtom } from "@/atoms/settings-atom"

type Props = {
  handle: ReturnType<typeof PopoverCreateHandle<React.ComponentType>>
}

export const GenerateSettingsPreset = ({ handle }: Props) => {
  const t = useTranslations("global.preset")
  const settings = useAtomValue(settingsAtom)

  return (
    <PopoverTrigger
      render={<Button variant="outline" />}
      handle={handle}
      payload={Payload}
    >
      {settings.preset === "MAN_CHILD" && <HugeiconsIcon icon={Baby01Icon} />}
      {settings.preset === "WOMAN_CHILD" && <HugeiconsIcon icon={Baby01Icon} />}
      {settings.preset === "MAN_PRETEEN" && <HugeiconsIcon icon={ChildIcon} />}
      {settings.preset === "WOMAN_PRETEEN" && (
        <HugeiconsIcon icon={ChildIcon} />
      )}
      {settings.preset === "MAN_TEEN" && <HugeiconsIcon icon={ChildIcon} />}
      {settings.preset === "WOMAN_TEEN" && <HugeiconsIcon icon={ChildIcon} />}
      {settings.preset === "MAN_ADULT" && <HugeiconsIcon icon={ManIcon} />}
      {settings.preset === "WOMAN_ADULT" && <HugeiconsIcon icon={WomanIcon} />}
      {t(settings.preset)}
    </PopoverTrigger>
  )
}

const Payload = () => {
  const t = useTranslations("global")
  const [settings, setSettings] = useAtom(settingsAtom)
  const items = config.generationSettings.preset.values.map((value) => ({
    label: t(`preset.${value}`),
    value,
  }))
  const showAge =
    settings.preset === "MAN_ADULT" || settings.preset === "WOMAN_ADULT"

  return () => (
    <>
      <div>
        <PopoverTitle>{t("preset.title")}</PopoverTitle>
        <PopoverDescription>{t("preset.description")}</PopoverDescription>
      </div>
      <div>
        <Select
          value={settings.preset}
          onValueChange={(value) => {
            if (value) setSettings((prev) => ({ ...prev, preset: value }))
          }}
        >
          <SelectTrigger>
            <SelectValue>{t(`preset.${settings.preset}`)}</SelectValue>
          </SelectTrigger>
          <SelectPopup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>
      {showAge && (
        <Field>
          <FieldLabel>{t("age")}</FieldLabel>
          <NumberField
            value={settings.age}
            onValueChange={(value) => {
              if (value) setSettings((prev) => ({ ...prev, age: value }))
            }}
          >
            <NumberFieldGroup>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
        </Field>
      )}
    </>
  )
}
