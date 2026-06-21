import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";

const CATEGORIES = ["Salaires","Fournitures scolaires","Maintenance","Électricité","Eau","Internet","Événements scolaires","Transport"];
const STATUTS = ["En attente","Approuvée","Rejetée","Payée"];

const CAT_COLORS = {
  "Salaires":             { bg:"#f3e8ff", color:"#6b21a8" },
  "Fournitures scolaires":{ bg:"#dcfce7", color:"#166534" },
  "Maintenance":          { bg:"#fee2e2", color:"#991b1b" },
  "Électricité":          { bg:"#fef9c3", color:"#854d0e" },
  "Eau":                  { bg:"#e0f2fe", color:"#075985" },
  "Internet":             { bg:"#ede9fe", color:"#5b21b6" },
  "Événements scolaires": { bg:"#fce7f3", color:"#9d174d" },
  "Transport":            { bg:"#f0fdf4", color:"#14532d" },
};

const STAT_COLORS = {
  "En attente": { bg:"#fef9c3", color:"#854d0e" },
  "Approuvée":  { bg:"#dcfce7", color:"#166534" },
  "Rejetée":    { bg:"#fee2e2", color:"#991b1b" },
  "Payée":      { bg:"#dbeafe", color:"#1e40af" },
};

const INITIAL_DATA = [
  { id:"DEP-2025-028", cat:"Salaires",             desc:"Salaire des enseignants — Mai 2025",   montant:15000000, date:"24/05/2025", statut:"Payée",      resp:"M. Soumah"  },
  { id:"DEP-2025-027", cat:"Fournitures scolaires", desc:"Achat de manuels scolaires",           montant:2500000,  date:"23/05/2025", statut:"Approuvée",  resp:"A. Diallo"  },
  { id:"DEP-2025-026", cat:"Maintenance",           desc:"Réparation des climatiseurs",          montant:1200000,  date:"22/05/2025", statut:"Payée",      resp:"M. Konaté"  },
  { id:"DEP-2025-025", cat:"Électricité",           desc:"Facture d'électricité — Avril",        montant:850000,   date:"21/05/2025", statut:"Payée",      resp:"A. Diallo"  },
  { id:"DEP-2025-024", cat:"Transport",             desc:"Frais de transport scolaire",          montant:450000,   date:"20/05/2025", statut:"En attente", resp:"M. Soumah"  },
  { id:"DEP-2025-023", cat:"Internet",              desc:"Abonnement internet mensuel",          montant:200000,   date:"18/05/2025", statut:"Payée",      resp:"Direction"  },
  { id:"DEP-2025-022", cat:"Eau",                   desc:"Facture d'eau — Avril",                montant:120000,   date:"15/05/2025", statut:"Payée",      resp:"Direction"  },
  { id:"DEP-2025-021", cat:"Événements scolaires",  desc:"Organisation journée culturelle",      montant:800000,   date:"12/05/2025", statut:"Approuvée",  resp:"M. Soumah"  },
  { id:"DEP-2025-020", cat:"Maintenance",           desc:"Entretien bâtiments",                  montant:300000,   date:"10/05/2025", statut:"Rejetée",    resp:"Technique"  },
  { id:"DEP-2025-019", cat:"Fournitures scolaires", desc:"Achat de cahiers et stylos",           montant:180000,   date:"08/05/2025", statut:"Payée",      resp:"Direction"  },
  { id:"DEP-2025-018", cat:"Salaires",              desc:"Primes personnel administratif",       montant:2000000,  date:"05/05/2025", statut:"Approuvée",  resp:"RH"         },
  { id:"DEP-2025-017", cat:"Transport",             desc:"Carburant véhicule école",             montant:350000,   date:"03/05/2025", statut:"Payée",      resp:"Technique"  },
];

const REVENUS_DATA       = [15,18,16,20,19,17,21,22,18,20,23,25];
const DEPENSES_CHART     = [9,11,10,13,8.6,10,12,11,9,11,12,13];
const MOIS               = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

