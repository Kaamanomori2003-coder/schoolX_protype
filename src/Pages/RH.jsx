import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Notes.css";
import ConfirmModal from "../components/ConfirmModal";

// Rich Mockup Personnel Dataset
const initialEmployes = [
  {
    id: 1,
    nom: "Dr. Mamadou Diallo",
    poste: "Professeur de Mathématiques",
    salaire: 2500000,
    contrat: "CDI",
    dateEmbauche: "01/09/2018",
    status: "Actif",
    diplome: "Doctorat en Algèbre",
    evaluation: 4.9,
    absences: 1,
    telephone: "+224 620 12 34 56",
    email: "m.diallo@schoolx.gn",
    emploiDuTemps: ["Lundi (08h - 12h)", "Mercredi (10h - 14h)", "Vendredi (08h - 12h)"],
    avatar: "ti-school",
    categorie: "Enseignant",
    primes: 150000,
    retenues: 50000,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 22
  },
  {
    id: 2,
    nom: "Mme Fatoumata Bah",
    poste: "Professeur de Physique",
    salaire: 2200000,
    contrat: "CDI",
    dateEmbauche: "15/09/2019",
    status: "Actif",
    diplome: "Master en Sciences Physiques",
    evaluation: 4.7,
    absences: 0,
    telephone: "+224 621 98 76 54",
    email: "f.bah@schoolx.gn",
    emploiDuTemps: ["Mardi (08h - 12h)", "Jeudi (08h - 12h)", "Jeudi (14h - 16h)"],
    avatar: "ti-school",
    categorie: "Enseignant",
    primes: 100000,
    retenues: 0,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 24
  },
  {
    id: 3,
    nom: "M. Ibrahima Camara",
    poste: "Professeur d'Histoire",
    salaire: 2000000,
    contrat: "CDD",
    dateEmbauche: "01/10/2020",
    status: "En congé",
    diplome: "Licence en Histoire-Géo",
    evaluation: 4.5,
    absences: 2,
    telephone: "+224 625 45 67 89",
    email: "i.camara@schoolx.gn",
    emploiDuTemps: ["Lundi (14h - 18h)", "Mardi (10h - 12h)"],
    avatar: "ti-school",
    categorie: "Enseignant",
    primes: 0,
    retenues: 0,
    statutPaie: "En attente",
    datePaie: "",
    joursCongesRestants: 12
  },
  {
    id: 4,
    nom: "Mme Aïssatou Sow",
    poste: "Professeur de Français",
    salaire: 2100000,
    contrat: "CDD",
    dateEmbauche: "01/09/2022",
    status: "Actif",
    diplome: "Master en Lettres Modernes",
    evaluation: 4.6,
    absences: 3,
    telephone: "+224 628 33 22 11",
    email: "a.sow@schoolx.gn",
    emploiDuTemps: ["Mercredi (08h - 12h)", "Vendredi (14h - 18h)"],
    avatar: "ti-school",
    categorie: "Enseignant",
    primes: 50000,
    retenues: 30000,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 18
  },
  {
    id: 5,
    nom: "M. Ousmane Kouyaté",
    poste: "Directeur des Études",
    salaire: 3500000,
    contrat: "CDI",
    dateEmbauche: "01/09/2016",
    status: "Actif",
    diplome: "Master en Administration Scolaire",
    evaluation: 4.8,
    absences: 0,
    telephone: "+224 622 11 44 77",
    email: "o.kouyate@schoolx.gn",
    emploiDuTemps: ["Lundi au Vendredi (08h - 17h)"],
    avatar: "ti-briefcase",
    categorie: "Administration",
    primes: 300000,
    retenues: 0,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 30
  },
  {
    id: 6,
    nom: "Kadiatou Traoré",
    poste: "Secrétaire Générale",
    salaire: 1500000,
    contrat: "CDI",
    dateEmbauche: "01/03/2021",
    status: "Actif",
    diplome: "BTS Secrétariat de Direction",
    evaluation: 4.4,
    absences: 1,
    telephone: "+224 626 55 66 77",
    email: "k.traore@schoolx.gn",
    emploiDuTemps: ["Lundi au Vendredi (08h - 16h)"],
    avatar: "ti-briefcase",
    categorie: "Administration",
    primes: 80000,
    retenues: 20000,
    statutPaie: "En attente",
    datePaie: "",
    joursCongesRestants: 15
  },
  {
    id: 7,
    nom: "Sekou Barry",
    poste: "Comptable Principal",
    salaire: 2800000,
    contrat: "CDI",
    dateEmbauche: "15/06/2019",
    status: "Actif",
    diplome: "Master en Audit et Contrôle",
    evaluation: 4.7,
    absences: 0,
    telephone: "+224 623 88 99 00",
    email: "s.barry@schoolx.gn",
    emploiDuTemps: ["Lundi au Vendredi (08h - 17h)"],
    avatar: "ti-device-laptop",
    categorie: "Administration",
    primes: 200000,
    retenues: 0,
    statutPaie: "Payé",
    datePaie: "28/04/2026",
    joursCongesRestants: 26
  },
  {
    id: 8,
    nom: "Mariama Condé",
    poste: "Assistante administrative / Surveillante",
    salaire: 1200000,
    contrat: "Temps partiel",
    dateEmbauche: "01/01/2022",
    status: "Absent",
    diplome: "Licence en Communication",
    evaluation: 4.2,
    absences: 4,
    telephone: "+224 629 00 11 22",
    email: "m.conde@schoolx.gn",
    emploiDuTemps: ["Lundi (09h - 13h)", "Mercredi (09h - 13h)", "Vendredi (09h - 13h)"],
    avatar: "ti-device-laptop",
    categorie: "Administration",
    primes: 0,
    retenues: 80000,
    statutPaie: "En attente",
    datePaie: "",
    joursCongesRestants: 11
  },
];

// Mock Recruitment Candidates
const initialCandidates = [
  { id: 101, nom: "Abdoulaye Touré", poste: "Professeur de Chimie", diplome: "Master en Chimie Organique", etape: "CV", date: "15/05/2026", email: "a.toure@gmail.com", tel: "+224 624 55 44 33", categorie: "Enseignant" },
  { id: 102, nom: "Mabinty Sylla", poste: "Professeur d'Anglais", diplome: "Licence en Anglais Moderne", etape: "Entretien", date: "17/05/2026", email: "m.sylla@outlook.com", tel: "+224 628 88 77 66", categorie: "Enseignant" },
  { id: 103, nom: "Dr. Thierno Diallo", poste: "Professeur de SVT", diplome: "Doctorat en Biologie", etape: "Entretien", date: "18/05/2026", email: "t.diallo@gmail.com", tel: "+224 620 99 88 77", categorie: "Enseignant" },
  { id: 104, nom: "Salimatou Barry", poste: "Conseillère d'Orientation", diplome: "Master en Psychologie", etape: "Offre", date: "12/05/2026", email: "s.barry@yahoo.fr", tel: "+224 627 11 22 33", categorie: "Administration" },
  { id: 105, nom: "Oumar Sow", poste: "Chauffeur de Bus Scolaire", diplome: "Permis Poids Lourds", etape: "CV", date: "16/05/2026", email: "o.sow@driver.gn", tel: "+224 629 44 55 66", categorie: "Services & Soutien" },
  { id: 106, nom: "Fatoumata Diané", poste: "Infirmière Scolaire", diplome: "Diplôme d'État en Soins", etape: "Entretien", date: "14/05/2026", email: "f.diane@medical.gn", tel: "+224 622 12 34 56", categorie: "Services & Soutien" },
];

const statusStyle = {
  "Actif": { bg: "rgba(34, 197, 94, 0.12)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.2)" },
  "En congé": { bg: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.2)" },
  "Suspendu": { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.2)" },
  "Absent": { bg: "rgba(239, 68, 68, 0.12)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)" },
};

