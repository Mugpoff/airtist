import { TRPCError } from "@trpc/server"
import { env } from "../env"
import type { ImageModel } from "./image-models"

type OpenRouterResponse = {
  choices?: {
    message?: {
      images?: {
        image_url?: { url?: string }
        imageUrl?: { url?: string }
      }[]
    }
  }[]
  error?: { message?: string }
  usage?: {
    completion_tokens?: number
    prompt_tokens?: number
    total_tokens?: number
    cost?: number
    prompt_tokens_details?: { cached_tokens?: number }
    completion_tokens_details?: { reasoning_tokens?: number }
    cost_details?: { upstream_inference_cost?: number }
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const fetchWithTimeout = async (
  url: string,
  init: RequestInit,
  timeoutMs: number,
) => {
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: ac.signal })
  } finally {
    clearTimeout(t)
  }
}

export const callOpenRouterForImage = async (args: {
  model: ImageModel
  messages: unknown
  imageConfig?: { aspect_ratio?: string }
}) => {
  const url = "https://openrouter.ai/api/v1/chat/completions"
  const body = JSON.stringify({
    model: args.model,
    messages: args.messages,
    modalities: ["image", "text"],
    stream: false,
    usage: { include: true },
    ...(args.imageConfig ? { image_config: args.imageConfig } : {}),
  })

  const headers = {
    Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": env.OPENROUTER_HTTP_REFERER,
    "X-Title": env.OPENROUTER_APP_TITLE,
  }

  const timeoutMs = 30_000
  const retries = 2

  let lastError: unknown = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const upstream = await fetchWithTimeout(
        url,
        { method: "POST", headers, body },
        timeoutMs,
      )

      const json = (await upstream
        .json()
        .catch(() => null)) as OpenRouterResponse | null

      if (!upstream.ok) {
        const msg =
          typeof json?.error?.message === "string"
            ? json.error.message
            : "OpenRouter request failed"
        throw new TRPCError({ code: "BAD_GATEWAY", message: msg })
      }

      const img = json?.choices?.[0]?.message?.images?.[0]
      const imageUrl = img?.image_url?.url ?? img?.imageUrl?.url

      if (typeof imageUrl !== "string") {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: "No image in OpenRouter response",
        })
      }

      const idx = imageUrl.indexOf("base64,")
      if (idx === -1) {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: "Invalid image data URL",
        })
      }

      const b64 = imageUrl.slice(idx + "base64,".length)
      const bytes = Buffer.from(b64, "base64")

      return {
        bytes,
        requestId: upstream.headers.get("x-request-id"),
        usage: json?.usage ?? null,
      }
    } catch (err) {
      lastError = err

      if (err instanceof TRPCError) {
        throw err
      }

      if (attempt < retries) {
        await sleep(300 * 2 ** attempt)
      }
    }
  }

  throw new TRPCError({
    code: "BAD_GATEWAY",
    message: "OpenRouter unreachable",
    cause: lastError,
  })
}
