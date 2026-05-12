import { useState } from "react";

const depensesData = [
  { id: 1,  libelle: "Achat fournitures scolaires",  categorie: "Matériel",    montant: 250000,  date: "03/01/2025", responsable: "Direction" },
  { id: 2,  libelle: "Salaire personnel entretien",  categorie: "Salaires",    montant: 800000,  date: "05/01/2025", responsable: "RH"        },
  { id: 3,  libelle: "Facture électricité",          categorie: "Charges",     montant: 150000,  date: "08/01/2025", responsable: "Direction" },
  { id: 4,  libelle: "Réparation tableau blanc",     categorie: "Matériel",    montant: 75000,   date: "10/01/2025", responsable: "Technique" },
  { id: 5,  libelle: "Achat livres bibliothèque",    categorie: "Pédagogie",   montant: 320000,  date: "12/01/2025", responsable: "Direction" },
  { id: 6,  libelle: "Facture eau",                  categorie: "Charges",     montant: 80000,   date: "15/01/2025", responsable: "Direction" },
  { id: 7,  libelle: "Formation enseignants",        categorie: "Pédagogie",   montant: 500000,  date: "18/01/2025", responsable: "RH"        },
  { id: 8,  libelle: "Entretien bâtiments",          categorie: "Maintenance", montant: 200000,  date: "20/01/2025", responsable: "Technique" },
];

const categorieColors = {
  "Matériel":    { bg: "#dbeafe", color: "#1e40af" },
  "Salaires":    { bg: "#f3e8ff", color: "#6b21a8" },
  "Charges":     { bg: "#fef9c3", color: "#854d0e" },
  "Pédagogie":   { bg: "#dcfce7", color: "#166534" },
  "Maintenance": { bg: "#fee2e2", color: "#991b1b" },
};

export default function Depenses() {
  const [search, setSearch]       = useState("");
  const [filtreCat, setFiltreCat] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [depenses, setDepenses]   = useState(depensesData);
  const [form, setForm]           = useState({ libelle: "", categorie: "Matériel", montant: "", date: "", responsable: "" });

  const categories = ["Tous", ...Object.keys(categorieColors)];
  const total = depenses.reduce((a, d) => a + d.montant, 0);

  const filtered = depenses.filter(d => {
    const matchSearch = d.libelle.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filtreCat === "Tous" || d.categorie === filtreCat;
    return matchSearch && matchCat;
  });

  const handleAjouter = () => {
    if (!form.libelle || !form.montant) return;
    setDepenses([...depenses, {
      id: depenses.length + 1,
      libelle: form.libelle, categorie: form.categorie,
      montant: parseInt(form.montant),
      date: form.date || new Date().toLocaleDateString("fr-FR"),
      responsable: form.responsable,
    }]);
    setForm({ libelle: "", categorie: "Matériel", montant: "", date: "", responsable: "" });
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion des dépenses</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Total : <strong>{total.toLocaleString()} GNF</strong></p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#1a3ed4", color: "#fff", border: "none",
          borderRadius: 9, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer"
        }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} />
          Ajouter une dépense
        </button>
      </div>

      {/* Stats par catégorie */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {Object.entries(categorieColors).map(([cat, style]) => {
          const total = depenses.filter(d => d.categorie === cat).reduce((a, d) => a + d.montant, 0);
          return (
            <div key={cat} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "14px 16px" }}>
              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 500, background: style.bg, color: style.color }}>{cat}</span>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>{total.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>GNF</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16 }} />
          <input type="text" placeholder="Rechercher une dépense..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }} />
        </div>
        <select value={filtreCat} onChange={e => setFiltreCat(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", background: "#fff", cursor: "pointer" }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Libellé", "Catégorie", "Montant", "Date", "Responsable"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{d.libelle}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: categorieColors[d.categorie].bg, color: categorieColors[d.categorie].color }}>{d.categorie}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#dc2626" }}>{d.montant.toLocaleString()} GNF</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{d.date}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{d.responsable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Ajouter une dépense</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}><i className="ti ti-x" /></button>
            </div>
            {[
              { label: "Libellé",      key: "libelle",     placeholder: "Ex: Achat fournitures" },
              { label: "Montant (GNF)",key: "montant",     placeholder: "Ex: 250000"            },
              { label: "Date",         key: "date",        placeholder: "Ex: 01/05/2025"        },
              { label: "Responsable",  key: "responsable", placeholder: "Ex: Direction"         },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Catégorie</label>
              <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif" }}>
                {Object.keys(categorieColors).map(c => <option key={c}>{c}</option>)}
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
