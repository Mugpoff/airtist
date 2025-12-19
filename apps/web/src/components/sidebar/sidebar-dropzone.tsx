"use client"

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

export const SidebarDropzone = () => {
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
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-primary/50 hover:bg-accent/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
        <HugeiconsIcon icon={ImageUploadIcon} />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="font-semibold text-foreground">{t("title")}</h3>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
        <p className="text-muted-foreground/70 text-xs">{t("accepts")}</p>
      </div>
    </div>
  )
}
