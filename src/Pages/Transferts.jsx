import { useState } from "react";
import { CLASSES, getNomComplet, getInitials } from "./studentsData";
import { useToast } from "../context/ToastContext";
import { useNotifications } from "../context/NotificationsContext";
import {
  useSchoolData, ETAPE_FINALE, ETAPE_NOTIFICATION,
  ANNEE_PRECEDENTE, TYPE_SANCTION_ANTERIEURE,
} from "../context/SchoolDataContext";
import { t } from "../theme";

/* ─── DATA ───────────────────────────────────────────────────── */
// Les libellés décrivent l'échange réel entre les deux établissements
const ETAPES = [
  {label:"Demande",                               icon:"ti-file-plus"},
  {label:"Notification envoyée",                  icon:"ti-send"     },
  {label:"Dossier reçu par l'école destination",  icon:"ti-inbox"    },
  {label:"Transfert terminé",                     icon:"ti-check"    },
];

const ETABLISSEMENTS = [
  "Lycée de Coléah",
  "Collège Moderne de Kaloum",
  "Groupe Scolaire Aviation",
  "Collège Sainte-Marie",
  "Lycée de Bonfi",
];

const DEMANDEURS = ["Parent", "Direction"];

const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("fr-FR") : "—";

/* ─── HELPERS ────────────────────────────────────────────────── */
const statutDemande = (d) =>
  d.refus ? "Refusée" : d.etape >= ETAPE_FINALE ? "Terminée" : "En cours";

const statutColor = (statut) => ({
  "En cours":  {c:t.amber, bg:t.amberSoft},
  "Terminée":  {c:t.green, bg:t.greenSoft},
  "Refusée":   {c:t.red,   bg:t.redSoft  },
}[statut] || {c:t.muted, bg:t.bg});

const sensColor = (sens) =>
  sens === "Sortant"
    ? {c:t.purple, bg:t.purpleSoft, icon:"ti-logout"}
    : {c:t.blue,   bg:t.blueSoft,   icon:"ti-login" };

// L'élève d'une demande sortante vient du contexte : il est résolu par la page puis passé en prop
const nomEleve = (d, eleve) => d.sens==="Sortant" ? getNomComplet(eleve) : d.eleveNom;

const initialesEleve = (d, eleve) =>
  d.sens==="Sortant" ? getInitials(eleve) : getInitials({nom:d.eleveNom});

const dateEtape = (d, i) => d.historique.find(h=>h.etape===i)?.date || null;

const inputStyle = (error) => ({
  width:"100%",padding:"9px 12px",
  border:`1px solid ${error?t.red:t.border}`,borderRadius:8,
  fontSize:13,outline:"none",boxSizing:"border-box",
  fontFamily:t.font,color:t.text,background:t.surface,
});

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
const Chip = ({label, c, bg}) => (
  <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:bg,color:c,whiteSpace:"nowrap"}}>
    {label}
  </span>
);

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

const Field = ({label, error, children}) => (
  <div>
    <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:5}}>{label}</label>
    {children}
    {error && <p style={{color:t.red,fontSize:11,marginTop:3}}>{error}</p>}
  </div>
);

const Bandeau = ({icon, c, bg, border, titre, children}) => (
  <div style={{display:"flex",alignItems:"flex-start",gap:11,background:bg,border:`1px solid ${border}`,borderRadius:t.radius,padding:"11px 14px"}}>
    <i className={`ti ${icon}`} style={{fontSize:17,color:c,marginTop:1,flexShrink:0}} />
    <div>
      <div style={{fontSize:12,fontWeight:600,color:c}}>{titre}</div>
      {children && <div style={{fontSize:12,color:t.sub,marginTop:3}}>{children}</div>}
    </div>
  </div>
);

