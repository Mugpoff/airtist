import { Delete02Icon, ImageUploadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { config } from "@repo/config"
import { Button } from "@repo/ui/base/button"
import { ScrollArea } from "@repo/ui/base/scroll-area"
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js"
import { fileTypeFromBlob } from "file-type"
import { useAtom } from "jotai"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"
import { settingsAtom } from "@/atoms/settings-atom"

export const GenerateDropzone = () => {
  const t = useTranslations("home.dropzone")
  const [settings, setSettings] = useAtom(settingsAtom)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const images = acceptedFiles.filter((f) => f.type.startsWith("image/"))
      const zips = acceptedFiles.filter((f) => f.type === "application/zip")
      const newFiles: File[] = images

      for (const zip of zips) {
        const zipReader = new ZipReader(new BlobReader(zip))
        const entries = await zipReader.getEntries()

        for (const entry of entries) {
          if (entry.directory || entry.filename.startsWith("__MACOSX")) {
            continue
          }

          const writer = new BlobWriter()
          const blob = await entry.getData(writer)
          const fileType = await fileTypeFromBlob(blob)

          if (
            !fileType ||
            !config.generationSettings.acceptedImages.has(fileType.mime)
          ) {
            console.warn(
              `Detected unsupported file type: "${entry.filename}" in zip file "${zip.name}"`,
            )

            continue
          }

          newFiles.push(
            new File([blob], entry.filename.replaceAll(" ", "_"), {
              type: fileType.mime,
            }),
          )
        }

        await zipReader.close()
      }

      setSettings((prev) => ({
        ...prev,
        files: newFiles,
      }))
    },
    accept: config.generationSettings.acceptedFiles,
    disabled: settings.files.length > 0,
  })

  return (
    <div
      {...getRootProps()}
      className="after:-inset-[5px] after:-z-1 relative flex max-h-1/2 min-w-0 flex-1 flex-col rounded-2xl border bg-muted/50 bg-clip-padding shadow-black/5 shadow-sm transition after:pointer-events-none after:absolute after:rounded-[calc(var(--radius-2xl)+4px)] after:border after:border-border/50 after:bg-clip-padding not-data-has-files:hover:cursor-pointer not-data-has-files:hover:bg-muted not-data-has-files:data-drag-active:bg-muted dark:after:bg-background/72"
      data-has-files={settings.files.length > 0 || undefined}
      data-drag-active={isDragActive || undefined}
    >
      {settings.files.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <input {...getInputProps()} />
          <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
            <HugeiconsIcon icon={ImageUploadIcon} />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="font-semibold text-foreground">{t("title")}</h3>{" "}
            <p className="text-muted-foreground text-sm">{t("description")}</p>
            <p className="text-muted-foreground/70 text-xs">{t("accepts")}</p>
          </div>
        </div>
      )}
      {settings.files.length > 0 && (
        <div
          className="h-full p-4 pr-0 data-[files-count=4]:pr-4"
          data-files-count={settings.files.length}
        >
          <ScrollArea scrollFade scrollbarGutter>
            <div className="w-full columns-4 gap-4">
              {settings.files.map((file, index) => (
                <div
                  className="group relative mb-4 break-inside-avoid"
                  key={file.name}
                >
                  <Image
                    src={URL.createObjectURL(file)}
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
                      setSettings((prev) => ({
                        ...prev,
                        files: prev.files.filter((_, i) => i !== index),
                      }))
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
      )}
    </div>
  )
}
