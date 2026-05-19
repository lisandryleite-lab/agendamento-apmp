"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const BASE = "/turma13cfo2026"

const NAV_ALUNO = [
  { href: `${BASE}/ranking`, label: "Ranking" },
  { href: `${BASE}/notas`, label: "Minhas Notas" },
  { href: `${BASE}/escalas`, label: "Escalas" },
  { href: `${BASE}/avisos`, label: "Avisos" },
  { href: `${BASE}/links`, label: "Links" },
]

const NAV_ADMIN = [
  { href: `${BASE}/ranking`, label: "Ranking" },
  { href: `${BASE}/admin/alunos`, label: "Alunos" },
  { href: `${BASE}/admin/notas`, label: "Notas" },
  { href: `${BASE}/admin/historico`, label: "Histórico" },
  { href: `${BASE}/admin/escalas`, label: "Escalas" },
  { href: `${BASE}/avisos`, label: "Avisos" },
  { href: `${BASE}/links`, label: "Links" },
]

export function AppNav({ isAdmin, nomeGuerra }: { isAdmin: boolean; nomeGuerra: string }) {
  const pathname = usePathname()
  const links = isAdmin ? NAV_ADMIN : NAV_ALUNO

  return (
    <nav className="bg-blue-900 text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-12 gap-1 overflow-x-auto">
          <span className="text-xs font-semibold text-blue-300 whitespace-nowrap mr-3">
            T13 CFO
          </span>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors",
                pathname.startsWith(l.href)
                  ? "bg-white text-blue-900 font-semibold"
                  : "hover:bg-blue-800 text-blue-100"
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-3 shrink-0">
            <span className="text-xs text-blue-300 hidden sm:block">{nomeGuerra}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs text-blue-300 hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
