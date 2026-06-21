import { useState } from "react";

/* ─── THEME ──────────────────────────────────────────────────── */
const t = {
  bg:       "#f7f8fa",
  surface:  "#ffffff",
  border:   "#eaecf0",
  blue:     "#2563eb",
  blueSoft: "#eff6ff",
  blueMid:  "#dbeafe",
  text:     "#111827",
  sub:      "#6b7280",
  muted:    "#9ca3af",
  green:    "#059669",
  greenSoft:"#f0fdf4",
  amber:    "#d97706",
  amberSoft:"#fffbeb",
  red:      "#dc2626",
  redSoft:  "#fef2f2",
  radius:   "10px",
  radiusLg: "14px",
  shadow:   "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.07)",
  font:     "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── DATA ───────────────────────────────────────────────────── */
const DATA = [
  {
    id:1, prenom:"Aminata", nom:"Diallo", sexe:"F",
    dateNaissance:"12/03/2006", classe:"Terminale A",
    numero:"621 00 11 22", email:"aminata.diallo@email.com",
    tuteur:"Mamadou Diallo", numeroTuteur:"622 11 22 33",
    adresse:"Ratoma, Conakry", matricule:"SCX-2024-001",
    status:"Actif", initials:"AD", moyenne:15.2,
    notes:[
      {matiere:"Mathématiques",prof:"Dr. Mamadou Diallo",note:16,coef:5},
      {matiere:"Français",     prof:"Mme Fatoumata Bah", note:14,coef:4},
      {matiere:"Physique",     prof:"M. Ousmane Kouyaté",note:15,coef:4},
      {matiere:"Anglais",      prof:"Mme Aïssatou Sow",  note:17,coef:3},
    ],
    presences:{present:42,absent:3,retard:2,total:47},
    paiements:{total:1500000,paye:1000000,historique:[
      {date:"02/01/2025",montant:500000,mode:"Espèces", status:"Payé"},
      {date:"05/02/2025",montant:500000,mode:"Mobile",  status:"Payé"},
      {date:"01/03/2025",montant:500000,mode:"Virement",status:"En attente"},
    ]},
  },
  {
    id:2, prenom:"Mamadou", nom:"Bah", sexe:"M",
    dateNaissance:"25/07/2009", classe:"3ème B",
    numero:"622 33 44 55", email:"mamadou.bah@email.com",
    tuteur:"Ibrahima Bah", numeroTuteur:"623 44 55 66",
    adresse:"Kaloum, Conakry", matricule:"SCX-2024-002",
    status:"Actif", initials:"MB", moyenne:12.0,
    notes:[
      {matiere:"Mathématiques",prof:"Dr. Mamadou Diallo",note:11,coef:5},
      {matiere:"Français",     prof:"Mme Fatoumata Bah", note:13,coef:4},
      {matiere:"Histoire-Géo", prof:"M. Ibrahima Camara",note:12,coef:3},
    ],
    presences:{present:38,absent:7,retard:4,total:49},
    paiements:{total:1200000,paye:600000,historique:[
      {date:"03/01/2025",montant:600000,mode:"Espèces",status:"Payé"},
      {date:"01/02/2025",montant:600000,mode:"Mobile", status:"En attente"},
    ]},
  },
  {
    id:3, prenom:"Fatoumata", nom:"Camara", sexe:"F",
    dateNaissance:"08/11/2008", classe:"Seconde C",
    numero:"623 55 66 77", email:"fatoumata.c@email.com",
    tuteur:"Sékou Camara", numeroTuteur:"624 66 77 88",
    adresse:"Matam, Conakry", matricule:"SCX-2024-003",
    status:"Actif", initials:"FC", moyenne:14.6,
    notes:[
      {matiere:"Mathématiques",prof:"Dr. Mamadou Diallo",  note:14,coef:5},
      {matiere:"SVT",          prof:"Mme Kadiatou Traoré", note:16,coef:3},
      {matiere:"Physique",     prof:"M. Ousmane Kouyaté",  note:13,coef:4},
    ],
    presences:{present:44,absent:1,retard:1,total:46},
    paiements:{total:1350000,paye:1350000,historique:[
      {date:"02/01/2025",montant:675000,mode:"Espèces",status:"Payé"},
      {date:"03/02/2025",montant:675000,mode:"Mobile", status:"Payé"},
    ]},
  },
  {
    id:4, prenom:"Ibrahima", nom:"Sow", sexe:"M",
    dateNaissance:"15/05/2005", classe:"Terminale D",
    numero:"624 77 88 99", email:"ibrahima.sow@email.com",
    tuteur:"Oumar Sow", numeroTuteur:"625 88 99 00",
    adresse:"Dixinn, Conakry", matricule:"SCX-2024-004",
    status:"Inactif", initials:"IS", moyenne:8.0,
    notes:[
      {matiere:"Mathématiques",prof:"Dr. Mamadou Diallo",note:7,coef:5},
      {matiere:"Français",     prof:"Mme Fatoumata Bah", note:9,coef:4},
    ],
    presences:{present:25,absent:20,retard:8,total:53},
    paiements:{total:1500000,paye:0,historique:[]},
  },
  {
    id:5, prenom:"Mariama", nom:"Kouyaté", sexe:"F",
    dateNaissance:"20/09/2007", classe:"1ère S",
    numero:"625 11 22 33", email:"mariama.k@email.com",
    tuteur:"Lansana Kouyaté", numeroTuteur:"626 22 33 44",
    adresse:"Lambanyi, Conakry", matricule:"SCX-2024-005",
    status:"Actif", initials:"MK", moyenne:17.2,
    notes:[
      {matiere:"SVT",           prof:"Mme Kadiatou Traoré",note:18,coef:3},
      {matiere:"Mathématiques", prof:"Dr. Mamadou Diallo", note:16,coef:5},
      {matiere:"Physique",      prof:"M. Ousmane Kouyaté", note:17,coef:4},
    ],
    presences:{present:45,absent:0,retard:1,total:46},
    paiements:{total:1400000,paye:1400000,historique:[
      {date:"02/01/2025",montant:1400000,mode:"Virement",status:"Payé"},
    ]},
  },
];

/* ─── HELPERS ────────────────────────────────────────────────── */
const noteColor = (n) =>
  n >= 16 ? t.green : n >= 12 ? t.blue : n >= 10 ? t.amber : t.red;

const noteLabel = (n) =>
  n >= 16 ? "Excellent" : n >= 14 ? "Très bien" : n >= 12 ? "Bien" : n >= 10 ? "Passable" : "Insuffisant";

const noteBg = (n) =>
  n >= 16 ? t.greenSoft : n >= 12 ? t.blueSoft : n >= 10 ? t.amberSoft : t.redSoft;

const pStatusColor = (s) =>
  s === "Payé" ? {c:t.green,bg:t.greenSoft} : s === "En attente" ? {c:t.amber,bg:t.amberSoft} : {c:t.red,bg:t.redSoft};

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
const Chip = ({label, c, bg}) => (
  <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:bg,color:c,whiteSpace:"nowrap"}}>
    {label}
  </span>
);

