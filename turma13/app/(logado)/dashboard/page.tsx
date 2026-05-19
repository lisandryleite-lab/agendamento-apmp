import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

const SEMANA_ATUAL = 19
const DATA_INICIO = new Date("2026-01-05")

function semanaAtual() {
  const diff = Date.now() - DATA_INICIO.getTime()
  return Math.min(52, Math.max(1, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))))
}

export default async function DashboardPage() {
  const session = await auth()
  const user = session!.user as any
  const matricula = user.matricula

  const [aluno, missao, aviso, xerife] = await Promise.all([
    prisma.user.findUnique({ where: { matricula }, select: { nomeGuerra: true, nomeCompleto: true, email: true, canga: true, grupoPlantao: true, grupoFaxina: true, aniversario: true } }),
    prisma.missao.findFirst({ where: { semana: SEMANA_ATUAL } }),
    prisma.aviso.findFirst({ orderBy: [{ fixado: "desc" }, { createdAt: "desc" }] }),
    prisma.xerife.findFirst({ where: { atual: true } }),
  ])

  const semana = semanaAtual()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Olá, {aluno?.nomeGuerra}!</h1>
        <p className="text-slate-500 text-sm mt-1">Semana {semana}/52 · Mat. {matricula}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Dados do aluno */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 col-span-full sm:col-span-1">
          <h2 className="font-semibold text-slate-700 text-sm mb-3">Seus dados</h2>
          <div className="space-y-1.5 text-sm">
            <p><span className="text-slate-500">Nome completo:</span> <span className="font-medium">{aluno?.nomeCompleto}</span></p>
            <p><span className="text-slate-500">E-mail:</span> <span className="font-medium">{aluno?.email}</span></p>
            {aluno?.canga && <p><span className="text-slate-500">Canga:</span> <span className="font-medium">{aluno.canga}</span></p>}
            {aluno?.grupoPlantao && <p><span className="text-slate-500">Plantão:</span> <span className="font-medium">{aluno.grupoPlantao}</span></p>}
            {aluno?.grupoFaxina && <p><span className="text-slate-500">Faxina:</span> <span className="font-medium">{aluno.grupoFaxina}</span></p>}
            {aluno?.aniversario && <p><span className="text-slate-500">Aniversário:</span> <span className="font-medium">{aluno.aniversario}</span></p>}
          </div>
        </div>

        {/* Missão da Semana */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h2 className="font-semibold text-slate-700 text-sm mb-3">Missão da Semana {semana}</h2>
          {missao ? (
            <div>
              <p className="font-medium text-slate-800">{missao.titulo}</p>
              <p className="text-slate-500 text-sm mt-1 line-clamp-3">{missao.corpo}</p>
              <Link href="/missao" className="text-blue-600 text-xs mt-2 inline-block hover:underline">Ver completa →</Link>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Não definida ainda</p>
          )}
        </div>

        {/* Xerife */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
          <h2 className="font-semibold text-slate-700 text-sm mb-3">Xerife Atual</h2>
          {xerife ? (
            <>
              <div className="text-3xl mb-1">⭐</div>
              <p className="font-bold text-slate-800">{xerife.nomeGuerra}</p>
              <p className="text-slate-500 text-xs">Mat. {xerife.matricula}</p>
            </>
          ) : (
            <p className="text-slate-400 text-sm">Não definido</p>
          )}
        </div>

        {/* Último aviso */}
        {aviso && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 col-span-full">
            <h2 className="font-semibold text-yellow-800 text-sm mb-1">⚠️ {aviso.titulo}</h2>
            <p className="text-yellow-700 text-sm line-clamp-2">{aviso.corpo}</p>
            <Link href="/avisos" className="text-yellow-600 text-xs mt-1 inline-block hover:underline">Ver todos os avisos →</Link>
          </div>
        )}

        {/* Links rápidos */}
        <div className="col-span-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/qts", label: "QTS", emoji: "📅" },
            { href: "/aulas", label: "Aulas", emoji: "📚" },
            { href: "/escalas", label: "Escalas", emoji: "🔄" },
            { href: "/turma", label: "Turma", emoji: "👥" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-slate-300 hover:bg-slate-50 transition-colors">
              <div className="text-2xl mb-1">{l.emoji}</div>
              <p className="text-sm font-medium text-slate-700">{l.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
