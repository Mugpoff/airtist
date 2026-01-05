import { cacheClient } from "@repo/cache"
import { z } from "zod"
import { protectedProcedure } from "../trpc"

export const driveConnectUrlHandler = protectedProcedure
  .input(
    z.object({
      callbackPath: z.string().min(1).default("/demo-openrouter"),
    }),
  )
  .query(async ({ input, ctx }) => {
    const baseUrl = process.env.BETTER_AUTH_URL as string
    const state = crypto.randomUUID()
    await cacheClient.drive.oauthState.set(state, ctx.session.user.id, 60 * 10)

    const redirectUri = new URL("/api/drive/callback", baseUrl).toString()

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID as string)
    url.searchParams.set("redirect_uri", redirectUri)
    url.searchParams.set("response_type", "code")
    url.searchParams.set(
      "scope",
      [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/drive.readonly",
      ].join(" "),
    )
    url.searchParams.set("access_type", "offline")
    url.searchParams.set("prompt", "consent select_account")
    url.searchParams.set("state", state)
    url.searchParams.set("include_granted_scopes", "true")

    const cb = new URL(input.callbackPath, baseUrl).toString()
    url.searchParams.set("redirect_to", cb)

    console.log("[drive] oauth redirect_uri", redirectUri)
    console.log("[drive] oauth url", url.toString())

    return { url: url.toString() }
  })
