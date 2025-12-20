"use client"

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Switch } from "@repo/ui/base/switch-icon"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export const ThemeSwitch = ({ className }: { className?: string }) => {
  const { resolvedTheme: theme, setTheme } = useTheme()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    isClient && (
      <Switch
        className={className}
        leftIcon={<HugeiconsIcon icon={Sun03Icon} />}
        rightIcon={<HugeiconsIcon icon={Moon02Icon} />}
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    )
  )
}
