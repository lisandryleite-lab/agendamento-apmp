import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { AulasClient } from "./aulas-client"

export const dynamic = "force-dynamic"

const DATA_INICIO = new Date("2026-01-05")

function semanaAtual() {
  const diff = Date.now() - DATA_INICIO.getTime()
  return Math.min(52, Math.max(1, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))))
}

export default async function AulasPage() {
  const session = await auth()
  const isAdmin = session?.user?.isAdmin
  const disciplinas = await prisma.disciplina.findMany({ orderBy: [{ modulo: "asc" }, { sigla: "asc" }] })

  const totalCarga = disciplinas.reduce((s, d) => s + d.cargaTotal, 0)
  const totalMinistradas = disciplinas.reduce((s, d) => s + d.cargaMinistrada, 0)
  const semana = semanaAtual()

  return (
    <AulasClient
      disciplinas={disciplinas}
      isAdmin={isAdmin}
      semana={semana}
      totalCarga={totalCarga}
      totalMinistradas={totalMinistradas}
    />
  )
}
