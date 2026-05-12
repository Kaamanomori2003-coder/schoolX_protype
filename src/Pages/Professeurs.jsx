import { useState } from "react";

const professeursData = [
  { id: 1,  nom: "Dr. Mamadou Diallo",    matiere: "Mathématiques",  telephone: "621 11 22 33", email: "m.diallo@schoolx.gn",    status: "Actif",   initials: "MD", color: "#dbeafe", textColor: "#1e40af" },
  { id: 2,  nom: "Mme Fatoumata Bah",     matiere: "Français",       telephone: "622 22 33 44", email: "f.bah@schoolx.gn",       status: "Actif",   initials: "FB", color: "#dcfce7", textColor: "#166534" },
  { id: 3,  nom: "M. Ibrahima Camara",    matiere: "Histoire-Géo",   telephone: "623 33 44 55", email: "i.camara@schoolx.gn",    status: "Actif",   initials: "IC", color: "#fef9c3", textColor: "#854d0e" },
  { id: 4,  nom: "Mme Aïssatou Sow",      matiere: "Anglais",        telephone: "624 44 55 66", email: "a.sow@schoolx.gn",       status: "Inactif", initials: "AS", color: "#fee2e2", textColor: "#991b1b" },
  { id: 5,  nom: "M. Ousmane Kouyaté",    matiere: "Physique-Chimie",telephone: "625 55 66 77", email: "o.kouyate@schoolx.gn",   status: "Actif",   initials: "OK", color: "#f3e8ff", textColor: "#6b21a8" },
  { id: 6,  nom: "Mme Kadiatou Traoré",   matiere: "SVT",            telephone: "626 66 77 88", email: "k.traore@schoolx.gn",    status: "Actif",   initials: "KT", color: "#dbeafe", textColor: "#1e40af" },
  { id: 7,  nom: "M. Sekou Barry",        matiere: "Informatique",   telephone: "627 77 88 99", email: "s.barry@schoolx.gn",     status: "Actif",   initials: "SB", color: "#dcfce7", textColor: "#166534" },
  { id: 8,  nom: "Mme Mariama Condé",     matiere: "Philosophie",    telephone: "628 88 99 00", email: "m.conde@schoolx.gn",     status: "Actif",   initials: "MC", color: "#fef9c3", textColor: "#854d0e" },
];

const statusStyle = {
  "Actif":   { bg: "#dcfce7", color: "#166534" },
  "Inactif": { bg: "#fee2e2", color: "#991b1b" },
};

export default function Professeurs() {
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [professeurs, setProfesseurs] = useState(professeursData);
  const [form, setForm] = useState({ nom: "", matiere: "", telephone: "", email: "" });

  const filtered = professeurs.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.matiere.toLowerCase().includes(search.toLowerCase())
  );

  const handleAjouter = () => {
    if (!form.nom || !form.matiere) return;
    const initials = form.nom.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const colors = [
      { color: "#dbeafe", textColor: "#1e40af" },
      { color: "#dcfce7", textColor: "#166534" },
      { color: "#fef9c3", textColor: "#854d0e" },
      { color: "#f3e8ff", textColor: "#6b21a8" },
    ];
    const c = colors[professeurs.length % colors.length];
    setProfesseurs([...professeurs, {
      id: professeurs.length + 1,
      nom: form.nom, matiere: form.matiere,
      telephone: form.telephone, email: form.email,
      status: "Actif", initials, ...c,
    }]);
    setForm({ nom: "", matiere: "", telephone: "", email: "" });
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion des professeurs</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{professeurs.length} professeurs enregistrés</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#1a3ed4", color: "#fff", border: "none",
          borderRadius: 9, padding: "10px 18px", fontSize: 13,
          fontWeight: 600, cursor: "pointer"
        }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} />
          Ajouter un professeur
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <i className="ti ti-search" style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16
        }} />
        <input
          type="text"
          placeholder="Rechercher par nom ou matière..."
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

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Professeur", "Matière", "Téléphone", "Email", "Statut"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px", textAlign: "left",
                  fontSize: 12, fontWeight: 600, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.5px"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: p.color, color: p.textColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, flexShrink: 0
                    }}>{p.initials}</div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{p.nom}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{p.matiere}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{p.telephone}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#334155" }}>{p.email}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500,
                    background: statusStyle[p.status].bg, color: statusStyle[p.status].color
                  }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Ajouter un professeur</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}>
                <i className="ti ti-x" />
              </button>
            </div>
            {[
              { label: "Nom complet", key: "nom",       placeholder: "Ex: Dr. Mamadou Diallo" },
              { label: "Matière",     key: "matiere",   placeholder: "Ex: Mathématiques"      },
              { label: "Téléphone",   key: "telephone", placeholder: "Ex: 621 00 11 22"       },
              { label: "Email",       key: "email",     placeholder: "Ex: prof@schoolx.gn"    },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>{f.label}</label>
                <input
                  type="text" placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }}
                />
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
