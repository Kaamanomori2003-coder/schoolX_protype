import { useState } from "react";

// ── AUTH ──────────────────────────────────────────────────────
import Login    from "./auth/Login";
import Register from "./auth/Register";

// ── LAYOUT ───────────────────────────────────────────────────
import Sidebar from "./components/Sidebar";
import Navbar  from "./components/Navbar";

// ── PAGES ────────────────────────────────────────────────────
import Dashboard  from "./Pages/Dashboard";
import Eleves     from "./Pages/Eleves";
import Professeurs from "./Pages/Professeurs";
import Notes      from "./Pages/Notes";
import Paiements  from "./Pages/Paiements";
import Depenses   from "./Pages/Depenses";
import { Matieres } from "./Pages/Matieres";
import RH         from "./Pages/RH";
import Emplois    from "./Pages/Emplois";
import Parametres from "./Pages/Parametres";
import IA         from "./Pages/IA";
import Message    from "./Pages/Message";
import Document   from "./Pages/Document";
import Annonces   from "./Pages/Annonces";
import Abonnement from "./Pages/Abonnement";

export default function App() {
  // "login" | "register" | "app"
  const [authState, setAuthState] = useState("login");
  const [user,      setUser]      = useState(null);
  const [page,      setPage]      = useState("Accueil");

  // ── Connexion réussie ─────────────────────────────────────
  const handleLogin = (userData) => {
    setUser(userData);
    setAuthState("app");
    setPage("Tableau de bord");
  };

  // ── Inscription réussie → retour login ───────────────────
  const handleRegisterSuccess = () => {
    setAuthState("login");
  };

  // ── Déconnexion ───────────────────────────────────────────
  const handleLogout = () => {
    setUser(null);
    setAuthState("login");
    setPage("Accueil");
  };

  // ══════════════════════════════════════════════════════════
  // PAGE DE CONNEXION
  // ══════════════════════════════════════════════════════════
  if (authState === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setAuthState("register")}
      />
    );
  }

  // ══════════════════════════════════════════════════════════
  // PAGE D'INSCRIPTION
  // ══════════════════════════════════════════════════════════
  if (authState === "register") {
    return (
      <Register
        onSuccess={handleRegisterSuccess}
        onBack={() => setAuthState("login")}
      />
    );
  }

  // ══════════════════════════════════════════════════════════
  // APPLICATION PRINCIPALE (utilisateur connecté)
  // ══════════════════════════════════════════════════════════
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f7f8fa" }}>

      <Sidebar
        onNavigate={setPage}
        activePage={page}
        onLogout={handleLogout}
        user={user}
      />

      <Navbar
        page={page}
        onLogout={handleLogout}
        user={user}
      />

      <main style={{
        marginLeft: "240px",
        marginTop:  "64px",
        flex:        1,
        padding:    "28px 32px",
        fontFamily: "'Inter', sans-serif",
        minHeight:  "calc(100vh - 64px)",
        boxSizing:  "border-box",
      }}>
        {page === "Tableau de bord"                 && <Dashboard />}
        {page === "Gestion des élèves"      && <Eleves />}
        {page === "Gestion des matières"    && <Matieres />}
        {page === "Gestion des notes"       && <Notes />}
        {page === "Gestion des emplois"     && <Emplois />}
        {page === "Gestion des professeurs" && <Professeurs />}
        {page === "Gestion RH"              && <RH />}
        {page === "Gestion des paiements"   && <Paiements />}
        {page === "Gestion des dépenses"    && <Depenses />}
        {page === "IA"                      && <IA />}
        {page === "Paramètres"              && <Parametres />}
        {page === "Messages"                && <Message />}
        {page === "Documents"               && <Document />}
        {page === "Annonces"                && <Annonces />}
        {page === "Mon abonnement"          && <Abonnement />}
        {page === "Notifications"           && (
          <div style={{ padding:40, textAlign:"center", color:"#9ca3af", fontSize:14 }}>
            <i className="ti ti-bell" style={{ fontSize:40, display:"block", marginBottom:12, color:"#e5e7eb" }} />
            Page Notifications — bientôt disponible
          </div>
        )}
        {page === "Guide d'utilisation"     && (
          <div style={{ padding:40, textAlign:"center", color:"#9ca3af", fontSize:14 }}>
            <i className="ti ti-help-circle" style={{ fontSize:40, display:"block", marginBottom:12, color:"#e5e7eb" }} />
            Guide d'utilisation — bientôt disponible
          </div>
        )}
      </main>
    </div>
  );
}
