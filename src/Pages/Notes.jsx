import { useState } from "react";

const notesData = [
  { id: 1,  eleve: "Aminata Diallo",   classe: "Terminale A", matiere: "Mathématiques",  note: 16, appreciation: "Très bien" },
  { id: 2,  eleve: "Mamadou Bah",      classe: "3ème B",      matiere: "Français",        note: 12, appreciation: "Assez bien" },
  { id: 3,  eleve: "Fatoumata Camara", classe: "Seconde C",   matiere: "Physique-Chimie", note: 14, appreciation: "Bien" },
  { id: 4,  eleve: "Ibrahima Sow",     classe: "Terminale D", matiere: "Histoire-Géo",    note: 8,  appreciation: "Insuffisant" },
  { id: 5,  eleve: "Mariama Kouyaté",  classe: "1ère S",      matiere: "SVT",             note: 18, appreciation: "Excellent" },
  { id: 6,  eleve: "Ousmane Traoré",   classe: "6ème A",      matiere: "Mathématiques",   note: 11, appreciation: "Passable" },
  { id: 7,  eleve: "Kadiatou Barry",   classe: "5ème B",      matiere: "Anglais",         note: 15, appreciation: "Bien" },
  { id: 8,  eleve: "Sekou Condé",      classe: "4ème C",      matiere: "Informatique",    note: 17, appreciation: "Très bien" },
  { id: 9,  eleve: "Aïssatou Diallo",  classe: "Terminale S", matiere: "Philosophie",     note: 13, appreciation: "Assez bien" },
  { id: 10, eleve: "Moussa Keita",     classe: "2nde A",      matiere: "Français",        note: 9,  appreciation: "Insuffisant" },
];

const getNoteStyle = (note) => {
  if (note >= 16) return { bg: "#dcfce7", color: "#166534" };
  if (note >= 12) return { bg: "#dbeafe", color: "#1e40af" };
  if (note >= 10) return { bg: "#fef9c3", color: "#854d0e" };
  return { bg: "#fee2e2", color: "#991b1b" };
};

export default function Notes() {
  const [search, setSearch]   = useState("");
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes]     = useState(notesData);
  const [form, setForm]       = useState({ eleve: "", classe: "", matiere: "", note: "" });

  const filtered = notes.filter(n =>
    n.eleve.toLowerCase().includes(search.toLowerCase()) ||
    n.matiere.toLowerCase().includes(search.toLowerCase())
  );

  const getAppreciation = (note) => {
    if (note >= 16) return "Excellent";
    if (note >= 14) return "Très bien";
    if (note >= 12) return "Bien";
    if (note >= 10) return "Assez bien";
    if (note >= 8)  return "Passable";
    return "Insuffisant";
  };

  const handleAjouter = () => {
    if (!form.eleve || !form.matiere || !form.note) return;
    const n = parseFloat(form.note);
    setNotes([...notes, {
      id: notes.length + 1,
      eleve: form.eleve, classe: form.classe,
      matiere: form.matiere, note: n,
      appreciation: getAppreciation(n),
    }]);
    setForm({ eleve: "", classe: "", matiere: "", note: "" });
    setShowModal(false);
  };

  const moyenne = (notes.reduce((acc, n) => acc + n.note, 0) / notes.length).toFixed(2);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion des notes</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Moyenne générale : <strong>{moyenne}/20</strong></p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#1a3ed4", color: "#fff", border: "none",
          borderRadius: 9, padding: "10px 18px", fontSize: 13,
          fontWeight: 600, cursor: "pointer"
        }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} />
          Ajouter une note
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16 }} />
        <input
          type="text" placeholder="Rechercher par élève ou matière..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }}
        />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Élève", "Classe", "Matière", "Note", "Appréciation"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((n, i) => (
              <tr key={n.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{n.eleve}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{n.classe}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{n.matiere}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: getNoteStyle(n.note).color
                  }}>{n.note}/20</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500,
                    background: getNoteStyle(n.note).bg, color: getNoteStyle(n.note).color
                  }}>{n.appreciation}</span>
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
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Ajouter une note</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}><i className="ti ti-x" /></button>
            </div>
            {[
              { label: "Nom de l'élève", key: "eleve",   placeholder: "Ex: Aminata Diallo"  },
              { label: "Classe",         key: "classe",  placeholder: "Ex: Terminale A"     },
              { label: "Matière",        key: "matiere", placeholder: "Ex: Mathématiques"   },
              { label: "Note (/20)",     key: "note",    placeholder: "Ex: 15"              },
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
