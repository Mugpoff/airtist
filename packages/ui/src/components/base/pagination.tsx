import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import type * as React from "react"
import { cn } from "../../lib/utils"
import { type Button, buttonVariants } from "./button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      data-slot="pagination"
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      data-slot="pagination-content"
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationButtonProps = {
  isActive?: boolean
  size?: React.ComponentProps<typeof Button>["size"]
} & useRender.ComponentProps<"button">

function PaginationButton({
  className,
  isActive,
  size = "icon",
  render,
  ...props
}: PaginationButtonProps) {
  const defaultProps = {
    "aria-current": isActive ? ("page" as const) : undefined,
    className: render
      ? className
      : cn(
          buttonVariants({
            size,
            variant: isActive ? "outline" : "ghost",
          }),
          className,
        ),
    "data-active": isActive,
    "data-slot": "pagination-link",
  }

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  })
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  const t = useTranslations("global")

  return (
    <PaginationButton
      aria-label={t("goToPreviousPage")}
      className={cn("max-sm:aspect-square max-sm:p-0", className)}
      size="default"
      {...props}
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} className="sm:-ms-1" />
      <span className="max-sm:hidden">{t("previous")}</span>
    </PaginationButton>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  const t = useTranslations("global")

  return (
    <PaginationButton
      aria-label={t("goToNextPage")}
      className={cn("max-sm:aspect-square max-sm:p-0", className)}
      size="default"
      {...props}
    >
      <span className="max-sm:hidden">{t("next")}</span>
      <HugeiconsIcon icon={ArrowRight01Icon} className="sm:-me-1" />
    </PaginationButton>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex min-w-7 justify-center", className)}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} className="size-5 sm:size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
}
