import { ArrowUp02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@repo/ui/base/button"
import { Void } from "@repo/ui/illustrations/void"
import { useSetAtom } from "jotai"
import { useTranslations } from "next-intl"
import { pageIndexAtom } from "@/atoms/canvas-atom"

export const CanvasEmpty = () => {
  const t = useTranslations("home.canvas.empty")
  const setPageIndex = useSetAtom(pageIndexAtom)

  return (
    <div className="flex size-full max-w-6xl flex-col items-center justify-center gap-8 p-16">
      <Void className="size-64" />
      <div className="flex flex-col items-center gap-2">
        <p>{t("title")}</p>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPageIndex(0)}
            variant="ghost"
            className="hover:[&_svg]:-translate-y-0.5"
          >
            {t("button")}
            <HugeiconsIcon
              icon={ArrowUp02Icon}
              className="size-4 transition-transform"
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
