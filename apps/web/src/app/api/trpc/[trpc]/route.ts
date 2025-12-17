const isBuild =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE === "phase-production-build"

const run = async (req: Request) => {
  if (isBuild) {
    return new Response("tRPC disabled during build", { status: 503 })
  }

  const { handler } = await import("@/server/trpc")
  return handler(req)
}

export const GET = run
export const POST = run
