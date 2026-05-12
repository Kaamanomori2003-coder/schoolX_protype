import { useState } from "react";
import "./Sidebar.css";

const menuItems = [
  { label: "Accueil",                 icon: "ti-home"             },
  { label: "Gestion des élèves",      icon: "ti-users"            },
  { label: "Gestion des matières",    icon: "ti-book"             },
  { label: "Gestion des emplois",     icon: "ti-calendar"         },
  { label: "Gestion des professeurs", icon: "ti-school"           },
  { label: "Gestion des notes",       icon: "ti-clipboard-list"   },
  { label: "Gestion des paiements",   icon: "ti-credit-card"      },
  { label: "Gestion RH",              icon: "ti-briefcase"        },
  { label: "Gestion des dépenses",    icon: "ti-chart-pie"        },
  { label: "IA",                      icon: "ti-sparkles"         },
  { label: "Paramètres",              icon: "ti-settings"         },
];

export default function Sidebar({ onNavigate, activePage }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">S</div>
        {!collapsed && <span className="sidebar__logo-text">SchoolX</span>}
      </div>

      <nav className="sidebar__nav">
        {menuItems.map(({ label, icon }) => (
          <button
            key={label}
            className={`sidebar__item ${activePage === label ? "sidebar__item--active" : ""}`}
            onClick={() => onNavigate(label)}
            title={collapsed ? label : ""}
          >
            <i className={`ti ${icon}`} aria-hidden="true" />
            {!collapsed && <span className="sidebar__label">{label}</span>}
          </button>
        ))}
      </nav>

      <button
        className="sidebar__toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className={`ti ${collapsed ? "ti-chevron-right" : "ti-chevron-left"}`} />
      </button>
    </aside>
  );
}