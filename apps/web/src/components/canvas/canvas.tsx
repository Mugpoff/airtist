import { Download04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { RippleEffect } from "@repo/ui/backgrounds/ripple-effect"
import { Button } from "@repo/ui/base/button"
import { Separator } from "@repo/ui/base/separator"
import { FramedCard, FramedCardContent } from "@repo/ui/stylistic/framed-card"
import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import Image from "next/image"
import { selectedImageIndexAtom } from "@/atoms/canvas-atom"
import { useTRPC } from "@/trpc/react"
import { toCdnUrl } from "@/utils/to-cdn-url"
import { CanvasEmpty } from "./canvas-empty"
import { CanvasFooter } from "./canvas-footer"
import { CanvasLoading } from "./canvas-loading"
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

  if (isLoading) return <CanvasLoading />
  if (!selectedImage || !selectedImage.imageUrl) return <CanvasEmpty />

  return (
    <div className="flex size-full max-w-6xl justify-center p-16">
      <CanvasSidebar />
      <Separator orientation="vertical" className="mr-8 ml-4" />
      <FramedCard>
        <FramedCardContent className="h-auto shrink grow basis-auto justify-end">
          <div className="-m-8 mask-l-from-70% mask-b-from-20% mask-intersect relative size-full">
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
        </FramedCardContent>
        <CanvasFooter prompt={selectedImage.prompt} />
      </FramedCard>
    </div>
  )
}
