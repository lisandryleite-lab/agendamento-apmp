import "server-only"

export type NotaRanking = {
  disciplina: string
  avaliacao: string
  nota: number
  peso: number
}

/**
 * Calcula a Média Geral do Curso (MGC) conforme o Decreto CFO 2024.
 * PLACEHOLDER: usando média ponderada simples até a fórmula oficial ser fornecida.
 * Substitua esta função pela fórmula exata do Decreto quando disponível.
 */
export function calcularMGC(notas: NotaRanking[]): number | null {
  if (notas.length === 0) return null

  const somaPonderada = notas.reduce((s, n) => s + n.nota * n.peso, 0)
  const somaPesos = notas.reduce((s, n) => s + n.peso, 0)

  if (somaPesos === 0) return null
  return Number((somaPonderada / somaPesos).toFixed(2))
}
