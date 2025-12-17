import { AuthStoreProvider } from "@/stores/auth-store"
import { getSession } from "@/utils/get-session"
import { config } from "@repo/config"
import { AnchoredToastProvider, ToastProvider } from "@repo/ui/base/toast"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: config.general.name,
    template: `%s - ${config.general.name}`,
  },
  description: config.general.description,
  keywords: config.metadata.keywords,
  authors: [{ name: config.metadata.author }],
  metadataBase: new URL(config.general.url),
  openGraph: {
    type: "website",
    siteName: config.general.name,
    title: config.general.name,
    description: config.general.description,
  },
  twitter: {
    card: "summary_large_image",
    title: config.general.name,
    description: config.general.description,
  },
  appleWebApp: {
    title: config.general.name,
  },
}

export default async function RootLayout(props: { children: ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const session = await getSession()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          <NextIntlClientProvider messages={messages}>
            <ToastProvider>
              <AnchoredToastProvider>
                <AuthStoreProvider session={session}>
                  {props.children}
                </AuthStoreProvider>
              </AnchoredToastProvider>
            </ToastProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
