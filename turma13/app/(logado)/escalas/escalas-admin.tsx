"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Aluno = { matricula: number; nomeGuerra: string }

export function EscalasAdmin({ semanaAtual, alunos }: { semanaAtual: number; alunos: Aluno[] }) {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [semana, setSemana] = useState(String(semanaAtual))
  const [p1, setP1] = useState("")
  const [p3, setP3] = useState("")
  const [p4, setP4] = useState("")
  const [saving, setSaving] = useState(false)

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch("/api/escalas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "servico", semana: Number(semana), p1: Number(p1) || null, p3: Number(p3) || null, p4: Number(p4) || null }),
    })
    setSaving(false)
    setShow(false)
    router.refresh()
  }

  return (
    <div>
      <button onClick={() => setShow(!show)}
        className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700">
        {show ? "Cancelar" : "Admin: Editar escala de serviço"}
      </button>
      {show && (
        <form onSubmit={salvar} className="mt-4 bg-slate-800 text-white rounded-xl p-5 space-y-3">
          <div className="flex gap-3 flex-wrap">
            <div>
              <label className="text-xs text-slate-400">Semana</label>
              <input type="number" value={semana} onChange={(e) => setSemana(e.target.value)} min={1} max={52}
                className="block bg-slate-700 rounded px-2 py-1.5 text-sm w-20 mt-0.5" />
            </div>
            {[["P1", p1, setP1], ["P3", p3, setP3], ["P4", p4, setP4]].map(([label, val, set]) => (
              <div key={label as string}>
                <label className="text-xs text-slate-400">{label as string}</label>
                <select value={val as string} onChange={(e) => (set as any)(e.target.value)}
                  className="block bg-slate-700 rounded px-2 py-1.5 text-sm mt-0.5">
                  <option value="">—</option>
                  {alunos.map((a) => <option key={a.matricula} value={a.matricula}>{a.matricula} {a.nomeGuerra}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button type="submit" disabled={saving}
            className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded text-sm disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </form>
      )}
    </div>
  )
}
