import { useState } from "react";

// ── AUTH ──────────────────────────────────────────────────────
import Login from "./auth/Login";
import Register from "./auth/Register";

// ── LAYOUT ────────────────────────────────────────────────────
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// ── PAGES ─────────────────────────────────────────────────────
import Dashboard from "./Pages/Dashboard";
import Eleves from "./Pages/Eleves";
import Professeurs from "./Pages/Professeurs";
import Notes from "./Pages/Notes";
import Paiements from "./Pages/Paiements";
import Depenses from "./Pages/Depenses";
import { Matieres } from "./Pages/Matieres";
import RH from "./Pages/RH";
import Emplois from "./Pages/Emplois";
import Parametres from "./Pages/Parametres";
import IA from "./Pages/IA";
import Message from "./Pages/Message";
import Document from "./Pages/Document";
import Annonces from "./Pages/Annonces";
import Abonnement from "./Pages/Abonnement";
import Guide from "./Pages/Guide";

// ── CONTEXT ───────────────────────────────────────────────────
import { NotificationsProvider } from "./context/NotificationsContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  // ──────────────────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────────────────
  const [authState, setAuthState] = useState("login"); // "login" | "register" | "app"
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Tableau de bord");
  const [collapsed, setCollapsed] = useState(false);
  const [trimestre, setTrimestre] = useState("T1");
  const [navbarSearch, setNavbarSearch] = useState("");

  // ──────────────────────────────────────────────────────────
  // HANDLERS
  // ──────────────────────────────────────────────────────────

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthState("app");
    setPage("Tableau de bord");
  };

  const handleRegisterSuccess = () => {
    setAuthState("login");
  };

  const handleLogout = () => {
    setUser(null);
    setAuthState("login");
    setPage("Tableau de bord");
  };

  const handleNavigate = (newPage) => {
    setPage(newPage);
    setNavbarSearch(""); // reset search when navigating away
  };

  // ──────────────────────────────────────────────────────────
  // LOGIN
  // ──────────────────────────────────────────────────────────
  if (authState === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setAuthState("register")}
      />
    );
  }

  // ──────────────────────────────────────────────────────────
  // REGISTER
  // ──────────────────────────────────────────────────────────
  if (authState === "register") {
    return (
      <Register
        onSuccess={handleRegisterSuccess}
        onBack={() => setAuthState("login")}
      />
    );
  }

  // ──────────────────────────────────────────────────────────
  // APP (logged in)
  // ──────────────────────────────────────────────────────────
  return (
    <NotificationsProvider>
      <ToastProvider>
        <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
          <Sidebar
            onNavigate={handleNavigate}
            activePage={page}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            user={user}
            onLogout={handleLogout}
          />

          <Navbar
            page={page}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            trimestre={trimestre}
            setTrimestre={setTrimestre}
            searchValue={navbarSearch}
            onSearch={setNavbarSearch}
            user={user}
            onLogout={handleLogout}
          />

          <main style={{
            marginLeft: collapsed ? "64px" : "240px",
            marginTop: "64px",
            flex: 1,
            padding: "28px 32px",
            fontFamily: "'Inter', sans-serif",
            transition: "margin-left 0.2s cubic-bezier(.4,0,.2,1)",
            minHeight: "calc(100vh - 64px)",
            boxSizing: "border-box",
          }}>
            {page === "Tableau de bord" && <Dashboard onNavigate={handleNavigate} />}
            {page === "Gestion des élèves" && <Eleves />}
            {page === "Gestion des matières" && <Matieres />}
            {page === "Gestion des notes" && <Notes trimestre={trimestre} setTrimestre={setTrimestre} />}
            {page === "Gestion des emplois" && <Emplois />}
            {page === "Gestion des professeurs" && <Professeurs />}
            {page === "Gestion RH" && <RH />}
            {page === "Gestion des paiements" && <Paiements />}
            {page === "Gestion des dépenses" && <Depenses />}
            {page === "IA" && <IA />}
            {page === "Paramètres" && <Parametres />}
            {page === "Messages" && <Message />}
            {page === "Documents" && <Document />}
            {page === "Annonces" && <Annonces />}
            {page === "Mon abonnement" && <Abonnement />}
            {page === "Guide d'utilisation" && <Guide onNavigate={handleNavigate} externalQuery={navbarSearch} onQueryChange={setNavbarSearch} />}
          </main>
        </div>
      </ToastProvider>
    </NotificationsProvider>
  );
}
