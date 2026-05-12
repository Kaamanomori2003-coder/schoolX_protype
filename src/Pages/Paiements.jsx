import { useState } from "react";

const paiementsData = [
  { id: 1,  eleve: "Aminata Diallo",   classe: "Terminale A", montant: 500000, date: "02/01/2025", mode: "Espèces",  status: "Payé"       },
  { id: 2,  eleve: "Mamadou Bah",      classe: "3ème B",      montant: 400000, date: "05/01/2025", mode: "Mobile",   status: "En attente" },
  { id: 3,  eleve: "Fatoumata Camara", classe: "Seconde C",   montant: 450000, date: "08/01/2025", mode: "Espèces",  status: "Payé"       },
  { id: 4,  eleve: "Ibrahima Sow",     classe: "Terminale D", montant: 500000, date: "10/01/2025", mode: "Virement", status: "Impayé"     },
  { id: 5,  eleve: "Mariama Kouyaté",  classe: "1ère S",      montant: 450000, date: "12/01/2025", mode: "Mobile",   status: "Payé"       },
  { id: 6,  eleve: "Ousmane Traoré",   classe: "6ème A",      montant: 350000, date: "15/01/2025", mode: "Espèces",  status: "Payé"       },
  { id: 7,  eleve: "Kadiatou Barry",   classe: "5ème B",      montant: 375000, date: "18/01/2025", mode: "Mobile",   status: "En attente" },
  { id: 8,  eleve: "Sekou Condé",      classe: "4ème C",      montant: 380000, date: "20/01/2025", mode: "Espèces",  status: "Impayé"     },
];

const statusStyle = {
  "Payé":       { bg: "#dcfce7", color: "#166534" },
  "En attente": { bg: "#fef9c3", color: "#854d0e" },
  "Impayé":     { bg: "#fee2e2", color: "#991b1b" },
};

export default function Paiements() {
  const [search, setSearch]     = useState("");
  const [filtre, setFiltre]     = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [paiements, setPaiements] = useState(paiementsData);
  const [form, setForm]         = useState({ eleve: "", classe: "", montant: "", mode: "Espèces", date: "" });

  const totalPaye    = paiements.filter(p => p.status === "Payé").reduce((a, p) => a + p.montant, 0);
  const totalImpaye  = paiements.filter(p => p.status === "Impayé").reduce((a, p) => a + p.montant, 0);
  const totalAttente = paiements.filter(p => p.status === "En attente").reduce((a, p) => a + p.montant, 0);

  const filtered = paiements.filter(p => {
    const matchSearch = p.eleve.toLowerCase().includes(search.toLowerCase());
    const matchFiltre = filtre === "Tous" || p.status === filtre;
    return matchSearch && matchFiltre;
  });

  const handleAjouter = () => {
    if (!form.eleve || !form.montant) return;
    setPaiements([...paiements, {
      id: paiements.length + 1,
      eleve: form.eleve, classe: form.classe,
      montant: parseInt(form.montant),
      date: form.date || new Date().toLocaleDateString("fr-FR"),
      mode: form.mode, status: "En attente",
    }]);
    setForm({ eleve: "", classe: "", montant: "", mode: "Espèces", date: "" });
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion des paiements</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{paiements.length} paiements enregistrés</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#1a3ed4", color: "#fff", border: "none",
          borderRadius: 9, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer"
        }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} />
          Nouveau paiement
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total encaissé",    value: totalPaye,    color: "#dcfce7", textColor: "#166534", icon: "ti-circle-check" },
          { label: "En attente",        value: totalAttente, color: "#fef9c3", textColor: "#854d0e", icon: "ti-clock"        },
          { label: "Impayés",           value: totalImpaye,  color: "#fee2e2", textColor: "#991b1b", icon: "ti-alert-circle" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.textColor }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{s.value.toLocaleString()} GNF</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16 }} />
          <input type="text" placeholder="Rechercher un élève..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }} />
        </div>
        <select value={filtre} onChange={e => setFiltre(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", background: "#fff", cursor: "pointer" }}>
          {["Tous", "Payé", "En attente", "Impayé"].map(f => <option key={f}>{f}</option>)}
        </select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Élève", "Classe", "Montant", "Date", "Mode", "Statut"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{p.eleve}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{p.classe}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1a3ed4" }}>{p.montant.toLocaleString()} GNF</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{p.date}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{p.mode}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: statusStyle[p.status].bg, color: statusStyle[p.status].color }}>{p.status}</span>
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
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Nouveau paiement</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}><i className="ti ti-x" /></button>
            </div>
            {[
              { label: "Nom de l'élève", key: "eleve",   placeholder: "Ex: Aminata Diallo" },
              { label: "Classe",         key: "classe",  placeholder: "Ex: Terminale A"    },
              { label: "Montant (GNF)",  key: "montant", placeholder: "Ex: 500000"         },
              { label: "Date",           key: "date",    placeholder: "Ex: 01/05/2025"     },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Mode de paiement</label>
              <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif" }}>
                {["Espèces", "Mobile", "Virement"].map(m => <option key={m}>{m}</option>)}
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
