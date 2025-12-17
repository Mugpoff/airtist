"use client"

import { useAuth } from "@/stores/auth-store"
import { useTranslations } from "next-intl"

export default function HomePage() {
  const { user } = useAuth()
  const t = useTranslations()

  return (
    <main>
      <h1>Hello from the client!</h1>
      <p>Translation:{t("validation.email.required")}</p>
      <p>User: {JSON.stringify(user)}</p>
    </main>
  )
}
