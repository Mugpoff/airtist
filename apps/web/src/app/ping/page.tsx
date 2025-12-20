import { Suspense } from "react"
import { Ping } from "@/components/ping"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

export default function PingPage() {
  prefetch(trpc.ping.queryOptions())

  return (
    <HydrateClient>
      <main className="p-16">
        <Suspense fallback={<p>Loading...</p>}>
          <Ping />
        </Suspense>
      </main>
    </HydrateClient>
  )
}
