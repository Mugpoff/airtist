"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useTRPC } from "@/trpc/react"
import { toCdnUrl } from "@/utils/to-cdn-url"

export function DriveThumb({ fileId, name }: { fileId: string; name: string }) {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.drive.getThumbUrl.queryOptions({ fileId }),
  )

  if (!data.url) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground text-xs">
        ...
      </div>
    )
  }

  return (
    <Image
      src={toCdnUrl(data.url)}
      alt={name}
      width={256}
      height={256}
      className="aspect-square w-full rounded-md object-cover"
      sizes="25vw"
    />
  )
}
