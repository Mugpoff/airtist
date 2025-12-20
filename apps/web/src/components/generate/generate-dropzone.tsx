import { ImageUploadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

const ACCEPTED_FILE_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "application/zip": [".zip"],
}

export const GenerateDropzone = () => {
  const t = useTranslations("home.sidebar.dropzone")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // TODO: Handle file upload
    console.log(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
  })

  return (
    <div
      {...getRootProps()}
      className="after:-inset-[5px] after:-z-1 relative flex max-h-1/2 min-w-0 flex-1 flex-col rounded-2xl border bg-muted/50 bg-clip-padding shadow-black/5 shadow-sm transition after:pointer-events-none after:absolute after:rounded-[calc(var(--radius-2xl)+4px)] after:border after:border-border/50 after:bg-clip-padding data-drag-active:bg-muted dark:after:bg-background/72"
      data-drag-active={isDragActive || undefined}
    >
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
    </div>
  )
}
