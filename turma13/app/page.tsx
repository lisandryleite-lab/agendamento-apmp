import Link from "next/link"
import { prisma } from "@/lib/prisma"

const LINKS_RAPIDOS = [
  { label: "SEI", url: "https://sei.pe.gov.br" },
  { label: "Decreto 57.694/2024", url: "https://legis.alepe.pe.gov.br/texto.aspx?tiponorma=6&numero=57694&complemento=0&ano=2024&tipo=&url=" },
  { label: "Agendamento Psicólogo", url: "https://agendamento-apmp.vercel.app/" },
  { label: "Transparência Financeira", url: "https://drive.google.com/drive/folders/1JmRydCRwlUj_mUKpWKk1KQldv12kx5mD" },
]

export const dynamic = "force-dynamic"

export default async function Home() {
  const [xerife, aviso, alunos] = await Promise.all([
    prisma.xerife.findFirst({ where: { atual: true } }),
    prisma.aviso.findFirst({ orderBy: [{ fixado: "desc" }, { createdAt: "desc" }] }),
    prisma.user.findMany({ select: { matricula: true, nomeGuerra: true, aniversario: true } }),
  ])

  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1
  const diaHoje = String(hoje.getDate()).padStart(2, "0")

  const aniversariantesMes = alunos
    .filter((a) => {
      if (!a.aniversario) return false
      const [, mes] = a.aniversario.split("/")
      return Number(mes) === mesAtual
    })
    .sort((a, b) => Number(a.aniversario!.split("/")[0]) - Number(b.aniversario!.split("/")[0]))

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <header className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700 py-8 px-4 text-center">
        <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Academia de Polícia Militar · APMP Paudalho/PE
        </p>
        <h1 className="text-3xl font-bold text-white">CFO PM 2026</h1>
        <p className="text-slate-300 mt-1">Turma 13 · 1º Pelotão · 2ª CIA</p>
        <p className="text-slate-400 italic text-sm mt-3">"Tudo posso naquele que me fortalece" — Fp 4:13</p>
        <div className="flex gap-3 justify-center mt-4">
          <Link href="/login" className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold text-sm hover:bg-yellow-400">
            Entrar
          </Link>
          <Link href="/ranking" className="px-4 py-2 border border-slate-600 rounded text-sm hover:bg-slate-800">
            Ver Ranking
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-2">
        <section className="bg-slate-800 rounded-xl p-5">
          <h2 className="text-yellow-400 font-semibold mb-3 text-sm uppercase tracking-wide">Links Rápidos</h2>
          <div className="grid grid-cols-2 gap-2">
            {LINKS_RAPIDOS.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                className="bg-slate-700 hover:bg-slate-600 rounded-lg px-3 py-2.5 text-sm text-center transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </section>

        <section className="bg-slate-800 rounded-xl p-5">
          <h2 className="text-yellow-400 font-semibold mb-3 text-sm uppercase tracking-wide">Xerife Atual</h2>
          {xerife ? (
            <div className="text-center py-3">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-xl font-bold">{xerife.nomeGuerra}</p>
              <p className="text-slate-400 text-sm">Mat. {xerife.matricula}</p>
              <p className="text-slate-500 text-xs mt-1">
                Desde {new Date(xerife.dataInicio).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Não definido</p>
          )}
        </section>

        <section className="bg-slate-800 rounded-xl p-5">
          <h2 className="text-yellow-400 font-semibold mb-3 text-sm uppercase tracking-wide">
            Aniversariantes do Mês
          </h2>
          {aniversariantesMes.length === 0 ? (
            <p className="text-slate-400 text-sm">Ninguém este mês</p>
          ) : (
            <ul className="space-y-1">
              {aniversariantesMes.map((a) => {
                const isHoje = a.aniversario?.startsWith(diaHoje + "/")
                return (
                  <li key={a.matricula} className={`flex items-center gap-2 text-sm ${isHoje ? "text-yellow-300 font-semibold" : "text-slate-300"}`}>
                    <span className="text-slate-500 w-6">{a.aniversario?.split("/")[0]}</span>
                    {isHoje && "🎂"}
                    {a.nomeGuerra}
                    {isHoje && <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded ml-1">Hoje!</span>}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="bg-slate-800 rounded-xl p-5">
          <h2 className="text-yellow-400 font-semibold mb-3 text-sm uppercase tracking-wide">Último Aviso</h2>
          {aviso ? (
            <div>
              <p className="font-semibold">{aviso.titulo}</p>
              <p className="text-slate-300 text-sm mt-1 line-clamp-4">{aviso.corpo}</p>
              <p className="text-slate-500 text-xs mt-2">{new Date(aviso.createdAt).toLocaleDateString("pt-BR")}</p>
              <Link href="/avisos" className="text-yellow-400 text-xs mt-2 inline-block hover:underline">Ver todos →</Link>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Nenhum aviso</p>
          )}
        </section>
      </div>
    </main>
  )
}
