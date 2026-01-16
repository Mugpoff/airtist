"use client"

import {
  ArrowDown01Icon,
  ComputerIcon,
  LogoutSquare01Icon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { authClient } from "@repo/auth/client"
import { config } from "@repo/config"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/base/avatar"
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from "@repo/ui/base/menu"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/base/sidebar"
import { getInitials } from "@repo/utils/get-initials"
import { FR, US } from "country-flag-icons/react/3x2"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useAuth } from "@/stores/auth-store"

export const DashboardSidebarFooter = () => {
  const { user } = useAuth()
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("global")
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (value: string) => {
    setTheme(value)
  }

  const handleLanguageChange = (value: string) => {
    // biome-ignore lint/suspicious/noDocumentCookie: it's ok
    document.cookie = `${config.i18n.cookie.name}=${value}; path=/; max-age=${config.i18n.cookie.maxAge}`
    router.refresh()
  }

  const handleSignOut = async () => {
    await authClient.signOut()

    router.push("/auth/sign-in")
  }

  if (!user) {
    return null
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <Menu>
            <MenuTrigger
              render={SidebarMenuButton}
              className="h-fit justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
              <HugeiconsIcon icon={ArrowDown01Icon} />
            </MenuTrigger>
            <MenuPopup side="top" className="w-(--anchor-width)">
              <MenuGroup>
                <MenuGroupLabel>{t("settings")}</MenuGroupLabel>
                <MenuSub>
                  <MenuSubTrigger>
                    {locale === "en" ? <US /> : <FR />}
                    {t("language")}
                  </MenuSubTrigger>
                  <MenuSubPopup>
                    <MenuRadioGroup
                      value={locale}
                      onValueChange={handleLanguageChange}
                    >
                      <MenuRadioItem value="fr">{t("french")}</MenuRadioItem>
                      <MenuRadioItem value="en">{t("english")}</MenuRadioItem>
                    </MenuRadioGroup>
                  </MenuSubPopup>
                </MenuSub>
                <MenuSub>
                  <MenuSubTrigger>
                    {theme === "light" && <HugeiconsIcon icon={Sun03Icon} />}
                    {theme === "dark" && <HugeiconsIcon icon={Moon02Icon} />}
                    {theme === "system" && (
                      <HugeiconsIcon icon={ComputerIcon} />
                    )}
                    {t("theme")}
                  </MenuSubTrigger>
                  <MenuSubPopup>
                    <MenuRadioGroup
                      value={theme}
                      onValueChange={handleThemeChange}
                    >
                      <MenuRadioItem value="light">{t("light")}</MenuRadioItem>
                      <MenuRadioItem value="dark">{t("dark")}</MenuRadioItem>
                      <MenuRadioItem value="system">
                        {t("system")}
                      </MenuRadioItem>
                    </MenuRadioGroup>
                  </MenuSubPopup>
                </MenuSub>
              </MenuGroup>
              <MenuSeparator />
              <MenuItem variant="destructive" onClick={handleSignOut}>
                <HugeiconsIcon icon={LogoutSquare01Icon} />
                {t("signOut")}
              </MenuItem>
            </MenuPopup>
          </Menu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
