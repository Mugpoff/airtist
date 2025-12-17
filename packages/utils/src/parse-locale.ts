import { config } from "@repo/config"
import { pick } from "accept-language-parser"
import { z } from "zod"

export const parseLocale = (cookie: string | null, header: string | null) => {
  const parsedHeaderLocale = pick(
    [...config.i18n.availableLocales],
    header ?? [],
    { loose: true },
  )

  return (
    [cookie, parsedHeaderLocale]
      .map((l) => z.enum(config.i18n.availableLocales).safeParse(l))
      .map((r) => (r.success ? r.data : null))
      .filter(Boolean)
      .at(0) ?? config.i18n.defaultLocale
  )
}
