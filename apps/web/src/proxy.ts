import { auth } from "@repo/auth/server"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*"],
}
