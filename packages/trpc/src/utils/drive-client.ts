import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { google } from "googleapis"

export const getDefaultDriveConnection = async (userId: string) => {
  const conn = await db.driveConnections.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  if (!conn?.accessToken) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Google Drive non connecté",
    })
  }

  return conn
}

export const createDriveClientForConnection = async (connectionId: string) => {
  const conn = await db.driveConnections.findUnique({
    where: { id: connectionId },
  })

  if (!conn?.accessToken) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Connexion Google Drive introuvable",
    })
  }

  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirectUri: new URL(
      "/api/drive/callback",
      process.env.BETTER_AUTH_URL as string,
    ).toString(),
  })

  auth.setCredentials({
    access_token: conn.accessToken,
    refresh_token: conn.refreshToken ?? undefined,
  })

  const drive = google.drive({ version: "v3", auth })
  return { drive, conn }
}
