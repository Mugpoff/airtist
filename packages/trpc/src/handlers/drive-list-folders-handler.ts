import { z } from "zod"
import { protectedProcedure } from "../trpc"
import {
  createDriveClientForConnection,
  getDefaultDriveConnection,
} from "../utils/google-drive-client"

export const driveListFoldersHandler = protectedProcedure
  .input(
    z.object({
      parentId: z.string().min(1).optional(),
      view: z.enum(["ROOT"]).default("ROOT"),
      limit: z.number().int().min(1).max(200).default(100),
    }),
  )
  .query(async ({ input, ctx }) => {
    const conn = await getDefaultDriveConnection(ctx.session.user.id)
    const { drive } = await createDriveClientForConnection(conn.id)

    const parent = input.parentId ?? "root"

    const res = await drive.files.list({
      pageSize: input.limit,
      q: `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id,name,modifiedTime)",
      orderBy: "name",
      spaces: "drive",
    })

    const files = res.data.files ?? []

    return {
      items: files.map((f) => ({
        id: f.id ?? "",
        name: f.name ?? "",
        modifiedTime: f.modifiedTime ?? null,
      })),
    }
  })
