"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const links = [
  { href: "/dashboard",    label: "Início" },
  { href: "/ranking",      label: "Ranking" },
  { href: "/qts",          label: "QTS" },
  { href: "/aulas",        label: "Aulas" },
  { href: "/missao",       label: "Missão" },
  { href: "/escalas",      label: "Escalas" },
  { href: "/xerifancia",   label: "Xerifância" },
  { href: "/turma",        label: "Turma" },
  { href: "/aniversarios", label: "Aniversários" },
  { href: "/avisos",       label: "Avisos" },
  { href: "/links",        label: "Links" },
]

export function Nav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()

  return (
    <nav style={{
      background: "linear-gradient(135deg, var(--azul-profundo) 0%, #0F3D78 100%)",
      boxShadow: "0 2px 12px rgba(11,45,94,0.25)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 2, height: 56, overflowX: "auto" }}>
        {/* Marca */}
        <Link href="/" style={{
          fontFamily: "var(--serif)",
          fontWeight: 600,
          fontSize: 15,
          color: "var(--dourado-claro)",
          whiteSpace: "nowrap",
          marginRight: 16,
          letterSpacing: "0.04em",
          textDecoration: "none",
          flexShrink: 0,
        }}>
          CFO 2026 · T13
        </Link>

        {/* Links */}
        {links.map((l) => {
          const ativo = pathname === l.href
          return (
            <Link key={l.href} href={l.href} style={{
              padding: "5px 11px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: ativo ? 600 : 400,
              whiteSpace: "nowrap",
              textDecoration: "none",
              transition: "background 0.15s",
              background: ativo ? "var(--dourado)" : "transparent",
              color: ativo ? "#fff" : "rgba(255,255,255,0.80)",
              flexShrink: 0,
            }}>
              {l.label}
            </Link>
          )
        })}

        {isAdmin && (
          <Link href="/admin" style={{
            padding: "5px 11px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: pathname.startsWith("/admin") ? 600 : 400,
            whiteSpace: "nowrap",
            textDecoration: "none",
            marginLeft: 6,
            border: "1px solid var(--dourado)",
            background: pathname.startsWith("/admin") ? "var(--dourado)" : "transparent",
            color: pathname.startsWith("/admin") ? "#fff" : "var(--dourado-claro)",
            flexShrink: 0,
            transition: "background 0.15s",
          }}>
            Admin
          </Link>
        )}

        <button onClick={() => signOut({ callbackUrl: "/" })} style={{
          marginLeft: "auto",
          padding: "5px 11px",
          borderRadius: 6,
          fontSize: 13,
          background: "transparent",
          color: "rgba(255,255,255,0.50)",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          Sair
        </button>
      </div>
    </nav>
  )
}
