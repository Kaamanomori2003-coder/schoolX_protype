import { useState } from "react";
import Sidebar from "./components/Sidebar";
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

export default function App() {
  const [page, setPage] = useState("Accueil");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#eef2f7" }}>
      <Sidebar onNavigate={setPage} activePage={page} />
      <main style={{ marginLeft: "250px", flex: 1, padding: "32px 36px", fontFamily: "'Outfit', sans-serif" }}>
        {page === "Accueil"                  && <Dashboard />}
        {page === "Gestion des élèves"       && <Eleves />}
        {page === "Gestion des professeurs"  && <Professeurs />}
        {page === "Gestion des notes"        && <Notes />}
        {page === "Gestion des paiements"    && <Paiements />}
        {page === "Gestion des dépenses"     && <Depenses />}
        {page === "Gestion des matières"     && <Matieres />}
        {page === "Gestion RH"               && <RH />}
        {page === "Gestion des emplois"      && <Emplois />}
        {page === "Paramètres"               && <Parametres />}
      </main>
    </div>
  );
}