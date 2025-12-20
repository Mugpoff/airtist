/**
 * THIS IS COMPLETELY TEMPORARY. IT WILL BE MOVED TO A tRPC HANDLER.
 */
import { db } from "@repo/db"

export const runtime = "nodejs"

export const GET = async (
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) => {
  const { id } = await ctx.params

  const row = await db.generatedImages.findUnique({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      prompt: true,
      model: true,
      requestId: true,
      aspectRatio: true,
      width: true,
      height: true,
      mimeType: true,
      imageUrl: true,
      objectKey: true,
      userId: true,
    },
  })

  if (!row) {
    return Response.json({ ok: false, error: "Not found" }, { status: 404 })
  }

  return Response.json({ ok: true, item: row })
}
