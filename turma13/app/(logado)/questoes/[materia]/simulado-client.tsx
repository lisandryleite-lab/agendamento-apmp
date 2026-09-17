"use client"

import { useEffect, useState } from "react"
import type { Materia } from "@/lib/questoes/types"
import {
  BotaoAcao, QuestaoDiscursivaView, QuestaoMCView, QuestaoVFView,
} from "../components"

type EstadoCronometro = "parado" | "rodando" | "pausado" | "esgotado"

function formata(seg: number) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function pontos(n: number) {
  return n.toFixed(2).replace(".", ",")
}

export function SimuladoClient({ materia }: { materia: Materia }) {
  const sim = materia.simulado
  const totalSeg = sim.duracaoMin * 60

  const [vf, setVf] = useState<Record<string, boolean>>({})
  const [mc, setMc] = useState<Record<string, number>>({})
  const [textos, setTextos] = useState<Record<string, string>>({})
  const [fatores, setFatores] = useState<Record<string, number>>({})
  const [corrigido, setCorrigido] = useState(false)
  const [restante, setRestante] = useState(totalSeg)
  const [cronometro, setCronometro] = useState<EstadoCronometro>("parado")

  useEffect(() => {
    if (cronometro !== "rodando") return
    const id = setInterval(() => {
      setRestante(prev => {
        if (prev <= 1) {
          setCronometro("esgotado")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [cronometro])

  const pontosPorAssertiva = sim.pontosPorGrupoVF / (sim.gruposVF[0]?.itens.length || 1)

  let nota = 0
  sim.gruposVF.forEach((g, k) =>
    g.itens.forEach((q, i) => {
      if (vf[`g${k}v${i}`] === q.v) nota += pontosPorAssertiva
    })
  )
  sim.mc.forEach((q, i) => {
    if (mc[`m${i}`] === q.a) nota += sim.pontosPorMC
  })
  let pendentes = 0
  sim.discursivas.forEach((q, i) => {
    const f = fatores[`d${i}`]
    if (f === undefined) pendentes++
    else nota += (q.valor ?? 0) * f
  })

  function limpar() {
    setVf({}); setMc({}); setTextos({}); setFatores({})
    setCorrigido(false)
    setRestante(totalSeg)
    setCronometro("parado")
  }

  function verificar() {
    setCorrigido(true)
    if (cronometro === "rodando") setCronometro("pausado")
  }

  const rotuloBotao =
    cronometro === "rodando" ? "Pausar"
    : cronometro === "pausado" ? "Retomar"
    : cronometro === "esgotado" ? "Esgotado"
    : "Iniciar"

  let numero = 1

  return (
    <div>
      <div style={{
        position: "sticky", top: 0, zIndex: 5, display: "flex", flexWrap: "wrap", gap: 12,
        justifyContent: "space-between", alignItems: "center", marginBottom: 16,
        background: "#fff", border: "1px solid var(--dourado-claro)", borderRadius: 12,
        padding: "12px 16px", boxShadow: "var(--shadow-sm)",
      }}>
        <div>
          <p style={{ fontWeight: 700, color: "var(--azul-profundo)", fontSize: 14 }}>
            AE de {materia.sigla} — Simulado
          </p>
          <p style={{ fontSize: 12.5, color: "var(--cinza-texto)" }}>{sim.subtitulo}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 26, fontVariantNumeric: "tabular-nums", fontWeight: 700,
            color: cronometro === "esgotado" ? "#DC2626" : "var(--azul-medio)",
          }}>
            {formata(restante)}
          </span>
          <button
            type="button"
            disabled={cronometro === "esgotado"}
            onClick={() => setCronometro(c => (c === "rodando" ? "pausado" : "rodando"))}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13.5, fontWeight: 600,
              background: cronometro === "esgotado" ? "var(--cinza-borda)" : "var(--azul-medio)",
              color: cronometro === "esgotado" ? "var(--cinza-texto)" : "#fff",
              cursor: cronometro === "esgotado" ? "default" : "pointer",
            }}
          >
            {rotuloBotao}
          </button>
        </div>
      </div>

      {cronometro === "esgotado" && (
        <div style={{
          background: "#DC2626", color: "#fff", borderRadius: 10,
          padding: "10px 14px", marginBottom: 14, fontSize: 13.5,
        }}>
          Tempo esgotado. Encerre suas respostas e clique em “Verificar gabarito”.
        </div>
      )}

      {sim.gruposVF.map((g, k) => {
        const n = numero++
        return (
          <section key={g.t}>
            <h2 style={{
              fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600, color: "var(--azul-profundo)",
              borderBottom: "2px solid var(--dourado-claro)", paddingBottom: 5,
              margin: "22px 0 8px", display: "flex", justifyContent: "space-between",
              alignItems: "baseline", gap: 10, flexWrap: "wrap",
            }}>
              <span>{n}º quesito</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--dourado)" }}>
                {pontos(sim.pontosPorGrupoVF).replace(",00", ",0")} ponto · cada assertiva {pontos(pontosPorAssertiva)}
              </span>
            </h2>
            <p style={{
              background: "var(--azul-claro)", borderRadius: 8, padding: "10px 12px",
              fontSize: 13.5, lineHeight: 1.6, fontStyle: "italic",
              color: "var(--cinza-texto)", marginBottom: 10,
            }}>
              {g.t}
            </p>
            {g.itens.map((q, i) => {
              const id = `g${k}v${i}`
              return (
                <QuestaoVFView
                  key={id}
                  numero={`(${String.fromCharCode(97 + i)})`}
                  texto={q.t}
                  valor={vf[id]}
                  correta={q.v}
                  justificativa={q.j}
                  corrigido={corrigido}
                  onResponder={v => setVf(prev => ({ ...prev, [id]: v }))}
                />
              )
            })}
          </section>
        )
      })}

      {sim.mc.map((q, i) => {
        const id = `m${i}`
        const n = numero++
        return (
          <section key={id}>
            <h2 style={{
              fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600, color: "var(--azul-profundo)",
              borderBottom: "2px solid var(--dourado-claro)", paddingBottom: 5, margin: "22px 0 8px",
            }}>
              {n}º quesito
            </h2>
            <QuestaoMCView
              contexto={q.contexto}
              texto={q.t}
              alternativas={q.o}
              correta={q.a}
              justificativa={q.j}
              marcada={mc[id]}
              corrigido={corrigido}
              pontos={`${pontos(sim.pontosPorMC)} ponto`}
              onResponder={v => setMc(prev => ({ ...prev, [id]: v }))}
            />
          </section>
        )
      })}

      {sim.discursivas.map((q, i) => {
        const id = `d${i}`
        const n = numero++
        return (
          <section key={id}>
            <h2 style={{
              fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600, color: "var(--azul-profundo)",
              borderBottom: "2px solid var(--dourado-claro)", paddingBottom: 5, margin: "22px 0 8px",
            }}>
              {n}º quesito
            </h2>
            <QuestaoDiscursivaView
              texto={q.t}
              limite={q.limite}
              espelho={q.espelho}
              pontos={`${pontos(q.valor ?? 0)} pontos`}
              valor={textos[id] ?? ""}
              corrigido={corrigido}
              fator={fatores[id]}
              onEscrever={v => setTextos(prev => ({ ...prev, [id]: v }))}
              onAutoavaliar={f => setFatores(prev => ({ ...prev, [id]: f }))}
            />
          </section>
        )
      })}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", margin: "24px 0 8px" }}>
        <BotaoAcao onClick={verificar}>Verificar gabarito</BotaoAcao>
        <BotaoAcao variante="secundario" onClick={limpar}>Limpar simulado</BotaoAcao>
        {corrigido && (
          <span style={{ fontSize: 14, fontWeight: 700, color: "#15803D" }}>
            Nota: {pontos(nota)} / {pontos(sim.totalPontos)}
            {pendentes > 0 && ` — faça a autoavaliação de ${pendentes} discursiva(s)`}
          </span>
        )}
      </div>
    </div>
  )
}
