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

export const DashboardUsersTableDeleteDialog = ({
  userId,
  userName,
  open,
  onOpenChange,
}: Props) => {
  const t = useTranslations()
  const { mutate, isPending } = useMutation({
    mutationKey: ["users-delete", userId],
    mutationFn: () => authClient.admin.removeUser({ userId }),
    onSuccess: async (_, __, ___, ctx) => {
      await ctx.client.invalidateQueries({ queryKey: ["users-list"] })

      toastManager.add({
        title: t.rich("dashboard.users.delete.success", {
          name: () => <span className="font-semibold">{userName}</span>,
        }),
        type: "success",
      })

      onOpenChange(false)
    },
    onError: (error) => {
      console.error(error)

      toastManager.add({
        title: t("auth.errors.UNKNOWN"),
        type: "error",
      })
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("dashboard.users.delete.confirm.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t.rich("dashboard.users.delete.confirm.description", {
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
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending
              ? t("dashboard.users.delete.submitting")
              : t("dashboard.users.delete.confirm.submitButton")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
