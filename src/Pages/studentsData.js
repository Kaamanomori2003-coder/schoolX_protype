export const CLASSES = ["Terminale A", "Terminale B", "Seconde A", "Seconde B", "Première A"];

// [id, prenom, nom, sexe, classe]
const BASE = [
  [1,  "Aminata",  "Diallo",   "F", "Terminale A"],
  [2,  "Ibrahima", "Konaté",   "M", "Terminale A"],
  [3,  "Fatoumata","Bah",      "F", "Terminale A"],
  [4,  "Mamadou",  "Sow",      "M", "Terminale A"],
  [5,  "Aissatou", "Barry",    "F", "Terminale A"],
  [6,  "Oumar",    "Diallo",   "M", "Terminale B"],
  [7,  "Mariama",  "Kouyaté",  "F", "Terminale B"],
  [8,  "Thierno",  "Baldé",    "M", "Terminale B"],
  [9,  "Kadiatou", "Camara",   "F", "Terminale B"],
  [10, "Seydou",   "Traoré",   "M", "Terminale B"],
  [11, "Hawa",     "Diakité",  "F", "Seconde A"],
  [12, "Boubacar", "Sylla",    "M", "Seconde A"],
  [13, "Néné",     "Kourouma", "F", "Seconde A"],
  [14, "Alpha",    "Condé",    "M", "Seconde A"],
  [15, "Rougui",   "Diallo",   "F", "Seconde A"],
  [16, "Lansana",  "Touré",    "M", "Seconde B"],
  [17, "Hadja",    "Bah",      "F", "Seconde B"],
  [18, "Mamou",    "Barry",    "M", "Seconde B"],
  [19, "Cheick",   "Camara",   "M", "Seconde B"],
  [20, "Binta",    "Diallo",   "F", "Seconde B"],
  [21, "Saliou",   "Konaté",   "M", "Première A"],
  [22, "Oumou",    "Traoré",   "F", "Première A"],
  [23, "Djenab",   "Bah",      "F", "Première A"],
  [24, "Ibou",     "Soumah",   "M", "Première A"],
  [25, "Kadija",   "Camara",   "F", "Première A"],
];

const QUARTIERS = ["Ratoma","Kaloum","Matam","Dixinn","Lambanyi","Sonfonia","Cosa","Hamdallaye"];
const TUTEURS_M = ["Mamadou","Ibrahima","Sékou","Oumar","Lansana","Alpha","Thierno","Saliou"];
const TUTEURS_F = ["Aissatou","Mariama","Hawa","Binta","Kadiatou","Rougui","Néné","Djenab"];

export const STUDENTS = BASE.map(([id, prenom, nom, sexe, classe]) => {
  const anneeNaissance = 2005 + (id % 5); // entre 2005 et 2009
  const jour = String(1 + (id * 3) % 28).padStart(2, "0");
  const mois = String(1 + (id * 7) % 12).padStart(2, "0");
  const tuteurPrenom = sexe === "F" ? TUTEURS_M[id % TUTEURS_M.length] : TUTEURS_F[id % TUTEURS_F.length];
  const presentJours = 40 + (id % 8);
  const absentJours = id % 5;
  const retardJours = id % 3;

  return {
    id,
    prenom,
    nom,
    sexe,
    classe,
    dateNaissance: `${jour}/${mois}/${anneeNaissance}`,
    matricule: `SCX-2024-${String(id).padStart(3, "0")}`,
    status: "Actif",
    numero: `6${20 + (id % 9)} ${String(10 + id).padStart(2, "0")} ${String(20 + id).padStart(2, "0")} ${String(30 + id).padStart(2, "0")}`,
    email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@email.com`,
    tuteur: `${tuteurPrenom} ${nom}`,
    numeroTuteur: `6${21 + (id % 9)} ${String(11 + id).padStart(2, "0")} ${String(21 + id).padStart(2, "0")} ${String(31 + id).padStart(2, "0")}`,
    adresse: `${QUARTIERS[id % QUARTIERS.length]}, Conakry`,
    presences: {
      present: presentJours,
      absent: absentJours,
      retard: retardJours,
      total: presentJours + absentJours + retardJours,
    },
  };
});

export const getNomComplet = (eleve) => {
  if (!eleve) return "—";
  if (eleve.prenom && eleve.nom) return `${eleve.prenom} ${eleve.nom}`;
  return eleve.nom || "—";
};

export const getInitials = (eleve) => {
  if (!eleve) return "??";
  if (eleve.prenom && eleve.nom) return `${eleve.prenom[0]}${eleve.nom[0]}`.toUpperCase();
  if (eleve.nom) return eleve.nom.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return "??";
};
export const getStudentById = (id) => STUDENTS.find(s => s.id === Number(id));