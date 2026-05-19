import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function RankingPage() {
  const alunos = await prisma.user.findMany({
    where: { isAdmin: false },
    orderBy: { matricula: "asc" },
    select: { matricula: true, nomeGuerra: true, nomeCompleto: true },
  })

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-yellow-400 text-sm hover:underline">← Início</Link>
          <h1 className="text-lg font-bold">Ranking da Turma</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700">
            <p className="text-slate-400 text-sm">
              Ranking por Média Geral do Curso (MGC) — enquanto não há notas lançadas, exibido por ordem de matrícula.
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-xs uppercase">
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left w-20">Mat.</th>
                <th className="px-4 py-3 text-left">Nome de Guerra</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Nome Completo</th>
                <th className="px-4 py-3 text-right">MGC</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((a, i) => (
                <tr key={a.matricula} className={`border-t border-slate-700/50 ${i < 3 ? "bg-slate-700/30" : ""}`}>
                  <td className="px-4 py-3 text-slate-400 text-sm">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{a.matricula}</td>
                  <td className="px-4 py-3 font-medium">{a.nomeGuerra}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm hidden sm:table-cell">{a.nomeCompleto}</td>
                  <td className="px-4 py-3 text-right text-slate-500 text-sm">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
