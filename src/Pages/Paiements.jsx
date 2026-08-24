import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./Paiements.css";
import { CLASSES, MODES_PAIEMENT, TRANCHES, TYPES_PAIEMENT, MOIS_LIST, TRANCHE_MONTANT, INITIAL_PAIEMENTS, getStatusInfo, REVENUS_MOIS } from "./paiementsData";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";
import { t } from "../theme";

const fmt = n => n.toLocaleString("fr-FR");

function respAvatar(name) {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.blueSoft, color: t.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
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

function PayModal({ paiement, onClose, onSave }) {
  const { showToast } = useToast();
  const isEdit = !!paiement.id;
  const [form, setForm] = useState(isEdit ? paiement : {
    eleve: "", classe: "Terminale A", typePaiement: "Par tranche", tranche: "Tranche 1", mois: "Octobre", montant: "",
    date: new Date().toLocaleDateString("fr-FR"), mode: "Espèces"
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.eleve.trim()) errs.eleve = "Le nom de l'élève est requis";
    const m = parseInt(form.montant);
    if (!form.montant || isNaN(m) || m <= 0) errs.montant = "Le montant doit être supérieur à 0";
    if (!form.date || !form.date.trim()) errs.date = "La date est requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) { showToast("Veuillez corriger les champs en rouge", "error"); return; }
    let stat = "Impayé";
    const m = parseInt(form.montant) || 0;
    if (m >= TRANCHE_MONTANT) stat = "Payé";
    else if (m > 0) stat = "Partiellement payé";

    const labelTranche = form.typePaiement === "Par mois" ? `Mois : ${form.mois || "Octobre"}` : form.tranche;

    onSave({
      ...form,
      id: form.id || `P${Date.now()}`,
      tranche: labelTranche,
      montant: m,
      status: stat,
      date: m > 0 && form.date === "-" ? new Date().toLocaleDateString("fr-FR") : form.date,
      mode: m > 0 && form.mode === "-" ? "Espèces" : form.mode
    });
    showToast("Paiement enregistré", "success");
    onClose();
  };

  const errStyle = { color: t.red, fontSize: 11, marginTop: 3 };

  const F = (label, key, type, opts) => {
    const isRequired = label.includes("*");
    const labelText = label.replace(" *", "");
    return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 5, fontWeight: 600, fontSize: 11, color: t.sub }}>
        {labelText}
        {isRequired && <span style={{ color: t.red, marginLeft: 2 }}>*</span>}
      </label>
      {opts ? <select value={form[key]} onChange={e=>{setForm({...form,[key]:e.target.value});setErrors(ev=>({...ev,[key]:undefined}));}} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${errors[key]?t.red:t.border}`, borderRadius: t.radius, outline: "none", fontSize: 13, fontFamily: t.font, color: t.text, background: t.surface, cursor: "pointer" }}>{opts.map(o=><option key={o}>{o}</option>)}</select>
        : <input type={type||"text"} value={form[key]} onChange={e=>{setForm({...form,[key]:e.target.value});setErrors(ev=>({...ev,[key]:undefined}));}} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${errors[key]?t.red:t.border}`, borderRadius: t.radius, outline: "none", fontSize: 13, boxSizing: "border-box", fontFamily: t.font, fontWeight: key==="montant"?700:400, color: key==="montant"?t.blue:t.text }}/>}
      {errors[key] && <p style={errStyle}>{errors[key]}</p>}
    </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
      <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.95}} className="modal-content" onClick={e=>e.stopPropagation()} style={{ background: t.surface, borderRadius: t.radiusLg, width: 440, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", fontFamily: t.font, color: t.text }}>
        <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: t.blueSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="ti ti-cash" style={{ fontSize: 19, color: t.blue }} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text }}>{isEdit ? "Modifier le paiement" : "Nouveau paiement"}</h2>
              <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>Caisse &amp; Facturation</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ background: t.bg, border: "none", color: t.sub, width: 30, height: 30, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-x" style={{ fontSize: 15 }} />
          </button>
        </div>
        <div className="modal-body" style={{ padding: "22px", maxHeight: "75vh", overflowY: "auto" }}>
          {F("Nom de l'élève *","eleve")}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {F("Classe","classe",null,CLASSES)}
            {F("Type de paiement","typePaiement",null,TYPES_PAIEMENT)}
          </div>
          <div style={{marginBottom: 12}}>
            {form.typePaiement === "Par mois"
              ? F("Mois concerné", "mois", null, MOIS_LIST)
              : F("Tranche", "tranche", null, TRANCHES)
            }
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {F("Montant payé (GNF) *","montant","number")}
            {F("Date *","date")}
          </div>
          {F("Méthode de paiement","mode",null,MODES_PAIEMENT.filter(m=>m!=="-"))}
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button className="cancel" onClick={onClose} style={{ flex: 1, padding: 10, border: `1px solid ${t.border}`, borderRadius: t.radius, background: t.surface, fontSize: 12.5, fontWeight: 500, cursor: "pointer", color: t.sub, fontFamily: t.font }}>Annuler</button>
            <button className="save" onClick={handleSave} style={{ flex: 1, padding: 10, border: "none", borderRadius: t.radius, background: t.blue, color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, boxShadow: "0 2px 8px rgba(37,99,235,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><i className="ti ti-device-floppy" style={{ fontSize: 15 }} /> Enregistrer</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const Chip = ({ label, c, bg }) => (
  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: bg, color: c, whiteSpace: "nowrap", display: "inline-block" }}>
    {label}
  </span>
);

