"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/react"

export const Ping = () => {
  const trpc = useTRPC()
  const { data: ping } = useSuspenseQuery(trpc.ping.queryOptions())

  return <p>{ping}</p>
}
