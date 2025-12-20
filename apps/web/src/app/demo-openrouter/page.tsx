"use client"

import { Button } from "@repo/ui/base/button"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

type ImageItem = {
  id: string
  createdAt: string
  prompt: string
  model: string
  requestId: string | null
  aspectRatio: string | null
  width: number
  height: number
  mimeType: string
  imageUrl: string | null
  objectKey: string | null
}

type GenerateResponse =
  | {
      ok: true
      requestId: string
      image: ImageItem
    }
  | {
      ok: false
      requestId?: string
      error: string
    }

type ListResponse =
  | {
      ok: true
      items: ImageItem[]
    }
  | {
      ok: false
      error: string
    }

type DetailResponse =
  | {
      ok: true
      item: ImageItem
    }
  | {
      ok: false
      error: string
    }

export default function DemoOpenRouterPage() {
  const [prompt, setPrompt] = useState(
    "A cute shiba inu astronaut, studio lighting, 4k",
  )
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [model, setModel] = useState("google/gemini-2.5-flash-image-preview")
  const [loading, setLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [items, setItems] = useState<ImageItem[]>([])
  const [current, setCurrent] = useState<ImageItem | null>(null)
  const [selected, setSelected] = useState<ImageItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  const payload = useMemo(
    () => ({
      prompt,
      aspectRatio,
      model,
    }),
    [prompt, aspectRatio, model],
  )

  const loadImages = async () => {
    setLoadingList(true)
    try {
      const res = await fetch("/api/image", { method: "GET" })
      const data = (await res.json().catch(() => null)) as ListResponse | null

      if (!res.ok || !data || !("ok" in data) || data.ok !== true) {
        const msg =
          data && "error" in data && typeof data.error === "string"
            ? data.error
            : "Failed to load images"
        setError(msg)
        return
      }

      setItems(data.items)
    } finally {
      setLoadingList(false)
    }
  }

  const loadDetail = async (id: string) => {
    setError(null)
    const res = await fetch(`/api/image/${id}`, { method: "GET" })
    const data = (await res.json().catch(() => null)) as DetailResponse | null

    if (!res.ok || !data || !("ok" in data) || data.ok !== true) {
      const msg =
        data && "error" in data && typeof data.error === "string"
          ? data.error
          : "Failed to load image"
      setError(msg)
      return
    }

    setSelected(data.item)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to load images on mount
  useEffect(() => {
    void loadImages()
  }, [])

  const onGenerate = async () => {
    setLoading(true)
    setError(null)
    setCurrent(null)

    try {
      const res = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await res
        .json()
        .catch(() => null)) as GenerateResponse | null

      if (!res.ok || !data || !("ok" in data) || data.ok !== true) {
        const msg =
          data && "error" in data && typeof data.error === "string"
            ? data.error
            : "Generation failed"
        setError(msg)
        return
      }

      setCurrent(data.image)
      await loadImages()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 8, maxWidth: 1000 }}>
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
                width: 520,
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

          <Button
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
          </Button>

          <Button
            onClick={() => void loadImages()}
            disabled={loadingList}
            style={{
              height: 42,
              alignSelf: "end",
              padding: "0 14px",
              borderRadius: 8,
              border: "1px solid #333",
              background: loadingList ? "#222" : "transparent",
              color: "inherit",
              cursor: loadingList ? "not-allowed" : "pointer",
            }}
          >
            {loadingList ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {error && (
          <pre
            style={{
              padding: 12,
              borderRadius: 8,
              border: "1px solid #333",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </pre>
        )}
      </div>

      <section
        style={{
          borderRadius: 12,
          border: "1px solid #333",
          padding: 12,
          minHeight: 320,
          display: "grid",
          placeItems: "center",
        }}
      >
        {current?.imageUrl ? (
          <Image
            src={current.imageUrl}
            alt="Generated"
            style={{ maxWidth: "100%", height: "auto", borderRadius: 12 }}
          />
        ) : (
          <span style={{ opacity: 0.7 }}>
            {loading ? "Waiting for image..." : "No image yet"}
          </span>
        )}
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>
            History ({items.length})
          </h2>
          {selected && (
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Selected: {selected.id}
            </div>
          )}
        </div>

        {selected && (
          <pre
            style={{
              padding: 12,
              borderRadius: 8,
              border: "1px solid #333",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(selected, null, 2)}
          </pre>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {items.map((it) => (
            <Button
              key={it.id}
              onClick={() => void loadDetail(it.id)}
              style={{
                textAlign: "left",
                border: "1px solid #333",
                borderRadius: 12,
                overflow: "hidden",
                padding: 0,
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              {it.imageUrl ? (
                <Image
                  src={it.imageUrl}
                  alt={it.prompt}
                  style={{ width: "100%", height: 220, objectFit: "cover" }}
                  width={220}
                  height={220}
                />
              ) : (
                <div
                  style={{
                    height: 220,
                    display: "grid",
                    placeItems: "center",
                    opacity: 0.7,
                  }}
                >
                  No URL
                </div>
              )}

              <div style={{ padding: 10, display: "grid", gap: 6 }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {new Date(it.createdAt).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{it.model}</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>{it.prompt}</div>
              </div>
            </Button>
          ))}
        </div>
      </section>
    </main>
  )
}
