import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CLASSES, getNomComplet, getInitials } from "./studentsData";
import { useToast } from "../context/ToastContext";
import { useSchoolData, MATIERES, CRENEAUX } from "../context/SchoolDataContext";
import { t } from "../theme";

/* ─── DATA ───────────────────────────────────────────────────── */
const STATUTS = {
  present: { label:"Présent", color:t.green,  bg:t.greenSoft,  icon:"ti-check" },
  absent:  { label:"Absent",  color:t.red,    bg:t.redSoft,    icon:"ti-x" },
  retard:  { label:"Retard",  color:t.amber,  bg:t.amberSoft,  icon:"ti-clock" },
  exclu:   { label:"Exclu",   color:t.purple, bg:t.purpleSoft, icon:"ti-door-exit" },
};

const MOTIFS_ABSENCE = ["Maladie","Raison familiale","Rendez-vous médical","Problème de transport","Non communiqué"];
const RETARDS_RAPIDES = [5,10,15,30];

// Motifs proposés en un clic dans le panneau d'observation, selon le statut de la ligne
const OBS_CHIPS = {
  present: [],
  absent:  ["Maladie","Rendez-vous médical","Parent prévenu par téléphone","Autorisation direction"],
  retard:  ["Transport","Rendez-vous","Retard justifié"],
  exclu:   ["Décision direction","Voir module Sanctions"],
};

const OBS_AIDE = {
  present: "Note facultative sur cet élève.",
  absent:  "Précisez le motif communiqué par la famille.",
  retard:  "Indiquez la durée et la raison du retard.",
  exclu:   "Motivez la décision d'exclusion du cours.",
};

/* ─── HELPERS ────────────────────────────────────────────────── */
const todayISO = () => new Date().toISOString().slice(0,10);

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" });

const emptyRow = () => ({ status:"present", motif:"", justifie:false, retardMin:"", note:"" });

const rowsFor = (list) => Object.fromEntries(list.map(e => [e.id, emptyRow()]));

// Un élève transféré ou exclu définitivement ne figure plus sur la feuille d'appel
const scolarise = (e) => e.status !== "Transféré" && e.status !== "Exclu";

const inputStyle = () => ({
  width:"100%",padding:"9px 12px",
  border:`1px solid ${t.border}`,borderRadius:8,
  fontSize:13,outline:"none",boxSizing:"border-box",
  fontFamily:t.font,color:t.text,background:t.surface,
});

const compteurs = (records) => {
  const total   = records.length;
  const present = records.filter(r=>r.status==="present").length;
  const absent  = records.filter(r=>r.status==="absent").length;
  const retard  = records.filter(r=>r.status==="retard").length;
  const exclu   = records.filter(r=>r.status==="exclu").length;
  return { total, present, absent, retard, exclu, taux: total ? Math.round((present/total)*100) : 100 };
};

const tronque = (s, n=90) => (s.length > n ? `${s.slice(0,n)}…` : s);

// Ajoute ou retire un motif rapide dans le champ texte libre de la ligne
const toggleMotif = (valeur, label) => {
  const parts = valeur.split(" · ").map(p=>p.trim()).filter(Boolean);
  const i = parts.findIndex(p => p.toLowerCase() === label.toLowerCase());
  if (i >= 0) parts.splice(i,1); else parts.push(label);
  return parts.join(" · ");
};

const contientMotif = (valeur, label) =>
  valeur.split(" · ").some(p => p.trim().toLowerCase() === label.toLowerCase());

// Résumé texte du détail saisi pour un élève (motif, minutes de retard, observation)
const resumeDetail = (r) => {
  if (!r) return "";
  const parts = [];
  if (r.status === "retard" && Number(r.retardMin) > 0) parts.push(`${Number(r.retardMin)} min de retard`);
  if (r.status === "retard") {
    parts.push(r.justifie ? `Retard — Justifié${r.motif ? ` (${r.motif})` : ""}` : "Non justifié");
  } else if (r.motif) {
    parts.push(r.motif);
  }
  if (r.status === "absent") parts.push(r.justifie ? "justifiée" : "non justifiée");
  if (r.note) parts.push(r.note);
  return parts.join(" · ");
};

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
const Chip = ({label, c, bg}) => (
  <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:bg,color:c,whiteSpace:"nowrap"}}>
    {label}
  </span>
);

const Divider = () => <div style={{height:1,background:t.border}} />;

