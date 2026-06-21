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


export default function App() {
  const [page, setPage] = useState("Tableau de bord");

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f7f8fa" }}>
      <Sidebar onNavigate={setPage} activePage={page} />
      <Navbar page={page} />
      <main style={{
        marginLeft: "240px",
        marginTop: "64px",
        flex: 1,
        padding: "28px 32px",
        fontFamily: "'Inter', sans-serif",
      }}>
        {page === "Tableau de bord"          && <Dashboard />}
        {page === "Gestion des élèves"       && <Eleves />}
        {page === "Gestion des matières"     && <Matieres />}
        {page === "Gestion des notes"        && <Notes />}
        {page === "Gestion des emplois"      && <Emplois />}
        {page === "Gestion des professeurs"  && <Professeurs />}
        {page === "Gestion RH"               && <RH />}
        {page === "Gestion des paiements"    && <Paiements />}
        {page === "Gestion des dépenses"     && <Depenses />}
        {page === "IA"                       && <IA />}
        {page === "Paramètres"               && <Parametres />}
        {page === "Messages"                 && <Message />}
        {page === "Documents"                && <Document />}
        {page === "Annonces"                && <Annonces />}
      </main>
    </div>
  );
}