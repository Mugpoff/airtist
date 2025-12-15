"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@repo/ui/components/button"
import { EmailField } from "@repo/ui/fields/email-field"
import { PasswordField } from "@repo/ui/fields/password-field"
import { Package } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"

const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  const onSubmit = async (data: SignInFormData) => {
    console.log("Sign in:", data)
    // TODO: Implement sign in logic
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <Package className="size-8" strokeWidth={1.5} />
        <h1 className="font-semibold text-2xl tracking-tight">
          Welcome to AI Picture
        </h1>
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-foreground underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <EmailField name="email" control={control} />
        <PasswordField name="password" control={control} />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>

      {/* Footer */}
      <p className="max-w-xs text-center text-muted-foreground text-xs">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="text-foreground underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-foreground underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
