import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import "./Paiements.css";
import { CLASSES, MODES_PAIEMENT, TRANCHES, TRANCHE_MONTANT, INITIAL_PAIEMENTS, getStatusInfo, REVENUS_MOIS } from "./paiementsData";

function useOutsideClick(ref, cb) {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

function CtxMenu({ p, onClose, onReceipt, onEdit }) {
  const ref = useRef();
  useOutsideClick(ref, onClose);
  return (
    <div ref={ref} className="pay-ctx-menu">
      <button onClick={() => { onReceipt(p); onClose(); }}>🧾 Générer reçu</button>
      <button onClick={() => { onEdit(p); onClose(); }}>✏️ Modifier</button>
      <hr/><button className="danger" onClick={onClose}>🗑 Supprimer</button>
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
    <div>
      <label>{label}</label>
      {opts ? <select value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}>{opts.map(o=><option key={o}>{o}</option>)}</select>
        : <input type={type||"text"} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={key==="montant"?{fontWeight:700,color:"#7c3aed"}:{}}/>}
    </div>
  );
  return (
    <div className="pay-modal-overlay" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.95}} className="pay-modal" onClick={e=>e.stopPropagation()}>
        <div className="pay-modal-header">
          <div><h2>{isEdit?"Modifier":"Nouveau"} paiement</h2><span>Caisse & Facturation</span></div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="pay-modal-body">
          {F("Nom de l'élève","eleve")}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
            {F("Classe","classe",null,CLASSES)}
            {F("Tranche","tranche",null,TRANCHES)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
            {F("Montant payé (GNF)","montant","number")}
            {F("Date","date")}
          </div>
          <div style={{marginTop:14}}>{F("Méthode de paiement","mode",null,MODES_PAIEMENT.filter(m=>m!=="-"))}</div>
          <div className="pay-modal-actions">
            <button className="cancel" onClick={onClose}>Annuler</button>
            <button className="save" onClick={handleSave}>💾 Enregistrer</button>
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
  const [perPage] = useState(8);
  const [sortDir, setSortDir] = useState("desc");
  const [showExport, setShowExport] = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [editItem, setEditItem] = useState(null);
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
    w.document.write(`<html><head><title>Reçu - ${p.eleve}</title><style>body{font-family:'Outfit',sans-serif;padding:40px;color:#1e1b4b}.h{text-align:center;border-bottom:2px solid #e5e7eb;pb:20px;mb:30px}.t{font-size:24px;font-weight:bold;color:#7c3aed}table{width:100%;mt:30px;border-collapse:collapse}th,td{padding:12px;text-align:left;border-bottom:1px solid #f3f4f6}.total{font-size:20px;font-weight:bold;color:#7c3aed;mt:20px;text-align:right}</style></head><body>`);
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
            <span className="icon">🔍</span>
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
                  <button onClick={()=>{window.print();setShowExport(false);}}>📄 Rapport PDF</button>
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:12,fill:'#9ca3af'}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fontSize:12,fill:'#9ca3af'}} width={60} tickFormatter={v=>`${(v/1e6).toFixed(1)}M`}/>
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
          <span className="icon">🔍</span>
          <input placeholder="Filtrer par nom..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
        </div>
        <button className="pay-btn-reset" onClick={()=>{setClasse("Toutes");setStatut("Tous");setSearch("");setPage(1);}}>↺ Réinitialiser</button>
      </div>

      {/* Bottom: Table + Goals */}
      <div className="pay-bottom">
        <div className="pay-table-card">
          <div className="pay-table-head">
            <h3>Transactions récentes <span style={{color:"#9ca3af",fontWeight:400,fontSize:13}}>({filtered.length})</span></h3>
            <div className="controls">
              <select value={sortDir} onChange={e=>setSortDir(e.target.value)}>
                <option value="desc">Montant ↓</option><option value="asc">Montant ↑</option>
              </select>
              <button onClick={()=>{}}>Voir tout</button>
            </div>
          </div>
          <table className="pay-table">
            <thead><tr>
              <th>DATE</th><th>ÉLÈVE</th><th>MONTANT</th><th>MÉTHODE</th><th>STATUT</th><th></th>
            </tr></thead>
            <tbody>
              <AnimatePresence>
                {shown.map((el, idx) => (
                  <motion.tr initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key={el.id}>
                    <td style={{color:"#9ca3af",fontSize:12}}>{el.date}</td>
                    <td>
                      <div className="eleve-info">
                        <div className="eleve-logo" style={{background:avatarBg(idx)}}>{el.eleve[0]}</div>
                        <div><div style={{fontWeight:600,color:"#1e1b4b"}}>{el.eleve}</div><div style={{fontSize:11,color:"#9ca3af"}}>{el.classe} · {el.tranche}</div></div>
                      </div>
                    </td>
                    <td style={{fontWeight:700,color:el.montant>0?"#1e1b4b":"#9ca3af"}}>{el.montant>0?el.montant.toLocaleString()+" GNF":"-"}</td>
                    <td>{el.mode}</td>
                    <td><span className={`pay-status ${statusClass(el.status)}`}>{el.status}</span></td>
                    <td style={{position:"relative"}}>
                      <button className="pay-action-btn" onClick={()=>printReceipt(el)} title="Reçu">🧾</button>
                      <button className="pay-action-btn" onClick={()=>setCtxMenu(ctxMenu===el.id?null:el.id)}>⋮</button>
                      {ctxMenu===el.id && <CtxMenu p={el} onClose={()=>setCtxMenu(null)} onReceipt={printReceipt} onEdit={setEditItem}/>}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {shown.length===0 && <tr><td colSpan={6} style={{textAlign:"center",padding:40,color:"#9ca3af"}}>Aucune transaction</td></tr>}
            </tbody>
          </table>
          <div className="pay-pagination">
            <span>{filtered.length===0?0:(sp-1)*perPage+1}–{Math.min(sp*perPage,filtered.length)} sur {filtered.length}</span>
            <div className="page-btns">
              <button disabled={sp===1} onClick={()=>setPage(p=>p-1)}>◂</button>
              {Array.from({length:pages},(_,i)=>i+1).map(p=>(<button key={p} className={sp===p?"active":""} onClick={()=>setPage(p)}>{p}</button>))}
              <button disabled={sp===pages} onClick={()=>setPage(p=>p+1)}>▸</button>
            </div>
          </div>
        </div>

        {/* Goals = Tranche Progress */}
        <div className="pay-goals-card">
          <h3>Objectifs par tranche</h3>
          {trancheGoals.map((g, i) => (
            <div className="pay-goal-item" key={g.name}>
              <div className="goal-top">
                <span className="name">{g.name}</span>
                <span className="amount">{g.paid.toLocaleString()} / {g.total.toLocaleString()} GNF</span>
              </div>
              <div className="pay-goal-bar">
                <div className="fill" style={{width:g.pct+"%",background:COLORS[i%COLORS.length]}}/>
              </div>
              <div className="pay-goal-pct">{g.pct}% collecté</div>
            </div>
          ))}

          <div style={{marginTop:24,padding:16,background:"#faf5ff",borderRadius:12,border:"1px solid #ede9fe"}}>
            <div style={{fontSize:13,fontWeight:600,color:"#7c3aed",marginBottom:6}}>🚨 Alertes</div>
            <div style={{fontSize:12,color:"#6b7280"}}>{impList.length} élèves en retard de paiement pour {trancheFilter === "Toutes" ? "l'année" : trancheFilter}.</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>Manque à gagner : <b style={{color:"#ef4444"}}>{totalImp.toLocaleString()} GNF</b></div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editItem && <PayModal paiement={editItem} onClose={()=>setEditItem(null)} onSave={handleSave}/>}
      </AnimatePresence>
    </div>
  );
}
