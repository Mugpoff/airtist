import { CanvasContent } from "./canvas-content"
import { CanvasFooter } from "./canvas-footer"

export const Canvas = () => {
  return (
    <div className="after:-inset-[5px] after:-z-1 relative m-6 flex min-w-0 flex-1 flex-col rounded-2xl border bg-muted/50 bg-clip-padding shadow-black/5 shadow-sm after:pointer-events-none after:absolute after:rounded-[calc(var(--radius-2xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72">
      <CanvasContent />
      <CanvasFooter />
    </div>
  )
}
