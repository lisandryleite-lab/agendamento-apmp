import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CFO PM 2026 · Turma 13 · 1º Pelotão · 2ª CIA",
  description: "Portal da Turma 13 — APMP Paudalho/PE",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-50`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