const contratStyle = {
  "CDI": { bg: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.2)" },
  "CDD": { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.2)" },
  "Temps partiel": { bg: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6", border: "1px solid rgba(139, 92, 246, 0.2)" },
};

function renderAvatar(e, size = 60, fontSize = 18) {
  let icon = e.avatar || "ti-user";
  let bg = "#f1f5f9";
  let color = "#475569";

  if (icon === "ti-school") {
    bg = "#eff6ff";
    color = "#1e3a8a";
  } else if (icon === "ti-briefcase") {
    bg = "#f3e8ff";
    color = "#7c3aed";
  } else if (icon === "ti-device-laptop") {
    bg = "#ecfdf5";
    color = "#10b981";
  } else if (icon === "ti-tool") {
    bg = "#fef2f2";
    color = "#ef4444";
  } else {
    // If the icon is an old emoji or not set
    if (e.categorie === "Enseignant" || e.poste?.toLowerCase().includes("prof")) {
      icon = "ti-school";
      bg = "#eff6ff";
      color = "#1e3a8a";
    } else if (e.categorie === "Administration" || e.poste?.toLowerCase().includes("directeur") || e.poste?.toLowerCase().includes("comptable") || e.poste?.toLowerCase().includes("secrét")) {
      icon = "ti-briefcase";
      bg = "#f3e8ff";
      color = "#7c3aed";
    } else {
      icon = "ti-tool";
      bg = "#ecfdf5";
      color = "#10b981";
    }
  }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      color: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: fontSize,
      flexShrink: 0
    }}>
      <i className={`ti ${icon}`} />
    </div>
  );
}

