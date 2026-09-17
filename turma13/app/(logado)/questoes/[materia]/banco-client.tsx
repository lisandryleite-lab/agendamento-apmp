"use client"

import { useState } from "react"
import type { Materia } from "@/lib/questoes/types"
import {
  BotaoAcao, QuestaoDiscursivaView, QuestaoMCView, QuestaoVFView, TituloSecao,
} from "../components"

export function BancoClient({ materia }: { materia: Materia }) {
  const [blocoAtivo, setBlocoAtivo] = useState(0)
  const [vf, setVf] = useState<Record<string, boolean>>({})
  const [mc, setMc] = useState<Record<string, number>>({})
  const [textos, setTextos] = useState<Record<string, string>>({})
  const [corrigidos, setCorrigidos] = useState<Record<number, boolean>>({})

  const bloco = materia.blocos[blocoAtivo]
  const corrigido = !!corrigidos[blocoAtivo]

  const acertos =
    bloco.vf.filter((q, i) => vf[`b${blocoAtivo}v${i}`] === q.v).length +
    bloco.mc.filter((q, i) => mc[`b${blocoAtivo}m${i}`] === q.a).length
  const totalObjetivas = bloco.vf.length + bloco.mc.length

  function limparBloco() {
    const prefixo = `b${blocoAtivo}`
    const semBloco = <T,>(obj: Record<string, T>) =>
      Object.fromEntries(Object.entries(obj).filter(([k]) => !k.startsWith(prefixo)))
    setVf(semBloco)
    setMc(semBloco)
    setTextos(semBloco)
    setCorrigidos(prev => ({ ...prev, [blocoAtivo]: false }))
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {materia.blocos.map((b, k) => (
          <button
            key={b.titulo}
            type="button"
            onClick={() => setBlocoAtivo(k)}
            style={{
              fontSize: 13, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
              border: `1.5px solid ${k === blocoAtivo ? "var(--azul-medio)" : "var(--cinza-borda)"}`,
              background: k === blocoAtivo ? "var(--azul-medio)" : "#fff",
              color: k === blocoAtivo ? "#fff" : "var(--cinza-texto)",
              fontWeight: k === blocoAtivo ? 600 : 400,
            }}
          >
            Bloco {k + 1}
          </button>
        ))}
      </div>

      <h2 style={{
        fontFamily: "var(--serif)", fontSize: 19, fontWeight: 600,
        color: "var(--azul-profundo)", borderBottom: "2px solid var(--dourado-claro)",
        paddingBottom: 6, marginBottom: 4,
      }}>
        Bloco {blocoAtivo + 1}: {bloco.titulo}
      </h2>

      <TituloSecao>Verdadeiro ou falso</TituloSecao>
      {bloco.vf.map((q, i) => {
        const id = `b${blocoAtivo}v${i}`
        return (
          <QuestaoVFView
            key={id}
            numero={`${i + 1}.`}
            texto={q.t}
            valor={vf[id]}
            correta={q.v}
            justificativa={q.j}
            corrigido={corrigido}
            onResponder={v => setVf(prev => ({ ...prev, [id]: v }))}
          />
        )
      })}

      <TituloSecao>Múltipla escolha</TituloSecao>
      {bloco.mc.map((q, i) => {
        const id = `b${blocoAtivo}m${i}`
        return (
          <QuestaoMCView
            key={id}
            numero={`${bloco.vf.length + i + 1}.`}
            contexto={q.contexto}
            texto={q.t}
            alternativas={q.o}
            correta={q.a}
            justificativa={q.j}
            marcada={mc[id]}
            corrigido={corrigido}
            onResponder={v => setMc(prev => ({ ...prev, [id]: v }))}
          />
        )
      })}

      <TituloSecao>Discursivas</TituloSecao>
      {bloco.discursivas.map((q, i) => {
        const id = `b${blocoAtivo}d${i}`
        return (
          <QuestaoDiscursivaView
            key={id}
            numero={`${totalObjetivas + i + 1}.`}
            texto={q.t}
            limite={q.limite}
            espelho={q.espelho}
            valor={textos[id] ?? ""}
            corrigido={corrigido}
            onEscrever={v => setTextos(prev => ({ ...prev, [id]: v }))}
          />
        )
      })}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", margin: "24px 0 8px" }}>
        <BotaoAcao onClick={() => setCorrigidos(prev => ({ ...prev, [blocoAtivo]: true }))}>
          Verificar gabarito
        </BotaoAcao>
        <BotaoAcao variante="secundario" onClick={limparBloco}>
          Limpar bloco
        </BotaoAcao>
        {corrigido && (
          <span style={{ fontSize: 14, fontWeight: 700, color: "#15803D" }}>
            Objetivas: {acertos} de {totalObjetivas} acertos ({Math.round((acertos / totalObjetivas) * 100)}%).
            Compare as discursivas com os espelhos.
          </span>
        )}
      </div>
    </div>
  )
}
