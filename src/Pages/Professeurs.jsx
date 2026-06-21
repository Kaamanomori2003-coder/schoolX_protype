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
  radius:"10px", radiusLg:"14px",
  shadow:"0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.07)",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── DATA ───────────────────────────────────────────────────── */
const DATA = [
  {
    id:1, prenom:"Mamadou", nom:"Diallo", sexe:"M",
    dateNaissance:"15/03/1980", adresse:"Ratoma, Conakry",
    telephone:"621 11 22 33", email:"m.diallo@schoolx.gn",
    diplome:"Doctorat en Mathématiques", experience:"12 ans",
    dateRecrutement:"01/09/2012", status:"Actif",
    initials:"MD",
    matieres:["Mathématiques","Physique-Chimie"],
    classes:["Terminale A","Terminale S","1ère S"],
    matricule:"PRF-2012-001",
    tauxHoraire:50000,
    heuresEffectuees:120,
    montantPaye:4500000,
    enseignements:[
      { matiere:"Mathématiques",  classe:"Terminale A", heures:6 },
      { matiere:"Mathématiques",  classe:"Terminale S", heures:6 },
      { matiere:"Physique-Chimie",classe:"1ère S",      heures:4 },
    ],
    emploiDuTemps:[
      { jour:"Lundi",    heure:"07h30", classe:"Terminale A", matiere:"Mathématiques"   },
      { jour:"Lundi",    heure:"08h30", classe:"Terminale A", matiere:"Mathématiques"   },
      { jour:"Mardi",    heure:"07h30", classe:"Terminale S", matiere:"Mathématiques"   },
      { jour:"Mercredi", heure:"09h30", classe:"1ère S",      matiere:"Physique-Chimie" },
      { jour:"Jeudi",    heure:"07h30", classe:"Terminale A", matiere:"Mathématiques"   },
      { jour:"Vendredi", heure:"08h30", classe:"Terminale S", matiere:"Mathématiques"   },
    ],
    presences:{ present:88, absent:4, retard:2, total:94 },
    paiements:[
      { date:"01/01/2025", montant:1500000, mode:"Virement", status:"Payé"       },
      { date:"01/02/2025", montant:1500000, mode:"Virement", status:"Payé"       },
      { date:"01/03/2025", montant:1500000, mode:"Virement", status:"En attente" },
    ],
    documents:[
      { nom:"Contrat de travail",      type:"PDF", taille:"1.2 MB", date:"01/09/2012", icon:"ti-file-description" },
      { nom:"Diplôme de Doctorat",     type:"PDF", taille:"2.4 MB", date:"15/07/2005", icon:"ti-certificate"     },
      { nom:"Pièce d'identité",        type:"PDF", taille:"0.8 MB", date:"20/01/2020", icon:"ti-id-badge"        },
      { nom:"Extrait de naissance",    type:"PDF", taille:"0.5 MB", date:"10/03/1980", icon:"ti-file-text"       },
    ],
  },
  {
    id:2, prenom:"Fatoumata", nom:"Bah", sexe:"F",
    dateNaissance:"22/07/1985", adresse:"Kaloum, Conakry",
    telephone:"622 22 33 44", email:"f.bah@schoolx.gn",
    diplome:"Master en Lettres Modernes", experience:"8 ans",
    dateRecrutement:"15/09/2016", status:"Actif",
    initials:"FB",
    matieres:["Français","Philosophie"],
    classes:["Terminale A","Seconde C","3ème B"],
    matricule:"PRF-2016-002",
    tauxHoraire:45000,
    heuresEffectuees:100,
    montantPaye:3000000,
    enseignements:[
      { matiere:"Français",    classe:"Terminale A", heures:4 },
      { matiere:"Français",    classe:"Seconde C",   heures:4 },
      { matiere:"Philosophie", classe:"3ème B",      heures:2 },
    ],
    emploiDuTemps:[
      { jour:"Lundi",    heure:"09h30", classe:"Terminale A", matiere:"Français"    },
      { jour:"Mardi",    heure:"08h30", classe:"Seconde C",   matiere:"Français"    },
      { jour:"Jeudi",    heure:"09h30", classe:"3ème B",      matiere:"Philosophie" },
      { jour:"Vendredi", heure:"07h30", classe:"Terminale A", matiere:"Français"    },
    ],
    presences:{ present:72, absent:8, retard:3, total:83 },
    paiements:[
      { date:"01/01/2025", montant:1500000, mode:"Espèces", status:"Payé"       },
      { date:"01/02/2025", montant:1500000, mode:"Espèces", status:"En attente" },
    ],
    documents:[
      { nom:"Contrat de travail", type:"PDF", taille:"1.1 MB", date:"15/09/2016", icon:"ti-file-description" },
      { nom:"Master Lettres",     type:"PDF", taille:"1.8 MB", date:"30/06/2010", icon:"ti-certificate"     },
      { nom:"Pièce d'identité",  type:"PDF", taille:"0.7 MB", date:"05/02/2019", icon:"ti-id-badge"        },
    ],
  },
  {
    id:3, prenom:"Ibrahima", nom:"Camara", sexe:"M",
    dateNaissance:"10/11/1978", adresse:"Matam, Conakry",
    telephone:"623 33 44 55", email:"i.camara@schoolx.gn",
    diplome:"Licence en Histoire-Géographie", experience:"15 ans",
    dateRecrutement:"01/09/2009", status:"Congé",
    initials:"IC",
    matieres:["Histoire-Géo"],
    classes:["3ème B","Seconde C","4ème C"],
    matricule:"PRF-2009-003",
    tauxHoraire:40000,
    heuresEffectuees:80,
    montantPaye:2400000,
    enseignements:[
      { matiere:"Histoire-Géo", classe:"3ème B",   heures:3 },
      { matiere:"Histoire-Géo", classe:"Seconde C", heures:3 },
      { matiere:"Histoire-Géo", classe:"4ème C",    heures:2 },
    ],
    emploiDuTemps:[
      { jour:"Lundi",    heure:"11h30", classe:"3ème B",    matiere:"Histoire-Géo" },
      { jour:"Mercredi", heure:"07h30", classe:"Seconde C", matiere:"Histoire-Géo" },
      { jour:"Vendredi", heure:"09h30", classe:"4ème C",    matiere:"Histoire-Géo" },
    ],
    presences:{ present:60, absent:12, retard:5, total:77 },
    paiements:[
      { date:"01/01/2025", montant:1200000, mode:"Mobile", status:"Payé" },
      { date:"01/02/2025", montant:1200000, mode:"Mobile", status:"Payé" },
    ],
    documents:[
      { nom:"Contrat de travail", type:"PDF", taille:"1.0 MB", date:"01/09/2009", icon:"ti-file-description" },
      { nom:"Licence Histoire",   type:"PDF", taille:"1.5 MB", date:"20/06/2003", icon:"ti-certificate"     },
    ],
  },
  {
    id:4, prenom:"Aïssatou", nom:"Sow", sexe:"F",
    dateNaissance:"05/04/1990", adresse:"Dixinn, Conakry",
    telephone:"624 44 55 66", email:"a.sow@schoolx.gn",
    diplome:"Master en Anglais", experience:"5 ans",
    dateRecrutement:"01/09/2019", status:"Actif",
    initials:"AS",
    matieres:["Anglais"],
    classes:["Terminale A","Seconde C","1ère S"],
    matricule:"PRF-2019-004",
    tauxHoraire:42000,
    heuresEffectuees:90,
    montantPaye:2520000,
    enseignements:[
      { matiere:"Anglais", classe:"Terminale A", heures:3 },
      { matiere:"Anglais", classe:"Seconde C",   heures:3 },
      { matiere:"Anglais", classe:"1ère S",      heures:3 },
    ],
    emploiDuTemps:[
      { jour:"Lundi",    heure:"14h00", classe:"Terminale A", matiere:"Anglais" },
      { jour:"Mardi",    heure:"11h30", classe:"Seconde C",   matiere:"Anglais" },
      { jour:"Jeudi",    heure:"14h00", classe:"1ère S",      matiere:"Anglais" },
    ],
    presences:{ present:82, absent:3, retard:1, total:86 },
    paiements:[
      { date:"01/01/2025", montant:1260000, mode:"Virement", status:"Payé"       },
      { date:"01/02/2025", montant:1260000, mode:"Virement", status:"En attente" },
    ],
    documents:[
      { nom:"Contrat de travail", type:"PDF", taille:"1.0 MB", date:"01/09/2019", icon:"ti-file-description" },
      { nom:"Master Anglais",     type:"PDF", taille:"1.6 MB", date:"15/06/2015", icon:"ti-certificate"     },
      { nom:"Pièce d'identité",  type:"PDF", taille:"0.6 MB", date:"12/08/2021", icon:"ti-id-badge"        },
    ],
  },
  {
    id:5, prenom:"Ousmane", nom:"Kouyaté", sexe:"M",
    dateNaissance:"28/09/1983", adresse:"Lambanyi, Conakry",
    telephone:"625 55 66 77", email:"o.kouyate@schoolx.gn",
    diplome:"Master en Physique-Chimie", experience:"10 ans",
    dateRecrutement:"01/09/2014", status:"Suspendu",
    initials:"OK",
    matieres:["Physique-Chimie","SVT"],
    classes:["Terminale S","1ère S","Seconde C"],
    matricule:"PRF-2014-005",
    tauxHoraire:45000,
    heuresEffectuees:60,
    montantPaye:1800000,
    enseignements:[
      { matiere:"Physique-Chimie", classe:"Terminale S", heures:4 },
      { matiere:"SVT",             classe:"1ère S",      heures:3 },
      { matiere:"Physique-Chimie", classe:"Seconde C",   heures:3 },
    ],
    emploiDuTemps:[
      { jour:"Lundi",    heure:"08h30", classe:"Terminale S", matiere:"Physique-Chimie" },
      { jour:"Mercredi", heure:"11h30", classe:"1ère S",      matiere:"SVT"             },
      { jour:"Vendredi", heure:"11h30", classe:"Seconde C",   matiere:"Physique-Chimie" },
    ],
    presences:{ present:50, absent:20, retard:8, total:78 },
    paiements:[
      { date:"01/01/2025", montant:1800000, mode:"Espèces", status:"Payé" },
    ],
    documents:[
      { nom:"Contrat de travail",  type:"PDF", taille:"1.1 MB", date:"01/09/2014", icon:"ti-file-description" },
      { nom:"Master Physique",     type:"PDF", taille:"1.9 MB", date:"28/06/2008", icon:"ti-certificate"     },
    ],
  },
];

