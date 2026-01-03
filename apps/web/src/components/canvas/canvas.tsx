import { Download04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { RippleEffect } from "@repo/ui/backgrounds/ripple-effect"
import { Button } from "@repo/ui/base/button"
import { Separator } from "@repo/ui/base/separator"
import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import Image from "next/image"
import { selectedImageIndexAtom } from "@/atoms/canvas-atom"
import { useTRPC } from "@/trpc/react"
import { toCdnUrl } from "@/utils/to-cdn-url"
import { CanvasFooter } from "./canvas-footer"
import { CanvasSidebar } from "./canvas-sidebar"

export const Canvas = () => {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.images.list.queryOptions({}))
  const selectedImageIndex = useAtomValue(selectedImageIndexAtom)
  const selectedImage = data?.items[selectedImageIndex]

  const handleDownload = async () => {
    if (!selectedImage?.imageUrl) return
    const response = await fetch(toCdnUrl(selectedImage.imageUrl))
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedImage.id}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading || !selectedImage || !selectedImage.imageUrl) return

  return (
    <div className="flex size-full max-w-6xl justify-center place-self-center p-16">
      <CanvasSidebar />
      <Separator orientation="vertical" className="mx-8" />
      <div className="after:-inset-[5px] after:-z-1 relative ml-0 flex min-w-0 flex-1 flex-col rounded-2xl border bg-muted/50 bg-clip-padding shadow-black/5 shadow-sm after:pointer-events-none after:absolute after:rounded-[calc(var(--radius-2xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72">
        <div className="group -m-px relative h-auto shrink grow basis-auto overflow-hidden rounded-t-2xl border bg-background p-8 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] max-lg:before:hidden dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
          <div className="-m-8 mask-l-from-70% mask-b-from-20% mask-intersect relative size-full place-self-end">
            <RippleEffect cols={20} rows={20} />
          </div>
          <Image
            src={toCdnUrl(selectedImage.imageUrl)}
            alt="Canvas"
            width={1024}
            height={1024}
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 flex max-h-2/3 w-fit items-center justify-center object-contain"
          />
          <Button
            variant="outline"
            size="icon"
            className="-translate-x-1/2 absolute bottom-4 left-1/2 z-20 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            onClick={handleDownload}
          >
            <HugeiconsIcon icon={Download04Icon} />
          </Button>
        </div>
        <CanvasFooter prompt={selectedImage.prompt} />
      </div>
    </div>
  )
}
