export type TrpcContext = {
  userId: string | null
}

export const createTrpcContext = (opts?: { userId?: string | null }) => {
  return {
    userId: opts?.userId ?? null,
  } satisfies TrpcContext
}
