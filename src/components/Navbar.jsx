import { useState, useRef, useEffect } from "react";

const t = {
  bg:"#f7f8fa", surface:"#ffffff", border:"#eaecf0",
  blue:"#2563eb", blueSoft:"#eff6ff", blueMid:"#dbeafe",
  text:"#111827", sub:"#6b7280", muted:"#9ca3af",
  green:"#059669", greenSoft:"#f0fdf4",
  amber:"#d97706", amberSoft:"#fffbeb",
  red:"#dc2626", redSoft:"#fef2f2",
  purple:"#7c3aed", purpleSoft:"#f5f3ff",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── NOTIFS MOCK (partagées avec la page) ──────────────────── */
export const NOTIFS_DATA = [
  {
    id:1, type:"paiement", lu:false, epingle:true,
    titre:"Paiement reçu",
    message:"Aminata Diallo a effectué un paiement de 500 000 GNF pour le T2.",
    heure:"Il y a 5 min", date:"Aujourd'hui", icon:"ti-credit-card", color:"#059669", bg:"#f0fdf4",
  },
  {
    id:2, type:"absence", lu:false, epingle:false,
    titre:"Absence signalée",
    message:"3 élèves de Terminale A sont absents ce matin sans justification.",
    heure:"Il y a 18 min", date:"Aujourd'hui", icon:"ti-calendar-x", color:"#dc2626", bg:"#fef2f2",
  },
  {
    id:3, type:"message", lu:false, epingle:false,
    titre:"Nouveau message",
    message:"Mme Fatoumata Bah vous a envoyé un message concernant les bulletins.",
    heure:"Il y a 42 min", date:"Aujourd'hui", icon:"ti-message-circle", color:"#2563eb", bg:"#eff6ff",
  },
  {
    id:4, type:"system", lu:true, epingle:false,
    titre:"Mise à jour disponible",
    message:"SchoolX v2.5 est disponible avec de nouvelles fonctionnalités.",
    heure:"Il y a 2h", date:"Aujourd'hui", icon:"ti-refresh", color:"#7c3aed", bg:"#f5f3ff",
  },
  {
    id:5, type:"paiement", lu:true, epingle:false,
    titre:"Retard de paiement",
    message:"Ibrahima Sow n'a pas encore réglé les frais du T2. Relance recommandée.",
    heure:"Il y a 3h", date:"Aujourd'hui", icon:"ti-alert-circle", color:"#d97706", bg:"#fffbeb",
  },
  {
    id:6, type:"annonce", lu:true, epingle:false,
    titre:"Annonce publiée",
    message:"Votre annonce « Réunion parents T1 » a été envoyée à 312 parents.",
    heure:"Hier, 16:30", date:"Hier", icon:"ti-speakerphone", color:"#059669", bg:"#f0fdf4",
  },
];

export default function Navbar({ page, onLogout, user }) {
  const [showNotifs,  setShowNotifs]  = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs,      setNotifs]      = useState(NOTIFS_DATA);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const nonLus = notifs.filter(n => !n.lu).length;

  /* ── Fermer au clic extérieur ── */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead  = () => setNotifs(prev => prev.map(n => ({ ...n, lu:true })));
  const markRead     = (id) => setNotifs(prev => prev.map(n => n.id===id ? { ...n, lu:true } : n));
  const deleteNotif  = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  const pageTitle = {
    "Accueil":"Tableau de bord",
    "Gestion des élèves":"Élèves",
    "Gestion des matières":"Matières",
    "Gestion des notes":"Notes",
    "Gestion des emplois":"Emplois du temps",
    "Gestion des professeurs":"Professeurs",
    "Gestion RH":"Ressources humaines",
    "Gestion des paiements":"Paiements",
    "Gestion des dépenses":"Dépenses",
    "Messages":"Messages",
    "Documents":"Documents",
    "Annonces":"Annonces",
    "Notifications":"Notifications",
    "IA":"Assistant IA",
    "Paramètres":"Paramètres",
    "Mon abonnement":"Mon abonnement",
    "Guide d'utilisation":"Guide",
  }[page] || page;

  return (
    <nav style={{
      position:"fixed", top:0, left:240, right:0, height:64,
      background:t.surface, borderBottom:`1px solid ${t.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 28px", zIndex:50, fontFamily:t.font,
      boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <style>{`
        @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bell-shake { 0%,100%{transform:rotate(0)} 20%{transform:rotate(15deg)} 40%{transform:rotate(-12deg)} 60%{transform:rotate(8deg)} 80%{transform:rotate(-5deg)} }
      `}</style>

      {/* Titre page */}
      <div>
        <h2 style={{ fontSize:16, fontWeight:700, margin:0, color:t.text }}>{pageTitle}</h2>
        <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>
          {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
        </div>
      </div>

      {/* Droite */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>

        {/* Barre recherche */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", border:`1px solid ${t.border}`, borderRadius:10, background:t.bg, transition:"all .2s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=t.blueMid}
          onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}
        >
          <i className="ti ti-search" style={{ fontSize:15, color:t.muted }} />
          <input placeholder="Rechercher…" style={{ border:"none", outline:"none", background:"transparent", fontSize:13, fontFamily:t.font, color:t.text, width:160 }} />
        </div>

        {/* ── CLOCHE NOTIFICATIONS ── */}
        <div ref={notifRef} style={{ position:"relative" }}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            style={{
              width:38, height:38, borderRadius:10,
              border:`1px solid ${showNotifs ? t.blueMid : t.border}`,
              background:showNotifs ? t.blueSoft : t.surface,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", position:"relative", transition:"all .2s",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background=t.blueSoft; e.currentTarget.style.borderColor=t.blueMid; }}
            onMouseLeave={e=>{ if(!showNotifs){ e.currentTarget.style.background=t.surface; e.currentTarget.style.borderColor=t.border; } }}
          >
            <i className="ti ti-bell" style={{
              fontSize:18, color:showNotifs?t.blue:t.sub, transition:"color .2s",
              animation:nonLus>0?"bell-shake 1.5s ease 1s":"none",
            }} />

            {/* Badge count */}
            {nonLus > 0 && (
              <div style={{
                position:"absolute", top:-5, right:-5,
                minWidth:18, height:18, borderRadius:99,
                background:t.red, color:"#fff",
                fontSize:10, fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 4px", border:"2px solid #fff",
                boxShadow:"0 1px 4px rgba(220,38,38,0.4)",
              }}>
                {nonLus > 9 ? "9+" : nonLus}
              </div>
            )}
          </button>

          {/* ── DROPDOWN NOTIFICATIONS ── */}
          {showNotifs && (
            <div style={{
              position:"absolute", top:"calc(100% + 10px)", right:0,
              width:380, background:t.surface,
              border:`1px solid ${t.border}`, borderRadius:16,
              boxShadow:"0 12px 40px rgba(0,0,0,0.12)",
              zIndex:200, overflow:"hidden",
              animation:"fadeDown .2s ease",
            }}>
              {/* Header dropdown */}
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:t.text }}>Notifications</div>
                  {nonLus > 0 && <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{nonLus} non lue{nonLus>1?"s":""}</div>}
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {nonLus > 0 && (
                    <button onClick={markAllRead} style={{ fontSize:11, fontWeight:600, color:t.blue, background:t.blueSoft, border:`1px solid ${t.blueMid}`, borderRadius:7, padding:"4px 10px", cursor:"pointer", fontFamily:t.font }}>
                      Tout lire
                    </button>
                  )}
                </div>
              </div>

              {/* Liste */}
              <div style={{ maxHeight:340, overflowY:"auto" }}>
                {notifs.slice(0,5).map(n => (
                  <div key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display:"flex", alignItems:"flex-start", gap:12,
                      padding:"13px 16px", borderBottom:`1px solid ${t.bg}`,
                      background:n.lu ? t.surface : t.blueSoft,
                      cursor:"pointer", transition:"background .15s", position:"relative",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = n.lu ? t.bg : "#e0eeff"}
                    onMouseLeave={e => e.currentTarget.style.background = n.lu ? t.surface : t.blueSoft}
                  >
                    {/* Icône */}
                    <div style={{ width:36, height:36, borderRadius:10, background:n.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={`ti ${n.icon}`} style={{ fontSize:17, color:n.color }} />
                    </div>

                    {/* Contenu */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                        <div style={{ fontSize:12, fontWeight:n.lu?500:700, color:t.text, lineHeight:1.3 }}>{n.titre}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                          {!n.lu && <div style={{ width:7, height:7, borderRadius:"50%", background:t.blue, flexShrink:0 }} />}
                          <button onClick={e=>{ e.stopPropagation(); deleteNotif(n.id); }}
                            style={{ background:"none", border:"none", cursor:"pointer", color:t.muted, padding:2, borderRadius:5, display:"flex", alignItems:"center" }}
                            onMouseEnter={e=>e.currentTarget.style.color=t.red}
                            onMouseLeave={e=>e.currentTarget.style.color=t.muted}
                          >
                            <i className="ti ti-x" style={{ fontSize:13 }} />
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize:11, color:t.muted, marginTop:3, lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize:10, color:t.muted, marginTop:5, fontWeight:500 }}>{n.heure}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ padding:"11px 16px", borderTop:`1px solid ${t.border}`, textAlign:"center" }}>
                <span style={{ fontSize:12, fontWeight:600, color:t.blue, cursor:"pointer" }}>
                  Voir toutes les notifications →
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── PROFIL ── */}
        <div ref={profileRef} style={{ position:"relative" }}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            style={{
              display:"flex", alignItems:"center", gap:9,
              padding:"6px 10px 6px 6px",
              border:`1px solid ${showProfile ? t.blueMid : t.border}`,
              borderRadius:11, background:showProfile ? t.blueSoft : t.surface,
              cursor:"pointer", transition:"all .2s",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background=t.blueSoft; e.currentTarget.style.borderColor=t.blueMid; }}
            onMouseLeave={e=>{ if(!showProfile){ e.currentTarget.style.background=t.surface; e.currentTarget.style.borderColor=t.border; } }}
          >
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#2563eb,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff" }}>
              {user?.nom?.charAt(0) || "A"}
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:12, fontWeight:600, color:t.text, lineHeight:1 }}>{user?.nom || "Administrateur"}</div>
              <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>{user?.role || "Directeur"}</div>
            </div>
            <i className="ti ti-chevron-down" style={{ fontSize:13, color:t.muted }} />
          </button>

          {/* Dropdown profil */}
          {showProfile && (
            <div style={{
              position:"absolute", top:"calc(100% + 10px)", right:0,
              width:200, background:t.surface,
              border:`1px solid ${t.border}`, borderRadius:13,
              boxShadow:"0 12px 40px rgba(0,0,0,0.12)",
              zIndex:200, overflow:"hidden",
              animation:"fadeDown .2s ease",
            }}>
              <div style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}` }}>
                <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{user?.nom || "Administrateur"}</div>
                <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{user?.email || "admin@schoolx.gn"}</div>
              </div>
              {[
                { icon:"ti-user",         label:"Mon profil"    },
                { icon:"ti-settings",     label:"Paramètres"    },
                { icon:"ti-help-circle",  label:"Aide"          },
              ].map(item => (
                <button key={item.label} style={{ width:"100%", padding:"10px 14px", border:"none", background:"transparent", fontSize:13, fontFamily:t.font, color:t.text, display:"flex", alignItems:"center", gap:10, cursor:"pointer", transition:"background .12s", textAlign:"left" }}
                  onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <i className={`ti ${item.icon}`} style={{ fontSize:15, color:t.muted }} />
                  {item.label}
                </button>
              ))}
              <div style={{ borderTop:`1px solid ${t.border}` }}>
                <button onClick={onLogout} style={{ width:"100%", padding:"10px 14px", border:"none", background:"transparent", fontSize:13, fontFamily:t.font, color:t.red, display:"flex", alignItems:"center", gap:10, cursor:"pointer", transition:"background .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=t.redSoft}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <i className="ti ti-logout" style={{ fontSize:15 }} />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}