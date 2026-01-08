import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@repo/ui/base/button"
import { ScrollArea } from "@repo/ui/base/scroll-area"
import Image from "next/image"
import { useMemo } from "react"

type Props = {
  files: File[]
  deleteFile: (index: number) => void
}

export const GenerateDropzoneMasonry = ({ files, deleteFile }: Props) => {
  const fileUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  )

  return (
    <div
      className="h-full p-4 pr-0 data-[files-count=4]:pr-4"
      data-files-count={files.length}
    >
      <ScrollArea scrollFade scrollbarGutter>
        <div className="w-full columns-4 gap-4">
          {files.map((file, index) => (
            <div
              className="group relative mb-4 break-inside-avoid"
              key={file.name}
            >
              <Image
                src={fileUrls[index] ?? ""}
                className="h-auto w-full rounded-lg transition-transform duration-300 group-hover:scale-97"
                alt={file.name}
                width={0}
                height={0}
                sizes="25vw"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteFile(index)
                }}
                className="absolute right-2 bottom-2 size-8 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
