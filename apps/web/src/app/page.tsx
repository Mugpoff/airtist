"use client"

import { useAuth } from "@/stores/auth-store"
import { authClient } from "@repo/auth/client"
import { Button } from "@repo/ui/base/button"
import { useTranslations } from "next-intl"

export default function HomePage() {
  const { user, signOut } = useAuth()
  const t = useTranslations()

  const handleSignOut = async () => {
    await authClient.signOut()
    signOut()
  }

  return (
    <main className="p-8">
      <h1>Hello from the client!</h1>
      <p>Translation:{t("validation.email.required")}</p>
      <p>User: {JSON.stringify(user)}</p>
      {user && (
        <Button onClick={handleSignOut} variant="outline" className="mt-4">
          Sign Out
        </Button>
      )}
    </main>
  )
}
