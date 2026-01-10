import { cn } from "@repo/ui/utils"

type Props = {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}

export const PaginationDots = ({ selectedIndex, setSelectedIndex }: Props) => {
  return (
    <div className="-translate-y-1/2 fixed top-1/2 right-6 z-50 flex flex-col items-center gap-3">
      {[0, 1].map((index) => (
        <button
          key={index}
          type="button"
          onClick={() => setSelectedIndex(index)}
          className={cn(
            "size-2.5 rounded-full bg-muted-foreground/30 transition-all duration-300 ease-out hover:scale-110 hover:cursor-pointer hover:bg-muted-foreground/50 data-selected:h-6 data-selected:bg-primary",
          )}
          data-selected={selectedIndex === index || undefined}
          aria-label={`Go to page ${index + 1}`}
        />
      ))}
    </div>
  )
}