const StatBox = ({icon,label,value,c=t.blue,bg=t.blueSoft}) => (
  <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,boxShadow:t.shadow}}>
    <div style={{width:40,height:40,borderRadius:9,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <i className={`ti ${icon}`} style={{fontSize:19,color:c}} />
    </div>
    <div style={{minWidth:0}}>
      <div style={{fontSize:11,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px"}}>{label}</div>
      <div style={{fontSize:21,fontWeight:700,color:t.text,marginTop:3,lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value}</div>
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

const ActionBtn = ({icon,label,primary,c,bg,border,onClick}) => (
  <button onClick={onClick} style={{
    display:"flex",alignItems:"center",gap:7,
    padding:"9px 16px",border:primary?"none":`1px solid ${border||t.border}`,
    borderRadius:t.radius,cursor:"pointer",
    fontFamily:t.font,fontSize:13,fontWeight:500,
    background:primary?t.blue:(bg||t.surface),
    color:primary?"#fff":(c||t.sub),
    boxShadow:primary?"0 2px 8px rgba(37,99,235,0.25)":t.shadow,
    transition:"all .15s",
  }}
    onMouseEnter={e=>{e.currentTarget.style.opacity=".88";e.currentTarget.style.transform="translateY(-1px)"}}
    onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"}}
  >
    <i className={`ti ${icon}`} style={{fontSize:14}} />
    {label}
  </button>
);

const Field = ({label, children}) => (
  <div>
    <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:5}}>{label}</label>
    {children}
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

const InfoItem = ({icon,label,value}) => (
  <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:`1px solid ${t.border}`}}>
    <i className={`ti ${icon}`} style={{fontSize:15,color:t.muted,marginTop:1,width:16,flexShrink:0}} />
    <div>
      <div style={{fontSize:10,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px",marginBottom:2}}>{label}</div>
      <div style={{fontSize:13,color:t.text,fontWeight:500}}>{value}</div>
    </div>
  </div>
);

const SectionCard = ({icon, titre, extra, children}) => (
  <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden",marginBottom:14}}>
    <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
      <span style={{fontSize:14,fontWeight:600,color:t.text}}>
        <i className={`ti ${icon}`} style={{fontSize:14,color:t.muted,marginRight:7}} />
        {titre}
      </span>
      {extra && <span style={{fontSize:12,color:t.muted}}>{extra}</span>}
    </div>
    {children}
  </div>
);

/* ─── SAISIE : SÉLECTEUR DE STATUT ───────────────────────────── */
const StatusPicker = ({current, onPick}) => (
  <div style={{display:"flex",gap:6,flexShrink:0,flexWrap:"wrap"}}>
    {Object.entries(STATUTS).map(([key, cfg])=>{
      const actif = current === key;
      return (
        <button key={key} onClick={e=>{e.stopPropagation();onPick(key);}} style={{
          display:"flex",alignItems:"center",gap:5,
          padding:"6px 11px",borderRadius:t.radius,
          border:`1px solid ${actif?cfg.color:t.border}`,
          background:actif?cfg.bg:t.surface,
          color:actif?cfg.color:t.sub,
          fontSize:12,fontWeight:actif?600:500,
          cursor:"pointer",fontFamily:t.font,transition:"all .12s",whiteSpace:"nowrap",
        }}>
          <i className={`ti ${cfg.icon}`} style={{fontSize:13}} />
          {cfg.label}
        </button>
      );
    })}
  </div>
);

/* ─── SAISIE : PASTILLE DE CHOIX RAPIDE ──────────────────────── */
const QuickChip = ({label, actif, c=t.blue, bg=t.blueSoft, onClick}) => (
  <button onClick={onClick} style={{
    padding:"5px 11px",borderRadius:20,
    border:`1px solid ${actif?c:t.border}`,
    background:actif?bg:t.surface,
    color:actif?c:t.sub,
    fontSize:11.5,fontWeight:actif?600:500,
    cursor:"pointer",fontFamily:t.font,transition:"all .12s",whiteSpace:"nowrap",
  }}>
    {label}
  </button>
);

/* ─── SAISIE : LIGNE ÉLÈVE ───────────────────────────────────── */
const SaisieRow = ({eleve, row, onChange, ouvert, onToggle, dernier}) => {
  const cfg    = STATUTS[row.status] || STATUTS.present;
  const detail = resumeDetail(row);
  const chips  = OBS_CHIPS[row.status] || [];
  // Un seul champ texte libre par ligne : le motif dès qu'il y a une anomalie, sinon une simple note
  const champ  = row.status === "present" ? "note" : "motif";
  const valeur = row[champ] || "";
  const saisi  = valeur.trim().length > 0;

  return (
    <div style={{borderBottom: dernier && !ouvert ? "none" : `1px solid ${t.border}`}}>
      {/* En-tête de ligne */}
      <div onClick={onToggle}
        style={{display:"flex",alignItems:"center",gap:12,padding:"11px 18px",cursor:"pointer",transition:"background .12s",background:ouvert?t.bg:"transparent"}}
        onMouseEnter={e=>e.currentTarget.style.background=t.bg}
        onMouseLeave={e=>e.currentTarget.style.background=ouvert?t.bg:"transparent"}
      >
        <div style={{
          width:36,height:36,borderRadius:"50%",flexShrink:0,
          background:cfg.bg,border:`1px solid ${t.border}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:12,fontWeight:700,color:cfg.color,
        }}>{getInitials(eleve)}</div>

        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7,minWidth:0}}>
            <span style={{fontSize:13,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {getNomComplet(eleve)}
            </span>
            {saisi && (
              <span title="Observation saisie" style={{
                width:6,height:6,borderRadius:"50%",flexShrink:0,
                background:cfg.color,boxShadow:`0 0 0 2px ${cfg.bg}`,
              }} />
            )}
          </div>
          <div style={{fontSize:11,color:t.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {detail || `${eleve.matricule} · ${eleve.classe}`}
          </div>
        </div>

        <StatusPicker current={row.status} onPick={s=>onChange({status:s})} />

        <motion.div animate={{rotate: ouvert ? 180 : 0}} transition={{duration:.2}}
          style={{display:"flex",alignItems:"center",flexShrink:0}}>
          <i className="ti ti-chevron-down" style={{fontSize:16,color:ouvert?cfg.color:t.muted}} />
        </motion.div>
      </div>

      {/* Panneau d'observation */}
      <AnimatePresence initial={false}>
        {ouvert && (
          <motion.div
            initial={{opacity:0,height:0}}
            animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}}
            transition={{duration:.2}}
            style={{overflow:"hidden"}}
          >
            <div style={{
              margin:"2px 18px 14px 66px",
              background:t.bg,
              border:`1px solid ${t.border}`,
              borderLeft:`4px solid ${cfg.color}`,
              borderRadius:t.radius,
              padding:"13px 15px",
              display:"flex",flexDirection:"column",gap:12,
            }}>
              {/* Aide contextuelle, ou aperçu de ce qui est déjà saisi */}
              <div style={{display:"flex",alignItems:"flex-start",gap:7,minWidth:0}}>
                <i className={`ti ${saisi ? cfg.icon : "ti-info-circle"}`}
                  style={{fontSize:14,color:saisi?cfg.color:t.muted,marginTop:1,flexShrink:0}} />
                <span style={{fontSize:11.5,color:saisi?t.sub:t.muted,fontWeight:saisi?500:400,lineHeight:1.4}}>
                  {saisi ? tronque(valeur) : OBS_AIDE[row.status]}
                </span>
              </div>

              {/* Motifs rapides */}
              {chips.length > 0 && (
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {chips.map(m=>(
                    <QuickChip key={m} label={m} actif={contientMotif(valeur,m)}
                      onClick={()=>onChange({[champ]: toggleMotif(valeur,m)})} />
                  ))}
                </div>
              )}

              {/* Champ texte libre */}
              <Field label={row.status === "present" ? "Observation (optionnel)" : "Motif / observation"}>
                <input type="text" value={valeur} onChange={e=>onChange({[champ]:e.target.value})}
                  placeholder={row.status === "present" ? "Ex : participation remarquée en classe" : "Précisez si besoin (texte libre)"}
                  style={inputStyle()} />
              </Field>

              {row.status === "retard" && (
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:6}}>Minutes de retard</label>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    {RETARDS_RAPIDES.map(m=>(
                      <QuickChip key={m} label={`${m} min`} actif={Number(row.retardMin)===m}
                        c={t.amber} bg={t.amberSoft}
                        onClick={()=>onChange({retardMin: Number(row.retardMin)===m ? "" : m})} />
                    ))}
                    <input type="number" min="0" value={row.retardMin} onChange={e=>onChange({retardMin:e.target.value})}
                      placeholder="min" style={{...inputStyle(),width:90}} />
                  </div>
                </div>
              )}

              {(row.status === "absent" || row.status === "retard") && (
                <button onClick={()=>onChange({justifie:!row.justifie})} style={{
                  display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start",
                  padding:"8px 13px",borderRadius:t.radius,cursor:"pointer",fontFamily:t.font,
                  border:`1px solid ${row.justifie?t.greenMid:t.border}`,
                  background:row.justifie?t.greenSoft:t.surface,
                  color:row.justifie?t.green:t.sub,fontSize:12,fontWeight:600,
                }}>
                  <i className={`ti ${row.justifie?"ti-checkbox":"ti-square"}`} style={{fontSize:15}} />
                  Justificatif déjà fourni
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── HISTORIQUE : LIGNE DE SÉANCE ───────────────────────────── */
const SeanceRow = ({seance, onOuvrir, dernier}) => {
  const c = compteurs(seance.records);
  const nonJustifiees = seance.records.filter(r=>(r.status==="absent" || r.status==="retard") && !r.justifie).length;

  return (
    <div onClick={onOuvrir}
      style={{
        display:"flex",alignItems:"center",gap:12,padding:"13px 18px",cursor:"pointer",
        borderBottom: dernier ? "none" : `1px solid ${t.border}`,transition:"background .12s",
      }}
      onMouseEnter={e=>e.currentTarget.style.background=t.bg}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
    >
      <div style={{
        width:36,height:36,borderRadius:"50%",flexShrink:0,
        background:c.absent>0?t.redSoft:t.greenSoft,border:`1px solid ${t.border}`,
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        <i className={`ti ${c.absent>0?"ti-user-x":"ti-users-group"}`} style={{fontSize:16,color:c.absent>0?t.red:t.green}} />
      </div>

      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:t.text}}>{seance.classe} — {seance.matiere}</div>
        <div style={{fontSize:11,color:t.muted,marginTop:1}}>
          {fmtDate(seance.date)} · {seance.creneau} · {c.total} élève{c.total>1?"s":""}
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
        {c.absent>0 && <Chip label={`${c.absent} absent${c.absent>1?"s":""}`} c={t.red}    bg={t.redSoft}    />}
        {c.retard>0 && <Chip label={`${c.retard} retard${c.retard>1?"s":""}`} c={t.amber}  bg={t.amberSoft}  />}
        {c.exclu>0  && <Chip label={`${c.exclu} exclu${c.exclu>1?"s":""}`}    c={t.purple} bg={t.purpleSoft} />}
        {nonJustifiees>0 && <Chip label={`${nonJustifiees} à justifier`} c={t.amber} bg={t.amberSoft} />}
        <Chip label={`${c.taux}% présents`} c={t.green} bg={t.greenSoft} />
        <i className="ti ti-chevron-right" style={{fontSize:16,color:t.muted}} />
      </div>
    </div>
  );
};

/* ─── FICHE SÉANCE (PAGE PLEIN ÉCRAN) ────────────────────────── */
function FicheSeance({seance, onRetour, onJustifier}) {
  const { eleves } = useSchoolData();
  const [tab, setTab] = useState("anomalies");
  const c = compteurs(seance.records);
  const absencesNJ = seance.records.filter(r=>r.status==="absent" && !r.justifie).length;
  const retardsNJ  = seance.records.filter(r=>r.status==="retard" && !r.justifie).length;
  const nonJustifiees = absencesNJ + retardsNJ;
  const anomalies = seance.records.filter(r=>r.status!=="present");
  const liste = tab === "anomalies" ? anomalies : seance.records;

  return (
    <div style={{fontFamily:t.font,color:t.text,maxWidth:"860px",margin:"0 auto"}}>

      {/* ── TOP BAR ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <ActionBtn icon="ti-arrow-left" label="Retour" primary onClick={onRetour} />
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Chip label={fmtDate(seance.date)} c={t.sub} bg={t.bg} />
          <Chip label={seance.creneau}       c={t.sub} bg={t.bg} />
        </div>
      </div>

      {/* ── BANDEAU ── */}
      {nonJustifiees > 0 && (
        <div style={{marginBottom:14}}>
          <Bandeau icon="ti-alert-triangle" c={t.amber} bg={t.amberSoft} border={t.amberMid}
            titre={`${nonJustifiees} entrée${nonJustifiees>1?"s":""} en attente de justificatif`}>
            {absencesNJ > 0 && `${absencesNJ} absence${absencesNJ>1?"s":""}`}
            {absencesNJ > 0 && retardsNJ > 0 && " · "}
            {retardsNJ > 0 && `${retardsNJ} retard${retardsNJ>1?"s":""}`}
            {" "}— utilisez « Justifier » sur la ligne de l'élève.
          </Bandeau>
        </div>
      )}

      {/* ── HERO CARD ── */}
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"16px 18px 14px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:18,flexWrap:"wrap",marginBottom:20}}>
            <div style={{
              width:52,height:52,borderRadius:14,flexShrink:0,
              background:`linear-gradient(135deg,${t.blueMid},${t.blueSoft})`,
              border:`2px solid ${t.blueMid}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 2px 10px rgba(37,99,235,0.15)",
            }}>
              <i className="ti ti-clipboard-check" style={{fontSize:24,color:t.blue}} />
            </div>

            <div style={{flex:1,minWidth:0}}>
              <h2 style={{margin:0,fontSize:20,fontWeight:700,color:t.text,lineHeight:1.2}}>
                {seance.classe} — {seance.matiere}
              </h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
                <span style={{
                  fontSize:12,fontWeight:700,color:t.blue,
                  background:t.blueSoft,border:`1px solid ${t.blueMid}`,
                  padding:"3px 10px",borderRadius:6,letterSpacing:".3px",
                }}>
                  <i className="ti ti-calendar-event" style={{marginRight:5,fontSize:11}} />
                  {fmtDate(seance.date)}
                </span>
                <Chip label={seance.creneau} c={t.sub} bg="#f3f4f6" />
                <Chip label={`${c.taux}% de présence`} c={c.taux>=90?t.green:t.amber} bg={c.taux>=90?t.greenSoft:t.amberSoft} />
                <Chip label={`${c.total} élève${c.total>1?"s":""}`} c={t.sub} bg="#f3f4f6" />
              </div>
            </div>
          </div>

          <Divider />

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"0 32px",marginTop:4}}>
            <div>
              <InfoItem icon="ti-users"          label="Classe"   value={seance.classe} />
              <InfoItem icon="ti-book"           label="Matière"  value={seance.matiere} />
              <InfoItem icon="ti-clock-hour-4"   label="Créneau"  value={seance.creneau} />
            </div>
            <div>
              <InfoItem icon="ti-calendar-event" label="Date de la séance" value={fmtDate(seance.date)} />
              <InfoItem icon="ti-user-check"     label="Effectif appelé"   value={`${c.present} présent(s) sur ${c.total}`} />
              <InfoItem icon="ti-file-check"     label="À justifier"       value={nonJustifiees === 0 ? "Rien en attente" : `${absencesNJ} absence(s), ${retardsNJ} retard(s)`} />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:14}}>
        <StatBox icon="ti-user-check"      label="Présents" value={c.present} c={t.green}  bg={t.greenSoft}  />
        <StatBox icon="ti-user-x"          label="Absents"  value={c.absent}  c={t.red}    bg={t.redSoft}    />
        <StatBox icon="ti-clock"           label="Retards"  value={c.retard}  c={t.amber}  bg={t.amberSoft}  />
        <StatBox icon="ti-door-exit"       label="Exclus"   value={c.exclu}   c={t.purple} bg={t.purpleSoft} />
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",flexWrap:"wrap",gap:0,borderBottom:`1px solid ${t.border}`,marginBottom:16}}>
        {[
          {key:"anomalies", icon:"ti-alert-triangle", label:`Anomalies (${anomalies.length})`},
          {key:"tous",      icon:"ti-list",           label:`Tout l'appel (${c.total})`},
        ].map(tb=>(
          <TabBtn key={tb.key} active={tab===tb.key} icon={tb.icon} label={tb.label} onClick={()=>setTab(tb.key)} />
        ))}
      </div>

      {/* ── LISTE ── */}
      <SectionCard icon="ti-users" titre={tab==="anomalies" ? "Absences, retards et exclusions" : "Feuille d'appel complète"}
        extra={`${liste.length} ligne${liste.length>1?"s":""}`}>
        {liste.length === 0 ? (
          <div style={{padding:"18px"}}>
            <Bandeau icon="ti-circle-check" c={t.green} bg={t.greenSoft} border={t.greenMid}
              titre="Aucune anomalie sur cette séance">
              Tous les élèves de la classe étaient présents.
            </Bandeau>
          </div>
        ) : (
          liste.map((r,i)=>{
            const eleve = eleves.find(s=>s.id===r.studentId);
            const cfg   = STATUTS[r.status] || STATUTS.present;
            const detail = resumeDetail(r);
            return (
              <div key={r.studentId} style={{
                display:"flex",alignItems:"center",gap:12,padding:"11px 18px",
                borderBottom: i<liste.length-1 ? `1px solid ${t.border}` : "none",
              }}>
                <div style={{
                  width:34,height:34,borderRadius:"50%",flexShrink:0,
                  background:cfg.bg,border:`1px solid ${t.border}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:11.5,fontWeight:700,color:cfg.color,
                }}>{getInitials(eleve)}</div>

                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:t.text}}>{getNomComplet(eleve)}</div>
                  <div style={{fontSize:11,color:t.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {detail || eleve?.matricule}
                  </div>
                </div>

                <Chip label={cfg.label} c={cfg.color} bg={cfg.bg} />

                {(r.status === "absent" || r.status === "retard") && (
                  r.justifie ? (
                    <span style={{fontSize:11,color:t.green,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
                      <i className="ti ti-circle-check" style={{fontSize:13}} />
                      {r.status === "retard" ? `Retard — Justifié${r.motif ? ` (${r.motif})` : ""}` : "Justifiée"}
                    </span>
                  ) : (
                    <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
                      <Chip label="Non justifié" c={t.red} bg={t.redSoft} />
                      <button onClick={()=>onJustifier(seance.id, r.studentId, r.motif, r.status)} style={{
                        display:"flex",alignItems:"center",gap:6,padding:"6px 12px",
                        border:`1px solid ${t.blueMid}`,borderRadius:t.radius,
                        background:t.blueSoft,color:t.blue,
                        fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:t.font,whiteSpace:"nowrap",
                      }}>
                        <i className="ti ti-file-check" style={{fontSize:13}} /> Justifier
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })
        )}
      </SectionCard>
    </div>
  );
}

/* ─── MODAL CONFIRMATION D'EXCLUSION ─────────────────────────── */
function ExclusionModal({exclus, eleves, matiere, date, onCancel, onConfirm}) {
  const noms = exclus.map(r => getNomComplet(eleves.find(e=>e.id===r.studentId)));

  return (
    <div onClick={onCancel}
      style={{position:"fixed",inset:0,background:"rgba(17,24,39,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,width:480,maxWidth:"100%",boxShadow:"0 20px 40px rgba(0,0,0,0.2)",overflow:"hidden"}}>

        <div style={{padding:"14px 20px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:34,height:34,borderRadius:9,background:t.purpleSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <i className="ti ti-gavel" style={{fontSize:17,color:t.purple}} />
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:15,fontWeight:700,color:t.text}}>
              Créer une sanction d'exclusion ?
            </div>
            <div style={{fontSize:12,color:t.muted,marginTop:2}}>{matiere} — {fmtDate(date)}</div>
          </div>
        </div>

        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
          <div style={{fontSize:13,color:t.sub,lineHeight:1.5}}>
            Marquer {noms.length>1 ? "ces élèves" : <strong style={{color:t.text}}>{noms[0]}</strong>} comme
            {" "}<strong style={{color:t.purple}}>Exclu</strong> va créer une sanction de type Exclusion. Continuer ?
          </div>

          {noms.length > 1 && (
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {noms.map(n=>(
                <div key={n} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:t.text,fontWeight:500}}>
                  <i className="ti ti-door-exit" style={{fontSize:14,color:t.purple}} /> {n}
                </div>
              ))}
            </div>
          )}

          <Bandeau icon="ti-info-circle" c={t.blue} bg={t.blueSoft} border={t.blueMid}
            titre="Sanction créée en attente de validation">
            La durée et la preuve restent à compléter dans le module Discipline &amp; sanctions, où la direction
            validera ou rejettera la décision.
          </Bandeau>

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap",marginTop:4}}>
            <button onClick={onCancel}
              style={{padding:"10px 18px",border:`1px solid ${t.border}`,borderRadius:9,background:t.surface,fontSize:13,fontWeight:500,cursor:"pointer",color:t.sub,fontFamily:t.font}}>
              Annuler
            </button>
            <button onClick={()=>onConfirm(false)}
              style={{padding:"10px 18px",border:`1px solid ${t.border}`,borderRadius:9,background:t.surface,fontSize:13,fontWeight:600,cursor:"pointer",color:t.text,fontFamily:t.font,boxShadow:t.shadow}}>
              Créer la sanction
            </button>
            <button onClick={()=>onConfirm(true)}
              style={{
                display:"flex",alignItems:"center",gap:7,padding:"10px 18px",border:"none",borderRadius:9,
                background:t.blue,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:t.font,
                boxShadow:"0 2px 8px rgba(37,99,235,0.25)",
              }}>
              <i className="ti ti-gavel" style={{fontSize:14}} /> Créer et compléter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL JUSTIFICATION ────────────────────────────────────── */
function JustifyModal({eleve, motif, setMotif, onCancel, onConfirm, statut}) {
  const estRetard = statut === "retard";
  return (
    <div onClick={onCancel}
      style={{position:"fixed",inset:0,background:"rgba(17,24,39,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,width:420,maxWidth:"100%",boxShadow:"0 20px 40px rgba(0,0,0,0.2)",overflow:"hidden"}}>

        <div style={{padding:"14px 20px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:15,fontWeight:700,color:t.text}}>{estRetard ? "Justifier le retard" : "Justifier l'absence"}</div>
            <div style={{fontSize:12,color:t.muted,marginTop:2}}>{getNomComplet(eleve)}</div>
          </div>
          <button onClick={onCancel}
            style={{border:"none",background:"transparent",cursor:"pointer",color:t.muted,display:"flex",alignItems:"center",padding:4}}>
            <i className="ti ti-x" style={{fontSize:17}} />
          </button>
        </div>

        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:6}}>Motif *</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              {(estRetard ? OBS_CHIPS.retard : MOTIFS_ABSENCE).map(m=>(
                <QuickChip key={m} label={m} actif={motif===m} onClick={()=>setMotif(motif===m?"":m)} />
              ))}
            </div>
            <textarea rows={3} value={motif} onChange={e=>setMotif(e.target.value)}
              placeholder="Ex : maladie, rendez-vous médical..."
              style={{...inputStyle(),resize:"vertical",lineHeight:1.5}} />
          </div>

          <Bandeau icon="ti-info-circle" c={t.blue} bg={t.blueSoft} border={t.blueMid}
            titre="Justificatif enregistré côté établissement">
            {estRetard ? "Le retard" : "L'absence"} restera visible dans l'historique de la séance, marqué{estRetard?"":"e"} comme justifié{estRetard?"":"e"}.
          </Bandeau>

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            <button onClick={onCancel}
              style={{padding:"10px 18px",border:`1px solid ${t.border}`,borderRadius:9,background:t.surface,fontSize:13,fontWeight:500,cursor:"pointer",color:t.sub,fontFamily:t.font}}>
              Annuler
            </button>
            <button onClick={onConfirm} disabled={!motif.trim()}
              style={{
                display:"flex",alignItems:"center",gap:7,padding:"10px 18px",border:"none",borderRadius:9,
                background:motif.trim()?t.blue:t.muted,color:"#fff",fontSize:13,fontWeight:600,
                cursor:motif.trim()?"pointer":"not-allowed",fontFamily:t.font,
              }}>
              <i className="ti ti-circle-check" style={{fontSize:14}} /> Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────── */
export default function Absences({onNavigate}) {
  const { showToast } = useToast();
  const { eleves: tousLesEleves, absencesHistory, addAbsenceSeance, justifyAbsence, addSanction } = useSchoolData();
  const [tab, setTab] = useState("saisie"); // "saisie" | "historique"

  // ── Saisie du jour ──
  const [classe, setClasse]   = useState(CLASSES[0]);
  const [matiere, setMatiere] = useState(MATIERES[0]);
  const [creneau, setCreneau] = useState(CRENEAUX[0]);
  const [date, setDate]       = useState(todayISO());
  const [recherche, setRecherche] = useState("");
  const eleves = useMemo(
    () => tousLesEleves.filter(s => s.classe === classe && scolarise(s)),
    [tousLesEleves, classe]
  );
  const [rows, setRows] = useState(() => rowsFor(eleves));
  const [openObservationId, setOpenObservationId] = useState(null);

  const onClasseChange = (c) => {
    setClasse(c);
    setRows(rowsFor(tousLesEleves.filter(s => s.classe === c && scolarise(s))));
    setOpenObservationId(null);
    setRecherche("");
  };

  const patchRow = (id, patch) => setRows(prev => {
    const courant = prev[id] || emptyRow();
    const next = { ...courant, ...patch };
    // Un changement de statut remet à zéro les champs qui ne s'appliquent plus
    if (patch.status && patch.status !== courant.status) {
      next.motif     = "";
      next.retardMin = "";
      next.justifie  = false;
    }
    return { ...prev, [id]: next };
  });

  const setStatut = (id, s) => {
    patchRow(id, { status:s });
    setOpenObservationId(s === "present" ? null : id); // ouvre directement la saisie du motif
  };

  const markAllPresent = () => { setRows(rowsFor(eleves)); setOpenObservationId(null); };

  const elevesFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return eleves;
    return eleves.filter(e =>
      getNomComplet(e).toLowerCase().includes(q) ||
      (e.matricule || "").toLowerCase().includes(q)
    );
  }, [eleves, recherche]);

  // ── Historique (partagé via le contexte) ──
  const [seanceId, setSeanceId] = useState(null); // séance ouverte en plein écran
  const [justifyModal, setJustifyModal] = useState(null); // { recordId, studentId }
  const [motif, setMotif] = useState("");
  const [exclusionModal, setExclusionModal] = useState(null); // élèves marqués « Exclu » à confirmer

  const construireRecords = () => eleves.map(e => {
    const r = rows[e.id] || emptyRow();
    return {
      studentId: e.id,
      status: r.status || "present",
      justifie: (r.status === "absent" || r.status === "retard") ? !!r.justifie : false,
      motif: r.status === "present" ? "" : (r.motif || "").trim(),
      retardMin: r.status === "retard" ? Number(r.retardMin) || 0 : 0,
      note: (r.note || "").trim(),
    };
  });

  const enregistrerSeance = (records) => {
    const c = compteurs(records);
    addAbsenceSeance({ date, creneau, classe, matiere, records });
    showToast("Présences enregistrées", "success", `${classe} — ${c.absent} absent(s), ${c.retard} retard(s), ${c.exclu} exclu(s)`);
  };

  const handleSave = () => {
    const records = construireRecords();
    const exclus = records.filter(r => r.status === "exclu");
    // Une exclusion de cours doit passer par le module Sanctions : on demande confirmation avant
    if (exclus.length > 0) { setExclusionModal({ records, exclus }); return; }
    enregistrerSeance(records);
  };

  // Crée une sanction « Exclusion temporaire » en attente pour chaque élève exclu de la séance
  const confirmerExclusions = (allerAuxSanctions) => {
    const { records, exclus } = exclusionModal;
    exclus.forEach(r => addSanction({
      studentId: r.studentId,
      type: "Exclusion temporaire",
      motif: `Exclusion depuis le module Absences — ${matiere} du ${fmtDate(date)}${r.motif ? ` : ${r.motif}` : ""}`,
      dateFait: date,
      statut: "En attente",
    }));
    enregistrerSeance(records);
    showToast(
      `${exclus.length} sanction${exclus.length>1?"s":""} créée${exclus.length>1?"s":""}`,
      "warning",
      "À compléter dans Discipline & sanctions (durée, preuve) puis à valider par la direction",
    );
    setExclusionModal(null);
    if (allerAuxSanctions && onNavigate) {
      onNavigate("Discipline & sanctions", { studentId: exclus[0].studentId });
    }
  };

  const openJustify = (recordId, studentId, currentMotif, status) => {
    setJustifyModal({ recordId, studentId, status });
    setMotif(currentMotif || "");
  };

  const confirmJustify = () => {
    justifyAbsence(justifyModal.recordId, justifyModal.studentId, motif);
    showToast(justifyModal.status === "retard" ? "Retard justifié" : "Absence justifiée", "success", motif);
    setJustifyModal(null);
  };

  // ── Récap de la saisie en cours ──
  const saisie = useMemo(
    () => compteurs(eleves.map(e => rows[e.id] || emptyRow())),
    [eleves, rows]
  );
  const absentsSansMotif = useMemo(
    () => eleves.filter(e => { const r = rows[e.id]; return r && r.status !== "present" && !r.motif.trim(); }).length,
    [eleves, rows]
  );

  // ── Stats globales (sur l'historique) ──
  const stats = useMemo(() => {
    let total=0, present=0, absent=0, retard=0, absentsNonJustifies=0, retardsNonJustifies=0;
    const parEleve = {};
    absencesHistory.forEach(rec => rec.records.forEach(r => {
      total++;
      if (r.status === "present") present++;
      if (r.status === "absent") { absent++; if (!r.justifie) absentsNonJustifies++; parEleve[r.studentId] = (parEleve[r.studentId]||0)+1; }
      if (r.status === "retard") { retard++; if (!r.justifie) retardsNonJustifies++; }
    }));
    const tauxPresence = total ? Math.round((present/total)*100) : 100;
    const eleveAlerte = Object.entries(parEleve).sort((a,b)=>b[1]-a[1])[0];
    return { tauxPresence, absent, retard, absentsNonJustifies, retardsNonJustifies, eleveAlerte };
  }, [absencesHistory]);

  const eleveSurveille = stats.eleveAlerte
    ? tousLesEleves.find(s => s.id === Number(stats.eleveAlerte[0]))
    : null;

  const seanceSel = seanceId ? absencesHistory.find(s => s.id === seanceId) : null;
  const eleveJustifie = justifyModal ? tousLesEleves.find(s => s.id === justifyModal.studentId) : null;

  /* ── FICHE PLEIN ÉCRAN (comme la fiche élève de Gestion des élèves) ── */
  if (seanceSel) return (
    <>
      <FicheSeance seance={seanceSel} onRetour={()=>setSeanceId(null)} onJustifier={openJustify} />
      {justifyModal && (
        <JustifyModal eleve={eleveJustifie} motif={motif} setMotif={setMotif}
          statut={justifyModal.status}
          onCancel={()=>setJustifyModal(null)} onConfirm={confirmJustify} />
      )}
    </>
  );

  return (
    <div style={{fontFamily:t.font,color:t.text}}>

      {/* ── HEADER ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,margin:0,color:t.text}}>Absences & présences</h1>
          <p style={{fontSize:13,color:t.sub,marginTop:4,margin:0}}>
            Saisie détaillée des présences par classe, justification des absences et historique des séances
          </p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
        <StatBox icon="ti-checkbox" label="Taux de présence" value={`${stats.tauxPresence}%`}
          c={t.green} bg={t.greenSoft} />
        <StatBox icon="ti-alert-triangle" label="Absences non justifiées" value={stats.absentsNonJustifies}
          c={t.red} bg={t.redSoft} />
        <StatBox icon="ti-clock" label="Retards non justifiés" value={stats.retardsNonJustifies}
          c={t.amber} bg={t.amberSoft} />
        <StatBox icon="ti-user-exclamation" label="Élève à surveiller"
          value={eleveSurveille ? getNomComplet(eleveSurveille) : "—"}
          c={t.purple} bg={t.purpleSoft} />
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",flexWrap:"wrap",gap:0,borderBottom:`1px solid ${t.border}`,marginBottom:16}}>
        {[
          {key:"saisie",     icon:"ti-clipboard-check", label:"Saisie du jour"},
          {key:"historique", icon:"ti-history",         label:`Historique (${absencesHistory.length})`},
        ].map(tb=>(
          <TabBtn key={tb.key} active={tab===tb.key} icon={tb.icon} label={tb.label} onClick={()=>setTab(tb.key)} />
        ))}
      </div>

      {/* ═══ SAISIE DU JOUR ═══ */}
      {tab === "saisie" && (
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden"}}>

          <div style={{padding:"14px 20px",borderBottom:`1px solid ${t.border}`}}>
            <div style={{fontSize:14,fontWeight:600,color:t.text}}>Feuille de présence</div>
            <div style={{fontSize:12,color:t.muted,marginTop:2}}>
              Choisissez la séance, marquez chaque élève puis précisez le motif, les minutes de retard ou une observation
            </div>
          </div>

          {/* Paramètres de la séance */}
          <div style={{padding:"18px 20px",borderBottom:`1px solid ${t.border}`,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14}}>
            <Field label="Classe">
              <select value={classe} onChange={e=>onClasseChange(e.target.value)} style={inputStyle()}>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Matière">
              <select value={matiere} onChange={e=>setMatiere(e.target.value)} style={inputStyle()}>
                {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Créneau horaire">
              <select value={creneau} onChange={e=>setCreneau(e.target.value)} style={inputStyle()}>
                {CRENEAUX.map(cr => <option key={cr} value={cr}>{cr}</option>)}
              </select>
            </Field>
            <Field label="Date de la séance">
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle()} />
            </Field>
          </div>

          {/* Récapitulatif + recherche + raccourci */}
          <div style={{padding:"11px 20px",borderBottom:`1px solid ${t.border}`,background:t.bg,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <Chip label={`${saisie.present} présent${saisie.present>1?"s":""}`} c={t.green}  bg={t.greenSoft}  />
            <Chip label={`${saisie.absent} absent${saisie.absent>1?"s":""}`}    c={t.red}    bg={t.redSoft}    />
            <Chip label={`${saisie.retard} retard${saisie.retard>1?"s":""}`}    c={t.amber}  bg={t.amberSoft}  />
            <Chip label={`${saisie.exclu} exclu${saisie.exclu>1?"s":""}`}       c={t.purple} bg={t.purpleSoft} />

            <div style={{position:"relative",marginLeft:"auto"}}>
              <i className="ti ti-search" style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:t.muted}} />
              <input type="text" value={recherche} onChange={e=>setRecherche(e.target.value)}
                placeholder="Rechercher un élève..."
                style={{...inputStyle(),width:210,padding:"8px 12px 8px 32px"}} />
            </div>
            <button onClick={markAllPresent} style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"8px 14px",border:`1px solid ${t.border}`,borderRadius:t.radius,
              background:t.surface,color:t.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:t.font,
            }}>
              <i className="ti ti-checks" style={{fontSize:14}} /> Tout marquer présent
            </button>
          </div>

          {/* Alerte motifs manquants */}
          {absentsSansMotif > 0 && (
            <div style={{padding:"14px 20px",borderBottom:`1px solid ${t.border}`}}>
              <Bandeau icon="ti-alert-triangle" c={t.amber} bg={t.amberSoft} border={t.amberMid}
                titre={`${absentsSansMotif} ligne${absentsSansMotif>1?"s":""} sans motif renseigné`}>
                Vous pouvez enregistrer malgré tout — le motif pourra être ajouté plus tard depuis la fiche de la séance.
              </Bandeau>
            </div>
          )}

          {/* Liste des élèves */}
          {elevesFiltres.length === 0 ? (
            <div style={{padding:48,textAlign:"center",color:t.muted,fontSize:13}}>
              <i className="ti ti-users-off" style={{fontSize:28,display:"block",marginBottom:10,color:t.border}} />
              {eleves.length === 0 ? "Aucun élève dans cette classe" : "Aucun élève ne correspond à cette recherche"}
            </div>
          ) : (
            elevesFiltres.map((e,i)=>(
              <SaisieRow key={e.id} eleve={e} row={rows[e.id] || emptyRow()}
                onChange={patch => "status" in patch ? setStatut(e.id, patch.status) : patchRow(e.id, patch)}
                ouvert={openObservationId===e.id}
                onToggle={()=>setOpenObservationId(openObservationId===e.id?null:e.id)}
                dernier={i===elevesFiltres.length-1}
              />
            ))
          )}

          {/* Pied de carte */}
          <div style={{padding:"11px 20px",borderTop:`1px solid ${t.border}`,background:t.bg,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:t.muted}}>
              {eleves.length} élève{eleves.length>1?"s":""} · {classe} · {matiere} · {fmtDate(date)} · {creneau}
            </span>
            <button onClick={handleSave} disabled={eleves.length===0} style={{
              display:"flex",alignItems:"center",gap:7,padding:"10px 18px",border:"none",borderRadius:9,
              background:eleves.length===0?t.muted:t.blue,color:"#fff",fontSize:13,fontWeight:600,
              cursor:eleves.length===0?"not-allowed":"pointer",fontFamily:t.font,
              boxShadow:eleves.length===0?"none":"0 2px 8px rgba(37,99,235,0.25)",
            }}>
              <i className="ti ti-device-floppy" style={{fontSize:14}} /> Enregistrer la séance
            </button>
          </div>
        </div>
      )}

      {/* ═══ HISTORIQUE ═══ */}
      {tab === "historique" && (
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden"}}>
          {absencesHistory.length === 0
            ? (
              <div style={{padding:48,textAlign:"center",color:t.muted,fontSize:13}}>
                <i className="ti ti-history" style={{fontSize:28,display:"block",marginBottom:10,color:t.border}} />
                Aucune séance enregistrée pour l'instant
              </div>
            )
            : absencesHistory.map((rec,i)=>(
              <SeanceRow key={rec.id} seance={rec}
                onOuvrir={()=>setSeanceId(rec.id)}
                dernier={i===absencesHistory.length-1}
              />
            ))
          }

          {absencesHistory.length > 0 && (
            <div style={{padding:"11px 18px",borderTop:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:t.bg,gap:12,flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:t.muted}}>
                {absencesHistory.length} séance{absencesHistory.length>1?"s":""} enregistrée{absencesHistory.length>1?"s":""} — cliquez une ligne pour ouvrir la fiche
              </span>
              <span style={{fontSize:12,color:t.muted}}>
                <i className="ti ti-archive" style={{fontSize:12,marginRight:5}} />
                Historique conservé à vie
              </span>
            </div>
          )}
        </div>
      )}

      {/* ═══ MODAL JUSTIFICATION ═══ */}
      {justifyModal && (
        <JustifyModal eleve={eleveJustifie} motif={motif} setMotif={setMotif}
          statut={justifyModal.status}
          onCancel={()=>setJustifyModal(null)} onConfirm={confirmJustify} />
      )}

      {/* ═══ MODAL EXCLUSION → SANCTION ═══ */}
      {exclusionModal && (
        <ExclusionModal exclus={exclusionModal.exclus} eleves={tousLesEleves}
          matiere={matiere} date={date}
          onCancel={()=>setExclusionModal(null)} onConfirm={confirmerExclusions} />
      )}
    </div>
  );
}
