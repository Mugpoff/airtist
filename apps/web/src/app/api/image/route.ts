import { db } from "@repo/db"

export const runtime = "nodejs"

export const GET = async () => {
  const items = await db.generatedImages.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      prompt: true,
      model: true,
      width: true,
      height: true,
      mimeType: true,
      imageUrl: true,
      objectKey: true,
    },
  })

  return Response.json({ ok: true, items })
}
