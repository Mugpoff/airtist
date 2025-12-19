import { db } from "@repo/db"
import { uploadPng } from "@/server/minio"

export const runtime = "nodejs"

type Body = {
  prompt?: unknown
  model?: unknown
  aspectRatio?: unknown
}

export const POST = async (req: Request) => {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return Response.json(
      { ok: false, error: "OPENROUTER_API_KEY is missing" },
      { status: 500 },
    )
  }

  const body = (await req.json().catch(() => null)) as Body | null
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : ""
  const model =
    typeof body?.model === "string" && body.model.trim().length > 0
      ? body.model.trim()
      : "google/gemini-2.5-flash-image-preview"
  const aspectRatio =
    typeof body?.aspectRatio === "string" && body.aspectRatio.trim().length > 0
      ? body.aspectRatio.trim()
      : undefined

  if (!prompt) {
    return Response.json(
      { ok: false, error: "Invalid body: prompt is required" },
      { status: 400 },
    )
  }

  const payload = {
    model,
    messages: [{ role: "user", content: prompt }],
    modalities: ["image", "text"],
    stream: false,
    ...(aspectRatio ? { image_config: { aspect_ratio: aspectRatio } } : {}),
  }

  const upstream = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.OPENROUTER_HTTP_REFERER ?? "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_APP_TITLE ?? "ai-picture",
      },
      body: JSON.stringify(payload),
    },
  )

  const requestId = upstream.headers.get("x-request-id") ?? ""
  const json = await upstream.json().catch(() => null)

  if (!upstream.ok) {
    const msg =
      typeof json?.error?.message === "string"
        ? json.error.message
        : "OpenRouter request failed"
    return Response.json({ ok: false, error: msg, requestId }, { status: 502 })
  }

  const img = json?.choices?.[0]?.message?.images?.[0]
  const imageUrl = img?.image_url?.url ?? img?.imageUrl?.url

  if (typeof imageUrl !== "string") {
    return Response.json(
      { ok: false, error: "No image in OpenRouter response", requestId },
      { status: 502 },
    )
  }

  const prefix = "base64,"
  const idx = imageUrl.indexOf(prefix)

  if (idx === -1) {
    return Response.json(
      { ok: false, error: "Invalid image data URL", requestId },
      { status: 502 },
    )
  }

  const b64 = imageUrl.slice(idx + prefix.length)
  const bytes = Buffer.from(b64, "base64")

  const objectKey = `images/${crypto.randomUUID()}.png`
  const publicUrl = await uploadPng(objectKey, bytes)

  const row = await db.generatedImages.create({
    data: {
      prompt,
      model,
      width: 1024,
      height: 1024,
      mimeType: "image/png",
      imageUrl: publicUrl,
      objectKey,
    },
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

  return Response.json({ ok: true, requestId, image: row })
}
