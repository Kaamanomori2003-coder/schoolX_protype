import { useState, useRef } from "react";

/* ─── THEME ──────────────────────────────────────────────────── */
const t = {
  bg:"#f7f8fa", surface:"#ffffff", border:"#eaecf0",
  blue:"#2563eb", blueSoft:"#eff6ff", blueMid:"#dbeafe",
  text:"#111827", sub:"#6b7280", muted:"#9ca3af",
  green:"#059669", greenSoft:"#f0fdf4",
  amber:"#d97706", amberSoft:"#fffbeb",
  red:"#dc2626", redSoft:"#fef2f2",
  purple:"#7c3aed", purpleSoft:"#f5f3ff",
  cyan:"#0891b2", cyanSoft:"#ecfeff",
  radius:"10px", radiusLg:"14px", radiusXl:"18px",
  shadow:"0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
  shadowLg:"0 10px 30px rgba(0,0,0,0.1)",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── TYPES DE DOCUMENTS ─────────────────────────────────────── */
const docTypes = {
  "Bulletin":       { icon:"ti-file-description", color:"#2563eb", bg:"#eff6ff"  },
  "Certificat":     { icon:"ti-certificate",       color:"#059669", bg:"#f0fdf4"  },
  "Relevé":         { icon:"ti-clipboard-list",    color:"#7c3aed", bg:"#f5f3ff"  },
  "Contrat":        { icon:"ti-file-text",          color:"#d97706", bg:"#fffbeb"  },
  "Facture":        { icon:"ti-receipt",            color:"#dc2626", bg:"#fef2f2"  },
  "Reçu":           { icon:"ti-credit-card",        color:"#0891b2", bg:"#ecfeff"  },
  "Rapport":        { icon:"ti-chart-bar",          color:"#9333ea", bg:"#faf5ff"  },
  "Administratif":  { icon:"ti-building",           color:"#374151", bg:"#f3f4f6"  },
  "Élève":          { icon:"ti-user",               color:"#2563eb", bg:"#eff6ff"  },
  "Archive":        { icon:"ti-archive",            color:"#6b7280", bg:"#f3f4f6"  },
};

const getDocType = (type) => docTypes[type] || { icon:"ti-file", color:t.sub, bg:t.bg };

const badgeInfo = (status) => ({
  "Actif":    { c:t.green, bg:t.greenSoft   },
  "Archivé":  { c:t.sub,   bg:"#f3f4f6"     },
  "Brouillon":{ c:t.amber, bg:t.amberSoft   },
}[status] || { c:t.sub, bg:t.bg });

/* ─── DATA ───────────────────────────────────────────────────── */
const DOCS_INIT = [
  { id:1,  nom:"Bulletin T1 — Aminata Diallo",      type:"Bulletin",      cat:"Élèves",        date:"15/01/2025", auteur:"Système",          taille:"1.2 MB", status:"Actif",     desc:"Bulletin du 1er trimestre 2024/2025 pour l'élève Aminata Diallo, Terminale A."  },
  { id:2,  nom:"Bulletin T1 — Mamadou Bah",         type:"Bulletin",      cat:"Élèves",        date:"15/01/2025", auteur:"Système",          taille:"1.1 MB", status:"Actif",     desc:"Bulletin du 1er trimestre 2024/2025 pour l'élève Mamadou Bah, 3ème B."        },
  { id:3,  nom:"Certificat de scolarité — FC",      type:"Certificat",    cat:"Élèves",        date:"10/01/2025", auteur:"M. le Directeur",  taille:"0.4 MB", status:"Actif",     desc:"Certificat de scolarité pour Fatoumata Camara, année 2024/2025."             },
  { id:4,  nom:"Contrat — Dr. Mamadou Diallo",      type:"Contrat",       cat:"Professeurs",   date:"01/09/2012", auteur:"Administration",   taille:"2.1 MB", status:"Actif",     desc:"Contrat de travail CDI signé le 01/09/2012."                                 },
  { id:5,  nom:"Contrat — Mme Fatoumata Bah",       type:"Contrat",       cat:"Professeurs",   date:"15/09/2016", auteur:"Administration",   taille:"1.9 MB", status:"Actif",     desc:"Contrat de travail CDI signé le 15/09/2016."                                 },
  { id:6,  nom:"Rapport Trimestriel T1 2025",       type:"Rapport",       cat:"Administration",date:"20/01/2025", auteur:"M. le Directeur",  taille:"3.4 MB", status:"Actif",     desc:"Rapport d'activités du 1er trimestre de l'année scolaire 2024/2025."         },
  { id:7,  nom:"Facture Fournitures Jan 2025",       type:"Facture",       cat:"Paiements",     date:"05/01/2025", auteur:"Comptabilité",     taille:"0.8 MB", status:"Actif",     desc:"Facture d'achat de fournitures scolaires pour janvier 2025."                  },
  { id:8,  nom:"Reçu Paiement — Aminata Diallo",    type:"Reçu",          cat:"Paiements",     date:"02/01/2025", auteur:"Système",          taille:"0.3 MB", status:"Actif",     desc:"Reçu de paiement de scolarité — 500 000 GNF."                                },
  { id:9,  nom:"Relevé de Notes T1 — Terminale A",  type:"Relevé",        cat:"Élèves",        date:"18/01/2025", auteur:"Système",          taille:"1.5 MB", status:"Actif",     desc:"Relevé de notes du 1er trimestre pour la classe Terminale A."                },
  { id:10, nom:"Rapport Annuel 2023/2024",           type:"Rapport",       cat:"Administration",date:"30/06/2024", auteur:"M. le Directeur",  taille:"5.2 MB", status:"Archivé",   desc:"Rapport annuel complet de l'année scolaire 2023/2024."                        },
  { id:11, nom:"Certificat — Mariama Kouyaté",       type:"Certificat",    cat:"Élèves",        date:"12/01/2025", auteur:"M. le Directeur",  taille:"0.4 MB", status:"Actif",     desc:"Certificat de récompense — Première de classe, Trimestre 1."                 },
  { id:12, nom:"Procès-verbal Réunion Parents",      type:"Administratif", cat:"Administration",date:"08/01/2025", auteur:"Secrétariat",      taille:"0.9 MB", status:"Actif",     desc:"PV de la réunion parents-professeurs du 8 janvier 2025."                     },
  { id:13, nom:"Fiche d'inscription — IS 2024",      type:"Élève",         cat:"Élèves",        date:"01/09/2024", auteur:"Secrétariat",      taille:"0.6 MB", status:"Archivé",   desc:"Fiche d'inscription d'Ibrahima Sow pour l'année 2024/2025."                  },
  { id:14, nom:"Budget Prévisionnel 2025",            type:"Rapport",       cat:"Administration",date:"02/01/2025", auteur:"Comptabilité",     taille:"1.8 MB", status:"Brouillon", desc:"Budget prévisionnel de l'établissement pour l'année 2025."                   },
  { id:15, nom:"Reçu Paiement — Mamadou Bah",        type:"Reçu",          cat:"Paiements",     date:"03/01/2025", montant:600000, auteur:"Système", taille:"0.3 MB", status:"Actif", desc:"Reçu de paiement de scolarité — 600 000 GNF."                              },
];

const CATEGORIES = ["Tous","Élèves","Professeurs","Administration","Paiements","Archives"];
const TRIS = ["Récent","Ancien","Nom","Taille"];

const ACCES_RAPIDE = [
  { label:"Bulletins",     type:"Bulletin",      icon:"ti-file-description", color:"#2563eb", bg:"#eff6ff", count:2 },
  { label:"Rapports",      type:"Rapport",       icon:"ti-chart-bar",         color:"#9333ea", bg:"#faf5ff", count:3 },
  { label:"Paiements",     type:"Reçu",          icon:"ti-credit-card",       color:"#0891b2", bg:"#ecfeff", count:2 },
  { label:"Contrats",      type:"Contrat",       icon:"ti-file-text",         color:"#d97706", bg:"#fffbeb", count:2 },
  { label:"Certificats",   type:"Certificat",    icon:"ti-certificate",       color:"#059669", bg:"#f0fdf4", count:2 },
  { label:"Archives",      cat:"Archives",       icon:"ti-archive",           color:"#6b7280", bg:"#f3f4f6", count:2 },
];

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
const Chip = ({ label, c, bg, small }) => (
  <span style={{ fontSize:small?10:11, fontWeight:600, padding:small?"2px 7px":"3px 10px", borderRadius:20, background:bg||t.bg, color:c||t.sub, whiteSpace:"nowrap", display:"inline-block" }}>
    {label}
  </span>
);

const StatBox = ({ icon, label, value, sub, c=t.blue, bg=t.blueSoft }) => (
  <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"18px 20px", boxShadow:t.shadow, transition:"all .2s", cursor:"default" }}
    onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shadowMd;e.currentTarget.style.transform="translateY(-2px)"}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadow;e.currentTarget.style.transform="translateY(0)"}}
  >
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
      <div style={{ width:40, height:40, borderRadius:11, background:bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <i className={`ti ${icon}`} style={{ fontSize:19, color:c }} />
      </div>
    </div>
    <div style={{ fontSize:26, fontWeight:800, color:t.text, lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:12, color:t.sub, marginTop:5, fontWeight:500 }}>{label}</div>
    {sub && <div style={{ fontSize:11, color:t.muted, marginTop:3 }}>{sub}</div>}
  </div>
);

const IconBtn = ({ icon, label, primary, small, onClick }) => (
  <button onClick={onClick} title={label} style={{
    display:"flex", alignItems:"center", gap:6,
    padding:small?"6px 12px":"9px 16px",
    border:primary?"none":`1px solid ${t.border}`,
    borderRadius:t.radius, cursor:"pointer", fontFamily:t.font,
    fontSize:small?12:13, fontWeight:600,
    background:primary?t.blue:t.surface,
    color:primary?"#fff":t.sub,
    boxShadow:primary?`0 2px 8px rgba(37,99,235,0.25)`:t.shadow,
    transition:"all .15s", whiteSpace:"nowrap",
  }}
    onMouseEnter={e=>{e.currentTarget.style.opacity=".87";e.currentTarget.style.transform="translateY(-1px)"}}
    onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"}}
  >
    <i className={`ti ${icon}`} style={{ fontSize:small?13:14 }} />
    {label}
  </button>
);

/* ─── DRAWER PREVIEW ─────────────────────────────────────────── */
function DocDrawer({ doc, onClose }) {
  if (!doc) return null;
  const dt  = getDocType(doc.type);
  const bi  = badgeInfo(doc.status);
  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.2)", zIndex:300, transition:"opacity .2s" }} />
      {/* Panel */}
      <div style={{
        position:"fixed", top:0, right:0, bottom:0, width:"min(420px,92vw)",
        background:t.surface, borderLeft:`1px solid ${t.border}`,
        boxShadow:"-8px 0 32px rgba(0,0,0,0.1)", zIndex:400,
        display:"flex", flexDirection:"column", fontFamily:t.font,
        animation:"slideIn .22s ease",
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div style={{ padding:"18px 20px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:11, background:dt.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <i className={`ti ${dt.icon}`} style={{ fontSize:20, color:dt.color }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:700, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.nom}</div>
            <div style={{ display:"flex", gap:6, marginTop:4 }}>
              <Chip label={doc.type}   c={dt.color} bg={dt.bg} small />
              <Chip label={doc.status} c={bi.c}     bg={bi.bg} small />
            </div>
          </div>
          <button onClick={onClose} style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub, flexShrink:0 }}>
            <i className="ti ti-x" style={{ fontSize:15 }} />
          </button>
        </div>

        {/* Preview zone */}
        <div style={{ margin:"16px 20px 0", background:t.bg, borderRadius:t.radiusLg, border:`1px solid ${t.border}`, height:200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
          <div style={{ width:64, height:80, borderRadius:8, background:dt.bg, border:`2px solid ${dt.color}22`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className={`ti ${dt.icon}`} style={{ fontSize:30, color:dt.color }} />
          </div>
          <div style={{ fontSize:12, color:t.muted, fontWeight:500 }}>Prévisualisation — {doc.taille}</div>
        </div>

        {/* Infos */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:12 }}>Informations</div>
          {[
            { icon:"ti-file",         label:"Type",        val:doc.type          },
            { icon:"ti-tag",          label:"Catégorie",   val:doc.cat           },
            { icon:"ti-calendar",     label:"Créé le",     val:doc.date          },
            { icon:"ti-user",         label:"Auteur",      val:doc.auteur        },
            { icon:"ti-database",     label:"Taille",      val:doc.taille        },
          ].map(r=>(
            <div key={r.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:`1px solid ${t.border}` }}>
              <i className={`ti ${r.icon}`} style={{ fontSize:14, color:t.muted, width:16, flexShrink:0 }} />
              <span style={{ fontSize:12, color:t.muted, width:80, flexShrink:0 }}>{r.label}</span>
              <span style={{ fontSize:13, color:t.text, fontWeight:500 }}>{r.val}</span>
            </div>
          ))}

          {doc.desc && (
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:8 }}>Description</div>
              <p style={{ fontSize:13, color:t.sub, lineHeight:1.6, margin:0 }}>{doc.desc}</p>
            </div>
          )}

          {/* Historique */}
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:10 }}>Historique</div>
            {[
              { action:"Créé",       date:doc.date,       actor:doc.auteur },
              { action:"Consulté",   date:"Aujourd'hui",  actor:"M. le Directeur" },
            ].map((h,i)=>(
              <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:t.blueSoft, border:`1px solid ${t.blueMid}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className="ti ti-point" style={{ fontSize:10, color:t.blue }} />
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:t.text }}>{h.action} par {h.actor}</div>
                  <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{h.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding:"14px 20px", borderTop:`1px solid ${t.border}`, display:"flex", flexWrap:"wrap", gap:8 }}>
          {[
            { icon:"ti-download", label:"Télécharger", primary:true },
            { icon:"ti-share",    label:"Partager"                  },
            { icon:"ti-printer",  label:"Imprimer"                  },
            { icon:"ti-archive",  label:"Archiver"                  },
          ].map(a=>(
            <IconBtn key={a.label} icon={a.icon} label={a.label} primary={a.primary} small />
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── MODAL UPLOAD ───────────────────────────────────────────── */
function UploadModal({ onClose, onUpload }) {
  const [drag,     setDrag]     = useState(false);
  const [progress, setProgress] = useState(null);
  const [done,     setDone]     = useState(false);
  const [form,     setForm]     = useState({ nom:"", type:"Bulletin", cat:"Élèves" });
  const fileRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name);
  };

  const simulateUpload = (name) => {
    setForm(f=>({...f, nom:name.replace(/\.[^/.]+$/,"")}));
    setProgress(0);
    const iv = setInterval(()=>{
      setProgress(p=>{
        if (p>=100) { clearInterval(iv); setDone(true); return 100; }
        return p + Math.random()*18;
      });
    }, 120);
  };

  const save = () => {
    if (!form.nom) return;
    onUpload({ ...form, date:new Date().toLocaleDateString("fr-FR"), auteur:"M. le Directeur", taille:"1.0 MB", status:"Actif", desc:"Document importé." });
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, fontFamily:t.font }}>
      <div style={{ background:t.surface, borderRadius:20, padding:28, width:"min(500px,94vw)", boxShadow:"0 24px 64px rgba(0,0,0,0.18)", maxHeight:"88vh", overflowY:"auto" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:t.text }}>Importer un document</h3>
            <p style={{ margin:0, fontSize:12, color:t.muted, marginTop:3 }}>PDF, DOCX, PNG, JPG — max 50 MB</p>
          </div>
          <button onClick={onClose} style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub }}>
            <i className="ti ti-x" style={{ fontSize:15 }} />
          </button>
        </div>

        {/* Drop zone */}
        {!done ? (
          <div
            onDragOver={e=>{e.preventDefault();setDrag(true)}}
            onDragLeave={()=>setDrag(false)}
            onDrop={handleDrop}
            onClick={()=>fileRef.current?.click()}
            style={{
              border:`2px dashed ${drag?t.blue:t.border}`,
              borderRadius:t.radiusLg, padding:"36px 20px",
              textAlign:"center", cursor:"pointer",
              background:drag?t.blueSoft:t.bg,
              transition:"all .2s", marginBottom:18,
            }}
          >
            <input ref={fileRef} type="file" style={{ display:"none" }} onChange={e=>{ if(e.target.files[0]) simulateUpload(e.target.files[0].name); }} />
            <div style={{ width:52, height:52, borderRadius:14, background:t.blueSoft, border:`1px solid ${t.blueMid}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <i className="ti ti-cloud-upload" style={{ fontSize:24, color:t.blue }} />
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:t.text, marginBottom:6 }}>
              {drag?"Déposez le fichier ici":"Déposez vos fichiers ici"}
            </div>
            <div style={{ fontSize:12, color:t.muted }}>ou <span style={{ color:t.blue, fontWeight:600 }}>sélectionnez un document</span></div>
            <div style={{ fontSize:11, color:t.muted, marginTop:10 }}>PDF · DOCX · PNG · JPG</div>

            {/* Progress */}
            {progress !== null && !done && (
              <div style={{ marginTop:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:t.sub, marginBottom:6 }}>
                  <span>Chargement…</span>
                  <span>{Math.round(Math.min(progress,100))}%</span>
                </div>
                <div style={{ height:6, background:t.border, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:t.blue, borderRadius:99, width:`${Math.min(progress,100)}%`, transition:"width .1s linear" }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"24px 0 18px", marginBottom:18 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:t.greenSoft, border:`2px solid ${t.green}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
              <i className="ti ti-check" style={{ fontSize:24, color:t.green }} />
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:t.green }}>Fichier chargé avec succès !</div>
          </div>
        )}

        {/* Métadonnées */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Nom du document</label>
            <input type="text" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Ex : Bulletin T1 — Aminata Diallo"
              style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text }}
              onFocus={e=>e.currentTarget.style.borderColor=t.blue}
              onBlur={e=>e.currentTarget.style.borderColor=t.border}
            />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Type</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", fontFamily:t.font, color:t.text }}>
                {Object.keys(docTypes).map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Catégorie</label>
              <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}
                style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", fontFamily:t.font, color:t.text }}>
                {["Élèves","Professeurs","Administration","Paiements"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
          <button onClick={save} disabled={!form.nom} style={{ flex:2, padding:"10px", border:"none", borderRadius:9, background:form.nom?t.blue:"#93c5fd", color:"#fff", fontSize:13, fontWeight:600, cursor:form.nom?"pointer":"default", fontFamily:t.font, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <i className="ti ti-check" style={{ fontSize:14 }} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE PRINCIPALE ────────────────────────────────────────── */
export default function Documents() {
  const [docs,       setDocs]       = useState(DOCS_INIT);
  const [search,     setSearch]     = useState("");
  const [filtreCat,  setFiltreCat]  = useState("Tous");
  const [filtreType, setFiltreType] = useState(null);
  const [tri,        setTri]        = useState("Récent");
  const [vue,        setVue]        = useState("grid");
  const [selected,   setSelected]   = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [toast,      setToast]      = useState(null);
  const [hovered,    setHovered]    = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),2500); };

  const handleUpload = (doc) => {
    setDocs(prev=>[{ id:Date.now(), ...doc }, ...prev]);
    showToast("Document importé avec succès");
  };

  const handleDelete = (id) => {
    setDocs(prev=>prev.filter(d=>d.id!==id));
    if (selected?.id===id) setSelected(null);
    showToast("Document supprimé","error");
  };

  const handleArchive = (id) => {
    setDocs(prev=>prev.map(d=>d.id===id?{...d,status:"Archivé",cat:"Archives"}:d));
    showToast("Document archivé");
  };

  // Filtrage + tri
  let filtered = docs.filter(d=>{
    const ms = d.nom.toLowerCase().includes(search.toLowerCase()) ||
               d.auteur.toLowerCase().includes(search.toLowerCase()) ||
               d.type.toLowerCase().includes(search.toLowerCase());
    const mc = filtreCat==="Tous"     ? true
             : filtreCat==="Archives" ? d.status==="Archivé"
             : d.cat===filtreCat;
    const mt = filtreType ? d.type===filtreType : true;
    return ms && mc && mt;
  });

  filtered = [...filtered].sort((a,b)=>{
    if (tri==="Nom")    return a.nom.localeCompare(b.nom);
    if (tri==="Ancien") return a.id - b.id;
    if (tri==="Taille") return parseFloat(b.taille) - parseFloat(a.taille);
    return b.id - a.id; // Récent
  });

  const totalDocs     = docs.length;
  const docsMois      = docs.filter(d=>d.date.includes("2025")).length;
  const archives      = docs.filter(d=>d.status==="Archivé").length;
  const stockage      = docs.reduce((a,d)=>a+parseFloat(d.taille),0).toFixed(1);

  return (
    <div style={{ fontFamily:t.font, color:t.text }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, background:toast.type==="error"?t.red:t.green, color:"#fff", padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:600, boxShadow:"0 4px 16px rgba(0,0,0,0.15)", display:"flex", alignItems:"center", gap:8 }}>
          <i className={`ti ${toast.type==="error"?"ti-trash":"ti-check"}`} style={{ fontSize:15 }} />
          {toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Documents</h1>
          <p style={{ fontSize:13, color:t.sub, marginTop:4, margin:0 }}>
            Centralisez, recherchez et gérez tous les documents de votre établissement
          </p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <IconBtn icon="ti-upload"      label="Importer"         primary onClick={()=>setShowUpload(true)} />
          <IconBtn icon="ti-file-plus"   label="Créer document"          onClick={()=>setShowUpload(true)} />
          <IconBtn icon="ti-download"    label="Exporter"         small />
        </div>
      </div>

      {/* ── KPI ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:24 }}>
        <StatBox icon="ti-files"      label="Total documents"       value={totalDocs}       c={t.blue}   bg={t.blueSoft}   />
        <StatBox icon="ti-file-plus"  label="Générés ce mois"       value={docsMois}        c={t.green}  bg={t.greenSoft}  sub="Janvier 2025" />
        <StatBox icon="ti-database"   label="Stockage utilisé"      value={`${stockage} MB`} c={t.purple} bg={t.purpleSoft} />
        <StatBox icon="ti-archive"    label="Archivés"              value={archives}        c={t.sub}    bg="#f3f4f6"      />
      </div>

      {/* ── ACCÈS RAPIDE ── */}
      <div style={{ marginBottom:22 }}>
        <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:12 }}>Accès rapide</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {ACCES_RAPIDE.map(a=>(
            <button key={a.label}
              onClick={()=>{ setFiltreType(a.type||null); setFiltreCat(a.cat==="Archives"?"Archives":"Tous"); }}
              style={{
                display:"flex", alignItems:"center", gap:9,
                padding:"10px 16px", border:`1px solid ${filtreType===a.type?a.color:t.border}`,
                borderRadius:t.radiusLg, background:filtreType===a.type?a.bg:t.surface,
                cursor:"pointer", fontFamily:t.font, transition:"all .15s",
                boxShadow:t.shadow,
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a.color;e.currentTarget.style.background=a.bg;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=t.shadowMd}}
              onMouseLeave={e=>{if(filtreType!==a.type){e.currentTarget.style.borderColor=t.border;e.currentTarget.style.background=t.surface;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=t.shadow}}}
            >
              <div style={{ width:32, height:32, borderRadius:9, background:a.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className={`ti ${a.icon}`} style={{ fontSize:16, color:a.color }} />
              </div>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{a.label}</div>
                <div style={{ fontSize:10, color:t.muted }}>{a.count} fichiers</div>
              </div>
            </button>
          ))}
          {(filtreType||filtreCat!=="Tous") && (
            <button onClick={()=>{setFiltreType(null);setFiltreCat("Tous");}}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 14px", border:`1px solid ${t.border}`, borderRadius:t.radiusLg, background:t.surface, cursor:"pointer", fontFamily:t.font, fontSize:12, color:t.muted, boxShadow:t.shadow }}>
              <i className="ti ti-x" style={{ fontSize:13 }} /> Effacer
            </button>
          )}
        </div>
      </div>

      {/* ── BARRE D'OUTILS ── */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        {/* Recherche */}
        <div style={{ position:"relative", flex:"1 1 220px", minWidth:0 }}>
          <i className="ti ti-search" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:t.muted, fontSize:15 }} />
          <input type="text" placeholder="Rechercher un document, un auteur…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", padding:"10px 12px 10px 36px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text, background:t.surface, boxShadow:t.shadow }}
            onFocus={e=>e.currentTarget.style.borderColor=t.blue}
            onBlur={e=>e.currentTarget.style.borderColor=t.border}
          />
        </div>

        {/* Filtres catégorie */}
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setFiltreCat(c)} style={{
              padding:"8px 13px", border:`1px solid ${filtreCat===c?t.blue:t.border}`,
              borderRadius:t.radius, background:filtreCat===c?t.blueSoft:t.surface,
              color:filtreCat===c?t.blue:t.sub, fontSize:12, fontWeight:filtreCat===c?600:400,
              cursor:"pointer", fontFamily:t.font, transition:"all .15s",
            }}>{c}</button>
          ))}
        </div>

        {/* Tri */}
        <select value={tri} onChange={e=>setTri(e.target.value)}
          style={{ padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, fontFamily:t.font, outline:"none", background:t.surface, cursor:"pointer", color:t.text, boxShadow:t.shadow }}>
          {TRIS.map(s=><option key={s}>{s}</option>)}
        </select>

        {/* Vue */}
        <div style={{ display:"flex", background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:3, boxShadow:t.shadow, flexShrink:0 }}>
          {[{v:"grid",icon:"ti-layout-grid"},{v:"list",icon:"ti-list"}].map(x=>(
            <button key={x.v} onClick={()=>setVue(x.v)} style={{ width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",border:"none",borderRadius:8,cursor:"pointer",background:vue===x.v?t.blue:"transparent",color:vue===x.v?"#fff":t.muted,transition:"all .15s" }}>
              <i className={`ti ${x.icon}`} style={{ fontSize:15 }} />
            </button>
          ))}
        </div>
      </div>

      {/* ── RÉSULTATS ── */}
      <div style={{ fontSize:12, color:t.muted, marginBottom:12, fontWeight:500 }}>
        {filtered.length} document{filtered.length!==1?"s":""} {search||filtreCat!=="Tous"||filtreType?"trouvé"+( filtered.length!==1?"s":""):"au total"}
      </div>

      {/* ── VUE GRID ── */}
      {vue==="grid" && (
        filtered.length===0 ? (
          <div style={{ padding:64, textAlign:"center", color:t.muted }}>
            <i className="ti ti-files" style={{ fontSize:36, display:"block", marginBottom:12, color:t.border }} />
            <div style={{ fontSize:15, fontWeight:600, color:t.sub, marginBottom:6 }}>Aucun document trouvé</div>
            <div style={{ fontSize:13 }}>Modifiez vos filtres ou importez un document</div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
            {filtered.map(doc=>{
              const dt = getDocType(doc.type);
              const bi = badgeInfo(doc.status);
              const isHov = hovered===doc.id;
              return (
                <div key={doc.id}
                  onMouseEnter={()=>setHovered(doc.id)}
                  onMouseLeave={()=>setHovered(null)}
                  style={{ background:t.surface, border:`1px solid ${isHov?dt.color+"44":t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:isHov?t.shadowMd:t.shadow, transition:"all .2s", transform:isHov?"translateY(-3px)":"translateY(0)", cursor:"pointer" }}
                >
                  {/* Top coloré */}
                  <div onClick={()=>setSelected(doc)} style={{ height:4, background:dt.color }} />

                  <div style={{ padding:"16px 16px 12px" }}>
                    {/* Icône + badge */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:dt.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <i className={`ti ${dt.icon}`} style={{ fontSize:22, color:dt.color }} />
                      </div>
                      <Chip label={doc.status} c={bi.c} bg={bi.bg} small />
                    </div>

                    {/* Nom */}
                    <div onClick={()=>setSelected(doc)} style={{ fontSize:13, fontWeight:700, color:t.text, marginBottom:6, lineHeight:1.4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {doc.nom}
                    </div>

                    {/* Meta */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                      <Chip label={doc.type} c={dt.color} bg={dt.bg} small />
                      <Chip label={doc.cat}  c={t.sub}    bg="#f3f4f6" small />
                    </div>

                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:t.muted, borderTop:`1px solid ${t.border}`, paddingTop:10 }}>
                      <span>{doc.date}</span>
                      <span>{doc.taille}</span>
                    </div>
                  </div>

                  {/* Actions hover */}
                  <div style={{ padding:"0 12px 12px", display:"flex", gap:6, opacity:isHov?1:0, transition:"opacity .15s" }}>
                    <button onClick={()=>setSelected(doc)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"6px 0", border:`1px solid ${t.border}`, borderRadius:8, background:t.bg, fontSize:11, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font }}>
                      <i className="ti ti-eye" style={{ fontSize:12 }} /> Voir
                    </button>
                    <button onClick={()=>showToast("Téléchargement...")} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"6px 0", border:`1px solid ${t.blueMid}`, borderRadius:8, background:t.blueSoft, fontSize:11, fontWeight:600, cursor:"pointer", color:t.blue, fontFamily:t.font }}>
                      <i className="ti ti-download" style={{ fontSize:12 }} /> DL
                    </button>
                    <button onClick={()=>handleArchive(doc.id)} style={{ padding:"6px 8px", border:`1px solid ${t.border}`, borderRadius:8, background:t.surface, fontSize:11, cursor:"pointer", color:t.muted, fontFamily:t.font }}>
                      <i className="ti ti-archive" style={{ fontSize:12 }} />
                    </button>
                    <button onClick={()=>handleDelete(doc.id)} style={{ padding:"6px 8px", border:`1px solid #fecaca`, borderRadius:8, background:"#fef2f2", fontSize:11, cursor:"pointer", color:t.red, fontFamily:t.font }}>
                      <i className="ti ti-trash" style={{ fontSize:12 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── VUE LISTE ── */}
      {vue==="list" && (
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:560 }}>
              <thead>
                <tr style={{ background:t.bg }}>
                  {["Document","Type","Catégorie","Auteur","Date","Taille","Statut",""].map(h=>(
                    <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:t.muted, textTransform:"uppercase", letterSpacing:".4px", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0 ? (
                  <tr><td colSpan={8} style={{ padding:48, textAlign:"center", color:t.muted, fontSize:13 }}>
                    <i className="ti ti-files" style={{ fontSize:28, display:"block", marginBottom:8, color:t.border }} />
                    Aucun document trouvé
                  </td></tr>
                ) : filtered.map(doc=>{
                  const dt = getDocType(doc.type);
                  const bi = badgeInfo(doc.status);
                  return (
                    <tr key={doc.id} style={{ borderBottom:`1px solid ${t.border}`, transition:"background .12s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{ padding:"12px 14px", cursor:"pointer" }} onClick={()=>setSelected(doc)}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:9, background:dt.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <i className={`ti ${dt.icon}`} style={{ fontSize:16, color:dt.color }} />
                          </div>
                          <span style={{ fontSize:13, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>{doc.nom}</span>
                        </div>
                      </td>
                      <td style={{ padding:"12px 14px" }}><Chip label={doc.type} c={dt.color} bg={dt.bg} small /></td>
                      <td style={{ padding:"12px 14px" }}><Chip label={doc.cat}  c={t.sub}    bg="#f3f4f6" small /></td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:t.sub, whiteSpace:"nowrap" }}>{doc.auteur}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:t.sub, whiteSpace:"nowrap" }}>{doc.date}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:t.sub }}>{doc.taille}</td>
                      <td style={{ padding:"12px 14px" }}><Chip label={doc.status} c={bi.c} bg={bi.bg} small /></td>
                      <td style={{ padding:"12px 10px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <button onClick={()=>setSelected(doc)} style={{ padding:"4px 8px", border:`1px solid ${t.border}`, borderRadius:6, background:t.surface, fontSize:11, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font }}>
                            <i className="ti ti-eye" style={{ fontSize:12 }} />
                          </button>
                          <button onClick={()=>showToast("Téléchargement...")} style={{ padding:"4px 8px", border:`1px solid ${t.blueMid}`, borderRadius:6, background:t.blueSoft, fontSize:11, cursor:"pointer", color:t.blue, fontFamily:t.font }}>
                            <i className="ti ti-download" style={{ fontSize:12 }} />
                          </button>
                          <button onClick={()=>handleDelete(doc.id)} style={{ padding:"4px 8px", border:"1px solid #fecaca", borderRadius:6, background:"#fef2f2", fontSize:11, cursor:"pointer", color:t.red, fontFamily:t.font }}>
                            <i className="ti ti-trash" style={{ fontSize:12 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length>0 && (
            <div style={{ padding:"10px 16px", borderTop:`1px solid ${t.border}`, background:t.bg, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:t.muted }}>{filtered.length} document{filtered.length!==1?"s":""}</span>
              <span style={{ fontSize:12, color:t.blue, fontWeight:500, cursor:"pointer" }}>Tout exporter →</span>
            </div>
          )}
        </div>
      )}

      {/* DRAWER PREVIEW */}
      {selected && <DocDrawer doc={selected} onClose={()=>setSelected(null)} />}

      {/* MODAL UPLOAD */}
      {showUpload && <UploadModal onClose={()=>setShowUpload(false)} onUpload={handleUpload} />}
    </div>
  );
}