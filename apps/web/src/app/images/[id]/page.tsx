import { Suspense } from "react"
import { ImageDetailView } from "@/components/generate/image-detail-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ImagePage({ params }: PageProps) {
  const { id } = await params

  void prefetch(trpc.images.byId.queryOptions({ id }))

  return (
    <HydrateClient>
      <Suspense fallback={<p className="p-8 text-center">Chargement...</p>}>
        <ImageDetailView id={id} />
      </Suspense>
    </HydrateClient>
  )
}
