/**
 * THIS IS COMPLETELY TEMPORARY. IT WILL BE MOVED TO A tRPC HANDLER.
 */
export const runtime = "nodejs"

type Body = {
  prompt?: unknown
  model?: unknown
  aspectRatio?: unknown
}

export const POST = async (req: Request) => {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return new Response("OPENROUTER_API_KEY is missing", { status: 500 })
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
    return new Response("Invalid body: prompt is required", { status: 400 })
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

  if (!upstream.ok) {
    const json = await upstream.json().catch(() => null)
    const msg =
      typeof json?.error?.message === "string"
        ? json.error.message
        : "OpenRouter request failed"

    return new Response(msg, {
      status: 502,
      headers: requestId ? { "x-request-id": requestId } : undefined,
    })
  }

  const json = await upstream.json().catch(() => null)
  const img = json?.choices?.[0]?.message?.images?.[0]
  const imageUrl = img?.image_url?.url ?? img?.imageUrl?.url

  if (typeof imageUrl !== "string") {
    return new Response("No image in OpenRouter response", {
      status: 502,
      headers: requestId ? { "x-request-id": requestId } : undefined,
    })
  }

  const prefix = "base64,"
  const idx = imageUrl.indexOf(prefix)

  if (idx === -1) {
    return new Response("Invalid image data URL", {
      status: 502,
      headers: requestId ? { "x-request-id": requestId } : undefined,
    })
  }

  const b64 = imageUrl.slice(idx + prefix.length)
  const bytes = Buffer.from(b64, "base64")

  return new Response(bytes, {
    status: 200,
    headers: {
      "content-type": "image/png",
      "cache-control": "no-store",
      ...(requestId ? { "x-request-id": requestId } : {}),
    },
  })
}
