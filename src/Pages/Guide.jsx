import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═════════════════════════════════════════════════════════════════
   TYPES & DONNÉES DU GUIDE SCHOOLX
═════════════════════════════════════════════════════════════════ */
const PROFILES = [
  { key: "tous", label: "Tous les guides" },
  { key: "direction", label: "Direction & Admin" },
  { key: "enseignants", label: "Enseignants" },
  { key: "comptabilite", label: "Comptabilité & Caisse" },
  { key: "parents", label: "Parents & Élèves" },
];

const GUIDES = [
  {
    id: "eleves",
    title: "Inscrire & Gérer les Élèves",
    description: "Apprenez à créer les fiches élèves, attribuer les matricules, gérer les dossiers et les affectations de classe.",
    profile: "direction",
    available: true,
    duration: "3 min",
    keywords: ["élève", "inscription", "classe", "matricule", "dossier"],
    href: "#guide-eleves",
    targetPage: "Gestion des élèves",
    icon: "ti-users",
  },
  {
    id: "notes",
    title: "Saisir les Notes & Bulletins",
    description: "Saisie rapide des notes par trimestre, calcul automatique des moyennes avec coefficients et génération des bulletins PDF.",
    profile: "enseignants",
    available: true,
    duration: "4 min",
    keywords: ["notes", "bulletin", "moyenne", "trimestre", "matière", "examen"],
    href: "#guide-notes",
    targetPage: "Gestion des notes",
    icon: "ti-clipboard-list",
  },
  {
    id: "paiements",
    title: "Encaissements & Paiements",
    description: "Gérez les règlements des frais scolaires par tranche ou par mois, générez des reçus imprimables et suivez les impayés.",
    profile: "comptabilite",
    available: true,
    duration: "3 min",
    keywords: ["paiement", "tranche", "mois", "caisse", "reçu", "impayés", "frais"],
    href: "#guide-paiements",
    targetPage: "Gestion des paiements",
    icon: "ti-credit-card",
  },
  {
    id: "rh",
    title: "Gestion RH & Salaires",
    description: "Gérez le personnel enseignant et administratif, les demandes de congés, les contrats et l'édition des fiches de paie.",
    profile: "direction",
    available: true,
    duration: "5 min",
    keywords: ["rh", "personnel", "salaire", "congé", "contrat", "paie", "employé"],
    href: "#guide-rh",
    targetPage: "Gestion RH",
    icon: "ti-briefcase",
  },
  {
    id: "depenses",
    title: "Suivi des Dépenses & Budget",
    description: "Enregistrez les sorties de caisse, classez par catégorie (fournitures, maintenance, salaires) et joignez les justificatifs.",
    profile: "comptabilite",
    available: true,
    duration: "3 min",
    keywords: ["dépenses", "budget", "fournitures", "comptabilité", "justificatif"],
    href: "#guide-depenses",
    targetPage: "Gestion des dépenses",
    icon: "ti-chart-pie",
  },
  {
    id: "emplois",
    title: "Emplois du Temps & Planning",
    description: "Planifiez les heures de cours par classe, évitez les conflits de créneaux et permettez l'impression des plannings.",
    profile: "enseignants",
    available: true,
    duration: "4 min",
    keywords: ["emploi du temps", "planning", "horaire", "cours", "salle"],
    href: "#guide-emplois",
    targetPage: "Gestion des emplois",
    icon: "ti-calendar",
  },
  {
    id: "ia",
    title: "Assistant IA SchoolX",
    description: "Posez des questions en langage naturel à l'IA pour obtenir des résumés de performances, bilans et conseils de gestion.",
    profile: "direction",
    available: true,
    duration: "2 min",
    keywords: ["ia", "intelligence artificielle", "assistant", "analyse", "statistiques"],
    href: "#guide-ia",
    targetPage: "IA",
    icon: "ti-sparkles",
  },
  {
    id: "communication",
    title: "Messages & Annonces",
    description: "Communiquez directement avec les professeurs, publiez des annonces officielles et informez les parents d'élèves.",
    profile: "direction",
    available: true,
    duration: "3 min",
    keywords: ["messages", "annonces", "communication", "parents", "notification"],
    href: "#guide-communication",
    targetPage: "Annonces",
    icon: "ti-speakerphone",
  },
];

