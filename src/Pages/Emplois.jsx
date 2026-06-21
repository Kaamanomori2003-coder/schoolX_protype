import { useState } from "react";

const t = {
  bg:"#f7f8fa", surface:"#ffffff", border:"#eaecf0",
  blue:"#2563eb", blueSoft:"#eff6ff", blueMid:"#dbeafe",
  text:"#111827", sub:"#6b7280", muted:"#9ca3af",
  green:"#059669", greenSoft:"#f0fdf4",
  red:"#dc2626", redSoft:"#fef2f2",
  radius:"10px", radiusLg:"14px",
  shadow:"0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

const mColors = {
  "Mathématiques":   { bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe" },
  "Français":        { bg:"#f5f3ff", color:"#7c3aed", border:"#ddd6fe" },
  "Physique-Chimie": { bg:"#ecfeff", color:"#0891b2", border:"#a5f3fc" },
  "Histoire-Géo":    { bg:"#fffbeb", color:"#d97706", border:"#fde68a" },
  "Anglais":         { bg:"#f0fdf4", color:"#059669", border:"#bbf7d0" },
  "SVT":             { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0" },
  "Informatique":    { bg:"#e0f2fe", color:"#0369a1", border:"#7dd3fc" },
  "Philosophie":     { bg:"#faf5ff", color:"#9333ea", border:"#e9d5ff" },
  "Sport":           { bg:"#fff1f2", color:"#e11d48", border:"#fecdd3" },
  "Récréation":      { bg:"#f8fafc", color:"#94a3b8", border:"#e2e8f0" },
};

const MATIERES_LIST = ["Mathématiques","Français","Physique-Chimie","Histoire-Géo","Anglais","SVT","Informatique","Philosophie","Sport","Récréation",""];
const getM = (nom) => mColors[nom] || { bg:"#f8fafc", color:"#6b7280", border:"#e5e7eb" };

const CLASSES = ["Terminale A","Terminale S","1ère S","Seconde C","3ème B","4ème C"];
const HEURES  = ["07h30","08h30","09h30","10h30","11h30","14h00"];
const JOURS   = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

const defaultEmploi = () => {
  const e = {};
  JOURS.forEach(j => { e[j] = ["","","","","",""]; });
  return e;
};

const INIT = {
  "Terminale A": {
    "Lundi":    ["Mathématiques","Mathématiques","Français","Récréation","Physique-Chimie","Philosophie"],
    "Mardi":    ["Français","Anglais","Histoire-Géo","Récréation","Mathématiques","Philosophie"],
    "Mercredi": ["Physique-Chimie","Mathématiques","Anglais","Récréation","Français",""],
    "Jeudi":    ["Histoire-Géo","Philosophie","Mathématiques","Récréation","Anglais","Français"],
    "Vendredi": ["Anglais","Physique-Chimie","Philosophie","Récréation","Mathématiques","Sport"],
    "Samedi":   ["Mathématiques","Français","","","",""],
  },
  "Terminale S": {
    "Lundi":    ["Mathématiques","SVT","Physique-Chimie","Récréation","Anglais","Français"],
    "Mardi":    ["SVT","Physique-Chimie","Mathématiques","Récréation","Histoire-Géo","Anglais"],
    "Mercredi": ["Français","Mathématiques","SVT","Récréation","Physique-Chimie",""],
    "Jeudi":    ["Physique-Chimie","Anglais","SVT","Récréation","Mathématiques","Français"],
    "Vendredi": ["SVT","Mathématiques","Anglais","Récréation","Physique-Chimie","Sport"],
    "Samedi":   ["SVT","Physique-Chimie","","","",""],
  },
  "1ère S": {
    "Lundi":    ["Mathématiques","SVT","Physique-Chimie","Récréation","Français","Anglais"],
    "Mardi":    ["Français","Mathématiques","Histoire-Géo","Récréation","SVT","Physique-Chimie"],
    "Mercredi": ["Anglais","Physique-Chimie","Mathématiques","Récréation","SVT",""],
    "Jeudi":    ["SVT","Français","Anglais","Récréation","Physique-Chimie","Mathématiques"],
    "Vendredi": ["Physique-Chimie","SVT","Mathématiques","Récréation","Anglais","Sport"],
    "Samedi":   ["Mathématiques","SVT","","","",""],
  },
  "Seconde C": {
    "Lundi":    ["Mathématiques","Français","Histoire-Géo","Récréation","Physique-Chimie","Anglais"],
    "Mardi":    ["Physique-Chimie","Mathématiques","Anglais","Récréation","Français","SVT"],
    "Mercredi": ["Histoire-Géo","Anglais","Mathématiques","Récréation","Français",""],
    "Jeudi":    ["Anglais","SVT","Français","Récréation","Mathématiques","Physique-Chimie"],
    "Vendredi": ["SVT","Physique-Chimie","Histoire-Géo","Récréation","Mathématiques","Sport"],
    "Samedi":   ["Français","Mathématiques","","","",""],
  },
  "3ème B": {
    "Lundi":    ["Mathématiques","Français","Anglais","Récréation","Histoire-Géo","Physique-Chimie"],
    "Mardi":    ["Français","Histoire-Géo","Mathématiques","Récréation","Anglais","SVT"],
    "Mercredi": ["Anglais","Mathématiques","Physique-Chimie","Récréation","Français",""],
    "Jeudi":    ["SVT","Anglais","Histoire-Géo","Récréation","Mathématiques","Français"],
    "Vendredi": ["Histoire-Géo","Physique-Chimie","SVT","Récréation","Anglais","Sport"],
    "Samedi":   ["Mathématiques","Français","","","",""],
  },
  "4ème C": {
    "Lundi":    ["Mathématiques","Français","SVT","Récréation","Anglais","Informatique"],
    "Mardi":    ["Informatique","Mathématiques","Français","Récréation","SVT","Histoire-Géo"],
    "Mercredi": ["Anglais","SVT","Mathématiques","Récréation","Informatique",""],
    "Jeudi":    ["Histoire-Géo","Informatique","Anglais","Récréation","Mathématiques","Français"],
    "Vendredi": ["SVT","Mathématiques","Histoire-Géo","Récréation","Informatique","Sport"],
    "Samedi":   ["Informatique","Mathématiques","","","",""],
  },
};

/* ─── UI PRIMITIVES ──────────────────────────────────────────── */
const Btn = ({ icon, label, primary, danger, small, onClick }) => (
  <button onClick={onClick} style={{
    display:"flex", alignItems:"center", gap:6,
    padding: small ? "6px 12px" : "9px 16px",
    border: primary ? "none" : `1px solid ${danger ? "#fecaca" : t.border}`,
    borderRadius:t.radius, cursor:"pointer", fontFamily:t.font,
    fontSize: small ? 12 : 13, fontWeight:600,
    background: primary ? t.blue : danger ? t.redSoft : t.surface,
    color: primary ? "#fff" : danger ? t.red : t.sub,
    boxShadow: primary ? `0 2px 8px rgba(37,99,235,0.25)` : t.shadow,
    transition:"all .15s",
    whiteSpace:"nowrap",
  }}
    onMouseEnter={e => { e.currentTarget.style.opacity=".85"; e.currentTarget.style.transform="translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.opacity="1";   e.currentTarget.style.transform="translateY(0)"; }}
  >
    <i className={`ti ${icon}`} style={{ fontSize: small ? 13 : 14 }} />
    {label}
  </button>
);

export default function Emplois() {
  const [classe,   setClasse]   = useState("Terminale A");
  const [emplois,  setEmplois]  = useState(INIT);
  const [hovered,  setHovered]  = useState(null);
  const [editCell, setEditCell] = useState(null); // {jour, hi}
  const [addModal, setAddModal] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [newClasse,setNewClasse]= useState("");
  const [toast,    setToast]    = useState(null);

  const emploi = emplois[classe] || defaultEmploi();

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  /* ── Modifier une cellule ── */
  const handleCellChange = (jour, hi, val) => {
    setEmplois(prev => ({
      ...prev,
      [classe]: {
        ...prev[classe],
        [jour]: prev[classe][jour].map((c, i) => i === hi ? val : c),
      },
    }));
  };

  /* ── Vider une cellule ── */
  const clearCell = (jour, hi) => {
    handleCellChange(jour, hi, "");
    showToast("Cours supprimé");
  };

  /* ── Ajouter une classe ── */
  const addClasse = () => {
    if (!newClasse.trim() || emplois[newClasse]) return;
    setEmplois(prev => ({ ...prev, [newClasse]: defaultEmploi() }));
    setClasse(newClasse);
    setNewClasse("");
    setAddModal(false);
    showToast(`Classe "${newClasse}" ajoutée`);
  };

  /* ── Supprimer une classe ── */
  const deleteClasse = () => {
    const keys = Object.keys(emplois).filter(k => k !== classe);
    if (keys.length === 0) return;
    const next = { ...emplois };
    delete next[classe];
    setEmplois(next);
    setClasse(keys[0]);
    setDelModal(false);
    showToast(`Classe "${classe}" supprimée`, "error");
  };

  /* ── Vider tout l'emploi d'une classe ── */
  const clearAll = () => {
    setEmplois(prev => ({ ...prev, [classe]: defaultEmploi() }));
    showToast("Emploi du temps réinitialisé");
  };

  const allCours = Object.values(emploi).flat().filter(c => c && c !== "Récréation");
  const matiereCount = {};
  allCours.forEach(c => { matiereCount[c] = (matiereCount[c]||0)+1; });
  const topMatiere = Object.entries(matiereCount).sort((a,b)=>b[1]-a[1])[0];

  return (
    <div style={{ fontFamily:t.font, color:t.text }}>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:999,
          background: toast.type==="error" ? t.red : t.green,
          color:"#fff", padding:"11px 18px", borderRadius:10,
          fontSize:13, fontWeight:600, boxShadow:"0 4px 16px rgba(0,0,0,0.15)",
          display:"flex", alignItems:"center", gap:8,
        }}>
          <i className={`ti ${toast.type==="error"?"ti-x":"ti-check"}`} style={{ fontSize:15 }} />
          {toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Emplois du temps</h1>
          <p style={{ fontSize:13, color:t.sub, marginTop:4, margin:0 }}>
            Cliquez sur une cellule pour modifier — {Object.keys(emplois).length} classes configurées
          </p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn icon="ti-plus"    label="Nouvelle classe" primary onClick={() => setAddModal(true)} />
          <Btn icon="ti-printer" label="Imprimer"                onClick={() => window.print()} />
        </div>
      </div>

      {/* ── SÉLECTEUR CLASSES ── */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        {Object.keys(emplois).map(c => (
          <button key={c} onClick={() => setClasse(c)} style={{
            padding:"7px 14px", borderRadius:t.radius,
            border:`1px solid ${classe===c ? t.blue : t.border}`,
            background:classe===c ? t.blue : t.surface,
            color:classe===c ? "#fff" : t.sub,
            fontSize:13, fontWeight:classe===c ? 600 : 400,
            cursor:"pointer", fontFamily:t.font, transition:"all .15s",
            boxShadow:classe===c ? `0 2px 8px rgba(37,99,235,0.2)` : t.shadow,
          }}>{c}</button>
        ))}
      </div>

      {/* ── ACTIONS CLASSE ── */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", padding:"12px 14px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius, boxShadow:t.shadow }}>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:t.blueSoft, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ti ti-school" style={{ fontSize:16, color:t.blue }} />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{classe}</div>
            <div style={{ fontSize:11, color:t.muted }}>{allCours.length} cours · {Object.keys(matiereCount).length} matières · {topMatiere?.[0] || "—"} en tête</div>
          </div>
        </div>
        <Btn icon="ti-refresh"  label="Réinitialiser" small onClick={clearAll} />
        <Btn icon="ti-trash"    label="Supprimer la classe" small danger onClick={() => setDelModal(true)} />
      </div>

      {/* ── STATS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:20 }}>
        {[
          { icon:"ti-clock",    label:"Cours / semaine", value:`${allCours.length}h`,          c:t.blue,   bg:t.blueSoft  },
          { icon:"ti-book",     label:"Matières",         value:Object.keys(matiereCount).length, c:"#7c3aed", bg:"#f5f3ff" },
          { icon:"ti-calendar", label:"Jours actifs",     value:JOURS.filter(j=>emploi[j]?.some(c=>c&&c!=="Récréation")).length, c:t.green, bg:t.greenSoft },
          { icon:"ti-star",     label:"Matière phare",    value:topMatiere?.[0]||"—",           c:"#d97706", bg:"#fffbeb"  },
        ].map(s => (
          <div key={s.label} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:"13px 15px", display:"flex", alignItems:"center", gap:11, boxShadow:t.shadow }}>
            <div style={{ width:34, height:34, borderRadius:8, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={`ti ${s.icon}`} style={{ fontSize:16, color:s.c }} />
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:10, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".4px" }}>{s.label}</div>
              <div style={{ fontSize:14, fontWeight:700, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── GRILLE ── */}
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow }}>

        <div style={{ padding:"12px 18px", borderBottom:`1px solid ${t.border}`, background:t.bg, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:t.text }}>
            <i className="ti ti-calendar-week" style={{ color:t.blue, marginRight:7, fontSize:15 }} />
            Semaine type — {classe}
          </div>
          <div style={{ fontSize:12, color:t.muted }}>
            <i className="ti ti-click" style={{ marginRight:5, fontSize:13 }} />
            Cliquez sur une cellule pour modifier
          </div>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:640 }}>
            <thead>
              <tr>
                <th style={{ width:68, padding:"11px 14px", background:t.bg, borderBottom:`1px solid ${t.border}`, borderRight:`1px solid ${t.border}`, fontSize:11, fontWeight:600, color:t.muted, textTransform:"uppercase", letterSpacing:".4px", textAlign:"left" }}>
                  Heure
                </th>
                {JOURS.map(j => (
                  <th key={j} style={{ padding:"11px 10px", background:t.bg, borderBottom:`1px solid ${t.border}`, borderRight:`1px solid ${t.border}`, fontSize:12, fontWeight:600, color:t.text, textAlign:"center" }}>
                    {j}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEURES.map((heure, hi) => (
                <tr key={heure}>
                  <td style={{ padding:"8px 14px", background:t.bg, borderBottom:`1px solid ${t.border}`, borderRight:`1px solid ${t.border}`, fontSize:12, fontWeight:600, color:t.blue, whiteSpace:"nowrap", verticalAlign:"middle" }}>
                    {heure}
                  </td>
                  {JOURS.map((jour, ji) => {
                    const cours   = emploi[jour]?.[hi] || "";
                    const mc      = getM(cours);
                    const key     = `${ji}-${hi}`;
                    const isHov   = hovered === key;
                    const isEdit  = editCell?.jour === jour && editCell?.hi === hi;
                    const isRecre = cours === "Récréation";
                    const isEmpty = !cours;

                    return (
                      <td key={jour} style={{ padding:"5px 6px", borderBottom:`1px solid ${t.border}`, borderRight:`1px solid ${t.border}`, verticalAlign:"middle" }}>

                        {/* MODE ÉDITION */}
                        {isEdit ? (
                          <div style={{ position:"relative" }}>
                            <select
                              autoFocus
                              value={cours}
                              onChange={e => { handleCellChange(jour, hi, e.target.value); setEditCell(null); showToast("Cours mis à jour"); }}
                              onBlur={() => setEditCell(null)}
                              style={{ width:"100%", height:52, padding:"4px 8px", border:`2px solid ${t.blue}`, borderRadius:8, fontSize:12, fontWeight:600, fontFamily:t.font, color:t.text, outline:"none", cursor:"pointer", background:t.surface }}
                            >
                              {MATIERES_LIST.map(m => <option key={m} value={m}>{m || "— Vide —"}</option>)}
                            </select>
                          </div>
                        ) : isEmpty ? (
                          /* CELLULE VIDE */
                          <div
                            onClick={() => setEditCell({ jour, hi })}
                            onMouseEnter={() => setHovered(key)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                              height:52, borderRadius:8,
                              background:isHov ? "#f1f5f9" : t.bg,
                              border:`1.5px dashed ${isHov ? t.blue+"66" : t.border}`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              cursor:"pointer", transition:"all .15s",
                            }}
                          >
                            {isHov && <i className="ti ti-plus" style={{ fontSize:16, color:t.blue+"99" }} />}
                          </div>
                        ) : isRecre ? (
                          /* RÉCRÉATION */
                          <div
                            onClick={() => setEditCell({ jour, hi })}
                            style={{ height:52, borderRadius:8, background:"#f8fafc", border:`1px solid #e5e7eb`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:t.muted, gap:4, cursor:"pointer" }}
                          >
                            <i className="ti ti-coffee" style={{ fontSize:13 }} /> Récré
                          </div>
                        ) : (
                          /* COURS */
                          <div
                            onMouseEnter={() => setHovered(key)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                              height:52, borderRadius:8,
                              background:isHov ? mc.color : mc.bg,
                              border:`1px solid ${mc.border}`,
                              display:"flex", alignItems:"center", justifyContent:"space-between",
                              padding:"0 8px", cursor:"pointer",
                              transition:"all .18s",
                              boxShadow:isHov ? `0 3px 10px ${mc.color}33` : "none",
                              transform:isHov ? "scale(1.02)" : "scale(1)",
                              gap:4,
                            }}
                          >
                            <span
                              onClick={() => setEditCell({ jour, hi })}
                              style={{ fontSize:11, fontWeight:700, color:isHov?"#fff":mc.color, lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}
                            >
                              {cours}
                            </span>
                            {isHov && (
                              <button
                                onClick={e => { e.stopPropagation(); clearCell(jour, hi); }}
                                style={{ background:"rgba(255,255,255,0.25)", border:"none", borderRadius:5, width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, padding:0 }}
                              >
                                <i className="ti ti-x" style={{ fontSize:11, color:"#fff" }} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende */}
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${t.border}`, background:t.bg, display:"flex", flexWrap:"wrap", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:11, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".4px", marginRight:4 }}>Légende :</span>
          {Object.entries(matiereCount).map(([mat, h]) => {
            const mc = getM(mat);
            return (
              <div key={mat} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:9, height:9, borderRadius:3, background:mc.color }} />
                <span style={{ fontSize:11, color:t.sub }}>{mat} ({h}h)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL AJOUTER CLASSE ── */}
      {addModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.25)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:400 }}>
          <div style={{ background:t.surface, borderRadius:16, padding:28, width:"min(400px,90vw)", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>Nouvelle classe</h3>
                <p style={{ margin:0, fontSize:12, color:t.muted, marginTop:3 }}>Un emploi du temps vide sera créé</p>
              </div>
              <button onClick={() => setAddModal(false)} style={{ background:t.bg, border:"none", borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub }}>
                <i className="ti ti-x" style={{ fontSize:15 }} />
              </button>
            </div>
            <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:6 }}>Nom de la classe</label>
            <input
              autoFocus
              type="text" placeholder="Ex : Terminale B, 5ème A..."
              value={newClasse} onChange={e => setNewClasse(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addClasse()}
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${t.border}`, borderRadius:9, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text }}
              onFocus={e => e.currentTarget.style.borderColor=t.blue}
              onBlur={e  => e.currentTarget.style.borderColor=t.border}
            />
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={() => setAddModal(false)} style={{ flex:1, padding:"10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
              <button onClick={addClasse} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:t.blue, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font }}>Créer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL SUPPRIMER CLASSE ── */}
      {delModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.25)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:400 }}>
          <div style={{ background:t.surface, borderRadius:16, padding:28, width:"min(380px,90vw)", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ width:48, height:48, borderRadius:12, background:t.redSoft, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
              <i className="ti ti-trash" style={{ fontSize:22, color:t.red }} />
            </div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, marginBottom:8 }}>Supprimer la classe</h3>
            <p style={{ fontSize:13, color:t.sub, margin:"0 0 20px" }}>
              Voulez-vous vraiment supprimer l'emploi du temps de <strong>{classe}</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setDelModal(false)} style={{ flex:1, padding:"10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
              <button onClick={deleteClasse} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:t.red, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
