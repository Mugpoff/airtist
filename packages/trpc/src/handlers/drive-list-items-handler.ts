import { z } from "zod"
import { protectedProcedure } from "../trpc"
import {
  createDriveClientForConnection,
  getDefaultDriveConnection,
} from "../utils/google-drive-client"

export const driveListItemsHandler = protectedProcedure
  .input(
    z.object({
      view: z.enum(["ROOT", "RECENT", "SHARED"]).default("ROOT"),
      parentId: z.string().min(1).optional(),
      limit: z.number().int().min(1).max(100).default(30),
      pageToken: z.string().min(1).optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const conn = await getDefaultDriveConnection(ctx.session.user.id)
    const { drive } = await createDriveClientForConnection(conn.id)

    const q =
      input.view === "RECENT"
        ? "mimeType contains 'image/' and trashed = false"
        : input.view === "SHARED"
          ? "mimeType contains 'image/' and sharedWithMe and trashed = false"
          : `'${input.parentId ?? "root"}' in parents and mimeType contains 'image/' and trashed = false`

    const res = await drive.files.list({
      pageSize: input.limit,
      pageToken: input.pageToken,
      q,
      fields:
        "nextPageToken,files(id,name,mimeType,modifiedTime,size,iconLink,thumbnailLink)",
      orderBy: input.view === "ROOT" ? "name" : "modifiedTime desc",
      spaces: "drive",
    })

    const files = res.data.files ?? []

    return {
      items: files.map((f) => ({
        id: f.id ?? "",
        name: f.name ?? "",
        mimeType: f.mimeType ?? "",
        modifiedTime: f.modifiedTime ?? null,
        size: f.size ?? null,
        iconLink: f.iconLink ?? null,
      })),
      nextPageToken: res.data.nextPageToken ?? null,
    }
  })
