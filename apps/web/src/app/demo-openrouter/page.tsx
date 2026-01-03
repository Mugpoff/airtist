import { Suspense } from "react"
import { GenerateView } from "@/components/generate/generate-view"
import { GoogleConnectButton } from "@/components/generate/google-connect-button"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { getSession } from "@/utils/get-session"

export default async function DemoOpenRouterPage() {
  const session = await getSession()

  if (session?.user) {
    prefetch(trpc.images.list.queryOptions({ limit: 50, offset: 0 }))
    prefetch(trpc.drive.listItems.queryOptions({ view: "RECENT", limit: 30 }))
  }

  prefetch(trpc.images.models.queryOptions())

  return (
    <HydrateClient>
      <div className="h-dvh overflow-y-auto">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-end">
            <GoogleConnectButton />
          </div>
          <Suspense fallback={<p className="p-4 text-center">Chargement...</p>}>
            <GenerateView isAuthed={Boolean(session?.user)} />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  )
}