const InfoItem = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
    <i className={`ti ${icon}`} style={{ fontSize: 15, color: t.muted, marginTop: 1, width: 16, flexShrink: 0 }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{value}</div>
    </div>
  </div>
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

/* ── Fiche détaillée d'une transaction (page pleine, lecture seule) ── */
function FichePaiement({ paiement: p, onRetour, onEdit, onDelete, onPrint }) {
  const si = getStatusInfo(p.status);
  const initiales = p.eleve.split(" ").slice(0, 2).map(w => w[0]).join("");

  return (
    <div style={{ fontFamily: t.font, color: t.text, maxWidth: 860, margin: "0 auto" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <ActionBtn icon="ti-arrow-left" label="Retour" primary onClick={onRetour} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ActionBtn icon="ti-receipt" label="Reçu" c={t.blue} bg={t.blueSoft} border={t.blueMid} onClick={() => onPrint(p)} />
          <ActionBtn icon="ti-pencil" label="Modifier" onClick={() => onEdit(p)} />
          <ActionBtn icon="ti-trash" label="Supprimer" c={t.red} bg={t.redSoft} border={t.redSoft} onClick={() => onDelete(p)} />
        </div>
      </div>

      {/* ── HERO CARD ── */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "16px 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap", marginBottom: 18 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg,${t.blueMid},${t.blueSoft})`,
              border: `2px solid ${t.blueMid}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: t.blue,
              boxShadow: "0 2px 10px rgba(37,99,235,0.15)",
            }}>{initiales}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{p.eleve}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, color: t.blue,
                  background: t.blueSoft, border: `1px solid ${t.blueMid}`,
                  padding: "3px 10px", borderRadius: 6, letterSpacing: ".3px",
                }}>
                  <i className="ti ti-receipt" style={{ marginRight: 5, fontSize: 11 }} />
                  Reçu n° {p.id}
                </span>
                <Chip label={p.classe} c={t.sub} bg={t.border} />
                <Chip label={p.tranche} c={t.blue} bg={t.blueSoft} />
                <Chip label={p.status} c={si.color} bg={si.bg} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "12px 16px" }}>
            <div>
              <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>Montant réglé</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: t.text, marginTop: 3, lineHeight: 1 }}>{p.montant.toLocaleString()} <span style={{ fontSize: 13, color: t.muted, fontWeight: 500 }}>GNF</span></div>
            </div>
            <Chip label={p.status} c={si.color} bg={si.bg} />
          </div>
        </div>
      </div>

      {/* ── DÉTAIL DE LA TRANSACTION ── */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>
            <i className="ti ti-file-invoice" style={{ fontSize: 14, color: t.muted, marginRight: 7 }} />
            Détail de la transaction
          </span>
        </div>
        <div style={{ padding: "6px 18px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0 32px" }}>
            <div>
              <InfoItem icon="ti-receipt" label="Référence" value={p.id} />
              <InfoItem icon="ti-school" label="Classe" value={p.classe} />
              <InfoItem icon="ti-list-details" label="Tranche" value={p.tranche} />
            </div>
            <div>
              <InfoItem icon="ti-calendar" label="Date" value={p.date} />
              <InfoItem icon="ti-credit-card" label="Méthode" value={p.mode} />
              <InfoItem icon="ti-tag" label="Type" value={p.typePaiement || "Par tranche"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const avatarBg = () => t.blueSoft;

export default function Paiements() {
  const { showToast } = useToast();
  const [data, setData] = useState(INITIAL_PAIEMENTS);
  const [trancheFilter, setTrancheFilter] = useState("Tranche 1");
  const [classe, setClasse] = useState("Toutes");
  const [statut, setStatut] = useState("Tous");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [sortDir, setSortDir] = useState("desc");
  const [showExport, setShowExport] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
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
  const trancheGoals = TRANCHES.map(tr => {
    const items = data.filter(p => p.tranche === tr);
    const paid = items.reduce((a, p) => a + p.montant, 0);
    const total = items.length * TRANCHE_MONTANT;
    return { name: tr, paid, total, pct: total > 0 ? Math.round((paid/total)*100) : 0 };
  });

  const exportCSV = () => {
    const rows = [["ID","Nom","Classe","Tranche","Montant","Date","Mode","Statut"]];
    data.forEach(p => rows.push([p.id, p.eleve, p.classe, p.tranche, p.montant, p.date, p.mode, p.status]));
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(rows.map(r=>r.join(";")).join("\n"));
    a.download = "paiements.csv"; a.click();
    showToast("Export réussi", "success", "La liste des paiements a été exportée en CSV.");
  };

  const printReceipt = (p) => {
    const w = window.open("","_blank");
    w.document.write(`<html><head><title>Reçu - ${p.eleve}</title><style>body{font-family:${t.font};padding:40px;color:${t.text}}.h{text-align:center;border-bottom:2px solid ${t.border};pb:20px;mb:30px}.t{font-size:24px;font-weight:bold;color:${t.blue}}table{width:100%;mt:30px;border-collapse:collapse}th,td{padding:12px;text-align:left;border-bottom:1px solid ${t.border}}.total{font-size:20px;font-weight:bold;color:${t.blue};mt:20px;text-align:right}</style></head><body>`);
    w.document.write(`<div class="h"><div class="t">REÇU DE PAIEMENT</div><div>Lycée Donka - Conakry</div></div>`);
    w.document.write(`<p><b>Élève:</b> ${p.eleve} | <b>Classe:</b> ${p.classe} | <b>Date:</b> ${p.date} | <b>N°:</b> ${p.id}</p>`);
    w.document.write(`<table><tr><th>Description</th><th style="text-align:right">Montant</th></tr><tr><td>${p.tranche}</td><td style="text-align:right">${p.montant.toLocaleString()} GNF</td></tr></table>`);
    w.document.write(`<div class="total">Total: ${p.montant.toLocaleString()} GNF</div><p style="mt:40px;text-align:center;color:${t.muted};font-size:12px">Mode: ${p.mode}</p></body></html>`);
    w.document.close(); w.print();
    showToast("Reçu généré", "info", `Impression du reçu pour ${p.eleve}.`);
  };

  const handleSave = (s) => {
    const isEdit = data.some(d => d.id === s.id);
    if (isEdit) {
      setData(data.map(d => d.id === s.id ? s : d));
      showToast("Paiement mis à jour", "success", `Le paiement de ${s.eleve} a été enregistré.`);
    } else {
      setData([s, ...data]);
      showToast("Paiement ajouté", "success", `Nouveau paiement enregistré pour ${s.eleve}.`);
    }
  };

  const handleDelete = (p) => {
    setData(data.filter(d => d.id !== p.id));
    showToast("Paiement supprimé", "warning", `Le paiement de ${p.eleve} a été retiré.`);
  };

  const statCards = [
    { label: "Total encaissé", value: totalEnc.toLocaleString(), unit: "GNF", trend: "12.1%", trendType: "up", icon: "ti-cash", c: t.blue, bg: t.blueSoft },
    { label: "Revenus du mois", value: (revMois/1000000).toFixed(1)+"M", unit: "GNF", trend: "6.3%", trendType: "up", icon: "ti-coin", c: t.green, bg: t.greenSoft },
    { label: "Impayés", value: totalImp.toLocaleString(), unit: "GNF", trend: "2.4%", trendType: "down", icon: "ti-alert-circle", c: t.red, bg: t.redSoft },
    { label: "Taux de recouvrement", value: pctPaye+"%", unit: "", trend: "12.1%", trendType: "up", icon: "ti-percentage", c: t.amber, bg: t.amberSoft },
  ];

  const statusClass = s => s === "Payé" ? "paye" : s === "Partiellement payé" ? "partiel" : "impaye";

  if (detailItem) return (
    <FichePaiement
      paiement={detailItem}
      onRetour={() => setDetailItem(null)}
      onEdit={p => { setDetailItem(null); setEditItem(p); }}
      onDelete={p => { setDetailItem(null); setConfirmDel(p); }}
      onPrint={printReceipt}
    />
  );

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
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div className="pay-period-row" style={{marginBottom:0}}>
          {["Toutes","Tranche 1","Tranche 2","Tranche 3"].map(tr=>(
            <button key={tr} className={`pay-period-pill${trancheFilter===tr?" active":""}`} onClick={()=>{setTrancheFilter(tr);setPage(1);}}>{tr}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,position:"relative"}}>
          <button className="pay-btn outline" onClick={()=>setEditItem({})}><i className="ti ti-plus"/> Nouveau paiement</button>
          <div ref={exportRef} style={{position:"relative"}}>
            <button className="pay-btn primary" onClick={()=>setShowExport(v=>!v)}><i className="ti ti-download"/> Exporter <i className="ti ti-chevron-down" style={{fontSize:13}}/></button>
            <AnimatePresence>
              {showExport && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} className="pay-dropdown">
                  <div className="dp-title">Exporter</div>
                  <button onClick={()=>{exportCSV();setShowExport(false);}}><i className="ti ti-file-spreadsheet" style={{ marginRight: 6 }}/> Excel / CSV</button>
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
          <motion.div key={i} className="pay-stat-card" whileHover={{y:-3,boxShadow:t.shadowMd}} whileTap={{y:0,scale:.98}} style={{cursor:"pointer"}}>
            <div className="top">
              <div className="icon-box" style={{background:c.bg,color:c.c}}><i className={`ti ${c.icon}`} style={{fontSize:19}}/></div>
              <div>
                <div className="stat-label">{c.label}</div>
                <div className="stat-value">{c.value}{c.unit && <span className="unit"> {c.unit}</span>}</div>
                <div className="stat-sub" style={{color:c.trendType==="down"?t.red:t.green}}>
                  <i className={`ti ${c.trendType==="down"?"ti-trending-down":"ti-trending-up"}`} style={{fontSize:12,marginRight:4}}/>
                  {c.trend} vs mois dernier
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle: Chart revenus par mois */}
      <div className="pay-middle" style={{gridTemplateColumns:"minmax(0,1fr)"}}>
        <div className="pay-card">
          <div className="pay-card-header">
            <h3>Flux financier</h3>
            <div className="legend">
              <span><span className="dot" style={{background:t.blue}}/>Encaissements</span>
            </div>
          </div>
          <div style={{height:220, width: "100%", minWidth: 0}}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <BarChart data={REVENUS_MOIS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.border}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke={t.muted} tick={{fontSize:11,fill:t.muted,fontFamily:t.font}}/>
                <YAxis axisLine={false} tickLine={false} stroke={t.muted} tick={{fontSize:11,fill:t.muted,fontFamily:t.font}} width={60} tickFormatter={v=>`${(v/1e6).toFixed(1)}M`}/>
                <Tooltip contentStyle={{background:t.surface,borderRadius:t.radius,border:`1px solid ${t.border}`,boxShadow:t.shadowMd,fontFamily:t.font,fontSize:12,color:t.text}} labelStyle={{color:t.sub}} formatter={v=>[v.toLocaleString()+" GNF","Montant"]}/>
                <Bar dataKey="revenus" fill={t.blue} radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par méthode : chiffres seuls, sans graphique */}
          {donutData.length > 0 && (
            <div style={{borderTop:`1px solid ${t.border}`, marginTop:14, paddingTop:12}}>
              <div style={{fontSize:10, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".4px", marginBottom:8}}>
                Encaissements par méthode
              </div>
              <div style={{display:"flex", flexWrap:"wrap", gap:"8px 28px"}}>
                {donutData.map(d => (
                  <div key={d.name} style={{display:"flex", alignItems:"baseline", gap:6}}>
                    <span style={{fontSize:11.5, color:t.sub}}>{d.name}</span>
                    <strong style={{fontSize:13, color:t.text}}>{(d.value/1e6).toFixed(1)}M</strong>
                    <span style={{fontSize:11.5, color:t.muted}}>
                      ({totalEnc > 0 ? Math.round((d.value/totalEnc)*100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
        <button className="pay-btn-reset" onClick={()=>{setClasse("Toutes");setStatut("Tous");setSearch("");setTrancheFilter("Toutes");setSortDir("desc");setPerPage(8);setPage(1);}}><i className="ti ti-refresh" style={{marginRight:6}}/>Réinitialiser</button>
      </div>

      {/* ── Bandeau alerte horizontal compact ── */}
      <div style={{
        display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
        background:t.amberSoft,
        border:`1px solid ${t.border}`, borderRadius:t.radiusLg,
        padding:"14px 20px", marginBottom:20, boxShadow:t.shadow,
      }}>
        <div style={{display:"flex", alignItems:"center"}}><i className="ti ti-alert-triangle" style={{ color: t.amber, fontSize: 19 }} /></div>
        <div style={{flex:1, minWidth:180}}>
          <span style={{fontWeight:600, color:t.amber, fontSize:13}}>Alertes paiement </span>
          <span style={{fontSize:12, color:t.sub}}>
            — <strong style={{color:t.red}}>{impList.length}</strong> élève{impList.length > 1 ? "s" : ""} en retard pour {trancheFilter === "Toutes" ? "l'année" : trancheFilter}.
          </span>
        </div>
        <div style={{display:"flex", gap:24, alignItems:"center", flexWrap:"wrap"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:10, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".4px"}}>Manque à gagner</div>
            <div style={{fontSize:18, fontWeight:700, color:t.red, marginTop:2}}>{(totalImp/1000000).toFixed(2)}M GNF</div>
          </div>
          <div style={{width:1, height:34, background:t.border}} />
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:10, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".4px"}}>Recouvrement</div>
            <div style={{fontSize:18, fontWeight:700, color:t.green, marginTop:2}}>{pctPaye}%</div>
          </div>
          <div style={{width:110}}>
            <div style={{height:6, background:t.border, borderRadius:99, overflow:"hidden"}}>
              <div style={{height:"100%", width:pctPaye+"%", background:t.blue, borderRadius:99, transition:"width .6s"}} />
            </div>
            <div style={{fontSize:11, color:t.muted, marginTop:4, textAlign:"right"}}>{totalEnc.toLocaleString()} GNF</div>
          </div>
        </div>
      </div>

      {/* ── Table transactions récentes (pleine largeur) ── */}
      <div className="pay-table-card" style={{marginBottom:20}}>
        <div className="pay-table-head">
          <h3>Transactions récentes <span style={{color:t.muted,fontWeight:400,fontSize:13}}>({filtered.length})</span></h3>
          <div className="controls">
            <select value={sortDir} onChange={e=>setSortDir(e.target.value)}>
              <option value="desc">Montant ↓</option><option value="asc">Montant ↑</option>
            </select>
            <button onClick={()=>{setClasse("Toutes");setStatut("Tous");setSearch("");setTrancheFilter("Toutes");setSortDir("desc");setPerPage(1000); setPage(1);}}>Voir tout</button>
          </div>
        </div>
        <div style={{overflowX:"auto", borderRadius:8}}>
          <table className="pay-table" style={{minWidth:"100%"}}>
              <colgroup>
                <col style={{width:130}}/><col style={{width:135}}/><col/><col style={{width:145}}/><col style={{width:100}}/><col style={{width:110}}/><col style={{width:96}}/><col style={{width:34}}/>
              </colgroup>
            <thead>
              <tr style={{ background:t.bg, borderBottom:`1px solid ${t.border}` }}>
                {["Référence","Catégorie","Description","Montant","Date","Statut","Actions",""].map(h => (
                  <th key={h} style={{ padding:"12px 14px", textAlign:h==="Actions"?"center":"left", fontSize: 11, fontWeight:600, color:t.muted, textTransform:"uppercase", letterSpacing:".4px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {shown.map((el) => (
                  <motion.tr initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key={el.id}
                    onClick={()=>setDetailItem(el)} style={{cursor:"pointer"}}>
                    <td style={{color:t.muted,fontSize:11.5, fontWeight:600}}>{el.id}</td>
                    <td><span style={{background:t.border, color:t.sub, padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:600, whiteSpace:"nowrap"}}>{el.classe}</span></td>
                    <td>
                      <div className="eleve-info">
                        <div className="eleve-logo" style={{background:avatarBg()}}>{el.eleve.split(" ").slice(0,2).map(w=>w[0]).join("")}</div>
                        <div><div style={{fontSize:13,fontWeight:600,color:t.text}}>{el.eleve}</div><div style={{fontSize:11,color:t.muted,marginTop:1}}>{el.tranche}</div></div>
                      </div>
                    </td>
                    <td style={{fontSize:13,fontWeight:600,color:t.text}}>{el.montant.toLocaleString()} GNF</td>
                    <td style={{color:t.sub,fontSize:13}}>{el.date}</td>
                    <td><span className={`pay-status ${statusClass(el.status)}`}>{el.status}</span></td>
                    <td style={{position:"relative", textAlign:"center"}} onClick={e=>e.stopPropagation()}>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 6, justifyContent:"center" }}>
                        <button title="Modifier" onClick={e => { e.stopPropagation(); setEditItem(el); }} style={{ background: t.surface, color: t.sub, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "0.2s", fontFamily: t.font, display: "flex", alignItems: "center" }}>
                          <i className="ti ti-pencil" style={{fontSize:14}} />
                        </button>
                        <button title="Supprimer" onClick={e => { e.stopPropagation(); setConfirmDel(el); }} style={{ background: t.redSoft, color: t.red, border: "none", borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "0.2s", fontFamily: t.font, display: "flex", alignItems: "center" }}>
                          <i className="ti ti-trash" style={{fontSize:14}} />
                        </button>
                      </div>
                    </td>
                    <td style={{textAlign:"center"}}>
                      <i className="ti ti-chevron-right" style={{fontSize:15,color:t.muted}} />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {shown.length===0 && (
                <tr>
                  <td colSpan={8} style={{padding:48,textAlign:"center",color:t.muted,fontSize:13}}>
                    <i className="ti ti-search" style={{fontSize:28,display:"block",marginBottom:10,color:t.border}} />
                    Aucune transaction
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pay-pagination">
          <span>{filtered.length===0?0:(sp-1)*perPage+1}–{Math.min(sp*perPage,filtered.length)} sur {filtered.length}</span>
          <div className="page-btns">
            <button disabled={sp===1} onClick={()=>setPage(p=>p-1)}><i className="ti ti-chevron-left"/></button>
            {Array.from({length:pages},(_,i)=>i+1).map(p=>(<button key={p} className={sp===p?"active":""} onClick={()=>setPage(p)}>{p}</button>))}
            <button disabled={sp===pages} onClick={()=>setPage(p=>p+1)}><i className="ti ti-chevron-right"/></button>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {editItem && <PayModal key="edit" paiement={editItem} onClose={()=>setEditItem(null)} onSave={handleSave}/>}
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
