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
import { TextareaField } from "@repo/ui/fields/textarea-field"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodMessages } from "@/utils/zod-messages"

const banFormSchema = z.object({
  duration: z
    .number()
    .min(config.auth.minBanDuration, zodMessages.duration.min)
    .max(config.auth.maxBanDuration, zodMessages.duration.max),
  reason: z.string(),
})

type BanFormValues = z.infer<typeof banFormSchema>

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
  const form = useForm<BanFormValues, unknown, BanFormValues>({
    resolver: zodResolver(banFormSchema),
    defaultValues: {
      duration: config.auth.defaultBanDuration,
      reason: "",
    },
  })
  const { mutate, isPending } = useMutation({
    mutationKey: ["users-ban", userId],
    mutationFn: (data: BanFormValues) =>
      authClient.admin.banUser({
        userId,
        banReason: data.reason,
        /**
         * banExpiresIn has to be in seconds
         */
        banExpiresIn: data.duration * 60 * 60,
      }),
    onSuccess: async (_, __, ___, ctx) => {
      await ctx.client.invalidateQueries({ queryKey: ["users-list"] })

      toastManager.add({
        title: t.rich("dashboard.users.ban.success", {
          name: () => <span className="font-semibold">{userName}</span>,
        }),
        type: "success",
      })

      onOpenChange(false)
      form.reset()
    },
    onError: (error) => {
      toastManager.add({
        title: t("dashboard.users.ban.error"),
        description: error.message,
        type: "error",
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
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
        <DialogPanel>
          <Form form={form}>
            <NumberInputField
              name="duration"
              control={form.control}
              label={t("global.durationHours")}
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
          </Form>
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
                        {form.getValues("duration")} {t("global.hours")}
                      </span>
                    ),
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="outline" />}>
                  {t("global.cancel")}
                </AlertDialogClose>
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => mutate(form.getValues())}
                >
                  {isPending
                    ? t("dashboard.users.ban.submitting")
                    : t("dashboard.users.ban.confirm.submitButton")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}
