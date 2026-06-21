import { useState } from "react";
export default function Navbar({ page }) {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: "250px",
      right: 0,
      height: 64,
      background: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      zIndex: 99,
      boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      fontFamily: "'Outfit', sans-serif",
    }}>

      {/* Titre page courante */}
      <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
        {page || "Tableau de bord"}
      </div>

      {/* Centre — barre de recherche */}
      <div style={{ position: "relative", width: 320 }}>
        <i className="ti ti-search" style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16
        }} />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 14px 9px 36px",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            fontSize: 13,
            outline: "none",
            background: "#f8fafc",
            color: "#0f172a",
            fontFamily: "'Outfit', sans-serif",
            boxSizing: "border-box",
            transition: "border 0.2s",
          }}
          onFocus={e => e.target.style.border = "1px solid #1a3ed4"}
          onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
        />
      </div>

      {/* Droite — notifications + profil */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {/* Cloche notification */}
        <div style={{ position: "relative" }}>
          <button style={{
            width: 38, height: 38, borderRadius: 10,
            border: "1px solid #e2e8f0", background: "#f8fafc",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#64748b"
          }}>
            <i className="ti ti-bell" style={{ fontSize: 18 }} />
          </button>
          {/* Badge rouge */}
          <span style={{
            position: "absolute", top: -4, right: -4,
            width: 16, height: 16, borderRadius: "50%",
            background: "#ef4444", color: "#fff",
            fontSize: 9, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff"
          }}>3</span>
        </div>

        {/* Bouton connexion / profil */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "7px 14px 7px 8px",
              background: "#1a3ed4", border: "none",
              borderRadius: 10, cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff"
            }}>AD</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>Admin</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.2 }}>Directeur</div>
            </div>
            <i className="ti ti-chevron-down" style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }} />
          </button>

          {/* Menu déroulant */}
          {showMenu && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 12, padding: 8, minWidth: 180,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)", zIndex: 200
            }}>
              {[
                { icon: "ti-user",        label: "Mon profil"     },
                { icon: "ti-settings",    label: "Paramètres"     },
                { icon: "ti-help-circle", label: "Aide"           },
              ].map(item => (
                <button key={item.label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "9px 12px",
                  border: "none", background: "transparent",
                  borderRadius: 8, cursor: "pointer",
                  fontSize: 13, color: "#334155",
                  fontFamily: "'Outfit', sans-serif",
                  textAlign: "left"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <i className={`ti ${item.icon}`} style={{ fontSize: 16, color: "#64748b" }} />
                  {item.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid #f1f5f9", margin: "6px 0" }} />
              <button style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "9px 12px",
                border: "none", background: "transparent",
                borderRadius: 8, cursor: "pointer",
                fontSize: 13, color: "#ef4444",
                fontFamily: "'Outfit', sans-serif",
                textAlign: "left"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <i className="ti ti-logout" style={{ fontSize: 16 }} />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
