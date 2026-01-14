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
import { Input } from "@repo/ui/base/input"
import { Label } from "@repo/ui/base/label"
import { Textarea } from "@repo/ui/base/textarea"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useTRPC } from "@/trpc/react"

type Props = {
  user: { id: string; name: string; email: string } | null
  onClose: () => void
  onSuccess: () => void
}

export function BanUserDialog({ user, onClose, onSuccess }: Props) {
  const t = useTranslations("admin.users.banDialog")
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("")

  const trpc = useTRPC()
  const banMutation = useMutation(
    trpc.admin.banUser.mutationOptions({
      onSuccess: () => {
        setReason("")
        setDuration("")
        onSuccess()
      },
    }),
  )

  const handleBan = () => {
    if (!user) return

    banMutation.mutate({
      userId: user.id,
      banReason: reason || undefined,
      banExpiresInDays: duration ? Number.parseInt(duration, 10) : undefined,
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

        <div className="space-y-4 px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">{t("reason")}</Label>
            <Textarea
              id="reason"
              placeholder={t("reasonPlaceholder")}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">{t("duration")}</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              placeholder={t("durationPlaceholder")}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter variant="bare">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleBan}
            disabled={banMutation.isPending}
          >
            {banMutation.isPending ? "..." : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
