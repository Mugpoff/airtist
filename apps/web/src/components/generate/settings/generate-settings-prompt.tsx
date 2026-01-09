import { TextAlignLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@repo/ui/base/button"
import {
  type PopoverCreateHandle,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@repo/ui/base/popover"
import { Textarea } from "@repo/ui/base/textarea"
import { useAtom } from "jotai"
import { useTranslations } from "next-intl"
import { settingsAtom } from "@/atoms/settings-atom"

type Props = {
  handle: ReturnType<typeof PopoverCreateHandle<React.ComponentType>>
}

export const GenerateSettingsPrompt = ({ handle }: Props) => {
  const t = useTranslations("global.prompt")
  const [settings, setSettings] = useAtom(settingsAtom)

  return (
    <PopoverTrigger
      render={<Button variant="outline" />}
      handle={handle}
      payload={() => (
        <>
          <div>
            <PopoverTitle>{t("title")}</PopoverTitle>
            <PopoverDescription>{t("description")}</PopoverDescription>
          </div>
          <div>
            <Textarea
              value={settings.prompt}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, prompt: e.target.value }))
              }
              placeholder={t("placeholder")}
            />
          </div>
        </>
      )}
    >
      <HugeiconsIcon icon={TextAlignLeftIcon} />
      {settings.prompt || t("title")}
    </PopoverTrigger>
  )
}
