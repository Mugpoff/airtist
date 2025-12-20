import { config } from "@repo/config"
import { Button } from "@repo/ui/base/button"
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@repo/ui/base/menu"
import { FR, US } from "country-flag-icons/react/3x2"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

export const LanguageSelector = () => {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("global")

  const handleChange = (value: string) => {
    // biome-ignore lint/suspicious/noDocumentCookie: it's ok
    document.cookie = `${config.i18n.cookie.name}=${value}; path=/; max-age=${config.i18n.cookie.maxAge}`
    router.refresh()
  }

  return (
    <Menu>
      <MenuTrigger render={<Button variant="ghost" className="px-[7px]" />}>
        {locale === "en" ? <US /> : <FR />}
      </MenuTrigger>
      <MenuPopup>
        <MenuRadioGroup defaultValue={locale} onValueChange={handleChange}>
          <MenuRadioItem value="en">{t("english")}</MenuRadioItem>
          <MenuRadioItem value="fr">{t("french")}</MenuRadioItem>
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  )
}
