"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@repo/ui/base/button"
import { Form } from "@repo/ui/base/form"
import { EmailField } from "@repo/ui/fields/email-field"
import { PasswordField } from "@repo/ui/fields/password-field"
import { Logo } from "@repo/ui/icons/Logo"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export const SignInForm = () => {
  const t = useTranslations()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log("Sign in:", data)
    // TODO: Implement sign in logic
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <Logo className="size-10" />
        <h1 className="font-semibold text-2xl tracking-tight">
          {t("auth.signIn.title")}
        </h1>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <EmailField name="email" control={control} />
        <PasswordField name="password" control={control} />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("auth.signIn.submitting")
            : t("auth.signIn.submitButton")}
        </Button>
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
