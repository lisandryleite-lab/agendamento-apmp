"use client"

import { useState } from "react"
import Link from "next/link"
import type { Materia } from "@/lib/questoes/types"
import { BancoClient } from "./banco-client"
import { SimuladoClient } from "./simulado-client"

type Aba = "banco" | "simulado"

export function MateriaClient({ materia }: { materia: Materia }) {
  const [aba, setAba] = useState<Aba>("banco")

  const abas: { id: Aba; rotulo: string }[] = [
    { id: "banco", rotulo: "Banco de Questões" },
    { id: "simulado", rotulo: "Simulado" },
  ]

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 64px" }}>
      <Link href="/questoes" style={{ fontSize: 12.5, color: "var(--azul-medio)", textDecoration: "none" }}>
        ← Todas as matérias
      </Link>

      <h1 style={{
        fontFamily: "var(--serif)", fontWeight: 600, fontSize: 24,
        color: "var(--azul-profundo)", margin: "10px 0 4px",
      }}>
        {materia.sigla} — Questões
      </h1>
      <p style={{ color: "var(--cinza-texto)", fontSize: 13, marginBottom: 20 }}>
        {materia.nome} · {materia.fonte}
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 22, flexWrap: "wrap" }}>
        {abas.map(a => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAba(a.id)}
            style={{
              padding: "9px 18px", borderRadius: 10, fontSize: 14, cursor: "pointer",
              border: `1.5px solid ${aba === a.id ? "var(--azul-profundo)" : "var(--cinza-borda)"}`,
              background: aba === a.id ? "var(--azul-profundo)" : "#fff",
              color: aba === a.id ? "#fff" : "var(--cinza-texto)",
              fontWeight: aba === a.id ? 600 : 400,
            }}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      {aba === "banco" ? <BancoClient materia={materia} /> : <SimuladoClient materia={materia} />}
    </div>
  )
}
