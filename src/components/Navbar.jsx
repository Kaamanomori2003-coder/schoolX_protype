import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, PAGE_META, DEFAULT_META } from "../context/NotificationsContext";

export default function Navbar({ page, collapsed, onNavigate , trimestre, setTrimestre }) {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();
  const { notifications, markAsRead, markAllRead, unreadCount } = useNotifications();

  useEffect(() => {
    const h = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleNotifClick = (n) => {
    markAsRead(n.id);
    onNavigate(n.source);
    setShowNotif(false);
  };

  return (
    <header style={{
      position: "fixed",
      top: 12,
      left: collapsed ? "90px" : "271px",
      right: "32px",
      height: 64,
      background: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      zIndex: 99,
      boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      fontFamily: "'Outfit', sans-serif",
      transition: "left 0.2s cubic-bezier(.4,0,.2,1)",
    }}>

      {/* Titre page courante */}
      {/* Titre page courante */}
<div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>
  {page || "Tableau de bord"}
</div>



{/* Centre — barre de recherche */}

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

      {/* École + Trimestre */}
      <div style={{ display: "flex", gap: 20}}>
        <div style={{ width: 1, height: 28, background: "#e2e8f0" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <i className="ti ti-school" style={{ fontSize: 19, color: "#3b82f6" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>Lycée Donka</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.2 }}>Conakry, Guinée</div>
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: "#e2e8f0" }} />

        <div style={{ whiteSpace: "nowrap" }}>
          <select
            value={trimestre}
            onChange={e => setTrimestre(e.target.value)}
            style={{ border: "none", outline: "none", fontWeight: 700, fontSize: 13, background: "transparent", color: "#1e293b", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
          >
            <option value="T1">Trimestre 1</option>
            <option value="T2">Trimestre 2</option>
            <option value="T3">Trimestre 3</option>
          </select>
          <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.2 }}>Année 2025-2026</div>
        </div>
      </div>

      {/* Droite — notifications + profil */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {/* Cloche notification */}
       {/* Cloche notification */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button onClick={() => setShowNotif(v => !v)} style={{
            width: 38, height: 38, borderRadius: 10,
            border: "1px solid #e2e8f0", background: "#f8fafc",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#64748b"
          }}>
            <i className="ti ti-bell" style={{ fontSize: 18 }} />
          </button>
          {unreadCount > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4,
              width: 16, height: 16, borderRadius: "50%",
              background: "#ef4444", color: "#fff",
              fontSize: 9, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #fff"
            }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
                  width: 340, maxHeight: 420, overflowY: "auto",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)", zIndex: 200,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{ background: "none", border: "none", fontSize: 12, color: "#2563eb", cursor: "pointer", fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
                      Tout marquer comme lu
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                    Aucune notification
                  </div>
                ) : (
                  Object.entries(
                    notifications.reduce((acc, n) => { (acc[n.source] = acc[n.source] || []).push(n); return acc; }, {})
                  ).map(([source, items]) => {
                    const meta = PAGE_META[source] || DEFAULT_META;
                    return (
                      <div key={source}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fafbfc" }}>
                          <i className={`ti ${meta.icon}`} style={{ fontSize: 13, color: meta.c }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: meta.c, textTransform: "uppercase", letterSpacing: ".4px" }}>{source}</span>
                        </div>
                        {items.map(n => (
                          <button key={n.id} onClick={() => handleNotifClick(n)} style={{
                            display: "flex", gap: 10, width: "100%", padding: "10px 16px",
                            border: "none", background: n.lu ? "#fff" : "#f8fafc", cursor: "pointer",
                            textAlign: "left", borderBottom: "1px solid #f8fafc", fontFamily: "'Outfit', sans-serif",
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: n.lu ? "transparent" : "#2563eb", marginTop: 6, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: n.lu ? 500 : 700, color: "#1e293b" }}>{n.titre}</div>
                              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{n.message}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{n.date}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
