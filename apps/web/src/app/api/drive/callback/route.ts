import { cacheClient } from "@repo/cache"
import { db } from "@repo/db"
import { NextResponse } from "next/server"

const tokenUrl = "https://oauth2.googleapis.com/token"
const userinfoUrl = "https://openidconnect.googleapis.com/v1/userinfo"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const redirectTo = url.searchParams.get("redirect_to")

  if (!code || !state) {
    return NextResponse.redirect(new URL("/demo-openrouter", url.origin))
  }

  const userId = await cacheClient.drive.oauthState.get(state)
  if (!userId) {
    return NextResponse.redirect(new URL("/demo-openrouter", url.origin))
  }

  await cacheClient.drive.oauthState.delete(state)

  const redirectUri = `${process.env.BETTER_AUTH_URL}/api/drive/callback`

  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/demo-openrouter", url.origin))
  }

  const tokenJson = (await tokenRes.json()) as {
    access_token: string
    refresh_token?: string
    expires_in?: number
    scope?: string
    token_type?: string
    id_token?: string
  }

  const accessToken = tokenJson.access_token
  const refreshToken = tokenJson.refresh_token ?? null
  const scope = tokenJson.scope ?? null
  const expiresAt =
    tokenJson.expires_in != null
      ? new Date(Date.now() + tokenJson.expires_in * 1000)
      : null

  const userInfoRes = await fetch(userinfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!userInfoRes.ok) {
    return NextResponse.redirect(new URL("/demo-openrouter", url.origin))
  }

  const userInfo = (await userInfoRes.json()) as {
    sub: string
    email?: string
  }

  await db.driveConnections.create({
    data: {
      userId,
      googleAccountId: userInfo.sub,
      email: userInfo.email ?? null,
      accessToken,
      refreshToken,
      scope,
      expiresAt,
    },
  })

  const dest = redirectTo
    ? new URL(redirectTo)
    : new URL("/demo-openrouter", url.origin)

  return NextResponse.redirect(dest)
}
