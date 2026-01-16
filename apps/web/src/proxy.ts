import { auth } from "@repo/auth/server"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")

  // Signed in users trying to access auth pages → redirect to home
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Non-logged in users trying to access protected pages → redirect to sign-in
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  // Non-admin users trying to access dashboard pages → redirect to home
  if (
    session?.user.role !== "admin" &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/demo-openrouter", "/auth/:path*", "/dashboard/:path*"],
}
