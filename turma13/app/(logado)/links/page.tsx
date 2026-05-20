"use client"

const LINKS = [
  {
    label: "Psicologia",
    desc: "Agendar com Psicólogo",
    url: "https://agendamento-apmp.vercel.app/",
    bg: "#1a7a3c",
    bgHover: "#15622f",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        {/* Cérebro estilizado */}
        <ellipse cx="24" cy="26" rx="13" ry="11" fill="rgba(255,255,255,0.15)" />
        <path d="M15 22c0-5 4-9 9-9s9 4 9 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <path d="M11 26c0 5.5 5.8 10 13 10s13-4.5 13-10" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <path d="M24 17v18" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M17 22c-3 0-6 1.5-6 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M31 22c3 0 6 1.5 6 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M18 28c0 2 2 3.5 6 3.5s6-1.5 6-3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    label: "SEI",
    desc: "Sistema Eletrônico de Informações",
    url: "https://sei.pe.gov.br",
    bg: "#0B5EA8",
    bgHover: "#094a87",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        <rect x="10" y="8" width="28" height="34" rx="3" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="2"/>
        <line x1="15" y1="16" x2="33" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="15" y1="22" x2="33" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="15" y1="28" x2="26" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="34" cy="34" r="5" fill="#1a7a3c" stroke="white" strokeWidth="1.5"/>
        <path d="M32 34l1.5 1.5 2.5-2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Portal ACIDES",
    desc: "Plataforma de ensino EAD",
    url: "https://acidesead.sds.pe.gov.br/login/index.php",
    bg: "#1A52A8",
    bgHover: "#144090",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        <rect x="8" y="12" width="32" height="22" rx="3" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="2"/>
        <line x1="16" y1="38" x2="32" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="24" y1="34" x2="24" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 23l3-3 2 2 3-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Drive da Turma",
    desc: "Documentos e materiais",
    url: "https://drive.google.com/drive/folders/1wrNtI9TyT6jNBdMfWlwcGJOwVL-wDqqJ",
    bg: "#B8924A",
    bgHover: "#9a7a3c",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        <path d="M8 34L18 16l8 14H8z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M20 34L30 16l10 18H20z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 34h32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Decreto CFO",
    desc: "Decreto 57.694/2024 — MGC",
    url: "https://legis.alepe.pe.gov.br/texto.aspx?tiponorma=6&numero=57694&complemento=0&ano=2024&tipo=&url=",
    bg: "#4A1D96",
    bgHover: "#3b1778",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        <path d="M16 6h16l8 8v28H8V6h8z" fill="rgba(255,255,255,0.12)" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M32 6v8h8" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="15" y1="22" x2="33" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="15" y1="28" x2="33" y2="28" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="15" y1="34" x2="26" y2="34" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Questões",
    desc: "Plataforma de questões",
    url: null,
    bg: "#0F766E",
    bgHover: "#0c5f58",
    emBreve: true,
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        <rect x="8" y="10" width="32" height="28" rx="4" fill="rgba(255,255,255,0.12)" stroke="white" strokeWidth="2"/>
        <circle cx="24" cy="22" r="4" stroke="white" strokeWidth="2"/>
        <path d="M24 26v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="31.5" r="1" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Financeiro",
    desc: "Portal financeiro",
    url: null,
    bg: "#71717A",
    bgHover: "#52525B",
    emBreve: true,
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        <circle cx="24" cy="24" r="14" fill="rgba(255,255,255,0.12)" stroke="white" strokeWidth="2"/>
        <path d="M24 14v20M19 19h7.5a2.5 2.5 0 010 5H20a2.5 2.5 0 000 5H28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function LinksPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 24, color: "var(--azul-profundo)", marginBottom: 6 }}>
        Links Úteis
      </h1>
      <p style={{ color: "var(--cinza-texto)", fontSize: 13, marginBottom: 28 }}>
        Acesso rápido aos sistemas e recursos da turma
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 16,
      }}>
        {LINKS.map((l) => {
          const card = (
            <div style={{
              background: l.bg,
              borderRadius: 16,
              padding: "24px 12px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              cursor: l.url ? "pointer" : "default",
              opacity: l.emBreve ? 0.65 : 1,
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              minHeight: 160,
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
            }}
            onMouseEnter={e => {
              if (!l.emBreve) {
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"
                ;(e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.22)"
              }
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.transform = "translateY(0)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"
            }}
            >
              {/* Círculo decorativo de fundo */}
              <div style={{
                position: "absolute", top: -20, right: -20,
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
              }} />

              {/* Ícone */}
              <div style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 14,
                padding: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {l.icon}
              </div>

              {/* Label */}
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2, marginBottom: 3 }}>
                  {l.label}
                </p>
                <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 11, lineHeight: 1.3 }}>
                  {l.emBreve ? "Em breve" : l.desc}
                </p>
              </div>
            </div>
          )

          if (l.url) {
            return (
              <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                {card}
              </a>
            )
          }
          return <div key={l.label}>{card}</div>
        })}
      </div>
    </div>
  )
}
