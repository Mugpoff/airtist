import { Suspense } from "react"
import { GenerateView } from "@/components/generate/generate-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { getSession } from "@/utils/get-session"

export default async function DemoOpenRouterPage() {
  const session = await getSession()

  if (session?.user) {
    prefetch(trpc.images.list.queryOptions({ limit: 50, offset: 0 }))
  }

  prefetch(trpc.images.models.queryOptions())

  return (
    <HydrateClient>
      <Suspense fallback={<p className="p-4 text-center">Chargement...</p>}>
        <GenerateView />
      </Suspense>
    </HydrateClient>
  )
}
