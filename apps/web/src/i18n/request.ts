import { config } from "@repo/config"
import { parseLocale } from "@repo/utils/parse-locale"
import { cookies, headers } from "next/headers"
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => {
  const cookie = (await cookies()).get(config.i18n.cookie.name)?.value || null
  const header = (await headers()).get("Accept-Language")
  const locale = parseLocale(cookie, header)

  return {
    locale,
    messages: (await import(`../../../../packages/messages/src/${locale}.json`))
      .default,
  }
})
