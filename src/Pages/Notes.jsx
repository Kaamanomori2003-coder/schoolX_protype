import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./Notes.css";
import { MATIERES, MAT_ABR, MAT_CLR, COEFFS as INITIAL_COEFFS, CLASSES, ELEVES, INITIAL_NOTES, avatarColor, getInitials, noteColor, statutInfo, EVO } from "./notesData";
import ConfirmModal from "../components/ConfirmModal";
import { 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  AlertCircle 
} from "lucide-react";


function useOutsideClick(ref, cb) {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

function CircleProgress({ pct, color, label }) {
  return (
    <div className="circle-wrap">
      <svg viewBox="0 0 36 36" width="48" height="48">
        <path d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <path d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${pct}, 100`} />
      </svg>
      <div className="circle-label" style={{ color, fontWeight: 700, fontSize: 13 }}>{label}</div>
    </div>
  );
}

function ContextMenu({ eleve, onClose, onView, onEdit, onEditInfo, onPrint }) {
  const ref = useRef();
  useOutsideClick(ref, onClose);
  return (
    <div ref={ref} className="ctx-menu">
      <button onClick={() => { onView(eleve); onClose(); }}><i className="ti ti-eye"></i> Voir le bulletin</button>
      <button onClick={() => { onPrint(eleve); onClose(); }}><i className="ti ti-printer"></i> Imprimer</button>
      <button onClick={() => { onEdit(eleve); onClose(); }}><i className="ti ti-pencil"></i> Saisir les notes</button>
      <button onClick={() => { onEditInfo(eleve); onClose(); }}><i className="ti ti-user-cog"></i> Modifier l'élève</button>
      <hr />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODAL COEFFICIENTS
───────────────────────────────────────────── */
function CoeffModal({ coeffs, setCoeffs, onClose }) {
  const [localCoeffs, setLocalCoeffs] = useState({ ...coeffs });

  const handleSave = () => { setCoeffs(localCoeffs); onClose(); };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, width: 460, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      >
        <div style={{ background: "#0066CC", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="ti ti-settings" style={{ fontSize: 28, color: "#fff" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Coefficients</h2>
              <span style={{ fontSize: 14, color: "#e0f2fe", fontWeight: 600 }}>Gestion des matières</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 20, marginTop: 0 }}>
            Ajustez les coefficients pour chaque matière. Cela recalculera automatiquement toutes les moyennes.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {MATIERES.map(mat => (
              <div key={mat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px 14px", borderRadius: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>{mat}</div>
                <input
                  type="number" min="1" max="10" step="1"
                  value={localCoeffs[mat] || 1}
                  onChange={e => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) val = 1;
                    if (val > 10) val = 10;
                    setLocalCoeffs(prev => ({ ...prev, [mat]: val }));
                  }}
                  style={{ width: 64, padding: "6px 10px", border: "2px solid #e2e8f0", borderRadius: 8, outline: "none", fontWeight: 700, color: "#0f172a", textAlign: "center", fontSize: 16 }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 12, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Annuler</button>
            <button onClick={handleSave} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: "#0066CC", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <i className="ti ti-device-floppy" style={{ fontSize: 20 }} /> Appliquer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODAL SAISIE DES NOTES
───────────────────────────────────────────── */
function EditModal({ eleve, trimestre, notesData, setNotesData, coeffs, onClose }) {
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
  };

  const m = getMoy(localNotes);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, width: 500, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      >
        <div style={{ background: "#0066CC", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, fontSize: 20, color: "#fff" }}>
              {getInitials(eleve.nom)}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{eleve.nom}</h2>
              <span style={{ fontSize: 14, color: "#e0f2fe", fontWeight: 600 }}>Saisie des notes — {trimestre}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ padding: "24px", maxHeight: "72vh", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, background: "#f8fafc", padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <span style={{ fontWeight: 600, color: "#64748b", fontSize: 15 }}>Moyenne simulée :</span>
            <span style={{ fontWeight: 800, color: noteColor(m), fontSize: 22 }}>{m} <span style={{ fontSize: 15, color: "#94a3b8" }}>/ 20</span></span>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {MATIERES.map(mat => (
              <div key={mat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px 14px", borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>{mat}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>Coeff : {coeffs[mat]}</div>
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
                  style={{ width: 72, padding: "7px 10px", border: "2px solid #e2e8f0", borderRadius: 8, outline: "none", fontWeight: 700, color: "#0f172a", textAlign: "center", fontSize: 16 }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 12, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Annuler</button>
            <button onClick={handleSave} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: "#0066CC", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <i className="ti ti-device-floppy" style={{ fontSize: 20 }} /> Enregistrer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODAL AJOUTER / MODIFIER UN ÉLÈVE
───────────────────────────────────────────── */
function StudentModal({ onClose, onSave, classes, trimestre, initialStudent }) {
  const isEdit = !!initialStudent;
  const [name, setName] = useState(initialStudent ? initialStudent.nom : '');
  const [classe, setClasse] = useState(initialStudent ? initialStudent.classe : (classes[0] || ''));
  const [notes, setNotes] = useState(MATIERES.reduce((acc, mat) => { acc[mat] = ''; return acc; }, {}));

  const handleSubmit = () => {
    if (!name.trim() || !classe) return;
    if (isEdit) {
      onSave({ ...initialStudent, nom: name, classe });
    } else {
      const id = Date.now();
      onSave({ id, nom: name, classe, notes });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, width: 480, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      >
        <div style={{ background: "#0066CC", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={`ti ${isEdit ? "ti-user-cog" : "ti-user-plus"}`} style={{ fontSize: 28, color: "#fff" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{isEdit ? "Modifier l'élève" : "Ajouter un élève"}</h2>
              <span style={{ fontSize: 14, color: "#e0f2fe", fontWeight: 600 }}>
                {isEdit ? "Informations personnelles" : "Informations & Notes initiales"}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ padding: "24px", maxHeight: "75vh", overflowY: "auto" }}>
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Nom complet *</label>
              <input
                type="text" placeholder="Ex: Jean Dupont" value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Classe *</label>
              <select
                value={classe} onChange={e => setClasse(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16, boxSizing: "border-box" }}
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {!isEdit && (
            <>
              <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "20px 0" }} />
              <h3 style={{ fontSize: 16, marginBottom: 14, color: "#475569", fontWeight: 700, marginTop: 0 }}>
                <i className="ti ti-clipboard-list" style={{ marginRight: 8, color: "#8b5cf6", fontSize: 18, verticalAlign: "middle" }} />
                Notes initiales ({trimestre})
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {MATIERES.map(mat => (
                  <div key={mat}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600, color: "#64748b" }}>{mat}</label>
                    <input
                      type="number" min="0" max="20" step="0.25" placeholder="Note /20" value={notes[mat]}
                      onChange={e => {
                        let val = parseFloat(e.target.value);
                        if (isNaN(val)) val = "";
                        if (val < 0) val = 0;
                        if (val > 20) val = 20;
                        setNotes(prev => ({ ...prev, [mat]: val }));
                      }}
                      style={{ width: "100%", padding: "9px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 15, boxSizing: "border-box" }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 12, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Annuler</button>
            <button onClick={handleSubmit} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: "#0066CC", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <i className="ti ti-device-floppy" style={{ fontSize: 20 }} />
              {isEdit ? "Enregistrer" : "Ajouter l'élève"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODAL BULLETIN (Vue détaillée avec Tabs)
───────────────────────────────────────────── */
function Modal({ eleve, trimestre, notesData, coeffs, getMoyenne, onClose, onEdit }) {
  if (!eleve) return null;
  const [dossierTab, setDossierTab] = useState("resume");
  const tNotes = notesData[eleve.id][trimestre];
  const m = getMoyenne(tNotes);
  const s = statutInfo(m);
  const vals = Object.values(tNotes);
  const mx = Math.max(...vals), mn = Math.min(...vals);
  const mf = MATIERES.find(k => tNotes[k] === mx);
  const mw = MATIERES.find(k => tNotes[k] === mn);
  const bg = m >= 14 ? "#10b981" : m >= 10 ? "#3b82f6" : m >= 8 ? "#f59e0b" : "#ef4444";

  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Bulletin - ${eleve.nom}</title><style>body{font-family:sans-serif;padding:40px}h1{color:#1e293b}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #e2e8f0;padding:10px;text-align:left}th{background:#f8fafc}tfoot td{font-weight:bold;background:#eff6ff}</style></head><body>`);
    w.document.write(`<h1>Bulletin de notes - ${trimestre}</h1><p><strong>Élève :</strong> ${eleve.nom}</p><p><strong>Classe :</strong> ${eleve.classe}</p><p><strong>Statut :</strong> ${s.l}</p>`);
    w.document.write(`<table><thead><tr><th>Matière</th><th>Coef.</th><th>Note /20</th></tr></thead><tbody>`);
    MATIERES.forEach(mat => { w.document.write(`<tr><td>${mat}</td><td>${coeffs[mat]}</td><td>${tNotes[mat]}</td>`); });
    w.document.write(`</tbody><tfoot><tr><td colspan="2">Moyenne générale</td><td>${m}/20</td>`);
    w.document.write(`</tfoot></table></body></html>`);
    w.document.close(); w.print();
  };

  const thStyle = {
    padding: "14px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: 700,
    color: "#475569",
    borderBottom: "1px solid #e2e8f0"
  };

  const tdStyle = {
    padding: "14px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9"
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, width: 700, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      >
        {/* HEADER avec TABS */}
        <div style={{ background: "#0066CC", padding: "24px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 22, color: "#fff", flexShrink: 0
              }}>
                {getInitials(eleve.nom)}
              </div>
              <div>
                <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>{eleve.nom}</h2>
                <span style={{ color: "#e0f2fe", fontWeight: 600, fontSize: 14 }}>
                  {eleve.classe} &nbsp;•&nbsp; {trimestre} &nbsp;•&nbsp; {s.l}
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 12 }}>
            {[
              { id: "resume", label: "Résumé" },
              { id: "notes", label: "Notes détaillées" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDossierTab(tab.id)}
                style={{
                  background: dossierTab === tab.id ? "#fff" : "transparent",
                  color: dossierTab === tab.id ? "#0066CC" : "#fff",
                  border: "none", borderRadius: 8,
                  padding: "8px 16px", fontWeight: 700, cursor: "pointer",
                  fontSize: 14, transition: "all .2s"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}>

          {/* ── TAB RÉSUMÉ ── */}
          {dossierTab === "resume" && (
            <>
              {/* 3 cartes stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #e2e8f0" }}>
                  <div style={{ color: "#64748b", fontWeight: 600, marginBottom: 6 }}>Moyenne Générale</div>
                  <div style={{ fontSize: 34, fontWeight: 800, color: noteColor(m) }}>{m}</div>
                  <div style={{ color: "#94a3b8", fontSize: 14 }}>/20</div>
                </div>
                <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #bbf7d0" }}>
                  <div style={{ color: "#14d65b", fontWeight: 600, marginBottom: 6 }}>Point Fort</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#065f46" }}>{mf}</div>
                  <div style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 20, display: "inline-block", padding: "2px 10px", marginTop: 6, fontWeight: 700 }}>{mx}/20</div>
                </div>
                <div style={{ background: "#fef2f2", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #fecaca" }}>
                  <div style={{ color: "#dc2626", fontWeight: 600, marginBottom: 6 }}>À Renforcer</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#991b1b" }}>{mw}</div>
                  <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 20, display: "inline-block", padding: "2px 10px", marginTop: 6, fontWeight: 700 }}>{mn}/20</div>
                </div>
              </div>

              {/* ── INDICATEUR D'EFFORT NÉCESSAIRE (Méthode C) ── */}
              <div style={{ marginTop: 20 }}>
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: "#1e293b", 
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "2px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <Target size={16} strokeWidth={2.5} />
                  <span>Indicateur d'effort nécessaire</span>
                  <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>priorité d'amélioration</span>
                </div>

                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 10,
                  background: "#ffffff",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  padding: "12px 16px"
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
                      objectifColor = "#16a34a";
                      objectifBg = "#f0fdf4";
                      PriorityIcon = <CheckCircle size={14} color="#16a34a" strokeWidth={2} />;
                    } else if (note >= 16) {
                      objectif = "Peut mieux faire";
                      objectifColor = "#eab308";
                      objectifBg = "#fefce8";
                      PriorityIcon = <AlertTriangle size={14} color="#eab308" strokeWidth={2} />;
                    } else if (note >= 14) {
                      objectif = "À surveiller";
                      objectifColor = "#f97316";
                      objectifBg = "#fff7ed";
                      PriorityIcon = <Eye size={14} color="#f97316" strokeWidth={2} />;
                    } else {
                      objectif = "Priorité d'amélioration";
                      objectifColor = "#dc2626";
                      objectifBg = "#fef2f2";
                      PriorityIcon = <AlertCircle size={14} color="#dc2626" strokeWidth={2} />;
                    }
                    
                    return (
                      <div 
                        key={nom}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: "1px solid #f1f5f9"
                        }}
                      >
                        <div style={{ flex: "0 0 140px" }}>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>{nom}</span>
                          <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 6 }}>(×{coeff})</span>
                        </div>
                        
                        <div style={{ 
                          fontWeight: 700, 
                          fontSize: 18, 
                          color: noteColor(note),
                          width: 50,
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
                          <span style={{ 
                            fontSize: 13, 
                            fontWeight: 500, 
                            color: objectifColor,
                            background: objectifBg,
                            padding: "4px 12px",
                            borderRadius: 20,
                            display: "inline-block"
                          }}>
                            {objectif}
                          </span>
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
                  padding: "8px 12px",
                  background: "#f8fafc",
                  borderRadius: 12,
                  fontSize: 11,
                  color: "#475569",
                  flexWrap: "wrap",
                  alignItems: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle size={12} color="#16a34a" />
                    <span>≥18 : Maintien</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertTriangle size={12} color="#eab308" />
                    <span>16–17 : Peut mieux faire</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Eye size={12} color="#f97316" />
                    <span>14–15 : À surveiller</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertCircle size={12} color="#dc2626" />
                    <span>&lt;14 : Priorité</span>
                  </div>
                </div>
              </div>

              {/* mini aperçu barres dans le résumé */}
              
            </>
          )}

          {/* ── TAB NOTES DÉTAILLÉES ── */}
          {dossierTab === "notes" && (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #e2e8f0"
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={thStyle}>Matière</th>
                    <th style={thStyle}>Coef.</th>
                    <th style={thStyle}>Note</th>
                    <th style={thStyle}>Points</th>
                    <th style={thStyle}>Appréciation</th>
                  </tr>
                </thead>
                <tbody>
                  {MATIERES.map((mat) => {
                    const note = tNotes[mat];
                    const coef = coeffs[mat];
                    const points = note * coef;

                    let appreciation = "";
                    let color = "";

                    if (note >= 16) {
                      appreciation = "Excellent";
                      color = "#10b981";
                    } else if (note >= 14) {
                      appreciation = "Très Bien";
                      color = "#3b82f6";
                    } else if (note >= 10) {
                      appreciation = "Bien";
                      color = "#f59e0b";
                    } else {
                      appreciation = "À renforcer";
                      color = "#ef4444";
                    }

                    return (
                      <tr key={mat}>
                        <td style={tdStyle}>{mat}</td>
                        <td style={tdStyle}>{coef}</td>
                        <td style={{ ...tdStyle, fontWeight: 700 }}>{note}/20</td>
                        <td style={tdStyle}>{points}</td>
                        <td style={{ ...tdStyle, color, fontWeight: 700 }}>{appreciation}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#f8fafc" }}>
                    <td colSpan="3" style={{ padding: "14px", fontWeight: 800, color: "#1e293b" }}>
                      Total des points
                    </td>
                    <td style={{ padding: "14px", fontWeight: 800, color: "#1e293b" }}>
                      {MATIERES.reduce((sum, mat) => sum + tNotes[mat] * coeffs[mat], 0)}
                    </td>
                    <td style={{ padding: "14px", fontWeight: 800, color: noteColor(m) }}>
                      Moyenne : {m}/20
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* ACTIONS */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 12, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Fermer</button>
            <button onClick={() => onEdit(eleve)} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: "#0066CC", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <i className="ti ti-pencil" style={{ fontSize: 20 }} /> Modifier
            </button>
            <button onClick={handlePrint} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: bg, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <i className="ti ti-printer" style={{ fontSize: 20 }} /> Imprimer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────── */
export default function Notes() {
  const [students, setStudents] = useState(ELEVES);
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
  const [ctxMenu, setCtxMenu] = useState(null);
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

  const filtered = students.filter(e => {
    const matchClasse = classe === "Toutes les classes" || e.classe === classe;
    const matchSearch = e.nom.toLowerCase().includes(activeSearch.toLowerCase());
    const m = getMoyenne(notesData[e.id][trimestre]);
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
      rows.push([e.nom, e.classe, ...MATIERES.map(mat => notesData[e.id][trimestre][mat] ?? ""), m, statutInfo(m).l]);
    });
    const csv = rows.map(r => r.join(";")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
    a.download = `notes_${trimestre}.csv`; a.click();
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
    } else {
      setStudents(prev => prev.map(s => s.id === studentData.id ? studentData : s));
    }
  };

  const handleDelete = (student) => {
    setStudents(prev => prev.filter(s => s.id !== student.id));
    setNotesData(prev => { const copy = { ...prev }; delete copy[student.id]; return copy; });
  };

  const INSIGHTS = [
    { icon: <i className="ti ti-alert-triangle" />, bg: "#ef4444", t: `${getDifficultyCount()} élèves nécessitent un suivi au ${trimestre}`, d: "Leur moyenne est inférieure à 10/20." },
    { icon: <i className="ti ti-trending-up" />, bg: "#10b981", t: "Mathématiques coefficient " + coeffs["Mathématiques"], d: "Matière la plus déterminante pour le classement." },
    { icon: <i className="ti ti-crown" />, bg: "#8b5cf6", t: "Terminale A domine", d: "Meilleure performance globale ce trimestre." },
    { icon: <i className="ti ti-history" />, bg: "#f59e0b", t: "Historique activé", d: "Vous pouvez comparer les T1, T2 et T3." },
  ];

  return (
    <div className="notes-page">
      {/* Top Bar */}
      <div className="notes-topbar">
        <div className="search-box">
          <i className="ti ti-search s-icon"></i>
          <input placeholder="Rechercher un élève, une classe..." value={topSearch} onChange={e => { setTopSearch(e.target.value); setPage(1); }} />
          <span className="kbd">⌘K</span>
        </div>
        <div className="topbar-right">
          <div className="topbar-info" style={{ display: "flex", gap: 10 }}>
            <i className="ti ti-school" style={{ fontSize: 20, color: "#3b82f6" }}></i>
            <div><div className="label">Lycée Donka</div><div className="sub">Conakry, Guinée</div></div>
          </div>
          <div className="topbar-divider" />
          <div className="topbar-info">
            <select style={{ border: "none", outline: "none", fontWeight: 700, background: "transparent", color: "#1e293b", cursor: "pointer", paddingRight: 10 }} value={trimestre} onChange={e => { setTrimestre(e.target.value); setPage(1); }}>
              <option value="T1">Trimestre 1</option>
              <option value="T2">Trimestre 2</option>
              <option value="T3">Trimestre 3</option>
            </select>
            <div className="sub">Année 2025-2026</div>
          </div>
          <div className="topbar-divider" />
          <div style={{ position: "relative" }} ref={notifRef}>
            <button className="topbar-bell" onClick={() => setShowNotif(v => !v)}><i className="ti ti-bell" style={{ fontSize: 20 }}></i><span className="badge">2</span></button>
            <AnimatePresence>
              {showNotif && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="dropdown-panel notif-panel">
                  <div className="dp-title">Notifications</div>
                  <div className="notif-item"><i className="ti ti-speakerphone" style={{ fontSize: 20, color: "#3b82f6", marginRight: 8 }} /><div><b>Notes validées</b><p>Le trimestre a été clôturé.</p></div></div>
                  <div className="notif-item"><i className="ti ti-alert-triangle" style={{ fontSize: 20, color: "#f59e0b", marginRight: 8 }} /><div><b>{getDifficultyCount()} élèves en difficulté</b><p>Un suivi est recommandé.</p></div></div>
                  <button className="dp-link" onClick={() => setShowNotif(false)}>Tout marquer comme lu</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="topbar-profile">
            <div className="topbar-avatar">MS</div>
            <div><div className="name">M. Soumah</div><div className="role">Directeur</div></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="notes-header">
        <div>
          <h1>Gestion des notes <span style={{ fontSize: 19, color: "#64748b", fontWeight: 600 }}>- {trimestre}</span></h1>
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
        <motion.div className="stat-card" whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ y: 0, scale: 0.96 }} style={{ cursor: "pointer" }}>
          <div className="top">
            <div className="icon-box" style={{ background: "#eff6ff", color: "#3b82f6" }}><i className="ti ti-chart-bar" style={{ fontSize: 22 }}></i></div>
            <div><div className="stat-label">Moyenne générale</div><div className="stat-value">{getGlobalMoyenne()} <span className="unit">/20</span></div></div>
          </div>
          <div className="bottom"><div><div className="trend up">Toutes les classes confondues</div></div></div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ y: 0, scale: 0.96 }} style={{ cursor: "pointer" }}>
          <div className="top" style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div className="icon-box" style={{ background: "#ecfdf5", color: "#10b981" }}><i className="ti ti-target" style={{ fontSize: 22 }}></i></div>
              <div><div className="stat-label">Taux de réussite</div><div className="stat-value">{Math.round((filtered.length - getDifficultyCount()) / Math.max(1, filtered.length) * 100)}%</div></div>
            </div>
            <CircleProgress pct={Math.round((filtered.length - getDifficultyCount()) / Math.max(1, filtered.length) * 100)} color="#10b981" label={`${Math.round((filtered.length - getDifficultyCount()) / Math.max(1, filtered.length) * 100)}%`} />
          </div>
          <div className="bottom"><div><div className="trend up">Admis ou Excellents</div></div></div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ y: 0, scale: 0.96 }} style={{ cursor: "pointer" }}>
          <div className="top" style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div className="icon-box" style={{ background: "#fef2f2", color: "#ef4444" }}><i className="ti ti-alert-triangle" style={{ fontSize: 22 }}></i></div>
              <div><div className="stat-label">Élèves en difficulté</div><div className="stat-value">{getDifficultyCount()}</div></div>
            </div>
            <CircleProgress pct={Math.round(getDifficultyCount() / Math.max(1, filtered.length) * 100)} color="#ef4444" label={`${Math.round(getDifficultyCount() / Math.max(1, filtered.length) * 100)}%`} />
          </div>
          <div className="bottom"><div><div className="trend down">Moyenne &lt; 10</div></div></div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ y: 0, scale: 0.96 }} style={{ cursor: "pointer" }}>
          <div className="top">
            <div className="icon-box" style={{ background: "#faf5ff", color: "#8b5cf6" }}><i className="ti ti-award" style={{ fontSize: 22 }}></i></div>
            <div><div className="stat-label">Classement</div><div className="stat-value" style={{ color: "#3b82f6", fontSize: 23 }}>Mis à jour</div><div className="stat-sub">Automatique via Coefficients</div></div>
          </div>
          <div className="bottom">
            <div className="trend up">Système actif</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28 }}>
              {[3, 5, 4, 7, 8].map((h, i) => <div key={i} style={{ width: 5, height: h * 3.5, background: `rgba(139,92,246,${0.3 + i * 0.15})`, borderRadius: "2px 2px 0 0" }} />)}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Évolution des moyennes par classe</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="legend"><span><span className="dot" style={{ background: "#3b82f6" }} />Ce mois</span><span><span className="dot" style={{ background: "#e2e8f0" }} />Mois dernier</span></div>
            </div>
          </div>
          <div className="bar-chart">
            {EVO.map((d, i) => (
              <div className="bar-group" key={i}>
                <div className="bar-pair">
                  <div className="bar current" style={{ height: `${(d.moy / 20) * 280}px` }}>{d.moy}</div>
                  <div className="bar previous" style={{ height: `${(d.prev / 20) * 280}px` }}>{d.prev}</div>
                </div>
                <div className="bar-label">{d.classe}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="insights-card">
          <svg className="wave" viewBox="0 0 1440 320" fill="rgba(255,255,255,0.1)"><path d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,202.7C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L0,320Z" /></svg>
          <div className="insights-header"><h3>Insights pédagogiques</h3><button className="voir-tout" onClick={() => setShowInsights(v => !v)}>{showInsights ? "Réduire" : "Voir tout"}</button></div>
          {(showInsights ? INSIGHTS : INSIGHTS.slice(0, 2)).map((it, i) => (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="insight-item" key={i}>
              <div className="insight-icon" style={{ background: it.bg }}>{it.icon}</div>
              <div><div className="title">{it.t}</div><div className="desc">{it.d}</div></div>
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
          <h2>Liste des élèves <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 500 }}>({filtered.length})</span></h2>
          <div className="table-actions">
            <select onChange={e => setSortDir(e.target.value)} value={sortDir}>
              <option value="desc">Trier par moyenne ↓</option>
              <option value="asc">Trier par moyenne ↑</option>
            </select>
          </div>
        </div>

        {/* ⬇️ conteneur scrollable, comme sur la page paiement */}
        <div style={{ maxHeight: 320, overflowY: "auto", overflowX: "auto", borderRadius: 8 }}>
          <table className="notes-table">
            <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>ÉLÈVE ↕</th>
                {(matiere === "Toutes les matières" ? MATIERES : [matiere]).map(m => <th key={m} title={`Coefficient ${coeffs[m]}`}>{MAT_ABR[m]}</th>)}
                <th>MOYENNE ↕</th><th>STATUT ↕</th><th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {shown.map((el, i) => {
                  const m = getMoyenne(notesData[el.id][trimestre]), s = statutInfo(m);
                  return (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={el.id}>
                      <td style={{ color: "#94a3b8", fontWeight: 700 }}>{(safePage - 1) * perPage + i + 1}</td>
                      <td><div className="eleve-cell"><div className="eleve-avatar" style={{ background: avatarColor(el.id) }}>{getInitials(el.nom)}</div><span className="eleve-name">{el.nom}</span></div></td>
                      {(matiere === "Toutes les matières" ? MATIERES : [matiere]).map(mat => { const n = notesData[el.id][trimestre][mat]; return <td key={mat}><span className="note-val" style={{ color: noteColor(n) }}>{n}</span></td>; })}
                      <td><span className="moy-val" style={{ color: noteColor(m) }}>{m}</span></td>
                      <td><span className="statut-badge" style={{ color: s.c }}>{s.l}</span></td>
                      <td><div className="actions-cell" style={{ position: "relative", display: "flex", gap: 6 }}>
                        <button onClick={() => setSel(el)} style={{ background: "#eff6ff", color: "#2563eb", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center", gap: 4 }}>
                          <i className="ti ti-eye" /> Voir
                        </button>
                        <button onClick={() => setEditSel(el)} style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
                          <i className="ti ti-pencil" />
                        </button>
                        <button onClick={() => setConfirmDel(el)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
                          <i className="ti ti-trash" />
                        </button>
                        <button title="Plus" onClick={() => setCtxMenu(ctxMenu === el.id ? null : el.id)} style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                          <i className="ti ti-dots-vertical" />
                        </button>
                        {ctxMenu === el.id && <ContextMenu eleve={el} onClose={() => setCtxMenu(null)} onView={setSel} onEdit={setEditSel} onEditInfo={setEditInfoSel}   />}
                      </div></td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {shown.length === 0 && (
                <tr>
                  <td colSpan={(matiere === "Toutes les matières" ? MATIERES : [matiere]).length + 5} style={{ textAlign: "center", padding: 32, color: "#94a3b8" }}>
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
        {sel && <Modal key="view" eleve={sel} trimestre={trimestre} notesData={notesData} coeffs={coeffs} getMoyenne={getMoyenne} onClose={() => setSel(null)} onEdit={(e) => { setSel(null); setTimeout(() => setEditSel(e), 150); }} />}
        {editSel && <EditModal key="edit" eleve={editSel} trimestre={trimestre} notesData={notesData} coeffs={coeffs} setNotesData={setNotesData} onClose={() => setEditSel(null)} />}
        {showCoeffs && <CoeffModal key="coeffs" coeffs={coeffs} setCoeffs={setCoeffs} onClose={() => setShowCoeffs(false)} />}
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