"use client"

import { authClient } from "@repo/auth/client"
import { Button } from "@repo/ui/base/button"

export function GoogleConnectButton() {
  return (
    <Button
      type="button"
      onClick={async () => {
        await authClient.linkSocial({
          provider: "google",
          scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        })
      }}
    >
      Connecter Google Drive
    </Button>
  )
}
