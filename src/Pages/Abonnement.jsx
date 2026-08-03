import { useState } from "react";

/* ─── THEME ──────────────────────────────────────────────────── */
const t = {
  bg:"#f7f8fa", surface:"#ffffff", border:"#eaecf0",
  blue:"#2563eb", blueSoft:"#eff6ff", blueMid:"#dbeafe",
  text:"#111827", sub:"#6b7280", muted:"#9ca3af",
  green:"#059669", greenSoft:"#f0fdf4", greenMid:"#bbf7d0",
  amber:"#d97706", amberSoft:"#fffbeb", amberMid:"#fde68a",
  red:"#dc2626", redSoft:"#fef2f2",
  purple:"#7c3aed", purpleSoft:"#f5f3ff",
  radius:"10px", radiusLg:"14px", radiusXl:"18px",
  shadow:"0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
  shadowLg:"0 12px 32px rgba(0,0,0,0.1)",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── DATA ───────────────────────────────────────────────────── */
const PLAN_ACTUEL = {
  nom:"Premium",
  prix:499000,
  devise:"GNF",
  periode:"mois",
  renouvellement:"15/08/2026",
  statut:"Actif",
  features:[
    "Gestion élèves illimitée",
    "Gestion enseignants (jusqu'à 150)",
    "Paiements & facturation",
    "Bulletins numériques",
    "Notifications SMS & Email",
    "Statistiques avancées",
    "Documents & archives",
    "Support prioritaire 24/7",
    "API & intégrations",
  ],
};

const USAGE = [
  { icon:"ti-users",       label:"Élèves",         val:750,  max:1000, unit:"",   c:t.blue,   bg:t.blueSoft   },
  { icon:"ti-school",      label:"Enseignants",     val:87,   max:150,  unit:"",   c:t.purple, bg:t.purpleSoft },
  { icon:"ti-database",    label:"Stockage",        val:6.2,  max:20,   unit:"GB", c:t.green,  bg:t.greenSoft  },
  { icon:"ti-message",     label:"SMS disponibles", val:3200, max:5000, unit:"",   c:t.amber,  bg:t.amberSoft  },
];

const PLANS = [
  {
    id:"starter", nom:"Starter", badge:null,
    prix:149000, desc:"Idéal pour les petites écoles",
    features:[
      "Jusqu'à 200 élèves",
      "10 enseignants",
      "Gestion des classes",
      "Bulletins basiques",
      "Support email",
    ],
    highlight:false,
  },
  {
    id:"standard", nom:"Standard", badge:"Populaire",
    prix:299000, desc:"Pour les écoles en croissance",
    features:[
      "Jusqu'à 500 élèves",
      "50 enseignants",
      "Paiements & facturation",
      "Bulletins numériques",
      "Notifications",
      "Statistiques",
      "Support chat",
    ],
    highlight:false,
  },
  {
    id:"premium", nom:"Premium", badge:"Votre plan",
    prix:499000, desc:"Pour les grandes écoles",
    features:[
      "Élèves illimités",
      "150 enseignants",
      "Paiements avancés",
      "Bulletins numériques",
      "SMS & Email",
      "Statistiques avancées",
      "Documents & archives",
      "Support prioritaire 24/7",
      "API & intégrations",
    ],
    highlight:true,
    actuel:true,
  },
  {
    id:"enterprise", nom:"Enterprise", badge:"Sur devis",
    prix:null, desc:"Solution sur-mesure multi-établissements",
    features:[
      "Multi-établissements",
      "Élèves & staff illimités",
      "Toutes les fonctionnalités",
      "Intégrations personnalisées",
      "Manager dédié",
      "SLA garanti",
      "Formation incluse",
    ],
    highlight:false,
  },
];

const HISTORIQUE = [
  { id:"INV-2025-003", date:"01/03/2025", plan:"Premium", montant:499000, statut:"Payé",   methode:"Mobile Money" },
  { id:"INV-2025-002", date:"01/02/2025", plan:"Premium", montant:499000, statut:"Payé",   methode:"Mobile Money" },
  { id:"INV-2025-001", date:"01/01/2025", plan:"Premium", montant:499000, statut:"Payé",   methode:"Mobile Money" },
  { id:"INV-2024-012", date:"01/12/2024", plan:"Standard",montant:299000, statut:"Payé",   methode:"Carte"        },
  { id:"INV-2024-011", date:"01/11/2024", plan:"Standard",montant:299000, statut:"Payé",   methode:"Carte"        },
  { id:"INV-2024-010", date:"01/10/2024", plan:"Standard",montant:299000, statut:"Remboursé",methode:"Carte"      },
];

const MOYENS_PAIEMENT = [
  { id:1, type:"Mobile Money", label:"Orange Money",   numero:"622 *** *** 45", defaut:true,  icon:"ti-device-mobile" },
  { id:2, type:"Mobile Money", label:"MTN MoMo",       numero:"620 *** *** 12", defaut:false, icon:"ti-device-mobile" },
];

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
const Chip = ({ label, c, bg, small }) => (
  <span style={{ fontSize:small?10:11, fontWeight:600, padding:small?"2px 8px":"4px 11px", borderRadius:20, background:bg||t.bg, color:c||t.sub, whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", gap:4 }}>
    {label}
  </span>
);

const Divider = () => <div style={{ height:1, background:t.border, margin:"20px 0" }} />;

const Section = ({ title, sub, children, action }) => (
  <div style={{ marginBottom:28 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16, flexWrap:"wrap", gap:8 }}>
      <div>
        <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:t.text }}>{title}</h2>
        {sub && <p style={{ margin:0, fontSize:12, color:t.muted, marginTop:3 }}>{sub}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const Btn = ({ icon, label, primary, small, danger, ghost, onClick, disabled, loading }) => (
  <button onClick={onClick} disabled={disabled||loading} style={{
    display:"flex", alignItems:"center", gap:6,
    padding:small?"7px 13px":"10px 18px",
    border:primary?"none":danger?`1px solid #fecaca`:ghost?"none":`1px solid ${t.border}`,
    borderRadius:t.radius, cursor:disabled?"not-allowed":"pointer",
    fontFamily:t.font, fontSize:small?12:13, fontWeight:600,
    background:primary?t.blue:danger?t.redSoft:ghost?"transparent":t.surface,
    color:primary?"#fff":danger?t.red:ghost?t.sub:t.sub,
    opacity:disabled?.5:1,
    boxShadow:primary?`0 2px 8px rgba(37,99,235,0.25)`:ghost?"none":t.shadow,
    transition:"all .15s", whiteSpace:"nowrap",
  }}
    onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.opacity=".85"; e.currentTarget.style.transform="translateY(-1px)"; }}}
    onMouseLeave={e=>{ e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}
  >
    {loading
      ? <div style={{ width:14, height:14, border:`2px solid rgba(255,255,255,.3)`, borderTopColor:"#fff", borderRadius:"50%", animation:"spin .6s linear infinite" }} />
      : icon && <i className={`ti ${icon}`} style={{ fontSize:small?13:15 }} />
    }
    {label}
  </button>
);

/* ─── BARRE DE PROGRESSION ───────────────────────────────────── */
const ProgressBar = ({ val, max, color=t.blue, height=8 }) => {
  const pct = Math.min(Math.round((val/max)*100), 100);
  const c = pct >= 90 ? t.red : pct >= 75 ? t.amber : color;
  return (
    <div>
      <div style={{ height, background:t.border, borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", background:c, borderRadius:99, width:`${pct}%`, transition:"width .8s ease" }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:11, color:t.muted }}>
        <span style={{ color:c, fontWeight:600 }}>{pct}% utilisé</span>
        <span>Restant : {max-val} {max>=1000?"":""}</span>
      </div>
    </div>
  );
};

/* ─── MODAL CHANGEMENT PLAN ──────────────────────────────────── */
function ModalChangePlan({ plan, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = () => {
    setLoading(true);
    setTimeout(()=>{ setLoading(false); onConfirm(plan); onClose(); }, 1800);
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, fontFamily:t.font }}>
      <div style={{ background:t.surface, borderRadius:20, padding:28, width:"min(420px,92vw)", boxShadow:t.shadowLg }}>
        <div style={{ width:52, height:52, borderRadius:14, background:t.blueSoft, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
          <i className="ti ti-arrows-exchange" style={{ fontSize:24, color:t.blue }} />
        </div>
        <h3 style={{ margin:0, fontSize:16, fontWeight:700, marginBottom:8 }}>Changer vers {plan.nom}</h3>
        <p style={{ fontSize:13, color:t.sub, margin:"0 0 20px", lineHeight:1.6 }}>
          Vous allez passer au plan <strong>{plan.nom}</strong> à <strong>{plan.prix?.toLocaleString()} GNF/mois</strong>. Le changement sera effectif immédiatement. La différence sera calculée au prorata.
        </p>
        <div style={{ background:t.bg, borderRadius:t.radius, padding:"12px 14px", marginBottom:20, border:`1px solid ${t.border}` }}>
          {[
            ["Plan actuel", `${PLAN_ACTUEL.nom} — ${PLAN_ACTUEL.prix.toLocaleString()} GNF/mois`],
            ["Nouveau plan", `${plan.nom} — ${plan.prix?.toLocaleString()} GNF/mois`],
            ["Effectif le", "Immédiatement"],
          ].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"5px 0", borderBottom:`1px solid ${t.border}` }}>
              <span style={{ color:t.muted }}>{l}</span>
              <span style={{ fontWeight:600, color:t.text }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
          <button onClick={handleConfirm} disabled={loading} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:t.blue, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            {loading
              ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .6s linear infinite" }} />Traitement…</>
              : <><i className="ti ti-check" style={{ fontSize:14 }} />Confirmer</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL AJOUT PAIEMENT ───────────────────────────────────── */
function ModalAddPaiement({ onClose, onAdd }) {
  const [type, setType] = useState("Mobile Money");
  const [numero, setNumero] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, fontFamily:t.font }}>
      <div style={{ background:t.surface, borderRadius:20, padding:28, width:"min(420px,92vw)", boxShadow:t.shadowLg }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>Ajouter un moyen de paiement</h3>
          <button onClick={onClose} style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub }}>
            <i className="ti ti-x" style={{ fontSize:15 }} />
          </button>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {["Mobile Money","Carte bancaire"].map(tp=>(
            <button key={tp} onClick={()=>setType(tp)} style={{ flex:1, padding:"10px", border:`1.5px solid ${type===tp?t.blue:t.border}`, borderRadius:t.radius, background:type===tp?t.blueSoft:t.surface, color:type===tp?t.blue:t.sub, fontSize:12, fontWeight:type===tp?600:400, cursor:"pointer", fontFamily:t.font }}>{tp}</button>
          ))}
        </div>
        {type==="Mobile Money" ? (
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Opérateur</label>
            <select style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, fontFamily:t.font, outline:"none", marginBottom:12 }}>
              <option>Orange Money</option><option>MTN MoMo</option>
            </select>
            <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Numéro de téléphone</label>
            <input type="text" placeholder="Ex : 622 00 11 22" value={numero} onChange={e=>setNumero(e.target.value)}
              style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font }}
              onFocus={e=>e.currentTarget.style.borderColor=t.blue}
              onBlur={e=>e.currentTarget.style.borderColor=t.border}
            />
          </div>
        ) : (
          <div style={{ padding:"20px 0", textAlign:"center", color:t.muted, fontSize:13 }}>
            <i className="ti ti-credit-card" style={{ fontSize:32, display:"block", marginBottom:8, color:t.border }} />
            Paiement par carte bientôt disponible
          </div>
        )}
        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
          <button onClick={()=>{onAdd({type,label:type,numero,defaut:false,icon:"ti-device-mobile"});onClose();}} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:t.blue, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font }}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE PRINCIPALE ────────────────────────────────────────── */