const InfoBloc = ({icon,label,value}) => (
  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
    <i className={`ti ${icon}`} style={{fontSize:15,color:t.muted,marginTop:1,width:16,flexShrink:0}} />
    <div style={{minWidth:0}}>
      <div style={{fontSize:10,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px",marginBottom:2}}>{label}</div>
      <div style={{fontSize:13,color:t.text,fontWeight:500,lineHeight:1.5}}>{value}</div>
    </div>
  </div>
);

/* ─── DOSSIER TRANSMIS ───────────────────────────────────────── */
const sanctionColor = (type) => ({
  "Avertissement":        {c:t.amber,   bg:t.amberSoft},
  "Blâme":                {c:t.amber,   bg:t.amberSoft},
  "Exclusion temporaire": {c:t.red,     bg:t.redSoft  },
  "Exclusion définitive": {c:t.redDark, bg:t.redMid   },
}[type] || {c:t.sub, bg:t.bg});

const EtapeDossier = ({etape, last}) => (
  <div style={{display:"flex",gap:10}}>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
      <div style={{width:24,height:24,borderRadius:"50%",background:t.blueSoft,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <i className="ti ti-school" style={{fontSize:12,color:t.blue}} />
      </div>
      {!last && <div style={{flex:1,width:2,background:t.border,marginTop:3}} />}
    </div>
    <div style={{flex:1,minWidth:0,paddingBottom:last?0:14}}>
      <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
        <span style={{fontSize:12.5,fontWeight:600,color:t.text}}>{etape.classe || "—"}</span>
        <Chip label={etape.evenement} c={t.blue} bg={t.blueSoft} />
      </div>
      <div style={{fontSize:11,color:t.muted,marginTop:3}}>
        {etape.annee} · {etape.etablissement}
      </div>
      {(etape.details || etape.motif) && (
        <div style={{fontSize:11.5,color:t.sub,marginTop:3,lineHeight:1.5}}>{etape.details || etape.motif}</div>
      )}
    </div>
  </div>
);

const SanctionDossier = ({sanction}) => {
  const sc = sanctionColor(sanction.type);
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:9,padding:"9px 11px",background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius}}>
      <i className="ti ti-gavel" style={{fontSize:14,color:sc.c,marginTop:2,flexShrink:0}} />
      <div style={{minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <Chip label={sanction.type} c={sc.c} bg={sc.bg} />
          <span style={{fontSize:11,color:t.muted}}>
            {sanction.dateFait ? `Faits du ${formatDate(sanction.dateFait)}` : "Date non précisée"}
          </span>
        </div>
        <div style={{fontSize:12,color:t.sub,marginTop:4,lineHeight:1.5}}>{sanction.motif}</div>
      </div>
    </div>
  );
};

const DossierTransmis = ({dossier, sens, etablissement}) => {
  const parcours  = dossier?.parcours  || [];
  const sanctions = dossier?.sanctions || [];

  return (
    <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"14px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap",marginBottom:13}}>
        <i className="ti ti-folder" style={{fontSize:15,color:t.blue}} />
        <span style={{fontSize:13,fontWeight:700,color:t.text}}>Dossier transmis</span>
        <span style={{fontSize:11,color:t.muted}}>
          {sens==="Sortant" ? `Envoyé à ${etablissement}` : `Reçu de ${etablissement}`}
        </span>
      </div>

      <div style={{fontSize:10,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px",marginBottom:9}}>
        Parcours scolaire
      </div>
      {parcours.length === 0
        ? <div style={{fontSize:12,color:t.muted,marginBottom:14}}>Aucun parcours renseigné</div>
        : (
          <div style={{marginBottom:16}}>
            {parcours.map((etape,i)=>(
              <EtapeDossier key={`${etape.annee}-${i}`} etape={etape} last={i===parcours.length-1} />
            ))}
          </div>
        )
      }

      <div style={{fontSize:10,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px",marginBottom:9}}>
        Historique de sanctions ({sanctions.length})
      </div>
      {sanctions.length === 0
        ? <div style={{fontSize:12,color:t.muted}}>Aucune sanction au dossier</div>
        : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {sanctions.map((s,i)=><SanctionDossier key={s.id||i} sanction={s} />)}
          </div>
        )
      }
    </div>
  );
};

/* ─── STEPPER ────────────────────────────────────────────────── */
const Stepper = ({demande}) => {
  const bloque = !!demande.refus;

  return (
    <div style={{display:"flex",alignItems:"flex-start",overflowX:"auto",padding:"2px 0 4px"}}>
      {ETAPES.map((etape,i)=>{
        const franchie = i <= demande.etape;                       // étape réalisée
        const courante = !bloque && i === demande.etape + 1;       // étape attendue
        const refusee  = bloque && i === demande.refus.etape + 1;  // étape où le refus est tombé

        const c  = refusee ? t.red : franchie ? t.green : courante ? t.blue : t.muted;
        const bg = refusee ? t.redSoft : franchie ? t.greenSoft : courante ? t.blueSoft : t.bg;

        return (
          <div key={etape.label} style={{flex:1,minWidth:120,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
            {/* Trait de liaison */}
            {i>0 && (
              <div style={{
                position:"absolute",top:15,right:"50%",width:"100%",height:2,
                background:(!bloque && i<=demande.etape)?t.greenMid:t.border,
              }} />
            )}

            <div style={{
              width:32,height:32,borderRadius:"50%",background:bg,
              border:`2px solid ${courante||refusee?c:(franchie?t.greenMid:t.border)}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              position:"relative",zIndex:1,flexShrink:0,
            }}>
              <i className={`ti ${refusee?"ti-x":franchie?"ti-check":etape.icon}`} style={{fontSize:15,color:c}} />
            </div>

            <div style={{
              fontSize:11,fontWeight:courante?700:600,textAlign:"center",marginTop:7,
              color:courante?t.blue:franchie?t.text:t.muted,lineHeight:1.3,padding:"0 4px",
            }}>
              {etape.label}
            </div>
            <div style={{fontSize:10,color:refusee?t.red:t.muted,marginTop:2}}>
              {franchie ? formatDate(dateEtape(demande,i))
                : refusee ? `refusé le ${formatDate(demande.refus.date)}`
                : courante ? "en attente" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── LIGNE REPLIABLE ────────────────────────────────────────── */
const DemandeRow = ({demande, eleve, ouvert, onToggle, onValider, onRefuser}) => {
  const statut   = statutDemande(demande);
  const sc       = statutColor(statut);
  const sens     = sensColor(demande.sens);
  const terminee = statut==="Terminée";
  const encours  = statut==="En cours";

  return (
    <div style={{borderBottom:`1px solid ${t.border}`}}>
      {/* En-tête cliquable */}
      <div onClick={onToggle}
        style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",cursor:"pointer",transition:"background .12s",background:ouvert?t.bg:"transparent"}}
        onMouseEnter={e=>e.currentTarget.style.background=t.bg}
        onMouseLeave={e=>e.currentTarget.style.background=ouvert?t.bg:"transparent"}
      >
        <div style={{
          width:36,height:36,borderRadius:"50%",flexShrink:0,
          background:sens.bg,border:`1px solid ${t.border}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:12,fontWeight:700,color:sens.c,
        }}>{initialesEleve(demande, eleve)}</div>

        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,color:t.text}}>{nomEleve(demande, eleve)}</div>
          <div style={{fontSize:11,color:t.muted,marginTop:1}}>
            {demande.classe} · {demande.sens==="Sortant" ? "vers" : "depuis"} {demande.etablissement}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
          <Chip label={demande.sens} c={sens.c} bg={sens.bg} />
          <Chip label={statut}       c={sc.c}   bg={sc.bg}   />
          <i className={`ti ${ouvert?"ti-chevron-up":"ti-chevron-down"}`} style={{fontSize:16,color:t.muted}} />
        </div>
      </div>

      {/* Détail déplié */}
      {ouvert && (
        <div style={{padding:"14px 18px 18px",background:t.bg,display:"flex",flexDirection:"column",gap:16}}>

          <Stepper demande={demande} />

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
            <InfoBloc icon="ti-user-check" label="À l'initiative de" value={demande.demandeur} />
            <InfoBloc icon="ti-building"
              label={demande.sens==="Sortant" ? "Établissement de destination" : "Établissement d'origine"}
              value={demande.etablissement} />
            <InfoBloc icon="ti-calendar-event" label="Date de la demande" value={formatDate(dateEtape(demande,0))} />
          </div>

          <InfoBloc icon="ti-message-report" label="Motif" value={demande.motif} />

          {demande.refus && (
            <Bandeau icon="ti-circle-x" c={t.red} bg={t.redSoft} border={t.redMid}
              titre={`Demande refusée après l'étape « ${ETAPES[demande.refus.etape].label} »`}>
              Refus enregistré le {formatDate(demande.refus.date)}. La demande est clôturée mais reste conservée
              dans l'historique de l'élève.
            </Bandeau>
          )}

          {terminee && demande.sens==="Sortant" && (
            <Bandeau icon="ti-circle-check" c={t.green} bg={t.greenSoft} border={t.greenMid} titre="Transfert finalisé — dossier transmis">
              Le dossier scolaire a été transmis à {demande.etablissement}. L'élève est passé au statut
              « Transféré » dans « Gestion des élèves » et l'étape figure dans son parcours scolaire.
            </Bandeau>
          )}

          {terminee && demande.sens==="Entrant" && (
            <Bandeau icon="ti-user-check" c={t.green} bg={t.greenSoft} border={t.greenMid} titre="Transfert finalisé — élève inscrit">
              Une fiche élève a été créée dans « Gestion des élèves » pour {demande.eleveNom}, avec sa scolarité
              antérieure à {demande.etablissement} dans son parcours.
            </Bandeau>
          )}

          {encours && (
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <button onClick={()=>onValider(demande)}
                style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",border:"none",borderRadius:9,background:t.green,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:t.font}}>
                <i className="ti ti-circle-check" style={{fontSize:14}} /> Valider l'étape suivante
              </button>
              <button onClick={()=>onRefuser(demande)}
                style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",border:`1px solid ${t.redMid}`,borderRadius:9,background:t.redSoft,color:t.red,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:t.font}}>
                <i className="ti ti-circle-x" style={{fontSize:14}} /> Refuser
              </button>
              <span style={{fontSize:11,color:t.muted}}>
                Prochaine étape : {ETAPES[demande.etape+1].label}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── PAGE ───────────────────────────────────────────────────── */
const emptyForm = {
  sens:"Sortant", studentId:"", eleveNom:"", classe:"",
  etablissement:ETABLISSEMENTS[0], demandeur:"Parent", motif:"",
};

export default function Transferts() {
  const { showToast } = useToast();
  const {
    eleves, getEleveById,
    transferRequests: demandes,
    addTransferRequest, advanceTransferStep, refuseTransferRequest,
  } = useSchoolData();
  const [tab,      setTab]      = useState("suivi");
  const [filtre,   setFiltre]   = useState("Toutes");
  const [ouvert,   setOuvert]   = useState(null);
  const [form,     setForm]     = useState(emptyForm);
  const [errors,   setErrors]   = useState({});

  const elevesActifs = eleves.filter(s=>s.status==="Actif");
  const eleveDeDemande = (d) => d.sens==="Sortant" ? getEleveById(d.studentId) : null;

  /* ── Stats ── */
  const enCours   = demandes.filter(d=>statutDemande(d)==="En cours").length;
  const sortants  = demandes.filter(d=>d.sens==="Sortant" && statutDemande(d)==="Terminée").length;
  const entrants  = demandes.filter(d=>d.sens==="Entrant" && statutDemande(d)==="Terminée").length;

  /* ── Workflow ── */
  const valider = (demande) => {
    const nom = nomEleve(demande, eleveDeDemande(demande));
    // Le contexte met à jour l'élève concerné quand la dernière étape est franchie
    const resultat = advanceTransferStep(demande.id);
    if (!resultat) return;

    if (!resultat.termine) {
      showToast("Étape validée", "success", `${nom} — ${ETAPES[resultat.etape].label}`);
      return;
    }
    if (demande.sens==="Sortant") {
      showToast("Transfert terminé", "success",
        `${nom} — dossier transmis à ${demande.etablissement} · statut passé à « Transféré »`);
    } else {
      showToast("Transfert terminé", "success", `${nom} — inscription finalisée`);
      if (resultat.eleveCree) {
        showToast(`Nouvelle fiche élève créée : ${getNomComplet(resultat.eleveCree)}`, "success",
          `${resultat.eleveCree.classe} · matricule ${resultat.eleveCree.matricule}`);
      }
    }
  };

  const refuser = (demande) => {
    refuseTransferRequest(demande.id);
    showToast("Demande refusée", "error",
      `${nomEleve(demande, eleveDeDemande(demande))} — ${demande.etablissement}`);
  };

  /* ── Formulaire ── */
  const setChamp = (key,value) => {
    setForm(f=>({...f,[key]:value}));
    setErrors(ev=>({...ev,[key]:undefined}));
  };

  const validate = () => {
    const errs = {};
    if (form.sens==="Sortant") {
      if (!form.studentId) errs.studentId = "L'élève est requis";
    } else {
      if (!form.eleveNom || !form.eleveNom.trim()) errs.eleveNom = "Le nom de l'élève est requis";
      if (!form.classe) errs.classe = "La classe cible est requise";
    }
    if (!form.etablissement) errs.etablissement = "L'établissement est requis";
    if (!form.motif || !form.motif.trim()) errs.motif = "Le motif est requis";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const envoyer = () => {
    if (!validate()) {
      showToast("Veuillez corriger les champs en rouge", "error");
      return;
    }
    const eleve = form.sens==="Sortant" ? getEleveById(form.studentId) : null;
    const nouvelle = addTransferRequest({
      sens: form.sens,
      studentId: eleve ? eleve.id : null,
      eleveNom: eleve ? null : form.eleveNom.trim(),
      classe: eleve ? eleve.classe : form.classe,
      etablissement: form.etablissement,
      demandeur: form.demandeur,
      motif: form.motif.trim(),
    });
    setForm(emptyForm);
    setErrors({});
    setOuvert(nouvelle.id);
    setTab("suivi");
    showToast("Demande de transfert envoyée", "success", `${nomEleve(nouvelle, eleve)} — ${form.etablissement}`);
  };

  /* ── Suivi ── */
  const suivi = demandes
    .filter(d=>filtre==="Toutes" || d.sens===filtre.slice(0,-1))
    .sort((a,b)=>(dateEtape(b,0)||"").localeCompare(dateEtape(a,0)||""));

  return (
    <div style={{fontFamily:t.font,color:t.text}}>

      {/* ── HEADER ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,margin:0,color:t.text}}>Transfert d'élèves</h1>
          <p style={{fontSize:13,color:t.sub,marginTop:4,margin:0}}>
            Demandes de transfert, validation de l'école source et acceptation de l'établissement de destination
          </p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:20}}>
        <StatBox icon="ti-clock-hour-4" label="Demandes en cours"  value={enCours}         c={t.amber}  bg={t.amberSoft}  />
        <StatBox icon="ti-logout"       label="Sortants finalisés" value={sortants}        c={t.purple} bg={t.purpleSoft} />
        <StatBox icon="ti-login"        label="Entrants finalisés" value={entrants}        c={t.blue}   bg={t.blueSoft}   />
        <StatBox icon="ti-transfer"     label="Total des demandes" value={demandes.length} c={t.green}  bg={t.greenSoft}  />
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",flexWrap:"wrap",gap:0,borderBottom:`1px solid ${t.border}`,marginBottom:16}}>
        {[
          {key:"suivi",    icon:"ti-list-check", label:`Suivi des demandes (${demandes.length})`},
          {key:"nouvelle", icon:"ti-file-plus",  label:"Nouvelle demande"},
        ].map(tb=>(
          <TabBtn key={tb.key} active={tab===tb.key} icon={tb.icon} label={tb.label} onClick={()=>setTab(tb.key)} />
        ))}
      </div>

      {/* ═══ SUIVI DES DEMANDES ═══ */}
      {tab==="suivi" && (
        <div>
          {/* Filtre par sens */}
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {["Toutes","Sortants","Entrants"].map(f=>{
              const actif = filtre===f;
              const nb = f==="Toutes" ? demandes.length : demandes.filter(d=>d.sens===f.slice(0,-1)).length;
              return (
                <button key={f} onClick={()=>setFiltre(f)} style={{
                  display:"flex",alignItems:"center",gap:6,
                  padding:"8px 14px",border:`1px solid ${actif?t.blue:t.border}`,borderRadius:t.radius,
                  background:actif?t.blue:t.surface,color:actif?"#fff":t.sub,
                  fontSize:12,fontWeight:actif?600:500,cursor:"pointer",fontFamily:t.font,
                  boxShadow:t.shadow,transition:"all .15s",
                }}>
                  {f}
                  <span style={{fontSize:11,fontWeight:700,color:actif?"#fff":t.muted}}>{nb}</span>
                </button>
              );
            })}
          </div>

          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden"}}>
            {suivi.length===0
              ? (
                <div style={{padding:48,textAlign:"center",color:t.muted,fontSize:13}}>
                  <i className="ti ti-transfer" style={{fontSize:28,display:"block",marginBottom:10,color:t.border}} />
                  Aucune demande de transfert
                </div>
              )
              : suivi.map(d=>(
                <DemandeRow key={d.id} demande={d} eleve={eleveDeDemande(d)}
                  ouvert={ouvert===d.id}
                  onToggle={()=>setOuvert(ouvert===d.id?null:d.id)}
                  onValider={valider}
                  onRefuser={refuser}
                />
              ))
            }

            {suivi.length>0 && (
              <div style={{padding:"11px 18px",borderTop:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:t.bg}}>
                <span style={{fontSize:12,color:t.muted}}>
                  {suivi.length} demande{suivi.length>1?"s":""} affichée{suivi.length>1?"s":""}
                </span>
                <span style={{fontSize:12,color:t.muted}}>
                  <i className="ti ti-archive" style={{fontSize:12,marginRight:5}} />
                  Historique conservé à vie
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ NOUVELLE DEMANDE ═══ */}
      {tab==="nouvelle" && (
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden",maxWidth:720}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${t.border}`}}>
            <div style={{fontSize:14,fontWeight:600,color:t.text}}>Nouvelle demande de transfert</div>
            <div style={{fontSize:12,color:t.muted,marginTop:2}}>
              La demande est créée à l'étape « Demande » puis suit le circuit de validation
            </div>
          </div>

          <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>

            {/* Sens du transfert */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:6}}>Type de transfert</label>
              <div style={{display:"flex",gap:8}}>
                {[
                  {key:"Sortant", icon:"ti-logout", label:"Élève sortant", hint:"Quitte l'établissement"},
                  {key:"Entrant", icon:"ti-login",  label:"Élève entrant", hint:"Vient d'une autre école"},
                ].map(s=>{
                  const actif = form.sens===s.key;
                  return (
                    <button key={s.key} onClick={()=>{setForm({...emptyForm,sens:s.key,demandeur:form.demandeur,motif:form.motif});setErrors({});}}
                      style={{
                        flex:1,display:"flex",alignItems:"center",gap:9,textAlign:"left",
                        padding:"10px 12px",border:`1px solid ${actif?t.blue:t.border}`,borderRadius:t.radius,
                        background:actif?t.blueSoft:t.surface,cursor:"pointer",fontFamily:t.font,transition:"all .15s",
                      }}>
                      <i className={`ti ${s.icon}`} style={{fontSize:16,color:actif?t.blue:t.muted,flexShrink:0}} />
                      <span>
                        <span style={{display:"block",fontSize:12,fontWeight:600,color:actif?t.blue:t.text}}>{s.label}</span>
                        <span style={{display:"block",fontSize:10,color:t.muted,marginTop:1}}>{s.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Élève */}
            {form.sens==="Sortant" ? (
              <Field label="Élève *" error={errors.studentId}>
                <select value={form.studentId} onChange={e=>setChamp("studentId",e.target.value)} style={inputStyle(errors.studentId)}>
                  <option value="">Sélectionner un élève</option>
                  {elevesActifs.map(s=>(
                    <option key={s.id} value={s.id}>{getNomComplet(s)} — {s.classe}</option>
                  ))}
                </select>
              </Field>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
                <Field label="Nom de l'élève *" error={errors.eleveNom}>
                  <input type="text" placeholder="Ex : Sekou Camara" value={form.eleveNom}
                    onChange={e=>setChamp("eleveNom",e.target.value)} style={inputStyle(errors.eleveNom)} />
                </Field>
                <Field label="Classe cible *" error={errors.classe}>
                  <select value={form.classe} onChange={e=>setChamp("classe",e.target.value)} style={inputStyle(errors.classe)}>
                    <option value="">Sélectionner une classe</option>
                    {CLASSES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
              <Field label={form.sens==="Sortant" ? "Établissement de destination *" : "Établissement d'origine *"} error={errors.etablissement}>
                <select value={form.etablissement} onChange={e=>setChamp("etablissement",e.target.value)} style={inputStyle(errors.etablissement)}>
                  {ETABLISSEMENTS.map(e=><option key={e}>{e}</option>)}
                </select>
              </Field>
              <Field label="Demande à l'initiative de">
                <select value={form.demandeur} onChange={e=>setChamp("demandeur",e.target.value)} style={inputStyle()}>
                  {DEMANDEURS.map(d=><option key={d}>{d}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Motif *" error={errors.motif}>
              <textarea rows={3} placeholder="Ex : déménagement de la famille, rapprochement du domicile..." value={form.motif}
                onChange={e=>setChamp("motif",e.target.value)}
                style={{...inputStyle(errors.motif),resize:"vertical",lineHeight:1.5}}
              />
            </Field>

            <div style={{display:"flex",gap:10,marginTop:4}}>
              <button onClick={()=>{setForm(emptyForm);setErrors({});}}
                style={{padding:"10px 18px",border:`1px solid ${t.border}`,borderRadius:9,background:t.surface,fontSize:13,fontWeight:500,cursor:"pointer",color:t.sub,fontFamily:t.font}}>
                Réinitialiser
              </button>
              <button onClick={envoyer}
                style={{display:"flex",alignItems:"center",gap:7,padding:"10px 18px",border:"none",borderRadius:9,background:t.blue,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:t.font,boxShadow:"0 2px 8px rgba(37,99,235,0.25)"}}>
                <i className="ti ti-send" style={{fontSize:14}} /> Envoyer la demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
