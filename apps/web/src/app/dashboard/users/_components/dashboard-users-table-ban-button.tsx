"use client"

import { LegalHammerIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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
import { MenuItem } from "@repo/ui/base/menu"
import { toastManager } from "@repo/ui/base/toast"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"

type Props = {
  userId: string
}

export const DashboardUsersTableBanButton = ({ userId }: Props) => {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const { mutate, isPending } = useMutation({
    mutationKey: ["users-ban", userId],
    mutationFn: () => authClient.admin.banUser({ userId }),
    onSuccess: async (_, __, ___, ctx) => {
      await ctx.client.invalidateQueries({ queryKey: ["users-list"] })

      toastManager.add({
        title: t("dashboard.users.ban.success"),
        type: "success",
      })
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
    <MenuItem
      variant="destructive"
      onClick={() => {
        console.log("clicked")
        setIsOpen(true)
      }}
    >
      <HugeiconsIcon icon={LegalHammerIcon} />
      {t("global.ban")}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.users.ban.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.users.ban.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="outline" />}>
              {t("global.cancel")}
            </AlertDialogClose>
            <Button
              variant="destructive"
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending
                ? t("dashboard.users.ban.submitting")
                : t("dashboard.users.ban.submitButton")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </MenuItem>
  )
}
