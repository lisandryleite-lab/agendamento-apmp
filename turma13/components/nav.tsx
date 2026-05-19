"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Início" },
  { href: "/qts", label: "QTS" },
  { href: "/aulas", label: "Aulas" },
  { href: "/missao", label: "Missão" },
  { href: "/escalas", label: "Escalas" },
  { href: "/xerifancia", label: "Xerifância" },
  { href: "/turma", label: "Turma" },
  { href: "/aniversarios", label: "Aniversários" },
  { href: "/avisos", label: "Avisos" },
]

export function Nav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 h-14 overflow-x-auto">
        <Link href="/" className="font-bold text-yellow-400 whitespace-nowrap mr-4 text-sm">
          CFO 2026 · T13
        </Link>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors",
              pathname === l.href ? "bg-yellow-500 text-black font-semibold" : "hover:bg-slate-700"
            )}
          >
            {l.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors ml-2 border border-yellow-500",
              pathname.startsWith("/admin") ? "bg-yellow-500 text-black font-semibold" : "hover:bg-slate-700 text-yellow-400"
            )}
          >
            Admin
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="ml-auto px-3 py-1.5 rounded text-sm whitespace-nowrap hover:bg-slate-700 text-slate-400"
        >
          Sair
        </button>
      </div>
    </nav>
  )
}
