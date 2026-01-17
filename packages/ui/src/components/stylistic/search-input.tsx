import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import type { InputProps } from "../base/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../base/input-group"

export const SearchInput = (props: InputProps) => {
  const t = useTranslations("global")

  return (
    <InputGroup className="w-fit">
      <InputGroupAddon>
        <HugeiconsIcon icon={Search01Icon} />
      </InputGroupAddon>
      <InputGroupInput
        aria-label={t("search")}
        placeholder={t("search")}
        type="search"
        {...props}
      />
    </InputGroup>
  )
}
