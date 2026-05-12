import { useState } from "react";

const elevesData = [
  { id: 1,  nom: "Aminata Diallo",    classe: "Terminale A", age: 18, telephone: "621 00 11 22", status: "Actif",   paiement: "Payé",       initials: "AD", color: "#dbeafe", textColor: "#1e40af" },
  { id: 2,  nom: "Mamadou Bah",       classe: "3ème B",      age: 15, telephone: "622 33 44 55", status: "Actif",   paiement: "En attente", initials: "MB", color: "#dcfce7", textColor: "#166534" },
  { id: 3,  nom: "Fatoumata Camara",  classe: "Seconde C",   age: 16, telephone: "623 55 66 77", status: "Actif",   paiement: "Payé",       initials: "FC", color: "#fef9c3", textColor: "#854d0e" },
  { id: 4,  nom: "Ibrahima Sow",      classe: "Terminale D", age: 19, telephone: "624 77 88 99", status: "Inactif", paiement: "Impayé",     initials: "IS", color: "#fee2e2", textColor: "#991b1b" },
  { id: 5,  nom: "Mariama Kouyaté",   classe: "1ère S",      age: 17, telephone: "625 11 22 33", status: "Actif",   paiement: "Payé",       initials: "MK", color: "#f3e8ff", textColor: "#6b21a8" },
  { id: 6,  nom: "Ousmane Traoré",    classe: "6ème A",      age: 12, telephone: "626 44 55 66", status: "Actif",   paiement: "Payé",       initials: "OT", color: "#dbeafe", textColor: "#1e40af" },
  { id: 7,  nom: "Kadiatou Barry",    classe: "5ème B",      age: 13, telephone: "627 66 77 88", status: "Actif",   paiement: "En attente", initials: "KB", color: "#dcfce7", textColor: "#166534" },
  { id: 8,  nom: "Sekou Condé",       classe: "4ème C",      age: 14, telephone: "628 88 99 00", status: "Inactif", paiement: "Impayé",     initials: "SC", color: "#fee2e2", textColor: "#991b1b" },
  { id: 9,  nom: "Aïssatou Diallo",   classe: "Terminale S", age: 18, telephone: "629 00 11 22", status: "Actif",   paiement: "Payé",       initials: "AD", color: "#fef9c3", textColor: "#854d0e" },
  { id: 10, nom: "Moussa Keita",      classe: "2nde A",      age: 16, telephone: "620 22 33 44", status: "Actif",   paiement: "Payé",       initials: "MK", color: "#f3e8ff", textColor: "#6b21a8" },
];

const statusStyle = {
  "Actif":   { bg: "#dcfce7", color: "#166534" },
  "Inactif": { bg: "#fee2e2", color: "#991b1b" },
};

const paiementStyle = {
  "Payé":       { bg: "#dcfce7", color: "#166534" },
  "En attente": { bg: "#fef9c3", color: "#854d0e" },
  "Impayé":     { bg: "#fee2e2", color: "#991b1b" },
};

export default function Eleves() {
  const [search, setSearch]             = useState("");
  const [filtreClasse, setFiltreClasse] = useState("Tous");
  const [showModal, setShowModal]       = useState(false);
  const [eleves, setEleves]             = useState(elevesData);
  const [form, setForm]                 = useState({ nom: "", classe: "", age: "", telephone: "" });

  const classes  = ["Tous", ...new Set(elevesData.map(e => e.classe))];
  const filtered = eleves.filter(e => {
    const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase());
    const matchClasse = filtreClasse === "Tous" || e.classe === filtreClasse;
    return matchSearch && matchClasse;
  });

  const handleAjouter = () => {
    if (!form.nom || !form.classe) return;
    const initials = form.nom.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const colors = [
      { color: "#dbeafe", textColor: "#1e40af" },
      { color: "#dcfce7", textColor: "#166534" },
      { color: "#fef9c3", textColor: "#854d0e" },
      { color: "#f3e8ff", textColor: "#6b21a8" },
    ];
    const c = colors[eleves.length % colors.length];
    setEleves([...eleves, {
      id: eleves.length + 1,
      nom: form.nom, classe: form.classe,
      age: form.age, telephone: form.telephone,
      status: "Actif", paiement: "En attente",
      initials, ...c,
    }]);
    setForm({ nom: "", classe: "", age: "", telephone: "" });
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion des élèves</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{eleves.length} élèves enregistrés</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#1a3ed4", color: "#fff", border: "none",
          borderRadius: 9, padding: "10px 18px", fontSize: 13,
          fontWeight: 600, cursor: "pointer"
        }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} />
          Ajouter un élève
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <i className="ti ti-search" style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16
          }} />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px 10px 36px",
              border: "1px solid #e2e8f0", borderRadius: 9,
              fontSize: 13, outline: "none", boxSizing: "border-box",
              fontFamily: "'Outfit', sans-serif"
            }}
          />
        </div>
        <select value={filtreClasse} onChange={e => setFiltreClasse(e.target.value)} style={{
          padding: "10px 14px", border: "1px solid #e2e8f0",
          borderRadius: 9, fontSize: 13, fontFamily: "'Outfit', sans-serif",
          outline: "none", background: "#fff", cursor: "pointer"
        }}>
          {classes.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Élève", "Classe", "Âge", "Téléphone", "Statut", "Paiement"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px", textAlign: "left",
                  fontSize: 12, fontWeight: 600, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.5px"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: e.color, color: e.textColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, flexShrink: 0
                    }}>{e.initials}</div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{e.nom}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{e.classe}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{e.age} ans</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{e.telephone}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500,
                    background: statusStyle[e.status].bg, color: statusStyle[e.status].color
                  }}>{e.status}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500,
                    background: paiementStyle[e.paiement].bg, color: paiementStyle[e.paiement].color
                  }}>{e.paiement}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                  Aucun élève trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}>
          <div style={{
            background: "#fff", borderRadius: 14, padding: 28,
            width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Ajouter un élève</h2>
              <button onClick={() => setShowModal(false)} style={{
                background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20
              }}>
                <i className="ti ti-x" />
              </button>
            </div>
            {[
              { label: "Nom complet", key: "nom",       placeholder: "Ex: Aminata Diallo" },
              { label: "Classe",      key: "classe",    placeholder: "Ex: Terminale A"    },
              { label: "Âge",         key: "age",       placeholder: "Ex: 17"             },
              { label: "Téléphone",   key: "telephone", placeholder: "Ex: 621 00 11 22"   },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>
                  {f.label}
                </label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 12px",
                    border: "1px solid #e2e8f0", borderRadius: 8,
                    fontSize: 13, outline: "none", boxSizing: "border-box",
                    fontFamily: "'Outfit', sans-serif"
                  }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: 10, border: "1px solid #e2e8f0",
                borderRadius: 8, background: "#fff", fontSize: 13,
                fontWeight: 600, cursor: "pointer", color: "#64748b",
                fontFamily: "'Outfit', sans-serif"
              }}>Annuler</button>
              <button onClick={handleAjouter} style={{
                flex: 1, padding: 10, border: "none",
                borderRadius: 8, background: "#1a3ed4", color: "#fff",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Outfit', sans-serif"
              }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}