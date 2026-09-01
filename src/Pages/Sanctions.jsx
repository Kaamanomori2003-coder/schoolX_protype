import { useEffect, useState } from "react";
import { getNomComplet, getInitials } from "./studentsData";
import {
  TYPES_SANCTION, STATUTS_SANCTION,
  aujourdhui, formatDate, finExclusion, estExclusionEnCours,
} from "./sanctionsData";
import { useToast } from "../context/ToastContext";
import { useSchoolData } from "../context/SchoolDataContext";

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
  amberMid: "#fde68a",
  orange:   "#ea580c",
  orangeSoft:"#fff7ed",
  red:      "#dc2626",
  redSoft:  "#fef2f2",
  redMid:   "#fecaca",
  redDark:  "#991b1b",
  radius:   "10px",
  radiusLg: "14px",
  shadow:   "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  font:     "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── HELPERS ────────────────────────────────────────────────── */
const typeColor = (type) => ({
  "Avertissement":        {c:t.amber,   bg:t.amberSoft,  icon:"ti-alert-triangle"},
  "Blâme":                {c:t.orange,  bg:t.orangeSoft, icon:"ti-flag"          },
  "Exclusion temporaire": {c:t.red,     bg:t.redSoft,    icon:"ti-user-off"      },
  "Exclusion définitive": {c:t.redDark, bg:t.redSoft,    icon:"ti-ban"           },
}[type] || {c:t.muted, bg:t.bg, icon:"ti-gavel"});

