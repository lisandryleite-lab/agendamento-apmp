import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: "Turma 13 CFO 2026",
  description: "Portal da Turma 13 — APMP Paudalho/PE · 1º Pelotão · 2ª CIA",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full antialiased" style={{ fontFamily: "var(--sans)", background: "var(--creme)" }}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
