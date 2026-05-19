import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calcularMGC } from "@/lib/ranking"

export const dynamic = "force-dynamic"

export default async function RankingPage() {
  const session = await auth()
  const minha = (session!.user as any).matricula as number

  const [alunos, todasNotas] = await Promise.all([
    prisma.user.findMany({
      where: { isAdmin: false },
      orderBy: { matricula: "asc" },
      select: { id: true, matricula: true, nomeGuerra: true, canga: true },
    }),
    prisma.nota.findMany({
      select: { userId: true, disciplina: true, avaliacao: true, nota: true, peso: true },
    }),
  ])

  const notasPorUser: Record<string, typeof todasNotas> = {}
  for (const n of todasNotas) {
    if (!notasPorUser[n.userId]) notasPorUser[n.userId] = []
    notasPorUser[n.userId].push(n)
  }

  const ranking = alunos
    .map((a) => ({
      ...a,
      mgc: calcularMGC(notasPorUser[a.id] || []),
    }))
    .sort((a, b) => {
      if (a.mgc === null && b.mgc === null) return a.matricula - b.matricula
      if (a.mgc === null) return 1
      if (b.mgc === null) return -1
      return b.mgc - a.mgc
    })

  const minhaPos = ranking.findIndex((a) => a.matricula === minha)
  const minhaEntrada = ranking[minhaPos]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Ranking da Turma</h1>
      <p className="text-sm text-gray-500 mb-6">
        MGC calculada com base nas notas lançadas pelos alunos.{" "}
        <span className="text-amber-600 font-medium">Fórmula: pendente (Decreto CFO 2024).</span>
      </p>

      {/* Card da posição do aluno logado */}
      {minhaEntrada && (
        <div className="bg-blue-900 text-white rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="text-3xl font-bold w-12 text-center">
            {minhaPos + 1}º
          </div>
          <div>
            <p className="font-semibold">{minhaEntrada.nomeGuerra}</p>
            <p className="text-blue-200 text-sm">
              Mat. {minhaEntrada.matricula} · Canga: {minhaEntrada.canga || "—"}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold">
              {minhaEntrada.mgc !== null ? minhaEntrada.mgc.toFixed(2) : "—"}
            </p>
            <p className="text-blue-300 text-xs">MGC</p>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
              <th className="px-4 py-3 text-left w-12">#</th>
              <th className="px-4 py-3 text-left">Nome de Guerra</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Mat.</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Canga</th>
              <th className="px-4 py-3 text-right">MGC</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((a, i) => {
              const isMe = a.matricula === minha
              return (
                <tr
                  key={a.matricula}
                  className={`border-t border-gray-100 ${isMe ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3 text-gray-500 font-medium">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {a.nomeGuerra}
                    {isMe && <span className="ml-2 text-xs text-blue-600">(você)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{a.matricula}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{a.canga || "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {a.mgc !== null ? a.mgc.toFixed(2) : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
