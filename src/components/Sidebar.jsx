import { useState } from "react";

const menuGroups = [
  {
    group: "Général",
    items: [
      { label: "Tableau de bord",         icon: "ti-layout-dashboard"           },
    ],
  },
  {
    group: "Académique",
    items: [
      { label: "Gestion des élèves",      icon: "ti-users"          },
      { label: "Gestion des matières",    icon: "ti-book"           },
      { label: "Gestion des notes",       icon: "ti-clipboard-list" },
      { label: "Gestion des emplois",     icon: "ti-calendar"       },
      { label: "Gestion des professeurs", icon: "ti-school"         },
    ],
  },
  {
    group: "Administration",
    items: [
      { label: "Gestion RH",             icon: "ti-briefcase"  },
      { label: "Gestion des paiements",  icon: "ti-credit-card"},
      { label: "Gestion des dépenses",   icon: "ti-chart-pie"  },
      { label: "Documents",              icon: "ti-file-text"  },
    ],
  },
  {
    group: "Communication",
    items: [
      { label: "Notifications",          icon: "ti-bell"        },
      { label: "Messages",               icon: "ti-message"     },
      { label: "Annonces",               icon: "ti-speakerphone"},
    ],
  },
  {
    group: "IA SchoolX",
    items: [
      { label: "IA",                     icon: "ti-sparkles"   },
    ],
  },
];

const bottomItems = [
  { label: "Paramètres",         icon: "ti-settings"       },
  { label: "Mon abonnement",     icon: "ti-crown"          },
  { label: "Guide d'utilisation",icon: "ti-help-circle"    },
];

export default function Sidebar({ onNavigate, activePage }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered,   setHovered]   = useState(null);

  const W = collapsed ? 64 : 240;

  const NavItem = ({ label, icon }) => {
    const isActive = activePage === label;
    const isHov    = hovered === label;
    return (
      <button
        onClick={() => onNavigate(label)}
        onMouseEnter={() => setHovered(label)}
        onMouseLeave={() => setHovered(null)}
        title={collapsed ? label : ""}
        style={{
          display:"flex", alignItems:"center",
          gap:10, width:"100%",
          padding: collapsed ? "9px 0" : "8px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          border:"none", borderRadius:8, cursor:"pointer",
          fontFamily:"'Inter',sans-serif",
          transition:"all .15s",
          position:"relative",
          background: isActive
            ? "rgba(255,255,255,0.15)"
            : isHov
            ? "rgba(255,255,255,0.08)"
            : "transparent",
        }}
      >
        {/* Barre active */}
        {isActive && (
          <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:18, borderRadius:4, background:"#fff" }} />
        )}

        <i className={`ti ${icon}`} style={{
          fontSize:17, flexShrink:0,
          color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
          transition:"color .15s",
        }} />

        {!collapsed && (
          <span style={{
            fontSize:13, fontWeight: isActive ? 600 : 400,
            color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
            transition:"all .15s", flex:1, textAlign:"left",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
          }}>
            {label}
          </span>
        )}
      </button>
    );
  };

  const GroupLabel = ({ label }) => (
    !collapsed ? (
      <div style={{
        fontSize:10, fontWeight:700,
        color:"rgba(255,255,255,0.35)",
        textTransform:"uppercase", letterSpacing:"1px",
        padding:"4px 10px 6px",
        marginTop:6,
      }}>
        {label}
      </div>
    ) : (
      <div style={{ height:1, background:"rgba(255,255,255,0.1)", margin:"10px 8px 6px" }} />
    )
  );

  return (
    <aside style={{
      position:"fixed", top:0, left:0,
      height:"100vh", width:W,
      background:"linear-gradient(180deg,#1a3ed4 0%,#1230a8 60%,#0f2490 100%)",
      display:"flex", flexDirection:"column",
      padding:"0 8px 12px",
      transition:"width 0.2s cubic-bezier(.4,0,.2,1)",
      overflow:"hidden", zIndex:100,
      boxShadow:"4px 0 20px rgba(26,62,212,0.2)",
      fontFamily:"'Inter',sans-serif",
    }}>

      {/* Décoration */}
      <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />

      {/* ── LOGO ── */}
      <div style={{
        display:"flex", alignItems:"center",
        gap:10, padding: collapsed ? "20px 0 16px" : "20px 6px 16px",
        borderBottom:"1px solid rgba(255,255,255,0.1)",
        marginBottom:8, justifyContent: collapsed ? "center" : "flex-start",
      }}>
        <div style={{
          width:32, height:32, borderRadius:9, flexShrink:0,
          background:"rgba(255,255,255,0.18)",
          border:"1px solid rgba(255,255,255,0.25)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:15, fontWeight:800, color:"#fff",
        }}>S</div>
        {!collapsed && (
          <span style={{ fontSize:16, fontWeight:700, color:"#fff", letterSpacing:"-0.2px", whiteSpace:"nowrap" }}>
            School<span style={{ color:"rgba(255,255,255,0.5)" }}>X</span>
          </span>
        )}
      </div>

      {/* ── NAV PRINCIPALE ── */}
      <nav style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", display:"flex", flexDirection:"column" }}>
        <style>{`.sidebar-nav::-webkit-scrollbar{display:none}`}</style>

        {menuGroups.map((grp) => (
          <div key={grp.group}>
            <GroupLabel label={grp.group} />
            {grp.items.map(({ label, icon }) => (
              <NavItem key={label} label={label} icon={icon} />
            ))}
          </div>
        ))}
      </nav>

      {/* ── SÉPARATEUR ── */}
      <div style={{ height:1, background:"rgba(255,255,255,0.1)", margin:"8px 2px" }} />

      {/* ── CONFIGURATION (bas) ── */}
      <div>
        {!collapsed && (
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1px", padding:"2px 10px 6px" }}>
            Configuration
          </div>
        )}
        {collapsed && <div style={{ height:6 }} />}
        {bottomItems.map(({ label, icon }) => (
          <NavItem key={label} label={label} icon={icon} />
        ))}
      </div>

      {/* ── PROFIL ── */}
      {!collapsed && (
        <div style={{
          margin:"10px 0 8px",
          background:"rgba(255,255,255,0.08)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:10, padding:"10px 12px",
          display:"flex", alignItems:"center", gap:9,
        }}>
          <div style={{
            width:30, height:30, borderRadius:"50%",
            background:"rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:700, color:"#fff", flexShrink:0,
          }}>AD</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Administrateur</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:1 }}>Directeur</div>
          </div>
          <i className="ti ti-logout" style={{ fontSize:15, color:"rgba(255,255,255,0.35)", cursor:"pointer" }} />
        </div>
      )}

      {/* ── TOGGLE ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"8px", border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:8, background:"rgba(255,255,255,0.06)",
          color:"rgba(255,255,255,0.5)", cursor:"pointer",
          transition:"all .15s", fontFamily:"'Inter',sans-serif",
        }}
        onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.color="#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}
      >
        <i className={`ti ${collapsed ? "ti-chevron-right" : "ti-chevron-left"}`} style={{ fontSize:14 }} />
      </button>
    </aside>
  );
}
