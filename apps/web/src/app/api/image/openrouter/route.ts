export const runtime = "nodejs"

export const POST = async (req: Request) => {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return new Response("OPENROUTER_API_KEY is missing", { status: 500 })
  }

  const body = await req.json().catch(() => null)

  if (!body || typeof body.prompt !== "string") {
    return new Response("Invalid body: expected { prompt: string }", {
      status: 400,
    })
  }

  const model =
    typeof body.model === "string"
      ? body.model
      : "google/gemini-2.5-flash-image-preview"

  const aspectRatio =
    typeof body.aspectRatio === "string" ? body.aspectRatio : undefined

  const payload = {
    model,
    messages: [{ role: "user", content: body.prompt }],
    modalities: ["image", "text"],
    stream: false,
    ...(aspectRatio ? { image_config: { aspect_ratio: aspectRatio } } : {}),
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.OPENROUTER_HTTP_REFERER ?? "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_TITLE ?? "ai-picture",
    },
    body: JSON.stringify(payload),
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return new Response(
      JSON.stringify(
        {
          status: res.status,
          statusText: res.statusText,
          json,
          text,
        },
        null,
        2,
      ),
      {
        status: 502,
        headers: { "content-type": "application/json" },
      },
    )
  }

  const img = json?.choices?.[0]?.message?.images?.[0]
  const imageUrl = img?.image_url?.url ?? img?.imageUrl?.url

  if (typeof imageUrl !== "string") {
    return new Response("No image in OpenRouter response", { status: 502 })
  }

  const prefix = "base64,"
  const idx = imageUrl.indexOf(prefix)

  if (idx === -1) {
    return new Response("Invalid image data URL", { status: 502 })
  }

  const b64 = imageUrl.slice(idx + prefix.length)
  const bytes = Buffer.from(b64, "base64")

  return new Response(bytes, {
    status: 200,
    headers: {
      "content-type": "image/png",
      "cache-control": "no-store",
    },
  })
}
