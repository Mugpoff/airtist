import { z } from "zod"
import { protectedProcedure } from "../trpc"
import { createDriveClientForUser } from "../utils/google-drive-client"

export const driveListImagesHandler = protectedProcedure
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).default(30),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { drive } = await createDriveClientForUser(ctx.session.user.id)

    const res = await drive.files.list({
      pageSize: input.limit,
      q: "mimeType contains 'image/' and trashed = false",
      fields: "files(id,name,mimeType,modifiedTime,thumbnailLink,size)",
      orderBy: "modifiedTime desc",
      spaces: "drive",
    })

    const files = res.data.files ?? []

    return {
      items: files.map((f) => ({
        id: f.id ?? "",
        name: f.name ?? "",
        mimeType: f.mimeType ?? "",
        modifiedTime: f.modifiedTime ?? null,
        thumbnailLink: f.thumbnailLink ?? null,
        size: f.size ?? null,
      })),
    }
  })
