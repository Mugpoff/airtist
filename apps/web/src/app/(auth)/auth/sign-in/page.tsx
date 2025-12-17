import { config } from "@repo/config"
import type { Metadata } from "next"
import { SignInForm } from "@/components/forms/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to your ${config.general.name} account`,
}

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <SignInForm />
    </main>
  )
}