const DONUT_DATA = [
  { label:"Salaires",    pct:66, color:"#3266ad" },
  { label:"Fournitures", pct:13, color:"#f59e0b" },
  { label:"Maintenance", pct:11, color:"#e24b4a" },
  { label:"Électricité", pct:5,  color:"#8b5cf6" },
  { label:"Autres",      pct:5,  color:"#10b981" },
];

const ACTIVITIES = [
  { type:"add",     label:"Dépense ajoutée",   desc:"Achat de fournitures informatiques", time:"24 Mai 2025 · 14:30", user:"M. Soumah" },
  { type:"approve", label:"Dépense approuvée", desc:"Réparation des climatiseurs",        time:"23 Mai 2025 · 10:15", user:"M. Konaté" },
  { type:"pay",     label:"Dépense payée",     desc:"Facture d'électricité — Avril",      time:"22 Mai 2025 · 16:45", user:"A. Diallo" },
  { type:"edit",    label:"Dépense modifiée",  desc:"Achat de livres scolaires",          time:"21 Mai 2025 · 09:20", user:"M. Soumah" },
];

const ALERTS = [
  { level:"red",    title:"Budget Maintenance dépassé",  msg:"Le budget Maintenance a dépassé la limite de 10% ce mois.", date:"24 Mai 2025" },
  { level:"orange", title:"Dépense élevée détectée",     msg:"Une dépense exceptionnelle de 2 500 000 GNF détectée.",     date:"22 Mai 2025" },
  { level:"orange", title:"Budget bientôt épuisé",       msg:"Il ne reste que 6 350 000 GNF sur le budget global.",       date:"20 Mai 2025" },
];

const fmt = n => n.toLocaleString("fr-FR");

/* ───────────────── helpers ───────────────── */
function Badge({ label, style }) {
  return (
    <span style={{ display:"inline-block", fontSize: 14, padding:"3px 10px", borderRadius:20, fontWeight:500, ...style }}>
      {label}
    </span>
  );
}

