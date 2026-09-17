"use client"

import { useMemo } from "react"

const LETRAS = "ABCDE"

/** Renderiza **negrito** e *itálico* sem HTML bruto. */
export function Rich({ text }: { text: string }) {
  const partes = useMemo(() => {
    const out: { t: string; b?: boolean; i?: boolean }[] = []
    const re = /\*\*(.+?)\*\*|\*(.+?)\*/g
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) out.push({ t: text.slice(last, m.index) })
      if (m[1] !== undefined) out.push({ t: m[1], b: true })
      else out.push({ t: m[2], i: true })
      last = m.index + m[0].length
    }
    if (last < text.length) out.push({ t: text.slice(last) })
    return out
  }, [text])

  return (
    <>
      {partes.map((p, i) =>
        p.b ? <strong key={i} style={{ color: "var(--azul-profundo)" }}>{p.t}</strong>
        : p.i ? <em key={i} style={{ color: "var(--cinza-texto)" }}>{p.t}</em>
        : <span key={i}>{p.t}</span>
      )}
    </>
  )
}

export type Estado = "neutro" | "certo" | "errado"

const CORES: Record<Estado, { borda: string; fundo: string }> = {
  neutro:  { borda: "var(--cinza-borda)", fundo: "#ffffff" },
  certo:   { borda: "#16A34A",            fundo: "#F0FDF4" },
  errado:  { borda: "#DC2626",            fundo: "#FEF2F2" },
}

export function Cartao({ estado = "neutro", children }: { estado?: Estado; children: React.ReactNode }) {
  const c = CORES[estado]
  return (
    <div style={{
      background: c.fundo,
      border: "1px solid var(--cinza-borda)",
      borderLeft: `4px solid ${c.borda}`,
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 10,
      boxShadow: "var(--shadow-sm)",
    }}>
      {children}
    </div>
  )
}

export function Numero({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontWeight: 800, color: "var(--azul-profundo)", marginRight: 6, fontSize: 14 }}>
      {children}
    </span>
  )
}

export function Justificativa({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 10, paddingTop: 8, borderTop: "1px dashed var(--cinza-borda)",
      fontSize: 13, color: "var(--cinza-texto)", lineHeight: 1.6,
    }}>
      {children}
    </div>
  )
}