const statusInfo = (s) => ({
  "Actif":    { c:t.green,  bg:t.greenSoft,  label:"Actif"    },
  "Congé":    { c:t.amber,  bg:t.amberSoft,  label:"Congé"    },
  "Suspendu": { c:t.red,    bg:t.redSoft,    label:"Suspendu" },
}[s] || { c:t.muted, bg:t.bg, label:s });

const pStatusInfo = (s) => ({
  "Payé":       { c:t.green, bg:t.greenSoft },
  "En attente": { c:t.amber, bg:t.amberSoft },
  "Impayé":     { c:t.red,   bg:t.redSoft   },
}[s] || { c:t.muted, bg:t.bg });

const matiereColor = (m) => ({
  "Mathématiques":   "#2563eb",
  "Français":        "#7c3aed",
  "Physique-Chimie": "#0891b2",
  "Histoire-Géo":    "#d97706",
  "Anglais":         "#059669",
  "SVT":             "#16a34a",
  "Philosophie":     "#9333ea",
  "Informatique":    "#0369a1",
}[m] || t.blue);

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
const Chip = ({ label, c, bg, small }) => (
  <span style={{ fontSize:small?10:11, fontWeight:600, padding:small?"2px 7px":"3px 10px", borderRadius:20, background:bg||t.bg, color:c||t.sub, whiteSpace:"nowrap", display:"inline-block" }}>
    {label}
  </span>
);