const Divider = () => (
  <div style={{height:1,background:t.border,margin:"0"}} />
);

const InfoItem = ({icon,label,value}) => (
  <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:`1px solid ${t.border}`}}>
    <i className={`ti ${icon}`} style={{fontSize:15,color:t.muted,marginTop:1,width:16,flexShrink:0}} />
    <div>
      <div style={{fontSize:10,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px",marginBottom:2}}>{label}</div>
      <div style={{fontSize:13,color:t.text,fontWeight:500}}>{value}</div>
    </div>
  </div>
);

const ProgressBar = ({value, color=t.blue, bg=t.border, height=6}) => (
  <div style={{height,background:bg,borderRadius:99,overflow:"hidden"}}>
    <div style={{width:`${Math.min(value,100)}%`,height:"100%",background:color,borderRadius:99,transition:"width .6s ease"}} />
  </div>
);

const TabBtn = ({active,icon,label,onClick}) => (
  <button onClick={onClick} style={{
    display:"flex",alignItems:"center",gap:7,
    padding:"11px 18px",border:"none",
    borderBottom:active?`2px solid ${t.blue}`:"2px solid transparent",
    background:"transparent",cursor:"pointer",
    fontFamily:t.font,fontSize:13,fontWeight:active?600:400,
    color:active?t.blue:t.sub,
    transition:"all .15s",whiteSpace:"nowrap",
    marginBottom:-1,
  }}>
    <i className={`ti ${icon}`} style={{fontSize:14}} />
    {label}
  </button>
);

const ActionBtn = ({icon,label,primary,onClick}) => (
  <button onClick={onClick} style={{
    display:"flex",alignItems:"center",gap:7,
    padding:"9px 16px",border:primary?"none":`1px solid ${t.border}`,
    borderRadius:t.radius,cursor:"pointer",
    fontFamily:t.font,fontSize:13,fontWeight:500,
    background:primary?t.blue:t.surface,
    color:primary?"#fff":t.sub,
    boxShadow:primary?`0 2px 8px rgba(37,99,235,0.25)`:t.shadow,
    transition:"all .15s",
  }}
    onMouseEnter={e=>{e.currentTarget.style.opacity=".88";e.currentTarget.style.transform="translateY(-1px)"}}
    onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"}}
  >
    <i className={`ti ${icon}`} style={{fontSize:14}} />
    {label}
  </button>
);

/* ─── STAT MINI ──────────────────────────────────────────────── */
const StatBox = ({icon,label,value,c=t.blue,bg=t.blueSoft}) => (
  <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,boxShadow:t.shadow}}>
    <div style={{width:40,height:40,borderRadius:9,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <i className={`ti ${icon}`} style={{fontSize:19,color:c}} />
    </div>
    <div>
      <div style={{fontSize:11,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px"}}>{label}</div>
      <div style={{fontSize:21,fontWeight:700,color:t.text,marginTop:3,lineHeight:1}}>{value}</div>
    </div>
  </div>
);

/* ─── PROFIL ÉLÈVE ───────────────────────────────────────────── */
function Profil({eleve, onRetour}) {
  const [tab, setTab] = useState("notes");
  const reste  = eleve.paiements.total - eleve.paiements.paye;
  const tPres  = Math.round((eleve.presences.present / (eleve.presences.total||1)) * 100);
  const tPaie  = Math.round((eleve.paiements.paye   / (eleve.paiements.total||1)) * 100);
  const moy    = eleve.notes.length
    ? (eleve.notes.reduce((a,n)=>a+n.note*n.coef,0) / eleve.notes.reduce((a,n)=>a+n.coef,0)).toFixed(2)
    : "—";

  const downloadBulletin = () => {
    const txt = [
      "BULLETIN DE NOTES — SchoolX",
      `Année scolaire 2024/2025`,
      "─".repeat(44),
      `Nom      : ${eleve.prenom} ${eleve.nom}`,
      `Matricule: ${eleve.matricule}`,
      `Classe   : ${eleve.classe}`,
      "─".repeat(44),
      ...eleve.notes.map(n=>`${n.matiere.padEnd(22)} ${String(n.note).padStart(2)}/20  ×${n.coef}  ${noteLabel(n.note)}`),
      "─".repeat(44),
      `Moyenne pondérée : ${moy}/20`,
      `Présences        : ${eleve.presences.present}/${eleve.presences.total} (${tPres}%)`,
      "─".repeat(44),
      `Généré le ${new Date().toLocaleDateString("fr-FR")} — SchoolX`,
    ].join("\n");
    const a = Object.assign(document.createElement("a"),{
      href:URL.createObjectURL(new Blob([txt],{type:"text/plain;charset=utf-8"})),
      download:`Bulletin_${eleve.prenom}_${eleve.nom}.txt`,
    });
    a.click();
  };

  return (
     <div style={{fontFamily:t.font,color:t.text,maxWidth:"860px",margin:"0 auto"}}>

      {/* ── TOP BAR ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <ActionBtn icon="ti-arrow-left" label="Retour" primary onClick={onRetour} />
        <div style={{display:"flex",gap:8}}>
          <ActionBtn icon="ti-archive" label="Archiver" />
          <ActionBtn icon="ti-folder"  label="Dossier"  />
        </div>
      </div>

      {/* ── HERO CARD ── */}
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden",marginBottom:14}}>

        {/* Bande top */}

        <div style={{padding:"16px 18px 14px"}}>
          {/* Avatar + identité */}
          <div style={{display:"flex",alignItems:"flex-start",gap:18,flexWrap:"wrap",marginBottom:20}}>
            <div style={{
              width:52,height:52,fontSize:18,borderRadius:"50%",flexShrink:0,
              background:`linear-gradient(135deg,${t.blueMid},${t.blueSoft})`,
              border:`2px solid ${t.blueMid}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:22,fontWeight:700,color:t.blue,
              boxShadow:"0 2px 10px rgba(37,99,235,0.15)",
            }}>{eleve.initials}</div>

            <div style={{flex:1,minWidth:0}}>
              <h2 style={{margin:0,fontSize:20,fontWeight:700,color:t.text,lineHeight:1.2}}>
                {eleve.prenom} {eleve.nom}
              </h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
                <span style={{
                  fontSize:12,fontWeight:700,color:t.blue,
                  background:t.blueSoft,border:`1px solid ${t.blueMid}`,
                  padding:"3px 10px",borderRadius:6,letterSpacing:".3px",
                }}>
                  <i className="ti ti-id-badge" style={{marginRight:5,fontSize:11}} />
                  {eleve.matricule}
                </span>
                <Chip label={eleve.classe}    c={t.sub}  bg="#f3f4f6" />
                <Chip label={`Moy. ${moy}/20`} c={parseFloat(moy)>=12?t.green:t.amber} bg={parseFloat(moy)>=12?t.greenSoft:t.amberSoft} />
                <Chip label={eleve.status} c={eleve.status==="Actif"?t.green:t.red} bg={eleve.status==="Actif"?t.greenSoft:t.redSoft} />
              </div>
            </div>
          </div>

          <Divider />

          {/* Infos grille */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"0 32px",marginTop:4}}>
            <div>
              <InfoItem icon="ti-user"      label="Sexe"           value={eleve.sexe==="M"?"Masculin":"Féminin"} />
              <InfoItem icon="ti-calendar"  label="Date naissance"  value={eleve.dateNaissance} />
              <InfoItem icon="ti-phone"     label="Téléphone"       value={eleve.numero} />
            </div>
            <div>
              <InfoItem icon="ti-mail"      label="Email"           value={eleve.email} />
              <InfoItem icon="ti-map-pin"   label="Adresse"         value={eleve.adresse} />
              <InfoItem icon="ti-users"     label="Tuteur"          value={`${eleve.tuteur} — ${eleve.numeroTuteur}`} />
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",gap:0,borderBottom:`1px solid ${t.border}`,marginBottom:16,overflowX:"auto"}}>
        {[
          {key:"notes",    icon:"ti-clipboard-list",label:"Notes"},
          {key:"presence", icon:"ti-calendar-check", label:"Présence"},
          {key:"paiement", icon:"ti-credit-card",    label:"Paiement"},
          {key:"bulletin", icon:"ti-file-text",       label:"Bulletin"},
        ].map(tb=>(
          <TabBtn key={tb.key} active={tab===tb.key} icon={tb.icon} label={tb.label} onClick={()=>setTab(tb.key)} />
        ))}
      </div>

      {/* ═══ NOTES ═══ */}
      {tab==="notes" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:14}}>
            <StatBox icon="ti-chart-bar"  label="Moyenne" value={`${moy}/20`} c={t.blue} bg={t.blueSoft} />
            <StatBox icon="ti-book"       label="Matières" value={eleve.notes.length} c="#7c3aed" bg="#f5f3ff" />
            <StatBox icon="ti-trophy"     label="Meilleure" value={`${Math.max(...eleve.notes.map(n=>n.note))}/20`} c={t.amber} bg={t.amberSoft} />
          </div>

          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,fontWeight:600,color:t.text}}>Relevé de notes</span>
              <span style={{fontSize:12,color:t.blue,fontWeight:600,background:t.blueSoft,padding:"3px 10px",borderRadius:20}}>
                Moy. pondérée : {moy}/20
              </span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:460}}>
                <thead>
                  <tr style={{background:t.bg}}>
                    {["Matière","Professeur","Note","Coef.","Appréciation"].map(h=>(
                      <th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:11,fontWeight:600,color:t.muted,textTransform:"uppercase",letterSpacing:".4px",borderBottom:`1px solid ${t.border}`}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eleve.notes.map((n,i)=>(
                    <tr key={i}
                      style={{borderBottom:`1px solid ${t.border}`,transition:"background .12s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{padding:"13px 16px",fontSize:13,fontWeight:600,color:t.text}}>{n.matiere}</td>
                      <td style={{padding:"13px 16px",fontSize:13,color:t.sub}}>{n.prof}</td>
                      <td style={{padding:"13px 16px"}}>
                        <span style={{fontSize:15,fontWeight:700,color:noteColor(n.note)}}>{n.note}</span>
                        <span style={{fontSize:11,color:t.muted}}>/20</span>
                      </td>
                      <td style={{padding:"13px 16px",fontSize:12,color:t.muted}}>×{n.coef}</td>
                      <td style={{padding:"13px 16px"}}>
                        <Chip label={noteLabel(n.note)} c={noteColor(n.note)} bg={noteBg(n.note)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PRÉSENCE ═══ */}
      {tab==="presence" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:14}}>
            <StatBox icon="ti-circle-check" label="Présences" value={eleve.presences.present} c={t.green}  bg={t.greenSoft} />
            <StatBox icon="ti-circle-x"     label="Absences"  value={eleve.presences.absent}  c={t.red}    bg={t.redSoft}   />
            <StatBox icon="ti-clock"        label="Retards"   value={eleve.presences.retard}  c={t.amber}  bg={t.amberSoft} />
            <StatBox icon="ti-percentage"   label="Taux"      value={`${tPres}%`}             c={t.blue}   bg={t.blueSoft}  />
          </div>

          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,padding:"20px 22px",boxShadow:t.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:14,fontWeight:600,color:t.text}}>Taux de présence</span>
              <span style={{fontSize:15,fontWeight:700,color:tPres>=80?t.green:t.red}}>{tPres}%</span>
            </div>
            <ProgressBar value={tPres} color={tPres>=80?t.green:t.red} bg="#f3f4f6" height={8} />
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12,color:t.muted}}>
              <span>{eleve.presences.present} jours présent</span>
              <span>{eleve.presences.total} jours au total</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PAIEMENT ═══ */}
      {tab==="paiement" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:14}}>
            <StatBox icon="ti-receipt"      label="Frais totaux"  value={`${(eleve.paiements.total/1e6).toFixed(2)}M GNF`} c={t.blue}  bg={t.blueSoft}  />
            <StatBox icon="ti-circle-check" label="Montant payé"  value={`${(eleve.paiements.paye/1e6).toFixed(2)}M GNF`}  c={t.green} bg={t.greenSoft} />
            <StatBox icon="ti-alert-circle" label="Reste à payer" value={`${(reste/1e6).toFixed(2)}M GNF`}                 c={reste>0?t.red:t.green} bg={reste>0?t.redSoft:t.greenSoft} />
          </div>

          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,padding:"18px 20px",boxShadow:t.shadow,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:14,fontWeight:600,color:t.text}}>Progression du paiement</span>
              <span style={{fontSize:15,fontWeight:700,color:t.blue}}>{tPaie}%</span>
            </div>
            <ProgressBar value={tPaie} color={t.blue} bg="#f3f4f6" height={8} />
          </div>

          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,overflow:"hidden",boxShadow:t.shadow}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.border}`,fontSize:14,fontWeight:600,color:t.text}}>
              Historique des paiements
            </div>
            {eleve.paiements.historique.length===0
              ? <div style={{padding:32,textAlign:"center",fontSize:13,color:t.muted}}>Aucun paiement enregistré</div>
              : (
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",minWidth:380}}>
                    <thead>
                      <tr style={{background:t.bg}}>
                        {["Date","Montant","Mode","Statut"].map(h=>(
                          <th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:11,fontWeight:600,color:t.muted,textTransform:"uppercase",letterSpacing:".4px",borderBottom:`1px solid ${t.border}`}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {eleve.paiements.historique.map((p,i)=>{
                        const ps = pStatusColor(p.status);
                        return (
                          <tr key={i} style={{borderBottom:`1px solid ${t.border}`}}>
                            <td style={{padding:"12px 16px",fontSize:13,color:t.sub}}>{p.date}</td>
                            <td style={{padding:"12px 16px",fontSize:13,fontWeight:600,color:t.text}}>{p.montant.toLocaleString()} GNF</td>
                            <td style={{padding:"12px 16px",fontSize:13,color:t.sub}}>{p.mode}</td>
                            <td style={{padding:"12px 16px"}}>
                              <Chip label={p.status} c={ps.c} bg={ps.bg} />
                            </td>
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

      {/* ═══ BULLETIN ═══ */}
      {tab==="bulletin" && (
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,overflow:"hidden",boxShadow:t.shadow}}>
          <div style={{background:t.bg,padding:"16px 22px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:18,fontWeight:700,color:"t.text"}}>SchoolX</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:3}}>Bulletin de notes — 2024/2025</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"t.sub"}}>Émis le</div>
              <div style={{fontSize:13,fontWeight:600,color:"t.text"}}>{new Date().toLocaleDateString("fr-FR")}</div>
            </div>
          </div>

          <div style={{padding:"22px 26px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8,padding:"14px 16px",background:t.bg,borderRadius:10,marginBottom:20,border:`1px solid ${t.border}`}}>
              {[
                ["Nom complet",`${eleve.prenom} ${eleve.nom}`],
                ["Matricule",eleve.matricule],
                ["Classe",eleve.classe],
                ["Sexe",eleve.sexe==="M"?"Masculin":"Féminin"],
                ["Présences",`${eleve.presences.present}/${eleve.presences.total}`],
                ["Moyenne",`${moy}/20`],
              ].map(([l,v])=>(
                <div key={l} style={{display:"flex",gap:8}}>
                  <span style={{fontSize:11,color:t.muted,minWidth:80,flexShrink:0,fontWeight:500}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:700,color:t.text}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{overflowX:"auto",marginBottom:22}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:380}}>
                <thead>
                  <tr style={{background:t.blue}}>
                    {["Matière","Note","Coef.","Appréciation"].map(h=>(
                      <th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.9)",textTransform:"uppercase",letterSpacing:".4px"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eleve.notes.map((n,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${t.border}`,background:i%2===0?t.surface:t.bg}}>
                      <td style={{padding:"12px 14px",fontSize:13,fontWeight:600,color:t.text}}>{n.matiere}</td>
                      <td style={{padding:"12px 14px"}}>
                        <span style={{fontSize:14,fontWeight:700,color:noteColor(n.note)}}>{n.note}/20</span>
                      </td>
                      <td style={{padding:"12px 14px",fontSize:12,color:t.muted}}>×{n.coef}</td>
                      <td style={{padding:"12px 14px"}}>
                        <Chip label={noteLabel(n.note)} c={noteColor(n.note)} bg={noteBg(n.note)} />
                      </td>
                    </tr>
                  ))}
                  <tr style={{background:t.blueSoft,borderTop:`2px solid ${t.blue}`}}>
                    <td style={{padding:"13px 14px",fontSize:13,fontWeight:700,color:t.text}}>Moyenne pondérée</td>
                    <td style={{padding:"13px 14px"}}>
                      <span style={{fontSize:15,fontWeight:700,color:t.blue}}>{moy}/20</span>
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{display:"flex",justifyContent:"center"}}>
              <ActionBtn icon="ti-download" label="Générer le bulletin" primary onClick={downloadBulletin} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── LISTE PRINCIPALE ───────────────────────────────────────── */
export default function Eleves() {
  const [search,   setSearch]   = useState("");
  const [filtre,   setFiltre]   = useState("Tous");
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(false);
  const [eleves,   setEleves]   = useState(DATA);
  const [form, setForm] = useState({
    prenom:"",nom:"",sexe:"M",dateNaissance:"",
    classe:"",numero:"",email:"",
    tuteur:"",numeroTuteur:"",adresse:"",
  });

  const classes  = ["Tous",...new Set(DATA.map(e=>e.classe))];
  const filtered = eleves.filter(e=>{
    const m = `${e.prenom} ${e.nom}`.toLowerCase().includes(search.toLowerCase());
    const c = filtre==="Tous" || e.classe===filtre;
    return m&&c;
  });

  const add = () => {
    if(!form.prenom||!form.nom) return;
    setEleves([...eleves,{
      ...form,
      id:eleves.length+1,
      initials:`${form.prenom[0]}${form.nom[0]}`.toUpperCase(),
      matricule:`SCX-2024-00${eleves.length+1}`,
      status:"Actif", moyenne:0,
      notes:[], presences:{present:0,absent:0,retard:0,total:0},
      paiements:{total:0,paye:0,historique:[]},
    }]);
    setForm({prenom:"",nom:"",sexe:"M",dateNaissance:"",classe:"",numero:"",email:"",tuteur:"",numeroTuteur:"",adresse:""});
    setModal(false);
  };

  if(selected) return <Profil eleve={selected} onRetour={()=>setSelected(null)} />;

  const total    = eleves.length;
  const actifs   = eleves.filter(e=>e.status==="Actif").length;
  const moyGen   = eleves.filter(e=>e.moyenne>0).length
    ? (eleves.filter(e=>e.moyenne>0).reduce((a,e)=>a+e.moyenne,0)/eleves.filter(e=>e.moyenne>0).length).toFixed(1)
    : "—";

  return (
    <div style={{fontFamily:t.font,color:t.text}}>

      {/* ── HEADER ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,margin:0,color:t.text}}>Élèves</h1>
          <p style={{fontSize:13,color:t.sub,marginTop:4,margin:0}}>
            Gérez les informations académiques de vos élèves
          </p>
        </div>
        <ActionBtn icon="ti-plus" label="Nouvel élève" primary onClick={()=>setModal(true)} />
      </div>

      {/* ── STATS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
        <StatBox icon="ti-users"        label="Total élèves"     value={total}        c={t.blue}  bg={t.blueSoft}  />
        <StatBox icon="ti-circle-check" label="Élèves actifs"    value={actifs}       c={t.green} bg={t.greenSoft} />
        <StatBox icon="ti-school"       label="Classes"          value={classes.length-1} c="#7c3aed" bg="#f5f3ff" />
        <StatBox icon="ti-chart-bar"    label="Moyenne générale" value={`${moyGen}/20`} c={t.amber} bg={t.amberSoft} />
      </div>

      {/* ── FILTRES ── */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 200px",minWidth:0}}>
          <i className="ti ti-search" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:t.muted,fontSize:15}} />
          <input type="text" placeholder="Rechercher un élève..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:"100%",padding:"10px 12px 10px 36px",border:`1px solid ${t.border}`,borderRadius:t.radius,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:t.font,color:t.text,background:t.surface,boxShadow:t.shadow}}
            onFocus={e=>e.currentTarget.style.borderColor=t.blue}
            onBlur={e=>e.currentTarget.style.borderColor=t.border}
          />
        </div>
        <select value={filtre} onChange={e=>setFiltre(e.target.value)}
          style={{padding:"10px 14px",border:`1px solid ${t.border}`,borderRadius:t.radius,fontSize:13,fontFamily:t.font,outline:"none",background:t.surface,cursor:"pointer",color:t.text,boxShadow:t.shadow,flexShrink:0}}>
          {classes.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── TABLE ── */}
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
            <thead>
              <tr style={{background:t.bg}}>
                {["Élève","Classe","Contact","Présence","Moyenne","Statut",""].map(h=>(
                  <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:600,color:t.muted,textTransform:"uppercase",letterSpacing:".4px",borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e,i)=>{
                const taux = Math.round((e.presences.present/(e.presences.total||1))*100);
                return (
                  <tr key={e.id} onClick={()=>setSelected(e)}
                    style={{borderBottom:`1px solid ${t.border}`,cursor:"pointer",transition:"background .12s"}}
                    onMouseEnter={el=>el.currentTarget.style.background=t.bg}
                    onMouseLeave={el=>el.currentTarget.style.background="transparent"}
                  >
                    {/* Élève */}
                    <td style={{padding:"13px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{
                          width:38,height:38,borderRadius:"50%",flexShrink:0,
                          background:t.blueSoft,border:`1px solid ${t.blueMid}`,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:12,fontWeight:700,color:t.blue,
                        }}>{e.initials}</div>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:t.text}}>{e.prenom} {e.nom}</div>
                          <div style={{fontSize:11,color:t.muted,marginTop:1}}>{e.matricule}</div>
                        </div>
                      </div>
                    </td>

                    {/* Classe */}
                    <td style={{padding:"13px 16px",fontSize:13,fontWeight:500,color:t.text,whiteSpace:"nowrap"}}>{e.classe}</td>

                    {/* Contact */}
                    <td style={{padding:"13px 16px"}}>
                      <div style={{fontSize:13,color:t.sub}}>{e.numero}</div>
                      <div style={{fontSize:11,color:t.muted,marginTop:1}}>{e.email}</div>
                    </td>

                    {/* Présence */}
                    <td style={{padding:"13px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,minWidth:90}}>
                        <div style={{flex:1,height:4,background:t.border,borderRadius:99,overflow:"hidden"}}>
                          <div style={{width:`${taux}%`,height:"100%",background:taux>=80?t.green:t.amber,borderRadius:99}} />
                        </div>
                        <span style={{fontSize:12,color:t.sub,flexShrink:0}}>{taux}%</span>
                      </div>
                    </td>

                    {/* Moyenne */}
                    <td style={{padding:"13px 16px"}}>
                      <span style={{fontSize:13,fontWeight:700,color:noteColor(e.moyenne)}}>{e.moyenne}/20</span>
                    </td>

                    {/* Statut */}
                    <td style={{padding:"13px 16px"}}>
                      <Chip
                        label={e.status}
                        c={e.status==="Actif"?t.green:t.red}
                        bg={e.status==="Actif"?t.greenSoft:t.redSoft}
                      />
                    </td>

                    {/* Chevron */}
                    <td style={{padding:"13px 12px"}}>
                      <i className="ti ti-chevron-right" style={{fontSize:16,color:t.muted}} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0 && (
                <tr>
                  <td colSpan={7} style={{padding:48,textAlign:"center",color:t.muted,fontSize:13}}>
                    <i className="ti ti-search" style={{fontSize:28,display:"block",marginBottom:10,color:t.border}} />
                    Aucun élève trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer table */}
        {filtered.length>0 && (
          <div style={{padding:"11px 18px",borderTop:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:t.bg}}>
            <span style={{fontSize:12,color:t.muted}}>{filtered.length} élève{filtered.length>1?"s":""} affiché{filtered.length>1?"s":""}</span>
            <span style={{fontSize:12,color:t.blue,fontWeight:500,cursor:"pointer"}}>Exporter →</span>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400}}>
          <div style={{background:t.surface,borderRadius:16,padding:28,width:"min(500px,92vw)",boxShadow:"0 20px 60px rgba(0,0,0,0.18)",maxHeight:"88vh",overflowY:"auto"}}>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <h3 style={{margin:0,fontSize:17,fontWeight:700,color:t.text}}>Nouvel élève</h3>
                <p style={{margin:0,fontSize:12,color:t.muted,marginTop:3}}>Remplissez les informations ci-dessous</p>
              </div>
              <button onClick={()=>setModal(false)} style={{background:t.bg,border:"none",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.sub}}>
                <i className="ti ti-x" style={{fontSize:15}} />
              </button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {label:"Prénom",         key:"prenom",       ph:"Aminata"},
                {label:"Nom",            key:"nom",          ph:"Diallo"},
                {label:"Date naissance", key:"dateNaissance",ph:"12/03/2006"},
                {label:"Classe",         key:"classe",       ph:"Terminale A"},
                {label:"Téléphone",      key:"numero",       ph:"621 00 11 22"},
                {label:"Email",          key:"email",        ph:"aminata@email.com"},
                {label:"Tuteur",         key:"tuteur",       ph:"Mamadou Diallo"},
                {label:"Tél. tuteur",    key:"numeroTuteur", ph:"622 11 22 33"},
              ].map(f=>(
                <div key={f.key}>
                  <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:5}}>{f.label}</label>
                  <input type="text" placeholder={f.ph} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                    style={{width:"100%",padding:"9px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:t.font,color:t.text}}
                    onFocus={e=>e.currentTarget.style.borderColor=t.blue}
                    onBlur={e=>e.currentTarget.style.borderColor=t.border}
                  />
                </div>
              ))}
            </div>

            <div style={{marginTop:12}}>
              <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:5}}>Adresse</label>
              <input type="text" placeholder="Ratoma, Conakry" value={form.adresse} onChange={e=>setForm({...form,adresse:e.target.value})}
                style={{width:"100%",padding:"9px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:t.font,color:t.text}}
                onFocus={e=>e.currentTarget.style.borderColor=t.blue}
                onBlur={e=>e.currentTarget.style.borderColor=t.border}
              />
            </div>

            <div style={{marginTop:12}}>
              <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:5}}>Sexe</label>
              <select value={form.sexe} onChange={e=>setForm({...form,sexe:e.target.value})}
                style={{width:"100%",padding:"9px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:13,outline:"none",fontFamily:t.font,color:t.text}}>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            <div style={{display:"flex",gap:10,marginTop:22}}>
              <button onClick={()=>setModal(false)} style={{flex:1,padding:"10px",border:`1px solid ${t.border}`,borderRadius:9,background:t.surface,fontSize:13,fontWeight:500,cursor:"pointer",color:t.sub,fontFamily:t.font}}>Annuler</button>
              <button onClick={add} style={{flex:1,padding:"10px",border:"none",borderRadius:9,background:t.blue,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:t.font,boxShadow:`0 2px 8px rgba(37,99,235,0.3)`}}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}