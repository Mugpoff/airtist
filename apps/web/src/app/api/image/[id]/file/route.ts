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
      imageUrl: true,
    },
  })

  if (!row || !row.imageUrl) {
    return new Response("Not found", { status: 404 })
  }

  return Response.redirect(row.imageUrl, 302)
}
