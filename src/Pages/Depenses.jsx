import { useState, useEffect, useRef } from "react";

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
    <span style={{ display:"inline-block", fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:500, ...style }}>
      {label}
    </span>
  );
}

function StatCard({ iconEmoji, iconBg, iconColor, label, value, sub, subColor }) {
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px 16px", minWidth:0 }}>
      <div style={{ width:36, height:36, borderRadius:8, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginBottom:10 }}>
        {iconEmoji}
      </div>
      <div style={{ fontSize:11, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:subColor||"#94a3b8", marginTop:3 }}>{sub}</div>}
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
const actIcon = { add:"＋", approve:"✓", pay:"💰", edit:"✎" };

/* ─── Modal ─── */
const lbl = { fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5 };
const inp = {
  width:"100%", padding:"9px 11px", border:"1px solid #e2e8f0",
  borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box",
  fontFamily:"inherit", background:"#fff", color:"#0f172a",
};

function Modal({ onClose, onAdd, nextId }) {
  const [form, setForm] = useState({
    desc:"", cat:"Salaires", montant:"",
    date: new Date().toISOString().split("T")[0],
    resp:"", motif:"", fileName:"",
  });
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const handleSubmit = () => {
    if (!form.desc || !form.montant) return;
    const [y,m,d] = form.date.split("-");
    onAdd({ id:nextId, cat:form.cat, desc:form.desc, montant:parseInt(form.montant), date:`${d}/${m}/${y}`, statut:"En attente", resp:form.resp||"Non défini" });
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
      <div style={{ background:"#fff", borderRadius:14, padding:26, width:460, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h2 style={{ fontSize:16, fontWeight:700, margin:0, color:"#0f172a" }}>Nouvelle dépense</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#94a3b8" }}>✕</button>
        </div>

        <div style={{ marginBottom:12 }}>
          <label style={lbl}>Référence (auto)</label>
          <input value={nextId} readOnly style={{...inp, background:"#f8fafc", color:"#94a3b8"}} />
        </div>

        <div style={{ marginBottom:12 }}>
          <label style={lbl}>Description *</label>
          <input value={form.desc} onChange={e=>set("desc",e.target.value)} placeholder="Ex: Achat de fournitures scolaires" style={inp} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
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

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <div>
            <label style={lbl}>Date *</label>
            <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Responsable</label>
            <input value={form.resp} onChange={e=>set("resp",e.target.value)} placeholder="Ex: M. Soumah" style={inp} />
          </div>
        </div>

        <div style={{ marginBottom:12 }}>
          <label style={lbl}>Motif / Justification</label>
          <textarea value={form.motif} onChange={e=>set("motif",e.target.value)}
            placeholder="Décrivez le motif de cette dépense..."
            style={{...inp, height:68, resize:"vertical"}} />
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Pièce justificative</label>
          <label style={{ display:"block", border:"1px dashed #e2e8f0", borderRadius:8, padding:14, textAlign:"center", cursor:"pointer", fontSize:12, color:"#94a3b8" }}>
            <div style={{ fontSize:20, marginBottom:4 }}>📎</div>
            {form.fileName || "Cliquez pour ajouter une facture, reçu ou devis (PDF, image)"}
            <input type="file" accept=".pdf,.jpg,.png,.jpeg" style={{ display:"none" }}
              onChange={e => set("fileName", e.target.files[0]?.name||"")} />
          </label>
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={lbl}>Workflow d'approbation</label>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            {["Créée","→","Soumise","→","Validée (Directeur)","→","Payée"].map((s,i) =>
              s === "→"
                ? <span key={i} style={{ fontSize:11, color:"#94a3b8" }}>→</span>
                : <span key={i} style={{
                    fontSize:11, padding:"3px 9px", borderRadius:20,
                    background: i===0 ? "#dcfce7" : i===2 ? "#dbeafe" : "#f1f5f9",
                    color:      i===0 ? "#166534" : i===2 ? "#1e40af" : "#64748b",
                  }}>{s}</span>
            )}
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:10, border:"1px solid #e2e8f0", borderRadius:8, background:"#fff", fontSize:13, cursor:"pointer", color:"#64748b", fontFamily:"inherit" }}>Annuler</button>
          <button onClick={handleSubmit} style={{ flex:1, padding:10, border:"none", borderRadius:8, background:"#1a3ed4", color:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>Enregistrer</button>
        </div>
      </div>
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
  const nextId = `DEP-2025-0${String(29 + depenses.length - INITIAL_DATA.length).padStart(2,"0")}`;

  const handleAdd = d => { setDepenses(p => [d,...p]); setShowModal(false); setPage(1); };

  const selStyle = {
    padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:9,
    fontSize:13, fontFamily:"inherit", outline:"none", background:"#fff", cursor:"pointer", color:"#0f172a",
  };

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", color:"#0f172a", padding:"0 0 2rem" }}>

      {/* ── Top bar ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Gestion des dépenses</h1>
          <p style={{ fontSize:13, color:"#64748b", marginTop:3 }}>Suivez et gérez toutes les dépenses de l'établissement</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display:"flex", alignItems:"center", gap:8, background:"#1a3ed4", color:"#fff", border:"none", borderRadius:9, padding:"10px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          + Ajouter une dépense
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard iconEmoji="💼" iconBg="#dbeafe" label="Dépenses totales"  value={fmt(totalMontant)+" GNF"} sub="↑ 12,5% vs mois dernier" subColor="#16a34a" />
        <StatCard iconEmoji="📅" iconBg="#f3e8ff" label="Ce mois (Mai)"     value="8 650 000 GNF"            sub="↑ 8,2% vs mois dernier"  subColor="#16a34a" />
        <StatCard iconEmoji="📊" iconBg="#dcfce7" label="Budget restant"    value="6 350 000 GNF"            sub="↓ 15,3% du budget"        subColor="#dc2626" />
        <StatCard iconEmoji="🧾" iconBg="#fef9c3" label="Nb dépenses"       value={depenses.length}          sub="↑ 5 nouvelles"            subColor="#16a34a" />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:14, marginBottom:24 }}>
        {/* Line chart */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:16 }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Revenus vs dépenses — 12 derniers mois</div>
          <div style={{ display:"flex", gap:16, marginBottom:10 }}>
            {[["#3266ad","Revenus"],["#e24b4a","Dépenses"]].map(([c,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#64748b" }}>
                <span style={{ width:10, height:10, borderRadius:2, background:c, display:"inline-block" }}></span>{l}
              </div>
            ))}
          </div>
          <div style={{ height:200 }}><LineChart /></div>
        </div>

        {/* Donut */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:16 }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Répartition par catégorie</div>
          <DonutChart />
          <div style={{ marginTop:6 }}>
            {DONUT_DATA.map(d => (
              <div key={d.label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, fontSize:12 }}>
                <span style={{ width:10, height:10, borderRadius:2, background:d.color, flexShrink:0 }}></span>
                <span style={{ flex:1, color:"#334155" }}>{d.label}</span>
                <span style={{ fontWeight:600, color:"#64748b" }}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alerts + Activity ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:14, marginBottom:24 }}>
        {/* Alerts */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:16 }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>🔔 Alertes budgétaires</div>
          {ALERTS.map((a,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:i<ALERTS.length-1?"1px solid #f1f5f9":"none" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:a.level==="red"?"#dc2626":"#f59e0b", marginTop:5, flexShrink:0 }}></div>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{a.title}</div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{a.msg} — {a.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:16 }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>⚡ Activités récentes</div>
          {ACTIVITIES.map((a,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:i<ACTIVITIES.length-1?"1px solid #f1f5f9":"none" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:actBg[a.type], display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>
                {actIcon[a.type]}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600 }}>{a.label}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{a.desc}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>{a.time} · {a.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:160 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize:14 }}>🔍</span>
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
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", border:"1px solid #e2e8f0", borderRadius:9, background:"#fff", fontSize:13, cursor:"pointer", color:"#334155" }}>
          📥 Exporter
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
          <colgroup>
            <col style={{width:110}}/><col style={{width:135}}/><col/><col style={{width:145}}/><col style={{width:97}}/><col style={{width:107}}/><col style={{width:97}}/><col style={{width:78}}/>
          </colgroup>
          <thead>
            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
              {["Référence","Catégorie","Description","Montant","Date","Statut","Responsable","Actions"].map(h => (
                <th key={h} style={{ padding:"11px 12px", textAlign:"left", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((d,i) => (
              <tr key={d.id} style={{ borderBottom:"1px solid #f1f5f9", background:i%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"11px 12px", fontSize:12, color:"#64748b" }}>{d.id}</td>
                <td style={{ padding:"11px 12px" }}>
                  <Badge label={d.cat} style={CAT_COLORS[d.cat]||{bg:"#f1f5f9",color:"#475569"}} />
                </td>
                <td style={{ padding:"11px 12px", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.desc}</td>
                <td style={{ padding:"11px 12px", fontSize:13, fontWeight:600, color:"#dc2626" }}>{fmt(d.montant)} GNF</td>
                <td style={{ padding:"11px 12px", fontSize:13, color:"#334155" }}>{d.date}</td>
                <td style={{ padding:"11px 12px" }}>
                  <Badge label={d.statut} style={STAT_COLORS[d.statut]||{bg:"#f1f5f9",color:"#475569"}} />
                </td>
                <td style={{ padding:"11px 12px", fontSize:12, color:"#64748b" }}>{d.resp}</td>
                <td style={{ padding:"11px 12px" }}>
                  <div style={{ display:"flex", gap:4 }}>
                    {["👁","✎","🗑"].map((ic,j) => (
                      <button key={j} title={["Voir","Modifier","Supprimer"][j]}
                        style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, padding:"3px 5px", borderRadius:6 }}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr><td colSpan={8} style={{ padding:32, textAlign:"center", color:"#94a3b8", fontSize:13 }}>Aucune dépense trouvée</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderTop:"1px solid #f1f5f9" }}>
          <span style={{ fontSize:12, color:"#64748b" }}>
            Affichage {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} sur {filtered.length} dépenses
          </span>
          <div style={{ display:"flex", gap:4 }}>
            {Array.from({ length:totalPages }, (_,i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                padding:"5px 10px", border:"1px solid #e2e8f0", borderRadius:6,
                background:p===page?"#1a3ed4":"#fff", color:p===page?"#fff":"#334155",
                fontSize:12, cursor:"pointer", fontFamily:"inherit",
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} onAdd={handleAdd} nextId={nextId} />}
    </div>
  );
}