import { selectedImageIndexAtom } from "@/atoms/canvas-atom"
import { useTRPC } from "@/trpc/react"
import { ScrollArea } from "@repo/ui/base/scroll-area"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { motion } from "motion/react"

export const CanvasSidebar = () => {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.images.list.queryOptions({}))
  const [selectedImageIndex, setSelectedImageIndex] = useAtom(
    selectedImageIndexAtom,
  )
  const selectedImage = data?.items[selectedImageIndex]

  if (isLoading || !selectedImage || !selectedImage.imageUrl) return

  return (
    <ScrollArea
      render={<aside className="w-80 [&>div]:space-y-2" />}
      className="space-y-4"
      scrollFade
    >
      {data.items.map((image, index) => (
        <button
          key={image.id}
          className="group relative flex w-full flex-col gap-1 rounded-lg px-6 py-2 text-start text-sm transition-colors hover:cursor-pointer hover:bg-muted data-selected:bg-muted"
          type="button"
          onClick={() => setSelectedImageIndex(index)}
          data-selected={selectedImageIndex === index || undefined}
        >
          {/* Selected bubble */}
          {selectedImageIndex === index && (
            <motion.span
              layoutId="sidebar-indicator"
              className="-translate-y-1/2 absolute top-1/2 left-2 h-3/5 w-2 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="text-start">
            {new Date(image.createdAt).toLocaleString()}
          </span>
          <span className="text-start text-muted-foreground text-xs">
            {image.id}
          </span>
        </button>
      ))}
    </ScrollArea>
  )
}
