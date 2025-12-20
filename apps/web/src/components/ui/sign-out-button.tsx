import { LogoutSquare01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { authClient } from "@repo/auth/client"
import { Button } from "@repo/ui/base/button"
import { useRouter } from "next/navigation"

export const SignOutButton = () => {
  const router = useRouter()

  const handleClick = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  return (
    <Button variant="ghost" onClick={handleClick} size="icon">
      <HugeiconsIcon icon={LogoutSquare01Icon} />
    </Button>
  )
}
