import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@repo/ui/base/frame"
import { Separator } from "@repo/ui/base/separator"
import { getTranslations } from "next-intl/server"

export default async function DashboardPage() {
  const t = await getTranslations("dashboard")

  return (
    <div className="flex w-full max-w-6xl flex-col gap-4 p-12 pt-0">
      <div className="py-4">
        <h1 className="font-heading text-2xl">{t("title")}</h1>
        <Separator className="mt-4 bg-linear-to-r bg-transparent from-10% from-muted-foreground to-80% to-transparent" />
      </div>
      <div className="">
        <p>{t("description")}</p>
        <Frame className="w-full">
          <FrameHeader>
            <FrameTitle>Section header</FrameTitle>
            <FrameDescription>
              Brief description about the section
            </FrameDescription>
          </FrameHeader>
          <FramePanel>
            <h2 className="font-semibold text-sm">Section title</h2>
            <p className="text-muted-foreground text-sm">Section description</p>
          </FramePanel>
          <FrameFooter>
            <p className="text-muted-foreground text-sm">Footer</p>
          </FrameFooter>
        </Frame>
      </div>
    </div>
  )
}
