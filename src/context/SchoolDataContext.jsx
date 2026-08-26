import { createContext, useContext, useState, useCallback } from "react";
import { STUDENTS, CLASSES, getInitials } from "../Pages/studentsData";
import { SANCTIONS, aujourdhui, ajouterJours } from "../Pages/sanctionsData";

const SchoolDataContext = createContext(null);

/* ─── CONSTANTES PARTAGÉES ───────────────────────────────────── */
export const ECOLE_SCHOOLX     = "École SchoolX";
export const ANNEE_COURANTE    = "2024-2025";
export const ANNEE_PRECEDENTE  = "2023-2024";

// Matières et créneaux servent à la saisie des présences et à l'historique mocké
export const MATIERES = [
  "Mathématiques","Français","Physique-Chimie","Histoire-Géo",
  "Anglais","SVT","Informatique","Philosophie",
];

export const CRENEAUX = [
  "08h00 – 10h00","10h00 – 12h00","12h00 – 14h00",
  "14h00 – 16h00","16h00 – 18h00",
];

// Dernière étape du workflow de transfert
// (Demande → Notification envoyée → Dossier reçu par la destination → Terminé)
export const ETAPE_FINALE = 3;

// Étape à laquelle l'école destination est prévenue : déclenche une notification
export const ETAPE_NOTIFICATION = 1;

// Type utilisé pour les sanctions déclarées dans un dossier de transfert entrant :
// elles ne viennent pas d'un conseil de discipline de SchoolX
export const TYPE_SANCTION_ANTERIEURE = "Sanction antérieure";

const TYPES_EXCLUSION = ["Exclusion temporaire", "Exclusion définitive"];

/* ─── DONNÉES ÉLÈVES (notes / paiements mockés) ──────────────── */
const NOTES_PAR_DEFAUT = {
  1: [
    {matiere:"Mathématiques",prof:"Dr. Mamadou Diallo",note:16,coef:5},
    {matiere:"Français",     prof:"Mme Fatoumata Bah", note:14,coef:4},
    {matiere:"Physique",     prof:"M. Ousmane Kouyaté",note:15,coef:4},
    {matiere:"Anglais",      prof:"Mme Aïssatou Sow",  note:17,coef:3},
  ],
  2: [
    {matiere:"Mathématiques",prof:"Dr. Mamadou Diallo",note:11,coef:5},
    {matiere:"Français",     prof:"Mme Fatoumata Bah", note:13,coef:4},
    {matiere:"Histoire-Géo", prof:"M. Ibrahima Camara",note:12,coef:3},
  ],
  3: [
    {matiere:"Mathématiques",prof:"Dr. Mamadou Diallo",  note:14,coef:5},
    {matiere:"SVT",          prof:"Mme Kadiatou Traoré", note:16,coef:3},
    {matiere:"Physique",     prof:"M. Ousmane Kouyaté",  note:13,coef:4},
  ],
};

const PAIEMENTS_PAR_DEFAUT = {
  1: { total:1500000, paye:1000000, historique:[
    {date:"02/01/2025",montant:500000,mode:"Espèces", status:"Payé"},
    {date:"05/02/2025",montant:500000,mode:"Mobile",  status:"Payé"},
    {date:"01/03/2025",montant:500000,mode:"Virement",status:"En attente"},
  ]},
  2: { total:1200000, paye:600000, historique:[
    {date:"03/01/2025",montant:600000,mode:"Espèces",status:"Payé"},
    {date:"01/02/2025",montant:600000,mode:"Mobile", status:"En attente"},
  ]},
};

const seedEleves = () => STUDENTS.map(s => ({
  ...s,
  initials: getInitials(s),
  moyenne: NOTES_PAR_DEFAUT[s.id]
    ? Math.round((NOTES_PAR_DEFAUT[s.id].reduce((a,n)=>a+n.note*n.coef,0) / NOTES_PAR_DEFAUT[s.id].reduce((a,n)=>a+n.coef,0)) * 10) / 10
    : 0,
  notes: NOTES_PAR_DEFAUT[s.id] || [],
  paiements: PAIEMENTS_PAR_DEFAUT[s.id] || { total: 0, paye: 0, historique: [] },
}));

