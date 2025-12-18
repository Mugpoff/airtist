"use client"

import { authClient } from "@repo/auth/client"
import { Button } from "@repo/ui/base/button"
import { useTranslations } from "next-intl"
import { Canvas } from "@/components/canvas/canvas"
import { useAuth } from "@/stores/auth-store"

export default function HomePage() {
  const { user, signOut } = useAuth()
  const t = useTranslations()

  const handleSignOut = async () => {
    await authClient.signOut()
    signOut()
  }

  return (
    <main className="flex h-screen">
      <div className="h-full w-64">
        <h1>Hello from the client!</h1>
        <p>Translation:{t("validation.email.required")}</p>
        {user && (
          <Button onClick={handleSignOut} variant="outline" className="mt-4">
            Sign Out
          </Button>
        )}
      </div>
      <Canvas />
    </main>
  )
}
