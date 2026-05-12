// ========== MATIERES ==========
import { useState } from "react";

const matieresData = [
  { id: 1, nom: "Mathématiques",   professeur: "Dr. Mamadou Diallo",  heures: 6, classe: "Terminale A", coefficient: 5 },
  { id: 2, nom: "Français",        professeur: "Mme Fatoumata Bah",   heures: 4, classe: "Terminale A", coefficient: 4 },
  { id: 3, nom: "Physique-Chimie", professeur: "M. Ousmane Kouyaté",  heures: 4, classe: "Terminale S", coefficient: 4 },
  { id: 4, nom: "Histoire-Géo",    professeur: "M. Ibrahima Camara",  heures: 3, classe: "3ème B",      coefficient: 3 },
  { id: 5, nom: "Anglais",         professeur: "Mme Aïssatou Sow",    heures: 3, classe: "Seconde C",   coefficient: 3 },
  { id: 6, nom: "SVT",             professeur: "Mme Kadiatou Traoré", heures: 3, classe: "1ère S",      coefficient: 3 },
  { id: 7, nom: "Informatique",    professeur: "M. Sekou Barry",      heures: 2, classe: "Terminale D", coefficient: 2 },
  { id: 8, nom: "Philosophie",     professeur: "Mme Mariama Condé",   heures: 2, classe: "Terminale A", coefficient: 3 },
];

export function Matieres() {
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [matieres, setMatieres] = useState(matieresData);
  const [form, setForm]         = useState({ nom: "", professeur: "", heures: "", classe: "", coefficient: "" });

  const filtered = matieres.filter(m =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    m.professeur.toLowerCase().includes(search.toLowerCase())
  );

  const handleAjouter = () => {
    if (!form.nom || !form.professeur) return;
    setMatieres([...matieres, { id: matieres.length + 1, ...form, heures: parseInt(form.heures), coefficient: parseInt(form.coefficient) }]);
    setForm({ nom: "", professeur: "", heures: "", classe: "", coefficient: "" });
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion des matières</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{matieres.length} matières enregistrées</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a3ed4", color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} /> Ajouter une matière
        </button>
      </div>
      <div style={{ position: "relative", marginBottom: 20 }}>
        <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16 }} />
        <input type="text" placeholder="Rechercher une matière..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }} />
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Matière", "Professeur", "Classe", "H/semaine", "Coefficient"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1a3ed4" }}>{m.nom}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{m.professeur}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{m.classe}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{m.heures}h</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: "#dbeafe", color: "#1e40af" }}>Coef. {m.coefficient}</span>
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
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Ajouter une matière</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}><i className="ti ti-x" /></button>
            </div>
            {[
              { label: "Nom de la matière", key: "nom",         placeholder: "Ex: Mathématiques"      },
              { label: "Professeur",        key: "professeur",  placeholder: "Ex: Dr. Mamadou Diallo" },
              { label: "Classe",            key: "classe",      placeholder: "Ex: Terminale A"        },
              { label: "Heures/semaine",    key: "heures",      placeholder: "Ex: 4"                  },
              { label: "Coefficient",       key: "coefficient", placeholder: "Ex: 3"                  },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }} />
              </div>
            ))}
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
