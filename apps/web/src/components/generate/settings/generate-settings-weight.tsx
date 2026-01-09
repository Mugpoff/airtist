import { WeightScaleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { config } from "@repo/config"
import { Button } from "@repo/ui/base/button"
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
import { useAtom, useAtomValue } from "jotai"
import { useTranslations } from "next-intl"
import { settingsAtom } from "@/atoms/settings-atom"

type Props = {
  handle: ReturnType<typeof PopoverCreateHandle<React.ComponentType>>
}

export const GenerateSettingsWeight = ({ handle }: Props) => {
  const settings = useAtomValue(settingsAtom)

  return (
    <PopoverTrigger
      render={<Button variant="outline" />}
      handle={handle}
      payload={Payload}
    >
      <HugeiconsIcon icon={WeightScaleIcon} />
      {settings.weight} kg
    </PopoverTrigger>
  )
}

const Payload = () => {
  const t = useTranslations("global.weight")
  const [settings, setSettings] = useAtom(settingsAtom)

  return (
    <>
      <div>
        <PopoverTitle>{t("title")}</PopoverTitle>
        <PopoverDescription>{t("description")}</PopoverDescription>
      </div>
      <div>
        <NumberField
          value={settings.weight}
          onValueChange={(value) =>
            setSettings((prev) => ({
              ...prev,
              weight: value ?? prev.weight,
            }))
          }
          min={config.generationSettings.weight.min}
          max={config.generationSettings.weight.max}
        >
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </div>
    </>
  )
}
