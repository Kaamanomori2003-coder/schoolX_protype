import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./Notes.css";
import { MATIERES, MAT_ABR, MAT_CLR, COEFFS as INITIAL_COEFFS, CLASSES, ELEVES, INITIAL_NOTES, avatarColor, getInitials, noteColor, statutInfo, EVO } from "./notesData";

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
      <div className="circle-label" style={{ color, fontWeight: 700, fontSize: 10 }}>{label}</div>
    </div>
  );
}

function ContextMenu({ eleve, onClose, onView, onEdit, onDelete, onPrint }) {
  const ref = useRef();
  useOutsideClick(ref, onClose);
  return (
    <div ref={ref} className="ctx-menu">
      <button onClick={() => { onView(eleve); onClose(); }}>👁 Voir le bulletin</button>
      <button onClick={() => { onPrint(eleve); onClose(); }}>🖨 Imprimer</button>
      <button onClick={() => { onEdit(eleve); onClose(); }}>✏️ Modifier les notes</button>
      <hr />
      <button onClick={() => { onDelete(eleve); onClose(); }} className="danger">🗑 Supprimer</button>
    </div>
  );
}

function CoeffModal({ coeffs, setCoeffs, onClose }) {
  const [localCoeffs, setLocalCoeffs] = useState({ ...coeffs });

  const handleSave = () => {
    setCoeffs(localCoeffs);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" style={{ maxWidth: 450 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: "#8b5cf6", padding: "20px 24px" }}>
          <div className="modal-profile" style={{ alignItems: "center" }}>
            <div className="left" style={{ gap: 12 }}>
              <div className="modal-avatar" style={{ width: 48, height: 48, fontSize: 20, background: "rgba(255,255,255,0.2)" }}>⚙️</div>
              <div><h2 style={{ fontSize: 18, margin: 0 }}>Coefficients</h2><span className="classe-badge" style={{ marginTop: 2, fontSize: 11 }}>Gestion des matières</span></div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="modal-body" style={{ padding: "24px" }}>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Ajustez les coefficients pour chaque matière. Cela recalculera automatiquement toutes les moyennes.</p>
          <div style={{ display: "grid", gap: 12 }}>
            {MATIERES.map(mat => (
              <div key={mat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{mat}</div>
                <input
                  type="number" min="1" max="10" step="1"
                  value={localCoeffs[mat] || 1}
                  onChange={e => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) val = 1;
                    if (val > 10) val = 10;
                    setLocalCoeffs(prev => ({ ...prev, [mat]: val }));
                  }}
                  style={{ width: 60, padding: "6px 10px", border: "2px solid #e2e8f0", borderRadius: 6, outline: "none", fontWeight: 700, color: "#0f172a", textAlign: "center" }}
                />
              </div>
            ))}
          </div>
          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button className="btn-close-modal" onClick={onClose}>Annuler</button>
            <button className="btn-print" style={{ background: "#8b5cf6" }} onClick={handleSave}>💾 Appliquer</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

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
    setNotesData(prev => ({
      ...prev,
      [eleve.id]: {
        ...prev[eleve.id],
        [trimestre]: localNotes
      }
    }));
    onClose();
  };

  const m = getMoy(localNotes);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="modal-content" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: "#1e293b", padding: "20px 24px" }}>
          <div className="modal-profile" style={{ alignItems: "center" }}>
            <div className="left" style={{ gap: 12 }}>
              <div className="modal-avatar" style={{ width: 48, height: 48, fontSize: 16 }}>{getInitials(eleve.nom)}</div>
              <div><h2 style={{ fontSize: 18, margin: 0 }}>{eleve.nom}</h2><span className="classe-badge" style={{ marginTop: 2, fontSize: 11 }}>Saisie des notes - {trimestre}</span></div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="modal-body" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, background: "#f8fafc", padding: 12, borderRadius: 8 }}>
            <span style={{ fontWeight: 600, color: "#64748b" }}>Moyenne simulée:</span>
            <span style={{ fontWeight: 800, color: noteColor(m), fontSize: 16 }}>{m} / 20</span>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {MATIERES.map(mat => (
              <div key={mat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{mat}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Coeff: {coeffs[mat]}</div>
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
                  style={{ width: 70, padding: "6px 10px", border: "2px solid #e2e8f0", borderRadius: 6, outline: "none", fontWeight: 700, color: "#0f172a", textAlign: "center" }}
                />
              </div>
            ))}
          </div>
          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button className="btn-close-modal" onClick={onClose}>Annuler</button>
            <button className="btn-print" onClick={handleSave}>💾 Enregistrer</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AddStudentModal({ onClose, onAdd, classes, trimestre }) {
  const [name, setName] = useState('');
  const [classe, setClasse] = useState(classes[0] || '');
  const [notes, setNotes] = useState(
    MATIERES.reduce((acc, mat) => { acc[mat] = ''; return acc; }, {})
  );

  const handleSubmit = () => {
    if (!name.trim() || !classe) return;
    const id = Date.now();
    onAdd({ id, nom: name, classe, notes });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: "#8b5cf6", padding: "20px 24px" }}>
          <div className="modal-profile" style={{ alignItems: "center" }}>
            <div className="left" style={{ gap: 12 }}>
              <div className="modal-avatar" style={{ width: 48, height: 48, fontSize: 20, background: "rgba(255,255,255,0.2)" }}>+</div>
              <div>
                <h2 style={{ fontSize: 18, margin: 0 }}>Ajouter un élève</h2>
                <span className="classe-badge" style={{ marginTop: 2, fontSize: 11 }}>Informations &amp; Notes</span>
              </div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="modal-body" style={{ padding: "24px", maxHeight: "80vh", overflowY: "auto" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Nom complet</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: 6, outline: "none" }} placeholder="Ex: Jean Dupont" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Classe</label>
            <select value={classe} onChange={e => setClasse(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: 6, outline: "none" }}>
              {classes.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          
          <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />
          
          <h3 style={{ fontSize: 14, marginBottom: 12, color: "#475569", fontWeight: 700 }}>Notes initiales ({trimestre})</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
            {MATIERES.map(mat => (
              <div key={mat} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{mat}</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.25"
                  placeholder="Note /20"
                  value={notes[mat]}
                  onChange={e => {
                    let val = parseFloat(e.target.value);
                    if (isNaN(val)) val = "";
                    if (val < 0) val = 0;
                    if (val > 20) val = 20;
                    setNotes(prev => ({ ...prev, [mat]: val }));
                  }}
                  style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: 6, outline: "none", fontSize: 13 }}
                />
              </div>
            ))}
          </div>
          
          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button className="btn-close-modal" onClick={onClose}>Annuler</button>
            <button className="btn-print" style={{ background: "#8b5cf6" }} onClick={handleSubmit}>💾 Ajouter l'élève</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Modal({ eleve, trimestre, notesData, coeffs, getMoyenne, onClose, onEdit }) {
  if (!eleve) return null;
  const tNotes = notesData[eleve.id][trimestre];
  const m = getMoyenne(tNotes);
  const s = statutInfo(m);
  const vals = Object.values(tNotes);
  const mx = Math.max(...vals), mn = Math.min(...vals);
  const mf = MATIERES.find(k => tNotes[k] === mx);
