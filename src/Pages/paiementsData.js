export const CLASSES = ["Terminale A", "Terminale D", "1ère S", "3ème B", "Seconde C", "4ème C", "5ème B", "6ème A"];
export const MODES_PAIEMENT = ["Espèces", "Orange Money", "Mobile Money", "Carte bancaire", "-"];
export const TRANCHES = ["Tranche 1", "Tranche 2", "Tranche 3"];

export const TRANCHE_MONTANT = 500000;

export const INITIAL_PAIEMENTS = [
  { id: "P001", eleve: "Aminata Diallo", classe: "Terminale A", tranche: "Tranche 1", montant: 500000, date: "02/01/2026", mode: "Orange Money", status: "Payé" },
  { id: "P002", eleve: "Mamadou Bah", classe: "3ème B", tranche: "Tranche 1", montant: 250000, date: "05/01/2026", mode: "Espèces", status: "Partiellement payé" },
  { id: "P003", eleve: "Fatoumata Camara", classe: "Seconde C", tranche: "Tranche 1", montant: 0, date: "-", mode: "-", status: "Impayé" },
  { id: "P004", eleve: "Ibrahima Sow", classe: "Terminale D", tranche: "Tranche 1", montant: 500000, date: "10/01/2026", mode: "Mobile Money", status: "Payé" },
  { id: "P005", eleve: "Mariama Kouyaté", classe: "1ère S", tranche: "Tranche 1", montant: 500000, date: "12/01/2026", mode: "Carte bancaire", status: "Payé" },
  { id: "P006", eleve: "Ousmane Traoré", classe: "6ème A", tranche: "Tranche 1", montant: 0, date: "-", mode: "-", status: "Impayé" },
  { id: "P007", eleve: "Kadiatou Barry", classe: "5ème B", tranche: "Tranche 1", montant: 150000, date: "18/01/2026", mode: "Orange Money", status: "Partiellement payé" },
  { id: "P008", eleve: "Sekou Condé", classe: "4ème C", tranche: "Tranche 1", montant: 500000, date: "20/01/2026", mode: "Espèces", status: "Payé" },
  { id: "P009", eleve: "Aminata Diallo", classe: "Terminale A", tranche: "Tranche 2", montant: 500000, date: "15/02/2026", mode: "Orange Money", status: "Payé" },
  { id: "P010", eleve: "Mamadou Bah", classe: "3ème B", tranche: "Tranche 2", montant: 0, date: "-", mode: "-", status: "Impayé" },
  { id: "P011", eleve: "Ibrahima Sow", classe: "Terminale D", tranche: "Tranche 2", montant: 300000, date: "22/02/2026", mode: "Mobile Money", status: "Partiellement payé" },
  { id: "P012", eleve: "Mariama Kouyaté", classe: "1ère S", tranche: "Tranche 2", montant: 500000, date: "01/03/2026", mode: "Carte bancaire", status: "Payé" },
];

export const getStatusInfo = (status) => {
  switch (status) {
    case "Payé": return { bg: "#dcfce7", color: "#166534", icon: "✓" };
    case "Partiellement payé": return { bg: "#ffedd5", color: "#c2410c", icon: "⌛" };
    case "Impayé": return { bg: "#fee2e2", color: "#991b1b", icon: "⚠️" };
    default: return { bg: "#f1f5f9", color: "#475569", icon: "-" };
  }
};

export const REVENUS_MOIS = [
  { name: "Sept", revenus: 4500000 },
  { name: "Oct", revenus: 6200000 },
  { name: "Nov", revenus: 3100000 },
  { name: "Déc", revenus: 1500000 },
  { name: "Jan", revenus: 5800000 },
  { name: "Fév", revenus: 2400000 },
];
