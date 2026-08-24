import { useState } from "react";
import { STATUTS, getNomComplet, getEtablissementDestination, getEtablissementOrigine } from "./studentsData";
import { aujourdhui, formatDate, finExclusion, estExclusionEnCours } from "./sanctionsData";
import { useToast } from "../context/ToastContext";
import { useSchoolData, ECOLE_SCHOOLX, ANNEE_COURANTE, ANNEE_PRECEDENTE } from "../context/SchoolDataContext";

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
  purple:   "#7c3aed",
  purpleSoft:"#f5f3ff",
  purpleMid:"#ddd6fe",
  radius:   "10px",
  radiusLg: "14px",
  shadow:   "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.07)",
  font:     "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── HELPERS ────────────────────────────────────────────────── */
const noteColor = (n) =>
  n >= 16 ? t.green : n >= 12 ? t.blue : n >= 10 ? t.amber : t.red;

const noteLabel = (n) =>
  n >= 16 ? "Excellent" : n >= 14 ? "Très bien" : n >= 12 ? "Bien" : n >= 10 ? "Passable" : "Insuffisant";

const noteBg = (n) =>
  n >= 16 ? t.greenSoft : n >= 12 ? t.blueSoft : n >= 10 ? t.amberSoft : t.redSoft;

const pStatusColor = (s) =>
  s === "Payé" ? {c:t.green,bg:t.greenSoft} : s === "En attente" ? {c:t.amber,bg:t.amberSoft} : {c:t.red,bg:t.redSoft};

const statusColor = (s) => ({
  "Actif":      {c:t.green,   bg:t.greenSoft },
  "Inactif":    {c:t.red,     bg:t.redSoft   },
  "Transféré":  {c:t.purple,  bg:t.purpleSoft},
  "Exclu":      {c:t.redDark,  bg:t.redMid   },
}[s] || {c:t.muted, bg:t.bg});

// Suspension en cours = exclusion temporaire validée dont la date de fin n'est pas dépassée
const suspensionActive = (eleve) => {
  const fin = eleve?.suspension?.dateFin;
  return fin && fin >= aujourdhui() ? eleve.suspension : null;
};

const sanctionTypeColor = (type) => ({
  "Avertissement":        {c:t.amber,   bg:t.amberSoft },
  "Blâme":                {c:t.orange,  bg:t.orangeSoft},
  "Exclusion temporaire": {c:t.red,     bg:t.redSoft   },
  "Exclusion définitive": {c:t.redDark, bg:t.redSoft   },
}[type] || {c:t.muted, bg:t.bg});

const sanctionStatutColor = (statut) => ({
  "En attente": {c:t.amber, bg:t.amberSoft},
  "Validée":    {c:t.green, bg:t.greenSoft},
  "Rejetée":    {c:t.sub,   bg:"#f3f4f6"  },
}[statut] || {c:t.muted, bg:t.bg});

const evenementColor = (ev) => ({
  "Inscription":          {c:t.blue,   bg:t.blueSoft,   icon:"ti-user-plus"      },
  "Passage de classe":    {c:t.green,  bg:t.greenSoft,  icon:"ti-arrow-up-right" },
  "Transfert entrant":    {c:t.amber,  bg:t.amberSoft,  icon:"ti-login"          },
  "Transfert sortant":    {c:t.purple, bg:t.purpleSoft, icon:"ti-logout"         },
  "Scolarité antérieure": {c:t.sub,    bg:t.bg,         icon:"ti-history"        },
  "Exclusion temporaire": {c:t.red,    bg:t.redSoft,    icon:"ti-user-off"       },
  "Exclusion définitive": {c:t.redDark,bg:t.redMid,     icon:"ti-ban"            },
}[ev] || {c:t.muted, bg:t.bg, icon:"ti-point"});

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

