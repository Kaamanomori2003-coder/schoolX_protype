import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Charger et appliquer l'apparence enregistrée
    const apparence = localStorage.getItem("apparence");
    if (apparence) {
      const config = JSON.parse(apparence);
      applyTheme(config.theme, config.couleur);
      applyLanguage(config.langue);
    }
  }, []);

  const applyTheme = (theme, couleur) => {
    const root = document.documentElement;
    if (theme === "Sombre") {
      root.style.background = "#1a1a1a";
      root.style.color = "#fff";
      document.body.style.background = "#1a1a1a";
      document.body.style.color = "#e0e0e0";
      const main = document.querySelector("main");
      if (main) {
        main.style.background = "#222";
        main.style.color = "#e0e0e0";
      }
    } else {
      root.style.background = "#eef2f7";
      root.style.color = "#0f172a";
      document.body.style.background = "#eef2f7";
      document.body.style.color = "#0f172a";
      const main = document.querySelector("main");
      if (main) {
        main.style.background = "#eef2f7";
        main.style.color = "#0f172a";
      }
    }
    root.style.setProperty("--primary-color", couleur);
  };

  const applyLanguage = (lang) => {
    document.documentElement.lang = lang === "Français" ? "fr" : lang === "English" ? "en" : "ar";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#eef2f7" }}>
      <Sidebar onNavigate={setPage} activePage={page} />
      <main style={{ marginLeft: "300px", flex: 1, padding: "32px 36px", fontFamily: "'Inter', sans-serif" }}>
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