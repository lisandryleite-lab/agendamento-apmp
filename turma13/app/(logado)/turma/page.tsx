import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const HIERARQUIA = [
  { posto: "Cel PM", nome: "Carneiro", cargo: "Comandante da APMP" },
  { posto: "Ten Cel PM", nome: "Andreza", cargo: "Subcomandante da APMP" },
  { posto: "Ten Cel PM", nome: "Thiago", cargo: "Comandante do Corpo de Alunos" },
  { posto: "Maj PM", nome: "Brayner", cargo: "Chefe da Divisão de Ensino" },
  { posto: "Cap PM", nome: "Arantes", cargo: "Comandante do Grupamento de Alunos" },
  { posto: "Cap PM", nome: "Nascimento", cargo: "Chefe da Divisão Administrativa" },
  { posto: "1º Ten PM", nome: "Vicente", cargo: "Chefe da Seção de Provas" },
  { posto: "1º Ten PM", nome: "Tenório", cargo: "Comandante da 1ª Companhia" },
  { posto: "1º Ten PM", nome: "Otávio Neto", cargo: "Chefe da Seção Técnica de Ensino" },
  { posto: "2º Ten PM", nome: "Ribeiro", cargo: "Comandante da 2ª Companhia" },
  { posto: "2º Ten PM", nome: "Paulo Lima", cargo: "Chefe da Ajudância e Seção de Pessoal" },
  { posto: "2º Ten PM", nome: "Thaysa", cargo: "Cmt 1º, 2º e 3º Pelotões da 2ª CIA" },
  { posto: "2º Ten PM", nome: "Pedro Lima", cargo: "Chefe da Seção de Meios Auxiliares" },
  { posto: "2º Ten PM", nome: "Vasconcelos", cargo: "Cmt 4º, 5º e 6º Pelotões da 2ª CIA" },
  { posto: "2º Ten PM", nome: "Viviane", cargo: "Cmt Pelotões da 1ª CIA | Coordenadora Turma 13" },
  { posto: "2º Ten PM", nome: "Brígida", cargo: "Chefe da Tesouraria" },
  { posto: "2º Ten PM", nome: "Guldenberg", cargo: "Chefe da SSTRAN e Almoxarifado" },
  { posto: "2º Ten PM", nome: "Melquezedec", cargo: "Chefe da SSMB/SSCOM/TI" },
]

const FUNCOES_FIXAS = [
  { funcao: "P4 Fixa – Logística", membros: "19 Thais, 165 Kevin" },
  { funcao: "Escala / Memento", membros: "108 Lisandry" },
  { funcao: "Encerramento de Disciplina", membros: "108 Lisandry, 114 Josiane, 131 José Inácio" },
  { funcao: "Charlie Mike", membros: "153 Hugo, 57 Cleyton, 114 Josiane, 167 Gustavo" },
  { funcao: "Motivação / Fé", membros: "153 Hugo, 105 Lucas, 165 Kevin" },
  { funcao: "Financeiro Turma", membros: "65 Kauhanni" },
  { funcao: "Financeiro DAG", membros: "07 Aldo" },
  { funcao: "Financeiro COMASP", membros: "60 João Nunes" },
  { funcao: "Aux. Documentação SEI", membros: "114 Josiane, 144 Samuel Santos" },
  { funcao: "Aniversário / Comemorações", membros: "55 Shirlayne, 19 Thais, 45 Gabriele" },
  { funcao: "QTs / Provas / ASCOM", membros: "07 Aldo, 71 Leimig, 116 Bertipalha" },
]

const CHARLIE_MIKE = [
  { rodizio: "1/8", membros: "Hugo, Cleyton, Alexandre, Gabriele Costa" },
  { rodizio: "2/8", membros: "Josiane, Renato Gomes, José Inácio, Gustavo Neto" },
  { rodizio: "3/8", membros: "Kauhanni, Fernando Rocha, André, Jonas" },
  { rodizio: "4/8", membros: "Bertipalha, Pablo, Thais, Leimig" },
  { rodizio: "5/8", membros: "Samuel Silva, Aldo, Samuel Santos, Lisandry" },
  { rodizio: "6/8", membros: "Hellton, Rodolfo, João Nunes, Shirlayne, Araújo" },
  { rodizio: "7/8", membros: "José Menezes, Lucas, Rafael, Vidal" },
  { rodizio: "8/8", membros: "Kevin, Gustavo, Gomes Nascimento, Elder Carvalho" },
]

export default async function TurmaPage() {
  const alunos = await prisma.user.findMany({
    where: { isAdmin: false },
    orderBy: { matricula: "asc" },
    select: { matricula: true, nomeGuerra: true, nomeCompleto: true, email: true, canga: true, grupoPlantao: true, grupoFaxina: true },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Turma 13</h1>

      {/* Alunos */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Alunos ({alunos.length})</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-200">
                <th className="px-4 py-3 text-left">Mat.</th>
                <th className="px-4 py-3 text-left">Nome de Guerra</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Nome Completo</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Canga</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Plantão</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Faxina</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((a) => (
                <tr key={a.matricula} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">{a.matricula}</td>
                  <td className="px-4 py-3 font-medium">{a.nomeGuerra}</td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{a.nomeCompleto}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{a.canga || "—"}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{a.grupoPlantao || "—"}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{a.grupoFaxina || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cadeia Hierárquica */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Cadeia Hierárquica APMP</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {HIERARQUIA.map((h, i) => (
            <div key={i} className={`px-4 py-3 text-sm flex gap-3 ${i > 0 ? "border-t border-slate-100" : ""}`}>
              <span className="text-slate-500 w-28 shrink-0">{h.posto}</span>
              <span className="font-medium text-slate-800">{h.nome}</span>
              <span className="text-slate-500 hidden sm:block">— {h.cargo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Funções Fixas */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Funções Fixas da Turma</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {FUNCOES_FIXAS.map((f, i) => (
            <div key={i} className={`px-4 py-3 text-sm flex gap-3 ${i > 0 ? "border-t border-slate-100" : ""}`}>
              <span className="text-slate-500 w-48 shrink-0">{f.funcao}</span>
              <span className="font-medium text-slate-800">{f.membros}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Charlie Mike */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Charlie Mike — Puxadores</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CHARLIE_MIKE.map((c) => (
            <div key={c.rodizio} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{c.rodizio}</p>
              <p className="text-sm text-slate-800">{c.membros}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
