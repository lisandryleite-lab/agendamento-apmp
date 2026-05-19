export default function LinksPage() {
  const links = [
    { label: "Agendar com Psicólogo", url: "https://agendamento-apmp.vercel.app/", desc: "Agendamento APMP", icon: "🧠" },
    { label: "SEI — Sistema Eletrônico de Informações", url: "https://sei.pe.gov.br", desc: "Portal SEI/PE", icon: "📄" },
    { label: "Decreto CFO 2024", url: "https://legis.alepe.pe.gov.br/texto.aspx?tiponorma=6&numero=57694&complemento=0&ano=2024&tipo=&url=", desc: "Decreto 57.694/2024 — MGC e regras do curso", icon: "⚖️" },
    { label: "Drive da Turma 13", url: "https://drive.google.com/drive/folders/1wrNtI9TyT6jNBdMfWlwcGJOwVL-wDqqJ", desc: "Documentos, materiais e arquivos compartilhados", icon: "📁" },
    { label: "Portal ACIDES / EAD", url: "https://acidesead.sds.pe.gov.br/login/index.php", desc: "Plataforma de ensino à distância", icon: "💻" },
    { label: "Mementos", url: null, desc: "Em breve", icon: "📋" },
    { label: "Plataforma de Questões", url: null, desc: "Em breve", icon: "✏️" },
  ]

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 24, color: "var(--azul-profundo)", marginBottom: 6 }}>
        Links Úteis
      </h1>
      <p style={{ color: "var(--cinza-texto)", fontSize: 13, marginBottom: 28 }}>
        Acesso rápido aos sistemas e recursos da turma
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map((l) => (
          <div key={l.label} style={{
            background: "#fff",
            border: "1.5px solid var(--cinza-borda)",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            boxShadow: "var(--shadow-sm)",
            opacity: l.url ? 1 : 0.6,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{l.icon}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--grafite)" }}>{l.label}</p>
                <p style={{ fontSize: 12, color: "var(--cinza-texto)", marginTop: 2 }}>{l.desc}</p>
              </div>
            </div>
            {l.url ? (
              <a href={l.url} target="_blank" rel="noopener noreferrer" style={{
                flexShrink: 0,
                background: "linear-gradient(135deg, var(--azul-profundo), var(--azul-medio))",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                padding: "7px 16px",
                borderRadius: 8,
                textDecoration: "none",
                boxShadow: "var(--shadow-sm)",
              }}>
                Abrir
              </a>
            ) : (
              <span style={{
                flexShrink: 0,
                fontSize: 11,
                color: "var(--cinza-texto)",
                border: "1px solid var(--cinza-borda)",
                padding: "6px 12px",
                borderRadius: 8,
              }}>
                Em breve
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
