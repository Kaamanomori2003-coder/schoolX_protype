import { useState, useEffect } from "react";
import { useNotifications } from "../context/NotificationsContext";
import { motion, AnimatePresence } from "framer-motion";
import "./Notes.css";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";
import { t } from "../theme";

const NEUTRAL_CHIP = t.border;

/* ─── STYLES PARTAGÉS ────────────────────────────────────────── */
const primaryBtnStyle = {
  display: "flex", alignItems: "center", gap: 6,
  background: t.blue, color: "#fff", border: "none",
  borderRadius: t.radius, padding: "9px 16px",
  fontSize: 12.5, fontWeight: 600, cursor: "pointer",
  fontFamily: t.font, transition: "all .15s", whiteSpace: "nowrap",
  boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
};

const cardStyle = {
  background: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: t.radiusLg,
  boxShadow: t.shadow,
};

const sectionTitleStyle = {
  fontSize: 15, fontWeight: 700, color: t.text,
  margin: "0 0 14px 0", display: "flex", alignItems: "center", gap: 8,
};

const thStyle = {
  padding: "12px 16px", textAlign: "left",
  fontSize: 11, fontWeight: 600, color: t.muted,
  textTransform: "uppercase", letterSpacing: ".4px",
  borderBottom: `1px solid ${t.border}`,
};

const chipStyle = {
  fontSize: 11, fontWeight: 600, padding: "3px 10px",
  borderRadius: 20, display: "inline-block", whiteSpace: "nowrap",
};

const labelStyle = {
  display: "block", marginBottom: 5,
  fontWeight: 600, fontSize: 11, color: t.sub,
};

const inputStyle = {
  width: "100%", padding: "9px 12px",
  border: `1px solid ${t.border}`, borderRadius: t.radius,
  fontSize: 13, outline: "none", boxSizing: "border-box",
  fontFamily: t.font, color: t.text, background: t.surface,
};

const errorTextStyle = { color: t.red, fontSize: 11, marginTop: 3 };

const selectFilterStyle = {
  width: "100%", padding: "10px 12px",
  border: `1px solid ${t.border}`, borderRadius: t.radius,
  fontSize: 13, outline: "none", background: t.surface,
  color: t.text, fontFamily: t.font, cursor: "pointer", boxShadow: t.shadow,
};

const fieldBorder = (hasError) => `1px solid ${hasError ? t.red : t.border}`;

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const modalCardStyle = {
  background: t.surface, borderRadius: t.radiusLg, overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)", fontFamily: t.font, color: t.text,
};

const modalHeaderStyle = {
  padding: "18px 22px", borderBottom: `1px solid ${t.border}`,
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
};

const modalCloseStyle = {
  background: t.bg, border: "none", borderRadius: 8,
  width: 30, height: 30, display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer", color: t.sub, fontSize: 15, flexShrink: 0,
};

const modalCancelBtnStyle = {
  flex: 1, padding: "10px", border: `1px solid ${t.border}`,
  borderRadius: t.radius, background: t.surface, fontSize: 12.5, fontWeight: 500,
  cursor: "pointer", color: t.sub, fontFamily: t.font,
};

const modalConfirmBtnStyle = {
  flex: 1, padding: "10px", border: "none", borderRadius: t.radius,
  background: t.blue, color: "#fff", fontSize: 12.5, fontWeight: 600,
  cursor: "pointer", fontFamily: t.font,
};

// Rich Mockup Personnel Dataset
const initialEmployes = [
  {
    id: 1,
    nom: "Dr. Mamadou Diallo",
    poste: "Professeur de Mathématiques",
    salaire: 2500000,
    contrat: "CDI",
    dateEmbauche: "01/09/2018",
    status: "Actif",
    diplome: "Doctorat en Algèbre",
    evaluation: 4.9,
    absences: 1,
    telephone: "+224 620 12 34 56",
    email: "m.diallo@schoolx.gn",
    emploiDuTemps: ["Lundi (08h - 12h)", "Mercredi (10h - 14h)", "Vendredi (08h - 12h)"],
    avatar: "ti-school",
    categorie: "Enseignant",
    primes: 150000,
    retenues: 50000,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 22
  },
  {
    id: 2,
    nom: "Mme Fatoumata Bah",
    poste: "Professeur de Physique",
    salaire: 2200000,
    contrat: "CDI",
    dateEmbauche: "15/09/2019",
    status: "Actif",
    diplome: "Master en Sciences Physiques",
    evaluation: 4.7,
    absences: 0,
    telephone: "+224 621 98 76 54",
    email: "f.bah@schoolx.gn",
    emploiDuTemps: ["Mardi (08h - 12h)", "Jeudi (08h - 12h)", "Jeudi (14h - 16h)"],
    avatar: "ti-school",
    categorie: "Enseignant",
    primes: 100000,
    retenues: 0,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 24
  },
  {
    id: 3,
    nom: "M. Ibrahima Camara",
    poste: "Professeur d'Histoire",
    salaire: 2000000,
    contrat: "CDD",
    dateEmbauche: "01/10/2020",
    status: "En congé",
    diplome: "Licence en Histoire-Géo",
    evaluation: 4.5,
    absences: 2,
    telephone: "+224 625 45 67 89",
    email: "i.camara@schoolx.gn",
    emploiDuTemps: ["Lundi (14h - 18h)", "Mardi (10h - 12h)"],
    avatar: "ti-school",
    categorie: "Enseignant",
    primes: 0,
    retenues: 0,
    statutPaie: "En attente",
    datePaie: "",
    joursCongesRestants: 12
  },
  {
    id: 4,
    nom: "Mme Aïssatou Sow",
    poste: "Professeur de Français",
    salaire: 2100000,
    contrat: "CDD",
    dateEmbauche: "01/09/2022",
    status: "Actif",
    diplome: "Master en Lettres Modernes",
    evaluation: 4.6,
    absences: 3,
    telephone: "+224 628 33 22 11",
    email: "a.sow@schoolx.gn",
    emploiDuTemps: ["Mercredi (08h - 12h)", "Vendredi (14h - 18h)"],
    avatar: "ti-school",
    categorie: "Enseignant",
    primes: 50000,
    retenues: 30000,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 18
  },
  {
    id: 5,
    nom: "M. Ousmane Kouyaté",
    poste: "Directeur des Études",
    salaire: 3500000,
    contrat: "CDI",
    dateEmbauche: "01/09/2016",
    status: "Actif",
    diplome: "Master en Administration Scolaire",
    evaluation: 4.8,
    absences: 0,
    telephone: "+224 622 11 44 77",
    email: "o.kouyate@schoolx.gn",
    emploiDuTemps: ["Lundi au Vendredi (08h - 17h)"],
    avatar: "ti-briefcase",
    categorie: "Administration",
    primes: 300000,
    retenues: 0,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 30
  },
  {
    id: 6,
    nom: "Kadiatou Traoré",
    poste: "Secrétaire Générale",
    salaire: 1500000,
    contrat: "CDI",
    dateEmbauche: "01/03/2021",
    status: "Actif",
    diplome: "BTS Secrétariat de Direction",
    evaluation: 4.4,
    absences: 1,
    telephone: "+224 626 55 66 77",
    email: "k.traore@schoolx.gn",
    emploiDuTemps: ["Lundi au Vendredi (08h - 16h)"],
    avatar: "ti-briefcase",
    categorie: "Administration",
    primes: 80000,
    retenues: 20000,
    statutPaie: "En attente",
    datePaie: "",
    joursCongesRestants: 15
  },
  {
    id: 7,
    nom: "Sekou Barry",
    poste: "Comptable Principal",
    salaire: 2800000,
    contrat: "CDI",
    dateEmbauche: "15/06/2019",
    status: "Actif",
    diplome: "Master en Audit et Contrôle",
    evaluation: 4.7,
    absences: 0,
    telephone: "+224 623 88 99 00",
    email: "s.barry@schoolx.gn",
    emploiDuTemps: ["Lundi au Vendredi (08h - 17h)"],
    avatar: "ti-device-laptop",
    categorie: "Administration",
    primes: 200000,
    retenues: 0,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 26
  },
  {
    id: 8,
    nom: "Mariama Condé",
    poste: "Assistante administrative / Surveillante",
    salaire: 1200000,
    contrat: "Temps partiel",
    dateEmbauche: "01/01/2022",
    status: "Absent",
    diplome: "Licence en Communication",
    evaluation: 4.2,
    absences: 4,
    telephone: "+224 629 00 11 22",
    email: "m.conde@schoolx.gn",
    emploiDuTemps: ["Lundi (09h - 13h)", "Mercredi (09h - 13h)", "Vendredi (09h - 13h)"],
    avatar: "ti-device-laptop",
    categorie: "Administration",
    primes: 0,
    retenues: 80000,
    statutPaie: "En attente",
    datePaie: "",
    joursCongesRestants: 11
  },
];

