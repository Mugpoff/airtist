import { config } from "@repo/config"
import type { Metadata } from "next"
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

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">{props.children}</ThemeProvider>
      </body>
    </html>
  )
}
