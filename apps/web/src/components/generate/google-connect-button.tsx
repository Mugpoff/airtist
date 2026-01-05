"use client"

import { Button } from "@repo/ui/base/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/react"

export function GoogleConnectButton() {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.drive.connectUrl.queryOptions({ callbackPath: "/demo-openrouter" }),
  )

  return (
    <Button
      type="button"
      onClick={() => {
        window.location.assign(data.url)
      }}
    >
      Connecter Google Drive
    </Button>
  )
}
