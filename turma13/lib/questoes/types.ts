// Tipos do banco de questões da plataforma.
// O texto dos enunciados/espelhos aceita **negrito** e *itálico* (ver <Rich/>).

export type QuestaoVF = {
  /** Assertiva. */
  t: string
  /** Gabarito: true = verdadeiro. */
  v: boolean
  /** Justificativa exibida na correção. */
  j: string
}

export type QuestaoMC = {
  /** Texto de apoio (caso/contexto), exibido antes do comando da questão. */
  contexto?: string
  /** Comando da questão. */
  t: string
  /** Alternativas, na ordem em que aparecem. */
  o: string[]
  /** Índice da alternativa correta em `o`. */
  a: number
  /** Justificativa exibida na correção. */
  j: string
}

export type QuestaoDiscursiva = {
  t: string
  /** Limite de linhas informado ao candidato. */
  limite: string
  /** Espelho de correção. */
  espelho: string
  /** Valor em pontos (usado no simulado). */
  valor?: number
}

export type Bloco = {
  titulo: string
  vf: QuestaoVF[]
  mc: QuestaoMC[]
  discursivas: QuestaoDiscursiva[]
}

export type GrupoVF = {
  /** Enunciado do quesito. */
  t: string
  itens: QuestaoVF[]
}

export type Simulado = {
  subtitulo: string
  duracaoMin: number
  totalPontos: number
  /** Cada grupo vale `pontosPorGrupoVF`, dividido igualmente entre as assertivas. */
  pontosPorGrupoVF: number
  pontosPorMC: number
  gruposVF: GrupoVF[]
  mc: QuestaoMC[]
  discursivas: QuestaoDiscursiva[]
}

export type Materia = {
  slug: string
  sigla: string
  nome: string
  descricao: string
  fonte: string
  /** Cores do cartão no índice. */
  cor: string
  corFundo: string
  blocos: Bloco[]
  simulado: Simulado
}