const statutColor = (statut) => ({
  "En attente": {c:t.amber, bg:t.amberSoft },
  "Validée":    {c:t.green, bg:t.greenSoft },
  "Rejetée":    {c:t.sub,   bg:"#f3f4f6"   },
}[statut] || {c:t.muted, bg:t.bg});

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
    <div style={{minWidth:0}}>
      <div style={{fontSize:11,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px"}}>{label}</div>
      <div style={{fontSize:21,fontWeight:700,color:t.text,marginTop:3,lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{value}</div>
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

/* ─── IMPACT SCOLARITÉ ───────────────────────────────────────── */
const ImpactSanction = ({sanction}) => {
  if (sanction.statut!=="Validée") return null;

  if (sanction.type==="Exclusion définitive") {
    return (
      <Bandeau icon="ti-ban" c={t.redDark} bg={t.redSoft} border={t.redMid} titre="Exclusion définitive">
        L'élève ne poursuit plus sa scolarité dans l'établissement. La décision est portée au dossier
        national et sera transmise en cas de demande de transfert.
      </Bandeau>
    );
  }

  if (sanction.type==="Exclusion temporaire") {
    const fin    = finExclusion(sanction);
    const enCours = estExclusionEnCours(sanction);
    return (
      <Bandeau
        icon={enCours?"ti-user-off":"ti-circle-check"}
        c={enCours?t.red:t.green}
        bg={enCours?t.redSoft:t.greenSoft}
        border={enCours?t.redMid:t.greenSoft}
        titre={enCours ? `Exclusion en cours jusqu'au ${formatDate(fin)}` : `Exclusion terminée le ${formatDate(fin)}`}
      >
        {sanction.dureeJours} jour{sanction.dureeJours>1?"s":""} à compter du {formatDate(sanction.dateValidation)} —
        les absences de cette période sont justifiées et n'entrent pas dans le calcul du taux de présence.
      </Bandeau>
    );
  }

  return null;
};

/* ─── LIGNE REPLIABLE ────────────────────────────────────────── */
const SanctionRow = ({sanction, eleve, ouvert, onToggle, onDecider}) => {
  const tc = typeColor(sanction.type);
  const sc = statutColor(sanction.statut);

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
          background:t.blueSoft,border:`1px solid ${t.blueMid}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:12,fontWeight:700,color:t.blue,
        }}>{getInitials(eleve)}</div>

        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,color:t.text}}>{getNomComplet(eleve)}</div>
          <div style={{fontSize:11,color:t.muted,marginTop:1}}>
            {eleve?.classe || "—"} · Faits du {formatDate(sanction.dateFait)}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
          {estExclusionEnCours(sanction) && (
            <i className="ti ti-alert-octagon" style={{fontSize:15,color:t.red}} title="Exclusion en cours" />
          )}
          <Chip label={sanction.type}   c={tc.c} bg={tc.bg} />
          <Chip label={sanction.statut} c={sc.c} bg={sc.bg} />
          <i className={`ti ${ouvert?"ti-chevron-up":"ti-chevron-down"}`} style={{fontSize:16,color:t.muted}} />
        </div>
      </div>

      {/* Détail déplié */}
      {ouvert && (
        <div style={{padding:"4px 18px 18px 66px",background:t.bg,display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
            <InfoBloc icon="ti-message-report" label="Motif"  value={sanction.motif} />
            <InfoBloc icon="ti-paperclip"      label="Preuve" value={sanction.preuve} />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
            <InfoBloc icon="ti-calendar-event" label="Date des faits" value={formatDate(sanction.dateFait)} />
            <InfoBloc icon="ti-hourglass"      label="Durée"
              value={sanction.dureeJours ? `${sanction.dureeJours} jour${sanction.dureeJours>1?"s":""}` : "—"} />
            <InfoBloc icon="ti-gavel"          label="Validation direction"
              value={sanction.dateValidation ? `${sanction.statut} le ${formatDate(sanction.dateValidation)}` : "En attente de décision"} />
          </div>

          <ImpactSanction sanction={sanction} />

          {sanction.statut==="En attente" && (
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button onClick={()=>onDecider(sanction,"Validée")}
                style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",border:"none",borderRadius:9,background:t.green,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:t.font}}>
                <i className="ti ti-circle-check" style={{fontSize:14}} /> Valider
              </button>
              <button onClick={()=>onDecider(sanction,"Rejetée")}
                style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",border:`1px solid ${t.redMid}`,borderRadius:9,background:t.redSoft,color:t.red,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:t.font}}>
                <i className="ti ti-circle-x" style={{fontSize:14}} /> Rejeter
              </button>
              <span style={{fontSize:11,color:t.muted,alignSelf:"center"}}>Décision réservée à la direction</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── PAGE ───────────────────────────────────────────────────── */
const emptyForm = {studentId:"",type:"Avertissement",motif:"",preuve:"",dureeJours:"",dateFait:aujourdhui()};

export default function Sanctions({prefillStudentId}) {
  const { showToast } = useToast();
  const { eleves, getEleveById, sanctions, addSanction, updateSanctionStatut } = useSchoolData();
  const [tab,       setTab]       = useState("nouvelle");
  const [filtre,    setFiltre]    = useState("Tous");
  const [ouvert,    setOuvert]    = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [errors,    setErrors]    = useState({});

  // Élève pré-rempli depuis la fiche élève : ouvre directement le formulaire
  useEffect(()=>{
    if (prefillStudentId===null || prefillStudentId===undefined) return;
    setForm(f=>({...f,studentId:String(prefillStudentId)}));
    setTab("nouvelle");
  },[prefillStudentId]);

  const elevesActifs = eleves.filter(s=>s.status==="Actif");
  // Un élève inactif ou transféré n'est pas dans la liste : on l'ajoute pour ne pas vider le select
  const elevePrerempli = prefillStudentId && !elevesActifs.some(s=>s.id===Number(prefillStudentId))
    ? getEleveById(prefillStudentId)
    : null;
  const elevesSelectionnables = elevePrerempli ? [...elevesActifs, elevePrerempli] : elevesActifs;

  /* ── Stats ── */
  const moisCourant = aujourdhui().slice(0,7);
  const enAttente   = sanctions.filter(s=>s.statut==="En attente").length;
  const ceMois      = sanctions.filter(s=>s.dateFait.startsWith(moisCourant)).length;
  const exclusions  = sanctions.filter(estExclusionEnCours).length;

  const parEleve = sanctions.reduce((acc,s)=>({...acc,[s.studentId]:(acc[s.studentId]||0)+1}),{});
  const [idSurveille] = Object.entries(parEleve)
    .sort((a,b)=>b[1]-a[1])[0] || [null,0];
  const eleveSurveille = idSurveille ? getEleveById(idSurveille) : null;

  /* ── Formulaire ── */
  const setChamp = (key,value) => {
    setForm(f=>({...f,[key]:value}));
    setErrors(ev=>({...ev,[key]:undefined}));
  };

  const validate = () => {
    const errs = {};
    if (!form.studentId) errs.studentId = "L'élève est requis";
    if (!form.motif || !form.motif.trim()) errs.motif = "Le motif est requis";
    if (!form.preuve || !form.preuve.trim()) errs.preuve = "Le justificatif est requis";
    if (!form.dateFait) errs.dateFait = "La date des faits est requise";
    if (form.type==="Exclusion temporaire") {
      const d = parseInt(form.dureeJours);
      if (!form.dureeJours || isNaN(d) || d <= 0) errs.dureeJours = "La durée doit être > 0";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const enregistrer = () => {
    if (!validate()) {
      showToast("Veuillez corriger les champs en rouge", "error");
      return;
    }
    const eleve = getEleveById(form.studentId);
    addSanction({
      studentId: Number(form.studentId),
      type: form.type,
      motif: form.motif.trim(),
      preuve: form.preuve.trim(),
      dureeJours: form.type==="Exclusion temporaire" ? parseInt(form.dureeJours) : null,
      dateFait: form.dateFait,
    });
    setForm({...emptyForm,dateFait:aujourdhui()});
    setErrors({});
    showToast("Sanction enregistrée", "success", `${form.type} — ${getNomComplet(eleve)} · en attente de validation par la direction`);
  };

  const decider = (sanction,statut) => {
    // Le contexte ajoute lui-même l'étape « Exclusion validée » au parcours de l'élève concerné
    updateSanctionStatut(sanction.id, statut);
    const nom = getNomComplet(getEleveById(sanction.studentId));
    if (statut==="Validée") {
      const exclusion = sanction.type.startsWith("Exclusion");
      showToast("Sanction validée par la direction", "success",
        exclusion
          ? `${sanction.type} — ${nom} · portée au parcours scolaire de l'élève`
          : `${sanction.type} — ${nom}`);
    }
    else showToast("Sanction rejetée", "error", `${sanction.type} — ${nom}`);
  };

  /* ── Historique ── */
  const historique = sanctions
    .filter(s=>filtre==="Tous" || s.statut===filtre)
    .sort((a,b)=>b.dateFait.localeCompare(a.dateFait));

  return (
    <div style={{fontFamily:t.font,color:t.text}}>

      {/* ── HEADER ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,margin:0,color:t.text}}>Discipline &amp; sanctions</h1>
          <p style={{fontSize:13,color:t.sub,marginTop:4,margin:0}}>
            Enregistrement des sanctions, validation par la direction et suivi de leur impact sur la scolarité
          </p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
        <StatBox icon="ti-clock-hour-4"  label="En attente"        value={enAttente}  c={t.amber} bg={t.amberSoft} />
        <StatBox icon="ti-calendar-event"label="Ce mois-ci"        value={ceMois}     c={t.blue}  bg={t.blueSoft}  />
        <StatBox icon="ti-user-off"      label="Exclusions en cours" value={exclusions} c={t.red}   bg={t.redSoft}   />
        <StatBox
          icon="ti-alert-octagon"
          label="Élève à surveiller"
          value={eleveSurveille ? getNomComplet(eleveSurveille) : "—"}
          c={t.orange} bg={t.orangeSoft}
        />
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",flexWrap:"wrap",gap:0,borderBottom:`1px solid ${t.border}`,marginBottom:16}}>
        {[
          {key:"nouvelle",   icon:"ti-gavel",   label:"Nouvelle sanction"},
          {key:"historique", icon:"ti-history", label:`Historique (${sanctions.length})`},
        ].map(tb=>(
          <TabBtn key={tb.key} active={tab===tb.key} icon={tb.icon} label={tb.label} onClick={()=>setTab(tb.key)} />
        ))}
      </div>

      {/* ═══ NOUVELLE SANCTION ═══ */}
      {tab==="nouvelle" && (
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden",maxWidth:720}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${t.border}`}}>
            <div style={{fontSize:14,fontWeight:600,color:t.text}}>Enregistrer une sanction</div>
            <div style={{fontSize:12,color:t.muted,marginTop:2}}>
              La sanction est créée avec le statut « En attente » et devra être validée par la direction
            </div>
          </div>

          <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
              <Field label="Élève *" error={errors.studentId}>
                <select value={form.studentId} onChange={e=>setChamp("studentId",e.target.value)} style={inputStyle(errors.studentId)}>
                  <option value="">Sélectionner un élève</option>
                  {elevesSelectionnables.map(s=>(
                    <option key={s.id} value={s.id}>{getNomComplet(s)} — {s.classe}</option>
                  ))}
                </select>
              </Field>

              <Field label="Type de sanction *">
                <select value={form.type} onChange={e=>setChamp("type",e.target.value)} style={inputStyle()}>
                  {TYPES_SANCTION.map(ty=><option key={ty}>{ty}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Motif *" error={errors.motif}>
              <textarea rows={3} placeholder="Décrivez les faits reprochés à l'élève..." value={form.motif}
                onChange={e=>setChamp("motif",e.target.value)}
                style={{...inputStyle(errors.motif),resize:"vertical",lineHeight:1.5}}
              />
            </Field>

            <Field label="Preuve / justificatif *" error={errors.preuve}>
              <textarea rows={2} placeholder="Ex : rapport du surveillant général, témoignages écrits, copie saisie..." value={form.preuve}
                onChange={e=>setChamp("preuve",e.target.value)}
                style={{...inputStyle(errors.preuve),resize:"vertical",lineHeight:1.5}}
              />
            </Field>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
              <Field label="Date des faits *" error={errors.dateFait}>
                <input type="date" value={form.dateFait} max={aujourdhui()}
                  onChange={e=>setChamp("dateFait",e.target.value)} style={inputStyle(errors.dateFait)}
                />
              </Field>

              {form.type==="Exclusion temporaire" && (
                <Field label="Durée (jours) *" error={errors.dureeJours}>
                  <input type="number" min={1} placeholder="Ex : 3" value={form.dureeJours}
                    onChange={e=>setChamp("dureeJours",e.target.value)} style={inputStyle(errors.dureeJours)}
                  />
                </Field>
              )}
            </div>

            <div style={{display:"flex",gap:10,marginTop:4}}>
              <button onClick={()=>{setForm({...emptyForm,dateFait:aujourdhui()});setErrors({});}}
                style={{padding:"10px 18px",border:`1px solid ${t.border}`,borderRadius:9,background:t.surface,fontSize:13,fontWeight:500,cursor:"pointer",color:t.sub,fontFamily:t.font}}>
                Réinitialiser
              </button>
              <button onClick={enregistrer}
                style={{display:"flex",alignItems:"center",gap:7,padding:"10px 18px",border:"none",borderRadius:9,background:t.blue,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:t.font,boxShadow:"0 2px 8px rgba(37,99,235,0.25)"}}>
                <i className="ti ti-plus" style={{fontSize:14}} /> Enregistrer la sanction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HISTORIQUE ═══ */}
      {tab==="historique" && (
        <div>
          {/* Filtre par statut */}
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {["Tous",...STATUTS_SANCTION].map(f=>{
              const actif = filtre===f;
              const nb = f==="Tous" ? sanctions.length : sanctions.filter(s=>s.statut===f).length;
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
            {historique.length===0
              ? (
                <div style={{padding:48,textAlign:"center",color:t.muted,fontSize:13}}>
                  <i className="ti ti-gavel" style={{fontSize:28,display:"block",marginBottom:10,color:t.border}} />
                  Aucune sanction {filtre!=="Tous" && `« ${filtre.toLowerCase()} »`}
                </div>
              )
              : historique.map(s=>(
                <SanctionRow key={s.id} sanction={s} eleve={getEleveById(s.studentId)}
                  ouvert={ouvert===s.id}
                  onToggle={()=>setOuvert(ouvert===s.id?null:s.id)}
                  onDecider={decider}
                />
              ))
            }

            {historique.length>0 && (
              <div style={{padding:"11px 18px",borderTop:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:t.bg}}>
                <span style={{fontSize:12,color:t.muted}}>
                  {historique.length} sanction{historique.length>1?"s":""} affichée{historique.length>1?"s":""}
                </span>
                <span style={{fontSize:12,color:t.muted}}>
                  <i className="ti ti-shield-lock" style={{fontSize:12,marginRight:5}} />
                  Traçabilité nationale — dossier conservé
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
