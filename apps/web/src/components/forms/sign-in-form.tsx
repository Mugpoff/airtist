"use client"

import { useAuth } from "@/stores/auth-store"
import { zodMessages } from "@/utils/zod-messages"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@repo/auth/client"
import { Form } from "@repo/ui/base/form"
import { toastManager } from "@repo/ui/base/toast"
import { EmailField } from "@repo/ui/fields/email-field"
import { PasswordField } from "@repo/ui/fields/password-field"
import { SubmitButton } from "@repo/ui/fields/submit-button"
import { Logo } from "@repo/ui/icons/Logo"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const signInSchema = z.object({
  email: z
    .email(zodMessages.email.invalid)
    .nonempty(zodMessages.email.required),
  password: z.string().nonempty(zodMessages.password.required),
})

export const SignInForm = () => {
  const { signIn } = useAuth()
  const t = useTranslations()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "john@example.com", password: "Password123!" },
    mode: "onTouched",
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    await authClient.signIn.email(
      { email: data.email, password: data.password },
      {
        onSuccess: (ctx) => {
          signIn(ctx.data.user)
          router.push("/")
        },
        onError: (ctx) => {
          if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
            toastManager.add({
              title: t("auth.errors.INVALID_EMAIL_OR_PASSWORD"),
              type: "error",
            })

            return
          }

          toastManager.add({
            title: t("auth.errors.UNKNOWN"),
            type: "error",
          })
        },
      },
    )
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <Logo className="size-10" />
        <h1 className="font-semibold text-2xl tracking-tight">
          {t("auth.signIn.title")}
        </h1>
      </div>

      <Form onSubmit={form.handleSubmit(onSubmit)} form={form}>
        <EmailField name="email" control={form.control} />
        <PasswordField name="password" control={form.control} />
        <SubmitButton
          className="w-full"
          submittingText={t("auth.signIn.submitting")}
          size="lg"
        >
          {t("auth.signIn.submitButton")}
        </SubmitButton>
      </Form>

      <p className="max-w-xs text-center text-muted-foreground text-xs">
        {t.rich("auth.signIn.privacy", {
          termsOfService: (chunks) => (
            <Link
              href="/"
              className="text-foreground underline underline-offset-4"
            >
              {chunks}
            </Link>
          ),
          privacyPolicy: (chunks) => (
            <Link
              href="/"
              className="text-foreground underline underline-offset-4"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  )
}