/** Questão de verdadeiro ou falso. */
export function QuestaoVFView({
  numero, texto, valor, correta, justificativa, corrigido, onResponder,
}: {
  numero: string
  texto: string
  valor?: boolean
  correta: boolean
  justificativa: string
  corrigido: boolean
  onResponder: (v: boolean) => void
}) {
  const acertou = valor === correta
  const estado: Estado = !corrigido ? "neutro" : acertou ? "certo" : "errado"

  return (
    <Cartao estado={estado}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {[true, false].map(v => (
            <button
              key={String(v)}
              type="button"
              onClick={() => onResponder(v)}
              aria-label={v ? "Verdadeiro" : "Falso"}
              aria-pressed={valor === v}
              style={{
                width: 38, height: 34, borderRadius: 8, fontWeight: 800, fontSize: 14,
                cursor: "pointer",
                border: `1.5px solid ${valor === v ? "var(--azul-medio)" : "var(--cinza-borda)"}`,
                background: valor === v ? "var(--azul-medio)" : "#fff",
                color: valor === v ? "#fff" : "var(--cinza-texto)",
              }}
            >
              {v ? "V" : "F"}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 220, fontSize: 14.5, lineHeight: 1.6 }}>
          <Numero>{numero}</Numero>
          {texto}
          {corrigido && (
            <Justificativa>
              <strong style={{ color: "var(--azul-profundo)" }}>
                Gabarito: {correta ? "V" : "F"}
              </strong>
              {valor === undefined && " (sem resposta)"}. {justificativa}
            </Justificativa>
          )}
        </div>
      </div>
    </Cartao>
  )
}

/** Questão de múltipla escolha. */
export function QuestaoMCView({
  numero, contexto, texto, alternativas, correta, justificativa, marcada, corrigido, pontos, onResponder,
}: {
  numero?: string
  contexto?: string
  texto: string
  alternativas: string[]
  correta: number
  justificativa: string
  marcada?: number
  corrigido: boolean
  pontos?: string
  onResponder: (i: number) => void
}) {
  const acertou = marcada === correta
  const estado: Estado = !corrigido ? "neutro" : acertou ? "certo" : "errado"

  return (
    <Cartao estado={estado}>
      {pontos && (
        <span style={{ float: "right", fontSize: 12, fontWeight: 700, color: "var(--dourado)" }}>
          {pontos}
        </span>
      )}
      {contexto && (
        <p style={{
          background: "var(--azul-claro)", borderRadius: 8, padding: "10px 12px",
          fontSize: 13.5, lineHeight: 1.6, fontStyle: "italic",
          color: "var(--cinza-texto)", marginBottom: 10,
        }}>
          {contexto}
        </p>
      )}
      <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>
        {numero && <Numero>{numero}</Numero>}
        {texto}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
        {alternativas.map((alt, i) => {
          const sel = marcada === i
          const certa = corrigido && i === correta
          const erradaMarcada = corrigido && sel && i !== correta
          return (
            <button
              key={i}
              type="button"
              onClick={() => onResponder(i)}
              aria-pressed={sel}
              style={{
                textAlign: "left", fontSize: 13.5, lineHeight: 1.5, padding: "8px 11px",
                borderRadius: 8, cursor: "pointer",
                border: `1.5px solid ${certa ? "#16A34A" : erradaMarcada ? "#DC2626" : sel ? "var(--azul-medio)" : "var(--cinza-borda)"}`,
                background: certa ? "#DCFCE7" : erradaMarcada ? "#FEE2E2" : sel ? "var(--azul-medio)" : "#fff",
                color: sel && !corrigido ? "#fff" : "var(--grafite)",
                fontWeight: certa ? 600 : 400,
              }}
            >
              ({LETRAS[i]}) {alt}
            </button>
          )
        })}
      </div>
      {corrigido && (
        <Justificativa>
          <strong style={{ color: "var(--azul-profundo)" }}>Gabarito: ({LETRAS[correta]})</strong>
          {marcada === undefined && " (sem resposta)"}. {justificativa}
        </Justificativa>
      )}
    </Cartao>
  )
}

/** Questão discursiva, com espelho de correção e autoavaliação opcional. */
export function QuestaoDiscursivaView({
  numero, texto, limite, espelho, pontos, valor, corrigido, fator, onEscrever, onAutoavaliar,
}: {
  numero?: string
  texto: string
  limite: string
  espelho: string
  pontos?: string
  valor: string
  corrigido: boolean
  fator?: number
  onEscrever: (v: string) => void
  onAutoavaliar?: (f: number) => void
}) {
  return (
    <Cartao>
      {pontos && (
        <span style={{ float: "right", fontSize: 12, fontWeight: 700, color: "var(--dourado)" }}>
          {pontos}
        </span>
      )}
      <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>
        {numero && <Numero>{numero}</Numero>}
        {texto}
      </p>
      <p style={{ fontSize: 12, color: "var(--dourado)", marginTop: 6 }}>
        Resposta com {limite}.
      </p>
      <textarea
        aria-label="Resposta"
        value={valor}
        onChange={e => onEscrever(e.target.value)}
        style={{
          width: "100%", minHeight: 140, marginTop: 8, padding: 10, fontSize: 14,
          lineHeight: 1.6, borderRadius: 8, border: "1px solid var(--cinza-borda)",
          fontFamily: "inherit", resize: "vertical", background: "#fff",
        }}
      />
      {corrigido && (
        <>
          <div style={{
            marginTop: 10, background: "#FFFBEB", borderLeft: "3px solid var(--dourado)",
            borderRadius: 8, padding: "10px 12px", fontSize: 13.5, lineHeight: 1.65,
          }}>
            <p style={{ fontWeight: 800, color: "var(--dourado)", marginBottom: 4 }}>
              Espelho de correção
            </p>
            <Rich text={espelho} />
          </div>
          {onAutoavaliar && (
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 10, fontSize: 13 }}>
              <span style={{ color: "var(--cinza-texto)" }}>Autoavaliação:</span>
              {[
                { f: 0, rot: "0 (nada)" },
                { f: 0.5, rot: "Metade" },
                { f: 1, rot: "Total" },
              ].map(({ f, rot }) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onAutoavaliar(f)}
                  aria-pressed={fator === f}
                  style={{
                    fontSize: 12.5, padding: "5px 11px", borderRadius: 8, cursor: "pointer",
                    border: `1.5px solid ${fator === f ? "var(--dourado)" : "var(--cinza-borda)"}`,
                    background: fator === f ? "var(--dourado)" : "#fff",
                    color: fator === f ? "#fff" : "var(--cinza-texto)",
                  }}
                >
                  {rot}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </Cartao>
  )
}

export function BotaoAcao({
  children, onClick, variante = "primario",
}: {
  children: React.ReactNode
  onClick: () => void
  variante?: "primario" | "secundario"
}) {
  const primario = variante === "primario"
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
        border: primario ? "none" : "1.5px solid var(--cinza-borda)",
        background: primario ? "var(--azul-profundo)" : "#fff",
        color: primario ? "#fff" : "var(--cinza-texto)",
      }}
    >
      {children}
    </button>
  )
}

export function TituloSecao({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600,
      color: "var(--azul-medio)", margin: "22px 0 10px",
    }}>
      {children}
    </h3>
  )
}