const FAQ_ITEMS = [
  {
    question: "Comment enregistrer un paiement par mois au lieu d'une tranche ?",
    answer: "Dans le module 'Gestion des paiements', cliquez sur 'Nouveau paiement'. Dans la modale qui s'ouvre, changez le 'Type de paiement' de 'Par tranche' à 'Par mois'. Sélectionnez ensuite le mois concerné (ex: Octobre) puis validez.",
  },
  {
    question: "Comment sont calculées les moyennes générales des élèves ?",
    answer: "Les moyennes sont calculées automatiquement dans la 'Gestion des notes' en multipliant chaque note par le coefficient officiel de la matière définie dans 'Gestion des matières', puis en divisant le total par la somme des coefficients.",
  },
  {
    question: "Comment fermer la modale RH et générer une notification ?",
    answer: "Lorsque vous remplissez le formulaire dans la 'Gestion RH', cliquez sur le bouton 'Enregistrer' ou 'Mettre à jour'. La modale se fermera automatiquement et une notification verte (ou rouge) apparaîtra en haut à droite pour vous confirmer l'action.",
  },
  {
    question: "L'assistant IA a-t-il accès aux données confidentielles ?",
    answer: "L'assistant IA SchoolX travaille de manière sécurisée et ne communique aucune donnée de votre établissement vers l'extérieur. Vos informations d'élèves et de caisse restent strictement privées.",
  },
  {
    question: "Comment imprimer un reçu de paiement ou une fiche d'élève ?",
    answer: "Sur chaque ligne d'élève ou de paiement, cliquez sur les trois petits points de menu à droite puis sélectionnez 'Générer reçu' ou 'Imprimer'. Une fenêtre prête à l'impression s'ouvrira immédiatement.",
  },
  {
    question: "Que faire en cas de problème de connexion ou de mot de passe ?",
    answer: "Rendez-vous dans la rubrique 'Paramètres' > 'Sécurité' pour réinitialiser le mot de passe, ou contactez l'administrateur principal de l'école muni de vos identifiants.",
  },
];

