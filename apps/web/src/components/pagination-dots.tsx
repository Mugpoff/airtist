import { motion } from "framer-motion"

type Props = {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}

export const PaginationDots = ({ selectedIndex, setSelectedIndex }: Props) => {
  return (
    <div className="-translate-y-1/2 fixed top-1/2 right-6 z-50 flex flex-col items-center gap-3">
      {[0, 1].map((index) => (
        <motion.button
          key={index}
          type="button"
          onClick={() => setSelectedIndex(index)}
          className="rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50"
          animate={{
            height: selectedIndex === index ? 24 : 10,
            width: 10,
            backgroundColor:
              selectedIndex === index
                ? "var(--color-primary)"
                : "color-mix(in srgb, var(--muted-foreground) 30%, transparent)",
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 20,
            mass: 1,
          }}
          initial={false}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Go to page ${index + 1}`}
        />
      ))}
    </div>
  )
}
