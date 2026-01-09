import { Alert02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export const MobileForbidden = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center md:hidden">
      <HugeiconsIcon icon={Alert02Icon} className="size-10 text-warning" />
      <p className="z-10 mt-4 font-medium text-lg">
        This site is desktop only.
      </p>
      <p className="z-10 text-muted-foreground text-sm">
        Please switch to a desktop device to continue.
      </p>
    </main>
  )
}