export default function RH() {
  const [activeTab, setActiveTab] = useState("effectifs"); // effectifs | fiches | presences | conges | salaires | recrutement
  const [employes, setEmployes] = useState(initialEmployes);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [confirmDelEmp, setConfirmDelEmp] = useState(null);

  // Search & Advanced Filters
  const [search, setSearch] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("Tous");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterAnciennete, setFilterAnciennete] = useState("Tous");

  // Selected Employee Dossier
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [dossierTab, setDossierTab] = useState("profil"); // profil | planning | historique
  const [selectedPayslip, setSelectedPayslip] = useState(null); // payslip print modal

  // Daily Attendance State
  const [attendanceToday, setAttendanceToday] = useState({
    1: "present", 2: "present", 3: "retard", 4: "absent", 5: "present", 6: "present", 7: "present", 8: "present"
  });
  const [attendanceLogs, setAttendanceLogs] = useState([
    { date: "17/05/2026", presents: 7, retards: 1, absents: 0 },
    { date: "16/05/2026", presents: 6, retards: 1, absents: 1 },
    { date: "15/05/2026", presents: 8, retards: 0, absents: 0 },
  ]);

  // Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, nom: "M. Ibrahima Camara", poste: "Professeur d'Histoire", type: "Congé Annuel", debut: "20/05/2026", fin: "30/05/2026", jours: 10, statut: "Approuvé" },
    { id: 2, nom: "Kadiatou Traoré", poste: "Secrétaire Générale", type: "Maternité", debut: "01/06/2026", fin: "30/08/2026", jours: 90, statut: "En attente" },
    { id: 3, nom: "Mariama Condé", poste: "Assistante administrative / Surveillante", type: "Maladie", debut: "12/05/2026", fin: "14/05/2026", jours: 2, statut: "Refusé" },
  ]);

  // Notifications RH State
  const [alerts, setAlerts] = useState([
    { id: 1, type: "cdd", text: "Le contrat CDD de M. Ibrahima Camara expire dans 14 jours !", date: "Aujourd'hui" },
    { id: 2, type: "anniv", text: "Anniversaire aujourd'hui : Mme Fatoumata Bah (Physique) !", date: "Aujourd'hui" },
    { id: 3, type: "absences", text: "Alerte absentéisme : Mariama Condé a accumulé 4 absences ce mois-ci.", date: "Hier" },
  ]);

  // Modals States
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);

  // Forms States
  const [newStaffForm, setNewStaffForm] = useState({
    nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "ti-school", categorie: "Enseignant"
  });
  const [newCandidateForm, setNewCandidateForm] = useState({
    nom: "", poste: "", diplome: "", email: "", tel: "", categorie: "Enseignant"
  });
  const [newLeaveForm, setNewLeaveForm] = useState({
    employeId: "", type: "Congé Annuel", debut: "", fin: "", jours: ""
  });

  // Helper: seniority calculation
  const getSeniorityYears = (dateStr) => {
    try {
      const [day, month, year] = dateStr.split("/").map(Number);
      const start = new Date(year, month - 1, day);
      const diffMs = Date.now() - start.getTime();
      return diffMs / (1000 * 60 * 60 * 24 * 365.25);
    } catch (e) {
      return 0;
    }
  };

  const formatSeniority = (dateStr) => {
    const years = getSeniorityYears(dateStr);
    if (years < 1) {
      const months = Math.round(years * 12);
      return `${months} mois`;
    }
    const fullYears = Math.floor(years);
    const months = Math.round((years - fullYears) * 12);
    return `${fullYears} an${fullYears > 1 ? 's' : ''} ${months > 0 ? `et ${months} mois` : ''}`;
  };

  // Derived Statistics Card values
  const totalSalaires = employes.reduce((a, e) => a + e.salaire, 0);
  const activeTeachersCount = employes.filter(e => e.categorie === "Enseignant" && e.status === "Actif").length;

  // Dynamic monthly attendance total
  const totalAbsencesMonth = employes.reduce((sum, e) => sum + e.absences, 0) + Object.values(attendanceToday).filter(v => v === "absent").length;
  const activeLeavesCount = employes.filter(e => e.status === "En congé").length;

  // Filter Employees List
  const filteredEmployes = employes.filter(e => {
    const matchesSearch = e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.poste.toLowerCase().includes(search.toLowerCase());
    const matchesCategorie = filterCategorie === "Tous" || e.categorie === filterCategorie;
    const matchesStatut = filterStatut === "Tous" || e.status === filterStatut;

    let matchesAnciennete = true;
    if (filterAnciennete !== "Tous") {
      const years = getSeniorityYears(e.dateEmbauche);
      if (filterAnciennete === "Moins de 2 ans") matchesAnciennete = years < 2;
      else if (filterAnciennete === "2 à 5 ans") matchesAnciennete = years >= 2 && years <= 5;
      else if (filterAnciennete === "Plus de 5 ans") matchesAnciennete = years > 5;
    }

    return matchesSearch && matchesCategorie && matchesStatut && matchesAnciennete;
  });

  // Handle Add / Edit Employee
  const handleAddEmployee = () => {
    if (!newStaffForm.nom || !newStaffForm.poste) {
      alert("Veuillez renseigner au minimum le nom et le poste de l'employé.");
      return;
    }
    const scheduleArray = typeof newStaffForm.emploiDuTemps === 'string'
      ? newStaffForm.emploiDuTemps.split(";").map(s => s.trim())
      : newStaffForm.emploiDuTemps;
  
    if (newStaffForm.id) {
      setEmployes(employes.map(e => e.id === newStaffForm.id ? { ...e, ...newStaffForm, emploiDuTemps: scheduleArray } : e));
      setNewStaffForm({
        nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "ti-school", categorie: "Enseignant"
      });
      setShowAddStaffModal(false);
      return;
    }

    const newEmp = {
      id: Date.now(),
      nom: newStaffForm.nom,
      poste: newStaffForm.poste,
      salaire: parseInt(newStaffForm.salaire) || 1500000,
      contrat: newStaffForm.contrat,
      dateEmbauche: new Date().toLocaleDateString("fr-FR"),
      status: "Actif",
      diplome: newStaffForm.diplome || "Diplôme Universitaire",
      evaluation: 4.5,
      absences: 0,
      telephone: newStaffForm.telephone || "+224 620 00 00 00",
      email: newStaffForm.email || `${newStaffForm.nom.toLowerCase().replace(/\s+/g, '')}@schoolx.gn`,
      emploiDuTemps: scheduleArray,
      avatar: newStaffForm.avatar,
      categorie: newStaffForm.categorie || "Enseignant",
      primes: 0,
      retenues: 0,
      statutPaie: "En attente",
      datePaie: "",
      joursCongesRestants: 30
    };

    setEmployes([...employes, newEmp]);
    setNewStaffForm({
      nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "ti-school", categorie: "Enseignant"
    });
    setShowAddStaffModal(false);

    // Add alert notification
    setAlerts([
      { id: Date.now(), type: "recruit", text: `Nouveau recrutement : Bienvenue à ${newEmp.nom} (${newEmp.poste}) !`, date: "Aujourd'hui" },
      ...alerts
    ]);
  };

  const handleDeleteEmployee = (empId) => {
    setEmployes(employes.filter(e => e.id !== empId));
  };

  // Handle Add Candidate
  const handleAddCandidate = () => {
    if (!newCandidateForm.nom || !newCandidateForm.poste) return;
    const newCand = {
      id: Date.now(),
      nom: newCandidateForm.nom,
      poste: newCandidateForm.poste,
      diplome: newCandidateForm.diplome || "Master",
      etape: "CV",
      date: new Date().toLocaleDateString("fr-FR"),
      email: newCandidateForm.email || "candidat@email.com",
      tel: newCandidateForm.tel || "+224 620 00 00 00",
      categorie: newCandidateForm.categorie || "Enseignant"
    };

    setCandidates([...candidates, newCand]);
    setNewCandidateForm({ nom: "", poste: "", diplome: "", email: "", tel: "", categorie: "Enseignant" });
    setShowAddCandidateModal(false);
  };

  // Handle Move Candidate Etape
  const handleMoveCandidate = (candId, nextEtape) => {
    setCandidates(candidates.map(c => c.id === candId ? { ...c, etape: nextEtape } : c));
  };

  // Handle Leave Submission
  const handleAddLeave = () => {
    const selectedEmp = employes.find(e => e.id === parseInt(newLeaveForm.employeId));
    if (!selectedEmp || !newLeaveForm.debut || !newLeaveForm.fin || !newLeaveForm.jours) return;

    const newReq = {
      id: Date.now(),
      nom: selectedEmp.nom,
      poste: selectedEmp.poste,
      type: newLeaveForm.type,
      debut: new Date(newLeaveForm.debut).toLocaleDateString("fr-FR"),
      fin: new Date(newLeaveForm.fin).toLocaleDateString("fr-FR"),
      jours: parseInt(newLeaveForm.jours),
      statut: "En attente"
    };

    setLeaveRequests([...leaveRequests, newReq]);
    setShowAddLeaveModal(false);
    setNewLeaveForm({ employeId: "", type: "Congé Annuel", debut: "", fin: "", jours: "" });
  };

  // Approve/Refuse Leave Requests
  const handleLeaveDecision = (reqId, isApproved) => {
    setLeaveRequests(leaveRequests.map(r => {
      if (r.id === reqId) {
        const newStatus = isApproved ? "Approuvé" : "Refusé";

        // If approved, update the employee's main status to "En congé" and deduct leave balance
        if (isApproved) {
          setEmployes(prev => prev.map(e => {
            if (e.nom === r.nom) {
              return {
                ...e,
                status: "En congé",
                joursCongesRestants: Math.max(0, e.joursCongesRestants - r.jours)
              };
            }
            return e;
          }));
        }
        return { ...r, statut: newStatus };
      }
      return r;
    }));
  };

  // Toggle Payroll Payment
  const handlePaySalary = (empId) => {
    setEmployes(prev => prev.map(e => {
      if (e.id === empId) {
        return {
          ...e,
          statutPaie: "Payé",
          datePaie: new Date().toLocaleDateString("fr-FR")
        };
      }
      return e;
    }));
  };

  // Inline salary bonus/deductions update
  const handleSalaryAdjustment = (empId, field, amount) => {
    setEmployes(prev => prev.map(e => {
      if (e.id === empId) {
        return { ...e, [field]: Math.max(0, amount) };
      }
      return e;
    }));
  };

  // Attendance Tracker Daily Pointer
  const handleAttendanceChange = (empId, status) => {
    setAttendanceToday({ ...attendanceToday, [empId]: status });
  };

  // Parse custom schedule array to visual grid
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const parseSchedule = (scheduleArray) => {
    const parsed = {};
    if (!scheduleArray) return parsed;
    scheduleArray.forEach(s => {
      const match = s.match(/(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Lundi au Vendredi)\s*(?:\((.*?)\))?/);
      if (match) {
        const dayKey = match[1];
        const hours = match[2] || "08h - 17h";
        if (dayKey === "Lundi au Vendredi") {
          daysOfWeek.forEach(d => {
            parsed[d] = hours;
          });
        } else {
          parsed[dayKey] = hours;
        }
      }
    });
    return parsed;
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a", padding: "4px 0 32px 0" }}>

      {/* ALERTS / NOTIFICATIONS SECTION */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {alerts.slice(0, 3).map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: "#fff",
                  borderLeft: `4px solid ${alert.type === "absences" ? "#ef4444" :
                      alert.type === "cdd" ? "#ea580c" :
                        alert.type === "anniv" ? "#ec4899" : "#3b82f6"
                    }`,
                  borderRadius: "10px",
                  padding: "12px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: alert.type === "absences" ? "rgba(239, 68, 68, 0.1)" : alert.type === "cdd" ? "rgba(234, 88, 12, 0.1)" : alert.type === "anniv" ? "rgba(236, 72, 153, 0.1)" : "rgba(59, 130, 246, 0.1)",
                    color: alert.type === "absences" ? "#ef4444" : alert.type === "cdd" ? "#ea580c" : alert.type === "anniv" ? "#ec4899" : "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <i className={`ti ${alert.type === "cdd" ? "ti-clock" :
                        alert.type === "anniv" ? "ti-gift" :
                          alert.type === "absences" ? "ti-alert-triangle" :
                            alert.type === "recruit" ? "ti-user-plus" : "ti-bell"
                      }`} style={{ fontSize: 16 }} />
                  </div>
                  <span style={{ fontSize: 16, color: "#334155", fontWeight: 500 }}>{alert.text}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 14, color: "#94a3b8" }}>{alert.date}</span>
                  <button
                    onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 15, display: "flex", alignItems: "center" }}
                  ><i className="ti ti-x" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 29, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #1e3a8a, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Gestion des Ressources Humaines
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", marginTop: 4 }}>
            Pilotage complet de l'équipe scolaire, suivi des absences, congés, rémunérations et recrutement.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {activeTab === "recrutement" ? (
            <button onClick={() => setShowAddCandidateModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 12px rgba(139,92,246,0.2)" }}>
              <i className="ti ti-user-plus" /> Nouveau Candidat
            </button>
          ) : activeTab === "conges" ? (
            <button onClick={() => setShowAddLeaveModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#ea580c", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 12px rgba(234,88,12,0.2)" }}>
              <i className="ti ti-plane-departure" /> Demander un congé
            </button>
          ) : (
            <button onClick={() => {
              setNewStaffForm({ nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "👨‍🏫", categorie: "Enseignant" });
              setShowAddStaffModal(true);
            }} style={{ display: "flex", alignItems: "center", gap: 8, background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 12px rgba(30,58,138,0.2)" }}>
              <i className="ti ti-user-plus" /> Ajouter un Employé
            </button>
          )}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { label: "Membres de l'équipe", value: employes.length, sub: "Actifs, congés, etc.", icon: <i className="ti ti-users" style={{ fontSize: 22 }} />, bg: "#eff6ff", color: "#3b82f6" },
          { label: "Enseignants Actifs", value: activeTeachersCount, sub: "Sur tous les cycles", icon: <i className="ti ti-school" style={{ fontSize: 22 }} />, bg: "#ecfdf5", color: "#10b981" },
          { label: "Absences du mois", value: totalAbsencesMonth, sub: "Retards et absences loggués", icon: <i className="ti ti-alert-triangle" style={{ fontSize: 22 }} />, bg: "#fef2f2", color: "#ef4444" },
          { label: "Congés en cours", value: activeLeavesCount, sub: "Absences autorisées", icon: <i className="ti ti-plane-departure" style={{ fontSize: 22 }} />, bg: "#faf5ff", color: "#8b5cf6" },
        ].map((card, idx) => (
          <motion.div key={idx} className="stat-card" whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ y: 0, scale: 0.96 }} style={{ cursor: "pointer" }}>
            <div className="top">
              <div className="icon-box" style={{ background: card.bg, color: card.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{card.icon}</div>
              <div>
                <div className="stat-label">{card.label}</div>
                <div className="stat-value">{card.value}</div>
              </div>
            </div>
            <div className="bottom">
              <div className="trend up">{card.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PREMIUM NAVIGATION SEGMENTED BAR */}
      <div style={{
        background: "#f1f5f9",
        borderRadius: "16px",
        padding: "6px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "6px",
        marginBottom: "28px",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)"
      }}>
        {[
          { id: "effectifs", label: "Liste des Effectifs", icon: <i className="ti ti-clipboard-list" />, color: "#1e3a8a" },
          { id: "fiches", label: "Fiches & Évaluations", icon: <i className="ti ti-folder" />, color: "#3b82f6" },
          { id: "presences", label: "Suivi Présences", icon: <i className="ti ti-calendar" />, color: "#0d9488" },
          { id: "conges", label: "Congés & Absences", icon: <i className="ti ti-plane-departure" />, color: "#ea580c" },
          { id: "salaires", label: "Paie & Salaires", icon: <i className="ti ti-cash" />, color: "#16a34a" },
          { id: "recrutement", label: "Recrutement & CVs", icon: <i className="ti ti-briefcase" />, color: "#8b5cf6" },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{
                border: "none",
                borderRadius: "12px",
                padding: "10px 14px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: isActive ? "#fff" : "transparent",
                color: isActive ? tab.color : "#64748b",
                boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s ease",
                borderLeft: isActive ? `3px solid ${tab.color}` : "none",
                outline: "none"
              }}
            >
              {tab.icon} <span style={{ marginLeft: 6 }}>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: EFFECTIFS TABLE */}
      {activeTab === "effectifs" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

          {/* SEARCH BAR & DYNAMIC FILTERS */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 19 }}>🔍</span>
              <input type="text" placeholder="Rechercher par nom ou poste..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 16, outline: "none", boxSizing: "border-box", background: "#fff", transition: "all 0.2s" }} />
            </div>

            <div>
              <select value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)} style={{ width: "100%", padding: "11px 12px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 16, outline: "none", background: "#fff", color: "#475569", fontWeight: 600 }}>
                <option value="Tous">Toutes Catégories</option>
                <option value="Enseignant">Enseignants</option>
                <option value="Administration">Administration</option>
                <option value="Services & Soutien">Services & Soutien</option>
              </select>
            </div>

            <div>
              <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ width: "100%", padding: "11px 12px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 16, outline: "none", background: "#fff", color: "#475569", fontWeight: 600 }}>
                <option value="Tous">Tous Statuts</option>
                <option value="Actif">Actifs</option>
                <option value="En congé">En congé</option>
                <option value="Suspendu">Suspendus</option>
                <option value="Absent">Absents</option>
              </select>
            </div>

            <div>
              <select value={filterAnciennete} onChange={e => setFilterAnciennete(e.target.value)} style={{ width: "100%", padding: "11px 12px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 16, outline: "none", background: "#fff", color: "#475569", fontWeight: 600 }}>
                <option value="Tous">Toutes Anciennetés</option>
                <option value="Moins de 2 ans">Moins de 2 ans</option>
                <option value="2 à 5 ans">2 à 5 ans</option>
                <option value="Plus de 5 ans">Plus de 5 ans</option>
              </select>
            </div>
          </div>

          {/* TABLE CONTAINER */}
            
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ maxHeight: 480, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["Nom de l'Employé", "Département / Poste", "Type de Contrat", "Masse Salariale", "Date d'embauche", "Statut", "Actions"].map(h => (
                      <th key={h} style={{ padding: "16px 20px", textAlign: "left", fontSize: 15, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                <AnimatePresence>
                  {filteredEmployes.map((e, idx) => (
                    <motion.tr key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.2s" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {renderAvatar(e, 36, 18)}
                          <div>
                            <span style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", display: "block" }}>{e.nom}</span>
                            <span style={{ fontSize: 14, color: "#64748b", display: "block", marginTop: 2 }}>{e.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: 16, color: "#334155", fontWeight: 600, display: "block" }}>{e.poste}</span>
                        <span style={{ fontSize: 13, padding: "2px 6px", borderRadius: 4, background: "#f1f5f9", color: "#475569", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                          <i className="ti ti-briefcase" /> {e.categorie}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: 14, padding: "4px 10px", borderRadius: 20, fontWeight: 600, ...contratStyle[e.contrat] }}>{e.contrat}</span>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 17, fontWeight: 800, color: "#1e3a8a" }}>{e.salaire.toLocaleString()} GNF</td>
                      <td style={{ padding: "16px 20px", fontSize: 16, color: "#475569" }}>{e.dateEmbauche}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: 14, padding: "4px 10px", borderRadius: 20, fontWeight: 600, ...statusStyle[e.status] }}>{e.status}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => { setSelectedStaff(e); setDossierTab("profil"); }} style={{ background: "#eff6ff", color: "#2563eb", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center", gap: 4 }}>
                            <i className="ti ti-eye" /> Dossier
                          </button>
                          <button onClick={() => {
                            setNewStaffForm({ ...e, emploiDuTemps: Array.isArray(e.emploiDuTemps) ? e.emploiDuTemps.join("; ") : e.emploiDuTemps });
                            setShowAddStaffModal(true);
                          }} style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
                            <i className="ti ti-pencil" />
                          </button>
                          <button onClick={() => setConfirmDelEmp(e)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
                            <i className="ti ti-trash" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredEmployes.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#64748b", fontSize: 17 }}>
                      Aucun membre de l'équipe trouvé avec les filtres sélectionnés.
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 2: FICHES ET EVALUATIONS GRID */}
      {activeTab === "fiches" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

          <div style={{ position: "relative", marginBottom: 20 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 19 }}>🔍</span>
            <input type="text" placeholder="Rechercher parmi les enseignants..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 16, outline: "none", boxSizing: "border-box", background: "#fff" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {employes.filter(e => e.categorie === "Enseignant" && e.nom.toLowerCase().includes(search.toLowerCase())).map(t => (
              <motion.div key={t.id} whileHover={{ y: -4, boxShadow: "0 12px 20px rgba(0,0,0,0.05)" }} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "20px", display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {renderAvatar(t, 44, 21)}
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#1e293b" }}>{t.nom}</h3>
                    <span style={{ fontSize: 14, color: "#3b82f6", fontWeight: 700 }}>{t.poste}</span>
                  </div>
                </div>

                <div style={{ background: "#f8fafc", borderRadius: 12, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, color: "#64748b", fontWeight: 600 }}>Évaluation Pédagogique :</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="ti ti-star" style={{ color: "#f59e0b", fontSize: 17 }} />
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{t.evaluation} / 5</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 15 }}>
                  <div style={{ border: "1px solid #f1f5f9", borderRadius: 10, padding: "8px 10px" }}>
                    <span style={{ color: "#94a3b8", display: "block" }}>Diplôme</span>
                    <strong style={{ color: "#334155", display: "block", marginTop: 2, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{t.diplome}</strong>
                  </div>
                  <div style={{ border: "1px solid #f1f5f9", borderRadius: 10, padding: "8px 10px" }}>
                    <span style={{ color: "#94a3b8", display: "block" }}>Ancienneté</span>
                    <strong style={{ color: "#334155", display: "block", marginTop: 2 }}>{formatSeniority(t.dateEmbauche)}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => { setSelectedStaff(t); setDossierTab("planning"); }} style={{ flex: 1, padding: "8px 0", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <i className="ti ti-calendar" /> Emploi du Temps
                  </button>
                  <button onClick={() => { setSelectedStaff(t); setDossierTab("profil"); }} style={{ flex: 1, padding: "8px 0", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <i className="ti ti-eye" /> Dossier complet
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 3: DAILY ATTENDANCE LOGGER */}
      {activeTab === "presences" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>

          {/* MAIN PANEL */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "24px" }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "#1e3a8a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
              📅 Pointage Quotidien des Présences - {new Date().toLocaleDateString("fr-FR")}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <span style={{ fontSize: 14, color: "#166534", fontWeight: 700, display: "block" }}>PRÉSENTS TODAY</span>
                <span style={{ fontSize: 23, fontWeight: 800, color: "#15803d", marginTop: 4, display: "block" }}>
                  {Object.values(attendanceToday).filter(v => v === "present").length}
                </span>
              </div>
              <div style={{ background: "#fffbeb", border: "1px solid #fef08a", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <span style={{ fontSize: 14, color: "#854d0e", fontWeight: 700, display: "block" }}>RETARDS TODAY</span>
                <span style={{ fontSize: 23, fontWeight: 800, color: "#a16207", marginTop: 4, display: "block" }}>
                  {Object.values(attendanceToday).filter(v => v === "retard").length}
                </span>
              </div>
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <span style={{ fontSize: 14, color: "#991b1b", fontWeight: 700, display: "block" }}>ABSENTS TODAY</span>
                <span style={{ fontSize: 23, fontWeight: 800, color: "#b91c1c", marginTop: 4, display: "block" }}>
                  {Object.values(attendanceToday).filter(v => v === "absent").length}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {employes.map(e => {
                const currentStatus = attendanceToday[e.id] || "present";
                return (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, border: "1px solid #f1f5f9", background: "#f8fafc" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {renderAvatar(e, 36, 18)}
                      <div>
                        <strong style={{ fontSize: 16, color: "#1e293b", display: "block" }}>{e.nom}</strong>
                        <span style={{ fontSize: 14, color: "#64748b" }}>{e.poste}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => handleAttendanceChange(e.id, "present")}
                        style={{
                          padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
                          background: currentStatus === "present" ? "#dcfce7" : "#fff",
                          color: currentStatus === "present" ? "#166534" : "#64748b",
                          boxShadow: currentStatus === "present" ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
                          border: currentStatus === "present" ? "none" : "1px solid #e2e8f0", transition: "0.2s",
                          display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <i className="ti ti-check" /> Présent
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(e.id, "retard")}
                        style={{
                          padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
                          background: currentStatus === "retard" ? "#fef9c3" : "#fff",
                          color: currentStatus === "retard" ? "#854d0e" : "#64748b",
                          boxShadow: currentStatus === "retard" ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
                          border: currentStatus === "retard" ? "none" : "1px solid #e2e8f0", transition: "0.2s",
                          display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <i className="ti ti-clock" /> Retard
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(e.id, "absent")}
                        style={{
                          padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
                          background: currentStatus === "absent" ? "#fee2e2" : "#fff",
                          color: currentStatus === "absent" ? "#991b1b" : "#64748b",
                          boxShadow: currentStatus === "absent" ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
                          border: currentStatus === "absent" ? "none" : "1px solid #e2e8f0", transition: "0.2s",
                          display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <i className="ti ti-x" /> Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HISTORICAL LOG */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "20px" }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1e3a8a", margin: "0 0 14px 0" }}>📜 Historique des Présences</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {attendanceLogs.map((log, idx) => (
                <div key={idx} style={{ padding: 12, borderRadius: 10, border: "1px solid #f1f5f9", background: "#fafafa" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#334155" }}>{log.date}</span>
                    <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 700 }}>Actif</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, fontSize: 14, color: "#64748b" }}>
                    <span>P: <strong>{log.presents}</strong></span>
                    <span>R: <strong>{log.retards}</strong></span>
                    <span>A: <strong>{log.absents}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 4: LEAVE MANAGEMENT */}
      {activeTab === "conges" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>

          {/* DEMANDES DE CONGES */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "24px" }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "#ea580c", margin: "0 0 16px 0" }}>🌴 Demandes &amp; Absences Planifiées</h2>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["Collaborateur", "Type de congé", "Dates (Début - Fin)", "Jours", "Statut", "Décision"].map(h => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#475569", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map(r => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <strong>{r.nom}</strong>
                        <span style={{ fontSize: 13, color: "#64748b", display: "block" }}>{r.poste}</span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ padding: "2px 6px", borderRadius: 4, background: "#f1f5f9", color: "#475569", fontSize: 14, fontWeight: 600 }}>{r.type}</span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "#475569" }}>{r.debut} - {r.fin}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700 }}>{r.jours} j</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          fontSize: 13, padding: "3px 8px", borderRadius: 12, fontWeight: 700,
                          background: r.statut === "Approuvé" ? "#dcfce7" : r.statut === "Refusé" ? "#fee2e2" : "#fef9c3",
                          color: r.statut === "Approuvé" ? "#15803d" : r.statut === "Refusé" ? "#b91c1c" : "#a16207"
                        }}>
                          {r.statut}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {r.statut === "En attente" ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleLeaveDecision(r.id, true)} style={{ background: "#dcfce7", color: "#15803d", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Approuver</button>
                            <button onClick={() => handleLeaveDecision(r.id, false)} style={{ background: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Refuser</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 14, color: "#94a3b8" }}>Traité</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BALANCE AND ACTION */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "20px" }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#ea580c", margin: "0 0 14px 0" }}>🌴 Soldes de Congés Restants</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {employes.map(e => (
                  <div key={e.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: "#334155" }}>{e.nom}</span>
                      <strong style={{ color: "#ea580c" }}>{e.joursCongesRestants} / 30 jours</strong>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(e.joursCongesRestants / 30) * 100}%`, height: "100%", background: "#ea580c", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 5: PAYROLL TABLE */}
      {activeTab === "salaires" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 16 }}>
              <span style={{ fontSize: 14, color: "#1e40af", fontWeight: 700, display: "block" }}>MASSE DE BASE</span>
              <strong style={{ fontSize: 21, color: "#1d4ed8", display: "block", marginTop: 4 }}>{totalSalaires.toLocaleString()} GNF</strong>
            </div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 16 }}>
              <span style={{ fontSize: 14, color: "#166534", fontWeight: 700, display: "block" }}>PRIMES DU MOIS</span>
              <strong style={{ fontSize: 21, color: "#15803d", display: "block", marginTop: 4 }}>{employes.reduce((sum, e) => sum + e.primes, 0).toLocaleString()} GNF</strong>
            </div>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16 }}>
              <span style={{ fontSize: 14, color: "#991b1b", fontWeight: 700, display: "block" }}>RETENUES CONSTATÉES</span>
              <strong style={{ fontSize: 21, color: "#b91c1c", display: "block", marginTop: 4 }}>{employes.reduce((sum, e) => sum + e.retenues, 0).toLocaleString()} GNF</strong>
            </div>
            <div style={{ background: "#fdf2f8", border: "1px solid #fbcfe8", borderRadius: 12, padding: 16 }}>
              <span style={{ fontSize: 14, color: "#9d174d", fontWeight: 700, display: "block" }}>NET TOTAL À PAYER</span>
              <strong style={{ fontSize: 21, color: "#be185d", display: "block", marginTop: 4 }}>{employes.reduce((sum, e) => sum + (e.salaire + e.primes - e.retenues), 0).toLocaleString()} GNF</strong>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {["Collaborateur", "Salaire de base", "Primes (+)", "Retenues (-)", "Salaire Net", "Statut Paie", "Date Paiement", "Actions"].map(h => (
                    <th key={h} style={{ padding: "14px 18px", textAlign: "left", color: "#475569", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employes.map(e => {
                  const net = e.salaire + e.primes - e.retenues;
                  return (
                    <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 18px" }}>
                        <strong style={{ color: "#1e293b", display: "block" }}>{e.nom}</strong>
                        <span style={{ fontSize: 13, color: "#64748b" }}>{e.poste}</span>
                      </td>
                      <td style={{ padding: "14px 18px", fontWeight: 600 }}>{e.salaire.toLocaleString()} GNF</td>
                      <td style={{ padding: "14px 18px" }}>
                        <input
                          type="number"
                          value={e.primes}
                          onChange={(evt) => handleSalaryAdjustment(e.id, "primes", parseInt(evt.target.value) || 0)}
                          style={{ width: 80, padding: 6, border: "1px solid #e2e8f0", borderRadius: 6, outline: "none" }}
                        />
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <input
                          type="number"
                          value={e.retenues}
                          onChange={(evt) => handleSalaryAdjustment(e.id, "retenues", parseInt(evt.target.value) || 0)}
                          style={{ width: 80, padding: 6, border: "1px solid #e2e8f0", borderRadius: 6, outline: "none" }}
                        />
                      </td>
                      <td style={{ padding: "14px 18px", fontWeight: 800, color: "#1e3a8a" }}>{net.toLocaleString()} GNF</td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          fontSize: 13, padding: "3px 8px", borderRadius: 12, fontWeight: 700,
                          background: e.statutPaie === "Payé" ? "#dcfce7" : "#fef9c3",
                          color: e.statutPaie === "Payé" ? "#15803d" : "#a16207"
                        }}>
                          {e.statutPaie}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#64748b" }}>{e.datePaie || "—"}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {e.statutPaie === "En attente" && (
                            <button onClick={() => handlePaySalary(e.id)} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                              <i className="ti ti-cash" /> Payer
                            </button>
                          )}
                          <button onClick={() => setSelectedPayslip(e)} style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                            <i className="ti ti-file-text" /> Bulletin
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 6: RECRUTEMENT KANBAN */}
      {activeTab === "recrutement" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              { id: "CV", label: "CVs Reçus", icon: <i className="ti ti-download" />, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.05)" },
              { id: "Entretien", label: "Entretiens en cours", icon: <i className="ti ti-messages" />, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.05)" },
              { id: "Offres", label: "Offre formulée", icon: <i className="ti ti-hand-shake" />, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.05)" },
              { id: "Engage", label: "Recruté(e)s", icon: <i className="ti ti-user-check" />, color: "#10b981", bg: "rgba(16, 185, 129, 0.05)" },
            ].map(col => {
              const colCandidates = candidates.filter(c => c.etape === col.id);
              return (
                <div key={col.id} style={{ background: col.bg, border: `1px solid ${col.color}20`, borderRadius: 16, padding: "16px", minHeight: 480 }}>

                  {/* COLUMN HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: col.color, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>{col.icon} {col.label}</h3>
                    <span style={{ background: col.color, color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 14, fontWeight: 700 }}>
                      {colCandidates.length}
                    </span>
                  </div>

                  {/* CARDS */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {colCandidates.map(cand => (
                      <motion.div key={cand.id} whileHover={{ y: -3, boxShadow: "0 8px 16px rgba(0,0,0,0.04)" }} style={{ background: "#fff", borderRadius: 12, border: "1px solid #cbd5e1", padding: "14px", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <h4 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", margin: 0 }}>{cand.nom}</h4>
                          <span style={{ fontSize: 14, color: "#64748b", display: "block", marginTop: 2 }}>{cand.poste}</span>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                            <span style={{ fontSize: 13, padding: "2px 6px", borderRadius: 4, background: "#f1f5f9", color: "#475569", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <i className="ti ti-briefcase" /> {cand.categorie || "Enseignant"}
                            </span>
                            <span style={{ fontSize: 13, padding: "2px 6px", borderRadius: 4, background: col.bg, color: col.color, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <i className="ti ti-school" /> {cand.diplome}
                            </span>
                          </div>
                        </div>

                        <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", flexDirection: "column", gap: 2, borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i className="ti ti-mail" /> {cand.email}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i className="ti ti-phone" /> {cand.tel}</span>
                          <span style={{ marginTop: 4, display: "block" }}>Ajouté le: {cand.date}</span>
                        </div>

                        {/* FLOW CONTROLS */}
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 8 }}>
                          {col.id === "CV" && (
                            <button onClick={() => handleMoveCandidate(cand.id, "Entretien")} style={{ background: "#fef9c3", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 13, fontWeight: 700, color: "#854d0e", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                              <i className="ti ti-messages" /> Entretien <i className="ti ti-arrow-right" />
                            </button>
                          )}
                          {col.id === "Entretien" && (
                            <div style={{ display: "flex", gap: 4 }}>
                              <button onClick={() => handleMoveCandidate(cand.id, "CV")} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 13, fontWeight: 700, color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                <i className="ti ti-arrow-left" /> Retour
                              </button>
                              <button onClick={() => handleMoveCandidate(cand.id, "Offres")} style={{ background: "#f3e8ff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 13, fontWeight: 700, color: "#6b21a8", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                <i className="ti ti-hand-shake" /> Offre <i className="ti ti-arrow-right" />
                              </button>
                            </div>
                          )}
                          {col.id === "Offres" && (
                            <div style={{ display: "flex", gap: 4 }}>
                              <button onClick={() => handleMoveCandidate(cand.id, "Entretien")} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 13, fontWeight: 700, color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                <i className="ti ti-arrow-left" /> Retour
                              </button>
                              <button onClick={() => handleMoveCandidate(cand.id, "Engage")} style={{ background: "#dcfce7", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 13, fontWeight: 700, color: "#166534", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                <i className="ti ti-user-check" /> Recruter !
                              </button>
                            </div>
                          )}
                          {col.id === "Engage" && (
                            <span style={{ fontSize: 13, color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-user-check" /> Prêt à l'embauche</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {colCandidates.length === 0 && (
                      <div style={{ border: "2px dashed #cbd5e1", borderRadius: 12, padding: "20px 10px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                        Aucun candidat à cette étape
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 4. DETAIL EMPLOYEE DOSSIER MODAL */}
      <AnimatePresence>
        {selectedStaff && (
          <div className="modal-overlay" onClick={() => setSelectedStaff(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: 560, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>

              {/* MODAL HEADER */}
              <div style={{ background: "#1e3a8a", padding: "24px", color: "#fff", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    {renderAvatar(selectedStaff, 64, 32)}
                    <div>
                      <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>{selectedStaff.nom}</h2>
                      <span style={{ fontSize: 15, color: "#bfdbfe", fontWeight: 600 }}>{selectedStaff.poste}</span>
                    </div>
                  </div>
                  <button className="modal-close" onClick={() => setSelectedStaff(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>✕</button>
                </div>

                {/* MINI INNER TABS */}
                <div style={{ display: "flex", gap: 10, marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14 }}>
                  {[
                    { id: "profil", label: "Profil & Contrat", icon: <i className="ti ti-user" style={{ fontSize: 18 }} /> },
                    { id: "planning", label: "Emploi du temps", icon: <i className="ti ti-calendar" style={{ fontSize: 18 }} /> },
                    { id: "historique", label: "Historique", icon: <i className="ti ti-history" style={{ fontSize: 18 }} /> }
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setDossierTab(tab.id)} style={{
                      background: dossierTab === tab.id ? "#fff" : "transparent",
                      color: dossierTab === tab.id ? "#1e3a8a" : "#fff",
                      border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: 4
                    }}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MODAL BODY */}
              <div className="modal-body" style={{ padding: "24px", maxHeight: "60vh", overflowY: "auto" }}>

                {/* SUB TAB 1: PROFIL */}
                {dossierTab === "profil" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <span style={{ fontSize: 14, color: "#94a3b8", display: "block" }}>Téléphone</span>
                        <strong style={{ fontSize: 16, color: "#334155" }}>{selectedStaff.telephone}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 14, color: "#94a3b8", display: "block" }}>E-mail</span>
                        <strong style={{ fontSize: 16, color: "#334155" }}>{selectedStaff.email}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 14, color: "#94a3b8", display: "block" }}>Dernier Diplôme</span>
                        <strong style={{ fontSize: 16, color: "#334155" }}>{selectedStaff.diplome}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 14, color: "#94a3b8", display: "block" }}>Contrat &amp; Ancienneté</span>
                        <strong style={{ fontSize: 16, color: "#334155" }}>{selectedStaff.contrat} ({formatSeniority(selectedStaff.dateEmbauche)})</strong>
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14, border: "1px solid #f1f5f9" }}>
                      <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 800, color: "#475569" }}>💵 Informations Financières</h4>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                        <span>Salaire Brut :</span>
                        <strong>{selectedStaff.salaire.toLocaleString()} GNF</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, marginTop: 4 }}>
                        <span>Primes :</span>
                        <span style={{ color: "#16a34a", fontWeight: 700 }}>+{selectedStaff.primes.toLocaleString()} GNF</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, marginTop: 4 }}>
                        <span>Retenues :</span>
                        <span style={{ color: "#dc2626", fontWeight: 700 }}>-{selectedStaff.retenues.toLocaleString()} GNF</span>
                      </div>
                      <div style={{ height: 1, background: "#cbd5e1", margin: "8px 0" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                        <strong>Net à percevoir :</strong>
                        <strong style={{ color: "#1e3a8a" }}>{(selectedStaff.salaire + selectedStaff.primes - selectedStaff.retenues).toLocaleString()} GNF</strong>
                      </div>
                    </div>

                    {/* VIRTUAL DOCUMENTS DOWNLOAD SECTION */}
                    <div>
                      <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 800, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}><i className="ti ti-folder" style={{ fontSize: 20 }} /> Documents administratifs joints</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {[
                          { nom: "Contrat_De_Travail_Signe.pdf", taille: "1.4 Mo" },
                          { nom: "Diplome_Et_Certificats.pdf", taille: "3.2 Mo" },
                          { nom: "Piece_D_Identite_Copie.pdf", taille: "850 Ko" }
                        ].map((doc, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fafafa" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <i className="ti ti-file-text" style={{ fontSize: 26, color: "#94a3b8" }} />
                              <div>
                                <span style={{ fontSize: 15, color: "#334155", fontWeight: 600, display: "block" }}>{doc.nom}</span>
                                <span style={{ fontSize: 13, color: "#94a3b8" }}>{doc.taille}</span>
                              </div>
                            </div>
                            <button onClick={() => alert(`Téléchargement simulé de ${doc.nom}`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 15, fontWeight: 700 }}>Télécharger</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 2: PLANNING VISUAL GRID */}
                {dossierTab === "planning" && (
                  <div>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 800, color: "#1e3a8a" }}>📅 Emploi du Temps Hebdomadaire</h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                      {daysOfWeek.map(day => {
                        const schedule = parseSchedule(selectedStaff.emploiDuTemps);
                        const hours = schedule[day];
                        return (
                          <div key={day} style={{
                            background: hours ? "#eff6ff" : "#fafafa",
                            border: hours ? "1px solid #bfdbfe" : "1px dashed #cbd5e1",
                            borderRadius: 10, padding: 10, minHeight: 90, display: "flex", flexDirection: "column", justifyContent: "space-between"
                          }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: hours ? "#1e40af" : "#94a3b8" }}>{day}</span>
                            {hours ? (
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", background: "#fff", padding: "4px 6px", borderRadius: 4, marginTop: 8, textAlign: "center" }}>
                                {hours}
                              </div>
                            ) : (
                              <span style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic", marginTop: 8, display: "block", textAlign: "center" }}>Libre</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SUB TAB 3: HISTORIQUE */}
                {dossierTab === "historique" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: 16, fontWeight: 800, color: "#1e3a8a" }}>📜 Historique de Carrière &amp; Parcours</h4>

                    <div style={{ position: "relative", borderLeft: "2px solid #e2e8f0", marginLeft: 10, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                      {[
                        { date: "Mai 2026", titre: "Mise à jour Dossier Paie", desc: "Configuration des primes et retenues mensuelles." },
                        { date: "Septembre 2024", titre: "Évaluation Annuelle", desc: "Note pédagogique validée avec une mention d'excellence." },
                        { date: selectedStaff.dateEmbauche, titre: "Embauche Initiale", desc: `Intégration au sein de SchoolX en contrat ${selectedStaff.contrat}.` }
                      ].map((item, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <div style={{ position: "absolute", left: -22, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", border: "2px solid #fff" }} />
                          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 700 }}>{item.date}</span>
                          <strong style={{ fontSize: 15, color: "#334155", display: "block", marginTop: 2 }}>{item.titre}</strong>
                          <span style={{ fontSize: 14, color: "#64748b" }}>{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PAYSLIP PRINT MODAL MOCKUP */}
      <AnimatePresence>
        {selectedPayslip && (
          <div className="modal-overlay" onClick={() => setSelectedPayslip(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 350 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: 440, padding: 24, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", border: "1px dashed #cbd5e1" }}>

              {/* PAYSLIP HEADER */}
              <div style={{ textAlign: "center", borderBottom: "1px dashed #cbd5e1", paddingBottom: 14, marginBottom: 14 }}>
                <strong style={{ fontSize: 20, color: "#1e3a8a", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}><i className="ti ti-building" style={{ fontSize: 26 }} /> SCHOOLX GROUP ACADEMY</strong>
                <span style={{ fontSize: 14, color: "#64748b" }}>République de Guinée — Conakry</span>
                <h3 style={{ margin: "10px 0 0 0", fontSize: 17, fontWeight: 800, color: "#0f172a" }}>BULLETIN DE PAIE — MAI 2026</h3>
              </div>

              {/* EMPLOYEE INFO */}
              <div style={{ fontSize: 15, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14, background: "#f8fafc", padding: 10, borderRadius: 8 }}>
                <div>Collaborateur: <strong>{selectedPayslip.nom}</strong></div>
                <div>Poste: <strong>{selectedPayslip.poste}</strong></div>
                <div>Contrat: <strong>{selectedPayslip.contrat}</strong></div>
                <div>Date: <strong>{selectedPayslip.datePaie || new Date().toLocaleDateString("fr-FR")}</strong></div>
              </div>

              {/* PAYSLIP CALCULATION GRID */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15, borderBottom: "1px dashed #cbd5e1", paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Salaire de base brut:</span>
                  <span>{selectedPayslip.salaire.toLocaleString()} GNF</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
                  <span>Primes &amp; Gratifications:</span>
                  <span>+{selectedPayslip.primes.toLocaleString()} GNF</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#dc2626" }}>
                  <span>Retenues de Paie (Absences/Charges):</span>
                  <span>-{selectedPayslip.retenues.toLocaleString()} GNF</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 800, color: "#1e3a8a", marginBottom: 20 }}>
                <span>NET PERÇU GLOBAL :</span>
                <span>{(selectedPayslip.salaire + selectedPayslip.primes - selectedPayslip.retenues).toLocaleString()} GNF</span>
              </div>

              {/* FOOTER */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setSelectedPayslip(null)} style={{ flex: 1, padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", color: "#64748b", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Fermer</button>
                <button onClick={() => { alert("Impression simulée déclenchée !"); setSelectedPayslip(null); }} style={{ flex: 1, padding: 10, border: "none", borderRadius: 8, background: "#1e3a8a", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><i className="ti ti-printer" style={{ fontSize: 20 }} /> Imprimer Bulletin</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. ADD LEAVE REQUEST MODAL */}
      <AnimatePresence>
        {showAddLeaveModal && (
          <div className="modal-overlay" onClick={() => setShowAddLeaveModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: 420, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
              <div style={{ background: "#ea580c", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className="ti ti-plane-departure" style={{ fontSize: 26, color: "#fff" }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>Enregistrer un congé</h2>
                    <span style={{ fontSize: 14, color: "#ffedd5", fontWeight: 600 }}>Caisse &amp; Ressources Humaines</span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowAddLeaveModal(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>✕</button>
              </div>

              <div className="modal-body" style={{ padding: "24px" }}>
                <div style={{ display: "grid", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Employé concerné *</label>
                    <select value={newLeaveForm.employeId} onChange={e => setNewLeaveForm({ ...newLeaveForm, employeId: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }}>
                      <option value="">Sélectionnez un collaborateur</option>
                      {employes.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.nom} — {emp.poste}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Type de congé</label>
                    <select value={newLeaveForm.type} onChange={e => setNewLeaveForm({ ...newLeaveForm, type: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }}>
                      <option value="Congé Annuel">Congé Annuel</option>
                      <option value="Maladie">Maladie</option>
                      <option value="Maternité">Maternité</option>
                      <option value="Sans solde">Sans solde</option>
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Date Début</label>
                      <input type="date" value={newLeaveForm.debut} onChange={e => setNewLeaveForm({ ...newLeaveForm, debut: e.target.value })} style={{ width: "100%", padding: "9px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Date Fin</label>
                      <input type="date" value={newLeaveForm.fin} onChange={e => setNewLeaveForm({ ...newLeaveForm, fin: e.target.value })} style={{ width: "100%", padding: "9px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Nombre de jours ouvrés *</label>
                    <input type="number" placeholder="Ex: 5" value={newLeaveForm.jours} onChange={e => setNewLeaveForm({ ...newLeaveForm, jours: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  <button onClick={() => setShowAddLeaveModal(false)} style={{ flex: 1, padding: 12, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Annuler</button>
                  <button onClick={handleAddLeave} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: "#ea580c", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Soumettre</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. ADD EMPLOYEE MODAL */}
      <AnimatePresence>
        {showAddStaffModal && (
          <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: 460, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
              {/* TOP HEADER */}
              <div style={{ background: "#1e3a8a", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`ti ${newStaffForm.id ? "ti-pencil" : "ti-user-plus"}`} style={{ fontSize: 26, color: "#fff" }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                      {newStaffForm.id ? "Modifier le Collaborateur" : "Ajouter un Collaborateur"}
                    </h2>
                    <span style={{ fontSize: 14, color: "#dbeafe", fontWeight: 600 }}>Caisse &amp; Ressources Humaines</span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowAddStaffModal(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>✕</button>
              </div>

              {/* BODY FORM */}
              <div className="modal-body" style={{ padding: "24px", maxHeight: "75vh", overflowY: "auto" }}>
                <div style={{ display: "grid", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Nom complet *</label>
                    <input type="text" placeholder="Ex: Jean Martin" value={newStaffForm.nom} onChange={e => setNewStaffForm({ ...newStaffForm, nom: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Poste / Discipline d'enseignement *</label>
                    <input type="text" placeholder="Ex: Professeur de Mathématiques ou Cuisinier" value={newStaffForm.poste} onChange={e => setNewStaffForm({ ...newStaffForm, poste: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Catégorie de rôle *</label>
                    <select value={newStaffForm.categorie} onChange={e => setNewStaffForm({ ...newStaffForm, categorie: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }}>
                      <option value="Enseignant">Enseignant</option>
                      <option value="Administration">Administration (Direction, Comptable, Secrétaire, etc.)</option>
                      <option value="Services &amp; Soutien">Services &amp; Soutien (Chauffeur, Sécurité, Entretien, Cuisine, Santé)</option>
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Type de contrat</label>
                      <select value={newStaffForm.contrat} onChange={e => setNewStaffForm({ ...newStaffForm, contrat: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }}>
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Temps partiel">Temps partiel</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Salaire mensuel (GNF) *</label>
                      <input type="number" placeholder="Ex: 2000000" value={newStaffForm.salaire} onChange={e => setNewStaffForm({ ...newStaffForm, salaire: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Dernier Diplôme obtenu</label>
                    <input type="text" placeholder="Ex: Master en Administration" value={newStaffForm.diplome} onChange={e => setNewStaffForm({ ...newStaffForm, diplome: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Téléphone</label>
                      <input type="text" placeholder="Ex: +224 620..." value={newStaffForm.telephone} onChange={e => setNewStaffForm({ ...newStaffForm, telephone: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>E-mail</label>
                      <input type="email" placeholder="Ex: j.martin@schoolx.gn" value={newStaffForm.email} onChange={e => setNewStaffForm({ ...newStaffForm, email: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Avatar de rôle (géré automatiquement)</label>
                    <select value={newStaffForm.avatar} onChange={e => setNewStaffForm({ ...newStaffForm, avatar: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }}>
                      <option value="👨‍🏫">Enseignant (Homme)</option>
                      <option value="👩‍🏫">Enseignante (Femme)</option>
                      <option value="👨‍💼">Cadre (Homme)</option>
                      <option value="👩‍💼">Cadre (Femme)</option>
                      <option value="👨‍💻">Technicien / Secrétaire (Homme)</option>
                      <option value="👩‍💻">Technicienne / Secrétaire (Femme)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Emploi du temps (Séparez par des points-virgules ';')</label>
                    <input type="text" placeholder="Ex: Lundi (08h - 12h); Mercredi (10h - 14h)" value={newStaffForm.emploiDuTemps} onChange={e => setNewStaffForm({ ...newStaffForm, emploiDuTemps: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                </div>

               
                <button onClick={() => {
                  setNewStaffForm({ nom: "", poste: "", salaire: "", contrat: "CDI", diplome: "", telephone: "", email: "", emploiDuTemps: "", avatar: "ti-school", categorie: "Enseignant" });
                  setShowAddStaffModal(true);
                }} style={{ display: "flex", alignItems: "center", gap: 8, background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 12px rgba(30,58,138,0.2)" }}>
                  <i className="ti ti-user-plus" /> Ajouter un Employé
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. ADD CANDIDATE MODAL */}
      <AnimatePresence>
        {showAddCandidateModal && (
          <div className="modal-overlay" onClick={() => setShowAddCandidateModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: 440, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
              {/* TOP HEADER */}
              <div style={{ background: "#8b5cf6", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className="ti ti-user-plus" style={{ fontSize: 26, color: "#fff" }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Nouveau Candidat</h2>
                    <span style={{ fontSize: 14, color: "#f3e8ff", fontWeight: 600 }}>Caisse &amp; Ressources Humaines</span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowAddCandidateModal(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>✕</button>
              </div>

              {/* BODY FORM */}
              <div className="modal-body" style={{ padding: "24px", maxHeight: "65vh", overflowY: "auto" }}>
                <div style={{ display: "grid", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Nom complet du Candidat *</label>
                    <input type="text" placeholder="Ex: Marc Dubois" value={newCandidateForm.nom} onChange={e => setNewCandidateForm({ ...newCandidateForm, nom: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Poste ciblé *</label>
                    <input type="text" placeholder="Ex: Professeur de Chimie ou Cuisinier" value={newCandidateForm.poste} onChange={e => setNewCandidateForm({ ...newCandidateForm, poste: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Catégorie de rôle *</label>
                    <select value={newCandidateForm.categorie} onChange={e => setNewCandidateForm({ ...newCandidateForm, categorie: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }}>
                      <option value="Enseignant">Enseignant</option>
                      <option value="Administration">Administration (Direction, Comptable, Secrétaire, etc.)</option>
                      <option value="Services &amp; Soutien">Services &amp; Soutien (Chauffeur, Secrétaire, Entretien, Cuisine, Santé)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Dernier Diplôme &amp; Titres</label>
                    <input type="text" placeholder="Ex: Doctorat en Chimie Appliquée" value={newCandidateForm.diplome} onChange={e => setNewCandidateForm({ ...newCandidateForm, diplome: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Adresse E-mail</label>
                    <input type="email" placeholder="Ex: m.dubois@gmail.com" value={newCandidateForm.email} onChange={e => setNewCandidateForm({ ...newCandidateForm, email: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 15, color: "#64748b" }}>Téléphone Direct</label>
                    <input type="text" placeholder="Ex: +224 624..." value={newCandidateForm.tel} onChange={e => setNewCandidateForm({ ...newCandidateForm, tel: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 16 }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  <button onClick={() => setShowAddCandidateModal(false)} style={{ flex: 1, padding: 12, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Annuler</button>
                  <button onClick={handleAddCandidate} style={{ flex: 1, padding: 12, border: "none", borderRadius: 10, background: "#8b5cf6", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Ajouter au Pipeline</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!confirmDelEmp}
        title="Supprimer l'employé"
        message={confirmDelEmp ? `Voulez-vous vraiment supprimer ${confirmDelEmp.nom} du personnel ? Cette action est irréversible.` : ""}
        onConfirm={() => { handleDeleteEmployee(confirmDelEmp.id); setConfirmDelEmp(null); }}
        onCancel={() => setConfirmDelEmp(null)}
      />
    </div>
  );
}
