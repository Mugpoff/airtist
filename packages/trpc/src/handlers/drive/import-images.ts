import { createHash } from "node:crypto"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../../trpc"
import {
  createDriveClientForConnection,
  getDefaultDriveConnection,
} from "../../utils/drive-client"
import { sanitizeFileName, uploadImage } from "../../utils/storage-client"

const sha256Hex = (buf: Buffer) =>
  createHash("sha256").update(buf).digest("hex")

export const driveImportImagesHandler = protectedProcedure
  .input(
    z.object({
      fileIds: z.array(z.string().min(1)).min(1).max(20),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const conn = await getDefaultDriveConnection(ctx.session.user.id)
    const { drive } = await createDriveClientForConnection(conn.id)

    const metas = await Promise.all(
      input.fileIds.map(async (fileId) => {
        const meta = await drive.files.get({
          fileId,
          fields: "id,name,mimeType",
        })

        const id = meta.data.id
        const name = meta.data.name
        const mimeType = meta.data.mimeType

        if (!id || !name || !mimeType) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Fichier Drive invalide",
          })
        }

        if (!mimeType.startsWith("image/")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Type non supporté: ${mimeType}`,
          })
        }

        return { id, name, mimeType }
      }),
    )

    const items = await Promise.all(
      metas.map(async (m) => {
        const res = await drive.files.get(
          { fileId: m.id, alt: "media" },
          { responseType: "arraybuffer" },
        )

        const buf = Buffer.from(res.data as ArrayBuffer)
        const digest = sha256Hex(buf)
        const objectKey = `uploads/drive/${crypto.randomUUID()}-${sanitizeFileName(m.name)}`
        const url = await uploadImage(objectKey, buf, m.mimeType)

        return {
          url,
          digest,
          mimeType: m.mimeType,
          name: m.name,
        }
      }),
    )

    return { items }
  })
