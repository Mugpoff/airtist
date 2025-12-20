"use client"

import { CanvasContent } from "@/components/canvas/canvas-content"
import { GenerateContent } from "@/components/generate/generate-content"
import { PaginationDots } from "@/components/ui/pagination-dots"
import { motion, useAnimation } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

const PAGES = [
  { key: "generate", Component: GenerateContent },
  { key: "canvas", Component: CanvasContent },
] as const
const SCROLL_THRESHOLD = 50 // Accumulated delta required to trigger page change
const SCROLL_COOLDOWN = 1000 // Cooldown in ms after page change

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0)
  const controls = useAnimation()
  const accumulatedDelta = useRef(0)
  const isAnimating = useRef(false)
  const lastScrollTime = useRef(0)

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= PAGES.length || isAnimating.current) return

      isAnimating.current = true
      setCurrentPage(index)
      controls
        .start({
          y: `-${index * 100}vh`,
          transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
        })
        .then(() => {
          isAnimating.current = false
          accumulatedDelta.current = 0
        })
    },
    [controls],
  )

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const now = Date.now()
      if (now - lastScrollTime.current < SCROLL_COOLDOWN || isAnimating.current)
        return

      // Accumulate scroll delta
      accumulatedDelta.current += e.deltaY

      // Check if threshold is reached
      if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
        const direction = accumulatedDelta.current > 0 ? 1 : -1
        const nextPage = currentPage + direction

        if (nextPage >= 0 && nextPage < PAGES.length) {
          lastScrollTime.current = now
          goToPage(nextPage)
        }
        accumulatedDelta.current = 0
      }
    }

    // Reset accumulated delta after inactivity
    const resetDelta = () => {
      accumulatedDelta.current = 0
    }

    let resetTimeout: NodeJS.Timeout
    const handleWheelWithReset = (e: WheelEvent) => {
      handleWheel(e)
      clearTimeout(resetTimeout)
      resetTimeout = setTimeout(resetDelta, 150)
    }

    window.addEventListener("wheel", handleWheelWithReset, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheelWithReset)
      clearTimeout(resetTimeout)
    }
  }, [currentPage, goToPage])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault()
        goToPage(currentPage + 1)
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        goToPage(currentPage - 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, goToPage])

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <motion.div
        animate={controls}
        initial={{ y: 0 }}
        className="flex h-full flex-col"
      >
        {PAGES.map(({ key, Component }) => (
          <div
            key={key}
            className="flex h-screen w-full max-w-6xl shrink-0 items-center justify-center p-16"
          >
            <Component />
          </div>
        ))}
      </motion.div>

      <PaginationDots selectedIndex={currentPage} setSelectedIndex={goToPage} />
    </main>
  )
}
