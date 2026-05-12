const emploisData = {
  "Lundi":    ["Mathématiques", "Français", "Physique-Chimie", "Anglais", "SVT", "Histoire-Géo"],
  "Mardi":    ["Français", "SVT", "Mathématiques", "Informatique", "Philosophie", "Physique-Chimie"],
  "Mercredi": ["Histoire-Géo", "Mathématiques", "Anglais", "Français", "SVT", ""],
  "Jeudi":    ["Physique-Chimie", "Philosophie", "Français", "Mathématiques", "Informatique", "Anglais"],
  "Vendredi": ["SVT", "Anglais", "Histoire-Géo", "Physique-Chimie", "Mathématiques", "Français"],
};

const heures = ["07h30", "08h30", "09h30", "10h30", "11h30", "14h00"];

const matiereColor = {
  "Mathématiques":   { bg: "#dbeafe", color: "#1e40af" },
  "Français":        { bg: "#dcfce7", color: "#166534" },
  "Physique-Chimie": { bg: "#fee2e2", color: "#991b1b" },
  "Anglais":         { bg: "#fef9c3", color: "#854d0e" },
  "SVT":             { bg: "#f3e8ff", color: "#6b21a8" },
  "Histoire-Géo":    { bg: "#e0f2fe", color: "#0369a1" },
  "Informatique":    { bg: "#fce7f3", color: "#9d174d" },
  "Philosophie":     { bg: "#f0fdf4", color: "#166534" },
};

export default function Emplois() {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion des emplois du temps</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Classe : Terminale A — Semaine type</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", width: 80 }}>Heure</th>
              {Object.keys(emploisData).map(jour => (
                <th key={jour} style={{ padding: "12px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{jour}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heures.map((heure, i) => (
              <tr key={heure} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>{heure}</td>
                {Object.values(emploisData).map((cours, j) => {
                  const matiere = cours[i];
                  const style = matiereColor[matiere] || null;
                  return (
                    <td key={j} style={{ padding: "10px 12px", textAlign: "center" }}>
                      {matiere ? (
                        <span style={{
                          display: "inline-block", padding: "5px 10px",
                          borderRadius: 8, fontSize: 12, fontWeight: 500,
                          background: style?.bg || "#f1f5f9",
                          color: style?.color || "#334155"
                        }}>{matiere}</span>
                      ) : (
                        <span style={{ color: "#e2e8f0", fontSize: 18 }}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
