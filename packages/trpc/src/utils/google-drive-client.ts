import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { google } from "googleapis"

const getGoogleAccount = async (userId: string) => {
  const account = await db.accounts.findFirst({
    where: {
      userId,
      providerId: "google",
    },
  })

  if (!account?.accessToken) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Google non connecté",
    })
  }

  return account
}

export const createDriveClientForUser = async (userId: string) => {
  const account = await getGoogleAccount(userId)

  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirectUri: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
  })

  auth.setCredentials({
    access_token: account.accessToken ?? undefined,
    refresh_token: account.refreshToken ?? undefined,
  })

  const drive = google.drive({ version: "v3", auth })
  return { drive, account }
}
