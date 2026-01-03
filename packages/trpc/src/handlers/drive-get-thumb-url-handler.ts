import { createHash } from "node:crypto"
import { cacheClient } from "@repo/cache"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../trpc"
import { createDriveClientForUser } from "../utils/google-drive-client"
import { uploadImage } from "../utils/storage-client"

const sha256Hex = (buf: Buffer) =>
  createHash("sha256").update(buf).digest("hex")

export const driveGetThumbUrlHandler = protectedProcedure
  .input(
    z.object({
      fileId: z.string().min(1),
    }),
  )
  .query(async ({ input, ctx }) => {
    const cacheKey = `drive:thumb:v2:${input.fileId}`
    const cached = await cacheClient.drive.thumbUrlByFileId
      .get(cacheKey)
      .catch(() => null)

    if (typeof cached === "string" && cached) {
      return { url: cached }
    }

    const { drive, account } = await createDriveClientForUser(
      ctx.session.user.id,
    )

    const meta = await drive.files.get({
      fileId: input.fileId,
      fields: "id,name,mimeType,thumbnailLink",
    })

    const id = meta.data.id
    const mimeType = meta.data.mimeType
    const thumbnailLink = meta.data.thumbnailLink

    if (!id || !mimeType?.startsWith("image/")) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Fichier invalide" })
    }

    if (!thumbnailLink) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Thumbnail indisponible",
      })
    }

    const res = await fetch(thumbnailLink, {
      headers: {
        Authorization: `Bearer ${account.accessToken ?? ""}`,
      },
    })

    if (!res.ok) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Impossible de récupérer le thumbnail",
      })
    }

    const arr = await res.arrayBuffer()
    const buf = Buffer.from(arr)
    const digest = sha256Hex(buf)

    const objectKey = `images/thumbs/drive/${id}-${digest}.jpg`
    const url = await uploadImage(objectKey, buf, "image/jpeg")

    await cacheClient.drive.thumbUrlByFileId
      .set(cacheKey, url, 60 * 60 * 24 * 7)
      .catch(() => null)

    return { url }
  })
