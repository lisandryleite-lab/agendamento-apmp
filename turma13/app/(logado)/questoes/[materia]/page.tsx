import { notFound } from "next/navigation"
import { MATERIAS, getMateria } from "@/lib/questoes"
import { MateriaClient } from "./materia-client"

export function generateStaticParams() {
  return MATERIAS.map(m => ({ materia: m.slug }))
}

export default async function MateriaQuestoesPage({
  params,
}: {
  params: Promise<{ materia: string }>
}) {
  const { materia: slug } = await params
  const materia = getMateria(slug)
  if (!materia) notFound()

  return <MateriaClient materia={materia} />
}