// Mock Recruitment Candidates
const initialCandidates = [
  { id: 101, nom: "Abdoulaye Touré", poste: "Professeur de Chimie", diplome: "Master en Chimie Organique", etape: "CV", date: "15/05/2026", email: "a.toure@gmail.com", tel: "+224 624 55 44 33", categorie: "Enseignant" },
  { id: 102, nom: "Mabinty Sylla", poste: "Professeur d'Anglais", diplome: "Licence en Anglais Moderne", etape: "Entretien", date: "17/05/2026", email: "m.sylla@outlook.com", tel: "+224 628 88 77 66", categorie: "Enseignant" },
  { id: 103, nom: "Dr. Thierno Diallo", poste: "Professeur de SVT", diplome: "Doctorat en Biologie", etape: "Entretien", date: "18/05/2026", email: "t.diallo@gmail.com", tel: "+224 620 99 88 77", categorie: "Enseignant" },
  { id: 104, nom: "Salimatou Barry", poste: "Conseillère d'Orientation", diplome: "Master en Psychologie", etape: "Offre", date: "12/05/2026", email: "s.barry@yahoo.fr", tel: "+224 627 11 22 33", categorie: "Administration" },
  { id: 105, nom: "Oumar Sow", poste: "Chauffeur de Bus Scolaire", diplome: "Permis Poids Lourds", etape: "CV", date: "16/05/2026", email: "o.sow@driver.gn", tel: "+224 629 44 55 66", categorie: "Services & Soutien" },
  { id: 106, nom: "Fatoumata Diané", poste: "Infirmière Scolaire", diplome: "Diplôme d'État en Soins", etape: "Entretien", date: "14/05/2026", email: "f.diane@medical.gn", tel: "+224 622 12 34 56", categorie: "Services & Soutien" },
];

const statusStyle = {
  "Actif": { background: t.greenSoft, color: t.green },
  "En congé": { background: t.amberSoft, color: t.amber },
  "Suspendu": { background: t.redSoft, color: t.red },
  "Absent": { background: t.redSoft, color: t.red },
};

const contratStyle = {
  "CDI": { background: t.blueSoft, color: t.blue },
  "CDD": { background: t.amberSoft, color: t.amber },
  "Temps partiel": { background: NEUTRAL_CHIP, color: t.sub },
};

const InfoItem = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
    <i className={`ti ${icon}`} style={{ fontSize: 15, color: t.muted, marginTop: 1, width: 16, flexShrink: 0 }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{value}</div>
    </div>
  </div>
);

const TITRES = ["dr.", "dr", "m.", "mr", "mme", "mlle", "pr.", "pr"];

function getInitiales(nom = "") {
  const mots = nom.split(" ").filter(m => m && !TITRES.includes(m.toLowerCase()));
  return mots.slice(0, 2).map(m => m[0]).join("").toUpperCase() || "?";
}

function renderAvatar(e, size = 60, fontSize = 18) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: t.blueSoft,
      border: `1px solid ${t.blueMid}`,
      color: t.blue,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: fontSize,
      fontWeight: 700,
      flexShrink: 0,
      boxSizing: "border-box"
    }}>
      {getInitiales(e.nom)}
    </div>
  );
}

const ActionBtn = ({ icon, label, primary, c, bg, border, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 7,
    padding: "9px 16px", border: primary ? "none" : `1px solid ${border || t.border}`,
    borderRadius: t.radius, cursor: "pointer",
    fontFamily: t.font, fontSize: 12.5, fontWeight: 500,
    background: primary ? t.blue : (bg || t.surface),
    color: primary ? "#fff" : (c || t.sub),
    boxShadow: primary ? "0 2px 8px rgba(37,99,235,0.25)" : t.shadow,
    transition: "all .15s",
  }}>
    <i className={`ti ${icon}`} style={{ fontSize: 14 }} /> {label}
  </button>
);

