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

  return Response.json({
    ok: true,
    requestId,
    model,
    aspectRatio: aspectRatio ?? null,
    imageUrl,
  })
}
