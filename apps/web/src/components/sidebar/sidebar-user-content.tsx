"use client"

import { useAuth } from "@/stores/auth-store"
import { authClient } from "@repo/auth/client"
import { config } from "@repo/config"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/base/avatar"
import { Button } from "@repo/ui/base/button"
import {
  Menu,
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
  ChevronsUpDownIcon,
  GlobeIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react"
import { useLocale } from "next-intl"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  fr: "Français",
}

export const SidebarUserContent = () => {
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const router = useRouter()
  const { user } = useAuth()

  const handleLanguageChange = (newLocale: string) => {
    // biome-ignore lint/suspicious/noDocumentCookie: Setting language cookie is a valid use case
    globalThis.document.cookie = `${config.i18n.cookie.name}=${newLocale}; path=/; max-age=${config.i18n.cookie.maxAge}`
    router.refresh()
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in")
        },
      },
    })
  }

  if (!user) {
    return null
  }

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <p>{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </div>
            <ChevronsUpDownIcon className="text-muted-foreground" />
          </Button>
        }
      />
      <MenuPopup side="right" align="end">
        {/* Theme Selector */}
        <MenuSub>
          <MenuSubTrigger>
            <SunIcon className="dark:hidden" />
            <MoonIcon className="hidden dark:block" />
            Theme
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup value={theme} onValueChange={setTheme}>
              <MenuRadioItem value="light">Light</MenuRadioItem>
              <MenuRadioItem value="dark">Dark</MenuRadioItem>
              <MenuRadioItem value="system">System</MenuRadioItem>
            </MenuRadioGroup>
          </MenuSubPopup>
        </MenuSub>

        {/* Language Selector */}
        <MenuSub>
          <MenuSubTrigger>
            <GlobeIcon />
            Language
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup value={locale} onValueChange={handleLanguageChange}>
              {config.i18n.availableLocales.map((loc) => (
                <MenuRadioItem key={loc} value={loc}>
                  {LANGUAGE_LABELS[loc] ?? loc}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuSubPopup>
        </MenuSub>

        <MenuSeparator />

        {/* Sign Out */}
        <MenuItem variant="destructive" onClick={handleSignOut}>
          <LogOutIcon />
          Sign Out
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}
