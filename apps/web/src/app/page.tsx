"use client"

import { pageIndexAtom, pageIndexShadowAtom } from "@/atoms/canvas-atom"
import { Canvas } from "@/components/canvas/canvas"
import { GenerateContent } from "@/components/generate/generate-content"
import { PaginationDots } from "@/components/ui/pagination-dots"
import { useAtom } from "jotai"
import { useInView } from "motion/react"
import { useCallback, useEffect, useRef } from "react"

export default function HomePage() {
  const [pageIndex, setPageIndex] = useAtom(pageIndexAtom)
  const [pageIndexShadow, setPageIndexShadow] = useAtom(pageIndexShadowAtom)
  const containerRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const settingsInView = useInView(settingsRef, { amount: 0.7 })
  const canvasInView = useInView(canvasRef, { amount: 0.7 })

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= 2) return

      containerRef.current?.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      })

      setPageIndex(index)
      setPageIndexShadow(index)
    },
    [setPageIndex, setPageIndexShadow],
  )

  useEffect(() => {
    goToPage(pageIndex)
  }, [pageIndex, goToPage])

  useEffect(() => {
    if (settingsInView) {
      setPageIndexShadow(0)
    }

    if (canvasInView) {
      setPageIndexShadow(1)
    }
  }, [settingsInView, canvasInView, setPageIndexShadow])

  return (
    <main
      ref={containerRef}
      className="scrollbar-none hidden h-screen w-full overflow-y-auto md:block"
    >
      <section
        key="generate"
        ref={settingsRef}
        className="flex h-screen w-full items-center justify-center"
      >
        <GenerateContent />
      </section>
      <section
        key="canvas"
        ref={canvasRef}
        className="flex h-screen w-full items-center justify-center"
      >
        <Canvas />
      </section>
      <PaginationDots
        selectedIndex={pageIndexShadow}
        setSelectedIndex={goToPage}
      />
    </main>
  )
}