/* ── Dossier d'un membre du personnel (page pleine, lecture seule) ── */
function FicheEnseignant({ staff, tab, setTab, onRetour, onEdit, onDelete, formatSeniority, daysOfWeek, parseSchedule }) {
  const sectionTitle = { fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: 8 };

  return (
    <div style={{ fontFamily: t.font, color: t.text, maxWidth: 860, margin: "0 auto" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <ActionBtn icon="ti-arrow-left" label="Retour" primary onClick={onRetour} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ActionBtn icon="ti-pencil" label="Modifier" onClick={() => onEdit(staff)} />
          <ActionBtn icon="ti-trash" label="Supprimer" c={t.red} bg={t.redSoft} border={t.redSoft} onClick={() => onDelete(staff)} />
        </div>
      </div>

      {/* ── HERO CARD ── */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "16px 18px 14px", display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
          {renderAvatar(staff, 52, 18)}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{staff.nom}</h2>
            <div style={{ fontSize: 11.5, color: t.muted, marginTop: 3 }}>{staff.poste}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ ...chipStyle, ...contratStyle[staff.contrat] }}>{staff.contrat}</span>
              <span style={{ ...chipStyle, ...statusStyle[staff.status] }}>{staff.status}</span>
              <span style={{ ...chipStyle, background: NEUTRAL_CHIP, color: t.sub }}>{staff.categorie}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", flexWrap: "wrap", borderBottom: `1px solid ${t.border}`, marginBottom: 16 }}>
        {[
          { id: "profil", label: "Profil & Contrat", icon: "ti-user" },
          { id: "planning", label: "Emploi du temps", icon: "ti-calendar" },
          { id: "historique", label: "Historique", icon: "ti-history" }
        ].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            background: "transparent",
            color: tab === tb.id ? t.blue : t.sub,
            border: "none",
            borderBottom: tab === tb.id ? `2px solid ${t.blue}` : "2px solid transparent",
            padding: "11px 16px", fontSize: 13, fontWeight: tab === tb.id ? 600 : 400,
            cursor: "pointer", transition: "all .15s", fontFamily: t.font,
            marginBottom: -1, whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 7
          }}>
            <i className={`ti ${tb.icon}`} style={{ fontSize: 14 }} /> {tb.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1 : PROFIL ── */}
      {tab === "profil" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>
                <i className="ti ti-id" style={{ fontSize: 14, color: t.muted, marginRight: 7 }} />
                Informations personnelles
              </span>
            </div>
            <div style={{ padding: "6px 18px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0 32px" }}>
                <div>
                  <InfoItem icon="ti-phone" label="Téléphone" value={staff.telephone} />
                  <InfoItem icon="ti-mail" label="E-mail" value={staff.email} />
                </div>
                <div>
                  <InfoItem icon="ti-certificate" label="Dernier diplôme" value={staff.diplome} />
                  <InfoItem icon="ti-file-text" label="Contrat & ancienneté" value={`${staff.contrat} (${formatSeniority(staff.dateEmbauche)})`} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, padding: "16px 18px" }}>
            <h4 style={sectionTitle}>
              <i className="ti ti-cash" style={{ color: t.blue, fontSize: 16 }} /> Informations Financières
            </h4>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: t.sub }}>
              <span>Salaire Brut :</span>
              <strong style={{ color: t.text }}>{staff.salaire.toLocaleString()} GNF</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 5, color: t.sub }}>
              <span>Primes :</span>
              <span style={{ color: t.green, fontWeight: 600 }}>+{staff.primes.toLocaleString()} GNF</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 5, color: t.sub }}>
              <span>Retenues :</span>
              <span style={{ color: t.red, fontWeight: 600 }}>-{staff.retenues.toLocaleString()} GNF</span>
            </div>
            <div style={{ height: 1, background: t.border, margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <strong style={{ color: t.text }}>Net à percevoir :</strong>
              <strong style={{ color: t.blue }}>{(staff.salaire + staff.primes - staff.retenues).toLocaleString()} GNF</strong>
            </div>
          </div>

          {/* VIRTUAL DOCUMENTS DOWNLOAD SECTION */}
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, padding: "16px 18px" }}>
            <h4 style={sectionTitle}>
              <i className="ti ti-folder" style={{ fontSize: 16, color: t.blue }} /> Documents administratifs joints
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { nom: "Contrat_De_Travail_Signe.pdf", taille: "1.4 Mo" },
                { nom: "Diplome_Et_Certificats.pdf", taille: "3.2 Mo" },
                { nom: "Piece_D_Identite_Copie.pdf", taille: "850 Ko" }
              ].map((doc, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "9px 12px", border: `1px solid ${t.border}`, borderRadius: t.radius, background: t.surface }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: t.blueSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className="ti ti-file-text" style={{ fontSize: 16, color: t.blue }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 13, color: t.text, fontWeight: 600, display: "block" }}>{doc.nom}</span>
                      <span style={{ fontSize: 11, color: t.muted }}>{doc.taille}</span>
                    </div>
                  </div>
                  <button onClick={() => alert(`Téléchargement simulé de ${doc.nom}`)} style={{ background: t.blueSoft, border: `1px solid ${t.blueMid}`, borderRadius: t.radius, padding: "5px 10px", cursor: "pointer", color: t.blue, fontSize: 12.5, fontWeight: 600, fontFamily: t.font, whiteSpace: "nowrap" }}>Télécharger</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2 : PLANNING ── */}
      {tab === "planning" && (
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, padding: "16px 18px" }}>
          <h4 style={sectionTitle}>
            <i className="ti ti-calendar" style={{ color: t.blue, fontSize: 16 }} /> Emploi du Temps Hebdomadaire
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))", gap: 6 }}>
            {daysOfWeek.map(day => {
              const schedule = parseSchedule(staff.emploiDuTemps);
              const hours = schedule[day];
              return (
                <div key={day} style={{
                  background: hours ? t.blueSoft : t.bg,
                  border: hours ? `1px solid ${t.blueMid}` : `1px dashed ${t.border}`,
                  borderRadius: t.radius, padding: 10, minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: hours ? t.blue : t.muted, textTransform: "uppercase", letterSpacing: ".4px" }}>{day}</span>
                  {hours ? (
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.blue, background: t.surface, padding: "4px 6px", borderRadius: 6, marginTop: 8, textAlign: "center" }}>
                      {hours}
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: t.muted, fontStyle: "italic", marginTop: 8, display: "block", textAlign: "center" }}>Libre</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3 : HISTORIQUE ── */}
      {tab === "historique" && (
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, padding: "16px 18px" }}>
          <h4 style={sectionTitle}>
            <i className="ti ti-history" style={{ color: t.blue, fontSize: 16 }} /> Historique de Carrière &amp; Parcours
          </h4>
          <div style={{ position: "relative", borderLeft: `2px solid ${t.border}`, marginLeft: 10, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { date: "Mai 2026", titre: "Mise à jour Dossier Paie", desc: "Configuration des primes et retenues mensuelles." },
              { date: "Septembre 2024", titre: "Évaluation Annuelle", desc: "Note pédagogique validée avec une mention d'excellence." },
              { date: staff.dateEmbauche, titre: "Embauche Initiale", desc: `Intégration au sein de SchoolX en contrat ${staff.contrat}.` }
            ].map((item, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: -22, top: 4, width: 10, height: 10, borderRadius: "50%", background: t.blue, border: `2px solid ${t.surface}` }} />
                <span style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>{item.date}</span>
                <strong style={{ fontSize: 13, color: t.text, display: "block", marginTop: 2 }}>{item.titre}</strong>
                <span style={{ fontSize: 11.5, color: t.sub }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RH() {
  
  const [activeTab, setActiveTab] = useState("effectifs"); // effectifs | fiches | presences | conges | salaires | recrutement
  const [employes, setEmployes] = useState(initialEmployes);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [confirmDelEmp, setConfirmDelEmp] = useState(null);

  // Search & Advanced Filters
  const [search, setSearch] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("Tous");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterAnciennete, setFilterAnciennete] = useState("Tous");

  // Selected Employee Dossier
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [dossierTab, setDossierTab] = useState("profil"); // profil | planning | historique
  const [selectedPayslip, setSelectedPayslip] = useState(null); // payslip print modal

  // Daily Attendance State
  const [attendanceToday, setAttendanceToday] = useState({
    1: "present", 2: "present", 3: "retard", 4: "absent", 5: "present", 6: "present", 7: "present", 8: "present"
  });
  const [attendanceLogs, setAttendanceLogs] = useState([
    { date: "17/05/2026", presents: 7, retards: 1, absents: 0 },
    { date: "16/05/2026", presents: 6, retards: 1, absents: 1 },
    { date: "15/05/2026", presents: 8, retards: 0, absents: 0 },
  ]);

  // Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, nom: "M. Ibrahima Camara", poste: "Professeur d'Histoire", type: "Congé Annuel", debut: "20/05/2026", fin: "30/05/2026", jours: 10, statut: "Approuvé" },
    { id: 2, nom: "Kadiatou Traoré", poste: "Secrétaire Générale", type: "Maternité", debut: "01/06/2026", fin: "30/08/2026", jours: 90, statut: "En attente" },
    { id: 3, nom: "Mariama Condé", poste: "Assistante administrative / Surveillante", type: "Maladie", debut: "12/05/2026", fin: "14/05/2026", jours: 2, statut: "Refusé" },
  ]);

  // Notifications RH State
  const [alerts, setAlerts] = useState([
    { id: 1, type: "cdd", text: "Le contrat CDD de M. Ibrahima Camara expire dans 14 jours !", date: "Aujourd'hui" },
    { id: 2, type: "anniv", text: "Anniversaire aujourd'hui : Mme Fatoumata Bah (Physique) !", date: "Aujourd'hui" },
    { id: 3, type: "absences", text: "Alerte absentéisme : Mariama Condé a accumulé 4 absences ce mois-ci.", date: "Hier" },
  ]);
  const { addNotification } = useNotifications();
    useEffect(() => {
      alerts.forEach(a => {
        addNotification({
          id: `rh-${a.id}`,
          source: "Gestion RH",
          titre: a.type === "cdd" ? "Contrat CDD bientôt expiré" : a.type === "anniv" ? "Anniversaire" : "Alerte absentéisme",
          message: a.text,
          date: a.date,
        });
      });
    }, []); // une seule fois au montage — addNotification ignore déjà les doublons par id
  // Modals States
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);

  // Forms States
  const [newStaffForm, setNewStaffForm] = useState({
    nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "ti-school", categorie: "Enseignant"
  });
  const [newCandidateForm, setNewCandidateForm] = useState({
    nom: "", poste: "", diplome: "", email: "", tel: "", categorie: "Enseignant"
  });
  const [newLeaveForm, setNewLeaveForm] = useState({
    employeId: "", type: "Congé Annuel", debut: "", fin: "", jours: ""
  });

  // Helper: seniority calculation
  const getSeniorityYears = (dateStr) => {
    try {
      const [day, month, year] = dateStr.split("/").map(Number);
      const start = new Date(year, month - 1, day);
      const diffMs = Date.now() - start.getTime();
      return diffMs / (1000 * 60 * 60 * 24 * 365.25);
    } catch (e) {
      return 0;
    }
  };

  const formatSeniority = (dateStr) => {
    const years = getSeniorityYears(dateStr);
    if (years < 1) {
      const months = Math.round(years * 12);
      return `${months} mois`;
    }
    const fullYears = Math.floor(years);
    const months = Math.round((years - fullYears) * 12);
    return `${fullYears} an${fullYears > 1 ? 's' : ''} ${months > 0 ? `et ${months} mois` : ''}`;
  };

  // Derived Statistics Card values
  const totalSalaires = employes.reduce((a, e) => a + e.salaire, 0);
  const activeTeachersCount = employes.filter(e => e.categorie === "Enseignant" && e.status === "Actif").length;

  // Dynamic monthly attendance total
  const totalAbsencesMonth = employes.reduce((sum, e) => sum + e.absences, 0) + Object.values(attendanceToday).filter(v => v === "absent").length;
  const activeLeavesCount = employes.filter(e => e.status === "En congé").length;

  // Filter Employees List
  const filteredEmployes = employes.filter(e => {
    const matchesSearch = e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.poste.toLowerCase().includes(search.toLowerCase());
    const matchesCategorie = filterCategorie === "Tous" || e.categorie === filterCategorie;
    const matchesStatut = filterStatut === "Tous" || e.status === filterStatut;

    let matchesAnciennete = true;
    if (filterAnciennete !== "Tous") {
      const years = getSeniorityYears(e.dateEmbauche);
      if (filterAnciennete === "Moins de 2 ans") matchesAnciennete = years < 2;
      else if (filterAnciennete === "2 à 5 ans") matchesAnciennete = years >= 2 && years <= 5;
      else if (filterAnciennete === "Plus de 5 ans") matchesAnciennete = years > 5;
    }

    return matchesSearch && matchesCategorie && matchesStatut && matchesAnciennete;
  });

  const { showToast } = useToast();
  const [rhErrors, setRhErrors] = useState({});
  // Handle Add / Edit Employee
  const handleAddEmployee = () => {
    const errs = {};
    if (!newStaffForm.nom.trim()) errs.nom = "Le nom est requis";
    if (!newStaffForm.poste.trim()) errs.poste = "Le poste est requis";
    const sal = parseInt(newStaffForm.salaire);
    if (!newStaffForm.salaire || isNaN(sal) || sal <= 0) errs.salaire = "Le salaire doit être supérieur à 0";
    if (newStaffForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaffForm.email)) errs.email = "Format email invalide";
    if (Object.keys(errs).length > 0) {
      setRhErrors(errs);
      showToast("Veuillez corriger les champs en rouge", "error");
      return;
    }
    setRhErrors({});
    const scheduleArray = typeof newStaffForm.emploiDuTemps === 'string'
      ? newStaffForm.emploiDuTemps.split(";").map(s => s.trim())
      : newStaffForm.emploiDuTemps;
  
    if (newStaffForm.id) {
      setEmployes(employes.map(e => e.id === newStaffForm.id ? { ...e, ...newStaffForm, emploiDuTemps: scheduleArray } : e));
      setNewStaffForm({
        nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "ti-school", categorie: "Enseignant"
      });
      setShowAddStaffModal(false);
      showToast("Collaborateur mis à jour", "success");
      return;
    }

    const newEmp = {
      id: Date.now(),
      nom: newStaffForm.nom,
      poste: newStaffForm.poste,
      salaire: parseInt(newStaffForm.salaire) || 1500000,
      contrat: newStaffForm.contrat,
      dateEmbauche: new Date().toLocaleDateString("fr-FR"),
      status: "Actif",
      diplome: newStaffForm.diplome || "Diplôme Universitaire",
      evaluation: 4.5,
      absences: 0,
      telephone: newStaffForm.telephone || "+224 620 00 00 00",
      email: newStaffForm.email || `${newStaffForm.nom.toLowerCase().replace(/\s+/g, '')}@schoolx.gn`,
      emploiDuTemps: scheduleArray,
      avatar: newStaffForm.avatar,
      categorie: newStaffForm.categorie || "Enseignant",
      primes: 0,
      retenues: 0,
      statutPaie: "En attente",
      datePaie: "",
      joursCongesRestants: 30
    };

    setEmployes([...employes, newEmp]);
    setNewStaffForm({
      nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "ti-school", categorie: "Enseignant"
    });
    setShowAddStaffModal(false);
    showToast(`${newEmp.nom} ajouté à l'équipe`, "success");

    // Add alert notification
    setAlerts([
      { id: Date.now(), type: "recruit", text: `Nouveau recrutement : Bienvenue à ${newEmp.nom} (${newEmp.poste}) !`, date: "Aujourd'hui" },
      ...alerts
    ]);
  };

  const handleDeleteEmployee = (empId) => {
    setEmployes(employes.filter(e => e.id !== empId));
    showToast("Employé supprimé de l'équipe", "error");
  };

  // Handle Add Candidate
  const handleAddCandidate = () => {
    const errs = {};
    if (!newCandidateForm.nom.trim()) errs.candNom = "Le nom du candidat est requis";
    if (!newCandidateForm.poste.trim()) errs.candPoste = "Le poste ciblé est requis";
    if (Object.keys(errs).length > 0) {
      setRhErrors(errs);
      showToast("Veuillez corriger les champs en rouge", "error");
      return;
    }
    setRhErrors({});
    const newCand = {
      id: Date.now(),
      nom: newCandidateForm.nom,
      poste: newCandidateForm.poste,
      diplome: newCandidateForm.diplome || "Master",
      etape: "CV",
      date: new Date().toLocaleDateString("fr-FR"),
      email: newCandidateForm.email || "candidat@email.com",
      tel: newCandidateForm.tel || "+224 620 00 00 00",
      categorie: newCandidateForm.categorie || "Enseignant"
    };

    setCandidates([...candidates, newCand]);
    setNewCandidateForm({ nom: "", poste: "", diplome: "", email: "", tel: "", categorie: "Enseignant" });
    setShowAddCandidateModal(false);
    showToast(`Candidature de ${newCand.nom} enregistrée`, "success");
  };

  // Handle Move Candidate Etape
  const handleMoveCandidate = (candId, nextEtape) => {
    setCandidates(candidates.map(c => c.id === candId ? { ...c, etape: nextEtape } : c));
    const cand = candidates.find(c => c.id === candId);
    if (cand) {
      showToast(`Candidat ${cand.nom} déplacé vers : ${nextEtape}`, "info");
    }
  };

  // Handle Leave Submission
  const handleAddLeave = () => {
    const errs = {};
    if (!newLeaveForm.employeId) errs.leaveEmp = "Veuillez sélectionner un employé";
    if (!newLeaveForm.debut) errs.leaveDebut = "La date de début est requise";
    if (!newLeaveForm.fin) errs.leaveFin = "La date de fin est requise";
    if (newLeaveForm.debut && newLeaveForm.fin && newLeaveForm.fin < newLeaveForm.debut) errs.leaveFin = "La date de fin doit être après la date de début";
    const j = parseInt(newLeaveForm.jours);
    if (!newLeaveForm.jours || isNaN(j) || j <= 0) errs.leaveJours = "Le nombre de jours doit être supérieur à 0";
    if (Object.keys(errs).length > 0) {
      setRhErrors(errs);
      showToast("Veuillez corriger les champs en rouge", "error");
      return;
    }
    setRhErrors({});
    const selectedEmp = employes.find(e => e.id === parseInt(newLeaveForm.employeId));

    const newReq = {
      id: Date.now(),
      nom: selectedEmp.nom,
      poste: selectedEmp.poste,
      type: newLeaveForm.type,
      debut: new Date(newLeaveForm.debut).toLocaleDateString("fr-FR"),
      fin: new Date(newLeaveForm.fin).toLocaleDateString("fr-FR"),
      jours: parseInt(newLeaveForm.jours),
      statut: "En attente"
    };

    setLeaveRequests([...leaveRequests, newReq]);
    setShowAddLeaveModal(false);
    setNewLeaveForm({ employeId: "", type: "Congé Annuel", debut: "", fin: "", jours: "" });
    showToast(`Demande de congé pour ${selectedEmp.nom} soumise`, "success");
  };

  // Approve/Refuse Leave Requests
  const handleLeaveDecision = (reqId, isApproved) => {

    showToast(
      isApproved ? "Congé approuvé" : "Congé refusé",
      isApproved ? "success" : "warning"
    );
    setLeaveRequests(leaveRequests.map(r => {
      if (r.id === reqId) {
        const newStatus = isApproved ? "Approuvé" : "Refusé";

        // If approved, update the employee's main status to "En congé" and deduct leave balance
        if (isApproved) {
          setEmployes(prev => prev.map(e => {
            if (e.nom === r.nom) {
              return {
                ...e,
                status: "En congé",
                joursCongesRestants: Math.max(0, e.joursCongesRestants - r.jours)
              };
            }
            return e;
          }));
        }
        return { ...r, statut: newStatus };
      }
      return r;
    }));
  };

  // Toggle Payroll Payment
  const handlePaySalary = (empId) => {
    showToast("Salaire marqué comme payé", "success");

    setEmployes(prev => prev.map(e => {
      if (e.id === empId) {
        return {
          ...e,
          statutPaie: "Payé",
          datePaie: new Date().toLocaleDateString("fr-FR")
        };
      }
      return e;
    }));
  };

  // Inline salary bonus/deductions update
  const handleSalaryAdjustment = (empId, field, amount) => {
    setEmployes(prev => prev.map(e => {
      if (e.id === empId) {
        return { ...e, [field]: Math.max(0, amount) };
      }
      return e;
    }));
  };

  // Attendance Tracker Daily Pointer
  const handleAttendanceChange = (empId, status) => {
    setAttendanceToday({ ...attendanceToday, [empId]: status });
  };

  // Parse custom schedule array to visual grid
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const parseSchedule = (scheduleArray) => {
    const parsed = {};
    if (!scheduleArray) return parsed;
    scheduleArray.forEach(s => {
      const match = s.match(/(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Lundi au Vendredi)\s*(?:\((.*?)\))?/);
      if (match) {
        const dayKey = match[1];
        const hours = match[2] || "08h - 17h";
        if (dayKey === "Lundi au Vendredi") {
          daysOfWeek.forEach(d => {
            parsed[d] = hours;
          });
        } else {
          parsed[dayKey] = hours;
        }
      }
    });
    return parsed;
  };

  if (selectedStaff) return (
    <FicheEnseignant
      staff={selectedStaff}
      tab={dossierTab}
      setTab={setDossierTab}
      onRetour={() => setSelectedStaff(null)}
      onEdit={e => {
        setSelectedStaff(null);
        setNewStaffForm({ ...e, emploiDuTemps: Array.isArray(e.emploiDuTemps) ? e.emploiDuTemps.join("; ") : e.emploiDuTemps });
        setShowAddStaffModal(true);
      }}
      onDelete={e => { setSelectedStaff(null); setConfirmDelEmp(e); }}
      formatSeniority={formatSeniority}
      daysOfWeek={daysOfWeek}
      parseSchedule={parseSchedule}
    />
  );

  return (
    <div style={{ fontFamily: t.font, color: t.text }}>

      {/* ALERTS / NOTIFICATIONS SECTION */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {alerts.slice(0, 3).map(alert => {
              const alertColor = alert.type === "absences" ? t.red : alert.type === "cdd" ? t.amber : t.blue;
              const alertSoft = alert.type === "absences" ? t.redSoft : alert.type === "cdd" ? t.amberSoft : t.blueSoft;
              return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderLeft: `3px solid ${alertColor}`,
                  borderRadius: t.radius,
                  padding: "11px 16px", boxShadow: t.shadow,
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: alertSoft,
                    color: alertColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <i className={`ti ${alert.type === "cdd" ? "ti-clock" :
                        alert.type === "anniv" ? "ti-gift" :
                          alert.type === "absences" ? "ti-alert-triangle" :
                            alert.type === "recruit" ? "ti-user-plus" : "ti-bell"
                      }`} style={{ fontSize: 15 }} />
                  </div>
                  <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{alert.text}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 11.5, color: t.muted }}>{alert.date}</span>
                  <button
                    onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: t.muted, fontSize: 14, display: "flex", alignItems: "center" }}
                  ><i className="ti ti-x" /></button>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: t.text }}>
            Gestion des Ressources Humaines
          </h1>
          <p style={{ fontSize: 13, color: t.sub, margin: 0, marginTop: 4 }}>
            Pilotage complet de l'équipe scolaire, suivi des absences, congés, rémunérations et recrutement.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {activeTab === "recrutement" ? (
            <button onClick={() => setShowAddCandidateModal(true)} style={{ ...primaryBtnStyle }}>
              <i className="ti ti-user-plus" style={{ fontSize: 14 }} /> Nouveau Candidat
            </button>
          ) : activeTab === "conges" ? (
            <button onClick={() => setShowAddLeaveModal(true)} style={{ ...primaryBtnStyle }}>
              <i className="ti ti-plane-departure" style={{ fontSize: 14 }} /> Demander un congé
            </button>
          ) : (
            <button onClick={() => {
              setNewStaffForm({ nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "👨‍🏫", categorie: "Enseignant" });
              setShowAddStaffModal(true);
            }} style={{ ...primaryBtnStyle }}>
              <i className="ti ti-user-plus" style={{ fontSize: 14 }} /> Ajouter un Employé
            </button>
          )}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        {[
          { label: "Membres de l'équipe", value: employes.length, icon: <i className="ti ti-users" style={{ fontSize: 19 }} />, bg: t.blueSoft, color: t.blue },
          { label: "Enseignants Actifs", value: activeTeachersCount, icon: <i className="ti ti-school" style={{ fontSize: 19 }} />, bg: t.greenSoft, color: t.green },
          { label: "Absences du mois", value: totalAbsencesMonth, icon: <i className="ti ti-alert-triangle" style={{ fontSize: 19 }} />, bg: t.redSoft, color: t.red },
          { label: "Congés en cours", value: activeLeavesCount, icon: <i className="ti ti-plane-departure" style={{ fontSize: 19 }} />, bg: t.amberSoft, color: t.amber },
        ].map((card, idx) => (
          <motion.div key={idx} className="stat-card" whileHover={{ y: -3, boxShadow: t.shadowMd }} whileTap={{ y: 0, scale: 0.98 }} style={{ cursor: "pointer" }}>
            <div className="icon-box" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
            <div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{card.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* NAVIGATION TABS */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        borderBottom: `1px solid ${t.border}`,
        marginBottom: 20
      }}>
        {[
          { id: "effectifs", label: "Effectifs", icon: <i className="ti ti-clipboard-list" style={{ fontSize: 14 }} /> },
          { id: "fiches", label: "Fiches & Évaluations", icon: <i className="ti ti-folder" style={{ fontSize: 14 }} /> },
          { id: "presences", label: "Présences", icon: <i className="ti ti-calendar" style={{ fontSize: 14 }} /> },
          { id: "conges", label: "Congés", icon: <i className="ti ti-plane-departure" style={{ fontSize: 14 }} /> },
          { id: "salaires", label: "Paie & Salaires", icon: <i className="ti ti-cash" style={{ fontSize: 14 }} /> },
          { id: "recrutement", label: "Recrutement", icon: <i className="ti ti-briefcase" style={{ fontSize: 14 }} /> },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.99 }}
              style={{
                border: "none",
                borderBottom: isActive ? `2px solid ${t.blue}` : "2px solid transparent",
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                background: "transparent",
                color: isActive ? t.blue : t.sub,
                fontFamily: t.font,
                marginBottom: -1,
                transition: "all .15s",
                whiteSpace: "nowrap",
                outline: "none"
              }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: EFFECTIFS TABLE */}
      {activeTab === "effectifs" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

          {/* SEARCH BAR & DYNAMIC FILTERS */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 240px", minWidth: 0 }}>
              <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.muted, fontSize: 15 }} />
              <input type="text" placeholder="Rechercher par nom ou poste..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, padding: "10px 12px 10px 36px", borderRadius: t.radius, boxShadow: t.shadow }} />
            </div>

            <div style={{ flex: "0 1 180px", minWidth: 0 }}>
              <select value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)} style={{ ...selectFilterStyle }}>
                <option value="Tous">Toutes Catégories</option>
                <option value="Enseignant">Enseignants</option>
                <option value="Administration">Administration</option>
                <option value="Services & Soutien">Services & Soutien</option>
              </select>
            </div>

            <div style={{ flex: "0 1 180px", minWidth: 0 }}>
              <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ ...selectFilterStyle }}>
                <option value="Tous">Tous Statuts</option>
                <option value="Actif">Actifs</option>
                <option value="En congé">En congé</option>
                <option value="Suspendu">Suspendus</option>
                <option value="Absent">Absents</option>
              </select>
            </div>

            <div style={{ flex: "0 1 190px", minWidth: 0 }}>
              <select value={filterAnciennete} onChange={e => setFilterAnciennete(e.target.value)} style={{ ...selectFilterStyle }}>
                <option value="Tous">Toutes Anciennetés</option>
                <option value="Moins de 2 ans">Moins de 2 ans</option>
                <option value="2 à 5 ans">2 à 5 ans</option>
                <option value="Plus de 5 ans">Plus de 5 ans</option>
              </select>
            </div>
          </div>

          {/* TABLE CONTAINER */}
            
          <div style={{ ...cardStyle, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
                <thead>
                  <tr style={{ background: t.bg }}>
                    {["Employé", "Poste", "Contrat", "Salaire", "Embauche", "Statut", "Actions"].map(h => (
                      <th key={h} style={{ ...thStyle }}>{h}</th>
                    ))}
                    <th style={{ ...thStyle, width: 30 }}></th>
                  </tr>
                </thead>
                <tbody>
                <AnimatePresence>
                  {filteredEmployes.map(e => (
                    <motion.tr key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => { setSelectedStaff(e); setDossierTab("profil"); }}
                      style={{ borderBottom: `1px solid ${t.border}`, cursor: "pointer", transition: "background .12s" }}
                      onMouseEnter={el => el.currentTarget.style.background = t.bg}
                      onMouseLeave={el => el.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          {renderAvatar(e, 32, 12)}
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: t.text, display: "block" }}>{e.nom}</span>
                            <span style={{ fontSize: 11, color: t.muted, display: "block", marginTop: 1 }}>{e.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ fontSize: 13, color: t.text, fontWeight: 600, display: "block" }}>{e.poste}</span>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: NEUTRAL_CHIP, color: t.sub, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                          <i className="ti ti-briefcase" style={{ fontSize: 11 }} /> {e.categorie}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ ...chipStyle, ...contratStyle[e.contrat] }}>{e.contrat}</span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: t.text }}>{e.salaire.toLocaleString()} GNF</td>
                      <td style={{ padding: "11px 16px", fontSize: 13, color: t.sub }}>{e.dateEmbauche}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ ...chipStyle, ...statusStyle[e.status] }}>{e.status}</span>
                      </td>
                      <td style={{ padding: "11px 14px" }} onClick={ev => ev.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 6 }}>
                          <button title="Modifier" onClick={ev => {
                            ev.stopPropagation();
                            setNewStaffForm({ ...e, emploiDuTemps: Array.isArray(e.emploiDuTemps) ? e.emploiDuTemps.join("; ") : e.emploiDuTemps });
                            setShowAddStaffModal(true);
                          }} style={{ background: t.surface, color: t.sub, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center" }}>
                            <i className="ti ti-pencil" style={{ fontSize: 14 }} />
                          </button>
                          <button title="Supprimer" onClick={ev => { ev.stopPropagation(); setConfirmDelEmp(e); }} style={{ background: t.redSoft, color: t.red, border: `1px solid ${t.redSoft}`, borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center" }}>
                            <i className="ti ti-trash" style={{ fontSize: 14 }} />
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        <i className="ti ti-chevron-right" style={{ fontSize: 15, color: t.muted }} />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredEmployes.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: 48, color: t.muted, fontSize: 13 }}>
                      <i className="ti ti-search" style={{ fontSize: 28, display: "block", marginBottom: 10, color: t.border }} />
                      Aucun membre de l'équipe trouvé avec les filtres sélectionnés.
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 2: FICHES ET EVALUATIONS GRID */}
      {activeTab === "fiches" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

          <div style={{ position: "relative", marginBottom: 16 }}>
            <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.muted, fontSize: 15 }} />
            <input type="text" placeholder="Rechercher parmi les enseignants..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, padding: "10px 12px 10px 36px", borderRadius: t.radius, boxShadow: t.shadow }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, alignItems: "start" }}>
            {employes.filter(e => e.categorie === "Enseignant" && e.nom.toLowerCase().includes(search.toLowerCase())).map(emp => (
              <motion.div key={emp.id} whileHover={{ y: -3, boxShadow: t.shadowMd }} style={{ ...cardStyle, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {renderAvatar(emp, 44, 14)}
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text }}>{emp.nom}</h3>
                    <span style={{ fontSize: 11.5, color: t.blue, fontWeight: 600 }}>{emp.poste}</span>
                  </div>
                </div>

                <div style={{ background: t.bg, borderRadius: t.radius, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, color: t.sub, fontWeight: 500 }}>Évaluation Pédagogique :</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="ti ti-star" style={{ color: t.amber, fontSize: 15 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{emp.evaluation} / 5</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "8px 10px" }}>
                    <span style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", display: "block" }}>Diplôme</span>
                    <strong style={{ fontSize: 13, color: t.text, display: "block", marginTop: 3, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{emp.diplome}</strong>
                  </div>
                  <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "8px 10px" }}>
                    <span style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", display: "block" }}>Ancienneté</span>
                    <strong style={{ fontSize: 13, color: t.text, display: "block", marginTop: 3 }}>{formatSeniority(emp.dateEmbauche)}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button onClick={() => { setSelectedStaff(emp); setDossierTab("planning"); }} style={{ flex: 1, padding: "8px 0", background: t.surface, color: t.sub, border: `1px solid ${t.border}`, borderRadius: t.radius, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <i className="ti ti-calendar" style={{ fontSize: 13 }} /> Emploi du Temps
                  </button>
                  <button onClick={() => { setSelectedStaff(emp); setDossierTab("profil"); }} style={{ flex: 1, padding: "8px 0", background: t.blue, color: "#fff", border: "none", borderRadius: t.radius, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <i className="ti ti-eye" style={{ fontSize: 13 }} /> Dossier complet
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 3: DAILY ATTENDANCE LOGGER */}
      {activeTab === "presences" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 14, alignItems: "start" }}>

          {/* MAIN PANEL */}
          <div style={{ ...cardStyle, padding: "18px 20px" }}>
            <h2 style={{ ...sectionTitleStyle }}>
              <i className="ti ti-calendar" style={{ color: t.blue, fontSize: 16 }} /> Pointage Quotidien des Présences - {new Date().toLocaleDateString("fr-FR")}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
              <div style={{ background: t.greenSoft, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: 12, textAlign: "center" }}>
                <span style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", display: "block" }}>Présents aujourd'hui</span>
                <span style={{ fontSize: 19, fontWeight: 700, color: t.green, marginTop: 4, display: "block" }}>
                  {Object.values(attendanceToday).filter(v => v === "present").length}
                </span>
              </div>
              <div style={{ background: t.amberSoft, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: 12, textAlign: "center" }}>
                <span style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", display: "block" }}>Retards aujourd'hui</span>
                <span style={{ fontSize: 19, fontWeight: 700, color: t.amber, marginTop: 4, display: "block" }}>
                  {Object.values(attendanceToday).filter(v => v === "retard").length}
                </span>
              </div>
              <div style={{ background: t.redSoft, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: 12, textAlign: "center" }}>
                <span style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", display: "block" }}>Absents aujourd'hui</span>
                <span style={{ fontSize: 19, fontWeight: 700, color: t.red, marginTop: 4, display: "block" }}>
                  {Object.values(attendanceToday).filter(v => v === "absent").length}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {employes.map(e => {
                const currentStatus = attendanceToday[e.id] || "present";
                return (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 12, borderRadius: t.radius, border: `1px solid ${t.border}`, background: t.bg }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {renderAvatar(e, 36, 12)}
                      <div>
                        <strong style={{ fontSize: 13, color: t.text, display: "block", fontWeight: 600 }}>{e.nom}</strong>
                        <span style={{ fontSize: 11, color: t.muted }}>{e.poste}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => handleAttendanceChange(e.id, "present")}
                        style={{
                          padding: "6px 11px", borderRadius: t.radius, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
                          background: currentStatus === "present" ? t.greenSoft : t.surface,
                          color: currentStatus === "present" ? t.green : t.sub,
                          border: `1px solid ${currentStatus === "present" ? t.green : t.border}`,
                          transition: "all .15s",
                          display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <i className="ti ti-check" style={{ fontSize: 12 }} /> Présent
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(e.id, "retard")}
                        style={{
                          padding: "6px 11px", borderRadius: t.radius, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
                          background: currentStatus === "retard" ? t.amberSoft : t.surface,
                          color: currentStatus === "retard" ? t.amber : t.sub,
                          border: `1px solid ${currentStatus === "retard" ? t.amber : t.border}`,
                          transition: "all .15s",
                          display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <i className="ti ti-clock" style={{ fontSize: 12 }} /> Retard
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(e.id, "absent")}
                        style={{
                          padding: "6px 11px", borderRadius: t.radius, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
                          background: currentStatus === "absent" ? t.redSoft : t.surface,
                          color: currentStatus === "absent" ? t.red : t.sub,
                          border: `1px solid ${currentStatus === "absent" ? t.red : t.border}`,
                          transition: "all .15s",
                          display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <i className="ti ti-x" style={{ fontSize: 12 }} /> Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HISTORICAL LOG */}
          <div style={{ ...cardStyle, padding: "18px 20px" }}>
            <h3 style={{ ...sectionTitleStyle }}>
              <i className="ti ti-history" style={{ color: t.blue, fontSize: 16 }} /> Historique des Présences
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {attendanceLogs.map((log, idx) => (
                <div key={idx} style={{ padding: 12, borderRadius: t.radius, border: `1px solid ${t.border}`, background: t.bg }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: t.text }}>{log.date}</span>
                    <span style={{ fontSize: 11, color: t.green, fontWeight: 600 }}>Actif</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: t.sub }}>
                    <span>P: <strong style={{ color: t.text }}>{log.presents}</strong></span>
                    <span>R: <strong style={{ color: t.text }}>{log.retards}</strong></span>
                    <span>A: <strong style={{ color: t.text }}>{log.absents}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 4: LEAVE MANAGEMENT */}
      {activeTab === "conges" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 14, alignItems: "start" }}>

          {/* DEMANDES DE CONGES */}
          <div style={{ ...cardStyle, padding: "18px 20px" }}>
            <h2 style={{ ...sectionTitleStyle }}>
              <i className="ti ti-plane-departure" style={{ color: t.blue, fontSize: 16 }} /> Demandes &amp; Absences Planifiées
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
                <thead>
                  <tr style={{ background: t.bg }}>
                    {["Collaborateur", "Type de congé", "Dates (Début - Fin)", "Jours", "Statut", "Décision"].map(h => (
                      <th key={h} style={{ ...thStyle, padding: "11px 14px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map(r => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                      <td style={{ padding: "13px 14px" }}>
                        <strong style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{r.nom}</strong>
                        <span style={{ fontSize: 11, color: t.muted, display: "block", marginTop: 1 }}>{r.poste}</span>
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ ...chipStyle, background: NEUTRAL_CHIP, color: t.sub }}>{r.type}</span>
                      </td>
                      <td style={{ padding: "13px 14px", fontSize: 13, color: t.sub }}>{r.debut} - {r.fin}</td>
                      <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600, color: t.text }}>{r.jours} j</td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{
                          ...chipStyle,
                          background: r.statut === "Approuvé" ? t.greenSoft : r.statut === "Refusé" ? t.redSoft : t.amberSoft,
                          color: r.statut === "Approuvé" ? t.green : r.statut === "Refusé" ? t.red : t.amber
                        }}>
                          {r.statut}
                        </span>
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        {r.statut === "En attente" ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleLeaveDecision(r.id, true)} style={{ background: t.greenSoft, color: t.green, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 9px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font }}>Approuver</button>
                            <button onClick={() => handleLeaveDecision(r.id, false)} style={{ background: t.redSoft, color: t.red, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 9px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font }}>Refuser</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11.5, color: t.muted }}>Traité</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BALANCE AND ACTION */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...cardStyle, padding: "18px 20px" }}>
              <h3 style={{ ...sectionTitleStyle }}>
                <i className="ti ti-beach" style={{ color: t.blue, fontSize: 16 }} /> Soldes de Congés Restants
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {employes.map(e => (
                  <div key={e.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 5 }}>
                      <span style={{ fontWeight: 500, color: t.text }}>{e.nom}</span>
                      <strong style={{ color: t.blue, fontWeight: 600 }}>{e.joursCongesRestants} / 30 jours</strong>
                    </div>
                    <div style={{ height: 6, background: t.border, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${(e.joursCongesRestants / 30) * 100}%`, height: "100%", background: t.blue, borderRadius: 99, transition: "width .6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 5: PAYROLL TABLE */}
      {activeTab === "salaires" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Masse de base", value: totalSalaires, icon: "ti-wallet", c: t.blue, bg: t.blueSoft },
              { label: "Primes du mois", value: employes.reduce((sum, e) => sum + e.primes, 0), icon: "ti-trending-up", c: t.green, bg: t.greenSoft },
              { label: "Retenues constatées", value: employes.reduce((sum, e) => sum + e.retenues, 0), icon: "ti-trending-down", c: t.red, bg: t.redSoft },
              { label: "Net total à payer", value: employes.reduce((sum, e) => sum + (e.salaire + e.primes - e.retenues), 0), icon: "ti-cash", c: t.blue, bg: t.blueSoft },
            ].map(box => (
              <div key={box.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: t.shadow }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: box.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`ti ${box.icon}`} style={{ fontSize: 18, color: box.c }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>{box.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginTop: 2, lineHeight: 1.2 }}>{box.value.toLocaleString()} GNF</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr style={{ background: t.bg }}>
                  {["Collaborateur", "Salaire de base", "Primes (+)", "Retenues (-)", "Salaire Net", "Statut Paie", "Date Paiement", "Actions"].map(h => (
                    <th key={h} style={{ ...thStyle }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employes.map(e => {
                  const net = e.salaire + e.primes - e.retenues;
                  return (
                    <tr key={e.id} style={{ borderBottom: `1px solid ${t.border}`, transition: "background .12s" }}
                      onMouseEnter={el => el.currentTarget.style.background = t.bg}
                      onMouseLeave={el => el.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 16px" }}>
                        <strong style={{ fontSize: 13, fontWeight: 600, color: t.text, display: "block" }}>{e.nom}</strong>
                        <span style={{ fontSize: 11, color: t.muted }}>{e.poste}</span>
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 500, color: t.sub }}>{e.salaire.toLocaleString()} GNF</td>
                      <td style={{ padding: "13px 16px" }}>
                        <input
                          type="number"
                          value={e.primes}
                          onChange={(evt) => handleSalaryAdjustment(e.id, "primes", parseInt(evt.target.value) || 0)}
                          style={{ ...inputStyle, width: 90, padding: "6px 8px", borderRadius: t.radius }}
                        />
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <input
                          type="number"
                          value={e.retenues}
                          onChange={(evt) => handleSalaryAdjustment(e.id, "retenues", parseInt(evt.target.value) || 0)}
                          style={{ ...inputStyle, width: 90, padding: "6px 8px", borderRadius: t.radius }}
                        />
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: t.text }}>{net.toLocaleString()} GNF</td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{
                          ...chipStyle,
                          background: e.statutPaie === "Payé" ? t.greenSoft : t.amberSoft,
                          color: e.statutPaie === "Payé" ? t.green : t.amber
                        }}>
                          {e.statutPaie}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: t.sub }}>{e.datePaie || "—"}</td>
                      <td style={{ padding: "13px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {e.statutPaie === "En attente" && (
                            <button onClick={() => handlePaySalary(e.id)} style={{ background: t.green, color: "#fff", border: "none", borderRadius: t.radius, padding: "5px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", gap: 4 }}>
                              <i className="ti ti-cash" style={{ fontSize: 12 }} /> Payer
                            </button>
                          )}
                          <button onClick={() => setSelectedPayslip(e)} style={{ background: t.surface, color: t.sub, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", gap: 4 }}>
                            <i className="ti ti-file-text" style={{ fontSize: 12 }} /> Bulletin
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 6: RECRUTEMENT KANBAN */}
      {activeTab === "recrutement" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12, alignItems: "start" }}>
            {[
              { id: "CV", label: "CVs Reçus", icon: <i className="ti ti-download" style={{ fontSize: 15 }} />, color: t.blue, bg: t.blueSoft },
              { id: "Entretien", label: "Entretiens en cours", icon: <i className="ti ti-messages" style={{ fontSize: 15 }} />, color: t.amber, bg: t.amberSoft },
              { id: "Offres", label: "Offre formulée", icon: <i className="ti ti-hand-shake" style={{ fontSize: 15 }} />, color: t.blue, bg: t.blueSoft },
              { id: "Engage", label: "Recruté(e)s", icon: <i className="ti ti-user-check" style={{ fontSize: 15 }} />, color: t.green, bg: t.greenSoft },
            ].map(col => {
              const colCandidates = candidates.filter(c => c.etape === col.id);
              return (
                <div key={col.id} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: 14, minHeight: 480 }}>

                  {/* COLUMN HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ fontSize: 12, fontWeight: 700, color: col.color, margin: 0, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: ".4px" }}>{col.icon} {col.label}</h3>
                    <span style={{ background: col.bg, color: col.color, borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                      {colCandidates.length}
                    </span>
                  </div>

                  {/* CARDS */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {colCandidates.map(cand => (
                      <motion.div key={cand.id} whileHover={{ y: -3, boxShadow: t.shadowMd }} style={{ background: t.surface, borderRadius: t.radius, border: `1px solid ${t.border}`, boxShadow: t.shadow, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <h4 style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0 }}>{cand.nom}</h4>
                          <span style={{ fontSize: 11.5, color: t.sub, display: "block", marginTop: 2 }}>{cand.poste}</span>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 7 }}>
                            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: NEUTRAL_CHIP, color: t.sub, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <i className="ti ti-briefcase" style={{ fontSize: 11 }} /> {cand.categorie || "Enseignant"}
                            </span>
                            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: col.bg, color: col.color, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <i className="ti ti-school" style={{ fontSize: 11 }} /> {cand.diplome}
                            </span>
                          </div>
                        </div>

                        <div style={{ fontSize: 11, color: t.muted, display: "flex", flexDirection: "column", gap: 2, borderTop: `1px solid ${t.border}`, paddingTop: 8 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i className="ti ti-mail" style={{ fontSize: 12 }} /> {cand.email}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i className="ti ti-phone" style={{ fontSize: 12 }} /> {cand.tel}</span>
                          <span style={{ marginTop: 4, display: "block" }}>Ajouté le: {cand.date}</span>
                        </div>

                        {/* FLOW CONTROLS */}
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 4 }}>
                          {col.id === "CV" && (
                            <button onClick={() => handleMoveCandidate(cand.id, "Entretien")} style={{ background: t.amberSoft, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 9px", fontSize: 12.5, fontWeight: 600, color: t.amber, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", gap: 4 }}>
                              <i className="ti ti-messages" style={{ fontSize: 12 }} /> Entretien <i className="ti ti-arrow-right" style={{ fontSize: 12 }} />
                            </button>
                          )}
                          {col.id === "Entretien" && (
                            <div style={{ display: "flex", gap: 5 }}>
                              <button onClick={() => handleMoveCandidate(cand.id, "CV")} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 9px", fontSize: 12.5, fontWeight: 600, color: t.sub, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", gap: 4 }}>
                                <i className="ti ti-arrow-left" style={{ fontSize: 12 }} /> Retour
                              </button>
                              <button onClick={() => handleMoveCandidate(cand.id, "Offres")} style={{ background: t.blueSoft, border: `1px solid ${t.blueMid}`, borderRadius: t.radius, padding: "5px 9px", fontSize: 12.5, fontWeight: 600, color: t.blue, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", gap: 4 }}>
                                <i className="ti ti-hand-shake" style={{ fontSize: 12 }} /> Offre <i className="ti ti-arrow-right" style={{ fontSize: 12 }} />
                              </button>
                            </div>
                          )}
                          {col.id === "Offres" && (
                            <div style={{ display: "flex", gap: 5 }}>
                              <button onClick={() => handleMoveCandidate(cand.id, "Entretien")} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 9px", fontSize: 12.5, fontWeight: 600, color: t.sub, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", gap: 4 }}>
                                <i className="ti ti-arrow-left" style={{ fontSize: 12 }} /> Retour
                              </button>
                              <button onClick={() => handleMoveCandidate(cand.id, "Engage")} style={{ background: t.greenSoft, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 9px", fontSize: 12.5, fontWeight: 600, color: t.green, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", gap: 4 }}>
                                <i className="ti ti-user-check" style={{ fontSize: 12 }} /> Recruter !
                              </button>
                            </div>
                          )}
                          {col.id === "Engage" && (
                            <span style={{ fontSize: 11, color: t.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-user-check" style={{ fontSize: 12 }} /> Prêt à l'embauche</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {colCandidates.length === 0 && (
                      <div style={{ border: `1px dashed ${t.border}`, borderRadius: t.radius, padding: "20px 10px", textAlign: "center", color: t.muted, fontSize: 12 }}>
                        Aucun candidat à cette étape
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}


      {/* 5. PAYSLIP PRINT MODAL MOCKUP */}
      <AnimatePresence>
        {selectedPayslip && (
          <div className="modal-overlay" onClick={() => setSelectedPayslip(null)} style={{ ...overlayStyle, zIndex: 350 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ ...modalCardStyle, width: "min(440px,94vw)", padding: 24, border: `1px solid ${t.border}` }}>

              {/* PAYSLIP HEADER */}
              <div style={{ textAlign: "center", borderBottom: `1px dashed ${t.border}`, paddingBottom: 14, marginBottom: 14 }}>
                <strong style={{ fontSize: 15, color: t.blue, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}><i className="ti ti-building" style={{ fontSize: 18 }} /> SCHOOLX GROUP ACADEMY</strong>
                <span style={{ fontSize: 11.5, color: t.sub }}>République de Guinée — Conakry</span>
                <h3 style={{ margin: "10px 0 0 0", fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: ".4px" }}>BULLETIN DE PAIE — MAI 2026</h3>
              </div>

              {/* EMPLOYEE INFO */}
              <div style={{ fontSize: 11.5, color: t.sub, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14, background: t.bg, border: `1px solid ${t.border}`, padding: 12, borderRadius: t.radius }}>
                <div>Collaborateur: <strong style={{ color: t.text }}>{selectedPayslip.nom}</strong></div>
                <div>Poste: <strong style={{ color: t.text }}>{selectedPayslip.poste}</strong></div>
                <div>Contrat: <strong style={{ color: t.text }}>{selectedPayslip.contrat}</strong></div>
                <div>Date: <strong style={{ color: t.text }}>{selectedPayslip.datePaie || new Date().toLocaleDateString("fr-FR")}</strong></div>
              </div>

              {/* PAYSLIP CALCULATION GRID */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13, borderBottom: `1px dashed ${t.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: t.sub }}>
                  <span>Salaire de base brut:</span>
                  <span style={{ color: t.text, fontWeight: 500 }}>{selectedPayslip.salaire.toLocaleString()} GNF</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: t.green }}>
                  <span>Primes &amp; Gratifications:</span>
                  <span style={{ fontWeight: 600 }}>+{selectedPayslip.primes.toLocaleString()} GNF</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: t.red }}>
                  <span>Retenues de Paie (Absences/Charges):</span>
                  <span style={{ fontWeight: 600 }}>-{selectedPayslip.retenues.toLocaleString()} GNF</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: t.blue, marginBottom: 20 }}>
                <span>NET PERÇU GLOBAL :</span>
                <span>{(selectedPayslip.salaire + selectedPayslip.primes - selectedPayslip.retenues).toLocaleString()} GNF</span>
              </div>

              {/* FOOTER */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setSelectedPayslip(null)} style={{ ...modalCancelBtnStyle }}>Fermer</button>
                <button onClick={() => { alert("Impression simulée déclenchée !"); setSelectedPayslip(null); }} style={{ ...modalConfirmBtnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><i className="ti ti-printer" style={{ fontSize: 14 }} /> Imprimer Bulletin</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. ADD LEAVE REQUEST MODAL */}
      <AnimatePresence>
        {showAddLeaveModal && (
          <div className="modal-overlay" onClick={() => setShowAddLeaveModal(false)} style={{ ...overlayStyle, zIndex: 300 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ ...modalCardStyle, width: "min(440px,94vw)" }}>
              <div style={{ ...modalHeaderStyle }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: t.blueSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className="ti ti-plane-departure" style={{ fontSize: 19, color: t.blue }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text }}>Enregistrer un congé</h2>
                    <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>Caisse &amp; Ressources Humaines</span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowAddLeaveModal(false)} style={{ ...modalCloseStyle }}>
                  <i className="ti ti-x" />
                </button>
              </div>

              <div className="modal-body" style={{ padding: "20px 22px 24px" }}>
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <label style={{ ...labelStyle }}>Employé concerné *</label>
                    <select value={newLeaveForm.employeId} onChange={e => { setNewLeaveForm({ ...newLeaveForm, employeId: e.target.value }); setRhErrors(ev=>({...ev, leaveEmp: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.leaveEmp), cursor: "pointer" }}>
                      <option value="">Sélectionnez un collaborateur</option>
                      {employes.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.nom} — {emp.poste}</option>
                      ))}
                    </select>
                    {rhErrors.leaveEmp && <p style={{ ...errorTextStyle }}>{rhErrors.leaveEmp}</p>}
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Type de congé</label>
                    <select value={newLeaveForm.type} onChange={e => setNewLeaveForm({ ...newLeaveForm, type: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="Congé Annuel">Congé Annuel</option>
                      <option value="Maladie">Maladie</option>
                      <option value="Maternité">Maternité</option>
                      <option value="Sans solde">Sans solde</option>
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ ...labelStyle }}>Date Début *</label>
                      <input type="date" value={newLeaveForm.debut} onChange={e => { setNewLeaveForm({ ...newLeaveForm, debut: e.target.value }); setRhErrors(ev=>({...ev, leaveDebut: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.leaveDebut) }} />
                      {rhErrors.leaveDebut && <p style={{ ...errorTextStyle }}>{rhErrors.leaveDebut}</p>}
                    </div>
                    <div>
                      <label style={{ ...labelStyle }}>Date Fin *</label>
                      <input type="date" value={newLeaveForm.fin} onChange={e => { setNewLeaveForm({ ...newLeaveForm, fin: e.target.value }); setRhErrors(ev=>({...ev, leaveFin: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.leaveFin) }} />
                      {rhErrors.leaveFin && <p style={{ ...errorTextStyle }}>{rhErrors.leaveFin}</p>}
                    </div>
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Nombre de jours ouvrés *</label>
                    <input type="number" placeholder="Ex: 5" value={newLeaveForm.jours} onChange={e => { setNewLeaveForm({ ...newLeaveForm, jours: e.target.value }); setRhErrors(ev=>({...ev, leaveJours: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.leaveJours) }} />
                    {rhErrors.leaveJours && <p style={{ ...errorTextStyle }}>{rhErrors.leaveJours}</p>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                  <button onClick={() => setShowAddLeaveModal(false)} style={{ ...modalCancelBtnStyle }}>Annuler</button>
                  <button onClick={handleAddLeave} style={{ ...modalConfirmBtnStyle }}>Soumettre</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. ADD EMPLOYEE MODAL */}
      <AnimatePresence>
        {showAddStaffModal && (
          <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)} style={{ ...overlayStyle, zIndex: 300 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ ...modalCardStyle, width: "min(480px,94vw)" }}>
              {/* TOP HEADER */}
              <div style={{ ...modalHeaderStyle }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: t.blueSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`ti ${newStaffForm.id ? "ti-pencil" : "ti-user-plus"}`} style={{ fontSize: 19, color: t.blue }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text }}>
                      {newStaffForm.id ? "Modifier le Collaborateur" : "Ajouter un Collaborateur"}
                    </h2>
                    <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>Caisse &amp; Ressources Humaines</span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowAddStaffModal(false)} style={{ ...modalCloseStyle }}>
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* BODY FORM */}
              <div className="modal-body" style={{ padding: "20px 22px 24px", maxHeight: "72vh", overflowY: "auto" }}>
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <label style={{ ...labelStyle }}>Nom complet *</label>
                    <input type="text" placeholder="Ex: Jean Martin" value={newStaffForm.nom} onChange={e => { setNewStaffForm({ ...newStaffForm, nom: e.target.value }); setRhErrors(ev=>({...ev, nom: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.nom) }} />
                    {rhErrors.nom && <p style={{ ...errorTextStyle }}>{rhErrors.nom}</p>}
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Poste / Discipline d'enseignement *</label>
                    <input type="text" placeholder="Ex: Professeur de Mathématiques ou Cuisinier" value={newStaffForm.poste} onChange={e => { setNewStaffForm({ ...newStaffForm, poste: e.target.value }); setRhErrors(ev=>({...ev, poste: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.poste) }} />
                    {rhErrors.poste && <p style={{ ...errorTextStyle }}>{rhErrors.poste}</p>}
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Catégorie de rôle *</label>
                    <select value={newStaffForm.categorie} onChange={e => setNewStaffForm({ ...newStaffForm, categorie: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="Enseignant">Enseignant</option>
                      <option value="Administration">Administration (Direction, Comptable, Secrétaire, etc.)</option>
                      <option value="Services &amp; Soutien">Services &amp; Soutien (Chauffeur, Sécurité, Entretien, Cuisine, Santé)</option>
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ ...labelStyle }}>Type de contrat</label>
                      <select value={newStaffForm.contrat} onChange={e => setNewStaffForm({ ...newStaffForm, contrat: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Temps partiel">Temps partiel</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelStyle }}>Salaire mensuel (GNF) *</label>
                      <input type="number" placeholder="Ex: 2000000" value={newStaffForm.salaire} onChange={e => { setNewStaffForm({ ...newStaffForm, salaire: e.target.value }); setRhErrors(ev=>({...ev, salaire: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.salaire) }} />
                      {rhErrors.salaire && <p style={{ ...errorTextStyle }}>{rhErrors.salaire}</p>}
                    </div>
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Dernier Diplôme obtenu</label>
                    <input type="text" placeholder="Ex: Master en Administration" value={newStaffForm.diplome} onChange={e => setNewStaffForm({ ...newStaffForm, diplome: e.target.value })} style={{ ...inputStyle }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ ...labelStyle }}>Téléphone</label>
                      <input type="text" placeholder="Ex: +224 620..." value={newStaffForm.telephone} onChange={e => setNewStaffForm({ ...newStaffForm, telephone: e.target.value })} style={{ ...inputStyle }} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle }}>E-mail</label>
                      <input type="email" placeholder="Ex: j.martin@schoolx.gn" value={newStaffForm.email} onChange={e => { setNewStaffForm({ ...newStaffForm, email: e.target.value }); setRhErrors(ev=>({...ev, email: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.email) }} />
                      {rhErrors.email && <p style={{ ...errorTextStyle }}>{rhErrors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Avatar de rôle (géré automatiquement)</label>
                    <select value={newStaffForm.avatar} onChange={e => setNewStaffForm({ ...newStaffForm, avatar: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="👨‍🏫">Enseignant (Homme)</option>
                      <option value="👩‍🏫">Enseignante (Femme)</option>
                      <option value="👨‍💼">Cadre (Homme)</option>
                      <option value="👩‍💼">Cadre (Femme)</option>
                      <option value="👨‍💻">Technicien / Secrétaire (Homme)</option>
                      <option value="👩‍💻">Technicienne / Secrétaire (Femme)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Emploi du temps (Séparez par des points-virgules ';')</label>
                    <input type="text" placeholder="Ex: Lundi (08h - 12h); Mercredi (10h - 14h)" value={newStaffForm.emploiDuTemps} onChange={e => setNewStaffForm({ ...newStaffForm, emploiDuTemps: e.target.value })} style={{ ...inputStyle }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                  <button onClick={() => setShowAddStaffModal(false)} style={{ ...modalCancelBtnStyle }}>Annuler</button>
                  <button onClick={handleAddEmployee} style={{ ...modalConfirmBtnStyle }}>
                    {newStaffForm.id ? "Mettre à jour" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. ADD CANDIDATE MODAL */}
      <AnimatePresence>
        {showAddCandidateModal && (
          <div className="modal-overlay" onClick={() => setShowAddCandidateModal(false)} style={{ ...overlayStyle, zIndex: 300 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ ...modalCardStyle, width: "min(440px,94vw)" }}>
              {/* TOP HEADER */}
              <div style={{ ...modalHeaderStyle }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: t.blueSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className="ti ti-user-plus" style={{ fontSize: 19, color: t.blue }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text }}>Nouveau Candidat</h2>
                    <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>Caisse &amp; Ressources Humaines</span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowAddCandidateModal(false)} style={{ ...modalCloseStyle }}>
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* BODY FORM */}
              <div className="modal-body" style={{ padding: "20px 22px 24px", maxHeight: "72vh", overflowY: "auto" }}>
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <label style={{ ...labelStyle }}>Nom complet du Candidat *</label>
                    <input type="text" placeholder="Ex: Marc Dubois" value={newCandidateForm.nom} onChange={e => { setNewCandidateForm({ ...newCandidateForm, nom: e.target.value }); setRhErrors(ev=>({...ev, candNom: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.candNom) }} />
                    {rhErrors.candNom && <p style={{ ...errorTextStyle }}>{rhErrors.candNom}</p>}
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Poste ciblé *</label>
                    <input type="text" placeholder="Ex: Professeur de Chimie ou Cuisinier" value={newCandidateForm.poste} onChange={e => { setNewCandidateForm({ ...newCandidateForm, poste: e.target.value }); setRhErrors(ev=>({...ev, candPoste: undefined})); }} style={{ ...inputStyle, border: fieldBorder(rhErrors.candPoste) }} />
                    {rhErrors.candPoste && <p style={{ ...errorTextStyle }}>{rhErrors.candPoste}</p>}
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Catégorie de rôle *</label>
                    <select value={newCandidateForm.categorie} onChange={e => setNewCandidateForm({ ...newCandidateForm, categorie: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="Enseignant">Enseignant</option>
                      <option value="Administration">Administration (Direction, Comptable, Secrétaire, etc.)</option>
                      <option value="Services &amp; Soutien">Services &amp; Soutien (Chauffeur, Secrétaire, Entretien, Cuisine, Santé)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Dernier Diplôme &amp; Titres</label>
                    <input type="text" placeholder="Ex: Doctorat en Chimie Appliquée" value={newCandidateForm.diplome} onChange={e => setNewCandidateForm({ ...newCandidateForm, diplome: e.target.value })} style={{ ...inputStyle }} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Adresse E-mail</label>
                    <input type="email" placeholder="Ex: m.dubois@gmail.com" value={newCandidateForm.email} onChange={e => setNewCandidateForm({ ...newCandidateForm, email: e.target.value })} style={{ ...inputStyle }} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle }}>Téléphone Direct</label>
                    <input type="text" placeholder="Ex: +224 624..." value={newCandidateForm.tel} onChange={e => setNewCandidateForm({ ...newCandidateForm, tel: e.target.value })} style={{ ...inputStyle }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                  <button onClick={() => setShowAddCandidateModal(false)} style={{ ...modalCancelBtnStyle }}>Annuler</button>
                  <button onClick={handleAddCandidate} style={{ ...modalConfirmBtnStyle }}>Ajouter au Pipeline</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!confirmDelEmp}
        title="Supprimer l'employé"
        message={confirmDelEmp ? `Voulez-vous vraiment supprimer ${confirmDelEmp.nom} du personnel ? Cette action est irréversible.` : ""}
        onConfirm={() => { handleDeleteEmployee(confirmDelEmp.id); setConfirmDelEmp(null); }}
        onCancel={() => setConfirmDelEmp(null)}
      />
    </div>
  );
}
