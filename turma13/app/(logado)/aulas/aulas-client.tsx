"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Disciplina = {
  id: string; sigla: string; nome: string; modulo: string
  cargaTotal: number; cargaMinistrada: number; status: string
}

const STATUS_COLORS: Record<string, string> = {
  "Concluída": "bg-green-100 text-green-700",
  "Em andamento": "bg-blue-100 text-blue-700",
  "Início": "bg-slate-100 text-slate-500",
}

export function AulasClient({ disciplinas, isAdmin }: { disciplinas: Disciplina[]; isAdmin: boolean }) {
  const router = useRouter()
  const [editando, setEditando] = useState<string | null>(null)
  const [valores, setValores] = useState<Record<string, { cargaMinistrada: number; status: string }>>({})

  const modulos = [...new Set(disciplinas.map((d) => d.modulo))].sort()

  function iniciarEdicao(d: Disciplina) {
    setEditando(d.sigla)
    setValores((v) => ({ ...v, [d.sigla]: { cargaMinistrada: d.cargaMinistrada, status: d.status } }))
  }

  async function salvar(sigla: string) {
    const val = valores[sigla]
    await fetch("/api/disciplinas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sigla, ...val }),
    })
    setEditando(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {modulos.map((mod) => {
        const lista = disciplinas.filter((d) => d.modulo === mod)
        return (
          <div key={mod}>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{mod}</h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {lista.map((d, i) => {
                const pct = d.cargaTotal > 0 ? Math.round((d.cargaMinistrada / d.cargaTotal) * 100) : 0
                const val = valores[d.sigla]
                const editandoEsta = editando === d.sigla
                return (
                  <div key={d.sigla} className={`px-4 py-3 ${i > 0 ? "border-t border-slate-100" : ""}`}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-mono text-slate-500 w-16">{d.sigla}</span>
                      <span className="text-sm font-medium text-slate-800 flex-1 min-w-0">{d.nome}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[d.status] || ""}`}>{d.status}</span>
                      <span className="text-xs text-slate-400">{d.cargaMinistrada}h/{d.cargaTotal}h</span>
                      {isAdmin && !editandoEsta && (
                        <button onClick={() => iniciarEdicao(d)} className="text-xs text-blue-600 hover:underline ml-2">Editar</button>
                      )}
                    </div>
                    <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${pct === 100 ? "bg-green-500" : pct > 0 ? "bg-blue-500" : "bg-slate-300"}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    {editandoEsta && (
                      <div className="mt-3 flex gap-3 flex-wrap items-end">
                        <div>
                          <label className="text-xs text-slate-500">Horas ministradas</label>
                          <input type="number" min={0} max={d.cargaTotal}
                            value={val?.cargaMinistrada ?? d.cargaMinistrada}
                            onChange={(e) => setValores((v) => ({ ...v, [d.sigla]: { ...val, cargaMinistrada: Number(e.target.value) } }))}
                            className="block border border-slate-300 rounded px-2 py-1 text-sm w-24 mt-0.5" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Status</label>
                          <select value={val?.status ?? d.status}
                            onChange={(e) => setValores((v) => ({ ...v, [d.sigla]: { ...val, status: e.target.value } }))}
                            className="block border border-slate-300 rounded px-2 py-1 text-sm mt-0.5">
                            <option>Início</option>
                            <option>Em andamento</option>
                            <option>Concluída</option>
                          </select>
                        </div>
                        <button onClick={() => salvar(d.sigla)} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700">Salvar</button>
                        <button onClick={() => setEditando(null)} className="text-xs text-slate-500 hover:underline">Cancelar</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
