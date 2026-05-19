import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { AulasClient } from "./aulas-client"

export const dynamic = "force-dynamic"

export default async function AulasPage() {
  const session = await auth()
  const isAdmin = (session?.user as any)?.isAdmin
  const disciplinas = await prisma.disciplina.findMany({ orderBy: [{ modulo: "asc" }, { sigla: "asc" }] })

  const total = disciplinas.reduce((s, d) => s + d.cargaTotal, 0)
  const ministradas = disciplinas.reduce((s, d) => s + d.cargaMinistrada, 0)
  const concluidas = disciplinas.filter((d) => d.status === "Concluída").length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Aulas — 52 Disciplinas</h1>
        <div className="flex gap-4 text-sm text-slate-600">
          <span><strong className="text-slate-800">{ministradas}h</strong> / {total}h ministradas</span>
          <span><strong className="text-slate-800">{concluidas}</strong> concluídas</span>
          <span><strong className="text-slate-800">{Math.round((ministradas / total) * 100)}%</strong></span>
        </div>
      </div>

      {/* Barra de progresso geral */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.round((ministradas / total) * 100)}%` }} />
      </div>

      <AulasClient disciplinas={disciplinas} isAdmin={isAdmin} />
    </div>
  )
}
