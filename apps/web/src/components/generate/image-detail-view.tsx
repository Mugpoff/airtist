"use client"

import type { AppRouter } from "@repo/trpc"
import { Button } from "@repo/ui/base/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/base/card"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { inferRouterOutputs } from "@trpc/server"
import Image from "next/image"
import Link from "next/link"
import { useTRPC } from "@/trpc/react"

type ImageOutput = inferRouterOutputs<AppRouter>["images"]["byId"]

const toCdnUrl = (url: string) => {
  const marker = "/images/"
  const idx = url.indexOf(marker)

  if (idx === -1) {
    return url
  }

  return `/cdn${url.slice(idx)}`
}

export function ImageDetailView({ id }: { id: string }) {
  const trpc = useTRPC()
  const { data: image } = useSuspenseQuery(
    trpc.images.byId.queryOptions({ id }),
  )

  if (!image.imageUrl) {
    return <div>Image non disponible</div>
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        href="/"
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:underline"
      >
        ← Retour à la galerie
      </Link>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Détail de l'image</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-md border bg-muted">
            <Image
              src={toCdnUrl(image.imageUrl)}
              alt={image.prompt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="mb-1 font-medium text-sm text-muted-foreground">
                Prompt
              </h3>
              <p className="text-sm">{image.prompt}</p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-sm text-muted-foreground">
                Modèle
              </h3>
              <p className="text-sm">{image.model}</p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-sm text-muted-foreground">
                Format
              </h3>
              <p className="text-sm">
                {image.width} x {image.height}
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-sm text-muted-foreground">
                Date de création
              </h3>
              <p className="text-sm">
                {new Date(image.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
