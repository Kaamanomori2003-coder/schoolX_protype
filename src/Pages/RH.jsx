import { useState } from "react";

const rhData = [
  { id: 1,  nom: "Dr. Mamadou Diallo",   poste: "Professeur",      salaire: 2500000, contrat: "CDI",       dateEmbauche: "01/09/2018", status: "Actif"   },
  { id: 2,  nom: "Mme Fatoumata Bah",    poste: "Professeur",      salaire: 2200000, contrat: "CDI",       dateEmbauche: "15/09/2019", status: "Actif"   },
  { id: 3,  nom: "M. Ibrahima Camara",   poste: "Professeur",      salaire: 2000000, contrat: "CDD",       dateEmbauche: "01/10/2020", status: "Actif"   },
  { id: 4,  nom: "Mme Aïssatou Sow",     poste: "Professeur",      salaire: 2100000, contrat: "CDI",       dateEmbauche: "01/09/2017", status: "Inactif" },
  { id: 5,  nom: "M. Ousmane Kouyaté",   poste: "Professeur",      salaire: 2300000, contrat: "CDI",       dateEmbauche: "01/09/2016", status: "Actif"   },
  { id: 6,  nom: "Kadiatou Traoré",      poste: "Secrétaire",      salaire: 1500000, contrat: "CDI",       dateEmbauche: "01/03/2021", status: "Actif"   },
  { id: 7,  nom: "Sekou Barry",          poste: "Comptable",       salaire: 1800000, contrat: "CDI",       dateEmbauche: "15/06/2019", status: "Actif"   },
  { id: 8,  nom: "Mariama Condé",        poste: "Agent d'entretien",salaire: 900000, contrat: "Temps partiel", dateEmbauche: "01/01/2022", status: "Actif" },
];

const statusStyle = {
  "Actif":   { bg: "#dcfce7", color: "#166534" },
  "Inactif": { bg: "#fee2e2", color: "#991b1b" },
};

const contratStyle = {
  "CDI":           { bg: "#dbeafe", color: "#1e40af" },
  "CDD":           { bg: "#fef9c3", color: "#854d0e" },
  "Temps partiel": { bg: "#f3e8ff", color: "#6b21a8" },
};

export default function RH() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [employes, setEmployes]   = useState(rhData);
  const [form, setForm] = useState({ nom: "", poste: "", salaire: "", contrat: "CDI", dateEmbauche: "" });

  const totalSalaires = employes.filter(e => e.status === "Actif").reduce((a, e) => a + e.salaire, 0);

  const filtered = employes.filter(e =>
    e.nom.toLowerCase().includes(search.toLowerCase()) ||
    e.poste.toLowerCase().includes(search.toLowerCase())
  );

  const handleAjouter = () => {
    if (!form.nom || !form.poste) return;
    const initials = form.nom.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    setEmployes([...employes, {
      id: employes.length + 1,
      nom: form.nom, poste: form.poste,
      salaire: parseInt(form.salaire) || 0,
      contrat: form.contrat,
      dateEmbauche: form.dateEmbauche || new Date().toLocaleDateString("fr-FR"),
      status: "Actif", initials,
    }]);
    setForm({ nom: "", poste: "", salaire: "", contrat: "CDI", dateEmbauche: "" });
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion RH</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Masse salariale : <strong>{totalSalaires.toLocaleString()} GNF</strong></p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a3ed4", color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} /> Ajouter un employé
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total employés",   value: employes.length,                           icon: "ti-users",    color: "#dbeafe", iconColor: "#1e40af" },
          { label: "Employés actifs",  value: employes.filter(e => e.status === "Actif").length, icon: "ti-user-check", color: "#dcfce7", iconColor: "#166534" },
          { label: "Masse salariale",  value: totalSalaires.toLocaleString() + " GNF",   icon: "ti-cash",     color: "#fef9c3", iconColor: "#854d0e" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.iconColor }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16 }} />
        <input type="text" placeholder="Rechercher un employé..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }} />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Employé", "Poste", "Salaire", "Contrat", "Date embauche", "Statut"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{e.nom}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{e.poste}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1a3ed4" }}>{e.salaire.toLocaleString()} GNF</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: contratStyle[e.contrat]?.bg || "#f1f5f9", color: contratStyle[e.contrat]?.color || "#334155" }}>{e.contrat}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{e.dateEmbauche}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: statusStyle[e.status].bg, color: statusStyle[e.status].color }}>{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Ajouter un employé</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}><i className="ti ti-x" /></button>
            </div>
            {[
              { label: "Nom complet",    key: "nom",          placeholder: "Ex: Kadiatou Traoré"  },
              { label: "Poste",          key: "poste",        placeholder: "Ex: Secrétaire"       },
              { label: "Salaire (GNF)",  key: "salaire",      placeholder: "Ex: 1500000"          },
              { label: "Date embauche",  key: "dateEmbauche", placeholder: "Ex: 01/09/2025"       },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Type de contrat</label>
              <select value={form.contrat} onChange={e => setForm({ ...form, contrat: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif" }}>
                {["CDI", "CDD", "Temps partiel"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 10, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#64748b", fontFamily: "'Outfit', sans-serif" }}>Annuler</button>
              <button onClick={handleAjouter} style={{ flex: 1, padding: 10, border: "none", borderRadius: 8, background: "#1a3ed4", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
