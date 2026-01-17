import { authClient } from "@repo/auth/client"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@repo/ui/base/alert-dialog"
import { Button } from "@repo/ui/base/button"
import { toastManager } from "@repo/ui/base/toast"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

type Props = {
  userId: string
  userName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DashboardUsersTableUnbanDialog = ({
  userId,
  userName,
  open,
  onOpenChange,
}: Props) => {
  const t = useTranslations()

  const { mutate, isPending } = useMutation({
    mutationKey: ["users-unban", userId],
    mutationFn: () => authClient.admin.unbanUser({ userId }),
    onSuccess: async (_, __, ___, ctx) => {
      await ctx.client.invalidateQueries({ queryKey: ["users-list"] })

      toastManager.add({
        title: t.rich("dashboard.users.unban.success", {
          name: () => <span className="font-semibold">{userName}</span>,
        }),
        type: "success",
      })

      onOpenChange(false)
    },
    onError: (error) => {
      toastManager.add({
        title: t("dashboard.users.unban.error"),
        description: error.message,
        type: "error",
      })
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("dashboard.users.unban.confirm.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t.rich("dashboard.users.unban.confirm.description", {
              name: () => (
                <span className="font-semibold underline underline-offset-4">
                  {userName}
                </span>
              ),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline" />}>
            {t("global.cancel")}
          </AlertDialogClose>
          <Button disabled={isPending} onClick={() => mutate()}>
            {isPending
              ? t("dashboard.users.unban.submitting")
              : t("dashboard.users.unban.confirm.submitButton")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
