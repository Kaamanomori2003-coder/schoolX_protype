const stats = [
  { label: "Total Élèves",      value: "1 243", icon: "ti-users",       color: "#dbeafe", iconColor: "#1a3ed4", trend: "+12 ce mois" },
  { label: "Total Professeurs", value: "87",    icon: "ti-school",      color: "#dcfce7", iconColor: "#16a34a", trend: "+2 ce mois"  },
  { label: "Paiements reçus",   value: "4 850 000 GNF", icon: "ti-credit-card", color: "#fef9c3", iconColor: "#ca8a04", trend: "+8% vs mois dernier" },
  { label: "Dépenses du mois",  value: "1 200 000 GNF", icon: "ti-chart-pie",   color: "#fee2e2", iconColor: "#dc2626", trend: "-3% vs mois dernier" },
];

const recentStudents = [
  { name: "Aminata Diallo",   classe: "Terminale A", status: "Payé",       initials: "AD", color: "#dbeafe", textColor: "#1e40af" },
  { name: "Mamadou Bah",      classe: "3ème B",      status: "En attente", initials: "MB", color: "#dcfce7", textColor: "#166534" },
  { name: "Fatoumata Camara", classe: "Seconde C",   status: "Payé",       initials: "FC", color: "#fef9c3", textColor: "#854d0e" },
  { name: "Ibrahima Sow",     classe: "Terminale D", status: "Impayé",     initials: "IS", color: "#fee2e2", textColor: "#991b1b" },
  { name: "Mariama Kouyaté",  classe: "1ère S",      status: "Payé",       initials: "MK", color: "#f3e8ff", textColor: "#6b21a8" },
];

const paiementsMois = [
  { mois: "Jan", montant: 3200000 },
  { mois: "Fév", montant: 4100000 },
  { mois: "Mar", montant: 3800000 },
  { mois: "Avr", montant: 4600000 },
  { mois: "Mai", montant: 4850000 },
];

const alertes = [
  { texte: "12 élèves n'ont pas encore payé",    icon: "ti-alert-circle",   color: "#ef4444" },
  { texte: "3 professeurs absents aujourd'hui",   icon: "ti-user-off",       color: "#f59e0b" },
  { texte: "Réunion parents prévue vendredi",     icon: "ti-calendar-event", color: "#1a3ed4" },
  { texte: "Bulletins du trimestre disponibles",  icon: "ti-file-description",color: "#16a34a" },
];

const maxMontant = Math.max(...paiementsMois.map(p => p.montant));

const statusStyle = {
  "Payé":       { bg: "#dcfce7", color: "#166534" },
  "En attente": { bg: "#fef9c3", color: "#854d0e" },
  "Impayé":     { bg: "#fee2e2", color: "#991b1b" },
};

export default function Dashboard() {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Tableau de bord</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
          Bienvenue sur SchoolX - Année scolaire 2025/2026
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e2e8f0", padding: "18px 20px"
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: s.color, display: "flex",
              alignItems: "center", justifyContent: "center",
              marginBottom: 12
            }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.iconColor }} />
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, margin: "5px 0 3px" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Graphique + Élèves récents */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Graphique paiements */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ti ti-chart-bar" style={{ color: "#1a3ed4", fontSize: 18 }} />
            Paiements par mois
          </div>
          {paiementsMois.map((p) => (
            <div key={p.mois} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#64748b", width: 32 }}>{p.mois}</span>
              <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 4, height: 10 }}>
                <div style={{
                  width: `${(p.montant / maxMontant) * 100}%`,
                  background: "#1a3ed4", borderRadius: 4, height: 10,
                  transition: "width 0.4s ease"
                }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, width: 90, textAlign: "right" }}>
                {p.montant.toLocaleString()} GNF
              </span>
            </div>
          ))}
        </div>

        {/* Dernières inscriptions */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ti ti-users" style={{ color: "#1a3ed4", fontSize: 18 }} />
            Dernières inscriptions
          </div>
          {recentStudents.map((s) => (
            <div key={s.name} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: "1px solid #f1f5f9"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: s.color, color: s.textColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0
              }}>
                {s.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s.classe}</div>
              </div>
              <span style={{
                fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 500, flexShrink: 0,
                background: statusStyle[s.status].bg,
                color: statusStyle[s.status].color
              }}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-bell" style={{ color: "#1a3ed4", fontSize: 18 }} />
          Alertes & rappels
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {alertes.map((a) => (
            <div key={a.texte} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#f8fafc", borderRadius: 8, padding: "12px 14px",
              border: "1px solid #e2e8f0"
            }}>
              <i className={`ti ${a.icon}`} style={{ fontSize: 20, color: a.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#334155" }}>{a.texte}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}