const StatBox = ({ icon, label, value, c=t.blue, bg=t.blueSoft }) => (
  <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:t.shadow }}>
    <div style={{ width:38, height:38, borderRadius:9, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <i className={`ti ${icon}`} style={{ fontSize:18, color:c }} />
    </div>
    <div>
      <div style={{ fontSize:10, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".4px" }}>{label}</div>
      <div style={{ fontSize:19, fontWeight:700, color:t.text, marginTop:2, lineHeight:1 }}>{value}</div>
    </div>
  </div>
);

const ProgressBar = ({ value, color=t.blue, height=6 }) => (
  <div style={{ height, background:t.border, borderRadius:99, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(value,100)}%`, height:"100%", background:color, borderRadius:99, transition:"width .6s ease" }} />
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderBottom:`1px solid ${t.border}` }}>
    <i className={`ti ${icon}`} style={{ fontSize:15, color:t.muted, marginTop:1, width:16, flexShrink:0 }} />
    <span style={{ fontSize:12, color:t.muted, width:120, flexShrink:0, fontWeight:500 }}>{label}</span>
    <span style={{ fontSize:13, color:t.text, fontWeight:500, flex:1 }}>{value}</span>
  </div>
);

const ActionBtn = ({ icon, label, primary, danger, small, onClick }) => (
  <button onClick={onClick} style={{
    display:"flex", alignItems:"center", gap:6,
    padding: small?"6px 12px":"9px 16px",
    border: primary?"none": danger?`1px solid #fecaca`:`1px solid ${t.border}`,
    borderRadius:t.radius, cursor:"pointer", fontFamily:t.font,
    fontSize:13, fontWeight:600,
    background: primary?t.blue: danger?t.redSoft:t.surface,
    color: primary?"#fff": danger?t.red:t.sub,
    boxShadow: primary?`0 2px 8px rgba(37,99,235,0.25)`:t.shadow,
    transition:"all .15s", whiteSpace:"nowrap",
  }}
    onMouseEnter={e=>{e.currentTarget.style.opacity=".85";e.currentTarget.style.transform="translateY(-1px)"}}
    onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"}}
  >
    <i className={`ti ${icon}`} style={{ fontSize:small?13:14 }} />
    {label}
  </button>
);

const TabBtn = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} style={{
    display:"flex", alignItems:"center", gap:7,
    padding:"10px 16px", border:"none",
    borderBottom:active?`2px solid ${t.blue}`:"2px solid transparent",
    background:"transparent", cursor:"pointer", fontFamily:t.font,
    fontSize:13, fontWeight:active?600:400,
    color:active?t.blue:t.sub, marginBottom:-1,
    transition:"all .15s", whiteSpace:"nowrap",
  }}>
    <i className={`ti ${icon}`} style={{ fontSize:14 }} />
    {label}
  </button>
);

const THead = ({ cols }) => (
  <thead>
    <tr style={{ background:t.bg }}>
      {cols.map(c=>(
        <th key={c} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:t.muted, textTransform:"uppercase", letterSpacing:".4px", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{c}</th>
      ))}
    </tr>
  </thead>
);

const ModalOverlay = ({ children }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.25)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:400 }}>
    {children}
  </div>
);

