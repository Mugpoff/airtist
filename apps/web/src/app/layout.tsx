import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

import "./globals.css"

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">{props.children}</ThemeProvider>
      </body>
    </html>
  )
}
