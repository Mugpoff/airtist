/**
 * THIS IS COMPLETELY TEMPORARY. IT WILL BE MOVED TO A tRPC HANDLER.
 */
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
    stream: true,
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

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "")
    return new Response(text || "OpenRouter upstream failed", {
      status: 502,
    })
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store",
      connection: "keep-alive",
    },
  })
}
