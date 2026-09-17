import type { Materia } from "./types"
import { EASPE } from "./easpe"

/** Matérias disponíveis na plataforma de questões. */
export const MATERIAS: Materia[] = [EASPE]

export function getMateria(slug: string): Materia | undefined {
  return MATERIAS.find(m => m.slug === slug)
}

export type { Materia } from "./types"
