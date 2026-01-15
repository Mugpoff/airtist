import { BackgroundIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { BACKGROUND_VALUES, type config } from "@repo/config"
import { Button } from "@repo/ui/base/button"
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
import type { Settings } from "@/atoms/settings-atom"
import { settingsAtom } from "@/atoms/settings-atom"

type Props = {
  handle: ReturnType<typeof PopoverCreateHandle<React.ComponentType>>
}

export const GenerateSettingsBackground = ({ handle }: Props) => {
  const t = useTranslations("global.background")
  const settings = useAtomValue(settingsAtom)

  return (
    <PopoverTrigger
      render={<Button variant="outline" />}
      handle={handle}
      payload={Payload}
    >
      <HugeiconsIcon icon={BackgroundIcon} />
      {t(settings.background)}
    </PopoverTrigger>
  )
}

const Payload = () => {
  const t = useTranslations("global.background")
  const [settings, setSettings] = useAtom(settingsAtom)
  const items = BACKGROUND_VALUES.map((value) => ({
    label: t(value),
    value,
  }))

  return (
    <>
      <div>
        <PopoverTitle>{t("title")}</PopoverTitle>
        <PopoverDescription>{t("description")}</PopoverDescription>
      </div>
      <div>
        <Select
          value={settings.background}
          onValueChange={(value) => {
            if (value)
              setSettings((prev: Settings) => ({
                ...prev,
                background:
                  value as (typeof config.generationSettings.background.values)[number],
              }))
          }}
        >
          <SelectTrigger>
            <SelectValue>{t(settings.background)}</SelectValue>
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
    </>
  )
}
