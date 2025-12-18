import { Canvas } from "@/components/canvas/canvas"
import { Sidebar } from "@/components/sidebar/sidebar"

export default function HomePage() {
  return (
    <main className="flex h-screen gap-6">
      <Sidebar />
      <Canvas />
    </main>
  )
}
