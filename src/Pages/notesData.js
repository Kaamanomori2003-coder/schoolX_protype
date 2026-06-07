export const MATIERES = ["Mathématiques","Physique","Français","Philosophie","SVT","Chimie"];
export const MAT_ABR = {Mathématiques:"MATHS",Physique:"PHYSIQUE",Français:"FRANÇAIS",Philosophie:"PHILO",SVT:"SVT",Chimie:"CHIMIE"};
export const MAT_CLR = {Mathématiques:"#3b82f6",Physique:"#06b6d4",Français:"#8b5cf6",Philosophie:"#f59e0b",SVT:"#10b981",Chimie:"#ef4444"};
export const COEFFS = {Mathématiques: 5, Physique: 4, Français: 3, Philosophie: 2, SVT: 3, Chimie: 3};

export const CLASSES = ["Terminale A","Terminale B","Seconde A","Seconde B","Première A"];
export const ELEVES = [
  {id:1,nom:"Aminata Diallo",classe:"Terminale A"},{id:2,nom:"Ibrahima Konaté",classe:"Terminale A"},
  {id:3,nom:"Fatoumata Bah",classe:"Terminale A"},{id:4,nom:"Mamadou Sow",classe:"Terminale A"},
  {id:5,nom:"Aissatou Barry",classe:"Terminale A"},{id:6,nom:"Oumar Diallo",classe:"Terminale B"},
  {id:7,nom:"Mariama Kouyaté",classe:"Terminale B"},{id:8,nom:"Thierno Baldé",classe:"Terminale B"},
  {id:9,nom:"Kadiatou Camara",classe:"Terminale B"},{id:10,nom:"Seydou Traoré",classe:"Terminale B"},
  {id:11,nom:"Hawa Diakité",classe:"Seconde A"},{id:12,nom:"Boubacar Sylla",classe:"Seconde A"},
  {id:13,nom:"Néné Kourouma",classe:"Seconde A"},{id:14,nom:"Alpha Condé",classe:"Seconde A"},
  {id:15,nom:"Rougui Diallo",classe:"Seconde A"},{id:16,nom:"Lansana Touré",classe:"Seconde B"},
  {id:17,nom:"Hadja Bah",classe:"Seconde B"},{id:18,nom:"Mamou Barry",classe:"Seconde B"},
  {id:19,nom:"Cheick Camara",classe:"Seconde B"},{id:20,nom:"Binta Diallo",classe:"Seconde B"},
  {id:21,nom:"Saliou Konaté",classe:"Première A"},{id:22,nom:"Oumou Traoré",classe:"Première A"},
  {id:23,nom:"Djenab Bah",classe:"Première A"},{id:24,nom:"Ibou Soumah",classe:"Première A"},
  {id:25,nom:"Kadija Camara",classe:"Première A"},
];

const baseNotes = {
  1:{Mathématiques:15.5,Physique:13,Français:16,Philosophie:14,SVT:12,Chimie:11},
  2:{Mathématiques:8,Physique:7.5,Français:9,Philosophie:6,SVT:8,Chimie:7},
  3:{Mathématiques:17,Physique:16,Français:15,Philosophie:18,SVT:14,Chimie:15},
  4:{Mathématiques:11,Physique:12,Français:10,Philosophie:9,SVT:13,Chimie:10.5},
  5:{Mathématiques:6,Physique:5,Français:7,Philosophie:8,SVT:5.5,Chimie:6},
  6:{Mathématiques:14,Physique:13.5,Français:12,Philosophie:11,SVT:15,Chimie:13},
  7:{Mathématiques:9,Physique:10,Français:11,Philosophie:10,SVT:8.5,Chimie:9},
  8:{Mathématiques:16,Physique:17,Français:14,Philosophie:15,SVT:16,Chimie:14.5},
  9:{Mathématiques:7,Physique:6,Français:8,Philosophie:7,SVT:6.5,Chimie:7.5},
  10:{Mathématiques:12,Physique:11,Français:13,Philosophie:12,SVT:11,Chimie:12},
  11:{Mathématiques:10,Physique:9.5,Français:11,Philosophie:10,SVT:12,Chimie:10},
  12:{Mathématiques:18,Physique:17,Français:16,Philosophie:15,SVT:19,Chimie:17},
  13:{Mathématiques:5,Physique:6,Français:7,Philosophie:5,SVT:6,Chimie:5.5},
  14:{Mathématiques:13,Physique:14,Français:12,Philosophie:11,SVT:13,Chimie:12},
  15:{Mathématiques:9,Physique:8,Français:10,Philosophie:9,SVT:7.5,Chimie:8},
  16:{Mathématiques:11,Physique:12,Français:10,Philosophie:11,SVT:10,Chimie:11},
  17:{Mathématiques:7,Physique:6.5,Français:8,Philosophie:7,SVT:6,Chimie:7},
  18:{Mathématiques:14,Physique:15,Français:13,Philosophie:14,SVT:12,Chimie:13},
  19:{Mathématiques:16,Physique:14,Français:15,Philosophie:13,SVT:17,Chimie:15},
  20:{Mathématiques:8,Physique:9,Français:7.5,Philosophie:8,SVT:9,Chimie:8.5},
  21:{Mathématiques:12,Physique:11,Français:14,Philosophie:13,SVT:10,Chimie:11},
  22:{Mathématiques:6,Physique:7,Français:6,Philosophie:5.5,SVT:7,Chimie:6},
  23:{Mathématiques:15,Physique:16,Français:14,Philosophie:15,SVT:13,Chimie:14},
  24:{Mathématiques:10,Physique:9,Français:11,Philosophie:10,SVT:9.5,Chimie:10},
  25:{Mathématiques:13,Physique:12,Français:15,Philosophie:14,SVT:11,Chimie:12.5},
};

const mutateNotes = (notes, variation) => {
  return Object.fromEntries(
    Object.entries(notes).map(([k, v]) => [
      k, 
      Math.round(Math.min(20, Math.max(0, v + variation + (Math.random() * 2 - 1))) * 2) / 2
    ])
  );
};

export const INITIAL_NOTES = Object.fromEntries(
  Object.entries(baseNotes).map(([id, n]) => [
    id,
    {
      T1: n,
      T2: mutateNotes(n, 0.5),
      T3: mutateNotes(n, 1)
    }
  ])
);

const AC = ["#8b5cf6","#f59e0b","#10b981","#3b82f6","#f97316","#ef4444"];
export const avatarColor = id => AC[id % AC.length];
export const getInitials = nom => nom.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
export const getMoyenne = notes => {
  if (!notes) return 0;
  let total = 0, sumCoef = 0;
  Object.entries(notes).forEach(([m, val]) => {
    const c = COEFFS[m] || 1;
    total += val * c;
    sumCoef += c;
  });
  return sumCoef > 0 ? Math.round((total / sumCoef) * 100) / 100 : 0;
};
export const noteColor = n => n>=14?"#10b981":n>=10?"#3b82f6":n>=8?"#f59e0b":"#ef4444";
export const statutInfo = m => m>=14?{l:"Excellent",c:"#10b981"}:m>=10?{l:"Admis",c:"#3b82f6"}:m>=8?{l:"Passable",c:"#f59e0b"}:{l:"En difficulté",c:"#ef4444"};
export const EVO = [
  {classe:"Terminale A",moy:14.3,prev:13.1},{classe:"Terminale B",moy:12.1,prev:11.2},
  {classe:"Seconde A",moy:11.8,prev:10.6},{classe:"Seconde B",moy:10.2,prev:9.3},
  {classe:"Première A",moy:13.0,prev:12.1},
];