function StatCard({ icon, iconBg, label, value, sub, subColor }) {
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px 16px", minWidth:0 }}>
      <div style={{ width:36, height:36, borderRadius:8, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
        {icon}
      </div>
      <div style={{ fontSize: 14, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize: 19, fontWeight:700, color:"#0f172a" }}>{value}</div>
      {sub && <div style={{ fontSize: 14, color:subColor||"#94a3b8", marginTop:3 }}>{sub}</div>}
    </div>
  );
}

/* ─── Line chart via Chart.js ─── */
function LineChart() {
  const ref = useRef(null);
  useEffect(() => {
    let chart = null;
    const init = () => {
      if (!ref.current || !window.Chart) return;
      chart = new window.Chart(ref.current, {
        type: "line",
        data: {
          labels: MOIS,
          datasets: [
            { label:"Revenus",  data:REVENUS_DATA,   borderColor:"#3266ad", backgroundColor:"rgba(50,102,173,0.07)", tension:0.4, fill:true, pointRadius:3, borderWidth:2 },
            { label:"Dépenses", data:DEPENSES_CHART, borderColor:"#e24b4a", backgroundColor:"rgba(226,75,74,0.05)",  tension:0.4, fill:true, pointRadius:3, borderWidth:2, borderDash:[5,3] },
          ],
        },
        options: {
          responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{ display:false } },
          scales:{
            y:{ ticks:{ callback:v=>v+"M", font:{size:11}, color:"#94a3b8" }, grid:{ color:"rgba(148,163,184,0.15)" }, border:{ display:false } },
            x:{ ticks:{ font:{size:11}, color:"#94a3b8" }, grid:{ display:false }, border:{ display:false } },
          },
        },
      });
    };
    if (window.Chart) { init(); }
    else {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => { if (chart) chart.destroy(); };
  }, []);
  return <canvas ref={ref} style={{ width:"100%", height:"100%" }} />;
}

/* ─── SVG donut ─── */
function DonutChart() {
  const cx=80, cy=72, R=55, r=37;
  let start = -Math.PI/2;
  const slices = DONUT_DATA.map(d => {
    const angle = (d.pct/100)*2*Math.PI;
    const end = start + angle;
    const x1=cx+R*Math.cos(start), y1=cy+R*Math.sin(start);
    const x2=cx+R*Math.cos(end),   y2=cy+R*Math.sin(end);
    const xi1=cx+r*Math.cos(end),  yi1=cy+r*Math.sin(end);
    const xi2=cx+r*Math.cos(start),yi2=cy+r*Math.sin(start);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${xi1},${yi1} A${r},${r} 0 ${large},0 ${xi2},${yi2} Z`;
    start = end;
    return { path, color:d.color };
  });
  return (
    <svg viewBox="0 0 160 144" style={{ width:"100%", maxHeight:144 }}>
      {slices.map((s,i) => <path key={i} d={s.path} fill={s.color} />)}
      <text x={cx} y={cy-5}  textAnchor="middle" fontSize={10} fill="#64748b">Total</text>
      <text x={cx} y={cy+10} textAnchor="middle" fontSize={12} fontWeight="700" fill="#0f172a">45 850 000</text>
      <text x={cx} y={cy+23} textAnchor="middle" fontSize={10} fill="#94a3b8">GNF</text>
    </svg>
  );
}

/* ─── Activity dot color ─── */
const actBg = { add:"#dcfce7", approve:"#f3e8ff", pay:"#fef9c3", edit:"#dbeafe" };
const actIcon = {
  add: <i className="ti ti-plus" style={{ fontSize: 14, color: "#166534" }} />,
  approve: <i className="ti ti-check" style={{ fontSize: 14, color: "#6b21a8" }} />,
  pay: <i className="ti ti-cash" style={{ fontSize: 14, color: "#854d0e" }} />,
  edit: <i className="ti ti-pencil" style={{ fontSize: 14, color: "#1e40af" }} />
};

/* ─── Modal ─── */
const lbl = { fontSize: 15, fontWeight:600, color:"#64748b", display:"block", marginBottom:5 };
const inp = {
  width:"100%", padding:"9px 11px", border:"1px solid #e2e8f0",
  borderRadius:8, fontSize: 16, outline:"none", boxSizing:"border-box",
  fontFamily:"inherit", background:"#fff", color:"#0f172a",
};

function Modal({ onClose, onSave, nextId, initialData }) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return { ...initialData, date: initialData.date.split("/").reverse().join("-"), motif: initialData.motif || "", fileName: initialData.fileName || "" };
    }
    return {
      desc:"", cat:"Salaires", montant:"",
      date: new Date().toISOString().split("T")[0],
      resp:"", motif:"", fileName:"",
    };
  });
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const handleSubmit = () => {
    if (!form.desc || !form.montant) return;
    const [y,m,d] = form.date.split("-");
    const formattedDate = `${d}/${m}/${y}`;
    if (initialData) {
      onSave({ ...initialData, ...form, montant: parseInt(form.montant), date: formattedDate });
    } else {
      onSave({ id:nextId, cat:form.cat, desc:form.desc, montant:parseInt(form.montant), date:formattedDate, statut:"En attente", resp:form.resp||"Non défini", motif: form.motif, fileName: form.fileName });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: 460, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        {/* HEADER BANNER */}
        <div style={{ background: "#0066CC", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="ti ti-receipt" style={{ fontSize: 26, color: "#fff" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{initialData ? "Modifier la dépense" : "Nouvelle dépense"}</h2>
              <span style={{ fontSize: 14, color: "#e0f2fe", fontWeight: 600 }}>Caisse &amp; Comptabilité</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>✕</button>
        </div>

        {/* BODY */}
        <div className="modal-body" style={{ padding: "24px", maxHeight: "75vh", overflowY: "auto" }}>
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={lbl}>Référence (auto)</label>
              <input value={initialData ? initialData.id : nextId} readOnly style={{...inp, background:"#f8fafc", color:"#94a3b8"}} />
            </div>

            <div>
              <label style={lbl}>Description *</label>
              <input value={form.desc} onChange={e=>set("desc",e.target.value)} placeholder="Ex: Achat de fournitures scolaires" style={inp} />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={lbl}>Catégorie *</label>
                <select value={form.cat} onChange={e=>set("cat",e.target.value)} style={inp}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Montant (GNF) *</label>
                <input type="number" value={form.montant} onChange={e=>set("montant",e.target.value)} placeholder="Ex: 250000" style={inp} />
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={lbl}>Date *</label>
                <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Responsable</label>
                <input value={form.resp} onChange={e=>set("resp",e.target.value)} placeholder="Ex: M. Soumah" style={inp} />
              </div>
            </div>

            <div>
              <label style={lbl}>Motif / Justification</label>
              <textarea value={form.motif} onChange={e=>set("motif",e.target.value)}
                placeholder="Décrivez le motif de cette dépense..."
                style={{...inp, height:68, resize:"vertical"}} />
            </div>

            <div>
              <label style={lbl}>Pièce justificative</label>
              <label style={{ display:"block", border:"1px dashed #cbd5e1", borderRadius:10, padding:14, textAlign:"center", cursor:"pointer", fontSize: 15, color:"#94a3b8", background: "#f8fafc" }}>
                <div style={{ marginBottom:4 }}><i className="ti ti-paperclip" style={{ fontSize: 30, color: "#0066CC" }} /></div>
                {form.fileName || "Cliquez pour ajouter une facture, reçu ou devis (PDF, image)"}
                <input type="file" accept=".pdf,.jpg,.png,.jpeg" style={{ display:"none" }}
                  onChange={e => set("fileName", e.target.files[0]?.name||"")} />
              </label>
            </div>

            <div>
              <label style={lbl}>Workflow d'approbation</label>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                {["Créée","→","Soumise","→","Validée (Directeur)","→","Payée"].map((s,i) =>
                  s === "→"
                    ? <span key={i} style={{ fontSize: 14, color:"#94a3b8" }}>→</span>
                    : <span key={i} style={{
                        fontSize: 14, padding:"3px 9px", borderRadius:20,
                        background: i===0 ? "#dcfce7" : i===2 ? "#dbeafe" : "#f1f5f9",
                        color:      i===0 ? "#166534" : i===2 ? "#1e40af" : "#64748b",
                        fontWeight: 600,
                      }}>{s}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            <button onClick={onClose} style={{ flex:1, padding:12, border:"1px solid #cbd5e1", borderRadius:10, background:"#fff", fontSize: 16, cursor:"pointer", color:"#64748b", fontFamily:"inherit", fontWeight:700 }}>Annuler</button>
            <button onClick={handleSubmit} style={{ flex:1, padding:12, border:"none", borderRadius:10, background:"#0066CC", color:"#fff", fontSize: 16, cursor:"pointer", fontFamily:"inherit", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><i className="ti ti-device-floppy" style={{ fontSize: 20 }}></i> Enregistrer</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
  function Row({ label, value, bold, color }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <div style={{ fontSize: 16, fontWeight: bold ? 700 : 500, color: color || "#0f172a" }}>{value}</div>
    </div>
  );
}

  function ViewModal({ item, onClose, onEdit }) {
    const statColor = STAT_COLORS[item.statut] || { bg: "#f1f5f9", color: "#475569" };
    const catColor  = CAT_COLORS[item.cat]      || { bg: "#f1f5f9", color: "#475569" };
    return (
      <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: 460, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
          {/* HEADER */}
          <div style={{ background: "#0066CC", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="ti ti-receipt" style={{ fontSize: 26, color: "#fff" }} />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Détails de la dépense</h2>
                <span style={{ fontSize: 14, color: "#e0f2fe", fontWeight: 600 }}>{item.id}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>✕</button>
          </div>

          {/* BODY */}
          <div style={{ padding: "24px", maxHeight: "75vh", overflowY: "auto" }}>
            <div style={{ display: "grid", gap: 14 }}>
              <Row label="Description" value={item.desc} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={lbl}>Catégorie</label>
                  <Badge label={item.cat} style={catColor} />
                </div>
                <div>
                  <label style={lbl}>Statut</label>
                  <Badge label={item.statut} style={statColor} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Row label="Montant" value={fmt(item.montant) + " GNF"} bold color="#dc2626" />
                <Row label="Date" value={item.date} />
              </div>

              <Row label="Responsable" value={item.resp || "Non défini"} />

              {item.motif && <Row label="Motif / Justification" value={item.motif} />}

              {item.fileName && (
                <div>
                  <label style={lbl}>Pièce justificative</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px dashed #cbd5e1", borderRadius: 10, padding: 12, background: "#f8fafc" }}>
                    <i className="ti ti-paperclip" style={{ fontSize: 20, color: "#0066CC" }} />
                    <span style={{ fontSize: 15, color: "#334155" }}>{item.fileName}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={onClose} style={{ flex: 1, padding: 12, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", fontSize: 16, cursor: "pointer", color: "#64748b", fontFamily: "inherit", fontWeight: 700 }}>Fermer</button>
              <button onClick={() => onEdit(item)} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: "#0066CC", color: "#fff", fontSize: 16, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <i className="ti ti-pencil" style={{ fontSize: 18 }} /> Modifier
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
/* ═══════════════ MAIN COMPONENT ═══════════════ */
const PER_PAGE = 5;

export default function Depenses() {
  const [depenses,   setDepenses]   = useState(INITIAL_DATA);
  const [search,     setSearch]     = useState("");
  const [filterCat,  setFilterCat]  = useState("");
  const [filterStat, setFilterStat] = useState("");
  const [page,       setPage]       = useState(1);
  const [showModal,  setShowModal]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [viewItem,   setViewItem]   = useState(null); // ⬅️ nouveau
  const [confirmDelDep, setConfirmDelDep] = useState(null);
 

  const filtered = depenses.filter(d => {
    const s = search.toLowerCase();
    return (
      (!s || d.desc.toLowerCase().includes(s) || d.id.toLowerCase().includes(s)) &&
      (!filterCat  || d.cat    === filterCat)  &&
      (!filterStat || d.statut === filterStat)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const slice      = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalMontant = depenses.reduce((a,d) => a+d.montant, 0);
  const maxId = Math.max(...depenses.map(d => parseInt(d.id.split("-")[2] || 0)), 28);
  const nextId = "DEP-2025-0" + String(maxId + 1).padStart(2,"0");

  const handleSave = d => { 
    if (depenses.find(x => x.id === d.id)) {
      setDepenses(depenses.map(x => x.id === d.id ? d : x));
    } else {
      setDepenses([d, ...depenses]); 
    }
    setShowModal(false); 
    setEditItem(null);
    setPage(1); 
  };

  const handleDelete = id => {
    setDepenses(depenses.filter(d => d.id !== id));
  };

  const openAddModal = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const selStyle = {
    padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:9,
    fontSize: 16, fontFamily:"inherit", outline:"none", background:"#fff", cursor:"pointer", color:"#0f172a",
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", color:"#0f172a", padding:"0 0 2rem" }}>

      {/* ── Top bar ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize: 25, fontWeight:700, margin:0 }}>Gestion des dépenses</h1>
          <p style={{ fontSize: 16, color:"#64748b", marginTop:3 }}>Suivez et gérez toutes les dépenses de l'établissement</p>
        </div>
        <button onClick={openAddModal} style={{ display:"flex", alignItems:"center", gap:8, background:"#0066CC", color:"#fff", border:"none", borderRadius:9, padding:"10px 18px", fontSize: 16, fontWeight:600, cursor:"pointer" }}>
          + Ajouter une dépense
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard icon={<i className="ti ti-briefcase" style={{ color: "#0066CC", fontSize: 20 }} />} iconBg="#dbeafe" label="Dépenses totales"  value={fmt(totalMontant)+" GNF"} sub="↑ 12,5% vs mois dernier" subColor="#16a34a" />
        <StatCard icon={<i className="ti ti-calendar" style={{ color: "#7c3aed", fontSize: 20 }} />} iconBg="#f3e8ff" label="Ce mois (Mai)"     value="8 650 000 GNF"            sub="↑ 8,2% vs mois dernier"  subColor="#16a34a" />
        <StatCard icon={<i className="ti ti-chart-pie" style={{ color: "#16a34a", fontSize: 20 }} />} iconBg="#dcfce7" label="Budget restant"    value="6 350 000 GNF"            sub="↓ 15,3% du budget"        subColor="#dc2626" />
        <StatCard icon={<i className="ti ti-receipt" style={{ color: "#ca8a04", fontSize: 20 }} />} iconBg="#fef9c3" label="Nb dépenses"       value={depenses.length}          sub="↑ 5 nouvelles"            subColor="#16a34a" />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:14, marginBottom:24 }}>
        {/* Line chart */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:16 }}>
          <div style={{ fontSize: 16, fontWeight:600, marginBottom:10 }}>Revenus vs dépenses — 12 derniers mois</div>
          <div style={{ display:"flex", gap:16, marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize: 15, color:"#64748b" }}>
                <span style={{ width:10, height:10, borderRadius:2, background:"#0066CC", display:"inline-block" }}></span>Revenus
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize: 15, color:"#64748b" }}>
                <span style={{ width:10, height:10, borderRadius:2, background:"#e24b4a", display:"inline-block" }}></span>Dépenses
              </div>
          </div>
          <div style={{ height:200, width:"100%", position:"relative" }}><LineChart /></div>
        </div>

        {/* Donut */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:16 }}>
          <div style={{ fontSize: 16, fontWeight:600, marginBottom:10 }}>Répartition par catégorie</div>
          <div style={{ height:160, width:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><DonutChart /></div>
          <div style={{ marginTop:6 }}>
            {DONUT_DATA.map(d => (
              <div key={d.label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, fontSize: 15 }}>
                <span style={{ width:10, height:10, borderRadius:2, background:d.color, flexShrink:0 }}></span>
                <span style={{ flex:1, color:"#334155" }}>{d.label}</span>
                <span style={{ fontWeight:600, color:"#64748b" }}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alerts + Activity ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(350px, 1fr))", gap:14, marginBottom:24, alignItems:"start" }}>
        {/* Alerts */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:16 }}>
          <div style={{ fontSize: 16, fontWeight:600, marginBottom:12, display: "flex", alignItems: "center", gap: 6 }}><i className="ti ti-bell-ringing" style={{ color: "#dc2626", fontSize: 18 }}></i> Alertes budgétaires</div>
          {ALERTS.map((a,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:i<ALERTS.length-1?"1px solid #f1f5f9":"none" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:a.level==="red"?"#dc2626":"#f59e0b", marginTop:5, flexShrink:0 }}></div>
              <div>
                <div style={{ fontSize: 16, fontWeight:600 }}>{a.title}</div>
                <div style={{ fontSize: 15, color:"#64748b", marginTop:2 }}>{a.msg} — {a.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:16 }}>
          <div style={{ fontSize: 16, fontWeight:600, marginBottom:12, display: "flex", alignItems: "center", gap: 6 }}><i className="ti ti-bolt" style={{ color: "#f59e0b", fontSize: 18 }}></i> Activités récentes</div>
          {ACTIVITIES.map((a,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:i<ACTIVITIES.length-1?"1px solid #f1f5f9":"none" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:actBg[a.type], display:"flex", alignItems:"center", justifyContent:"center", fontSize: 16, flexShrink:0 }}>
                {actIcon[a.type]}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight:600 }}>{a.label}</div>
                <div style={{ fontSize: 14, color:"#64748b" }}>{a.desc}</div>
                <div style={{ fontSize: 14, color:"#94a3b8", marginTop:1 }}>{a.time} · {a.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:160 }}>
          <i className="ti ti-search" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize: 17 }}></i>
          <input
            type="text" placeholder="Rechercher une dépense..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ ...selStyle, width:"100%", paddingLeft:32, boxSizing:"border-box" }}
          />
        </div>
        <select value={filterCat}  onChange={e => { setFilterCat(e.target.value);  setPage(1); }} style={selStyle}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStat} onChange={e => { setFilterStat(e.target.value); setPage(1); }} style={selStyle}>
          <option value="">Tous statuts</option>
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", border:"1px solid #e2e8f0", borderRadius:9, background:"#fff", fontSize: 16, cursor:"pointer", color:"#334155" }}>
          📥 Exporter
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden" }}>
        <div style={{ maxHeight: 380, overflowY: "auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
            <colgroup>
              <col style={{width:177}}/><col style={{width:135}}/><col/><col style={{width:145}}/><col style={{width:97}}/><col style={{width:107}}/><col style={{width:97}}/><col style={{width:120}}/>
            </colgroup>
            <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
              <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                {["Catégorie","Description","Montant","Date","Statut","Responsable","Actions"].map(h => (
                  <th key={h} style={{ padding:"11px 12px", textAlign:"left", fontSize: 14, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {slice.map((d,i) => (
              <tr key={d.id} style={{ borderBottom:"1px solid #f1f5f9", background:i%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"11px 12px", fontSize: 15, color:"#64748b" }}>{d.id}</td>
                <td style={{ padding:"11px 12px" }}>
                  <Badge label={d.cat} style={CAT_COLORS[d.cat]||{bg:"#f1f5f9",color:"#475569"}} />
                </td>
                <td style={{ padding:"11px 12px", fontSize: 16, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.desc}</td>
                <td style={{ padding:"11px 12px", fontSize: 16, fontWeight:600, color:"#dc2626" }}>{fmt(d.montant)} GNF</td>
                <td style={{ padding:"11px 12px", fontSize: 16, color:"#334155" }}>{d.date}</td>
                <td style={{ padding:"11px 12px" }}>
                  <Badge label={d.statut} style={STAT_COLORS[d.statut]||{bg:"#f1f5f9",color:"#475569"}} />
                </td>
                <td style={{ padding:"11px 12px", fontSize: 15, color:"#64748b" }}>{d.resp}</td>
                <td style={{ padding:"11px 12px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => setViewItem(d)} style={{ background: "#eff6ff", color: "#2563eb", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="ti ti-eye" /> Voir
                    </button>
                    <button onClick={() => { setEditItem(d); setShowModal(true); }} style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
                      <i className="ti ti-pencil" />
                    </button>
                    <button onClick={() => setConfirmDelDep(d)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
                      <i className="ti ti-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr><td colSpan={8} style={{ padding:32, textAlign:"center", color:"#94a3b8", fontSize: 16 }}>Aucune dépense trouvée</td></tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination reste en dehors, donc fixe */}
        
      </div>

      <AnimatePresence mode="wait">
        {viewItem && (
          <ViewModal
            key="view-modal"
            item={viewItem}
            onClose={() => setViewItem(null)}
            onEdit={(item) => { setViewItem(null); setEditItem(item); setShowModal(true); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showModal && <Modal key="expense-modal" onClose={() => { setShowModal(false); setEditItem(null); }} onSave={handleSave} nextId={nextId} initialData={editItem} />}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!confirmDelDep}
        title="Supprimer la dépense"
        message={confirmDelDep ? `Voulez-vous vraiment supprimer la dépense "${confirmDelDep.desc}" ? Cette action est irréversible.` : ""}
        onConfirm={() => { handleDelete(confirmDelDep.id); setConfirmDelDep(null); }}
        onCancel={() => setConfirmDelDep(null)}
      />
    </div>
  );
}