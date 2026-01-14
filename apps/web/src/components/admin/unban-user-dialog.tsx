"use client"

import { Button } from "@repo/ui/base/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/base/dialog"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useTRPC } from "@/trpc/react"

type Props = {
  user: { id: string; name: string; email: string } | null
  onClose: () => void
  onSuccess: () => void
}

export function UnbanUserDialog({ user, onClose, onSuccess }: Props) {
  const t = useTranslations("admin.users.unbanDialog")

  const trpc = useTRPC()
  const unbanMutation = useMutation(
    trpc.admin.unbanUser.mutationOptions({
      onSuccess: () => {
        onSuccess()
      },
    }),
  )

  const handleUnban = () => {
    if (!user) return

    unbanMutation.mutate({
      userId: user.id,
    })
  }

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description")}
            {user && (
              <span className="mt-2 block font-medium text-foreground">
                {user.name} ({user.email})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter variant="bare">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleUnban} disabled={unbanMutation.isPending}>
            {unbanMutation.isPending ? "..." : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
