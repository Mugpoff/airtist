import { Suspense } from "react"
import { GenerateView } from "@/components/generate/generate-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

export default function DemoOpenRouterPage() {
  prefetch(trpc.images.list.queryOptions())

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <p className="p-4 text-center">Chargement de la galerie...</p>
        }
      >
        <GenerateView />
      </Suspense>
    </HydrateClient>
  )
}
