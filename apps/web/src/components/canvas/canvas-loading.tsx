import { Spinner } from "@repo/ui/base/spinner"

export const CanvasLoading = () => {
  return (
    <div className="flex size-full items-center justify-center">
      <Spinner className="size-12" />
    </div>
  )
}