/* ─── DONNÉES ABSENCES (séances déjà saisies) ────────────────── */
const seedAbsences = () => {
  const base = [];
  const dates = [
    new Date(Date.now() - 1*86400000).toISOString().slice(0,10),
    new Date(Date.now() - 2*86400000).toISOString().slice(0,10),
    new Date(Date.now() - 4*86400000).toISOString().slice(0,10),
  ];
  dates.forEach((date, i) => {
    const classe = CLASSES[i % CLASSES.length];
    const records = STUDENTS.filter(s => s.classe === classe).map(s => {
      const r = s.id % 7;
      const status = r === 0 ? "absent" : r === 1 ? "retard" : "present";
      const justifie = status === "absent" && s.id % 2 === 0;
      return {
        studentId: s.id, status, justifie,
        motif: justifie ? "Maladie" : status === "retard" ? "Transport" : "",
        retardMin: status === "retard" ? 10 : 0,
        note: "",
      };
    });
    base.push({
      id:`h${i}`, date,
      creneau: CRENEAUX[i % CRENEAUX.length],
      classe,
      matiere: MATIERES[i % MATIERES.length],
      records,
    });
  });
  return base;
};

/* ─── DONNÉES TRANSFERTS (demandes en cours) ─────────────────── */
const ilYA = (jours) => {
  const d = new Date();
  d.setDate(d.getDate() - jours);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

const seedTransferts = () => [
  {
    id: 1, sens: "Sortant", studentId: 22, eleveNom: null,
    classe: "Première A", etablissement: "Collège Moderne de Kaloum",
    demandeur: "Parent",
    motif: "Déménagement de la famille vers la commune de Kaloum.",
    etape: 3, refus: null,
    historique: [{etape:0,date:ilYA(34)},{etape:1,date:ilYA(30)},{etape:2,date:ilYA(26)},{etape:3,date:ilYA(24)}],
  },
  {
    id: 2, sens: "Sortant", studentId: 15, eleveNom: null,
    classe: "Seconde A", etablissement: "Lycée de Coléah",
    demandeur: "Parent",
    motif: "Rapprochement du domicile familial et frais de transport.",
    etape: 1, refus: null,
    historique: [{etape:0,date:ilYA(9)},{etape:1,date:ilYA(5)}],
  },
  {
    id: 3, sens: "Entrant", studentId: null, eleveNom: "Sekou Camara",
    classe: "Seconde B", etablissement: "Collège Sainte-Marie",
    demandeur: "Direction",
    motif: "Demande d'admission en cours d'année, dossier scolaire complet.",
    dossier: {
      parcours: [{
        annee: ANNEE_PRECEDENTE, classe: "Troisième B",
        etablissement: "Collège Sainte-Marie", evenement: "Scolarité antérieure",
        details: "Année validée — moyenne générale 13,4/20.",
      }],
      sanctions: [{
        type: TYPE_SANCTION_ANTERIEURE,
        motif: "Avertissement pour absences répétées au 2ᵉ trimestre.",
        preuve: "Signalé par le collège d'origine dans le dossier de transfert.",
        dureeJours: null, dateFait: "", statut: "Validée", dateValidation: null,
      }],
    },
    etape: 2, refus: null,
    historique: [{etape:0,date:ilYA(12)},{etape:1,date:ilYA(8)},{etape:2,date:ilYA(2)}],
  },
];

/* ─── PROVIDER ───────────────────────────────────────────────── */
export function SchoolDataProvider({ children }) {
  const [eleves,           setEleves]           = useState(seedEleves);
  const [absencesHistory,  setAbsencesHistory]  = useState(seedAbsences);
  const [sanctions,        setSanctions]        = useState(SANCTIONS);
  const [transferRequests, setTransferRequests] = useState(seedTransferts);

  /* ── ÉLÈVES ── */
  const getEleveById = useCallback(
    (id) => eleves.find(e => e.id === Number(id)) || null,
    [eleves]
  );

  const addEleve = useCallback((data) => {
    const id = eleves.reduce((max,e)=>Math.max(max,e.id),0) + 1;
    const cree = {
      status:"Actif", moyenne:0, notes:[], parcours:[],
      presences:{present:0,absent:0,retard:0,total:0},
      paiements:{total:0,paye:0,historique:[]},
      ...data,
      id,
      matricule: data.matricule || `SCX-2024-${String(id).padStart(3,"0")}`,
      initials:  data.initials  || getInitials(data),
    };
    setEleves(prev => [...prev, cree]);
    return cree;
  }, [eleves]);

  // nouveauStatut null/undefined : on n'ajoute qu'une étape au parcours sans toucher au statut global.
  // champs : données supplémentaires à poser sur l'élève (ex: suspension en cours)
  const updateEleveStatus = useCallback((id, nouveauStatut, parcoursEntry, champs) => {
    setEleves(prev => prev.map(e => {
      if (e.id !== Number(id)) return e;
      return {
        ...e,
        ...(champs || {}),
        status: nouveauStatut || e.status,
        parcours: parcoursEntry
          ? [...(e.parcours || []), { annee:ANNEE_COURANTE, classe:e.classe, ...parcoursEntry }]
          : (e.parcours || []),
      };
    }));
  }, []);

  // dossier : parcours antérieur transmis par l'école d'origine (facultatif)
  const addEleveFromTransfert = useCallback((nomEntrant, classeCible, etablissementOrigine, dossier) => {
    const parts  = (nomEntrant || "").trim().split(/\s+/);
    const prenom = parts[0] || "Élève";
    const nom    = parts.slice(1).join(" ") || "Transféré";

    const anterieur = (dossier?.parcours || []).map(p => ({
      annee:         p.annee         || ANNEE_PRECEDENTE,
      classe:        p.classe        || classeCible,
      etablissement: p.etablissement || etablissementOrigine,
      evenement:     p.evenement     || "Scolarité antérieure",
      details:       p.details       || p.motif || null,
    }));

    return addEleve({
      prenom, nom, sexe:"M", classe:classeCible,
      dateNaissance:"", numero:"", email:"", tuteur:"", numeroTuteur:"", adresse:"",
      parcours:[
        ...(anterieur.length
          ? anterieur
          : [{annee:ANNEE_PRECEDENTE, classe:classeCible, etablissement:etablissementOrigine, evenement:"Scolarité antérieure"}]),
        {annee:ANNEE_COURANTE, classe:classeCible, etablissement:ECOLE_SCHOOLX, evenement:"Transfert entrant"},
      ],
    });
  }, [addEleve]);

  /* ── ABSENCES ── */
  const addAbsenceSeance = useCallback((seance) => {
    const nouvelle = { id:`h${Date.now()}`, ...seance };
    setAbsencesHistory(prev => [nouvelle, ...prev]);
    return nouvelle;
  }, []);

  const justifyAbsence = useCallback((seanceId, studentId, motif) => {
    setAbsencesHistory(prev => prev.map(seance => seance.id !== seanceId ? seance : {
      ...seance,
      records: seance.records.map(r => r.studentId === Number(studentId)
        ? { ...r, justifie:true, motif }
        : r),
    }));
  }, []);

  // Absences d'un élève, séance la plus récente en premier
  const getAbsencesEleve = useCallback((studentId) => {
    const lignes = [];
    absencesHistory.forEach(seance => seance.records.forEach(r => {
      if (r.studentId === Number(studentId) && r.status === "absent") {
        lignes.push({ ...r, date:seance.date, classe:seance.classe, matiere:seance.matiere, creneau:seance.creneau });
      }
    }));
    return lignes.sort((a,b)=>b.date.localeCompare(a.date));
  }, [absencesHistory]);

  /* ── SANCTIONS ── */
  const addSanction = useCallback((sanction) => {
    const nouvelle = {
      id: Date.now(),
      preuve: "", dureeJours: null,
      statut: "En attente", dateValidation: null,
      ...sanction,
      studentId: Number(sanction.studentId),
    };
    setSanctions(prev => [nouvelle, ...prev]);
    return nouvelle;
  }, []);

  const updateSanctionStatut = useCallback((id, statut) => {
    const date     = aujourdhui();
    const sanction = sanctions.find(s => s.id === id);
    setSanctions(prev => prev.map(s => s.id === id ? { ...s, statut, dateValidation:date } : s));

    if (statut !== "Validée" || !sanction) return sanction;

    // Exclusion définitive : l'élève quitte l'établissement, son statut principal devient « Exclu »
    if (sanction.type === "Exclusion définitive") {
      updateEleveStatus(sanction.studentId, "Exclu", {
        annee: ANNEE_COURANTE,
        etablissement: ECOLE_SCHOOLX,
        evenement: "Exclusion définitive",
        motif: sanction.motif,
        date,
      }, { suspension: null });
    }

    // Exclusion temporaire : l'élève est censé revenir, il reste « Actif » mais suspendu jusqu'à une date
    if (sanction.type === "Exclusion temporaire") {
      const dateFin = sanction.dureeJours ? ajouterJours(date, sanction.dureeJours) : null;
      updateEleveStatus(sanction.studentId, null, {
        annee: ANNEE_COURANTE,
        etablissement: ECOLE_SCHOOLX,
        evenement: "Exclusion temporaire",
        motif: sanction.motif,
        dateDebut: date,
        dateFin,
      }, dateFin ? { suspension:{ dateDebut:date, dateFin, motif:sanction.motif } } : undefined);
    }

    return sanction;
  }, [sanctions, updateEleveStatus]);

  const getSanctionsEleve = useCallback(
    (studentId) => sanctions.filter(s => s.studentId === Number(studentId)),
    [sanctions]
  );

  /* ── TRANSFERTS ── */
  // Le dossier scolaire (parcours + sanctions) part avec la demande : pour un sortant
  // il est constitué depuis les données de l'élève, pour un entrant il est fourni par le formulaire
  const dossierEleve = useCallback((studentId) => ({
    parcours:  eleves.find(e => e.id === Number(studentId))?.parcours || [],
    sanctions: sanctions.filter(s => s.studentId === Number(studentId)),
  }), [eleves, sanctions]);

  const addTransferRequest = useCallback((req) => {
    const nouvelle = {
      id: Date.now(),
      etape: 0, refus: null,
      historique: [{ etape:0, date:aujourdhui() }],
      ...req,
      dossier: req.dossier || (req.sens==="Sortant" && req.studentId
        ? dossierEleve(req.studentId)
        : { parcours:[], sanctions:[] }),
    };
    setTransferRequests(prev => [nouvelle, ...prev]);
    return nouvelle;
  }, [dossierEleve]);

  // Avance d'une étape et déclenche les effets de fin de parcours (statut élève / création de fiche)
  const advanceTransferStep = useCallback((id) => {
    const demande = transferRequests.find(d => d.id === id);
    if (!demande || demande.refus || demande.etape >= ETAPE_FINALE) return null;

    const etape = demande.etape + 1;
    const date  = aujourdhui();
    setTransferRequests(prev => prev.map(d => d.id === id
      ? { ...d, etape, historique:[...d.historique, { etape, date }] }
      : d));

    const termine = etape >= ETAPE_FINALE;
    let eleveCree = null;

    if (termine && demande.sens === "Sortant" && demande.studentId) {
      updateEleveStatus(demande.studentId, "Transféré", {
        annee: ANNEE_COURANTE,
        classe: demande.classe,
        etablissement: ECOLE_SCHOOLX,
        evenement: "Transfert sortant",
        etablissementDestination: demande.etablissement,
      });
    }
    if (termine && demande.sens === "Entrant") {
      eleveCree = addEleveFromTransfert(demande.eleveNom, demande.classe, demande.etablissement, demande.dossier);
      // Les sanctions antérieures sont déjà actées par l'école d'origine : pas de revalidation
      (demande.dossier?.sanctions || []).forEach((s, i) => addSanction({
        ...s,
        id: Date.now() + i,
        studentId: eleveCree.id,
        statut: "Validée",
        dateFait: s.dateFait || "",
        dateValidation: s.dateValidation || date,
        preuve: s.preuve || `Dossier de transfert transmis par ${demande.etablissement}`,
      }));
    }

    return { demande, etape, termine, eleveCree };
  }, [transferRequests, updateEleveStatus, addEleveFromTransfert, addSanction]);

  const refuseTransferRequest = useCallback((id) => {
    setTransferRequests(prev => prev.map(d => d.id === id
      ? { ...d, refus:{ etape:d.etape, date:aujourdhui() } }
      : d));
  }, []);

  return (
    <SchoolDataContext.Provider value={{
      eleves, getEleveById, addEleve, updateEleveStatus, addEleveFromTransfert,
      absencesHistory, addAbsenceSeance, justifyAbsence, getAbsencesEleve,
      sanctions, addSanction, updateSanctionStatut, getSanctionsEleve,
      transferRequests, addTransferRequest, advanceTransferStep, refuseTransferRequest,
    }}>
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const ctx = useContext(SchoolDataContext);
  if (!ctx) throw new Error("useSchoolData doit être utilisé à l'intérieur de SchoolDataProvider");
  return ctx;
}
