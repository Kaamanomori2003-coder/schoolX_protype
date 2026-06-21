import { useState } from "react";

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
  orange:"#ea580c", orangeSoft:"#fff7ed",
  radius:"10px", radiusLg:"14px", radiusXl:"18px",
  shadow:"0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
  shadowLg:"0 12px 32px rgba(0,0,0,0.1)",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── CONFIG TYPES ───────────────────────────────────────────── */
const TYPES = {
  "Information":  { color:t.blue,   bg:t.blueSoft,   icon:"ti-info-circle",      border:t.blueMid   },
  "Urgence":      { color:t.red,    bg:t.redSoft,    icon:"ti-alert-triangle",   border:"#fecaca"   },
  "Évènement":    { color:t.purple, bg:t.purpleSoft, icon:"ti-calendar-event",   border:"#ddd6fe"   },
  "Réunion":      { color:t.amber,  bg:t.amberSoft,  icon:"ti-users",            border:"#fde68a"   },
  "Académique":   { color:t.green,  bg:t.greenSoft,  icon:"ti-book",             border:"#bbf7d0"   },
  "Administratif":{ color:t.cyan,   bg:t.cyanSoft,   icon:"ti-building",         border:"#a5f3fc"   },
};

const STATUTS = {
  "Publié":    { color:t.green,  bg:t.greenSoft  },
  "Programmé": { color:t.blue,   bg:t.blueSoft   },
  "Brouillon": { color:t.amber,  bg:t.amberSoft  },
  "Archivé":   { color:t.muted,  bg:"#f3f4f6"    },
  "Urgent":    { color:t.red,    bg:t.redSoft    },
};

const AUDIENCES = ["Élèves","Professeurs","Parents","Administration","Tous"];

/* ─── DATA ───────────────────────────────────────────────────── */
const INIT_ANNONCES = [
  {
    id:1, titre:"Réunion parents-professeurs — Trimestre 1",
    contenu:"Chers parents, nous avons le plaisir de vous convier à la réunion parents-professeurs du 1er trimestre qui se tiendra le vendredi 17 janvier 2025 à 16h00 dans la salle des fêtes. Votre présence est fortement souhaitée afin d'échanger sur les résultats de vos enfants.",
    type:"Réunion", statut:"Publié", audience:["Parents"],
    auteur:"M. le Directeur", date:"15/01/2025", heure:"09:00",
    canaux:["Notification","Email"], destinataires:312, lus:248, urgent:false,
    image:null, programmePour:null,
  },
  {
    id:2, titre:"⚠️ Fermeture exceptionnelle — Jeudi 23 janvier",
    contenu:"En raison d'une coupure d'électricité programmée par la EDG, l'établissement sera fermé exceptionnellement le jeudi 23 janvier 2025. Les cours reprendront normalement le vendredi 24 janvier. Veuillez en informer vos enfants.",
    type:"Urgence", statut:"Urgent", audience:["Élèves","Parents","Professeurs"],
    auteur:"M. le Directeur", date:"20/01/2025", heure:"07:30",
    canaux:["Notification","SMS","Email"], destinataires:580, lus:521, urgent:true,
    image:null, programmePour:null,
  },
  {
    id:3, titre:"Résultats du 1er Trimestre disponibles",
    contenu:"Les bulletins du 1er trimestre 2024/2025 sont désormais disponibles. Les parents peuvent venir les récupérer auprès du secrétariat du lundi au vendredi de 08h00 à 15h00. Merci de vous munir de votre pièce d'identité.",
    type:"Académique", statut:"Publié", audience:["Parents","Élèves"],
    auteur:"M. le Directeur", date:"18/01/2025", heure:"10:00",
    canaux:["Notification","Email"], destinataires:425, lus:380, urgent:false,
    image:null, programmePour:null,
  },
  {
    id:4, titre:"Concours de mathématiques — Inscriptions ouvertes",
    contenu:"L'établissement organise un concours interne de mathématiques pour les classes de Terminale et 1ère. Les inscriptions sont ouvertes jusqu'au 30 janvier. Parlez-en à votre professeur de maths pour vous inscrire.",
    type:"Évènement", statut:"Publié", audience:["Élèves"],
    auteur:"M. le Directeur", date:"17/01/2025", heure:"11:00",
    canaux:["Notification"], destinataires:180, lus:145, urgent:false,
    image:null, programmePour:null,
  },
  {
    id:5, titre:"Réunion des professeurs — Bilan pédagogique",
    contenu:"Tous les professeurs sont convoqués pour une réunion pédagogique le mercredi 22 janvier 2025 à 14h00 dans la salle de conférence. Ordre du jour : bilan T1, préparation T2, nouvelles directives.",
    type:"Réunion", statut:"Programmé", audience:["Professeurs"],
    auteur:"M. le Directeur", date:"22/01/2025", heure:"14:00",
    canaux:["Notification","Email"], destinataires:87, lus:0, urgent:false,
    image:null, programmePour:"22/01/2025 à 14h00",
  },
  {
    id:6, titre:"Mise à jour règlement intérieur 2025",
    contenu:"Le règlement intérieur de l'établissement a été mis à jour pour l'année 2025. Un exemplaire sera distribué à chaque élève. Les parents doivent signer le reçu et le retourner avant le 31 janvier.",
    type:"Administratif", statut:"Brouillon", audience:["Élèves","Parents"],
    auteur:"Secrétariat", date:"19/01/2025", heure:"08:30",
    canaux:["Email"], destinataires:0, lus:0, urgent:false,
    image:null, programmePour:null,
  },
  {
    id:7, titre:"Journée sportive — Samedi 1er février",
    contenu:"Une journée sportive est organisée le samedi 1er février 2025. Toutes les classes participeront aux épreuves d'athlétisme, football et volleyball. Les élèves doivent venir en tenue de sport.",
    type:"Évènement", statut:"Publié", audience:["Élèves","Parents"],
    auteur:"M. le Directeur", date:"16/01/2025", heure:"15:00",
    canaux:["Notification","SMS"], destinataires:500, lus:412, urgent:false,
    image:null, programmePour:null,
  },
  {
    id:8, titre:"Rappel : Frais de scolarité T2",
    contenu:"Nous rappelons à tous les parents que les frais de scolarité du 2ème trimestre sont à régler avant le 15 février 2025. Passé ce délai, des pénalités de retard seront appliquées.",
    type:"Information", statut:"Archivé", audience:["Parents"],
    auteur:"Comptabilité", date:"10/01/2025", heure:"08:00",
    canaux:["Email","SMS"], destinataires:312, lus:289, urgent:false,
    image:null, programmePour:null,
  },
];

