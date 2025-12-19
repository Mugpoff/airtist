"use client"

import { useEffect, useMemo, useState } from "react"

type Result = {
  ok: boolean
  status: number
  error?: string
  requestId?: string
  model?: string
  aspectRatio?: string | null
  imageUrl?: string
}

export default function DemoOpenRouterPage() {
  const [prompt, setPrompt] = useState(
    "A cute shiba inu astronaut, studio lighting, 4k",
  )
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [model, setModel] = useState("google/gemini-2.5-flash-image-preview")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  const payload = useMemo(
    () => ({
      prompt,
      aspectRatio,
      model,
    }),
    [prompt, aspectRatio, model],
  )

  useEffect(() => {
    return () => {
      if (imgSrc) URL.revokeObjectURL(imgSrc)
    }
  }, [imgSrc])

  const onGenerate = async () => {
    setLoading(true)
    setResult(null)
    setImgSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })

    try {
      const metaRes = await fetch("/api/image/openrouter/json", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })

      const metaText = await metaRes.text()
      const meta = (() => {
        try {
          return JSON.parse(metaText) as Result
        } catch {
          return {
            ok: false,
            status: metaRes.status,
            error: metaText || "Failed to read metadata",
          } as Result
        }
      })()

      if (!metaRes.ok || !meta.ok) {
        setResult({
          ok: false,
          status: metaRes.status,
          error: meta.error ?? "Request failed",
          requestId: meta.requestId,
        })
        return
      }

      const imgRes = await fetch("/api/image/openrouter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!imgRes.ok) {
        const text = await imgRes.text()
        setResult({
          ok: false,
          status: imgRes.status,
          error: text || "Image request failed",
          requestId: meta.requestId,
        })
        return
      }

      const blob = await imgRes.blob()
      const url = URL.createObjectURL(blob)

      setImgSrc(url)
      setResult({
        ok: true,
        status: imgRes.status,
        requestId: meta.requestId,
        model: meta.model,
        aspectRatio: meta.aspectRatio ?? null,
        imageUrl: meta.imageUrl,
      })
    } catch (e) {
      setResult({
        ok: false,
        status: 0,
        error: e instanceof Error ? e.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>OpenRouter Demo</h1>

      <div style={{ display: "grid", gap: 8, maxWidth: 900 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #333",
              background: "transparent",
              color: "inherit",
            }}
          />
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Model</span>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                width: 420,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #333",
                background: "transparent",
                color: "inherit",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Aspect ratio</span>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              style={{
                width: 160,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #333",
                background: "transparent",
                color: "inherit",
              }}
            >
              <option value="1:1">1:1</option>
              <option value="2:3">2:3</option>
              <option value="3:2">3:2</option>
              <option value="3:4">3:4</option>
              <option value="4:3">4:3</option>
              <option value="4:5">4:5</option>
              <option value="5:4">5:4</option>
              <option value="9:16">9:16</option>
              <option value="16:9">16:9</option>
              <option value="21:9">21:9</option>
            </select>
          </label>

          <button
            onClick={onGenerate}
            disabled={loading}
            style={{
              height: 42,
              alignSelf: "end",
              padding: "0 14px",
              borderRadius: 8,
              border: "1px solid #333",
              background: loading ? "#222" : "transparent",
              color: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {result && (
          <pre
            style={{
              padding: 12,
              borderRadius: 8,
              border: "1px solid #333",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      <div
        style={{
          borderRadius: 12,
          border: "1px solid #333",
          padding: 12,
          minHeight: 300,
          display: "grid",
          placeItems: "center",
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="Generated"
            style={{ maxWidth: "100%", height: "auto", borderRadius: 12 }}
          />
        ) : (
          <span style={{ opacity: 0.7 }}>
            {loading ? "Waiting for image..." : "No image yet"}
          </span>
        )}
      </div>
    </main>
  )
}
