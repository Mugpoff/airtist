import { zodResolver } from "@hookform/resolvers/zod"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { authClient } from "@repo/auth/client"
import { config } from "@repo/config"
import { Button } from "@repo/ui/base/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/base/dialog"
import { Form } from "@repo/ui/base/form"
import { toastManager } from "@repo/ui/base/toast"
import { EmailField } from "@repo/ui/fields/email-field"
import { InputField } from "@repo/ui/fields/input-field"
import { PasswordField } from "@repo/ui/fields/password-field"
import { SelectField } from "@repo/ui/fields/select-field"
import { SubmitButton } from "@repo/ui/fields/submit-button"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodMessages } from "@/utils/zod-messages"

const createUserSchema = z
  .object({
    name: z.string().nonempty(zodMessages.name.required),
    email: z.email(zodMessages.email.invalid),
    password: z
      .string()
      .min(config.auth.minPasswordLength, zodMessages.password.min),
    confirmPassword: z.string().nonempty(zodMessages.password.required),
    role: z.enum(Object.values(config.auth.roles)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: zodMessages.confirmPassword.invalid,
  })

export const DashboardUsersTableCreateButton = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const t = useTranslations()
  const form = useForm({
    resolver: zodResolver(createUserSchema),
    mode: "onTouched",
    defaultValues: {
      name: "John Doe",
      email: "john@doe.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      role: config.auth.roles.USER,
    },
  })

  const onSubmit = async (data: z.infer<typeof createUserSchema>) => {
    await authClient.admin.createUser(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["users-list"] })

        setOpen(false)

        toastManager.add({
          title: t("dashboard.users.create.success"),
          type: "success",
        })
      },
      onError: (ctx) => {
        setOpen(false)

        if (ctx.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
          toastManager.add({
            title: t("auth.errors.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"),
            type: "error",
          })

          return
        }

        console.error(ctx.error)

        toastManager.add({
          title: t("auth.errors.UNKNOWN"),
          type: "error",
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <HugeiconsIcon icon={Add01Icon} />
        {t("dashboard.users.create.title")}
      </DialogTrigger>
      <DialogPopup>
        <Form
          form={form}
          className="contents"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>{t("dashboard.users.create.title")}</DialogTitle>
            <DialogDescription>
              {t("dashboard.users.create.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="flex flex-col gap-6">
            <div className="flex w-full flex-row gap-6">
              <div className="w-2/3">
                <InputField
                  name="name"
                  control={form.control}
                  label={t("global.name")}
                  placeholder={t("validation.name.placeholder")}
                  required
                />
              </div>
              <div className="w-1/3">
                <SelectField
                  name="role"
                  control={form.control}
                  label={t("global.role")}
                  items={[
                    { label: t("global.user"), value: config.auth.roles.USER },
                    {
                      label: t("global.admin"),
                      value: config.auth.roles.ADMIN,
                    },
                  ]}
                  required
                />
              </div>
            </div>
            <EmailField
              name="email"
              control={form.control}
              label={t("global.email")}
              placeholder={t("validation.email.placeholder")}
              required
            />
            <PasswordField
              name="password"
              control={form.control}
              label={t("global.password")}
              placeholder={t("validation.password.placeholder")}
              required
            />
            <PasswordField
              name="confirmPassword"
              control={form.control}
              label={t("global.confirmPassword")}
              placeholder={t("validation.confirmPassword.placeholder")}
              required
            />
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("global.cancel")}
            </DialogClose>
            <SubmitButton
              submittingText={t("dashboard.users.create.submitting")}
            >
              {t("dashboard.users.create.submitButton")}
            </SubmitButton>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
