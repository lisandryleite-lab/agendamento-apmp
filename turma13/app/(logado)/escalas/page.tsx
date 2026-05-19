import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { EscalasAdmin } from "./escalas-admin"

export const dynamic = "force-dynamic"

const SEMANA_ATUAL = 19

const ESCALA_SERVICO_FIXA: Record<number, { p1: number; p3: number; p4: number; p1Nome: string; p3Nome: string; p4Nome: string }> = {
  19: { p1: 55, p3: 57, p4: 60, p1Nome: "SHIRLAYNE", p3Nome: "CLEYTON", p4Nome: "JOÃO NUNES" },
  20: { p1: 57, p3: 60, p4: 65, p1Nome: "CLEYTON", p3Nome: "JOÃO NUNES", p4Nome: "KAUHANNI" },
  21: { p1: 60, p3: 65, p4: 71, p1Nome: "JOÃO NUNES", p3Nome: "KAUHANNI", p4Nome: "LEIMIG" },
  22: { p1: 65, p3: 71, p4: 76, p1Nome: "KAUHANNI", p3Nome: "LEIMIG", p4Nome: "ARAÚJO JR" },
}

const GRUPOS_FAXINA = ["G1","G2","G3","G4","G5","G6","G7","G8"]
const GRUPOS_PLANTAO = ["GOLF","HOTEL","INDIA","JULIETT","KILO","LIMA"]

export default async function EscalasPage() {
  const session = await auth()
  const isAdmin = (session?.user as any)?.isAdmin

  const [servico, faxinas, plantoes, alunos] = await Promise.all([
    prisma.escalaServico.findUnique({ where: { semana: SEMANA_ATUAL } }),
    prisma.escalaFaxina.findMany({ where: { semana: SEMANA_ATUAL } }),
    prisma.escalaPlantao.findMany({ where: { semana: SEMANA_ATUAL } }),
    prisma.user.findMany({
      where: { isAdmin: false },
      orderBy: { matricula: "asc" },
      select: { matricula: true, nomeGuerra: true, grupoFaxina: true, grupoPlantao: true },
    }),
  ])

  const servicoFixo = ESCALA_SERVICO_FIXA[SEMANA_ATUAL]

  const porGrupoFaxina: Record<string, typeof alunos> = {}
  for (const g of GRUPOS_FAXINA) porGrupoFaxina[g] = []
  for (const a of alunos) {
    if (a.grupoFaxina && porGrupoFaxina[a.grupoFaxina]) porGrupoFaxina[a.grupoFaxina].push(a)
  }

  const porGrupoPlantao: Record<string, typeof alunos> = {}
  for (const g of GRUPOS_PLANTAO) porGrupoPlantao[g] = []
  for (const a of alunos) {
    if (a.grupoPlantao && porGrupoPlantao[a.grupoPlantao]) porGrupoPlantao[a.grupoPlantao].push(a)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Escalas — Semana {SEMANA_ATUAL}</h1>

      {/* Escala de Serviço */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Escala de Serviço</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { funcao: "P1 — Pessoal", mat: servicoFixo?.p1, nome: servicoFixo?.p1Nome },
            { funcao: "P3 — Operações", mat: servicoFixo?.p3, nome: servicoFixo?.p3Nome },
            { funcao: "P4 — Logística", mat: servicoFixo?.p4, nome: servicoFixo?.p4Nome },
          ].map((item) => (
            <div key={item.funcao} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">{item.funcao}</p>
              <p className="font-bold text-slate-800">{item.nome || "—"}</p>
              {item.mat && <p className="text-slate-400 text-xs">Mat. {item.mat}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Grupos de Faxina */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Grupos de Faxina</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GRUPOS_FAXINA.map((g) => (
            <div key={g} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">{g}</p>
              {porGrupoFaxina[g].length === 0 ? (
                <p className="text-slate-400 text-xs">Sem dados</p>
              ) : (
                <ul className="space-y-0.5">
                  {porGrupoFaxina[g].map((a) => (
                    <li key={a.matricula} className="text-sm text-slate-700">{a.nomeGuerra}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Grupos de Plantão */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Grupos de Plantão</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GRUPOS_PLANTAO.map((g) => (
            <div key={g} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">{g}</p>
              {porGrupoPlantao[g].length === 0 ? (
                <p className="text-slate-400 text-xs">Sem dados</p>
              ) : (
                <ul className="space-y-0.5">
                  {porGrupoPlantao[g].map((a) => (
                    <li key={a.matricula} className="text-sm text-slate-700">{a.nomeGuerra}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {isAdmin && <EscalasAdmin semanaAtual={SEMANA_ATUAL} alunos={alunos} />}
    </div>
  )
}
