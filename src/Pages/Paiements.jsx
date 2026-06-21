import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import "./Paiements.css";
import { CLASSES, MODES_PAIEMENT, TRANCHES, TRANCHE_MONTANT, INITIAL_PAIEMENTS, getStatusInfo, REVENUS_MOIS } from "./paiementsData";
import ConfirmModal from "../components/ConfirmModal";

const fmt = n => n.toLocaleString("fr-FR");
function respAvatar(name) {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function useOutsideClick(ref, cb) {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

function CtxMenu({ p, onClose, onReceipt, onEdit, onDelete }) {
  const ref = useRef();
  useOutsideClick(ref, onClose);
  return (
    <div ref={ref} className="pay-ctx-menu">
      <button onClick={() => { onReceipt(p); onClose(); }}><i className="ti ti-receipt" style={{ marginRight: 6 }}></i> Générer reçu</button>
      <button onClick={() => { onEdit(p); onClose(); }}><i className="ti ti-pencil" style={{ marginRight: 6 }}></i> Modifier</button>
      <hr/>
      <button
        className="danger"
        style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: 6 }}
        onClick={() => { onDelete(p); onClose(); }}
      >
        <i className="ti ti-trash"></i> Supprimer
      </button>
    </div>
  );
}

function PayModal({ paiement, onClose, onSave }) {
  const isEdit = !!paiement.id;
  const [form, setForm] = useState(isEdit ? paiement : {
    eleve: "", classe: "Terminale A", tranche: "Tranche 1", montant: TRANCHE_MONTANT,
    date: new Date().toLocaleDateString("fr-FR"), mode: "Espèces"
  });
  const handleSave = () => {
    let stat = "Impayé";
    const m = parseInt(form.montant) || 0;
    if (m >= TRANCHE_MONTANT) stat = "Payé";
    else if (m > 0) stat = "Partiellement payé";
    onSave({ ...form, id: form.id || `P${Date.now()}`, montant: m, status: stat,
      date: m > 0 && form.date === "-" ? new Date().toLocaleDateString("fr-FR") : form.date,
      mode: m > 0 && form.mode === "-" ? "Espèces" : form.mode
    });
    onClose();
  };
  const F = (label, key, type, opts) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>{label}</label>
      {opts ? <select value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }}>{opts.map(o=><option key={o}>{o}</option>)}</select>
        : <input type={type||"text"} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16, boxSizing: "border-box", fontWeight: key==="montant"?700:400, color: key==="montant"?"#7c3aed":"inherit" }}/>}
    </div>
  );
  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
      <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.95}} className="modal-content" onClick={e=>e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: 440, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        <div style={{ background: "#0066CC", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="ti ti-cash" style={{ fontSize: 26, color: "#fff" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{isEdit ? "Modifier le paiement" : "Nouveau paiement"}</h2>
              <span style={{ fontSize: 14, color: "#e0f2fe", fontWeight: 600 }}>Caisse &amp; Facturation</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>✕</button>
        </div>
        <div className="modal-body" style={{ padding: "24px", maxHeight: "75vh", overflowY: "auto" }}>
          {F("Nom de l'élève","eleve")}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {F("Classe","classe",null,CLASSES)}
            {F("Tranche","tranche",null,TRANCHES)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {F("Montant payé (GNF)","montant","number")}
            {F("Date","date")}
          </div>
          {F("Méthode de paiement","mode",null,MODES_PAIEMENT.filter(m=>m!=="-"))}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button className="cancel" onClick={onClose} style={{ flex: 1, padding: 12, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Annuler</button>
            <button className="save" onClick={handleSave} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: "#0066CC", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><i className="ti ti-device-floppy" style={{ fontSize: 20 }} /> Enregistrer</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const COLORS = ["#7c3aed","#f59e0b","#3b82f6","#10b981"];
const avatarBg = i => ["#7c3aed","#3b82f6","#10b981","#f59e0b","#ef4444","#ec4899"][i%6];

export default function Paiements() {
  const [data, setData] = useState(INITIAL_PAIEMENTS);
  const [trancheFilter, setTrancheFilter] = useState("Tranche 1");
  const [classe, setClasse] = useState("Toutes");
  const [statut, setStatut] = useState("Tous");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [sortDir, setSortDir] = useState("desc");
  const [showExport, setShowExport] = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const exportRef = useRef();
  useOutsideClick(exportRef, () => setShowExport(false));

  const filtered = data.filter(p => {
    const mt = trancheFilter === "Toutes" || p.tranche === trancheFilter;
    const mc = classe === "Toutes" || p.classe === classe;
    const ms = statut === "Tous" || p.status === statut;
    const mn = p.eleve.toLowerCase().includes(search.toLowerCase());
    return mt && mc && ms && mn;
  }).sort((a, b) => sortDir === "desc" ? b.montant - a.montant : a.montant - b.montant);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const sp = Math.min(page, pages);
  const shown = filtered.slice((sp-1)*perPage, sp*perPage);

  const statsAll = data.filter(p => trancheFilter === "Toutes" ? true : p.tranche === trancheFilter);
  const totalEnc = statsAll.reduce((a, p) => a + p.montant, 0);
  const totalAtt = statsAll.length * TRANCHE_MONTANT;
  const impList = statsAll.filter(p => p.status !== "Payé");
  const totalImp = (impList.length * TRANCHE_MONTANT) - impList.reduce((a, p) => a + p.montant, 0);
  const pctPaye = totalAtt > 0 ? Math.round((totalEnc / totalAtt) * 100) : 0;
  const revMois = REVENUS_MOIS[REVENUS_MOIS.length - 1]?.revenus || 0;

  // Donut data — payment methods breakdown
  const methodCounts = {};
  statsAll.filter(p=>p.mode!=="-").forEach(p => { methodCounts[p.mode] = (methodCounts[p.mode]||0) + p.montant; });
  const donutData = Object.entries(methodCounts).map(([name, value]) => ({ name, value }));

  // Tranche goals
  const trancheGoals = TRANCHES.map(t => {
    const items = data.filter(p => p.tranche === t);
    const paid = items.reduce((a, p) => a + p.montant, 0);
    const total = items.length * TRANCHE_MONTANT;
    return { name: t, paid, total, pct: total > 0 ? Math.round((paid/total)*100) : 0 };
  });

  const exportCSV = () => {
    const rows = [["ID","Nom","Classe","Tranche","Montant","Date","Mode","Statut"]];
    data.forEach(p => rows.push([p.id, p.eleve, p.classe, p.tranche, p.montant, p.date, p.mode, p.status]));
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(rows.map(r=>r.join(";")).join("\n"));
    a.download = "paiements.csv"; a.click();
  };

  const printReceipt = (p) => {
    const w = window.open("","_blank");
    w.document.write(`<html><head><title>Reçu - ${p.eleve}</title><style>body{font-family:'Inter',sans-serif;padding:40px;color:#1e1b4b}.h{text-align:center;border-bottom:2px solid #e5e7eb;pb:20px;mb:30px}.t{font-size:24px;font-weight:bold;color:#7c3aed}table{width:100%;mt:30px;border-collapse:collapse}th,td{padding:12px;text-align:left;border-bottom:1px solid #f3f4f6}.total{font-size:20px;font-weight:bold;color:#7c3aed;mt:20px;text-align:right}</style></head><body>`);
    w.document.write(`<div class="h"><div class="t">REÇU DE PAIEMENT</div><div>Lycée Donka - Conakry</div></div>`);
    w.document.write(`<p><b>Élève:</b> ${p.eleve} | <b>Classe:</b> ${p.classe} | <b>Date:</b> ${p.date} | <b>N°:</b> ${p.id}</p>`);
    w.document.write(`<table><tr><th>Description</th><th style="text-align:right">Montant</th></tr><tr><td>${p.tranche}</td><td style="text-align:right">${p.montant.toLocaleString()} GNF</td></tr></table>`);
    w.document.write(`<div class="total">Total: ${p.montant.toLocaleString()} GNF</div><p style="mt:40px;text-align:center;color:#9ca3af;font-size:12px">Mode: ${p.mode}</p></body></html>`);
    w.document.close(); w.print();
  };

  const handleSave = (s) => {
    if (data.find(d => d.id === s.id)) setData(data.map(d => d.id === s.id ? s : d));
    else setData([s, ...data]);
  };

  const handleDelete = (p) => {
    setData(data.filter(d => d.id !== p.id));
  };

  const statCards = [
    { label: "Total encaissé", value: totalEnc.toLocaleString(), unit: "GNF", trend: "↑ 12.1%", trendType: "up" },
    { label: "Revenus du mois", value: (revMois/1000000).toFixed(1)+"M", unit: "GNF", trend: "↑ 6.3%", trendType: "up" },
    { label: "Impayés", value: totalImp.toLocaleString(), unit: "GNF", trend: "↓ 2.4%", trendType: "down" },
    { label: "Taux de recouvrement", value: pctPaye+"%", unit: "", trend: "↑ 12.1%", trendType: "up" },
  ];

  const statusClass = s => s === "Payé" ? "paye" : s === "Partiellement payé" ? "partiel" : "impaye";

  return (
    <div className="pay-page">
      {/* Topbar */}
      <div className="pay-topbar">
        <div className="welcome">
          <div>
            <h1>Bienvenue, <span>M. Fofana</span> !</h1>
            <p>Gérez vos finances scolaires en un coup d'œil.</p>
          </div>
        </div>
        <div className="pay-topbar-right">
          <div className="pay-search">
            <i className="ti ti-search icon"></i>
            <input placeholder="Rechercher..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
          </div>
          <div className="pay-topbar-profile">
            <div className="avatar">DF</div>
            <div className="info"><div className="name">M. Fofana</div><div className="role">Comptable</div></div>
          </div>
        </div>
      </div>

      {/* Period pills + actions */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div className="pay-period-row" style={{marginBottom:0}}>
          {["Toutes","Tranche 1","Tranche 2","Tranche 3"].map(t=>(
            <button key={t} className={`pay-period-pill${trancheFilter===t?" active":""}`} onClick={()=>{setTrancheFilter(t);setPage(1);}}>{t}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:10,position:"relative"}}>
          <button className="pay-btn outline" onClick={()=>setEditItem({})}>➕ Nouveau paiement</button>
          <div ref={exportRef} style={{position:"relative"}}>
            <button className="pay-btn primary" onClick={()=>setShowExport(v=>!v)}>📥 Exporter ▾</button>
            <AnimatePresence>
              {showExport && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} className="pay-dropdown">
                  <div className="dp-title">Exporter</div>
                  <button onClick={()=>{exportCSV();setShowExport(false);}}>📊 Excel / CSV</button>
                  <button onClick={()=>{window.print();setShowExport(false);}}><i className="ti ti-printer" style={{ marginRight: 6 }}/> Rapport PDF</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="pay-stats">
        {statCards.map((c,i) => (
          <motion.div key={i} className="pay-stat-card" whileHover={{y:-6,boxShadow:"0 12px 32px rgba(124,58,237,.12)"}} style={{cursor:"pointer"}}>
            <div className="arrow-icon">↗</div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}<span className="decimal"> {c.unit}</span></div>
            <div className={`stat-trend ${c.trendType}`}>{c.trend} vs mois dernier</div>
          </motion.div>
        ))}
      </div>

      {/* Middle: Chart + Budget donut */}
      <div className="pay-middle">
        <div className="pay-card">
          <div className="pay-card-header">
            <h3>Flux financier</h3>
            <div className="legend">
              <span><span className="dot" style={{background:"#7c3aed"}}/>Encaissements</span>
            </div>
          </div>
          <div style={{height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUS_MOIS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 15,fill:'#9ca3af'}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 15,fill:'#9ca3af'}} width={60} tickFormatter={v=>`${(v/1e6).toFixed(1)}M`}/>
                <Tooltip contentStyle={{borderRadius:10,border:'none',boxShadow:'0 4px 16px rgba(0,0,0,.08)'}} formatter={v=>[v.toLocaleString()+" GNF","Montant"]}/>
                <Bar dataKey="revenus" fill="#7c3aed" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pay-card">
          <div className="pay-card-header"><h3>Répartition par méthode</h3></div>
          <div className="pay-budget-center">
            <div className="pay-donut-wrap">
              <PieChart width={140} height={140}>
                <Pie data={donutData} dataKey="value" cx={65} cy={65} innerRadius={42} outerRadius={62} paddingAngle={3} strokeWidth={0}>
                  {donutData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
              <div className="pay-donut-label">
                <div className="amount">{totalEnc > 0 ? (totalEnc/1e6).toFixed(1)+"M" : "0"}</div>
                <div className="sub">GNF Total</div>
              </div>
            </div>
            <div className="pay-budget-legend">
              {donutData.map((d, i) => (
                <div className="item" key={d.name}>
                  <div className="color" style={{background:COLORS[i%COLORS.length]}}/>
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="pay-filters">
        <select value={classe} onChange={e=>{setClasse(e.target.value);setPage(1);}}>
          <option value="Toutes">Toutes les classes</option>
          {CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statut} onChange={e=>{setStatut(e.target.value);setPage(1);}}>
          <option value="Tous">Tous les statuts</option>
          <option>Payé</option><option>Partiellement payé</option><option>Impayé</option>
        </select>
        <div className="search-wrap">
          <i className="ti ti-search icon"></i>
          <input placeholder="Filtrer par nom..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
        </div>
        <button className="pay-btn-reset" onClick={()=>{setClasse("Toutes");setStatut("Tous");setSearch("");setTrancheFilter("Toutes");setSortDir("desc");setPerPage(8);setPage(1);}}>↺ Réinitialiser</button>
      </div>

      {/* ── Bandeau alerte horizontal compact ── */}
      <div style={{
        display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
        background:"linear-gradient(135deg,#faf5ff,#fdf4ff)",
        border:"1.5px solid #ede9fe", borderRadius:14,
        padding:"14px 20px", marginBottom:20,
      }}>
        <div style={{fontSize:22, display:"flex", alignItems:"center"}}><i className="ti ti-alert-triangle" style={{ color: "#7c3aed", fontSize: 24 }} /></div>
        <div style={{flex:1, minWidth:180}}>
          <span style={{fontWeight:700, color:"#7c3aed", fontSize:16}}>Alertes paiement </span>
          <span style={{fontSize:15, color:"#6b7280"}}>
            — <strong style={{color:"#dc2626"}}>{impList.length}</strong> élève{impList.length > 1 ? "s" : ""} en retard pour {trancheFilter === "Toutes" ? "l'année" : trancheFilter}.
          </span>
        </div>
        <div style={{display:"flex", gap:24, alignItems:"center", flexWrap:"wrap"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:12, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:".4px"}}>Manque à gagner</div>
            <div style={{fontSize:20, fontWeight:800, color:"#dc2626"}}>{(totalImp/1000000).toFixed(2)}M GNF</div>
          </div>
          <div style={{width:1, height:36, background:"#e9d5ff"}} />
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:12, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:".4px"}}>Recouvrement</div>
            <div style={{fontSize:20, fontWeight:800, color:"#16a34a"}}>{pctPaye}%</div>
          </div>
          <div style={{width:110}}>
            <div style={{height:8, background:"#e9d5ff", borderRadius:8, overflow:"hidden"}}>
              <div style={{height:"100%", width:pctPaye+"%", background:"linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius:8, transition:"width .6s"}} />
            </div>
            <div style={{fontSize:12, color:"#9ca3af", marginTop:3, textAlign:"right"}}>{totalEnc.toLocaleString()} GNF</div>
          </div>
        </div>
      </div>

      {/* ── Table transactions récentes (pleine largeur) ── */}
      <div className="pay-table-card" style={{marginBottom:20}}>
        <div className="pay-table-head">
          <h3>Transactions récentes <span style={{color:"#9ca3af",fontWeight:400,fontSize:16}}>({filtered.length})</span></h3>
          <div className="controls">
            <select value={sortDir} onChange={e=>setSortDir(e.target.value)}>
              <option value="desc">Montant ↓</option><option value="asc">Montant ↑</option>
            </select>
            <button onClick={()=>{setClasse("Toutes");setStatut("Tous");setSearch("");setTrancheFilter("Toutes");setSortDir("desc");setPerPage(1000); setPage(1);}}>Voir tout</button>
          </div>
        </div>
        <div style={{maxHeight:320, overflowY:"auto", borderRadius:8}}>
          <table className="pay-table" style={{minWidth:"100%"}}>
              <colgroup>
                <col style={{width:130}}/><col style={{width:135}}/><col/><col style={{width:145}}/><col style={{width:100}}/><col style={{width:110}}/><col style={{width:180}}/>
              </colgroup>
            <thead>
              <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                {["Référence","Catégorie","Description","Montant","Date","Statut","Actions"].map(h => (
                  <th key={h} style={{ padding:"11px 12px", textAlign:h==="Actions"?"center":"left", fontSize: 14, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.4px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {shown.map((el, idx) => (
                  <motion.tr initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key={el.id}>
                    <td style={{color:"#9ca3af",fontSize:15, fontWeight:600}}>{el.id}</td>
                    <td style={{color:"#64748b",fontSize:15}}><span style={{background:"#f3e8ff", color:"#6b21a8", padding:"4px 10px", borderRadius:6, fontSize:14, fontWeight:600}}>{el.classe}</span></td>
                    <td>
                      <div className="eleve-info">
                        <div className="eleve-logo" style={{background:avatarBg(idx)}}>{el.eleve[0]}</div>
                        <div><div style={{fontWeight:600,color:"#1e1b4b"}}>{el.eleve}</div><div style={{fontSize:14,color:"#9ca3af"}}>{el.tranche}</div></div>
                      </div>
                    </td>
                    <td style={{fontWeight:700,color:"#1e1b4b"}}>{el.montant.toLocaleString()} GNF</td>
                    <td style={{color:"#64748b",fontSize:15}}>{el.date}</td>
                    <td><span className={`pay-status ${statusClass(el.status)}`}>{el.status}</span></td>
                    <td style={{position:"relative", textAlign:"center"}}>
                      <div style={{ display: "flex", gap: 6, justifyContent:"center" }}>
                        <button onClick={() => printReceipt(el)} style={{ background: "#eff6ff", color: "#2563eb", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center", gap: 4 }}>
                          <i className="ti ti-receipt" /> Reçu
                        </button>
                        <button onClick={() => setEditItem(el)} style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
                          <i className="ti ti-pencil" />
                        </button>
                        <button onClick={() => setConfirmDel(el)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
                          <i className="ti ti-trash" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {shown.length===0 && <tr><td colSpan={7} style={{textAlign:"center",padding:40,color:"#9ca3af"}}>Aucune transaction</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="pay-pagination">
          <span>{filtered.length===0?0:(sp-1)*perPage+1}–{Math.min(sp*perPage,filtered.length)} sur {filtered.length}</span>
          <div className="page-btns">
            <button disabled={sp===1} onClick={()=>setPage(p=>p-1)}>◂</button>
            {Array.from({length:pages},(_,i)=>i+1).map(p=>(<button key={p} className={sp===p?"active":""} onClick={()=>setPage(p)}>{p}</button>))}
            <button disabled={sp===pages} onClick={()=>setPage(p=>p+1)}>▸</button>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {editItem && <PayModal paiement={editItem} onClose={()=>setEditItem(null)} onSave={handleSave}/>}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!confirmDel}
        title="Supprimer le paiement"
        message={confirmDel ? `Voulez-vous vraiment supprimer le paiement de ${confirmDel.eleve} ? Cette action est irréversible.` : ""}
        onConfirm={() => { handleDelete(confirmDel); setConfirmDel(null); }}
        onCancel={() => setConfirmDel(null)}
      />
    </div>
  );
}
