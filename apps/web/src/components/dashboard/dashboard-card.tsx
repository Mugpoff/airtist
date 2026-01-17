import { Separator } from "@repo/ui/base/separator"
import { FramedCard } from "@repo/ui/stylistic/framed-card"
import type { ReactNode } from "react"

type Props = {
  title: string
  description: string
  children: ReactNode
}

export const DashboardCard = ({ title, description, children }: Props) => {
  return (
    <FramedCard className="m-4 w-full items-center bg-background">
      <div className="flex size-full max-w-6xl flex-col p-8">
        <div>
          <h1 className="font-heading text-2xl">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
          <Separator className="mt-4 bg-linear-to-r bg-transparent from-10% from-muted-foreground to-80% to-transparent" />
        </div>
        <div className="mt-8 flex flex-col gap-4">{children}</div>
      </div>
    </FramedCard>
  )
}