const ACCES_RAPIDE = [
  { label:"Urgentes",       filtre:"Urgence",      icon:"ti-alert-triangle",  color:t.red,    bg:t.redSoft    },
  { label:"Réunions",       filtre:"Réunion",      icon:"ti-users",           color:t.amber,  bg:t.amberSoft  },
  { label:"Évènements",     filtre:"Évènement",    icon:"ti-calendar-event",  color:t.purple, bg:t.purpleSoft },
  { label:"Parents",        filtre:"_Parents",     icon:"ti-home",            color:t.green,  bg:t.greenSoft  },
  { label:"Académiques",    filtre:"Académique",   icon:"ti-book",            color:t.cyan,   bg:t.cyanSoft   },
  { label:"Archives",       filtre:"_Archives",    icon:"ti-archive",         color:t.muted,  bg:"#f3f4f6"    },
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
    <div style={{ width:40, height:40, borderRadius:11, background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
      <i className={`ti ${icon}`} style={{ fontSize:19, color:c }} />
    </div>
    <div style={{ fontSize:26, fontWeight:800, color:t.text, lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:12, color:t.sub, marginTop:5, fontWeight:500 }}>{label}</div>
    {sub && <div style={{ fontSize:11, color:t.muted, marginTop:3 }}>{sub}</div>}
  </div>
);

const IconBtn = ({ icon, label, primary, small, danger, onClick }) => (
  <button onClick={onClick} style={{
    display:"flex", alignItems:"center", gap:6,
    padding:small?"6px 12px":"9px 16px",
    border: primary?"none":danger?`1px solid #fecaca`:`1px solid ${t.border}`,
    borderRadius:t.radius, cursor:"pointer", fontFamily:t.font,
    fontSize:small?12:13, fontWeight:600,
    background:primary?t.blue:danger?t.redSoft:t.surface,
    color:primary?"#fff":danger?t.red:t.sub,
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

/* ─── DRAWER DÉTAIL ──────────────────────────────────────────── */
function AnnonceDrawer({ annonce, onClose, onEdit, onArchive }) {
  if (!annonce) return null;
  const tp = TYPES[annonce.type]   || TYPES["Information"];
  const st = STATUTS[annonce.statut] || STATUTS["Publié"];
  const tauxLecture = annonce.destinataires > 0
    ? Math.round((annonce.lus / annonce.destinataires) * 100)
    : 0;

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.2)", zIndex:300 }} />
      <div style={{
        position:"fixed", top:0, right:0, bottom:0, width:"min(460px,94vw)",
        background:t.surface, borderLeft:`1px solid ${t.border}`,
        boxShadow:"-8px 0 32px rgba(0,0,0,0.1)", zIndex:400,
        display:"flex", flexDirection:"column", fontFamily:t.font,
        animation:"slideIn .22s ease",
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"flex-start", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:11, background:tp.bg, border:`1px solid ${tp.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <i className={`ti ${tp.icon}`} style={{ fontSize:20, color:tp.color }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:700, color:t.text, lineHeight:1.3 }}>{annonce.titre}</div>
            <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
              <Chip label={annonce.type}   c={tp.color} bg={tp.bg} small />
              <Chip label={annonce.statut} c={st.color} bg={st.bg} small />
            </div>
          </div>
          <button onClick={onClose} style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub, flexShrink:0 }}>
            <i className="ti ti-x" style={{ fontSize:15 }} />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 20px" }}>

          {/* Contenu annonce */}
          <div style={{ background:t.bg, borderRadius:t.radiusLg, padding:"16px 18px", marginBottom:18, border:`1px solid ${t.border}`, lineHeight:1.7, fontSize:13, color:t.sub }}>
            {annonce.contenu}
          </div>

          {/* Statistiques */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:10 }}>Statistiques</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { icon:"ti-users",      label:"Destinataires", value:annonce.destinataires, c:t.blue,  bg:t.blueSoft  },
                { icon:"ti-eye",        label:"Lus",           value:annonce.lus,           c:t.green, bg:t.greenSoft },
                { icon:"ti-percentage", label:"Taux lecture",  value:`${tauxLecture}%`,     c:t.purple,bg:t.purpleSoft},
              ].map(s=>(
                <div key={s.label} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:"12px 10px", textAlign:"center" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px" }}>
                    <i className={`ti ${s.icon}`} style={{ fontSize:15, color:s.c }} />
                  </div>
                  <div style={{ fontSize:17, fontWeight:700, color:t.text }}>{s.value}</div>
                  <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Barre de lecture */}
            {annonce.destinataires > 0 && (
              <div style={{ marginTop:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:t.sub, marginBottom:6 }}>
                  <span>Taux de lecture</span>
                  <span style={{ fontWeight:700, color:tauxLecture>=80?t.green:tauxLecture>=50?t.amber:t.red }}>{tauxLecture}%</span>
                </div>
                <div style={{ height:6, background:t.border, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:tauxLecture>=80?t.green:tauxLecture>=50?t.amber:t.red, borderRadius:99, width:`${tauxLecture}%`, transition:"width .6s ease" }} />
                </div>
              </div>
            )}
          </div>

          {/* Infos */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:10 }}>Informations</div>
            {[
              { icon:"ti-user",        label:"Auteur",     val:annonce.auteur },
              { icon:"ti-calendar",    label:"Date",       val:`${annonce.date} à ${annonce.heure}` },
              { icon:"ti-users",       label:"Audience",   val:annonce.audience.join(", ") },
              { icon:"ti-send",        label:"Canaux",     val:annonce.canaux.join(", ") },
              ...(annonce.programmePour?[{ icon:"ti-clock", label:"Programmé", val:annonce.programmePour }]:[]),
            ].map(r=>(
              <div key={r.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${t.border}` }}>
                <i className={`ti ${r.icon}`} style={{ fontSize:14, color:t.muted, width:16, flexShrink:0 }} />
                <span style={{ fontSize:12, color:t.muted, width:80, flexShrink:0 }}>{r.label}</span>
                <span style={{ fontSize:13, color:t.text, fontWeight:500 }}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Historique */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:10 }}>Historique</div>
            {[
              { action:"Créée",   date:annonce.date,    actor:annonce.auteur,     icon:"ti-pencil"  },
              ...(annonce.statut!=="Brouillon"?[{ action:"Publiée", date:annonce.date, actor:annonce.auteur, icon:"ti-send" }]:[]),
            ].map((h,i)=>(
              <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:t.blueSoft, border:`1px solid ${t.blueMid}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={`ti ${h.icon}`} style={{ fontSize:11, color:t.blue }} />
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:t.text }}>{h.action} par {h.actor}</div>
                  <div style={{ fontSize:11, color:t.muted, marginTop:1 }}>{h.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding:"14px 20px", borderTop:`1px solid ${t.border}`, display:"flex", flexWrap:"wrap", gap:8 }}>
          <IconBtn icon="ti-edit"    label="Modifier"  primary onClick={()=>onEdit(annonce)} />
          <IconBtn icon="ti-send"    label="Publier"   small   onClick={()=>{}} />
          <IconBtn icon="ti-archive" label="Archiver"  small   onClick={()=>onArchive(annonce.id)} />
        </div>
      </div>
    </>
  );
}

/* ─── MODAL CRÉATION ─────────────────────────────────────────── */
function AnnonceModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ? {
    titre:   initial.titre,
    contenu: initial.contenu,
    type:    initial.type,
    audience:initial.audience,
    canaux:  initial.canaux,
    publierMaintenant: initial.statut==="Publié",
    programmePour: initial.programmePour||"",
  } : {
    titre:"", contenu:"",
    type:"Information", audience:["Tous"],
    canaux:["Notification"],
    publierMaintenant:true, programmePour:"",
  });

  const toggleArr = (arr, val) =>
    arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val];

  const valid = form.titre.trim() && form.contenu.trim();

  const handleSave = (brouillon=false) => {
    if (!valid && !brouillon) return;
    onSave({ ...form, statut: brouillon?"Brouillon": form.publierMaintenant?"Publié":"Programmé" });
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, fontFamily:t.font }}>
      <div style={{ background:t.surface, borderRadius:20, padding:28, width:"min(580px,95vw)", boxShadow:"0 24px 64px rgba(0,0,0,0.18)", maxHeight:"90vh", overflowY:"auto" }}>

        {/* Header modal */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:t.text }}>{initial?"Modifier l'annonce":"Nouvelle annonce"}</h3>
            <p style={{ margin:0, fontSize:12, color:t.muted, marginTop:3 }}>Remplissez les informations ci-dessous</p>
          </div>
          <button onClick={onClose} style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub }}>
            <i className="ti ti-x" style={{ fontSize:15 }} />
          </button>
        </div>

        {/* Titre */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Titre *</label>
          <input type="text" placeholder="Ex : Réunion parents-professeurs — Trimestre 1" value={form.titre} onChange={e=>setForm({...form,titre:e.target.value})}
            style={{ width:"100%", padding:"10px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:14, fontWeight:500, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text }}
            onFocus={e=>e.currentTarget.style.borderColor=t.blue}
            onBlur={e=>e.currentTarget.style.borderColor=t.border}
          />
        </div>

        {/* Contenu */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Contenu *</label>
          <textarea placeholder="Rédigez le contenu de votre annonce ici…" value={form.contenu} onChange={e=>setForm({...form,contenu:e.target.value})} rows={5}
            style={{ width:"100%", padding:"10px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text, resize:"vertical", lineHeight:1.6 }}
            onFocus={e=>e.currentTarget.style.borderColor=t.blue}
            onBlur={e=>e.currentTarget.style.borderColor=t.border}
          />
        </div>

        {/* Type */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:8 }}>Type</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {Object.entries(TYPES).map(([key, tp])=>(
              <button key={key} onClick={()=>setForm({...form,type:key})} style={{
                display:"flex", alignItems:"center", gap:6, padding:"7px 13px",
                border:`1.5px solid ${form.type===key?tp.color:t.border}`,
                borderRadius:t.radius, background:form.type===key?tp.bg:t.surface,
                color:form.type===key?tp.color:t.sub, fontSize:12, fontWeight:600,
                cursor:"pointer", fontFamily:t.font, transition:"all .15s",
              }}>
                <i className={`ti ${tp.icon}`} style={{ fontSize:13 }} />
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:8 }}>Audience</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {AUDIENCES.map(a=>{
              const sel = form.audience.includes(a);
              return (
                <button key={a} onClick={()=>setForm({...form,audience:toggleArr(form.audience,a)})} style={{
                  padding:"7px 13px", border:`1.5px solid ${sel?t.blue:t.border}`,
                  borderRadius:t.radius, background:sel?t.blueSoft:t.surface,
                  color:sel?t.blue:t.sub, fontSize:12, fontWeight:sel?600:400,
                  cursor:"pointer", fontFamily:t.font, transition:"all .15s",
                }}>{a}</button>
              );
            })}
          </div>
        </div>

        {/* Canaux */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:8 }}>Canaux de diffusion</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[
              { key:"Notification", icon:"ti-bell"   },
              { key:"Email",        icon:"ti-mail"   },
              { key:"SMS",          icon:"ti-message"},
            ].map(c=>{
              const sel = form.canaux.includes(c.key);
              return (
                <button key={c.key} onClick={()=>setForm({...form,canaux:toggleArr(form.canaux,c.key)})} style={{
                  display:"flex", alignItems:"center", gap:7, padding:"8px 14px",
                  border:`1.5px solid ${sel?t.green:t.border}`,
                  borderRadius:t.radius, background:sel?t.greenSoft:t.surface,
                  color:sel?t.green:t.sub, fontSize:12, fontWeight:sel?600:400,
                  cursor:"pointer", fontFamily:t.font, transition:"all .15s",
                }}>
                  <i className={`ti ${c.icon}`} style={{ fontSize:13 }} />
                  {c.key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Options */}
        <div style={{ background:t.bg, borderRadius:t.radius, padding:"12px 14px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:500, color:t.text }}>Publier immédiatement</div>
              <div style={{ fontSize:11, color:t.muted, marginTop:1 }}>L'annonce sera visible dès maintenant</div>
            </div>
            <button onClick={()=>setForm({...form,publierMaintenant:!form.publierMaintenant})} style={{ width:40, height:22, borderRadius:99, border:"none", cursor:"pointer", background:form.publierMaintenant?t.blue:t.border, position:"relative", transition:"background .2s" }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:form.publierMaintenant?21:3, transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>
          {!form.publierMaintenant && (
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Programmer pour</label>
              <input type="datetime-local" value={form.programmePour} onChange={e=>setForm({...form,programmePour:e.target.value})}
                style={{ width:"100%", padding:"8px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text }}
                onFocus={e=>e.currentTarget.style.borderColor=t.blue}
                onBlur={e=>e.currentTarget.style.borderColor=t.border}
              />
            </div>
          )}
        </div>

        {/* Pièces jointes */}
        <div style={{ border:`1.5px dashed ${t.border}`, borderRadius:t.radiusLg, padding:"16px", textAlign:"center", marginBottom:20, cursor:"pointer", transition:"border .15s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=t.blue}
          onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}
        >
          <i className="ti ti-paperclip" style={{ fontSize:20, color:t.muted, display:"block", marginBottom:6 }} />
          <div style={{ fontSize:12, color:t.sub, fontWeight:500 }}>Ajouter une image ou un document</div>
          <div style={{ fontSize:11, color:t.muted, marginTop:3 }}>PDF, PNG, JPG — max 10 MB</div>
        </div>

        {/* Boutons */}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ padding:"10px 16px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
          <button onClick={()=>handleSave(true)} style={{ padding:"10px 16px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font }}>
            <i className="ti ti-device-floppy" style={{ fontSize:13, marginRight:5 }} />Brouillon
          </button>
          <button onClick={()=>handleSave(false)} disabled={!valid} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:valid?t.blue:"#93c5fd", color:"#fff", fontSize:13, fontWeight:600, cursor:valid?"pointer":"default", fontFamily:t.font, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <i className="ti ti-send" style={{ fontSize:14 }} />
            {form.publierMaintenant?"Publier maintenant":"Programmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE PRINCIPALE ────────────────────────────────────────── */
export default function Annonces() {
  const [annonces,    setAnnonces]    = useState(INIT_ANNONCES);
  const [search,      setSearch]      = useState("");
  const [filtreAud,   setFiltreAud]   = useState("Tous");
  const [filtreStatut,setFiltreStatut]= useState("Tous");
  const [filtreType,  setFiltreType]  = useState(null);
  const [tri,         setTri]         = useState("Récent");
  const [vue,         setVue]         = useState("cartes");
  const [selected,    setSelected]    = useState(null);
  const [modal,       setModal]       = useState(false);
  const [editAnn,     setEditAnn]     = useState(null);
  const [hovered,     setHovered]     = useState(null);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),2500); };

  const handleSave = (form) => {
    if (editAnn) {
      setAnnonces(prev=>prev.map(a=>a.id===editAnn.id?{...a,...form,audience:form.audience,canaux:form.canaux}:a));
      showToast("Annonce modifiée");
    } else {
      setAnnonces(prev=>[{
        id:Date.now(), ...form,
        auteur:"M. le Directeur",
        date:new Date().toLocaleDateString("fr-FR"),
        heure:new Date().toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"}),
        destinataires:0, lus:0, urgent:form.type==="Urgence",
        image:null,
      },...prev]);
      showToast(form.statut==="Brouillon"?"Brouillon sauvegardé":"Annonce publiée !");
    }
    setEditAnn(null);
  };

  const handleArchive = (id) => {
    setAnnonces(prev=>prev.map(a=>a.id===id?{...a,statut:"Archivé"}:a));
    setSelected(null);
    showToast("Annonce archivée");
  };

  const handleDelete = (id) => {
    setAnnonces(prev=>prev.filter(a=>a.id!==id));
    setSelected(null);
    showToast("Annonce supprimée","error");
  };

  const openEdit = (a) => { setEditAnn(a); setModal(true); setSelected(null); };

  // Filtrage
  let filtered = annonces.filter(a=>{
    const ms  = a.titre.toLowerCase().includes(search.toLowerCase()) || a.contenu.toLowerCase().includes(search.toLowerCase());
    const mau = filtreAud==="Tous"    || a.audience.includes(filtreAud);
    const mst = filtreStatut==="Tous" || a.statut===filtreStatut;
    const mtp = !filtreType
      ? true
      : filtreType==="Urgence"
      ? a.type==="Urgence"||a.statut==="Urgent"
      : filtreType==="Archives"||filtreType==="_Archives"
      ? a.statut==="Archivé"
      : filtreType==="_Parents"
      ? a.audience.includes("Parents")
      : a.type===filtreType;
    return ms&&mau&&mst&&mtp;
  });

  filtered = [...filtered].sort((a,b)=>{
    if (tri==="Ancien")    return a.id-b.id;
    if (tri==="Priorité")  return (b.urgent?1:0)-(a.urgent?1:0);
    return b.id-a.id;
  });

  // KPI
  const total      = annonces.length;
  const publiees   = annonces.filter(a=>a.statut==="Publié"||a.statut==="Urgent").length;
  const programmees= annonces.filter(a=>a.statut==="Programmé").length;
  const totalDest  = annonces.reduce((s,a)=>s+a.destinataires,0);
  const totalLus   = annonces.reduce((s,a)=>s+a.lus,0);
  const tauxGlobal = totalDest>0 ? Math.round((totalLus/totalDest)*100) : 0;

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
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Annonces</h1>
          <p style={{ fontSize:13, color:t.sub, marginTop:4, margin:0 }}>
            Diffusez les informations importantes de votre établissement
          </p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <IconBtn icon="ti-plus"     label="Nouvelle annonce" primary onClick={()=>{setEditAnn(null);setModal(true);}} />
          <IconBtn icon="ti-history"  label="Historique"              onClick={()=>setFiltreStatut("Archivé")} />
          <IconBtn icon="ti-template" label="Modèles"          small  onClick={()=>{}} />
        </div>
      </div>

      {/* ── KPI ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:24 }}>
        <StatBox icon="ti-speakerphone" label="Total annonces"      value={total}                c={t.blue}   bg={t.blueSoft}   />
        <StatBox icon="ti-send"         label="Publiées"             value={publiees}             c={t.green}  bg={t.greenSoft}  sub="Dont urgentes" />
        <StatBox icon="ti-clock"        label="Programmées"          value={programmees}          c={t.amber}  bg={t.amberSoft}  />
        <StatBox icon="ti-chart-bar"    label="Taux de lecture"      value={`${tauxGlobal}%`}    c={t.purple} bg={t.purpleSoft} sub={`${totalLus}/${totalDest} destinataires`} />
      </div>

      {/* ── ACCÈS RAPIDE ── */}
      <div style={{ marginBottom:22 }}>
        <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".5px", marginBottom:12 }}>Accès rapide</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {ACCES_RAPIDE.map(a=>{
            const actif = filtreType===a.filtre;
            return (
              <button key={a.label}
                onClick={()=>setFiltreType(actif?null:a.filtre)}
                style={{
                  display:"flex", alignItems:"center", gap:9, padding:"10px 16px",
                  border:`1px solid ${actif?a.color:t.border}`,
                  borderRadius:t.radiusLg, background:actif?a.bg:t.surface,
                  cursor:"pointer", fontFamily:t.font, transition:"all .15s", boxShadow:t.shadow,
                }}
                onMouseEnter={e=>{if(!actif){e.currentTarget.style.borderColor=a.color;e.currentTarget.style.background=a.bg;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=t.shadowMd;}}}
                onMouseLeave={e=>{if(!actif){e.currentTarget.style.borderColor=t.border;e.currentTarget.style.background=t.surface;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=t.shadow;}}}
              >
                <div style={{ width:32, height:32, borderRadius:9, background:a.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className={`ti ${a.icon}`} style={{ fontSize:16, color:a.color }} />
                </div>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{a.label}</div>
                  <div style={{ fontSize:10, color:t.muted }}>
                    {annonces.filter(ann=> a.filtre==="Urgence"?ann.type==="Urgence":a.filtre==="_Archives"?ann.statut==="Archivé":a.filtre==="_Parents"?ann.audience.includes("Parents"):ann.type===a.filtre).length} annonces
                  </div>
                </div>
              </button>
            );
          })}
          {(filtreType) && (
            <button onClick={()=>setFiltreType(null)} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 14px", border:`1px solid ${t.border}`, borderRadius:t.radiusLg, background:t.surface, cursor:"pointer", fontFamily:t.font, fontSize:12, color:t.muted, boxShadow:t.shadow }}>
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
          <input type="text" placeholder="Rechercher une annonce…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", padding:"10px 12px 10px 36px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text, background:t.surface, boxShadow:t.shadow }}
            onFocus={e=>e.currentTarget.style.borderColor=t.blue}
            onBlur={e=>e.currentTarget.style.borderColor=t.border}
          />
        </div>

        {/* Audience */}
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {["Tous","Parents","Professeurs","Élèves","Administration"].map(f=>(
            <button key={f} onClick={()=>setFiltreAud(f)} style={{ padding:"8px 12px", border:`1px solid ${filtreAud===f?t.blue:t.border}`, borderRadius:t.radius, background:filtreAud===f?t.blueSoft:t.surface, color:filtreAud===f?t.blue:t.sub, fontSize:12, fontWeight:filtreAud===f?600:400, cursor:"pointer", fontFamily:t.font, transition:"all .15s" }}>{f}</button>
          ))}
        </div>

        {/* Statut */}
        <select value={filtreStatut} onChange={e=>setFiltreStatut(e.target.value)}
          style={{ padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, fontFamily:t.font, outline:"none", background:t.surface, cursor:"pointer", color:t.text, boxShadow:t.shadow }}>
          {["Tous","Publié","Programmé","Brouillon","Archivé"].map(s=><option key={s}>{s}</option>)}
        </select>

        {/* Tri */}
        <select value={tri} onChange={e=>setTri(e.target.value)}
          style={{ padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, fontFamily:t.font, outline:"none", background:t.surface, cursor:"pointer", color:t.text, boxShadow:t.shadow }}>
          {["Récent","Ancien","Priorité"].map(s=><option key={s}>{s}</option>)}
        </select>

        {/* Vue */}
        <div style={{ display:"flex", background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:3, boxShadow:t.shadow }}>
          {[{v:"cartes",icon:"ti-layout-grid"},{v:"liste",icon:"ti-list"}].map(x=>(
            <button key={x.v} onClick={()=>setVue(x.v)} style={{ width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",border:"none",borderRadius:8,cursor:"pointer",background:vue===x.v?t.blue:"transparent",color:vue===x.v?"#fff":t.muted,transition:"all .15s" }}>
              <i className={`ti ${x.icon}`} style={{ fontSize:15 }} />
            </button>
          ))}
        </div>
      </div>

      {/* Compteur */}
      <div style={{ fontSize:12, color:t.muted, marginBottom:14, fontWeight:500 }}>
        {filtered.length} annonce{filtered.length!==1?"s":""} {search||filtreAud!=="Tous"||filtreStatut!=="Tous"||filtreType?"trouvée"+(filtered.length!==1?"s":""):"au total"}
      </div>

      {/* ── VUE CARTES ── */}
      {vue==="cartes" && (
        filtered.length===0 ? (
          <div style={{ padding:64, textAlign:"center", color:t.muted }}>
            <i className="ti ti-speakerphone" style={{ fontSize:36, display:"block", marginBottom:12, color:t.border }} />
            <div style={{ fontSize:15, fontWeight:600, color:t.sub, marginBottom:6 }}>Aucune annonce trouvée</div>
            <div style={{ fontSize:13 }}>Modifiez vos filtres ou créez une nouvelle annonce</div>
            <button onClick={()=>setModal(true)} style={{ marginTop:16, display:"inline-flex", alignItems:"center", gap:7, background:t.blue, color:"#fff", border:"none", borderRadius:t.radius, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font }}>
              <i className="ti ti-plus" style={{ fontSize:14 }} /> Nouvelle annonce
            </button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
            {filtered.map(ann=>{
              const tp = TYPES[ann.type]   || TYPES["Information"];
              const st = STATUTS[ann.statut] || STATUTS["Publié"];
              const isHov = hovered===ann.id;
              const tauxL  = ann.destinataires>0 ? Math.round((ann.lus/ann.destinataires)*100) : 0;
              return (
                <div key={ann.id}
                  onMouseEnter={()=>setHovered(ann.id)}
                  onMouseLeave={()=>setHovered(null)}
                  style={{
                    background:t.surface, border:`1px solid ${isHov?tp.color+"55":t.border}`,
                    borderRadius:t.radiusLg, overflow:"hidden", boxShadow:isHov?t.shadowMd:t.shadow,
                    transition:"all .2s", transform:isHov?"translateY(-3px)":"translateY(0)",
                    display:"flex", flexDirection:"column",
                  }}
                >
                  {/* Bande colorée */}
                  <div style={{ height:4, background:tp.color }} />

                  <div style={{ padding:"16px 16px 12px", flex:1 }}>
                    {/* Badges */}
                    <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                      <Chip label={ann.type}   c={tp.color} bg={tp.bg} small />
                      <Chip label={ann.statut} c={st.color} bg={st.bg} small />
                      {ann.urgent && <Chip label="⚡ Urgent" c={t.red} bg={t.redSoft} small />}
                    </div>

                    {/* Titre */}
                    <div onClick={()=>setSelected(ann)} style={{ fontSize:14, fontWeight:700, color:t.text, marginBottom:8, lineHeight:1.4, cursor:"pointer", overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {ann.titre}
                    </div>

                    {/* Aperçu contenu */}
                    <div style={{ fontSize:12, color:t.muted, lineHeight:1.6, marginBottom:12, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {ann.contenu}
                    </div>

                    {/* Audience chips */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
                      {ann.audience.map(a=>(
                        <span key={a} style={{ fontSize:10, fontWeight:500, padding:"2px 7px", borderRadius:20, background:"#f3f4f6", color:t.sub }}>{a}</span>
                      ))}
                    </div>

                    {/* Stats lecture */}
                    {ann.destinataires>0 && (
                      <div style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:t.muted, marginBottom:4 }}>
                          <span>{ann.lus} / {ann.destinataires} lus</span>
                          <span style={{ fontWeight:600, color:tauxL>=80?t.green:tauxL>=50?t.amber:t.red }}>{tauxL}%</span>
                        </div>
                        <div style={{ height:3, background:t.border, borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", background:tauxL>=80?t.green:tauxL>=50?t.amber:t.red, borderRadius:99, width:`${tauxL}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Meta */}
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:t.muted, paddingTop:10, borderTop:`1px solid ${t.border}` }}>
                      <span>{ann.auteur}</span>
                      <span>{ann.date} · {ann.heure}</span>
                    </div>
                  </div>

                  {/* Actions hover */}
                  <div style={{ padding:"0 12px 12px", display:"flex", gap:6, opacity:isHov?1:0, transition:"opacity .15s" }}>
                    <button onClick={()=>setSelected(ann)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"6px 0", border:`1px solid ${t.border}`, borderRadius:8, background:t.bg, fontSize:11, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font }}>
                      <i className="ti ti-eye" style={{ fontSize:12 }} /> Voir
                    </button>
                    <button onClick={()=>openEdit(ann)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"6px 0", border:`1px solid ${t.blueMid}`, borderRadius:8, background:t.blueSoft, fontSize:11, fontWeight:600, cursor:"pointer", color:t.blue, fontFamily:t.font }}>
                      <i className="ti ti-edit" style={{ fontSize:12 }} /> Modifier
                    </button>
                    <button onClick={()=>handleArchive(ann.id)} style={{ padding:"6px 8px", border:`1px solid ${t.border}`, borderRadius:8, background:t.surface, fontSize:11, cursor:"pointer", color:t.muted, fontFamily:t.font }}>
                      <i className="ti ti-archive" style={{ fontSize:12 }} />
                    </button>
                    <button onClick={()=>handleDelete(ann.id)} style={{ padding:"6px 8px", border:"1px solid #fecaca", borderRadius:8, background:"#fef2f2", fontSize:11, cursor:"pointer", color:t.red, fontFamily:t.font }}>
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
      {vue==="liste" && (
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
              <thead>
                <tr style={{ background:t.bg }}>
                  {["Annonce","Type","Audience","Date","Lecture","Statut","Actions"].map(h=>(
                    <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:t.muted, textTransform:"uppercase", letterSpacing:".4px", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0 ? (
                  <tr><td colSpan={7} style={{ padding:48, textAlign:"center", color:t.muted, fontSize:13 }}>
                    <i className="ti ti-speakerphone" style={{ fontSize:28, display:"block", marginBottom:8, color:t.border }} />
                    Aucune annonce trouvée
                  </td></tr>
                ) : filtered.map(ann=>{
                  const tp = TYPES[ann.type]   || TYPES["Information"];
                  const st = STATUTS[ann.statut] || STATUTS["Publié"];
                  const tauxL = ann.destinataires>0 ? Math.round((ann.lus/ann.destinataires)*100) : 0;
                  return (
                    <tr key={ann.id} style={{ borderBottom:`1px solid ${t.border}`, transition:"background .12s", cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{ padding:"12px 14px" }} onClick={()=>setSelected(ann)}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:9, background:tp.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <i className={`ti ${tp.icon}`} style={{ fontSize:16, color:tp.color }} />
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:t.text, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ann.titre}</div>
                            <div style={{ fontSize:11, color:t.muted, marginTop:1 }}>{ann.auteur}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"12px 14px" }}><Chip label={ann.type} c={tp.color} bg={tp.bg} small /></td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                          {ann.audience.slice(0,2).map(a=><span key={a} style={{ fontSize:10, padding:"1px 6px", borderRadius:20, background:"#f3f4f6", color:t.sub }}>{a}</span>)}
                          {ann.audience.length>2&&<span style={{ fontSize:10, color:t.muted }}>+{ann.audience.length-2}</span>}
                        </div>
                      </td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:t.sub, whiteSpace:"nowrap" }}>{ann.date}</td>
                      <td style={{ padding:"12px 14px" }}>
                        {ann.destinataires>0 ? (
                          <div>
                            <div style={{ fontSize:12, fontWeight:600, color:tauxL>=80?t.green:t.amber }}>{tauxL}%</div>
                            <div style={{ fontSize:10, color:t.muted }}>{ann.lus}/{ann.destinataires}</div>
                          </div>
                        ) : <span style={{ fontSize:12, color:t.muted }}>—</span>}
                      </td>
                      <td style={{ padding:"12px 14px" }}><Chip label={ann.statut} c={st.color} bg={st.bg} small /></td>
                      <td style={{ padding:"12px 10px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <button onClick={()=>setSelected(ann)} style={{ padding:"4px 8px", border:`1px solid ${t.border}`, borderRadius:6, background:t.surface, fontSize:11, cursor:"pointer", color:t.sub, fontFamily:t.font }}><i className="ti ti-eye" style={{ fontSize:12 }} /></button>
                          <button onClick={()=>openEdit(ann)} style={{ padding:"4px 8px", border:`1px solid ${t.blueMid}`, borderRadius:6, background:t.blueSoft, fontSize:11, cursor:"pointer", color:t.blue, fontFamily:t.font }}><i className="ti ti-edit" style={{ fontSize:12 }} /></button>
                          <button onClick={()=>handleDelete(ann.id)} style={{ padding:"4px 8px", border:"1px solid #fecaca", borderRadius:6, background:"#fef2f2", fontSize:11, cursor:"pointer", color:t.red, fontFamily:t.font }}><i className="ti ti-trash" style={{ fontSize:12 }} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length>0&&(
            <div style={{ padding:"10px 16px", borderTop:`1px solid ${t.border}`, background:t.bg, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:t.muted }}>{filtered.length} annonce{filtered.length!==1?"s":""}</span>
              <span style={{ fontSize:12, color:t.blue, fontWeight:500, cursor:"pointer" }}>Exporter →</span>
            </div>
          )}
        </div>
      )}

      {/* DRAWER DÉTAIL */}
      {selected && (
        <AnnonceDrawer
          annonce={selected}
          onClose={()=>setSelected(null)}
          onEdit={openEdit}
          onArchive={handleArchive}
        />
      )}

      {/* MODAL CRÉATION / MODIFICATION */}
      {modal && (
        <AnnonceModal
          initial={editAnn}
          onClose={()=>{setModal(false);setEditAnn(null);}}
          onSave={handleSave}
        />
      )}
    </div>
  );
}