import { CopyButton } from "@repo/ui/buttons/copy-button"
import { Marquee } from "@repo/ui/stylistic/marquee"
import { VerticalFade } from "@repo/ui/stylistic/vertical-fade"

type Props = {
  prompt: string
}

export const CanvasFooter = ({ prompt }: Props) => {
  return (
    <div className="group relative shrink grow-0 basis-20 overflow-hidden rounded-b-2xl px-8 py-2">
      <VerticalFade>
        <Marquee
          vertical
          pauseOnHover
          repeat={2}
          className="p-0 font-mono text-muted-foreground text-sm"
        >
          {prompt}
        </Marquee>
      </VerticalFade>
      <CopyButton
        className="absolute top-2 right-2 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        text={prompt}
      />
    </div>
  )
}