const mw = MATIERES.find(k => tNotes[k] === mn);
const bg = m >= 14 ? "linear-gradient(135deg,#10b981,#059669)" : m >= 10 ? "linear-gradient(135deg,#3b82f6,#4f46e5)" : m >= 8 ? "linear-gradient(135deg,#f59e0b,#ea580c)" : "linear-gradient(135deg,#ef4444,#e11d48)";

const chartData = [
  { name: 'T1', moyenne: getMoyenne(notesData[eleve.id].T1) },
  { name: 'T2', moyenne: getMoyenne(notesData[eleve.id].T2) },
  { name: 'T3', moyenne: getMoyenne(notesData[eleve.id].T3) }
];

const handlePrint = () => {
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>Bulletin - ${eleve.nom}</title><style>body{font-family:sans-serif;padding:40px}h1{color:#1e293b}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #e2e8f0;padding:10px;text-align:left}th{background:#f8fafc}tfoot td{font-weight:bold;background:#eff6ff}</style></head><body>`);
  w.document.write(`<h1>Bulletin de notes - ${trimestre}</h1><p><strong>Élève :</strong> ${eleve.nom}</p><p><strong>Classe :</strong> ${eleve.classe}</p><p><strong>Statut :</strong> ${s.l}</p>`);
  w.document.write(`<table><thead><tr><th>Matière</th><th>Coef.</th><th>Note /20</th></tr></thead><tbody>`);
  MATIERES.forEach(mat => { w.document.write(`<tr><td>${mat}</td><td>${coeffs[mat]}</td><td>${tNotes[mat]}</td></tr>`); });
  w.document.write(`</tbody><tfoot><tr><td colspan="2">Moyenne générale</td><td>${m}/20</td></tr></tfoot></table></body></html>`);
  w.document.close(); w.print();
};
return (
  <div className="modal-overlay" onClick={onClose}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header" style={{ background: bg }}>
        <div className="decor" />
        <div className="modal-profile">
          <div className="left">
            <div className="modal-avatar">{getInitials(eleve.nom)}</div>
            <div><h2>{eleve.nom}</h2><span className="classe-badge">{eleve.classe} - {trimestre}</span></div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="modal-body">
        <div className="modal-stats">
          <div className="modal-stat" style={{ background: "#f8fafc" }}>
            <div className="label" style={{ color: "#64748b" }}>Moyenne</div>
            <div className="value" style={{ color: noteColor(m) }}>{m}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>/20</div>
          </div>
          <div className="modal-stat" style={{ background: "#f0fdf4" }}>
            <div className="label" style={{ color: "#10b981" }}>Point fort</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#065f46" }}>{mf}</div>
            <div className="sub" style={{ background: "#dcfce7", color: "#10b981" }}>{mx}/20</div>
          </div>
          <div className="modal-stat" style={{ background: "#fef2f2" }}>
            <div className="label" style={{ color: "#ef4444" }}>À renforcer</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#991b1b" }}>{mw}</div>
            <div className="sub" style={{ background: "#fee2e2", color: "#ef4444" }}>{mn}/20</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <div>
            <h3><span style={{ color: "#3b82f6" }}>📊</span> Détail des notes</h3>
            <div style={{ maxHeight: 220, overflowY: "auto", paddingRight: 8 }}>
              {MATIERES.map(mat => {
                const n = tNotes[mat], p = (n / 20) * 100;
                return (
                  <div className="note-detail" key={mat} style={{ marginBottom: 8 }}>
                    <div className="row">
                      <span className="matiere">{mat} <span style={{ fontSize: 10, color: "#94a3b8" }}>(x{coeffs[mat]})</span></span>
                      <span className="note-badge" style={{ background: noteColor(n) + "20", color: noteColor(n) }}>{n}/20</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: p + "%", background: MAT_CLR[mat] }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3><span style={{ color: "#8b5cf6" }}>📈</span> Évolution (Année)</h3>
            <div style={{ height: 220, background: "#f8fafc", borderRadius: 14, padding: "10px 10px 0 0", border: "1px solid #f1f5f9" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis domain={[0, 20]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={30} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="moyenne" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-close-modal" onClick={onClose}>Fermer</button>
          <button className="btn-close-modal" style={{ background: "#1e293b", color: "#fff", border: "none" }} onClick={() => onEdit(eleve)}>✏️ Modifier</button>
          <button className="btn-print" onClick={handlePrint}>🖨️ Imprimer</button>
        </div>
      </div>
    </motion.div>
  </div>
  );
}


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
  const [showCoeffs, setShowCoeffs] = useState(false);
  const [sortDir, setSortDir] = useState("desc");
  const [showNotif, setShowNotif] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const [showPeriod, setShowPeriod] = useState(false);
  const [period, setPeriod] = useState("Ce mois");
  const [showInsights, setShowInsights] = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);

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
    const matchMat = matiere === "Toutes les matières" || true;
    return matchClasse && matchSearch && matchStatut && matchMat;
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

  const getDifficultyCount = () => {
    return filtered.filter(el => getMoyenne(notesData[el.id][trimestre]) < 10).length;
  };

  const handleAddStudent = (newStudent) => {
    // Parse input notes safely
    const initialNotes = MATIERES.reduce((acc, mat) => {
      const val = parseFloat(newStudent.notes[mat]);
      acc[mat] = isNaN(val) ? 0 : val;
      return acc;
    }, {});

    const emptyNotes = MATIERES.reduce((acc, mat) => { acc[mat] = 0; return acc; }, {});

    setStudents(prev => [...prev, { id: newStudent.id, nom: newStudent.nom, classe: newStudent.classe }]);
    setNotesData(prev => ({
      ...prev,
      [newStudent.id]: {
        T1: trimestre === "T1" ? initialNotes : emptyNotes,
        T2: trimestre === "T2" ? initialNotes : emptyNotes,
        T3: trimestre === "T3" ? initialNotes : emptyNotes,
      }
    }));
  };

  const handleDelete = (student) => {
    setStudents(prev => prev.filter(s => s.id !== student.id));
    setNotesData(prev => {
      const copy = { ...prev };
      delete copy[student.id];
      return copy;
    });
  };
  const INSIGHTS = [
    { icon: "🚨", bg: "#ef4444", t: `${getDifficultyCount()} élèves nécessitent un suivi au ${trimestre}`, d: "Leur moyenne est inférieure à 10/20." },
    { icon: "📈", bg: "#10b981", t: "Mathématiques coefficient " + coeffs["Mathématiques"], d: "Matière la plus déterminante pour le classement." },
    { icon: "👑", bg: "#8b5cf6", t: "Terminale A domine", d: "Meilleure performance globale ce trimestre." },
    { icon: "📘", bg: "#f59e0b", t: "Historique activé", d: "Vous pouvez comparer les T1, T2 et T3." },
  ];

  return (
    <div className="notes-page">
      {/* Top Bar */}
      <div className="notes-topbar">
        <div className="search-box">
          <span className="s-icon">🔍</span>
          <input placeholder="Rechercher un élève, une classe..." value={topSearch} onChange={e => { setTopSearch(e.target.value); setPage(1); }} />
          <span className="kbd">⌘K</span>
        </div>
        <div className="topbar-right">
          <div className="topbar-info" style={{ display: "flex", gap: 10 }}>
            <span className="icon-wrap">🏫</span>
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
            <button className="topbar-bell" onClick={() => setShowNotif(v => !v)}>🔔<span className="badge">2</span></button>
            <AnimatePresence>
              {showNotif && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="dropdown-panel notif-panel">
                  <div className="dp-title">Notifications</div>
                  <div className="notif-item"><span>📢</span><div><b>Notes validées</b><p>Le trimestre a été clôturé.</p></div></div>
                  <div className="notif-item"><span>⚠️</span><div><b>{getDifficultyCount()} élèves en difficulté</b><p>Un suivi est recommandé.</p></div></div>
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
          <h1>Gestion des notes <span style={{ fontSize: 16, color: "#64748b", fontWeight: 600 }}>- {trimestre}</span></h1>
          <div className="breadcrumb"><span className="active">🏠 Accueil</span><span>›</span><span>Gestion des notes</span></div>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => setShowCoeffs(true)}>⚙️ Coefficients</button>
          <button className="btn-outline" onClick={() => setShowAdd(true)}>➕ Ajouter élève</button>
          <button className="btn-outline" onClick={() => window.print()}>🖨️ Imprimer</button>
          <div style={{ position: "relative" }} ref={exportRef}>
            <button className="btn-primary" onClick={() => setShowExport(v => !v)}>📥 Exporter ▾</button>
            <AnimatePresence>
              {showExport && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="dropdown-panel" style={{ right: 0, minWidth: 160 }}>
                  <div className="dp-title">Exporter {trimestre}</div>
                  <button onClick={() => { exportCSV(); setShowExport(false); }}>📊 CSV (.csv)</button>
                  <button onClick={() => { window.print(); setShowExport(false); }}>📄 PDF (imprimer)</button>
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
            <div className="icon-box" style={{ background: "#eff6ff", color: "#3b82f6" }}>📊</div>
            <div><div className="stat-label">Moyenne générale</div><div className="stat-value">{getGlobalMoyenne()} <span className="unit">/20</span></div></div>
          </div>
          <div className="bottom">
            <div><div className="trend up">Toutes les classes confondues</div></div>
          </div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ y: 0, scale: 0.96 }} style={{ cursor: "pointer" }}>
          <div className="top" style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div className="icon-box" style={{ background: "#ecfdf5", color: "#10b981" }}>🎯</div>
              <div><div className="stat-label">Taux de réussite</div><div className="stat-value">{Math.round((filtered.length - getDifficultyCount()) / Math.max(1, filtered.length) * 100)}%</div></div>
            </div>
            <CircleProgress pct={Math.round((filtered.length - getDifficultyCount()) / Math.max(1, filtered.length) * 100)} color="#10b981" label={`${Math.round((filtered.length - getDifficultyCount()) / Math.max(1, filtered.length) * 100)}%`} />
          </div>
          <div className="bottom"><div><div className="trend up">Admis ou Excellents</div></div></div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ y: 0, scale: 0.96 }} style={{ cursor: "pointer" }}>
          <div className="top" style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div className="icon-box" style={{ background: "#fef2f2", color: "#ef4444" }}>⚠️</div>
              <div><div className="stat-label">Élèves en difficulté</div><div className="stat-value">{getDifficultyCount()}</div></div>
            </div>
            <CircleProgress pct={Math.round(getDifficultyCount() / Math.max(1, filtered.length) * 100)} color="#ef4444" label={`${Math.round(getDifficultyCount() / Math.max(1, filtered.length) * 100)}%`} />
          </div>
          <div className="bottom"><div><div className="trend down">Moyenne &lt; 10</div></div></div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ y: 0, scale: 0.96 }} style={{ cursor: "pointer" }}>
          <div className="top">
            <div className="icon-box" style={{ background: "#faf5ff", color: "#8b5cf6" }}>🏆</div>
            <div><div className="stat-label">Classement</div><div className="stat-value" style={{ color: "#3b82f6", fontSize: 20 }}>Mis à jour</div><div className="stat-sub">Automatique via Coefficients</div></div>
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
                  <div className="bar current" style={{ height: `${(d.moy / 20) * 180}px` }}>{d.moy}</div>
                  <div className="bar previous" style={{ height: `${(d.prev / 20) * 180}px` }}>{d.prev}</div>
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
            <span className="icon">🔍</span>
            <input placeholder="Rechercher un élève..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <button className="btn-reset" onClick={resetFilters}>↺ Réinitialiser</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-section">
        <div className="table-header">
          <h2>Liste des élèves <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>({filtered.length})</span></h2>
          <div className="table-actions">
            <select onChange={e => setSortDir(e.target.value)} value={sortDir}>
              <option value="desc">Trier par moyenne ↓</option>
              <option value="asc">Trier par moyenne ↑</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="notes-table">
            <thead><tr>
              <th style={{ width: 40 }}>#</th>
              <th>ÉLÈVE ↕</th>
              {(matiere === "Toutes les matières" ? MATIERES : [matiere]).map(m => <th key={m} title={`Coefficient ${coeffs[m]}`}>{MAT_ABR[m]}</th>)}
              <th>MOYENNE ↕</th><th>STATUT ↕</th><th>ACTIONS</th>
            </tr></thead>
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
                      <td><div className="actions-cell" style={{ position: "relative" }}>
                        <button className="action-btn" onClick={() => setSel(el)} title="Voir (Notes & Graphiques)">👁</button>
                        <button className="action-btn" onClick={() => setEditSel(el)} title="Saisir / Modifier les notes">✏️</button>
                        <button className="action-btn" title="Plus" onClick={() => setCtxMenu(ctxMenu === el.id ? null : el.id)}>⋮</button>
                        {ctxMenu === el.id && <ContextMenu eleve={el} onClose={() => setCtxMenu(null)} onView={setSel} onEdit={setEditSel} onDelete={() => handleDelete(el)} onPrint={() => { }} />}
                      </div></td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {shown.length === 0 && <tr><td colSpan={(matiere === "Toutes les matières" ? MATIERES : [matiere]).length + 5} style={{ textAlign: "center", padding: 32, color: "#94a3b8" }}>Aucun élève trouvé</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Affichage de {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1} à {Math.min(safePage * perPage, filtered.length)} sur {filtered.length} élèves</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="page-buttons">
              <button className="page-nav" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>◂</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn${safePage === p ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-nav" disabled={safePage === pages} onClick={() => setPage(p => p + 1)}>▸</button>
            </div>
            <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sel && <Modal key="view" eleve={sel} trimestre={trimestre} notesData={notesData} coeffs={coeffs} getMoyenne={getMoyenne} onClose={() => setSel(null)} onEdit={(e) => { setSel(null); setTimeout(() => setEditSel(e), 150); }} />}
        {editSel && <EditModal key="edit" eleve={editSel} trimestre={trimestre} notesData={notesData} coeffs={coeffs} setNotesData={setNotesData} onClose={() => setEditSel(null)} />}
        {showCoeffs && <CoeffModal key="coeffs" coeffs={coeffs} setCoeffs={setCoeffs} onClose={() => setShowCoeffs(false)} />}
        {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} onAdd={handleAddStudent} classes={CLASSES} trimestre={trimestre} />}
      </AnimatePresence>
    </div>
  );
}