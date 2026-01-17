import { zodMessages } from "@/utils/zod-messages"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@repo/auth/client"
import { config } from "@repo/config"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/base/alert-dialog"
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
} from "@repo/ui/base/dialog"
import { Form } from "@repo/ui/base/form"
import { toastManager } from "@repo/ui/base/toast"
import { NumberInputField } from "@repo/ui/fields/number-input-field"
import { SubmitButton } from "@repo/ui/fields/submit-button"
import { TextareaField } from "@repo/ui/fields/textarea-field"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useId } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const banFormSchema = z.object({
  duration: z
    .number()
    .min(config.auth.minBanDuration, zodMessages.duration.min)
    .max(config.auth.maxBanDuration, zodMessages.duration.max),
  reason: z.string(),
})

type Props = {
  userId: string
  userName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DashboardUsersTableBanDialog = ({
  userId,
  userName,
  open,
  onOpenChange,
}: Props) => {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const formId = useId()
  const form = useForm({
    resolver: zodResolver(banFormSchema),
    defaultValues: {
      duration: config.auth.defaultBanDuration,
      reason: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof banFormSchema>) => {
    await authClient.admin.banUser(
      {
        userId,
        banReason: values.reason,
        /**
         * banExpiresIn has to be in seconds (convert days to seconds)
         */
        banExpiresIn: values.duration * 24 * 60 * 60,
      },
      {
        onSuccess: async () => {
          onOpenChange(false)

          await queryClient.invalidateQueries({ queryKey: ["users-list"] })

          toastManager.add({
            title: t.rich("dashboard.users.ban.success", {
              name: () => <span className="font-semibold">{userName}</span>,
            }),
            type: "success",
          })
        },
        onError: (ctx) => {
          onOpenChange(false)

          console.error(ctx.error)

          toastManager.add({
            title: t("auth.errors.UNKNOWN"),
            type: "error",
          })
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <Form id={formId} form={form} className="contents">
          <DialogHeader>
            <DialogTitle>{t("dashboard.users.ban.title")}</DialogTitle>
            <DialogDescription>
              {t.rich("dashboard.users.ban.description", {
                name: () => (
                  <span className="font-semibold underline underline-offset-4">
                    {userName}
                  </span>
                ),
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="flex flex-col gap-6">
            <NumberInputField
              name="duration"
              control={form.control}
              label={t("global.durationDays")}
              description={t("dashboard.users.ban.durationDescription")}
              min={config.auth.minBanDuration}
              max={config.auth.maxBanDuration}
              required
            />
            <TextareaField
              name="reason"
              control={form.control}
              label={t("global.reason")}
              placeholder={t("dashboard.users.ban.reasonPlaceholder")}
              description={t("dashboard.users.ban.reasonDescription")}
            />
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("global.cancel")}
            </DialogClose>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>
                {t("dashboard.users.ban.submitButton")}
              </AlertDialogTrigger>
              <AlertDialogPopup>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("dashboard.users.ban.confirm.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.rich("dashboard.users.ban.confirm.description", {
                      name: () => (
                        <span className="font-semibold underline underline-offset-4">
                          {userName}
                        </span>
                      ),
                      duration: () => (
                        <span className="font-semibold">
                          {form.getValues("duration")} {t("global.days")}
                        </span>
                      ),
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogClose render={<Button variant="outline" />}>
                    {t("global.cancel")}
                  </AlertDialogClose>
                  <SubmitButton
                    form={formId}
                    variant="destructive"
                    submittingText={t("dashboard.users.ban.submitting")}
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    {t("dashboard.users.ban.confirm.submitButton")}
                  </SubmitButton>
                </AlertDialogFooter>
              </AlertDialogPopup>
            </AlertDialog>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
