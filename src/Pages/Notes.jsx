import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Notes.css";
import { MATIERES, MAT_ABR, COEFFS as INITIAL_COEFFS, INITIAL_NOTES, noteColor, statutInfo, EVO } from "./notesData";
import { CLASSES, STUDENTS, getNomComplet, getInitials } from "./studentsData";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";
import { t, chartColors } from "../theme";

function useOutsideClick(ref, cb) {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
const Chip = ({ label, c, bg }) => (
  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: bg, color: c, whiteSpace: "nowrap", display: "inline-block" }}>
    {label}
  </span>
);

const ModalShell = ({ onClose, zIndex, width, children }) => (
  <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      onClick={e => e.stopPropagation()}
      style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, width, maxWidth: "94vw", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", fontFamily: t.font, color: t.text }}
    >
      {children}
    </motion.div>
  </div>
);

const ModalHead = ({ icon, initials, title, subtitle, onClose, children }) => (
  <div style={{ padding: "18px 22px", borderBottom: `1px solid ${t.border}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: t.blueSoft, border: `1px solid ${t.blueMid}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700, color: t.blue }}>
          {initials || <i className={`ti ${icon}`} style={{ fontSize: 17 }} />}
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>{title}</h2>
          <div style={{ fontSize: 11.5, color: t.muted, marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>
      <button onClick={onClose} style={{ background: t.bg, border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.sub, flexShrink: 0 }}>
        <i className="ti ti-x" style={{ fontSize: 15 }} />
      </button>
    </div>
    {children}
  </div>
);

const CancelBtn = ({ label, onClick }) => (
  <button onClick={onClick} style={{ flex: 1, padding: "10px", border: `1px solid ${t.border}`, borderRadius: t.radius, background: t.surface, fontSize: 12.5, fontWeight: 500, cursor: "pointer", color: t.sub, fontFamily: t.font }}>
    {label}
  </button>
);

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

const SubmitBtn = ({ icon, label, onClick, bg = t.blue, c = "#fff", border = "none" }) => (
  <button onClick={onClick} style={{ flex: 1, padding: "10px", border, borderRadius: t.radius, background: bg, color: c, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
    <i className={`ti ${icon}`} style={{ fontSize: 15 }} /> {label}
  </button>
);

/* ─────────────────────────────────────────────
   MODAL COEFFICIENTS
───────────────────────────────────────────── */
function CoeffModal({ coeffs, setCoeffs, onClose, showToast }) {
  const [localCoeffs, setLocalCoeffs] = useState({ ...coeffs });

  const handleSave = () => { setCoeffs(localCoeffs); onClose(); showToast("Coefficients mis à jour", "success", "Les moyennes ont été recalculées automatiquement."); };

  return (
    <ModalShell onClose={onClose} zIndex={300} width={460}>
      <ModalHead icon="ti-settings" title="Coefficients" subtitle="Gestion des matières" onClose={onClose} />

      <div style={{ padding: "20px 22px", maxHeight: "72vh", overflowY: "auto" }}>
        <p style={{ fontSize: 13, color: t.sub, marginBottom: 16, marginTop: 0, lineHeight: 1.5 }}>
          Ajustez les coefficients pour chaque matière. Cela recalculera automatiquement toutes les moyennes.
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {MATIERES.map(mat => (
            <div key={mat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: t.bg, border: `1px solid ${t.border}`, padding: "9px 14px", borderRadius: t.radius }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{mat}</div>
              <input
                type="number" min="1" max="10" step="1"
                value={localCoeffs[mat] || 1}
                onChange={e => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  if (val > 10) val = 10;
                  setLocalCoeffs(prev => ({ ...prev, [mat]: val }));
                }}
                style={{ width: 62, padding: "7px 10px", border: `1px solid ${t.border}`, borderRadius: t.radius, outline: "none", fontWeight: 700, color: t.text, textAlign: "center", fontSize: 13, fontFamily: t.font, background: t.surface }}
                onFocus={e => e.currentTarget.style.borderColor = t.blue}
                onBlur={e => e.currentTarget.style.borderColor = t.border}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <CancelBtn label="Annuler" onClick={onClose} />
          <SubmitBtn icon="ti-device-floppy" label="Appliquer" onClick={handleSave} />
        </div>
      </div>
    </ModalShell>
  );
}

/* ─────────────────────────────────────────────
   MODAL SAISIE DES NOTES
───────────────────────────────────────────── */
function EditModal({ eleve, trimestre, notesData, setNotesData, coeffs, onClose, showToast}) {
  const [localNotes, setLocalNotes] = useState({ ...notesData[eleve.id][trimestre] });

  const getMoy = (notes) => {
    let total = 0, sumCoef = 0;
    Object.entries(notes).forEach(([m, val]) => {
      const c = coeffs[m] || 1;
      total += val * c;
      sumCoef += c;
    });
    return sumCoef > 0 ? Math.round((total / sumCoef) * 100) / 100 : 0;
  };

  const handleSave = () => {
    setNotesData(prev => ({ ...prev, [eleve.id]: { ...prev[eleve.id], [trimestre]: localNotes } }));
    onClose();
    showToast("Notes enregistrées avec succès", "success");
  };

  const m = getMoy(localNotes);

  return (
    <ModalShell onClose={onClose} zIndex={1100} width={500}>
      <ModalHead
        initials={getInitials(eleve)}
        title={getNomComplet(eleve)}
        subtitle={`Saisie des notes — ${trimestre}`}
        onClose={onClose}
      />

      <div style={{ padding: "20px 22px", maxHeight: "72vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: t.bg, padding: "12px 16px", borderRadius: t.radius, border: `1px solid ${t.border}` }}>
          <span style={{ fontWeight: 600, color: t.sub, fontSize: 13 }}>Moyenne simulée :</span>
          <span style={{ fontWeight: 700, color: noteColor(m), fontSize: 19 }}>{m} <span style={{ fontSize: 11.5, color: t.muted }}>/ 20</span></span>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {MATIERES.map(mat => (
            <div key={mat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: t.bg, border: `1px solid ${t.border}`, padding: "9px 14px", borderRadius: t.radius }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{mat}</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>Coeff : {coeffs[mat]}</div>
              </div>
              <input
                type="number" min="0" max="20" step="0.25"
                value={localNotes[mat] || ""}
                onChange={e => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val)) val = 0;
                  if (val < 0) val = 0;
                  if (val > 20) val = 20;
                  setLocalNotes(prev => ({ ...prev, [mat]: val }));
                }}
                style={{ width: 70, padding: "7px 10px", border: `1px solid ${t.border}`, borderRadius: t.radius, outline: "none", fontWeight: 700, color: t.text, textAlign: "center", fontSize: 13, fontFamily: t.font, background: t.surface }}
                onFocus={e => e.currentTarget.style.borderColor = t.blue}
                onBlur={e => e.currentTarget.style.borderColor = t.border}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <CancelBtn label="Annuler" onClick={onClose} />
          <SubmitBtn icon="ti-device-floppy" label="Enregistrer" onClick={handleSave} />
        </div>
      </div>
    </ModalShell>
  );
}

/* ─────────────────────────────────────────────
   MODAL AJOUTER / MODIFIER UN ÉLÈVE
───────────────────────────────────────────── */
function StudentModal({ onClose, onSave, classes, trimestre, initialStudent }) {
  const { showToast } = useToast();
  const isEdit = !!initialStudent;
  const [prenom, setPrenom] = useState(initialStudent ? initialStudent.prenom : '');
  const [nom, setNom] = useState(initialStudent ? initialStudent.nom : '');
  const [classe, setClasse] = useState(initialStudent ? initialStudent.classe : (classes[0] || ''));
  const [notes, setNotes] = useState(MATIERES.reduce((acc, mat) => { acc[mat] = ''; return acc; }, {}));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!prenom.trim()) errs.prenom = "Le prénom est requis";
    if (!nom.trim()) errs.nom = "Le nom est requis";
    if (!classe) errs.classe = "La classe est requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      showToast("Veuillez corriger les champs en rouge", "error");
      return;
    }
    if (isEdit) {
      onSave({ ...initialStudent, prenom, nom, classe });
    } else {
      const id = Date.now();
      onSave({
        id, prenom, nom, classe, notes,
        sexe: "M", matricule: `SCX-2024-${id}`, status: "Actif",
        dateNaissance: "", numero: "", email: "", tuteur: "", numeroTuteur: "", adresse: "",
        presences: { present: 0, absent: 0, retard: 0, total: 0 },
      });
    }
    onClose();
  };

  const inputStyle = (invalid) => ({
    width: "100%", padding: "9px 12px",
    border: `1px solid ${invalid ? t.red : t.border}`, borderRadius: t.radius,
    outline: "none", fontSize: 13, boxSizing: "border-box",
    fontFamily: t.font, color: t.text, background: t.surface,
  });

  return (
    <ModalShell onClose={onClose} zIndex={1200} width={480}>
      <ModalHead
        icon={isEdit ? "ti-user-cog" : "ti-user-plus"}
        title={isEdit ? "Modifier l'élève" : "Ajouter un élève"}
        subtitle={isEdit ? "Informations personnelles" : "Informations & notes initiales"}
        onClose={onClose}
      />

      <div style={{ padding: "20px 22px", maxHeight: "72vh", overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600, fontSize: 11, color: t.sub }}>Prénom *</label>
            <input type="text" placeholder="Ex: Jean" value={prenom} onChange={e => { setPrenom(e.target.value); setErrors(ev => ({ ...ev, prenom: undefined })); }}
              style={inputStyle(errors.prenom)}
              onFocus={e => e.currentTarget.style.borderColor = errors.prenom ? t.red : t.blue}
              onBlur={e => e.currentTarget.style.borderColor = errors.prenom ? t.red : t.border}
            />
            {errors.prenom && <p style={{ color: t.red, fontSize: 11, marginTop: 3 }}>{errors.prenom}</p>}
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600, fontSize: 11, color: t.sub }}>Nom *</label>
            <input type="text" placeholder="Ex: Dupont" value={nom} onChange={e => { setNom(e.target.value); setErrors(ev => ({ ...ev, nom: undefined })); }}
              style={inputStyle(errors.nom)}
              onFocus={e => e.currentTarget.style.borderColor = errors.nom ? t.red : t.blue}
              onBlur={e => e.currentTarget.style.borderColor = errors.nom ? t.red : t.border}
            />
            {errors.nom && <p style={{ color: t.red, fontSize: 11, marginTop: 3 }}>{errors.nom}</p>}
          </div>
        </div>

        {!isEdit && (
          <>
            <hr style={{ border: "0", borderTop: `1px solid ${t.border}`, margin: "18px 0" }} />
            <h3 style={{ fontSize: 15, marginBottom: 12, color: t.text, fontWeight: 700, marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-clipboard-list" style={{ color: t.blue, fontSize: 16 }} />
              Notes initiales ({trimestre})
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {MATIERES.map(mat => (
                <div key={mat}>
                  <label style={{ display: "block", marginBottom: 5, fontSize: 11, fontWeight: 600, color: t.sub }}>{mat}</label>
                  <input
                    type="number" min="0" max="20" step="0.25" placeholder="Note /20" value={notes[mat]}
                    onChange={e => {
                      let val = parseFloat(e.target.value);
                      if (isNaN(val)) val = "";
                      if (val < 0) val = 0;
                      if (val > 20) val = 20;
                      setNotes(prev => ({ ...prev, [mat]: val }));
                    }}
                    style={inputStyle(false)}
                    onFocus={e => e.currentTarget.style.borderColor = t.blue}
                    onBlur={e => e.currentTarget.style.borderColor = t.border}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <CancelBtn label="Annuler" onClick={onClose} />
          <SubmitBtn icon="ti-device-floppy" label={isEdit ? "Enregistrer" : "Ajouter l'élève"} onClick={handleSubmit} />
        </div>
      </div>
    </ModalShell>
  );
}

/* ─────────────────────────────────────────────
   MODAL BULLETIN (Vue détaillée avec Tabs)
───────────────────────────────────────────── */
function FicheNotes({ eleve, trimestre, notesData, coeffs, getMoyenne, onRetour, onEdit, onEditInfo }) {
  const [dossierTab, setDossierTab] = useState("resume");
  if (!eleve) return null;
  const tNotes = notesData[eleve.id][trimestre];
  const m = getMoyenne(tNotes);
  const s = statutInfo(m);
  const vals = Object.values(tNotes);
  const mx = Math.max(...vals), mn = Math.min(...vals);
  const mf = MATIERES.find(k => tNotes[k] === mx);
  const mw = MATIERES.find(k => tNotes[k] === mn);
  const bg = m >= 14 ? t.green : m >= 10 ? t.blue : m >= 8 ? t.amber : t.red;

  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Bulletin - ${getNomComplet(eleve)}</title><style>body{font-family:sans-serif;padding:40px}h1{color:${t.text}}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid ${t.border};padding:10px;text-align:left}th{background:${t.bg}}tfoot td{font-weight:bold;background:${t.blueSoft}}</style></head><body>`);
    w.document.write(`<h1>Bulletin de notes - ${trimestre}</h1><p><strong>Élève :</strong> ${getNomComplet(eleve)}</p><p><strong>Classe :</strong> ${eleve.classe}</p><p><strong>Statut :</strong> ${s.l}</p>`);
    w.document.write(`<table><thead><tr><th>Matière</th><th>Coef.</th><th>Note /20</th></tr></thead><tbody>`);
    MATIERES.forEach(mat => { w.document.write(`<tr><td>${mat}</td><td>${coeffs[mat]}</td><td>${tNotes[mat]}</td>`); });
    w.document.write(`</tbody><tfoot><tr><td colspan="2">Moyenne générale</td><td>${m}/20</td>`);
    w.document.write(`</tfoot></table></body></html>`);
    w.document.close(); w.print();
  };
  const noteLabel = (note) => {
    if (note >= 16) return "Excellent";
    if (note >= 14) return "Très Bien";
    if (note >= 10) return "Bien";
    return "À renforcer";
  };

  const loadJsPDF = () => new Promise((resolve) => {
    if (window.jspdf) return resolve(window.jspdf.jsPDF);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf.jsPDF);
    document.head.appendChild(script);
  });

  const downloadBulletin = () => {
    loadJsPDF().then((JsPDF) => {
      const doc = new JsPDF({ unit: "mm", format: "a4" });
      const pageWidth = 210;
      const marginX = 15;
      let y = 18;

      // ── EN-TÊTE ÉCOLE ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SchoolX", marginX, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Lycée Donka — Conakry, Guinée", marginX, y + 5);

      doc.setFontSize(10);
      doc.text(`Émis le ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - marginX, y, { align: "right" });
      y += 10;
      doc.setDrawColor(200);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`BULLETIN DE NOTES — ${trimestre}`, pageWidth / 2, y, { align: "center" });
      y += 10;


      // ── BANDEAU INFOS ÉLÈVE ──
      doc.setDrawColor(220);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(marginX, y, pageWidth - marginX * 2, 36, 2, 2, "F");

      const infoY = y + 7;
      const col1 = marginX + 5;
      const col2 = marginX + 95;
      doc.setFontSize(9);

      const infoLine = (label, value, x, yy) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120);
        doc.text(label, x, yy);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(20);
        doc.text(String(value), x, yy + 4.5);
      };

      infoLine("Nom complet", getNomComplet(eleve), col1, infoY);
      infoLine("Matricule", eleve.matricule, col2, infoY);
      infoLine("Classe", eleve.classe, col1, infoY + 10);
      infoLine("Sexe", eleve.sexe === "M" ? "Masculin" : "Féminin", col2, infoY + 10);
      infoLine("Présences", `${eleve.presences.present}/${eleve.presences.total}`, col1, infoY + 20);
      infoLine("Trimestre", trimestre, col2, infoY + 20);

      y += 42;

      // ── TABLEAU DES NOTES ──
      const tableX = marginX;
      const tableW = pageWidth - marginX * 2;
      const colW = [70, 25, 25, tableW - 70 - 25 - 25];
      const rowH = 8;

      doc.setFillColor(37, 99, 235);
      doc.rect(tableX, y, tableW, rowH, "F");
      doc.setTextColor(255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      let x = tableX + 3;
      ["Matière", "Note", "Coef.", "Appréciation"].forEach((h, i) => {
        doc.text(h, x, y + 5.5);
        x += colW[i];
      });
      y += rowH;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      MATIERES.forEach((mat, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(250, 250, 251);
          doc.rect(tableX, y, tableW, rowH, "F");
        }
        doc.setTextColor(20);
        x = tableX + 3;
        doc.text(mat, x, y + 5.5); x += colW[0];
        doc.text(`${tNotes[mat]}/20`, x, y + 5.5); x += colW[1];
        doc.text(`×${coeffs[mat]}`, x, y + 5.5); x += colW[2];
        doc.text(noteLabel(tNotes[mat]), x, y + 5.5);
        y += rowH;
      });

      // Moyenne pondérée
      doc.setFillColor(239, 246, 255);
      doc.rect(tableX, y, tableW, rowH, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("Moyenne pondérée", tableX + 3, y + 5.5);
      doc.text(`${m}/20`, tableX + colW[0] + 3, y + 5.5);
      y += rowH;
      doc.setDrawColor(220);
      doc.rect(tableX, y - rowH * (MATIERES.length + 2), tableW, rowH * (MATIERES.length + 2));

      y += 6;

      // Point fort / à renforcer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(5, 150, 105);
      doc.text(`Point fort : ${mf} (${mx}/20)`, tableX, y);
      doc.setTextColor(220, 38, 38);
      doc.text(`À renforcer : ${mw} (${mn}/20)`, tableX + tableW / 2, y);
      y += 6;

      doc.setTextColor(20);
      doc.setFont("helvetica", "bold");
      doc.text(`Statut général : `, tableX, y);
      doc.text(s.l, tableX + 32, y);
      y += 10;

      // ── BLOC SIGNATURES ──
      const sigY = Math.min(y + 8, 215);
      doc.setDrawColor(180);
      doc.line(marginX, sigY, pageWidth - marginX, sigY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("Fait à Conakry, le " + new Date().toLocaleDateString("fr-FR"), marginX, sigY + 6);

      const sigBoxW = 75;
      const sigBoxY = sigY + 14;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(20);
      doc.text("Le Directeur", marginX + sigBoxW / 2, sigBoxY, { align: "center" });
      doc.text("Le Tuteur / Parent", pageWidth - marginX - sigBoxW / 2, sigBoxY, { align: "center" });

      doc.setDrawColor(150);
      doc.line(marginX, sigBoxY + 18, marginX + sigBoxW, sigBoxY + 18);
      doc.line(pageWidth - marginX - sigBoxW, sigBoxY + 18, pageWidth - marginX, sigBoxY + 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140);
      doc.text("Signature et cachet", marginX + sigBoxW / 2, sigBoxY + 22, { align: "center" });
      doc.text(eleve.tuteur || "Signature", pageWidth - marginX - sigBoxW / 2, sigBoxY + 22, { align: "center" });

      doc.setFontSize(7.5);
      doc.setTextColor(180);
      doc.text("Généré automatiquement par SchoolX — document à usage interne", pageWidth / 2, 290, { align: "center" });

      doc.save(`Bulletin_${getNomComplet(eleve).replace(/\s+/g, "_")}_${trimestre}.pdf`);
    });
  };
  const thStyle = {
    padding: "11px 16px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    color: t.muted,
    textTransform: "uppercase",
    letterSpacing: ".4px",
    borderBottom: `1px solid ${t.border}`
  };

  const tdStyle = {
    padding: "13px 16px",
    fontSize: "13px",
    color: t.sub,
    borderBottom: `1px solid ${t.border}`
  };

  return (
    <div style={{ fontFamily: t.font, color: t.text, maxWidth: 860, margin: "0 auto" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <ActionBtn icon="ti-arrow-left" label="Retour" primary onClick={onRetour} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ActionBtn icon="ti-pencil" label="Saisir les notes" onClick={() => onEdit(eleve)} />
          <ActionBtn icon="ti-user-cog" label="Modifier l'élève" onClick={() => onEditInfo(eleve)} />
          <ActionBtn icon="ti-printer" label="Imprimer" c={bg} onClick={handlePrint} />
          <ActionBtn icon="ti-download" label="Télécharger" c={t.blue} bg={t.blueSoft} border={t.blueMid} onClick={downloadBulletin} />
        </div>
      </div>

      {/* ── HERO CARD ── */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "16px 18px 14px", display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg,${t.blueMid},${t.blueSoft})`,
            border: `2px solid ${t.blueMid}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: t.blue,
            boxShadow: "0 2px 10px rgba(37,99,235,0.15)",
          }}>{getInitials(eleve)}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{getNomComplet(eleve)}</h2>
            <div style={{ fontSize: 11.5, color: t.muted, marginTop: 3 }}>Dossier de notes — {trimestre}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <Chip label={eleve.classe} c={t.sub} bg={t.border} />
              <Chip label={`Moy. ${m}/20`} c={noteColor(m)} bg={t.bg} />
              <Chip label={s.l} c={s.c} bg={`${s.c}14`} />
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", flexWrap: "wrap", borderBottom: `1px solid ${t.border}`, marginBottom: 16 }}>
        {[
          { id: "resume", icon: "ti-layout-dashboard", label: "Résumé" },
          { id: "bulletin", icon: "ti-file-text", label: "Bulletin" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setDossierTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "transparent", border: "none",
              borderBottom: dossierTab === tab.id ? `2px solid ${t.blue}` : "2px solid transparent",
              color: dossierTab === tab.id ? t.blue : t.sub,
              padding: "11px 16px", fontWeight: dossierTab === tab.id ? 600 : 400,
              cursor: "pointer", fontFamily: t.font, fontSize: 12.5,
              marginBottom: -1, transition: "all .15s"
            }}
          >
            <i className={`ti ${tab.icon}`} style={{ fontSize: 14 }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* BODY */}
      <div>

          {/* ── TAB RÉSUMÉ ── */}
          {dossierTab === "resume" && (
            <>
              {/* 3 cartes stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 18 }}>
                <div style={{ background: t.surface, borderRadius: t.radius, padding: "16px 18px", textAlign: "center", border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
                  <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 6 }}>Moyenne générale</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: noteColor(m), lineHeight: 1 }}>{m}</div>
                  <div style={{ color: t.muted, fontSize: 11.5, marginTop: 4 }}>/20</div>
                </div>
                <div style={{ background: t.surface, borderRadius: t.radius, padding: "16px 18px", textAlign: "center", border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
                  <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 6 }}>Point fort</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{mf}</div>
                  <div style={{ background: t.greenSoft, color: t.green, borderRadius: 20, display: "inline-block", padding: "3px 10px", marginTop: 6, fontWeight: 600, fontSize: 11 }}>{mx}/20</div>
                </div>
                <div style={{ background: t.surface, borderRadius: t.radius, padding: "16px 18px", textAlign: "center", border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
                  <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 6 }}>À renforcer</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{mw}</div>
                  <div style={{ background: t.redSoft, color: t.red, borderRadius: 20, display: "inline-block", padding: "3px 10px", marginTop: 6, fontWeight: 600, fontSize: 11 }}>{mn}/20</div>
                </div>
              </div>

              {/* ── INDICATEUR D'EFFORT NÉCESSAIRE (Méthode C) ── */}
              <div style={{ marginTop: 18 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: t.text,
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: `1px solid ${t.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <i className="ti ti-target" style={{ fontSize: 16, color: t.blue }} />
                  <span>Indicateur d'effort nécessaire</span>
                  <span style={{ fontSize: 11.5, fontWeight: 400, color: t.muted }}>priorité d'amélioration</span>
                </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  background: t.surface,
                  borderRadius: t.radiusLg,
                  border: `1px solid ${t.border}`,
                  boxShadow: t.shadow,
                  padding: "6px 16px"
                }}>
                  {MATIERES.map((matiere) => {
                    const note = tNotes[matiere];
                    const coeff = coeffs[matiere];
                    const nom = matiere;

                    let objectif = "";
                    let objectifColor = "";
                    let objectifBg = "";
                    let PriorityIcon = null;

                    if (note >= 18) {
                      objectif = "Maintien";
                      objectifColor = t.green;
                      objectifBg = t.greenSoft;
                      PriorityIcon = <i className="ti ti-circle-check" style={{ fontSize: 14, color: t.green }} />;
                    } else if (note >= 16) {
                      objectif = "Peut mieux faire";
                      objectifColor = t.blue;
                      objectifBg = t.blueSoft;
                      PriorityIcon = <i className="ti ti-alert-triangle" style={{ fontSize: 14, color: t.blue }} />;
                    } else if (note >= 14) {
                      objectif = "À surveiller";
                      objectifColor = t.amber;
                      objectifBg = t.amberSoft;
                      PriorityIcon = <i className="ti ti-eye" style={{ fontSize: 14, color: t.amber }} />;
                    } else {
                      objectif = "Priorité d'amélioration";
                      objectifColor = t.red;
                      objectifBg = t.redSoft;
                      PriorityIcon = <i className="ti ti-alert-circle" style={{ fontSize: 14, color: t.red }} />;
                    }

                    return (
                      <div
                        key={nom}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "11px 0",
                          borderBottom: `1px solid ${t.border}`
                        }}
                      >
                        <div style={{ flex: "0 0 150px" }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{nom}</span>
                          <span style={{ fontSize: 11, color: t.muted, marginLeft: 6 }}>(×{coeff})</span>
                        </div>

                        <div style={{
                          fontWeight: 700,
                          fontSize: 13.5,
                          color: noteColor(note),
                          width: 60,
                          textAlign: "center"
                        }}>
                          {note}/20
                        </div>

                        <div style={{
                          flex: 1,
                          marginLeft: 16,
                          display: "flex",
                          alignItems: "center",
                          gap: 8
                        }}>
                          {PriorityIcon}
                          <Chip label={objectif} c={objectifColor} bg={objectifBg} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Légende rapide */}
                <div style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 12,
                  padding: "9px 14px",
                  background: t.bg,
                  border: `1px solid ${t.border}`,
                  borderRadius: t.radius,
                  fontSize: 11,
                  color: t.sub,
                  flexWrap: "wrap",
                  alignItems: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="ti ti-circle-check" style={{ fontSize: 12, color: t.green }} />
                    <span>≥18 : Maintien</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="ti ti-alert-triangle" style={{ fontSize: 12, color: t.blue }} />
                    <span>16–17 : Peut mieux faire</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="ti ti-eye" style={{ fontSize: 12, color: t.amber }} />
                    <span>14–15 : À surveiller</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="ti ti-alert-circle" style={{ fontSize: 12, color: t.red }} />
                    <span>&lt;14 : Priorité</span>
                  </div>
                </div>
              </div>

              {/* mini aperçu barres dans le résumé */}

            </>
          )}


          {/* ── TAB BULLETIN ── */}
          {dossierTab === "bulletin" && (
            <div style={{ background: t.surface, borderRadius: t.radiusLg, border: `1px solid ${t.border}`, boxShadow: t.shadow, padding: "18px 20px" }}>
              {/* Bandeau infos élève */}
              <div style={{ background: t.bg, padding: "14px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, borderRadius: t.radius, marginBottom: 18, border: `1px solid ${t.border}` }}>
                {[
                  ["Nom complet", getNomComplet(eleve)],
                  ["Matricule", eleve.matricule],
                  ["Classe", eleve.classe],
                  ["Sexe", eleve.sexe === "M" ? "Masculin" : "Féminin"],
                  ["Trimestre", trimestre],
                  ["Présences", `${eleve.presences.present}/${eleve.presences.total}`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginTop: 2 }}>{value}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>Statut</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.c, marginTop: 2 }}>{s.l}</div>
                </div>
              </div>
              {/* Tableau des notes */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
                  <thead>
                    <tr style={{ background: t.blue }}>
                      {["Matière", "Note", "Coef.", "Appréciation"].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.9)", textTransform: "uppercase", letterSpacing: ".4px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MATIERES.map((mat, idx) => (
                      <tr key={mat} style={{ background: idx % 2 === 0 ? t.surface : t.bg, borderBottom: `1px solid ${t.border}` }}>
                        <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: t.text }}>{mat}</td>
                        <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 700, color: noteColor(tNotes[mat]) }}>{tNotes[mat]}/20</td>
                        <td style={{ padding: "12px 14px", fontSize: 11.5, color: t.muted }}>×{coeffs[mat]}</td>
                        <td style={{ padding: "12px 14px", fontSize: 11.5, fontWeight: 600, color: noteColor(tNotes[mat]) }}>{noteLabel(tNotes[mat])}</td>
                      </tr>
                    ))}
                    <tr style={{ background: t.blueSoft, borderTop: `2px solid ${t.blue}` }}>
                      <td colSpan={2} style={{ padding: "13px 14px", fontSize: 13, fontWeight: 700, color: t.text }}>Moyenne pondérée</td>
                      <td colSpan={2} style={{ padding: "13px 14px", fontSize: 13.5, fontWeight: 700, color: t.blue }}>{m}/20</td>
                    </tr>
                    <tr style={{ borderTop: `1px solid ${t.border}` }}>
                      <td colSpan={2} style={{ padding: "10px 14px", fontSize: 11.5, color: t.green, fontWeight: 600 }}>Point fort : {mf} ({mx}/20)</td>
                      <td colSpan={2} style={{ padding: "10px 14px", fontSize: 11.5, color: t.red, fontWeight: 600 }}>À renforcer : {mw} ({mn}/20)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────── */
export default function Notes() {
  const { showToast } = useToast();
  const [students, setStudents] = useState(STUDENTS);
  const [coeffs, setCoeffs] = useState(INITIAL_COEFFS);
  const [notesData, setNotesData] = useState(INITIAL_NOTES);
  const [trimestre, setTrimestre] = useState("T1");
  const [classe, setClasse] = useState("Toutes les classes");
  const [statut, setStatut] = useState("Tous les statuts");
  const [matiere, setMatiere] = useState("Toutes les matières");
  const [search, setSearch] = useState("");
  const [topSearch, setTopSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sel, setSel] = useState(null);
  const [editSel, setEditSel] = useState(null);
  const [editInfoSel, setEditInfoSel] = useState(null);
  const [showCoeffs, setShowCoeffs] = useState(false);
  const [sortDir, setSortDir] = useState("desc");
  const [showNotif, setShowNotif] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);
  const [period, setPeriod] = useState("Ce mois");
  const [showInsights, setShowInsights] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const notifRef = useRef(); const exportRef = useRef(); const periodRef = useRef();
  useOutsideClick(notifRef, () => setShowNotif(false));
  useOutsideClick(exportRef, () => setShowExport(false));
  useOutsideClick(periodRef, () => setShowPeriod(false));

  const getMoyenne = (notes) => {
    if (!notes) return 0;
    let total = 0, sumCoef = 0;
    Object.entries(notes).forEach(([m, val]) => {
      const c = coeffs[m] || 1;
      total += val * c;
      sumCoef += c;
    });
    return sumCoef > 0 ? Math.round((total / sumCoef) * 100) / 100 : 0;
  };

  const activeSearch = topSearch || search;
  useEffect(() => { setPage(1); }, [trimestre]);

  const filtered = students.filter(e => {
    const matchClasse = classe === "Toutes les classes" || e.classe === classe;
    const matchSearch = getNomComplet(e).toLowerCase().includes(activeSearch.toLowerCase()); const m = getMoyenne(notesData[e.id][trimestre]);
    const s = statutInfo(m);
    const matchStatut = statut === "Tous les statuts" || s.l === statut;
    return matchClasse && matchSearch && matchStatut;
  }).sort((a, b) => {
    const ma = getMoyenne(notesData[a.id][trimestre]), mb = getMoyenne(notesData[b.id][trimestre]);
    return sortDir === "desc" ? mb - ma : ma - mb;
  });

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pages);
  const shown = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const exportCSV = () => {
    const rows = [["Nom", "Classe", ...MATIERES, "Moyenne", "Statut"]];
    students.forEach(e => {
      const m = getMoyenne(notesData[e.id][trimestre]);
      rows.push([getNomComplet(e), e.classe, ...MATIERES.map(mat => notesData[e.id][trimestre][mat] ?? ""), m, statutInfo(m).l]);
    });
    const csv = rows.map(r => r.join(";")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
    a.download = `notes_${trimestre}.csv`; a.click();
    showToast("Export réussi", "success", `Le fichier notes_${trimestre}.csv a été téléchargé.`);
  };

  const resetFilters = () => { setClasse("Toutes les classes"); setSearch(""); setStatut("Tous les statuts"); setMatiere("Toutes les matières"); setTopSearch(""); setPage(1); };

  const getGlobalMoyenne = () => {
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, el) => acc + getMoyenne(notesData[el.id][trimestre]), 0);
    return Math.round((sum / filtered.length) * 100) / 100;
  };

  const getDifficultyCount = () => filtered.filter(el => getMoyenne(notesData[el.id][trimestre]) < 10).length;

  const handleSaveStudent = (studentData) => {
    if (studentData.notes) {
      const initialNotes = MATIERES.reduce((acc, mat) => {
        const val = parseFloat(studentData.notes[mat]);
        acc[mat] = isNaN(val) ? 0 : val;
        return acc;
      }, {});
      const emptyNotes = MATIERES.reduce((acc, mat) => { acc[mat] = 0; return acc; }, {});
      setStudents(prev => [...prev, { id: studentData.id, nom: studentData.nom, classe: studentData.classe }]);
      setNotesData(prev => ({
        ...prev,
        [studentData.id]: {
          T1: trimestre === "T1" ? initialNotes : emptyNotes,
          T2: trimestre === "T2" ? initialNotes : emptyNotes,
          T3: trimestre === "T3" ? initialNotes : emptyNotes,
        }
      }));
      showToast("Élève ajouté avec succès", "success", `${studentData.prenom} ${studentData.nom} a été ajouté à la classe ${studentData.classe}.`);
    } else {
      setStudents(prev => prev.map(s => s.id === studentData.id ? studentData : s));
      showToast("Élève mis à jour", "success", `Les informations de ${studentData.prenom} ${studentData.nom} ont été mises à jour.`);
    }
  };

  const handleDelete = (student) => {
    setStudents(prev => prev.filter(s => s.id !== student.id));
    setNotesData(prev => { const copy = { ...prev }; delete copy[student.id]; return copy; });
    showToast("Élève supprimé", "warning", `${getNomComplet(student)} et toutes ses notes ont été supprimés.`);
  };

  const INSIGHTS = [
    { icon: <i className="ti ti-alert-triangle" />, c: t.red, bg: t.redSoft, t: `${getDifficultyCount()} élèves nécessitent un suivi au ${trimestre}`, d: "Leur moyenne est inférieure à 10/20." },
    { icon: <i className="ti ti-trending-up" />, c: t.green, bg: t.greenSoft, t: "Mathématiques coefficient " + coeffs["Mathématiques"], d: "Matière la plus déterminante pour le classement." },
    { icon: <i className="ti ti-crown" />, c: t.blue, bg: t.blueSoft, t: "Terminale A domine", d: "Meilleure performance globale ce trimestre." },
    { icon: <i className="ti ti-history" />, c: t.amber, bg: t.amberSoft, t: "Historique activé", d: "Vous pouvez comparer les T1, T2 et T3." },
  ];

  if (sel) return (
    <FicheNotes
      eleve={sel}
      trimestre={trimestre}
      notesData={notesData}
      coeffs={coeffs}
      getMoyenne={getMoyenne}
      onRetour={() => setSel(null)}
      onEdit={(e) => { setSel(null); setTimeout(() => setEditSel(e), 150); }}
      onEditInfo={(e) => { setSel(null); setTimeout(() => setEditInfoSel(e), 150); }}
    />
  );

  return (
    <div className="notes-page">

      {/* Header */}
      <div className="notes-header">
        <div>
          <h1>Gestion des notes <span style={{ fontSize: 13, color: t.sub, fontWeight: 500 }}>— {trimestre}</span></h1>
          <div className="breadcrumb"><span className="active">Accueil</span><span>›</span><span>Gestion des notes</span></div>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => setShowCoeffs(true)}><i className="ti ti-settings" /> Coefficients</button>
          <button className="btn-outline" onClick={() => setShowAdd(true)}><i className="ti ti-plus" /> Ajouter élève</button>
          <button className="btn-outline" onClick={() => window.print()}><i className="ti ti-printer" /> Imprimer</button>
          <div style={{ position: "relative" }} ref={exportRef}>
            <button className="btn-primary" onClick={() => setShowExport(v => !v)}><i className="ti ti-download" /> Exporter ▾</button>
            <AnimatePresence>
              {showExport && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="dropdown-panel" style={{ right: 0, minWidth: 160 }}>
                  <div className="dp-title">Exporter {trimestre}</div>
                  <button onClick={() => { exportCSV(); setShowExport(false); }}><i className="ti ti-file-text" style={{ marginRight: 6 }} /> CSV (.csv)</button>
                  <button onClick={() => { window.print(); setShowExport(false); }}><i className="ti ti-printer" style={{ marginRight: 6 }} /> PDF (imprimer)</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <motion.div className="stat-card" whileHover={{ y: -3, boxShadow: t.shadowMd }} whileTap={{ y: 0, scale: 0.98 }} style={{ cursor: "pointer" }}>
          <div className="icon-box" style={{ background: t.blueSoft, color: t.blue }}><i className="ti ti-chart-bar" style={{ fontSize: 19 }}></i></div>
          <div>
            <div className="stat-label">Moyenne générale</div>
            <div className="stat-value">{getGlobalMoyenne()} <span className="unit">/20</span></div>
          </div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -3, boxShadow: t.shadowMd }} whileTap={{ y: 0, scale: 0.98 }} style={{ cursor: "pointer" }}>
          <div className="icon-box" style={{ background: t.greenSoft, color: t.green }}><i className="ti ti-target" style={{ fontSize: 19 }}></i></div>
          <div>
            <div className="stat-label">Taux de réussite</div>
            <div className="stat-value">{Math.round((filtered.length - getDifficultyCount()) / Math.max(1, filtered.length) * 100)}%</div>
          </div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -3, boxShadow: t.shadowMd }} whileTap={{ y: 0, scale: 0.98 }} style={{ cursor: "pointer" }}>
          <div className="icon-box" style={{ background: t.redSoft, color: t.red }}><i className="ti ti-alert-triangle" style={{ fontSize: 19 }}></i></div>
          <div>
            <div className="stat-label">Élèves en difficulté</div>
            <div className="stat-value">{getDifficultyCount()}</div>
          </div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -3, boxShadow: t.shadowMd }} whileTap={{ y: 0, scale: 0.98 }} style={{ cursor: "pointer" }}>
          <div className="icon-box" style={{ background: t.amberSoft, color: t.amber }}><i className="ti ti-award" style={{ fontSize: 19 }}></i></div>
          <div>
            <div className="stat-label">Classement</div>
            <div className="stat-value">Mis à jour</div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Évolution des moyennes par classe</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="legend"><span><span className="dot" style={{ background: t.blue }} />Ce mois</span><span><span className="dot" style={{ background: t.blueMid }} />Mois dernier</span></div>
            </div>
          </div>
          <div className="bar-chart">
            {EVO.map((d, i) => (
              <div className="bar-group" key={i}>
                <div className="bar-pair">
                  <div className="bar current" style={{ height: `${(d.moy / 20) * 176}px` }}>{d.moy}</div>
                  <div className="bar previous" style={{ height: `${(d.prev / 20) * 176}px` }}>{d.prev}</div>
                </div>
                <div className="bar-label">{d.classe}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="insights-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>Insights pédagogiques</h3>
            <button
              onClick={() => setShowInsights(v => !v)}
              style={{
                fontSize: 12.5, fontWeight: 600, background: t.blueSoft,
                border: `1px solid ${t.blueMid}`, borderRadius: t.radius, padding: "5px 12px",
                color: t.blue, cursor: "pointer", fontFamily: t.font, whiteSpace: "nowrap",
              }}
            >
              {showInsights ? "Réduire" : "Voir tout"}
            </button>
          </div>
          {(showInsights ? INSIGHTS : INSIGHTS.slice(0, 2)).map((it, i) => (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              key={i}
              style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 12 }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: it.bg, color: it.c, fontSize: 15,
              }}>{it.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 2 }}>{it.t}</div>
                <div style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.4 }}>{it.d}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <div className="filter-item">
            <label>Classe / Niveau</label>
            <select value={classe} onChange={e => { setClasse(e.target.value); setPage(1); }}>
              <option>Toutes les classes</option>
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-item">
            <label>Statut</label>
            <select value={statut} onChange={e => { setStatut(e.target.value); setPage(1); }}>
              <option>Tous les statuts</option>
              <option>Excellent</option><option>Admis</option><option>Passable</option><option>En difficulté</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Matière</label>
            <select value={matiere} onChange={e => { setMatiere(e.target.value); setPage(1); }}>
              <option>Toutes les matières</option>
              {MATIERES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="filter-right">
          <div className="search-input">
            <i className="ti ti-search icon"></i>
            <input placeholder="Rechercher un élève..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <button className="btn-reset" onClick={resetFilters}>↺ Réinitialiser</button>
        </div>
      </div>


      {/* Table */}
      <div className="table-section">
        <div className="table-header">
          <h2>Liste des élèves <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>({filtered.length})</span></h2>
          <div className="table-actions">
            <select onChange={e => setSortDir(e.target.value)} value={sortDir}>
              <option value="desc">Trier par moyenne ↓</option>
              <option value="asc">Trier par moyenne ↑</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto", borderRadius: 8 }}>
          <table className="notes-table">
            <thead style={{ background: t.bg }}>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>ÉLÈVE ↕</th>
                {(matiere === "Toutes les matières" ? MATIERES : [matiere]).map(m => <th key={m} title={`Coefficient ${coeffs[m]}`}>{MAT_ABR[m]}</th>)}
                <th>MOYENNE ↕</th><th>STATUT ↕</th><th>ACTIONS</th><th style={{ width: 30 }}></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {shown.map((el, i) => {
                  const m = getMoyenne(notesData[el.id][trimestre]), s = statutInfo(m);
                  return (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={el.id}
                      onClick={() => setSel(el)} style={{ cursor: "pointer" }}>
                      <td style={{ color: t.muted, fontWeight: 600 }}>{(safePage - 1) * perPage + i + 1}</td>
                      <td><div className="eleve-cell"><div className="eleve-avatar">{getInitials(el)}</div><span className="eleve-name">{getNomComplet(el)}</span></div></td>
                      {(matiere === "Toutes les matières" ? MATIERES : [matiere]).map(mat => { const n = notesData[el.id][trimestre][mat]; return <td key={mat}><span className="note-val" style={{ color: noteColor(n) }}>{n}</span></td>; })}
                      <td><span className="moy-val" style={{ color: noteColor(m) }}>{m}</span></td>
                      <td><span className="statut-badge" style={{ color: s.c, background: `${s.c}14` }}>{s.l}</span></td>
                      <td onClick={e => e.stopPropagation()}><div className="actions-cell" style={{ position: "relative", display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 6 }}>
                        <button title="Saisir les notes" onClick={e => { e.stopPropagation(); setEditSel(el); }} style={{ background: t.surface, color: t.sub, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all .15s", fontFamily: t.font, display: "flex", alignItems: "center" }}>
                          <i className="ti ti-pencil" style={{ fontSize: 14 }} />
                        </button>
                        <button title="Supprimer" onClick={e => { e.stopPropagation(); setConfirmDel(el); }} style={{ background: t.redSoft, color: t.red, border: "none", borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all .15s", fontFamily: t.font, display: "flex", alignItems: "center" }}>
                          <i className="ti ti-trash" style={{ fontSize: 14 }} />
                        </button>
                      </div></td>
                      <td><i className="ti ti-chevron-right" style={{ fontSize: 15, color: t.muted }} /></td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {shown.length === 0 && (
                <tr>
                  <td colSpan={(matiere === "Toutes les matières" ? MATIERES : [matiere]).length + 6} style={{ textAlign: "center", padding: 48, color: t.muted, fontSize: 13 }}>
                    <i className="ti ti-search" style={{ fontSize: 28, display: "block", marginBottom: 10, color: t.border }} />
                    Aucun élève trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>

      {/* Modales */}
      <AnimatePresence>
        {editSel && <EditModal key="edit" eleve={editSel} trimestre={trimestre} notesData={notesData} coeffs={coeffs} setNotesData={setNotesData} onClose={() => setEditSel(null)} showToast={showToast} />}
        {showCoeffs && <CoeffModal key="coeffs" coeffs={coeffs} setCoeffs={setCoeffs} onClose={() => setShowCoeffs(false)} showToast={showToast} />}
        {showAdd && <StudentModal key="add" onClose={() => setShowAdd(false)} onSave={handleSaveStudent} classes={CLASSES} trimestre={trimestre} />}
        {editInfoSel && <StudentModal key="editInfo" initialStudent={editInfoSel} onClose={() => setEditInfoSel(null)} onSave={handleSaveStudent} classes={CLASSES} trimestre={trimestre} />}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!confirmDel}
        title="Supprimer l'élève"
        message={confirmDel ? `Voulez-vous vraiment supprimer ${confirmDel.nom} ? Toutes ses notes seront perdues.` : ""}
        onConfirm={() => { handleDelete(confirmDel); setConfirmDel(null); }}
        onCancel={() => setConfirmDel(null)}
      />
    </div>
  );
}