"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Canvas } from "@/components/canvas/canvas"
import { GenerateContent } from "@/components/generate/generate-content"
import { PaginationDots } from "@/components/ui/pagination-dots"

const SCROLL_THRESHOLD = 100
const SCROLL_COOLDOWN = 1400

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const accumulatedDelta = useRef(0)
  const isScrolling = useRef(false)
  const lastScrollTime = useRef(0)

  const goToPage = useCallback((index: number) => {
    if (index < 0 || index >= 2 || isScrolling.current) return

    isScrolling.current = true
    setCurrentPage(index)

    containerRef.current?.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    })

    setTimeout(() => {
      isScrolling.current = false
      accumulatedDelta.current = 0
    }, SCROLL_COOLDOWN)
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const target = e.target instanceof Element ? e.target : null
      const isInScrollArea = target?.closest(
        '[data-slot="scroll-area-viewport"][data-has-overflow-y]',
      )

      if (isInScrollArea) {
        return
      }

      // Block all wheel events in other cases
      e.preventDefault()

      const now = Date.now()
      if (now - lastScrollTime.current < SCROLL_COOLDOWN || isScrolling.current)
        return

      accumulatedDelta.current += e.deltaY

      if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
        const direction = accumulatedDelta.current > 0 ? 1 : -1
        const nextPage = currentPage + direction

        if (nextPage >= 0 && nextPage < 2) {
          lastScrollTime.current = now
          goToPage(nextPage)
        }
        accumulatedDelta.current = 0
      }
    },
    [currentPage, goToPage],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault()
        goToPage(currentPage + 1)
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        goToPage(currentPage - 1)
      }
    },
    [currentPage, goToPage],
  )

  useEffect(() => {
    let resetTimeout: ReturnType<typeof setTimeout>

    const handleWheelWithReset = (e: WheelEvent) => {
      handleWheel(e)
      clearTimeout(resetTimeout)
      resetTimeout = setTimeout(() => {
        accumulatedDelta.current = 0
      }, 150)
    }

    window.addEventListener("wheel", handleWheelWithReset, {
      passive: false,
    })

    return () => {
      window.removeEventListener("wheel", handleWheelWithReset)
      clearTimeout(resetTimeout)
    }
  }, [handleWheel])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <main
      ref={containerRef}
      className="scrollbar-none h-screen w-full overflow-y-auto"
    >
      <section
        key="generate"
        className="flex h-screen w-full items-center justify-center"
      >
        <GenerateContent />
      </section>
      <section
        key="canvas"
        className="flex h-screen w-full items-center justify-center"
      >
        <Canvas />
      </section>
      <PaginationDots selectedIndex={currentPage} setSelectedIndex={goToPage} />
    </main>
  )
}