const ActionBtn = ({icon,label,primary,c,bg,border,onClick}) => (
  <button onClick={onClick} style={{
    display:"flex",alignItems:"center",gap:7,
    padding:"9px 16px",border:primary?"none":`1px solid ${border||t.border}`,
    borderRadius:t.radius,cursor:"pointer",
    fontFamily:t.font,fontSize:13,fontWeight:500,
    background:primary?t.blue:(bg||t.surface),
    color:primary?"#fff":(c||t.sub),
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

const Bandeau = ({icon, c, bg, border, titre, children}) => (
  <div style={{display:"flex",alignItems:"flex-start",gap:12,background:bg,border:`1px solid ${border}`,borderRadius:t.radius,padding:"13px 16px",marginBottom:14}}>
    <i className={`ti ${icon}`} style={{fontSize:18,color:c,marginTop:1,flexShrink:0}} />
    <div>
      <div style={{fontSize:13,fontWeight:600,color:c}}>{titre}</div>
      <div style={{fontSize:12,color:t.sub,marginTop:3}}>{children}</div>
    </div>
  </div>
);

const ParcoursEtape = ({etape, last}) => {
  const ec = evenementColor(etape.evenement);
  return (
    <div style={{display:"flex",gap:12}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:ec.bg,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <i className={`ti ${ec.icon}`} style={{fontSize:14,color:ec.c}} />
        </div>
        {!last && <div style={{flex:1,width:2,background:t.border,marginTop:4}} />}
      </div>
      <div style={{flex:1,minWidth:0,paddingBottom:last?0:18}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:13,fontWeight:600,color:t.text}}>{etape.classe}</span>
          <Chip label={etape.evenement} c={ec.c} bg={ec.bg} />
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",marginTop:4}}>
          <span style={{fontSize:12,color:t.sub}}>
            <i className="ti ti-calendar" style={{fontSize:12,color:t.muted,marginRight:5}} />
            {etape.annee}
          </span>
          <span style={{fontSize:12,color:t.sub}}>
            <i className="ti ti-building" style={{fontSize:12,color:t.muted,marginRight:5}} />
            {etape.etablissement}
          </span>
        </div>
        {etape.etablissementDestination && (
          <div style={{fontSize:12,fontWeight:600,color:t.purple,marginTop:5}}>
            <i className="ti ti-arrow-right" style={{fontSize:12,marginRight:5}} />
            Destination : {etape.etablissementDestination}
          </div>
        )}
        {(etape.details || etape.motif) && (
          <div style={{fontSize:12,color:t.sub,marginTop:5,lineHeight:1.5}}>{etape.details || etape.motif}</div>
        )}
        {(etape.dateFin || etape.date) && (
          <div style={{fontSize:12,fontWeight:600,color:t.red,marginTop:4}}>
            <i className={`ti ${etape.dateFin?"ti-calendar-off":"ti-calendar-event"}`} style={{fontSize:12,marginRight:5}} />
            {etape.dateFin ? `Jusqu'au ${formatDate(etape.dateFin)}` : `Décision du ${formatDate(etape.date)}`}
          </div>
        )}
      </div>
    </div>
  );
};

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
function Profil({eleve, onRetour, onNavigate}) {
  const { getSanctionsEleve, getAbsencesEleve } = useSchoolData();
  const [tab, setTab] = useState("notes");
  const parcours    = eleve.parcours || [];
  const destination = getEtablissementDestination(eleve);
  const origine     = getEtablissementOrigine(eleve);
  const sanctions   = getSanctionsEleve(eleve.id);
  const derniereSanction = sanctions.length
    ? [...sanctions].sort((a,b)=>b.dateFait.localeCompare(a.dateFait))[0]
    : null;
  const exclusionEnCours = sanctions.find(estExclusionEnCours) || null;
  const suspension       = suspensionActive(eleve);
  const absences         = getAbsencesEleve(eleve.id);
  const derniereAbsence  = absences[0] || null;
  const absencesNonJustifiees = absences.filter(a=>!a.justifie).length;
  const reste  = eleve.paiements.total - eleve.paiements.paye;
  const tPres  = Math.round((eleve.presences.present / (eleve.presences.total||1)) * 100);
  const tPaie  = Math.round((eleve.paiements.paye   / (eleve.paiements.total||1)) * 100);
  const moy    = eleve.notes.length
    ? (eleve.notes.reduce((a,n)=>a+n.note*n.coef,0) / eleve.notes.reduce((a,n)=>a+n.coef,0)).toFixed(2)
    : "—";

    const loadJsPDF = () => new Promise((resolve) => {
  if (window.jspdf) return resolve(window.jspdf.jsPDF);
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  script.onload = () => resolve(window.jspdf.jsPDF);
  document.head.appendChild(script);
});

const downloadBulletin = () => {
  loadJsPDF().then((JsPDF) => {
    const doc = new JsPDF({ unit: "mm", format: "a4" });
    const pageWidth = 210;
    const marginX = 15;
    let y = 18;

    const notes = eleve.notes.length ? eleve.notes : [];
    const meilleure = notes.length ? notes.reduce((a, n) => n.note > a.note ? n : a, notes[0]) : null;
    const faible = notes.length ? notes.reduce((a, n) => n.note < a.note ? n : a, notes[0]) : null;

    // ── EN-TÊTE ÉCOLE ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SchoolX", marginX, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Lycée Donka — Conakry, Guinée", marginX, y + 5);

    doc.setFontSize(10);
    doc.text(`Émis le ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - marginX, y, { align: "right" });
    y += 10;
    doc.setDrawColor(200);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("BULLETIN DE NOTES — Année 2024/2025", pageWidth / 2, y, { align: "center" });
    y += 10;

    // ── BANDEAU INFOS ÉLÈVE ──
    doc.setDrawColor(220);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(marginX, y, pageWidth - marginX * 2, 36, 2, 2, "F");

    const infoY = y + 7;
    const col1 = marginX + 4;
    const col2 = marginX + 95;
    doc.setFontSize(9);

    const infoLine = (label, value, x, yy) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120);
      doc.text(label, x, yy);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20);
      doc.text(String(value), x, yy + 4.5);
    };

    infoLine("Nom complet", `${eleve.prenom} ${eleve.nom}`, col1, infoY);
    infoLine("Matricule", eleve.matricule, col2, infoY);
    infoLine("Classe", eleve.classe, col1, infoY + 10);
    infoLine("Sexe", eleve.sexe === "M" ? "Masculin" : "Féminin", col2, infoY + 10);
    infoLine("Présences", `${eleve.presences.present}/${eleve.presences.total} (${tPres}%)`, col1, infoY + 20);
    infoLine("Statut", eleve.status, col2, infoY + 20);

    y += 42;

    // ── TABLEAU DES NOTES ──
    const tableX = marginX;
    const tableW = pageWidth - marginX * 2;
    const colW = [65, 50, 25, tableW - 65 - 50 - 25];
    const rowH = 8;

    doc.setFillColor(37, 99, 235);
    doc.rect(tableX, y, tableW, rowH, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    let x = tableX + 3;
    ["Matière", "Professeur", "Note", "Appréciation"].forEach((h, i) => {
      doc.text(h, x, y + 5.5);
      x += colW[i];
    });
    y += rowH;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    notes.forEach((n, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(250, 250, 251);
        doc.rect(tableX, y, tableW, rowH, "F");
      }
      doc.setTextColor(20);
      x = tableX + 3;
      doc.text(n.matiere, x, y + 5.5); x += colW[0];
      doc.text(n.prof || "—", x, y + 5.5); x += colW[1];
      doc.text(`${n.note}/20`, x, y + 5.5); x += colW[2];
      doc.text(noteLabel(n.note), x, y + 5.5);
      y += rowH;
    });

    // Moyenne pondérée
    doc.setFillColor(239, 246, 255);
    doc.rect(tableX, y, tableW, rowH, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("Moyenne pondérée", tableX + 3, y + 5.5);
    doc.text(`${moy}/20`, tableX + colW[0] + colW[1] + 3, y + 5.5);
    y += rowH + 6;

    // Point fort / à renforcer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    if (meilleure) {
      doc.setTextColor(22, 163, 74);
      doc.text(`Point fort : ${meilleure.matiere} (${meilleure.note}/20)`, tableX, y);
    }
    if (faible) {
      doc.setTextColor(220, 38, 38);
      doc.text(`À renforcer : ${faible.matiere} (${faible.note}/20)`, tableX + tableW / 2, y);
    }
    y += 6;

    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.text("Statut général : ", tableX, y);
    doc.text(noteLabel(parseFloat(moy)), tableX + 32, y);
    y += 10;

    // ── BLOC SIGNATURES ──
    const sigY = Math.min(y + 8, 215);
    doc.setDrawColor(180);
    doc.line(marginX, sigY, pageWidth - marginX, sigY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Fait à Conakry, le " + new Date().toLocaleDateString("fr-FR"), marginX, sigY + 6);

    const sigBoxW = 75;
    const sigBoxY = sigY + 14;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(20);
    doc.text("Le Directeur", marginX + sigBoxW / 2, sigBoxY, { align: "center" });
    doc.text("Le Tuteur / Parent", pageWidth - marginX - sigBoxW / 2, sigBoxY, { align: "center" });

    doc.setDrawColor(150);
    doc.line(marginX, sigBoxY + 18, marginX + sigBoxW, sigBoxY + 18);
    doc.line(pageWidth - marginX - sigBoxW, sigBoxY + 18, pageWidth - marginX, sigBoxY + 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text("Signature et cachet", marginX + sigBoxW / 2, sigBoxY + 22, { align: "center" });
    doc.text(eleve.tuteur || "Signature", pageWidth - marginX - sigBoxW / 2, sigBoxY + 22, { align: "center" });

    doc.setFontSize(7.5);
    doc.setTextColor(180);
    doc.text("Généré automatiquement par SchoolX — document à usage interne", pageWidth / 2, 290, { align: "center" });

    doc.save(`Bulletin_${eleve.prenom}_${eleve.nom}.pdf`);
  });
};

  return (
     <div style={{fontFamily:t.font,color:t.text,maxWidth:"860px",margin:"0 auto"}}>

      {/* ── TOP BAR ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <ActionBtn icon="ti-arrow-left" label="Retour" primary onClick={onRetour} />
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {onNavigate && (
            <ActionBtn icon="ti-gavel" label="Sanctionner"
              c={t.red} bg={t.redSoft} border={t.redMid}
              onClick={()=>onNavigate("Discipline & sanctions",{studentId:eleve.id})}
            />
          )}
          <ActionBtn icon="ti-archive" label="Archiver" />
          <ActionBtn icon="ti-folder"  label="Dossier"  />
        </div>
      </div>

      {/* ── BANDEAUX TRANSFERT ── */}
      {origine && (
        <Bandeau icon="ti-login" c={t.amber} bg={t.amberSoft} border={t.amberMid} titre={`Arrivé de ${origine}`}>
          {getNomComplet(eleve)} a rejoint l'établissement par transfert entrant — sa scolarité antérieure figure dans le parcours scolaire.
        </Bandeau>
      )}

      {eleve.status==="Transféré" && (
        <Bandeau icon="ti-logout" c={t.purple} bg={t.purpleSoft} border={t.purpleMid} titre="Élève transféré">
          {getNomComplet(eleve)} a quitté l'établissement pour{" "}
          <strong style={{color:t.text}}>{destination || "un établissement non précisé"}</strong>.
        </Bandeau>
      )}

      {exclusionEnCours && (
        <Bandeau icon="ti-user-off" c={t.red} bg={t.redSoft} border={t.redMid}
          titre={exclusionEnCours.type==="Exclusion définitive"
            ? "Exclusion définitive en vigueur"
            : `Exclusion en cours jusqu'au ${formatDate(finExclusion(exclusionEnCours))}`}>
          {exclusionEnCours.motif} — sanction validée par la direction le {formatDate(exclusionEnCours.dateValidation)}.
        </Bandeau>
      )}

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
                <Chip label={eleve.status} c={statusColor(eleve.status).c} bg={statusColor(eleve.status).bg} />
                {suspension && (
                  <Chip label={`Suspendu jusqu'au ${formatDate(suspension.dateFin)}`} c={t.red} bg={t.redSoft} />
                )}
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

      {/* ── PARCOURS SCOLAIRE ── */}
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:600,color:t.text}}>
            <i className="ti ti-route" style={{fontSize:14,color:t.muted,marginRight:7}} />
            Parcours scolaire
          </span>
          <span style={{fontSize:12,color:t.muted}}>{parcours.length} étape{parcours.length>1?"s":""}</span>
        </div>
        {parcours.length===0
          ? <div style={{padding:32,textAlign:"center",fontSize:13,color:t.muted}}>Aucun historique scolaire enregistré</div>
          : (
            <div style={{padding:"18px 20px"}}>
              {parcours.map((etape,i)=>(
                <ParcoursEtape key={`${etape.annee}-${i}`} etape={etape} last={i===parcours.length-1} />
              ))}
            </div>
          )
        }
      </div>

      {/* ── DISCIPLINE (lecture seule) ── */}
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:600,color:t.text}}>
            <i className="ti ti-gavel" style={{fontSize:14,color:t.muted,marginRight:7}} />
            Discipline
          </span>
          <span style={{fontSize:12,color:t.muted}}>
            {sanctions.length} sanction{sanctions.length>1?"s":""} au dossier
          </span>
        </div>
        {!derniereSanction
          ? <div style={{padding:"20px",textAlign:"center",fontSize:13,color:t.muted}}>Aucune sanction au dossier</div>
          : (
            <div style={{padding:"14px 18px"}}>
              <div style={{fontSize:10,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px",marginBottom:7}}>
                Sanction la plus récente
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:7}}>
                <Chip label={derniereSanction.type}   c={sanctionTypeColor(derniereSanction.type).c}     bg={sanctionTypeColor(derniereSanction.type).bg} />
                <Chip label={derniereSanction.statut} c={sanctionStatutColor(derniereSanction.statut).c} bg={sanctionStatutColor(derniereSanction.statut).bg} />
                <span style={{fontSize:12,color:t.muted}}>Faits du {formatDate(derniereSanction.dateFait)}</span>
              </div>
              <div style={{fontSize:13,color:t.sub,lineHeight:1.5}}>{derniereSanction.motif}</div>
            </div>
          )
        }
      </div>

      {/* ── ABSENCES (lecture seule) ── */}
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,boxShadow:t.shadow,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:600,color:t.text}}>
            <i className="ti ti-calendar-off" style={{fontSize:14,color:t.muted,marginRight:7}} />
            Absences relevées
          </span>
          <span style={{fontSize:12,color:t.muted}}>
            {absences.length} absence{absences.length>1?"s":""} enregistrée{absences.length>1?"s":""}
          </span>
        </div>
        {!derniereAbsence
          ? <div style={{padding:"20px",textAlign:"center",fontSize:13,color:t.muted}}>Aucune absence relevée dans les séances saisies</div>
          : (
            <div style={{padding:"14px 18px"}}>
              <div style={{fontSize:10,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".4px",marginBottom:7}}>
                Absence la plus récente
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:7}}>
                <Chip label={derniereAbsence.justifie?"Justifiée":"Non justifiée"}
                  c={derniereAbsence.justifie?t.green:t.red}
                  bg={derniereAbsence.justifie?t.greenSoft:t.redSoft} />
                <span style={{fontSize:12,color:t.muted}}>
                  {derniereAbsence.matiere} — {formatDate(derniereAbsence.date)}
                </span>
                {absencesNonJustifiees > 0 && (
                  <Chip label={`${absencesNonJustifiees} à justifier`} c={t.amber} bg={t.amberSoft} />
                )}
              </div>
              <div style={{fontSize:13,color:t.sub,lineHeight:1.5}}>
                {derniereAbsence.motif || "Aucun motif communiqué"}
              </div>
            </div>
          )
        }
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",flexWrap:"wrap",gap:0,borderBottom:`1px solid ${t.border}`,marginBottom:16}}>
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
            <StatBox icon="ti-book"       label="Matières" value={eleve.notes.length} c={t.purple} bg={t.purpleSoft} />
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
export default function Eleves({onNavigate}) {
  const { showToast } = useToast();
  const { eleves, addEleve } = useSchoolData();
  const [search,   setSearch]   = useState("");
  const [filtre,   setFiltre]   = useState("Tous");
  const [filtreStatus, setFiltreStatus] = useState("Tous");
  const [selected, setSelected] = useState(null); // id de l'élève affiché en fiche
  const [modal,    setModal]    = useState(false);
  const [errors,   setErrors]   = useState({});
  const [typeInscription, setTypeInscription] = useState("nouvelle");
  const [form,     setForm]     = useState({
    prenom:"",nom:"",sexe:"M",dateNaissance:"",
    classe:"",numero:"",email:"",
    tuteur:"",numeroTuteur:"",adresse:"",
    etablissementOrigine:"",classePrecedente:"",
  });

  const classes  = ["Tous",...new Set(eleves.map(e=>e.classe))];
  const statuts  = ["Tous",...STATUTS];
  const filtered = eleves.filter(e=>{
    const m = `${e.prenom} ${e.nom}`.toLowerCase().includes(search.toLowerCase());
    const c = filtre==="Tous" || e.classe===filtre;
    const s = filtreStatus==="Tous" || e.status===filtreStatus;
    return m&&c&&s;
  });

  const validate = () => {
    const errs = {};
    if (!form.prenom || !form.prenom.trim()) errs.prenom = "Le prénom est requis";
    if (!form.nom || !form.nom.trim()) errs.nom = "Le nom est requis";
    if (!form.classe || !form.classe.trim()) errs.classe = "La classe est requise";
    if (form.email && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Format email invalide";
    }
    if (typeInscription==="transfert") {
      if (!form.etablissementOrigine || !form.etablissementOrigine.trim()) errs.etablissementOrigine = "L'établissement d'origine est requis";
      if (!form.classePrecedente || !form.classePrecedente.trim()) errs.classePrecedente = "La classe précédente est requise";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const add = () => {
    if (!validate()) {
      showToast("Veuillez corriger les champs en rouge", "error");
      return;
    }
    const {etablissementOrigine, classePrecedente, ...infos} = form;
    const parcours = typeInscription==="transfert"
      ? [
          {annee:ANNEE_PRECEDENTE,classe:classePrecedente,etablissement:etablissementOrigine,evenement:"Scolarité antérieure"},
          {annee:ANNEE_COURANTE,  classe:form.classe,     etablissement:ECOLE_SCHOOLX,       evenement:"Transfert entrant"},
        ]
      : [{annee:ANNEE_COURANTE,classe:form.classe,etablissement:ECOLE_SCHOOLX,evenement:"Inscription"}];

    addEleve({...infos, status:"Actif", parcours});
    setForm({prenom:"",nom:"",sexe:"M",dateNaissance:"",classe:"",numero:"",email:"",tuteur:"",numeroTuteur:"",adresse:"",etablissementOrigine:"",classePrecedente:""});
    setTypeInscription("nouvelle");
    setErrors({});
    setModal(false);
    showToast(`${form.prenom} ${form.nom} ajouté(e) avec succès`, "success");
  };

  // On garde l'id plutôt que l'objet pour que la fiche reflète les mises à jour du contexte
  const eleveSelectionne = selected ? eleves.find(e=>e.id===selected) : null;
  if(eleveSelectionne) return <Profil eleve={eleveSelectionne} onRetour={()=>setSelected(null)} onNavigate={onNavigate} />;

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
        <StatBox icon="ti-school"       label="Classes"          value={classes.length-1} c={t.purple} bg={t.purpleSoft} />
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
        <select value={filtreStatus} onChange={e=>setFiltreStatus(e.target.value)}
          style={{padding:"10px 14px",border:`1px solid ${t.border}`,borderRadius:t.radius,fontSize:13,fontFamily:t.font,outline:"none",background:t.surface,cursor:"pointer",color:t.text,boxShadow:t.shadow,flexShrink:0}}>
          {statuts.map(s=><option key={s}>{s}</option>)}
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
                  <tr key={e.id} onClick={()=>setSelected(e.id)}
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
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <Chip
                          label={e.status}
                          c={statusColor(e.status).c}
                          bg={statusColor(e.status).bg}
                        />
                        {suspensionActive(e) && (
                          <Chip label={`Suspendu jusqu'au ${formatDate(e.suspension.dateFin)}`} c={t.red} bg={t.redSoft} />
                        )}
                      </div>
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

            {/* Type d'inscription */}
            <div style={{marginBottom:16}}>
              <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:6}}>Type d'inscription</label>
              <div style={{display:"flex",gap:8}}>
                {[
                  {key:"nouvelle",  icon:"ti-user-plus", label:"Nouvelle inscription", hint:"Premier établissement"},
                  {key:"transfert", icon:"ti-login",     label:"Élève transféré",      hint:"Venant d'une autre école"},
                ].map(ti=>{
                  const actif = typeInscription===ti.key;
                  return (
                    <button key={ti.key} onClick={()=>setTypeInscription(ti.key)} style={{
                      flex:1,display:"flex",alignItems:"center",gap:9,textAlign:"left",
                      padding:"10px 12px",border:`1px solid ${actif?t.blue:t.border}`,borderRadius:t.radius,
                      background:actif?t.blueSoft:t.surface,cursor:"pointer",fontFamily:t.font,transition:"all .15s",
                    }}>
                      <i className={`ti ${ti.icon}`} style={{fontSize:16,color:actif?t.blue:t.muted,flexShrink:0}} />
                      <span>
                        <span style={{display:"block",fontSize:12,fontWeight:600,color:actif?t.blue:t.text}}>{ti.label}</span>
                        <span style={{display:"block",fontSize:10,color:t.muted,marginTop:1}}>{ti.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {label:"Prénom *",         key:"prenom",       ph:"Aminata"},
                {label:"Nom *",            key:"nom",          ph:"Diallo"},
                {label:"Date naissance", key:"dateNaissance",ph:"12/03/2006"},
                {label:"Classe *",         key:"classe",       ph:"Terminale A"},
                {label:"Téléphone",      key:"numero",       ph:"621 00 11 22"},
                {label:"Email",          key:"email",        ph:"aminata@email.com"},
                {label:"Tuteur",         key:"tuteur",       ph:"Mamadou Diallo"},
                {label:"Tél. tuteur",    key:"numeroTuteur", ph:"622 11 22 33"},
                ...(typeInscription==="transfert" ? [
                  {label:"Établissement d'origine *", key:"etablissementOrigine", ph:"Collège Sainte-Marie"},
                  {label:"Classe précédente *",       key:"classePrecedente",     ph:"Première A"},
                ] : []),
              ].map(f=>(
                <div key={f.key}>
                  <label style={{fontSize:11,fontWeight:600,color:t.sub,display:"block",marginBottom:5}}>{f.label}</label>
                  <input type="text" placeholder={f.ph} value={form[f.key]} onChange={e=>{setForm({...form,[f.key]:e.target.value});setErrors(ev=>({...ev,[f.key]:undefined}));}}
                    style={{width:"100%",padding:"9px 12px",border:`1px solid ${errors[f.key]?"#dc2626":t.border}`,borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:t.font,color:t.text}}
                    onFocus={e=>e.currentTarget.style.borderColor=errors[f.key]?"#dc2626":t.blue}
                    onBlur={e=>e.currentTarget.style.borderColor=errors[f.key]?"#dc2626":t.border}
                  />
                  {errors[f.key] && <p style={{ color:"#dc2626", fontSize:11, marginTop:3 }}>{errors[f.key]}</p>}
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