/* ─── PROFIL PROFESSEUR ──────────────────────────────────────── */
function ProfilProf({ prof, onRetour, onEdit }) {
  const [tab, setTab] = useState("info");

  const totalHeures  = prof.enseignements.reduce((a,e)=>a+e.heures,0);
  const tPres        = Math.round((prof.presences.present/(prof.presences.total||1))*100);
  const salaireBrut  = prof.tauxHoraire * prof.heuresEffectuees;
  const reste        = salaireBrut - prof.montantPaye;
  const tPaie        = Math.round((prof.montantPaye/(salaireBrut||1))*100);
  const si           = statusInfo(prof.status);

  const tabs = [
    { key:"info",      icon:"ti-user",          label:"Informations"   },
    { key:"enseign",   icon:"ti-book",           label:"Enseignements"  },
    { key:"emploi",    icon:"ti-calendar",       label:"Emploi du temps"},
    { key:"presence",  icon:"ti-calendar-check", label:"Présence"       },
    { key:"paiement",  icon:"ti-credit-card",    label:"Paiement"       },
    { key:"documents", icon:"ti-file-text",      label:"Documents"      },
  ];

  return (
    <div style={{ fontFamily:t.font, color:t.text, maxWidth:900, margin:"0 auto" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <ActionBtn icon="ti-arrow-left" label="Retour" primary onClick={onRetour} />
        <div style={{ display:"flex", gap:8 }}>
          <ActionBtn icon="ti-edit"   label="Modifier" onClick={()=>onEdit(prof)} />
          <ActionBtn icon="ti-folder" label="Dossier"  />
        </div>
      </div>

      {/* ── HERO CARD ── */}
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", marginBottom:14, boxShadow:t.shadow }}>
        <div style={{ height:5, background:`linear-gradient(90deg,${t.blue},${t.purple})` }} />
        <div style={{ padding:"20px 22px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:16, flexWrap:"wrap", marginBottom:18 }}>
            {/* Avatar */}
            <div style={{ width:60, height:60, borderRadius:"50%", flexShrink:0, background:t.blueSoft, border:`2px solid ${t.blueMid}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:t.blue, boxShadow:`0 2px 10px rgba(37,99,235,0.15)` }}>
              {prof.initials}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <h2 style={{ margin:0, fontSize:19, fontWeight:700, color:t.text, lineHeight:1.2 }}>
                {prof.prenom} {prof.nom}
              </h2>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:7 }}>
                <span style={{ fontSize:12, fontWeight:700, color:t.blue, background:t.blueSoft, border:`1px solid ${t.blueMid}`, padding:"3px 10px", borderRadius:6, letterSpacing:".3px" }}>
                  <i className="ti ti-id-badge" style={{ marginRight:4, fontSize:11 }} />{prof.matricule}
                </span>
                {prof.matieres.map(m=>(
                  <span key={m} style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, background:`${matiereColor(m)}15`, color:matiereColor(m), border:`1px solid ${matiereColor(m)}30` }}>{m}</span>
                ))}
                <Chip label={si.label} c={si.c} bg={si.bg} />
              </div>
            </div>
          </div>

          <div style={{ height:1, background:t.border, margin:"0 0 14px" }} />

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:"0 28px" }}>
            <div>
              <InfoRow icon="ti-user"      label="Sexe"            value={prof.sexe==="M"?"Masculin":"Féminin"} />
              <InfoRow icon="ti-calendar"  label="Date naissance"   value={prof.dateNaissance} />
              <InfoRow icon="ti-phone"     label="Téléphone"        value={prof.telephone} />
            </div>
            <div>
              <InfoRow icon="ti-mail"      label="Email"            value={prof.email} />
              <InfoRow icon="ti-map-pin"   label="Adresse"          value={prof.adresse} />
              <InfoRow icon="ti-calendar-plus" label="Recrutement"  value={prof.dateRecrutement} />
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display:"flex", borderBottom:`1px solid ${t.border}`, marginBottom:16, overflowX:"auto" }}>
        {tabs.map(tb=>(
          <TabBtn key={tb.key} active={tab===tb.key} icon={tb.icon} label={tb.label} onClick={()=>setTab(tb.key)} />
        ))}
      </div>

      {/* ═══ INFORMATIONS ═══ */}
      {tab==="info" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"18px 20px", boxShadow:t.shadow }}>
            <div style={{ fontSize:13, fontWeight:700, color:t.text, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <i className="ti ti-user-circle" style={{ color:t.blue, fontSize:16 }} /> Informations personnelles
            </div>
            <InfoRow icon="ti-user"      label="Prénom"          value={prof.prenom} />
            <InfoRow icon="ti-user"      label="Nom"             value={prof.nom} />
            <InfoRow icon="ti-venus-mars"label="Sexe"            value={prof.sexe==="M"?"Masculin":"Féminin"} />
            <InfoRow icon="ti-calendar"  label="Date naissance"  value={prof.dateNaissance} />
            <InfoRow icon="ti-map-pin"   label="Adresse"         value={prof.adresse} />
            <InfoRow icon="ti-phone"     label="Téléphone"       value={prof.telephone} />
            <InfoRow icon="ti-mail"      label="Email"           value={prof.email} />
          </div>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"18px 20px", boxShadow:t.shadow }}>
            <div style={{ fontSize:13, fontWeight:700, color:t.text, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <i className="ti ti-school" style={{ color:t.blue, fontSize:16 }} /> Informations professionnelles
            </div>
            <InfoRow icon="ti-certificate"   label="Diplôme"        value={prof.diplome} />
            <InfoRow icon="ti-briefcase"     label="Expérience"     value={prof.experience} />
            <InfoRow icon="ti-calendar-plus" label="Recrutement"    value={prof.dateRecrutement} />
            <InfoRow icon="ti-id-badge"      label="Matricule"      value={prof.matricule} />
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:12, color:t.muted, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:".4px" }}>Matières enseignées</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {prof.matieres.map(m=>(
                  <span key={m} style={{ fontSize:12, fontWeight:600, padding:"4px 11px", borderRadius:20, background:`${matiereColor(m)}12`, color:matiereColor(m), border:`1px solid ${matiereColor(m)}25` }}>{m}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, color:t.muted, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:".4px" }}>Classes affectées</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {prof.classes.map(c=>(
                  <span key={c} style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, background:"#f3f4f6", color:t.sub }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ENSEIGNEMENTS ═══ */}
      {tab==="enseign" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:14 }}>
            <StatBox icon="ti-book"    label="Matières"        value={prof.matieres.length}    c={t.blue}   bg={t.blueSoft}   />
            <StatBox icon="ti-school"  label="Classes"         value={prof.classes.length}     c={t.purple} bg={t.purpleSoft} />
            <StatBox icon="ti-clock"   label="Heures/semaine"  value={`${totalHeures}h`}       c={t.amber}  bg={t.amberSoft}  />
          </div>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow }}>
            <div style={{ padding:"13px 18px", borderBottom:`1px solid ${t.border}`, fontSize:13, fontWeight:700, color:t.text }}>
              Tableau des enseignements
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:400 }}>
                <THead cols={["Matière","Classe","Volume horaire"]} />
                <tbody>
                  {prof.enseignements.map((e,i)=>(
                    <tr key={i} style={{ borderBottom:`1px solid ${t.border}`, transition:"background .12s" }}
                      onMouseEnter={el=>el.currentTarget.style.background=t.bg}
                      onMouseLeave={el=>el.currentTarget.style.background="transparent"}
                    >
                      <td style={{ padding:"12px 16px" }}>
                        <span style={{ fontSize:13, fontWeight:600, color:matiereColor(e.matiere) }}>{e.matiere}</span>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <Chip label={e.classe} c={t.sub} bg="#f3f4f6" />
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <i className="ti ti-clock" style={{ fontSize:13, color:t.muted }} />
                          <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{e.heures}h / semaine</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EMPLOI DU TEMPS ═══ */}
      {tab==="emploi" && (
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow }}>
          <div style={{ padding:"13px 18px", borderBottom:`1px solid ${t.border}`, fontSize:13, fontWeight:700, color:t.text }}>
            Emploi du temps hebdomadaire
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:480 }}>
              <THead cols={["Jour","Heure","Classe","Matière"]} />
              <tbody>
                {prof.emploiDuTemps.map((e,i)=>(
                  <tr key={i} style={{ borderBottom:`1px solid ${t.border}`, transition:"background .12s" }}
                    onMouseEnter={el=>el.currentTarget.style.background=t.bg}
                    onMouseLeave={el=>el.currentTarget.style.background="transparent"}
                  >
                    <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:t.text }}>{e.jour}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontSize:12, fontWeight:700, color:t.blue, background:t.blueSoft, padding:"3px 9px", borderRadius:20 }}>{e.heure}</span>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <Chip label={e.classe} c={t.sub} bg="#f3f4f6" />
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontSize:13, fontWeight:600, color:matiereColor(e.matiere) }}>{e.matiere}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ PRÉSENCE ═══ */}
      {tab==="presence" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12, marginBottom:14 }}>
            <StatBox icon="ti-circle-check" label="Présences" value={prof.presences.present} c={t.green} bg={t.greenSoft} />
            <StatBox icon="ti-circle-x"     label="Absences"  value={prof.presences.absent}  c={t.red}   bg={t.redSoft}   />
            <StatBox icon="ti-clock"        label="Retards"   value={prof.presences.retard}  c={t.amber} bg={t.amberSoft} />
            <StatBox icon="ti-percentage"   label="Taux"      value={`${tPres}%`}            c={t.blue}  bg={t.blueSoft}  />
          </div>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"18px 20px", boxShadow:t.shadow }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Taux de présence</span>
              <span style={{ fontSize:15, fontWeight:700, color:tPres>=85?t.green:tPres>=70?t.amber:t.red }}>{tPres}%</span>
            </div>
            <ProgressBar value={tPres} color={tPres>=85?t.green:tPres>=70?t.amber:t.red} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12, color:t.muted }}>
              <span>{prof.presences.present} jours présent</span>
              <span>{prof.presences.total} jours total</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PAIEMENT ═══ */}
      {tab==="paiement" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:14 }}>
            <StatBox icon="ti-clock"        label="Taux horaire"      value={`${prof.tauxHoraire.toLocaleString()} GNF`} c={t.purple} bg={t.purpleSoft} />
            <StatBox icon="ti-calendar"     label="Heures effectuées" value={`${prof.heuresEffectuees}h`}                c={t.blue}   bg={t.blueSoft}   />
            <StatBox icon="ti-cash"         label="Salaire brut"      value={`${(salaireBrut/1e6).toFixed(2)}M GNF`}    c={t.amber}  bg={t.amberSoft}  />
            <StatBox icon="ti-circle-check" label="Montant payé"      value={`${(prof.montantPaye/1e6).toFixed(2)}M GNF`} c={t.green} bg={t.greenSoft} />
            <StatBox icon="ti-alert-circle" label="Reste à payer"     value={`${(reste/1e6).toFixed(2)}M GNF`}          c={reste>0?t.red:t.green} bg={reste>0?t.redSoft:t.greenSoft} />
          </div>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"16px 18px", boxShadow:t.shadow, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Progression du paiement</span>
              <span style={{ fontSize:14, fontWeight:700, color:t.blue }}>{tPaie}%</span>
            </div>
            <ProgressBar value={tPaie} color={t.blue} />
          </div>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow }}>
            <div style={{ padding:"13px 18px", borderBottom:`1px solid ${t.border}`, fontSize:13, fontWeight:700, color:t.text }}>Historique des paiements</div>
            {prof.paiements.length===0
              ? <div style={{ padding:28, textAlign:"center", color:t.muted, fontSize:13 }}>Aucun paiement</div>
              : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:380 }}>
                    <THead cols={["Date","Montant","Mode","Statut"]} />
                    <tbody>
                      {prof.paiements.map((p,i)=>{
                        const ps = pStatusInfo(p.status);
                        return (
                          <tr key={i} style={{ borderBottom:`1px solid ${t.border}` }}>
                            <td style={{ padding:"11px 16px", fontSize:13, color:t.sub }}>{p.date}</td>
                            <td style={{ padding:"11px 16px", fontSize:13, fontWeight:600, color:t.text }}>{p.montant.toLocaleString()} GNF</td>
                            <td style={{ padding:"11px 16px", fontSize:13, color:t.sub }}>{p.mode}</td>
                            <td style={{ padding:"11px 16px" }}><Chip label={p.status} c={ps.c} bg={ps.bg} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* ═══ DOCUMENTS ═══ */}
      {tab==="documents" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
            <ActionBtn icon="ti-upload" label="Ajouter un document" primary />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
            {prof.documents.map((doc,i)=>(
              <div key={i} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"16px 18px", boxShadow:t.shadow, display:"flex", alignItems:"flex-start", gap:14, transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shadowMd;e.currentTarget.style.borderColor=t.blueMid}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadow;e.currentTarget.style.borderColor=t.border}}
              >
                <div style={{ width:42, height:42, borderRadius:10, background:t.blueSoft, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={`ti ${doc.icon}`} style={{ fontSize:20, color:t.blue }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.nom}</div>
                  <div style={{ fontSize:11, color:t.muted, marginTop:3 }}>{doc.type} · {doc.taille} · {doc.date}</div>
                  <div style={{ display:"flex", gap:8, marginTop:10 }}>
                    <button style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", border:`1px solid ${t.border}`, borderRadius:7, background:t.surface, fontSize:11, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font }}>
                      <i className="ti ti-eye" style={{ fontSize:12 }} /> Voir
                    </button>
                    <button style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", border:`1px solid ${t.blueMid}`, borderRadius:7, background:t.blueSoft, fontSize:11, fontWeight:600, cursor:"pointer", color:t.blue, fontFamily:t.font }}>
                      <i className="ti ti-download" style={{ fontSize:12 }} /> Télécharger
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MODAL FORM ─────────────────────────────────────────────── */
function ProfModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || {
    prenom:"", nom:"", sexe:"M", dateNaissance:"",
    adresse:"", telephone:"", email:"",
    diplome:"", experience:"", dateRecrutement:"",
    status:"Actif", matieres:"", classes:"",
  });

  const F = ({ label, k, ph }) => (
    <div>
      <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>{label}</label>
      <input type="text" placeholder={ph} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}
        style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text }}
        onFocus={e=>e.currentTarget.style.borderColor=t.blue}
        onBlur={e=>e.currentTarget.style.borderColor=t.border}
      />
    </div>
  );

  return (
    <ModalOverlay>
      <div style={{ background:t.surface, borderRadius:16, padding:28, width:"min(560px,94vw)", boxShadow:"0 20px 60px rgba(0,0,0,0.18)", maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>{initial?"Modifier le professeur":"Nouveau professeur"}</h3>
            <p style={{ margin:0, fontSize:12, color:t.muted, marginTop:3 }}>Remplissez les informations</p>
          </div>
          <button onClick={onClose} style={{ background:t.bg, border:"none", borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub }}>
            <i className="ti ti-x" style={{ fontSize:15 }} />
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <F label="Prénom"           k="prenom"          ph="Ex : Mamadou"              />
          <F label="Nom"              k="nom"             ph="Ex : Diallo"               />
          <F label="Date naissance"   k="dateNaissance"   ph="Ex : 15/03/1980"           />
          <F label="Téléphone"        k="telephone"       ph="Ex : 621 11 22 33"         />
          <F label="Email"            k="email"           ph="Ex : m.diallo@schoolx.gn"  />
          <F label="Adresse"          k="adresse"         ph="Ex : Ratoma, Conakry"      />
          <F label="Diplôme"          k="diplome"         ph="Ex : Master en Maths"      />
          <F label="Expérience"       k="experience"      ph="Ex : 5 ans"               />
          <F label="Date recrutement" k="dateRecrutement" ph="Ex : 01/09/2020"           />
          <F label="Matières"         k="matieres"        ph="Ex : Maths, Physique"      />
          <F label="Classes"          k="classes"         ph="Ex : Term A, 1ère S"       />
        </div>

        <div style={{ marginTop:12 }}>
          <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Statut</label>
          <select value={form.status||"Actif"} onChange={e=>setForm({...form,status:e.target.value})}
            style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", fontFamily:t.font, color:t.text }}>
            <option>Actif</option><option>Congé</option><option>Suspendu</option>
          </select>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
          <button onClick={()=>onSave(form)} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:t.blue, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font }}>
            {initial?"Enregistrer":"Ajouter"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ─── PAGE PRINCIPALE ────────────────────────────────────────── */
export default function Professeurs() {
  const [profs,    setProfs]    = useState(DATA);
  const [search,   setSearch]   = useState("");
  const [filtreMat,setFiltreMat]= useState("Tous");
  const [filtreStatus,setFiltreStatus]= useState("Tous");
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(false);
  const [editProf, setEditProf] = useState(null);
  const [delId,    setDelId]    = useState(null);
  const [toast,    setToast]    = useState(null);

  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),2500); };

  const allMatieres = ["Tous",...new Set(profs.flatMap(p=>p.matieres))];
  const allStatus   = ["Tous","Actif","Congé","Suspendu"];

  const filtered = profs.filter(p=>{
    const ms = `${p.prenom} ${p.nom} ${p.matricule}`.toLowerCase().includes(search.toLowerCase());
    const mm = filtreMat==="Tous"    || p.matieres.includes(filtreMat);
    const ms2= filtreStatus==="Tous" || p.status===filtreStatus;
    return ms&&mm&&ms2;
  });

  const openEdit = (p) => { setEditProf(p); setModal(true); };

  const handleSave = (form) => {
    if (editProf) {
      setProfs(prev=>prev.map(p=>p.id===editProf.id?{...p,...form,matieres:form.matieres?.split(",").map(s=>s.trim())||p.matieres,classes:form.classes?.split(",").map(s=>s.trim())||p.classes}:p));
      showToast("Professeur modifié");
    } else {
      const initials = `${form.prenom?.[0]||"?"}${form.nom?.[0]||"?"}`.toUpperCase();
      setProfs(prev=>[...prev,{
        id:Date.now(), ...form,
        initials, matricule:`PRF-${new Date().getFullYear()}-00${prev.length+1}`,
        matieres:form.matieres?.split(",").map(s=>s.trim())||[],
        classes:form.classes?.split(",").map(s=>s.trim())||[],
        tauxHoraire:0,heuresEffectuees:0,montantPaye:0,
        enseignements:[],emploiDuTemps:[],
        presences:{present:0,absent:0,retard:0,total:0},
        paiements:[],documents:[],moyenne:0,
      }]);
      showToast("Professeur ajouté");
    }
    setModal(false); setEditProf(null);
  };

  const confirmDelete = () => {
    setProfs(prev=>prev.filter(p=>p.id!==delId));
    setDelId(null); showToast("Professeur supprimé","error");
  };

  if (selected) return (
    <ProfilProf
      prof={profs.find(p=>p.id===selected.id)||selected}
      onRetour={()=>setSelected(null)}
      onEdit={(p)=>{ openEdit(p); setSelected(null); }}
    />
  );

  const actifs   = profs.filter(p=>p.status==="Actif").length;
  const conges   = profs.filter(p=>p.status==="Congé").length;
  const suspendus= profs.filter(p=>p.status==="Suspendu").length;

  return (
    <div style={{ fontFamily:t.font, color:t.text }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, background:toast.type==="error"?t.red:t.green, color:"#fff", padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:600, boxShadow:"0 4px 16px rgba(0,0,0,0.15)", display:"flex", alignItems:"center", gap:8 }}>
          <i className={`ti ${toast.type==="error"?"ti-x":"ti-check"}`} style={{ fontSize:15 }} />
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Professeurs</h1>
          <p style={{ fontSize:13, color:t.sub, marginTop:4, margin:0 }}>Corps enseignant — {profs.length} professeurs enregistrés</p>
        </div>
        <ActionBtn icon="ti-plus" label="Nouveau professeur" primary onClick={()=>{setEditProf(null);setModal(true);}} />
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:20 }}>
        <StatBox icon="ti-school"       label="Total"     value={profs.length} c={t.blue}   bg={t.blueSoft}   />
        <StatBox icon="ti-circle-check" label="Actifs"    value={actifs}       c={t.green}  bg={t.greenSoft}  />
        <StatBox icon="ti-beach"        label="En congé"  value={conges}       c={t.amber}  bg={t.amberSoft}  />
        <StatBox icon="ti-ban"          label="Suspendus" value={suspendus}    c={t.red}    bg={t.redSoft}    />
      </div>

      {/* FILTRES */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:"1 1 200px", minWidth:0 }}>
          <i className="ti ti-search" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:t.muted, fontSize:15 }} />
          <input type="text" placeholder="Rechercher un professeur..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", padding:"10px 12px 10px 36px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text, background:t.surface, boxShadow:t.shadow }}
            onFocus={e=>e.currentTarget.style.borderColor=t.blue}
            onBlur={e=>e.currentTarget.style.borderColor=t.border}
          />
        </div>
        <select value={filtreMat} onChange={e=>setFiltreMat(e.target.value)}
          style={{ padding:"10px 14px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, fontFamily:t.font, outline:"none", background:t.surface, cursor:"pointer", color:t.text, boxShadow:t.shadow, flexShrink:0 }}>
          {allMatieres.map(m=><option key={m}>{m}</option>)}
        </select>
        <select value={filtreStatus} onChange={e=>setFiltreStatus(e.target.value)}
          style={{ padding:"10px 14px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, fontFamily:t.font, outline:"none", background:t.surface, cursor:"pointer", color:t.text, boxShadow:t.shadow, flexShrink:0 }}>
          {allStatus.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      {/* TABLE */}
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
            <THead cols={["Professeur","Matricule","Matières","Classes","Téléphone","Recrutement","Statut","Actions"]} />
            <tbody>
              {filtered.map(p=>{
                const si = statusInfo(p.status);
                return (
                  <tr key={p.id}
                    style={{ borderBottom:`1px solid ${t.border}`, transition:"background .12s", cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    {/* Professeur */}
                    <td style={{ padding:"13px 16px" }} onClick={()=>setSelected(p)}>
                      <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                        <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0, background:t.blueSoft, border:`1px solid ${t.blueMid}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:t.blue }}>
                          {p.initials}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{p.prenom} {p.nom}</div>
                          <div style={{ fontSize:11, color:t.muted, marginTop:1 }}>
                            {p.sexe==="M"?"M.":"Mme"} · {p.experience}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Matricule */}
                    <td style={{ padding:"13px 16px" }} onClick={()=>setSelected(p)}>
                      <span style={{ fontSize:11, fontWeight:700, color:t.blue, background:t.blueSoft, padding:"2px 8px", borderRadius:6 }}>{p.matricule}</span>
                    </td>

                    {/* Matières */}
                    <td style={{ padding:"13px 16px" }} onClick={()=>setSelected(p)}>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                        {p.matieres.map(m=>(
                          <span key={m} style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20, background:`${matiereColor(m)}15`, color:matiereColor(m) }}>{m}</span>
                        ))}
                      </div>
                    </td>

                    {/* Classes */}
                    <td style={{ padding:"13px 16px" }} onClick={()=>setSelected(p)}>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                        {p.classes.slice(0,2).map(c=>(
                          <span key={c} style={{ fontSize:10, fontWeight:500, padding:"2px 6px", borderRadius:20, background:"#f3f4f6", color:t.sub }}>{c}</span>
                        ))}
                        {p.classes.length>2&&<span style={{ fontSize:10, color:t.muted }}>+{p.classes.length-2}</span>}
                      </div>
                    </td>

                    {/* Téléphone */}
                    <td style={{ padding:"13px 16px", fontSize:13, color:t.sub }} onClick={()=>setSelected(p)}>{p.telephone}</td>

                    {/* Recrutement */}
                    <td style={{ padding:"13px 16px", fontSize:13, color:t.sub }} onClick={()=>setSelected(p)}>{p.dateRecrutement}</td>

                    {/* Statut */}
                    <td style={{ padding:"13px 16px" }} onClick={()=>setSelected(p)}>
                      <Chip label={si.label} c={si.c} bg={si.bg} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding:"13px 14px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={e=>{e.stopPropagation();openEdit(p);}} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 9px", border:`1px solid ${t.border}`, borderRadius:7, background:t.surface, fontSize:11, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font }}>
                          <i className="ti ti-edit" style={{ fontSize:12 }} /> Modifier
                        </button>
                        <button onClick={e=>{e.stopPropagation();setDelId(p.id);}} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 9px", border:`1px solid #fecaca`, borderRadius:7, background:t.redSoft, fontSize:11, fontWeight:600, cursor:"pointer", color:t.red, fontFamily:t.font }}>
                          <i className="ti ti-archive" style={{ fontSize:12 }} /> Archiver
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0&&(
                <tr><td colSpan={8} style={{ padding:48, textAlign:"center", color:t.muted, fontSize:13 }}>
                  <i className="ti ti-search" style={{ fontSize:28, display:"block", marginBottom:10, color:t.border }} />
                  Aucun professeur trouvé
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length>0&&(
          <div style={{ padding:"11px 18px", borderTop:`1px solid ${t.border}`, background:t.bg, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:12, color:t.muted }}>{filtered.length} professeur{filtered.length>1?"s":""} affiché{filtered.length>1?"s":""}</span>
            <span style={{ fontSize:12, color:t.blue, fontWeight:500, cursor:"pointer" }}>Exporter →</span>
          </div>
        )}
      </div>

      {/* MODAL AJOUTER / MODIFIER */}
      {modal && <ProfModal initial={editProf} onClose={()=>{setModal(false);setEditProf(null);}} onSave={handleSave} />}

      {/* MODAL ARCHIVER */}
      {delId && (
        <ModalOverlay>
          <div style={{ background:t.surface, borderRadius:16, padding:28, width:"min(360px,90vw)", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:t.amberSoft, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
              <i className="ti ti-archive" style={{ fontSize:20, color:t.amber }} />
            </div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, marginBottom:8 }}>Archiver le professeur</h3>
            <p style={{ fontSize:13, color:t.sub, margin:"0 0 20px" }}>
              Voulez-vous archiver <strong>{profs.find(p=>p.id===delId)?.prenom} {profs.find(p=>p.id===delId)?.nom}</strong> ?
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setDelId(null)} style={{ flex:1, padding:"10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
              <button onClick={confirmDelete} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:t.amber, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font }}>Archiver</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}