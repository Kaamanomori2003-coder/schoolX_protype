import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
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
import { NotificationsProvider } from "./context/NotificationsContext";
import { ToastProvider } from "./context/ToastContext";
import Guide from "./Pages/Guide";


export default function App() {
  const [page, setPage] = useState("Tableau de bord");
  const [collapsed, setCollapsed] = useState(false);
  const [trimestre, setTrimestre] = useState("T1");
  const [navbarSearch, setNavbarSearch] = useState("");

  const handleNavigate = (newPage) => {
    setPage(newPage);
    setNavbarSearch(""); // reset search when navigating away
  };

  return (
    <NotificationsProvider>
      <ToastProvider>
        <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
          <Sidebar onNavigate={handleNavigate} activePage={page} collapsed={collapsed} setCollapsed={setCollapsed} />
          <Navbar
            page={page}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            trimestre={trimestre}
            setTrimestre={setTrimestre}
            searchValue={navbarSearch}
            onSearch={setNavbarSearch}
          />
          <main style={{
            marginLeft: collapsed ? "64px" : "240px",
            marginTop: "64px",
            flex: 1,
            padding: "28px 32px",
            fontFamily: "'Inter', sans-serif",
            transition: "margin-left 0.2s cubic-bezier(.4,0,.2,1)",
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
            {page === "Guide d'utilisation" && <Guide onNavigate={handleNavigate} externalQuery={navbarSearch} onQueryChange={setNavbarSearch} />}
          </main>
        </div>
      </ToastProvider>
    </NotificationsProvider>
  );

}