import Image from "next/image"

export const CanvasContent = () => {
  return (
    <div className="-m-px h-auto shrink grow basis-auto rounded-t-2xl border bg-background p-8 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] max-lg:before:hidden dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
      <div className="flex h-full w-full items-center justify-center">
        <Image
          src="/asset-1.png"
          alt="Canvas"
          width={1024}
          height={1024}
          className="max-h-[calc(100vh-186px)] object-contain"
        />
      </div>
    </div>
  )
}
