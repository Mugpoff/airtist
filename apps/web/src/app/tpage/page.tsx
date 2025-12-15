"use client"

import { useEffect, useState } from "react"
import { trpc } from "@/trpc/client"

export default function TrpcTestPage() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    trpc.health
      .query()
      .then((res: string) => setResult(res))
      .catch((err: unknown) => setError(String(err)))
  }, [])

  return (
    <main>
      <h1>tRPC Test</h1>
      <p>{result ?? "loading..."}</p>
      {error && <p>{error}</p>}
    </main>
  )
}