function normalize(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function Guide({ onNavigate, externalQuery = "", onQueryChange }) {
  const [query, setQuery] = useState("");
  const [profileFilter, setProfileFilter] = useState("tous");
  const [openFaq, setOpenFaq] = useState(0);

  // Sync with the Navbar search bar
  useEffect(() => {
    setQuery(externalQuery);
  }, [externalQuery]);

  const handleQuery = (val) => {
    setQuery(val);
    if (onQueryChange) onQueryChange(val);
  };

  const visibleGuides = useMemo(() => {
    const q = normalize(query);
    return GUIDES.filter((guide) => {
      if (profileFilter !== "tous" && guide.profile !== profileFilter) return false;
      if (!q) return true;
      return normalize(
        [guide.title, guide.description, guide.profile, ...guide.keywords].join(" ")
      ).includes(q);
    });
  }, [profileFilter, query]);

  const resetFilters = () => {
    handleQuery("");
    setProfileFilter("tous");
  };

  const handleNavigateToPage = (pageName) => {
    if (onNavigate && pageName) {
      onNavigate(pageName);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a", maxWidth: 1200, margin: "0 auto" }}>
      
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #0047BA 0%, #1e3a8a 100%)",
        borderRadius: 20,
        padding: "40px 32px",
        color: "#fff",
        marginBottom: 28,
        boxShadow: "0 20px 40px -15px rgba(0, 71, 186, 0.3)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 20,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(8px)", fontSize: 13, fontWeight: 600,
            marginBottom: 16, border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <i className="ti ti-book" style={{ fontSize: 16 }} />
            Centre d'Aide & Documentation SchoolX
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, lineHeight: 1.25 }}>
            Comment pouvons-nous <span style={{ color: "#93c5fd" }}>vous aider ?</span>
          </h1>
          <p style={{ fontSize: 16, color: "#dbeafe", marginTop: 10, marginBottom: 24, lineHeight: 1.5 }}>
            Retrouvez tous les tutoriels pas à pas pour gérer les élèves, saisir les notes, encaisser les frais et maîtriser les outils RH de votre établissement.
          </p>

          {/* SEARCH BAR */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#fff", padding: "8px 16px", borderRadius: 14,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
          }}>
            <i className="ti ti-search" style={{ fontSize: 20, color: "#64748b" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              placeholder="Rechercher : paiement par tranche, notes, bulletin, contrat RH..."
              style={{
                border: "none", outline: "none", flex: 1,
                fontSize: 15, fontFamily: "'Inter', sans-serif", color: "#0f172a"
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0047BA", background: "#eff6ff", padding: "4px 10px", borderRadius: 20 }}>
              {visibleGuides.length} guide{visibleGuides.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* POPULAR SEARCHES */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, flexWrap: "wrap", fontSize: 13 }}>
            <span style={{ color: "#93c5fd", fontWeight: 600 }}>Populaires :</span>
            {[
              { label: "Paiement tranche / mois", q: "tranche" },
              { label: "Bulletins de notes", q: "bulletin" },
              { label: "Formulaire RH", q: "rh" },
              { label: "Assistant IA", q: "ia" }
            ].map(b => (
              <button
                key={b.label}
                onClick={() => setQuery(b.q)}
                style={{
                  border: "none", background: "rgba(255,255,255,0.15)",
                  color: "#fff", borderRadius: 20, padding: "4px 12px",
                  fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  transition: "background 0.2s"
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCÈS RAPIDES (QUICK HELP) ─────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { tag: "Caisse & Comptabilité", title: "Encaisser un paiement", icon: "ti-credit-card", page: "Gestion des paiements", color: "#0047BA" },
            { tag: "Académique & Bulletins", title: "Saisir les notes", icon: "ti-clipboard-list", page: "Gestion des notes", color: "#7c3aed" },
            { tag: "Ressources Humaines", title: "Gérer le personnel", icon: "ti-briefcase", page: "Gestion RH", color: "#ea580c" },
            { tag: "Assistant Intelligent", title: "Poser une question IA", icon: "ti-sparkles", page: "IA", color: "#10b981" },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)" }}
              onClick={() => handleNavigateToPage(card.page)}
              style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
                padding: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "all 0.2s"
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, fontSize: 22 }}>
                <i className={`ti ${card.icon}`} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{card.tag}</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{card.title}</div>
              </div>
              <i className="ti ti-chevron-right" style={{ color: "#94a3b8", fontSize: 18 }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GRILLE DES GUIDES DISPONIBLES ───────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0047BA", textTransform: "uppercase", letterSpacing: 0.5 }}>Bibliothèque de tutoriels</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "2px 0 0" }}>Trouvez le guide adapté à votre besoin</h2>
          </div>
          {(query || profileFilter !== "tous") && (
            <button onClick={resetFilters} style={{ border: "1px solid #cbd5e1", background: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600, color: "#64748b" }}>
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* FILTRES PAR PROFIL */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {PROFILES.map((p) => (
            <button
              key={p.key}
              onClick={() => setProfileFilter(p.key)}
              style={{
                padding: "8px 16px", borderRadius: 10,
                border: profileFilter === p.key ? "1px solid #0047BA" : "1px solid #e2e8f0",
                background: profileFilter === p.key ? "#0047BA" : "#fff",
                color: profileFilter === p.key ? "#fff" : "#475569",
                fontSize: 13, fontWeight: profileFilter === p.key ? 700 : 500,
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                transition: "all 0.15s"
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {visibleGuides.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {visibleGuides.map((guide) => (
              <motion.article
                key={guide.id}
                whileHover={{ y: -4 }}
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
                  padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.02)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "#eff6ff", color: "#0047BA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      <i className={`ti ${guide.icon}`} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#166534", padding: "3px 9px", borderRadius: 12 }}>
                      Disponible
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>{guide.title}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{guide.description}</p>
                </div>

                <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="ti ti-clock" /> {guide.duration}
                  </span>
                  <button
                    onClick={() => handleNavigateToPage(guide.targetPage)}
                    style={{
                      border: "none", background: "none", color: "#0047BA",
                      fontWeight: 700, fontSize: 13, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4, padding: 0
                    }}
                  >
                    Accéder <i className="ti ti-arrow-right" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 16, padding: 40, textAlign: "center", border: "1px dashed #cbd5e1" }}>
            <i className="ti ti-help-circle" style={{ fontSize: 40, color: "#94a3b8" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>Aucun guide ne correspond à votre recherche</h3>
            <p style={{ fontSize: 14, color: "#64748b" }}>Essayez un autre mot-clé ou réinitialisez le filtre de profil.</p>
            <button onClick={resetFilters} style={{ background: "#0047BA", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13, marginTop: 10 }}>
              Afficher tous les guides
            </button>
          </div>
        )}
      </section>

      {/* ── PARCOURS DÉTAILLÉS (MODE D'EMPLOI PAS À PAS) ───────────── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0047BA", textTransform: "uppercase", letterSpacing: 0.5 }}>Procédure détaillée</span>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "2px 0 0" }}>Les parcours essentiels pas à pas</h2>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          
          {/* PAS À PAS PAIEMENTS */}
          <article id="guide-paiements" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#eff6ff", color: "#0047BA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                <i className="ti ti-credit-card" />
              </div>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0047BA" }}>Guide Caisse 01</span>
                <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>Encaisser les frais scolaires (Tranche ou Mois)</h3>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
              {[
                { step: "1", title: "Ouvrir la Caisse", desc: "Allez sur la page 'Gestion des paiements' et cliquez sur 'Nouveau paiement'." },
                { step: "2", title: "Choisir le Type", desc: "Choisissez si le règlement s'effectue 'Par tranche' ou 'Par mois' dans le menu." },
                { step: "3", title: "Entrer le Montant", desc: "Saisissez l'élève, la classe, le montant encaissé et le mode (Espèces, Mobile Money)." },
                { step: "4", title: "Imprimer le Reçu", desc: "Enregistrez : la modale se ferme, le toast s'affiche et vous pouvez imprimer le reçu." },
              ].map(s => (
                <div key={s.step} style={{ background: "#f8fafc", borderRadius: 12, padding: 16, border: "1px solid #f1f5f9" }}>
                  <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: "50%", background: "#0047BA", color: "#fff", fontWeight: 800, fontSize: 13, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    {s.step}
                  </span>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.4 }}>{s.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleNavigateToPage("Gestion des paiements")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#0047BA", color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 18px", fontSize: 14,
                fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif"
              }}
            >
              Aller aux Paiements <i className="ti ti-arrow-right" />
            </button>
          </article>

          {/* PAS À PAS RH */}
          <article id="guide-rh" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#eff6ff", color: "#0047BA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                <i className="ti ti-briefcase" />
              </div>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0047BA" }}>Guide RH 02</span>
                <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>Gérer les Collaborateurs & Fiches de Paie</h3>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
              {[
                { step: "1", title: "Formulaire Collaborateur", desc: "Dans 'Gestion RH', cliquez sur 'Ajouter un collaborateur'." },
                { step: "2", title: "Informations & Contrat", desc: "Renseignez le nom, le poste, la catégorie (Enseignant/Admin), le contrat et le salaire." },
                { step: "3", title: "Validation Automatique", desc: "Cliquez sur 'Enregistrer'. La modale se ferme automatiquement avec confirmation visuelle." },
                { step: "4", title: "Bulletins de Paie", desc: "Générez les fiches de paie et suivez les congés restants du personnel." },
              ].map(s => (
                <div key={s.step} style={{ background: "#f8fafc", borderRadius: 12, padding: 16, border: "1px solid #f1f5f9" }}>
                  <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: "50%", background: "#0047BA", color: "#fff", fontWeight: 800, fontSize: 13, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    {s.step}
                  </span>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.4 }}>{s.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleNavigateToPage("Gestion RH")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#0047BA", color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 18px", fontSize: 14,
                fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif"
              }}
            >
              Ouvrir la Gestion RH <i className="ti ti-arrow-right" />
            </button>
          </article>

        </div>
      </section>

      {/* ── CONSEILS DE SÉCURITÉ ────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #0047BA 0%, #1e40af 100%)", borderRadius: 18, padding: 32, color: "#fff", marginBottom: 36, boxShadow: "0 10px 30px rgba(0, 71, 186, 0.25)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <i className="ti ti-shield-check" style={{ fontSize: 28, color: "#93c5fd" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: 0.5 }}>Sécurité & Bonnes Pratiques</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 16px" }}>Protégez les données de votre établissement</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { title: "Identifiants uniques", desc: "Chaque utilisateur (Comptable, Directeur) doit avoir son propre compte sans partager les mots de passe." },
            { title: "Validation des encaissements", desc: "Vérifiez toujours le mode de règlement avant d'imprimer ou d'envoyer le reçu par SMS/WhatsApp." },
            { title: "Sauvegarde des données", desc: "Rendez-vous dans 'Paramètres' > 'Sauvegarde' pour télécharger régulièrement une sauvegarde complète." },
          ].map((sec, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>{sec.title}</div>
              <p style={{ fontSize: 13, color: "#dbeafe", margin: 0, lineHeight: 1.4 }}>{sec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ACCORDÉON ───────────────────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0047BA", textTransform: "uppercase", letterSpacing: 0.5 }}>Foire Aux Questions</span>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "4px 0 0" }}>Les réponses à vos questions fréquentes</h2>
        </div>

        <div style={{ display: "grid", gap: 12, maxWidth: 840, margin: "0 auto" }}>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
                  overflow: "hidden", transition: "all 0.2s"
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    width: "100%", padding: "18px 22px", background: "none", border: "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", textAlign: "left", fontFamily: "'Inter', sans-serif"
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{item.question}</span>
                  <i className={`ti ${isOpen ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize: 18, color: "#64748b" }} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ padding: "0 22px 20px", fontSize: 14, color: "#475569", lineHeight: 1.6, borderTop: "1px solid #f1f5f9" }}
                    >
                      <p style={{ marginTop: 12, marginBottom: 0 }}>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ASSISTANCE & IA ────────────────────────────────────────── */}
      <section style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 18, padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#0047BA", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
            <i className="ti ti-sparkles" />
          </div>
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: "#0f172a" }}>Vous avez une question spécifique ?</h3>
            <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0" }}>L'Assistant IA SchoolX est disponible 24/7 pour analyser les données de votre établissement.</p>
          </div>
        </div>
        <button
          onClick={() => handleNavigateToPage("IA")}
          style={{
            background: "#0047BA", color: "#fff", border: "none",
            borderRadius: 12, padding: "12px 22px", fontSize: 14,
            fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(0,71,186,0.25)"
          }}
        >
          Demander à l'IA <i className="ti ti-arrow-right" />
        </button>
      </section>

    </div>
  );
}
