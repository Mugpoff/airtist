import { db } from "@repo/db"
import { uploadPng } from "@/server/minio"

export const runtime = "nodejs"

type Body = {
  prompt?: unknown
  model?: unknown
  aspectRatio?: unknown
}

const sizeFromAspectRatio = (aspectRatio?: string) => {
  switch (aspectRatio) {
    case "2:3":
      return { width: 832, height: 1248 }
    case "3:2":
      return { width: 1248, height: 832 }
    case "3:4":
      return { width: 864, height: 1184 }
    case "4:3":
      return { width: 1184, height: 864 }
    case "4:5":
      return { width: 896, height: 1152 }
    case "5:4":
      return { width: 1152, height: 896 }
    case "9:16":
      return { width: 768, height: 1344 }
    case "16:9":
      return { width: 1344, height: 768 }
    case "21:9":
      return { width: 1536, height: 672 }
    default:
      return { width: 1024, height: 1024 }
  }
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
  const size = sizeFromAspectRatio(aspectRatio)

  const row = await db.generatedImages.create({
    data: {
      prompt,
      model,
      requestId: requestId || null,
      aspectRatio: aspectRatio ?? null,
      width: size.width,
      height: size.height,
      mimeType: "image/png",
      imageUrl: publicUrl,
      objectKey,
    },
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
    },
  })

  return Response.json({ ok: true, requestId, image: row })
}