export default function Abonnement() {
  const [autoRenew,     setAutoRenew]     = useState(true);
  const [modalPlan,     setModalPlan]     = useState(null);
  const [modalPaiement, setModalPaiement] = useState(false);
  const [moyens,        setMoyens]        = useState(MOYENS_PAIEMENT);
  const [toast,         setToast]         = useState(null);
  const [planActif,     setPlanActif]     = useState("premium");
  const [loadingRenouveler, setLoadingRenouveler] = useState(false);

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3000);
  };

  const handleChangePlan = (plan) => {
    setPlanActif(plan.id);
    showToast(`Passage au plan ${plan.nom} confirmé !`);
  };

  const handleRenouveler = () => {
    setLoadingRenouveler(true);
    setTimeout(()=>{ setLoadingRenouveler(false); showToast("Abonnement renouvelé jusqu'au 15/08/2027 !"); }, 2000);
  };

  const handleAddMoyen = (m) => {
    setMoyens(prev=>[...prev, { id:Date.now(), ...m }]);
    showToast("Moyen de paiement ajouté");
  };

  const handleDownloadFacture = (inv) => {
    const txt = [
      "FACTURE SchoolX",
      "═".repeat(40),
      `N° Facture  : ${inv.id}`,
      `Date        : ${inv.date}`,
      `Plan        : ${inv.plan}`,
      `Montant     : ${inv.montant.toLocaleString()} GNF`,
      `Statut      : ${inv.statut}`,
      `Méthode     : ${inv.methode}`,
      "═".repeat(40),
      `Généré le ${new Date().toLocaleDateString("fr-FR")} — SchoolX`,
    ].join("\n");
    const a = Object.assign(document.createElement("a"),{
      href:URL.createObjectURL(new Blob([txt],{type:"text/plain;charset=utf-8"})),
      download:`Facture_${inv.id}.txt`,
    });
    a.click();
    showToast(`Facture ${inv.id} téléchargée`);
  };

  return (
    <div style={{ fontFamily:t.font, color:t.text }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, background:toast.type==="error"?t.red:t.green, color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600, boxShadow:"0 4px 20px rgba(0,0,0,0.18)", display:"flex", alignItems:"center", gap:9, maxWidth:360 }}>
          <i className={`ti ${toast.type==="error"?"ti-x":"ti-check"}`} style={{ fontSize:16, flexShrink:0 }} />
          {toast.msg}
        </div>
      )}

      {/* ══════════════════════════════════════════
          SECTION 1 — HEADER
      ══════════════════════════════════════════ */}
      <div style={{ marginBottom:28 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize:12, color:t.muted, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
          <i className="ti ti-home" style={{ fontSize:13 }} />
          <span>SchoolX</span>
          <i className="ti ti-chevron-right" style={{ fontSize:12 }} />
          <span style={{ color:t.blue, fontWeight:500 }}>Mon abonnement</span>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Mon abonnement</h1>
            <p style={{ fontSize:13, color:t.sub, marginTop:5, margin:0 }}>
              Gérez votre plan SchoolX, vos fonctionnalités et votre consommation.
            </p>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <Btn icon="ti-edit"   label="Modifier mon abonnement" onClick={()=>document.getElementById("plans-section")?.scrollIntoView({behavior:"smooth"})} />
            <Btn icon="ti-refresh" label="Renouveler maintenant" primary loading={loadingRenouveler} onClick={handleRenouveler} />
          </div>
        </div>

        {/* Status Banner */}
        <div style={{ marginTop:18, background:t.greenSoft, border:`1px solid ${t.greenMid}`, borderRadius:t.radiusLg, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:t.green, boxShadow:`0 0 0 3px ${t.greenMid}` }} />
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:t.green }}>Abonnement actif</div>
              <div style={{ fontSize:12, color:t.green+"99", marginTop:2 }}>Prochain renouvellement le <strong>{PLAN_ACTUEL.renouvellement}</strong></div>
            </div>
          </div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            {[
              { label:"Plan actuel",     val:`SchoolX ${PLAN_ACTUEL.nom}` },
              { label:"Statut",          val:PLAN_ACTUEL.statut           },
              { label:"Renouvellement",  val:PLAN_ACTUEL.renouvellement   },
            ].map(info=>(
              <div key={info.label} style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:t.green+"88", fontWeight:600, textTransform:"uppercase", letterSpacing:".4px" }}>{info.label}</div>
                <div style={{ fontSize:13, fontWeight:700, color:t.green, marginTop:2 }}>{info.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 — CARTE ABONNEMENT ACTUEL
      ══════════════════════════════════════════ */}
      <Section title="Votre plan actuel" sub={`SchoolX ${PLAN_ACTUEL.nom} — ${PLAN_ACTUEL.prix.toLocaleString()} ${PLAN_ACTUEL.devise}/${PLAN_ACTUEL.periode}`}>
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusXl, overflow:"hidden", boxShadow:t.shadowMd }}>
          {/* Bande haut */}
          <div style={{ background:`linear-gradient(135deg,${t.blue},${t.purple})`, padding:"24px 28px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.6)", fontWeight:600, textTransform:"uppercase", letterSpacing:".6px", marginBottom:6 }}>Plan actuel</div>
                <div style={{ fontSize:28, fontWeight:800, color:"#fff", lineHeight:1.1 }}>SchoolX {PLAN_ACTUEL.nom}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.7)", marginTop:6 }}>
                  {PLAN_ACTUEL.prix.toLocaleString()} GNF<span style={{ fontSize:11 }}> / mois</span>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <Chip label="● Actif" c={t.green} bg="rgba(255,255,255,0.15)" />
                <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginTop:8 }}>
                  Expire le {PLAN_ACTUEL.renouvellement}
                </div>
              </div>
            </div>
          </div>

          {/* Corps */}
          <div style={{ padding:"24px 28px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
              {/* Features */}
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:14 }}>Fonctionnalités incluses</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {PLAN_ACTUEL.features.map(f=>(
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", background:t.greenSoft, border:`1px solid ${t.greenMid}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <i className="ti ti-check" style={{ fontSize:11, color:t.green }} />
                      </div>
                      <span style={{ fontSize:13, color:t.text }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage */}
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:14 }}>Utilisation actuelle</div>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {USAGE.map(u=>{
                    const pct = Math.round((u.val/u.max)*100);
                    return (
                      <div key={u.label}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <i className={`ti ${u.icon}`} style={{ fontSize:14, color:u.c }} />
                            <span style={{ fontSize:13, fontWeight:500, color:t.text }}>{u.label}</span>
                          </div>
                          <span style={{ fontSize:12, color:t.sub, fontWeight:600 }}>{u.val.toLocaleString()}{u.unit} / {u.max.toLocaleString()}{u.unit}</span>
                        </div>
                        <div style={{ height:7, background:t.border, borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", background:pct>=90?t.red:pct>=75?t.amber:u.c, borderRadius:99, width:`${pct}%`, transition:"width .8s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════
          SECTION 3 — USAGE DÉTAILLÉ
      ══════════════════════════════════════════ */}
      <Section title="Utilisation des ressources" sub="Votre consommation en temps réel">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
          {USAGE.map(u=>{
            const pct = Math.round((u.val/u.max)*100);
            const c   = pct>=90?t.red:pct>=75?t.amber:u.c;
            const bg  = pct>=90?t.redSoft:pct>=75?t.amberSoft:u.bg;
            return (
              <div key={u.label} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"18px 18px 16px", boxShadow:t.shadow, transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shadowMd;e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadow;e.currentTarget.style.transform="translateY(0)"}}
              >
                <div style={{ width:42, height:42, borderRadius:11, background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
                  <i className={`ti ${u.icon}`} style={{ fontSize:20, color:c }} />
                </div>
                <div style={{ fontSize:22, fontWeight:800, color:t.text, lineHeight:1 }}>
                  {u.val.toLocaleString()}<span style={{ fontSize:13, fontWeight:400, color:t.muted }}>{u.unit}</span>
                </div>
                <div style={{ fontSize:12, color:t.sub, marginTop:4, marginBottom:12 }}>{u.label}</div>
                <ProgressBar val={u.val} max={u.max} color={u.c} height={6} />
                {pct >= 90 && (
                  <div style={{ marginTop:8, fontSize:11, color:t.red, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                    <i className="ti ti-alert-triangle" style={{ fontSize:12 }} /> Limite bientôt atteinte
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ══════════════════════════════════════════
          SECTION 4 — COMPARAISON DES PLANS
      ══════════════════════════════════════════ */}
      <Section id="plans-section" title="Comparer les plans" sub="Choisissez le plan adapté à votre établissement">
        <div id="plans-section" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>
          {PLANS.map(plan=>{
            const isActuel = plan.id === planActif;
            return (
              <div key={plan.id} style={{
                background:plan.highlight?`linear-gradient(175deg,${t.blueSoft},${t.surface})`:t.surface,
                border:`2px solid ${isActuel?t.blue:plan.highlight?t.blueMid:t.border}`,
                borderRadius:t.radiusXl, padding:"22px 20px", boxShadow:isActuel?t.shadowMd:t.shadow,
                position:"relative", display:"flex", flexDirection:"column",
                transition:"all .2s",
              }}
                onMouseEnter={e=>{if(!isActuel){e.currentTarget.style.boxShadow=t.shadowMd;e.currentTarget.style.transform="translateY(-3px)";}}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow=isActuel?t.shadowMd:t.shadow;e.currentTarget.style.transform="translateY(0)";}}
              >
                {/* Badge */}
                {plan.badge && (
                  <div style={{ position:"absolute", top:-1, right:16 }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 11px", borderRadius:"0 0 8px 8px", background:isActuel?t.blue:t.green, color:"#fff" }}>{plan.badge}</span>
                  </div>
                )}

                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:t.text, marginBottom:4 }}>{plan.nom}</div>
                  <div style={{ fontSize:12, color:t.muted }}>{plan.desc}</div>
                </div>

                <div style={{ marginBottom:18 }}>
                  {plan.prix
                    ? <><span style={{ fontSize:26, fontWeight:800, color:isActuel?t.blue:t.text }}>{plan.prix.toLocaleString()}</span><span style={{ fontSize:12, color:t.muted }}> GNF/mois</span></>
                    : <span style={{ fontSize:18, fontWeight:700, color:t.purple }}>Sur devis</span>
                  }
                </div>

                <div style={{ flex:1, marginBottom:18 }}>
                  {plan.features.map(f=>(
                    <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:7 }}>
                      <i className="ti ti-check" style={{ fontSize:13, color:t.green, marginTop:1, flexShrink:0 }} />
                      <span style={{ fontSize:12, color:t.sub, lineHeight:1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {isActuel ? (
                  <div style={{ padding:"10px", border:`1px solid ${t.blueMid}`, borderRadius:9, textAlign:"center", fontSize:13, fontWeight:600, color:t.blue, background:t.blueSoft }}>
                    <i className="ti ti-circle-check" style={{ fontSize:14, marginRight:6 }} />Plan actuel
                  </div>
                ) : plan.prix ? (
                  <Btn
                    icon="ti-arrows-exchange"
                    label={`Passer à ${plan.nom}`}
                    primary={plan.highlight}
                    onClick={()=>setModalPlan(plan)}
                    small
                  />
                ) : (
                  <Btn icon="ti-phone" label="Nous contacter" ghost small onClick={()=>showToast("Redirection vers le support…")} />
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ══════════════════════════════════════════
          SECTION 5 — HISTORIQUE PAIEMENTS
      ══════════════════════════════════════════ */}
      <Section
        title="Historique des paiements"
        sub="Toutes vos factures SchoolX"
        action={<Btn icon="ti-download" label="Tout exporter" small onClick={()=>showToast("Export en cours…")} />}
      >
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:540 }}>
              <thead>
                <tr style={{ background:t.bg }}>
                  {["N° Facture","Date","Plan","Montant","Méthode","Statut",""].map(h=>(
                    <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:t.muted, textTransform:"uppercase", letterSpacing:".4px", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORIQUE.map(inv=>{
                  const sInfo = inv.statut==="Payé" ? {c:t.green,bg:t.greenSoft} : inv.statut==="Remboursé" ? {c:t.amber,bg:t.amberSoft} : {c:t.red,bg:t.redSoft};
                  return (
                    <tr key={inv.id} style={{ borderBottom:`1px solid ${t.border}`, transition:"background .12s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ fontSize:12, fontWeight:700, color:t.blue, background:t.blueSoft, padding:"2px 8px", borderRadius:6, fontFamily:"monospace" }}>{inv.id}</span>
                      </td>
                      <td style={{ padding:"13px 16px", fontSize:13, color:t.sub }}>{inv.date}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, fontWeight:500, color:t.text }}>{inv.plan}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:t.text }}>{inv.montant.toLocaleString()} GNF</td>
                      <td style={{ padding:"13px 16px", fontSize:12, color:t.sub }}>{inv.methode}</td>
                      <td style={{ padding:"13px 16px" }}>
                        <Chip label={inv.statut} c={sInfo.c} bg={sInfo.bg} small />
                      </td>
                      <td style={{ padding:"13px 12px" }}>
                        <button onClick={()=>handleDownloadFacture(inv)} title="Télécharger" style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 9px", border:`1px solid ${t.border}`, borderRadius:7, background:t.surface, fontSize:11, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font, transition:"all .15s" }}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=t.blue;e.currentTarget.style.color=t.blue;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.sub;}}
                        >
                          <i className="ti ti-download" style={{ fontSize:12 }} /> Facture
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"10px 16px", borderTop:`1px solid ${t.border}`, background:t.bg, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:12, color:t.muted }}>{HISTORIQUE.length} transactions</span>
            <span style={{ fontSize:12, color:t.blue, fontWeight:500 }}>Total : {HISTORIQUE.filter(i=>i.statut==="Payé").reduce((a,i)=>a+i.montant,0).toLocaleString()} GNF</span>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════
          SECTION 6 — MOYENS DE PAIEMENT
      ══════════════════════════════════════════ */}
      <Section
        title="Moyens de paiement"
        sub="Gérez vos méthodes de paiement pour le renouvellement"
        action={<Btn icon="ti-plus" label="Ajouter" primary small onClick={()=>setModalPaiement(true)} />}
      >
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {moyens.map(m=>(
            <div key={m.id} style={{ background:t.surface, border:`1px solid ${m.defaut?t.blueMid:t.border}`, borderRadius:t.radiusLg, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, boxShadow:t.shadow }}>
              <div style={{ width:44, height:44, borderRadius:11, background:t.blueSoft, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={`ti ${m.icon}`} style={{ fontSize:22, color:t.blue }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:t.text }}>{m.label}</span>
                  {m.defaut && <Chip label="Par défaut" c={t.blue} bg={t.blueSoft} small />}
                </div>
                <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>{m.type} · {m.numero}</div>
              </div>
              <div style={{ display:"flex", gap:7 }}>
                {!m.defaut && (
                  <button onClick={()=>{ setMoyens(prev=>prev.map(x=>({...x,defaut:x.id===m.id}))); showToast("Méthode par défaut mise à jour"); }} style={{ padding:"5px 10px", border:`1px solid ${t.border}`, borderRadius:7, background:t.surface, fontSize:11, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font }}>
                    Définir par défaut
                  </button>
                )}
                <button onClick={()=>{ setMoyens(prev=>prev.filter(x=>x.id!==m.id)); showToast("Méthode supprimée","error"); }} style={{ padding:"5px 9px", border:"1px solid #fecaca", borderRadius:7, background:t.redSoft, fontSize:11, cursor:"pointer", color:t.red, fontFamily:t.font }}>
                  <i className="ti ti-trash" style={{ fontSize:12 }} />
                </button>
              </div>
            </div>
          ))}
          {moyens.length===0 && (
            <div style={{ padding:"28px", textAlign:"center", color:t.muted, fontSize:13, background:t.surface, border:`1px dashed ${t.border}`, borderRadius:t.radiusLg }}>
              <i className="ti ti-credit-card" style={{ fontSize:28, display:"block", marginBottom:8, color:t.border }} />
              Aucun moyen de paiement configuré
            </div>
          )}
        </div>
      </Section>

      {/* ══════════════════════════════════════════
          SECTION 7 — RENOUVELLEMENT AUTO
      ══════════════════════════════════════════ */}
      <Section title="Renouvellement automatique">
        <div style={{ background:t.surface, border:`1px solid ${autoRenew?t.blueMid:t.border}`, borderRadius:t.radiusLg, padding:"18px 22px", boxShadow:t.shadow, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:autoRenew?t.blueSoft:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background .2s" }}>
              <i className="ti ti-refresh" style={{ fontSize:21, color:autoRenew?t.blue:t.muted }} />
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:t.text }}>Renouvellement automatique</div>
              <div style={{ fontSize:12, color:t.muted, marginTop:3, maxWidth:460 }}>
                {autoRenew
                  ? `Votre abonnement se renouvellera automatiquement le ${PLAN_ACTUEL.renouvellement} via votre méthode de paiement par défaut.`
                  : "Le renouvellement automatique est désactivé. Pensez à renouveler manuellement avant l'expiration."}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:12, fontWeight:600, color:autoRenew?t.blue:t.muted }}>{autoRenew?"Activé":"Désactivé"}</span>
            <button onClick={()=>{ setAutoRenew(!autoRenew); showToast(autoRenew?"Renouvellement auto désactivé":"Renouvellement auto activé"); }}
              style={{ width:48, height:26, borderRadius:99, border:"none", cursor:"pointer", background:autoRenew?t.blue:t.border, position:"relative", transition:"background .25s" }}
            >
              <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:autoRenew?25:3, transition:"left .25s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
            </button>
          </div>
        </div>
        {!autoRenew && (
          <div style={{ marginTop:10, padding:"12px 16px", background:t.amberSoft, border:`1px solid ${t.amberMid}`, borderRadius:t.radius, fontSize:12, color:t.amber, fontWeight:500, display:"flex", alignItems:"center", gap:8 }}>
            <i className="ti ti-alert-triangle" style={{ fontSize:15, flexShrink:0 }} />
            Attention : votre abonnement expirera le {PLAN_ACTUEL.renouvellement}. Pensez à le renouveler manuellement.
          </div>
        )}
      </Section>

      {/* ══════════════════════════════════════════
          SECTION 8 — SUPPORT
      ══════════════════════════════════════════ */}
      <Section title="Besoin d'aide ?" sub="Notre équipe est là pour vous accompagner">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
          {[
            { icon:"ti-help-circle",  title:"Centre d'aide",       desc:"Consultez nos guides et tutoriels",         action:"Ouvrir",           c:t.blue,   bg:t.blueSoft   },
            { icon:"ti-headset",      title:"Contacter le support", desc:"Réponse garantie en moins de 2h",           action:"Démarrer un chat",  c:t.green,  bg:t.greenSoft  },
            { icon:"ti-message-circle",title:"FAQ",                 desc:"Réponses aux questions les plus fréquentes", action:"Voir la FAQ",      c:t.purple, bg:t.purpleSoft },
          ].map(s=>(
            <div key={s.title} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"20px", boxShadow:t.shadow, display:"flex", flexDirection:"column", gap:12, transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shadowMd;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=s.c+"44";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadow;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=t.border;}}
            >
              <div style={{ width:42, height:42, borderRadius:11, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className={`ti ${s.icon}`} style={{ fontSize:21, color:s.c }} />
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:t.text }}>{s.title}</div>
                <div style={{ fontSize:12, color:t.muted, marginTop:4, lineHeight:1.5 }}>{s.desc}</div>
              </div>
              <button onClick={()=>showToast(`${s.title} — bientôt disponible`)}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", border:`1px solid ${s.c}22`, borderRadius:8, background:s.bg, color:s.c, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:t.font, transition:"all .15s", width:"fit-content" }}
                onMouseEnter={e=>{e.currentTarget.style.background=s.c;e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background=s.bg;e.currentTarget.style.color=s.c;}}
              >
                {s.action} <i className="ti ti-arrow-right" style={{ fontSize:12 }} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{ marginTop:16, padding:"14px 18px", background:t.bg, border:`1px solid ${t.border}`, borderRadius:t.radius, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ fontSize:12, color:t.muted }}>
            <i className="ti ti-shield-check" style={{ marginRight:6, color:t.green }} />
            Paiements sécurisés — Données protégées — Certifié ISO 27001
          </div>
          <div style={{ fontSize:12, color:t.muted }}>
            SchoolX v2.4.1 · <span style={{ color:t.blue, cursor:"pointer" }} onClick={()=>showToast("Conditions d'utilisation")}>Conditions</span> · <span style={{ color:t.blue, cursor:"pointer" }} onClick={()=>showToast("Politique de confidentialité")}>Confidentialité</span>
          </div>
        </div>
      </Section>

      {/* MODALS */}
      {modalPlan && <ModalChangePlan plan={modalPlan} onClose={()=>setModalPlan(null)} onConfirm={handleChangePlan} />}
      {modalPaiement && <ModalAddPaiement onClose={()=>setModalPaiement(false)} onAdd={handleAddMoyen} />}
    </div>
  );
}