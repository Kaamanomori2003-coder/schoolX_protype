export const TYPES_SANCTION   = ["Avertissement", "Blâme", "Exclusion temporaire", "Exclusion définitive"];
export const STATUTS_SANCTION = ["En attente", "Validée", "Rejetée"];

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const aujourdhui = () => toISO(new Date());

// Les dates mockées sont dérivées du jour courant pour que les stats restent cohérentes
const ilYA = (jours) => {
  const d = new Date();
  d.setDate(d.getDate() - jours);
  return toISO(d);
};

export const ajouterJours = (iso, jours) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + jours);
  return toISO(d);
};

export const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("fr-FR") : "—";

export const SANCTIONS = [
  {
    id: 1,
    studentId: 2,
    type: "Avertissement",
    motif: "Retards répétés en cours de mathématiques — 4 retards en deux semaines.",
    preuve: "Relevé de présence contresigné par le professeur de mathématiques.",
    dureeJours: null,
    dateFait: ilYA(3),
    statut: "En attente",
    dateValidation: null,
  },
  {
    id: 2,
    studentId: 6,
    type: "Exclusion temporaire",
    motif: "Bagarre dans la cour pendant la récréation, un élève blessé au bras.",
    preuve: "Rapport du surveillant général et témoignages écrits de deux élèves.",
    dureeJours: 8,
    dateFait: ilYA(4),
    statut: "Validée",
    dateValidation: ilYA(3),
  },
  {
    id: 3,
    studentId: 11,
    type: "Blâme",
    motif: "Insolence répétée envers une enseignante malgré deux rappels à l'ordre.",
    preuve: "Lettre de signalement de l'enseignante, contresignée par le censeur.",
    dureeJours: null,
    dateFait: ilYA(20),
    statut: "Validée",
    dateValidation: ilYA(18),
  },
  {
    id: 4,
    studentId: 19,
    type: "Exclusion définitive",
    motif: "Fraude organisée lors de la composition du premier trimestre.",
    preuve: "Copies saisies et procès-verbal du conseil de discipline.",
    dureeJours: null,
    dateFait: ilYA(45),
    statut: "Validée",
    dateValidation: ilYA(40),
  },
  {
    id: 5,
    studentId: 2,
    type: "Avertissement",
    motif: "Usage du téléphone portable pendant un cours de français.",
    preuve: "Signalement oral du professeur, non confirmé par le surveillant.",
    dureeJours: null,
    dateFait: ilYA(30),
    statut: "Rejetée",
    dateValidation: ilYA(28),
  },
];

// Fin d'une exclusion temporaire validée : dateValidation + dureeJours
export const finExclusion = (s) =>
  s.type === "Exclusion temporaire" && s.statut === "Validée" && s.dateValidation && s.dureeJours
    ? ajouterJours(s.dateValidation, s.dureeJours)
    : null;

export const estExclusionEnCours = (s) => {
  if (s.statut !== "Validée") return false;
  if (s.type === "Exclusion définitive") return true;
  const fin = finExclusion(s);
  return fin ? fin >= aujourdhui() : false;
};

export const getSanctionsEleve = (studentId) =>
  SANCTIONS.filter(s => s.studentId === Number(studentId));
