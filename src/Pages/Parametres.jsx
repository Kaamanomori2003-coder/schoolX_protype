import { useState } from "react";

export default function Parametres() {
  const [form, setForm] = useState({
    nomEcole:    "SchoolX",
    adresse:     "Conakry, Guinée",
    telephone:   "622 00 00 00",
    email:       "contact@schoolx.gn",
    anneeScolaire: "2024/2025",
    devise:      "GNF",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Paramètres</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Configuration générale de SchoolX</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Infos école */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ti ti-school" style={{ color: "#1a3ed4", fontSize: 18 }} />
            Informations de l'école
          </div>
          {[
            { label: "Nom de l'école",   key: "nomEcole"      },
            { label: "Adresse",          key: "adresse"       },
            { label: "Téléphone",        key: "telephone"     },
            { label: "Email",            key: "email"         },
            { label: "Année scolaire",   key: "anneeScolaire" },
            { label: "Devise",           key: "devise"        },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{f.label}</label>
              <input
                type="text" value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }}
              />
            </div>
          ))}
          <button onClick={handleSave} style={{
            width: "100%", padding: 11, border: "none",
            borderRadius: 9, background: saved ? "#16a34a" : "#1a3ed4",
            color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background 0.3s"
          }}>
            <i className={`ti ${saved ? "ti-check" : "ti-device-floppy"}`} style={{ fontSize: 16 }} />
            {saved ? "Enregistré !" : "Enregistrer les modifications"}
          </button>
        </div>

        {/* Aperçu */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-eye" style={{ color: "#1a3ed4", fontSize: 18 }} />
              Aperçu
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "#f8fafc", borderRadius: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "#1a3ed4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 800 }}>S</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{form.nomEcole}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{form.adresse}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{form.email}</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-info-circle" style={{ color: "#1a3ed4", fontSize: 18 }} />
              À propos
            </div>
            {[
              { label: "Version",     value: "1.0.0"                },
              { label: "Développé par", value: "SchoolX Team"       },
              { label: "Technologie", value: "React + Vite"         },
              { label: "Concours",    value: "Prototype 2025"       },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
