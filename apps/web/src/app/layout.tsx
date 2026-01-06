import { AuthStoreProvider } from "@/stores/auth-store"
import { TRPCReactProvider } from "@/trpc/react"
import { getSession } from "@/utils/get-session"
import { config } from "@repo/config"
import { AnchoredToastProvider, ToastProvider } from "@repo/ui/base/toast"
import { cn } from "@repo/ui/utils"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})
const calSans = localFont({
  src: "../../public/fonts/CalSans-Regular.ttf",
  variable: "--font-cal-sans",
})

export default async function RootLayout(props: { children: ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const session = await getSession()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "overflow-hidden bg-sidebar font-sans text-foreground antialiased",
          inter.variable,
          calSans.variable,
        )}
      >
        <ThemeProvider attribute="class">
          <NextIntlClientProvider messages={messages}>
            <ToastProvider>
              <AnchoredToastProvider>
                <AuthStoreProvider session={session}>
                  <TRPCReactProvider>{props.children}</TRPCReactProvider>
                </AuthStoreProvider>
              </AnchoredToastProvider>
            </ToastProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
