import Link from "next/link"
import { MATERIAS } from "@/lib/questoes"

export default function QuestoesPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{
        fontFamily: "var(--serif)", fontWeight: 600, fontSize: 24,
        color: "var(--azul-profundo)", marginBottom: 6,
      }}>
        Plataforma de Questões
      </h1>
      <p style={{ color: "var(--cinza-texto)", fontSize: 13, marginBottom: 28 }}>
        Banco de questões e simulados por matéria, no formato das Avaliações Escritas
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
        gap: 16,
      }}>
        {MATERIAS.map(m => {
          const objetivas = m.blocos.reduce((s, b) => s + b.vf.length + b.mc.length, 0)
          const discursivas = m.blocos.reduce((s, b) => s + b.discursivas.length, 0)
          return (
            <Link
              key={m.slug}
              href={`/questoes/${m.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div style={{
                background: m.corFundo,
                border: "1.5px solid rgba(0,0,0,0.07)",
                borderRadius: 18,
                padding: "20px 18px",
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              }}>
                <span style={{
                  color: m.cor, fontWeight: 800, fontSize: 15,
                  letterSpacing: "0.04em", textTransform: "uppercase",
                }}>
                  {m.sigla}
                </span>
                <p style={{ fontSize: 13, color: "var(--grafite)", lineHeight: 1.45, flex: 1 }}>
                  {m.nome}
                </p>
                <p style={{ fontSize: 11.5, color: "var(--cinza-texto)" }}>
                  {m.blocos.length} blocos · {objetivas} objetivas · {discursivas} discursivas + simulado
                </p>
              </div>
            </Link>
          )
        })}

        <div style={{
          border: "1.5px dashed var(--cinza-borda)", borderRadius: 18, padding: "20px 18px",
          minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", gap: 6, color: "#9CA3AF", textAlign: "center",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Outras matérias</span>
          <span style={{ fontSize: 11.5 }}>em breve</span>
        </div>
      </div>
    </div>
  )
}
