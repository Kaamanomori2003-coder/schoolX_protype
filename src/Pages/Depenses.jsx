import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";
import { t } from "../theme";

const NEUTRAL = t.border;

const CATEGORIES = ["Salaires", "Fournitures scolaires", "Maintenance", "Électricité", "Eau", "Internet", "Événements scolaires", "Transport"];
const STATUTS = ["En attente", "Approuvée", "Rejetée", "Payée"];


const CAT_COLORS = {
  "Salaires": { bg: t.blueSoft, color: t.blue },
  "Fournitures scolaires": { bg: t.greenSoft, color: t.green },
  "Maintenance": { bg: t.redSoft, color: t.red },
  "Électricité": { bg: t.amberSoft, color: t.amber },
  "Eau": { bg: t.blueMid, color: t.blue },
  "Internet": { bg: NEUTRAL, color: t.sub },
  "Événements scolaires": { bg: t.amberSoft, color: t.sub },
  "Transport": { bg: t.greenSoft, color: t.sub },
};

const STAT_COLORS = {
  "En attente": { bg: t.amberSoft, color: t.amber },
  "Approuvée": { bg: t.greenSoft, color: t.green },
  "Rejetée": { bg: t.redSoft, color: t.red },
  "Payée": { bg: t.blueSoft, color: t.blue },
};

const INITIAL_DATA = [
  { id: "DEP-2025-028", cat: "Salaires", desc: "Salaire des enseignants — Mai 2025", montant: 15000000, date: "24/05/2025", statut: "Payée", resp: "M. Soumah", fournisseur: "Trésorerie Lycée Donka", mode: "Virement", qte: 1, motif: "Paie mensuelle du corps enseignant." },
  { id: "DEP-2025-027", cat: "Fournitures scolaires", desc: "Achat de manuels scolaires", montant: 2500000, date: "23/05/2025", statut: "Approuvée", resp: "A. Diallo", fournisseur: "Librairie Kaloum", mode: "Chèque", qte: 80, motif: "Manuels de Terminale et 1ère pour la rentrée." },
  { id: "DEP-2025-026", cat: "Maintenance", desc: "Réparation des climatiseurs", montant: 1200000, date: "22/05/2025", statut: "Payée", resp: "M. Konaté", fournisseur: "Konaté Froid SARL", mode: "Espèces", qte: 4, motif: "Entretien des climatiseurs des salles d'examen." },
  { id: "DEP-2025-025", cat: "Électricité", desc: "Facture d'électricité — Avril", montant: 850000, date: "21/05/2025", statut: "Payée", resp: "A. Diallo", fournisseur: "EDG", mode: "Virement", qte: 1, motif: "Consommation électrique avril 2025." },
  { id: "DEP-2025-024", cat: "Transport", desc: "Frais de transport scolaire", montant: 450000, date: "20/05/2025", statut: "En attente", resp: "M. Soumah", fournisseur: "Transport Scolaire Donka", mode: "Orange Money", qte: 1, motif: "Navettes élèves pour le mois de mai." },
  { id: "DEP-2025-023", cat: "Internet", desc: "Abonnement internet mensuel", montant: 200000, date: "18/05/2025", statut: "Payée", resp: "Direction", fournisseur: "Orange Guinée", mode: "Mobile Money", qte: 1, motif: "Forfait fibre administration." },
  { id: "DEP-2025-022", cat: "Eau", desc: "Facture d'eau — Avril", montant: 120000, date: "15/05/2025", statut: "Payée", resp: "Direction", fournisseur: "SEG", mode: "Virement", qte: 1, motif: "Consommation d'eau avril 2025." },
  { id: "DEP-2025-021", cat: "Événements scolaires", desc: "Organisation journée culturelle", montant: 800000, date: "12/05/2025", statut: "Approuvée", resp: "M. Soumah", fournisseur: "Prestations Culturelles Bah", mode: "Espèces", qte: 1, motif: "Sono, décoration et restauration." },
  { id: "DEP-2025-020", cat: "Maintenance", desc: "Entretien bâtiments", montant: 300000, date: "10/05/2025", statut: "Rejetée", resp: "Technique", fournisseur: "Entreprise Bâtiment Camara", mode: "Espèces", qte: 1, motif: "Devis peinture couloir B — rejeté." },
  { id: "DEP-2025-019", cat: "Fournitures scolaires", desc: "Achat de cahiers et stylos", montant: 180000, date: "08/05/2025", statut: "Payée", resp: "Direction", fournisseur: "Papeterie Ratoma", mode: "Espèces", qte: 120, motif: "Cahiers et stylos pour le secrétariat." },
  { id: "DEP-2025-018", cat: "Salaires", desc: "Primes personnel administratif", montant: 2000000, date: "05/05/2025", statut: "Approuvée", resp: "RH", fournisseur: "Trésorerie Lycée Donka", mode: "Virement", qte: 1, motif: "Primes du 2e trimestre." },
  { id: "DEP-2025-017", cat: "Transport", desc: "Carburant véhicule école", montant: 350000, date: "03/05/2025", statut: "Payée", resp: "Technique", fournisseur: "Station Total Kaloum", mode: "Espèces", qte: 1, motif: "Plein du minibus scolaire." },
];

const REVENUS_DATA = [15, 18, 16, 20, 19, 17, 21, 22, 18, 20, 23, 25];
const DEPENSES_CHART = [9, 11, 10, 13, 8.6, 10, 12, 11, 9, 11, 12, 13];
const MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const LINE_DATA = MOIS.map((m, i) => ({ mois: m, revenus: REVENUS_DATA[i], depenses: DEPENSES_CHART[i] }));

const REPARTITION_TOTAL = 45850000;
const REPARTITION_CAT = [
  { label: "Salaires", pct: 66 },
  { label: "Fournitures", pct: 13 },
  { label: "Maintenance", pct: 11 },
  { label: "Électricité", pct: 5 },
  { label: "Autres", pct: 5 },
].map(c => ({ ...c, montant: Math.round(REPARTITION_TOTAL * c.pct / 100) }));

const ACTIVITIES = [
  { type: "add", label: "Dépense ajoutée", desc: "Achat de fournitures informatiques", time: "24 Mai 2025 · 14:30", user: "M. Soumah" },
  { type: "approve", label: "Dépense approuvée", desc: "Réparation des climatiseurs", time: "23 Mai 2025 · 10:15", user: "M. Konaté" },
  { type: "pay", label: "Dépense payée", desc: "Facture d'électricité — Avril", time: "22 Mai 2025 · 16:45", user: "A. Diallo" },
  { type: "edit", label: "Dépense modifiée", desc: "Achat de livres scolaires", time: "21 Mai 2025 · 09:20", user: "M. Soumah" },
];

const ALERTS = [
  { level: "red", title: "Budget Maintenance dépassé", msg: "Le budget Maintenance a dépassé la limite de 10% ce mois.", date: "24 Mai 2025" },
  { level: "orange", title: "Dépense élevée détectée", msg: "Une dépense exceptionnelle de 2 500 000 GNF détectée.", date: "22 Mai 2025" },
  { level: "orange", title: "Budget bientôt épuisé", msg: "Il ne reste que 6 350 000 GNF sur le budget global.", date: "20 Mai 2025" },
];

const fmt = n => n.toLocaleString("fr-FR");

const ECOLE = {
  marque: "SchoolX",
  nom: "Lycée Donka",
  adresse: "Dixinn, Conakry, Guinée",
  telephone: "+224 622 00 00 00",
  email: "contact@schoolx.gn",
  nif: "NIF 2024-LDK-001",
};
const MODES_DEPENSE = ["Espèces", "Virement", "Chèque", "Orange Money", "Mobile Money"];

const buildFacture = (d) => {
  const qte = Math.max(1, parseInt(d.qte, 10) || 1);
  const montant = Number(d.montant) || 0;
  return {
    ...d,
    qte,
    montant,
    pu: Math.round(montant / qte),
    fournisseur: (d.fournisseur || "").trim() || "Non renseigné",
    mode: d.mode || "Espèces",
    motif: (d.motif || "").trim(),
    emiseLe: new Date().toLocaleDateString("fr-FR"),
  };
};

const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const loadJsPDF = () => new Promise((resolve) => {
  if (window.jspdf) return resolve(window.jspdf.jsPDF);
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  script.onload = () => resolve(window.jspdf.jsPDF);
  document.head.appendChild(script);
});

const downloadFacturePdf = (raw) => {
  const d = buildFacture(raw);
  loadJsPDF().then((JsPDF) => {
    const doc = new JsPDF({ unit: "mm", format: "a4" });
    const pageWidth = 210;
    const marginX = 16;
    const inner = pageWidth - marginX * 2;
    let y = 18;

    const label = (txt, x, yy) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(txt, x, yy);
    };
    const value = (txt, x, yy, opts) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.text(String(txt ?? "—"), x, yy, opts);
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235);
    doc.text(ECOLE.marque, marginX, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(ECOLE.nom, marginX, y + 6);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(ECOLE.adresse, marginX, y + 11);
    doc.text(`Tél. ${ECOLE.telephone}  ·  ${ECOLE.email}`, marginX, y + 16);
    doc.text(ECOLE.nif, marginX, y + 21);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39);
    doc.text("FACTURE", pageWidth - marginX, y, { align: "right" });
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235);
    doc.text(`N° ${d.id}`, pageWidth - marginX, y + 8, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Date de dépense : ${d.date}`, pageWidth - marginX, y + 14, { align: "right" });
    doc.text(`Émise le : ${d.emiseLe}`, pageWidth - marginX, y + 19, { align: "right" });

    y += 28;
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.6);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 8;

    const boxW = (inner - 6) / 2;
    doc.setFillColor(247, 248, 250);
    doc.roundedRect(marginX, y, boxW, 28, 2, 2, "F");
    doc.roundedRect(marginX + boxW + 6, y, boxW, 28, 2, 2, "F");
    label("ÉTABLISSEMENT", marginX + 4, y + 6);
    value(ECOLE.nom, marginX + 4, y + 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(ECOLE.adresse, marginX + 4, y + 17);
    doc.text(ECOLE.telephone, marginX + 4, y + 22);
    label("FOURNISSEUR / BÉNÉFICIAIRE", marginX + boxW + 10, y + 6);
    value(doc.splitTextToSize(d.fournisseur, boxW - 10), marginX + boxW + 10, y + 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Mode : ${d.mode}`, marginX + boxW + 10, y + 22);
    y += 36;

    const cols = [marginX + 3, marginX + 108, marginX + 128, pageWidth - marginX - 3];
    doc.setFillColor(37, 99, 235);
    doc.rect(marginX, y, inner, 8, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("Désignation", cols[0], y + 5.5);
    doc.text("Qté", cols[1], y + 5.5);
    doc.text("P.U.", cols[2], y + 5.5);
    doc.text("Montant", cols[3], y + 5.5, { align: "right" });
    y += 8;
    doc.setFillColor(247, 248, 250);
    doc.rect(marginX, y, inner, 16, "F");
    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(d.desc || "—", 100), cols[0], y + 6);
    doc.text(String(d.qte), cols[1], y + 10);
    doc.text(`${fmt(d.pu)} GNF`, cols[2], y + 10);
    doc.setFont("helvetica", "bold");
    doc.text(`${fmt(d.montant)} GNF`, cols[3], y + 10, { align: "right" });
    y += 22;

    const meta = [
      ["Catégorie", d.cat],
      ["Responsable", d.resp || "—"],
      ["Statut", d.statut],
      ["Référence", d.id],
    ];
    meta.forEach(([k, v], i) => {
      const x = marginX + (i % 2) * (inner / 2);
      const yy = y + Math.floor(i / 2) * 10;
      label(k, x, yy);
      value(v, x + 32, yy);
    });
    y += 24;

    if (d.motif) {
      label("Motif / justification", marginX, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      const motifLines = doc.splitTextToSize(d.motif, inner);
      doc.text(motifLines, marginX, y + 5);
      y += 5 + motifLines.length * 4 + 6;
    }

    doc.setFillColor(239, 246, 255);
    doc.roundedRect(marginX, y, inner, 16, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("Total à régler (GNF) — TVA non applicable", marginX + 4, y + 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235);
    doc.text(`${fmt(d.montant)} GNF`, pageWidth - marginX - 4, y + 11, { align: "right" });
    y += 28;

    doc.setDrawColor(209, 213, 219);
    doc.line(marginX, y, marginX + 70, y);
    doc.line(pageWidth - marginX - 70, y, pageWidth - marginX, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("Cachet de l'établissement", marginX + 35, y + 5, { align: "center" });
    doc.text("Signature du responsable", pageWidth - marginX - 35, y + 5, { align: "center" });

    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text("Document généré par SchoolX — à conserver pour la comptabilité de l'établissement.", pageWidth / 2, 285, { align: "center" });
    doc.save(`Facture_${d.id}.pdf`);
  });
};

const printFacture = (raw) => {
  const d = buildFacture(raw);
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>Facture ${esc(d.id)}</title><style>
    body{font-family:${t.font};padding:36px;color:${t.text};max-width:720px;margin:0 auto}
    .top{display:flex;justify-content:space-between;gap:24px;border-bottom:2px solid ${t.blue};padding-bottom:16px;margin-bottom:20px}
    .brand{font-size:20px;font-weight:700;color:${t.blue}}
    .muted{color:${t.sub};font-size:12px;line-height:1.5}
    .title{font-size:22px;font-weight:800;margin:0;text-align:right}
    .num{color:${t.blue};font-weight:700;font-size:14px;margin-top:4px;text-align:right}
    .parties{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
    .box{background:${t.bg};border:1px solid ${t.border};border-radius:8px;padding:12px 14px}
    .box h4{margin:0 0 6px;font-size:10px;letter-spacing:.4px;text-transform:uppercase;color:${t.muted}}
    table{width:100%;border-collapse:collapse;margin:8px 0 16px}
    th{background:${t.blue};color:#fff;font-size:11px;text-align:left;padding:8px 10px}
    td{padding:10px;border-bottom:1px solid ${t.border};font-size:13px}
    .r{text-align:right}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:13px;margin-bottom:16px}
    .meta span{color:${t.muted};font-size:11px;text-transform:uppercase;display:block}
    .total{background:${t.blueSoft};border-radius:8px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:700;color:${t.blue};font-size:18px}
    .sign{display:flex;justify-content:space-between;margin-top:48px;font-size:12px;color:${t.muted}}
    .sign div{width:42%;border-top:1px solid ${t.border};padding-top:8px;text-align:center}
  </style></head><body>`);
  w.document.write(`<div class="top">
    <div><div class="brand">${ECOLE.marque}</div><div style="font-weight:700;margin-top:2px">${ECOLE.nom}</div>
    <div class="muted">${esc(ECOLE.adresse)}<br>Tél. ${esc(ECOLE.telephone)} · ${esc(ECOLE.email)}<br>${esc(ECOLE.nif)}</div></div>
    <div><p class="title">FACTURE</p><div class="num">N° ${esc(d.id)}</div>
    <div class="muted" style="text-align:right;margin-top:6px">Date : ${esc(d.date)}<br>Émise le : ${esc(d.emiseLe)}</div></div>
  </div>`);
  w.document.write(`<div class="parties">
    <div class="box"><h4>Établissement</h4><strong>${ECOLE.nom}</strong><div class="muted">${esc(ECOLE.adresse)}</div></div>
    <div class="box"><h4>Fournisseur / Bénéficiaire</h4><strong>${esc(d.fournisseur)}</strong><div class="muted">Paiement : ${esc(d.mode)}</div></div>
  </div>`);
  w.document.write(`<table><thead><tr><th>Désignation</th><th>Qté</th><th>Prix unitaire</th><th class="r">Montant</th></tr></thead><tbody>
    <tr><td>${esc(d.desc)}</td><td>${d.qte}</td><td>${fmt(d.pu)} GNF</td><td class="r"><strong>${fmt(d.montant)} GNF</strong></td></tr>
  </tbody></table>`);
  w.document.write(`<div class="meta">
    <div><span>Catégorie</span>${esc(d.cat)}</div>
    <div><span>Responsable</span>${esc(d.resp || "—")}</div>
    <div><span>Statut</span>${esc(d.statut)}</div>
    <div><span>Référence</span>${esc(d.id)}</div>
  </div>`);
  if (d.motif) w.document.write(`<div class="box" style="margin-bottom:16px"><h4>Motif / justification</h4>${esc(d.motif)}</div>`);
  w.document.write(`<div class="total"><span style="font-size:12px;font-weight:600;color:${t.sub}">Total à régler · TVA non applicable</span><span>${fmt(d.montant)} GNF</span></div>`);
  w.document.write(`<div class="sign"><div>Cachet de l'établissement</div><div>Signature du responsable</div></div>`);
  w.document.write(`<p style="margin-top:36px;text-align:center;color:${t.muted};font-size:11px">Document généré par SchoolX — à conserver pour la comptabilité.</p></body></html>`);
  w.document.close();
  w.print();
};

function FactureGeneree({ item, onClose, onSavePdf, onPrint }) {
  const d = buildFacture(item);
  const meta = [
    { label: "Catégorie", value: d.cat },
    { label: "Responsable", value: d.resp || "—" },
    { label: "Statut", value: d.statut },
    { label: "Référence", value: d.id },
  ];
  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300, padding: 24 }}>
      <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} onClick={e => e.stopPropagation()}
        style={{ background: t.surface, borderRadius: t.radiusLg, width: 560, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", fontFamily: t.font, color: t.text }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: t.surface, zIndex: 1 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: t.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-file-invoice" style={{ fontSize: 19, color: t.blue }} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text }}>Facture</h2>
              <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>Document comptable · {ECOLE.nom}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: t.bg, border: "none", color: t.sub, width: 30, height: 30, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-x" style={{ fontSize: 15 }} />
          </button>
        </div>
        <div style={{ padding: "20px 22px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 16, paddingBottom: 14, borderBottom: `2px solid ${t.blue}` }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: t.blue }}>{ECOLE.marque}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginTop: 2 }}>{ECOLE.nom}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 4, lineHeight: 1.5 }}>
                {ECOLE.adresse}<br />Tél. {ECOLE.telephone} · {ECOLE.email}<br />{ECOLE.nif}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: ".4px" }}>FACTURE</div>
              <div style={{ display: "inline-block", marginTop: 6, fontSize: 11.5, fontWeight: 700, color: t.blue, background: t.blueSoft, border: `1px solid ${t.blueMid}`, padding: "3px 10px", borderRadius: 6 }}>
                N° {d.id}
              </div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 8 }}>Date : {d.date}<br />Émise le : {d.emiseLe}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 4 }}>Établissement</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{ECOLE.nom}</div>
              <div style={{ fontSize: 11, color: t.sub, marginTop: 2 }}>{ECOLE.adresse}</div>
            </div>
            <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 4 }}>Fournisseur / Bénéficiaire</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{d.fournisseur}</div>
              <div style={{ fontSize: 11, color: t.sub, marginTop: 2 }}>Paiement : {d.mode}</div>
            </div>
          </div>

          <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radius, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 90px 110px", background: t.blue, color: "#fff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".3px", padding: "8px 12px" }}>
              <span>Désignation</span><span>Qté</span><span>P.U.</span><span style={{ textAlign: "right" }}>Montant</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 90px 110px", padding: "10px 12px", fontSize: 12.5, background: t.bg, alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>{d.desc}</span>
              <span>{d.qte}</span>
              <span>{fmt(d.pu)} GNF</span>
              <span style={{ textAlign: "right", fontWeight: 700 }}>{fmt(d.montant)} GNF</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", marginBottom: 14 }}>
            {meta.map(r => (
              <div key={r.label}>
                <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".3px" }}>{r.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{r.value}</div>
              </div>
            ))}
          </div>

          {d.motif && (
            <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "10px 12px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 4 }}>Motif / justification</div>
              <div style={{ fontSize: 12.5, color: t.sub, lineHeight: 1.45 }}>{d.motif}</div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: t.blueSoft, borderRadius: t.radius, padding: "12px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: t.sub, fontWeight: 600 }}>Total à régler · TVA non applicable</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: t.blue }}>{fmt(d.montant)} <span style={{ fontSize: 12, color: t.muted, fontWeight: 500 }}>GNF</span></span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onPrint(item)} style={{ flex: 1, padding: 10, border: `1px solid ${t.border}`, borderRadius: t.radius, background: t.surface, fontSize: 12.5, fontWeight: 500, cursor: "pointer", color: t.sub, fontFamily: t.font, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <i className="ti ti-printer" style={{ fontSize: 15 }} /> Imprimer
            </button>
            <button onClick={() => onSavePdf(item)} style={{ flex: 1, padding: 10, border: "none", borderRadius: t.radius, background: t.blue, color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, boxShadow: "0 2px 8px rgba(37,99,235,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <i className="ti ti-device-floppy" style={{ fontSize: 15 }} /> Enregistrer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const srcFacture = (d) => d?.fileUrl || d?.fileData || "";
const hasFacture = (d) => !!(d?.fileName || srcFacture(d));
const isImageFacture = (d) =>
  (d?.fileType || "").startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp)$/i.test(d?.fileName || "");

function FactureApercu({ item, compact }) {
  const src = srcFacture(item);
  if (!src) return null;
  if (isImageFacture(item)) {
    return (
      <img src={src} alt={item.fileName || "Facture"}
        style={{ maxWidth: "100%", maxHeight: compact ? 160 : "70vh", display: "block", borderRadius: t.radius, border: `1px solid ${t.border}` }} />
    );
  }
  return (
    <iframe title={item.fileName || "Facture"} src={src}
      style={{ width: "100%", height: compact ? 180 : "70vh", border: `1px solid ${t.border}`, borderRadius: t.radius, background: t.bg }} />
  );
}

function FacturePreview({ item, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1400, padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: t.surface, borderRadius: t.radiusLg, width: "min(820px,94vw)", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", fontFamily: t.font }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{item.fileName || "Facture"}</span>
          <button onClick={onClose} style={{ background: t.bg, border: "none", color: t.sub, width: 30, height: 30, borderRadius: 8, cursor: "pointer" }}>
            <i className="ti ti-x" style={{ fontSize: 15 }} />
          </button>
        </div>
        <div style={{ padding: 16 }}>
          <FactureApercu item={item} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────── helpers ───────────────── */
function Badge({ label, style }) {
  const { bg, ...rest } = style || {};
  return (
    <span style={{ display: "inline-block", fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 600, whiteSpace: "nowrap", background: bg, ...rest }}>
      {label}
    </span>
  );
}

function StatCard({ icon, iconBg, label, value }) {
  return (
    <motion.div whileHover={{ y: -3, boxShadow: t.shadowMd }} whileTap={{ y: 0, scale: 0.98 }}
      style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius, boxShadow: t.shadow, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, minWidth: 0, cursor: "pointer" }}>
      <div style={{ width: 40, height: 40, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>{label}</div>
        <div style={{ fontSize: 21, fontWeight: 700, color: t.text, marginTop: 3, lineHeight: 1 }}>{value}</div>
      </div>
    </motion.div>
  );
}

const tooltipStyle = {
  background: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: t.radius,
  boxShadow: t.shadowMd,
  fontFamily: t.font,
  fontSize: 12,
  color: t.text,
};

/* ─── Line chart via recharts ─── */
function LineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
      <RLineChart data={LINE_DATA} margin={{ top: 6, right: 8, bottom: 0, left: -14 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.border} />
        <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.muted }} stroke={t.muted} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.muted }} stroke={t.muted} tickFormatter={v => `${v}M`} width={46} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: t.sub, fontSize: 11 }} formatter={v => `${v}M`} />
        <Line type="monotone" dataKey="revenus" name="Revenus" stroke={t.blue} strokeWidth={2} dot={{ r: 3, fill: t.blue, strokeWidth: 0 }} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="depenses" name="Dépenses" stroke={t.red} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: t.red, strokeWidth: 0 }} activeDot={{ r: 4 }} />
      </RLineChart>
    </ResponsiveContainer>
  );
}

/* ─── Activity dot color ─── */
const actBg = { add: t.greenSoft, approve: t.blueSoft, pay: t.amberSoft, edit: NEUTRAL };
const actIcon = {
  add: <i className="ti ti-plus" style={{ fontSize: 13, color: t.green }} />,
  approve: <i className="ti ti-check" style={{ fontSize: 13, color: t.blue }} />,
  pay: <i className="ti ti-cash" style={{ fontSize: 13, color: t.amber }} />,
  edit: <i className="ti ti-pencil" style={{ fontSize: 13, color: t.sub }} />
};

/* ─── Modal ─── */
const lbl = { fontSize: 11, fontWeight: 600, color: t.sub, display: "block", marginBottom: 5 };
const inp = {
  width: "100%", padding: "9px 12px", border: `1px solid ${t.border}`,
  borderRadius: t.radius, fontSize: 13, outline: "none", boxSizing: "border-box",
  fontFamily: t.font, background: t.surface, color: t.text,
};
const errText = { color: t.red, fontSize: 11, marginTop: 3 };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 };
const sheetStyle = { background: t.surface, borderRadius: t.radiusLg, width: "min(560px,94vw)", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" };
const closeBtnStyle = { background: t.bg, border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.sub, flexShrink: 0 };
const cancelBtnStyle = { flex: 1, padding: "10px", border: `1px solid ${t.border}`, borderRadius: t.radius, background: t.surface, fontSize: 12.5, fontWeight: 500, cursor: "pointer", color: t.sub, fontFamily: t.font };
const saveBtnStyle = { flex: 1, padding: "10px", border: "none", borderRadius: t.radius, background: t.blue, color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: t.font, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 };

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "16px 22px", borderBottom: `1px solid ${t.border}`, background: t.surface }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: t.blueSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i className="ti ti-receipt" style={{ fontSize: 19, color: t.blue }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text }}>{title}</h3>
          <span style={{ fontSize: 11.5, color: t.muted }}>{subtitle}</span>
        </div>
      </div>
      <button className="modal-close" onClick={onClose} style={closeBtnStyle}>
        <i className="ti ti-x" style={{ fontSize: 15 }} />
      </button>
    </div>
  );
}

function Modal({ onClose, onSave, nextId, initialData }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        date: initialData.date.split("/").reverse().join("-"),
        motif: initialData.motif || "",
        fournisseur: initialData.fournisseur || "",
        mode: initialData.mode || "Espèces",
        qte: initialData.qte || 1,
        fileName: initialData.fileName || "",
        fileUrl: initialData.fileUrl || "",
        fileData: initialData.fileData || "",
        fileType: initialData.fileType || "",
      };
    }
    return {
      desc: "", cat: "Salaires", montant: "",
      date: new Date().toISOString().split("T")[0],
      resp: "", motif: "", fournisseur: "", mode: "Espèces", qte: 1,
      fileName: "", fileUrl: "", fileData: "", fileType: "",
    };
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const errs = {};
    if (!form.desc.trim()) errs.desc = "La description est requise";
    if (!form.fournisseur.trim()) errs.fournisseur = "Le fournisseur est requis";
    const m = parseInt(form.montant);
    if (!form.montant || isNaN(m) || m <= 0) errs.montant = "Le montant doit être supérieur à 0";
    if (!form.date) errs.date = "La date est requise";
    const q = parseInt(form.qte);
    if (!form.qte || isNaN(q) || q <= 0) errs.qte = "La quantité doit être supérieure à 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { showToast("Veuillez corriger les champs en rouge", "error"); return; }
    const [y, m, d] = form.date.split("-");
    const formattedDate = `${d}/${m}/${y}`;
    if (initialData) {
      onSave({
        ...initialData, ...form,
        montant: parseInt(form.montant),
        qte: parseInt(form.qte) || 1,
        date: formattedDate,
        fournisseur: form.fournisseur.trim(),
        mode: form.mode,
      });
    } else {
      onSave({
        id: nextId, cat: form.cat, desc: form.desc, montant: parseInt(form.montant),
        qte: parseInt(form.qte) || 1, date: formattedDate, statut: "En attente",
        resp: form.resp || "Non défini", motif: form.motif,
        fournisseur: form.fournisseur.trim(), mode: form.mode,
        fileName: form.fileName, fileUrl: form.fileUrl, fileData: form.fileData, fileType: form.fileType,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={overlayStyle}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={e => e.stopPropagation()} style={sheetStyle}>
        <ModalHeader
          title={initialData ? "Modifier la dépense" : "Nouvelle dépense"}
          subtitle="Caisse & Comptabilité"
          onClose={onClose}
        />

        {/* BODY */}
        <div className="modal-body" style={{ padding: "20px 22px 22px", maxHeight: "75vh", overflowY: "auto" }}>
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={lbl}>Référence (auto)</label>
              <input value={initialData ? initialData.id : nextId} readOnly style={{ ...inp, background: t.bg, color: t.muted }} />
            </div>

            <div>
              <label style={lbl}>Désignation *</label>
              <input value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Ex: Achat de fournitures scolaires" style={{ ...inp, borderColor: errors.desc ? t.red : t.border }} />
              {errors.desc && <p style={errText}>{errors.desc}</p>}
            </div>

            <div>
              <label style={lbl}>Fournisseur / Bénéficiaire *</label>
              <input value={form.fournisseur} onChange={e => set("fournisseur", e.target.value)} placeholder="Ex: Librairie Kaloum, EDG, Orange Guinée" style={{ ...inp, borderColor: errors.fournisseur ? t.red : t.border }} />
              {errors.fournisseur && <p style={errText}>{errors.fournisseur}</p>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>Catégorie *</label>
                <select value={form.cat} onChange={e => set("cat", e.target.value)} style={inp}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Montant (GNF) *</label>
                <input type="number" value={form.montant} onChange={e => set("montant", e.target.value)} placeholder="Ex: 250000" style={{ ...inp, borderColor: errors.montant ? t.red : t.border }} />
                {errors.montant && <p style={errText}>{errors.montant}</p>}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>Quantité *</label>
                <input type="number" min="1" value={form.qte} onChange={e => set("qte", e.target.value)} style={{ ...inp, borderColor: errors.qte ? t.red : t.border }} />
                {errors.qte && <p style={errText}>{errors.qte}</p>}
              </div>
              <div>
                <label style={lbl}>Mode de paiement</label>
                <select value={form.mode} onChange={e => set("mode", e.target.value)} style={inp}>
                  {MODES_DEPENSE.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>Date *</label>
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={{ ...inp, borderColor: errors.date ? t.red : t.border }} />
                {errors.date && <p style={errText}>{errors.date}</p>}
              </div>
              <div>
                <label style={lbl}>Responsable</label>
                <input value={form.resp} onChange={e => set("resp", e.target.value)} placeholder="Ex: M. Soumah" style={inp} />
              </div>
            </div>

            <div>
              <label style={lbl}>Motif / Justification</label>
              <textarea value={form.motif} onChange={e => set("motif", e.target.value)}
                placeholder="Décrivez le motif de cette dépense..."
                style={{ ...inp, height: 68, resize: "vertical" }} />
            </div>

            <div>
              <label style={lbl}>Facture / justificatif</label>
              {/* Front pur : aperçu via data URL + blob, valable uniquement pendant la session (pas de backend). */}
              <label style={{ display: "block", border: `1px dashed ${hasFacture(form) ? t.blue : t.border}`, borderRadius: t.radius, padding: 14, textAlign: "center", cursor: "pointer", fontSize: 11.5, color: t.muted, background: hasFacture(form) ? t.blueSoft : t.bg }}>
                <div style={{ marginBottom: 4 }}><i className="ti ti-paperclip" style={{ fontSize: 24, color: t.blue }} /></div>
                {form.fileName || "Joindre une facture (PDF ou image)"}
                <input type="file" accept="image/*,.pdf,application/pdf" style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (form.fileUrl && String(form.fileUrl).startsWith("blob:")) URL.revokeObjectURL(form.fileUrl);
                    if (!file) {
                      setForm(f => ({ ...f, fileName: "", fileUrl: "", fileData: "", fileType: "" }));
                      return;
                    }
                    const blobUrl = URL.createObjectURL(file);
                    setForm(f => ({ ...f, fileName: file.name, fileUrl: blobUrl, fileData: "", fileType: file.type || "" }));
                    const reader = new FileReader();
                    reader.onload = () => {
                      setForm(f => ({ ...f, fileData: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }} />
              </label>
              {hasFacture(form) && (
                <div style={{ marginTop: 10 }}>
                  <FactureApercu item={form} compact />
                  <button type="button" onClick={() => {
                    if (form.fileUrl && String(form.fileUrl).startsWith("blob:")) URL.revokeObjectURL(form.fileUrl);
                    setForm(f => ({ ...f, fileName: "", fileUrl: "", fileData: "", fileType: "" }));
                  }} style={{ background: "none", border: "none", padding: 0, marginTop: 8, fontSize: 12, fontWeight: 600, color: t.red, cursor: "pointer", fontFamily: t.font }}>
                    Retirer le fichier
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={lbl}>Workflow d'approbation</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {["Créée", "→", "Soumise", "→", "Validée (Directeur)", "→", "Payée"].map((s, i) =>
                  s === "→"
                    ? <i key={i} className="ti ti-chevron-right" style={{ fontSize: 13, color: t.muted }} />
                    : <span key={i} style={{
                      fontSize: 11, padding: "3px 9px", borderRadius: 20,
                      background: i === 0 ? t.greenSoft : i === 2 ? t.blueSoft : NEUTRAL,
                      color: i === 0 ? t.green : i === 2 ? t.blue : t.sub,
                      fontWeight: 600, whiteSpace: "nowrap",
                    }}>{s}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button onClick={onClose} style={cancelBtnStyle}>Annuler</button>
            <button onClick={handleSubmit} style={saveBtnStyle}><i className="ti ti-device-floppy" style={{ fontSize: 15 }}></i> Enregistrer</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
function InfoItem({ icon, label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
      <i className={`ti ${icon}`} style={{ fontSize: 15, color: t.muted, marginTop: 1, width: 16, flexShrink: 0 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: color || t.text, fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

const ActionBtn = ({ icon, label, primary, c, bg, border, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 7,
    padding: "9px 16px", border: primary ? "none" : `1px solid ${border || t.border}`,
    borderRadius: t.radius, cursor: "pointer",
    fontFamily: t.font, fontSize: 12.5, fontWeight: 500,
    background: primary ? t.blue : (bg || t.surface),
    color: primary ? "#fff" : (c || t.sub),
    boxShadow: primary ? "0 2px 8px rgba(37,99,235,0.25)" : t.shadow,
    transition: "all .15s",
  }}>
    <i className={`ti ${icon}`} style={{ fontSize: 14 }} /> {label}
  </button>
);

/* ── Fiche détaillée d'une dépense (page pleine, lecture seule) ── */
function FicheDepense({ item, onRetour, onEdit, onDelete, onVoirFacture }) {
  const statColor = STAT_COLORS[item.statut] || { bg: NEUTRAL, color: t.sub };
  const catColor = CAT_COLORS[item.cat] || { bg: NEUTRAL, color: t.sub };

  return (
    <div style={{ fontFamily: t.font, color: t.text, maxWidth: 860, margin: "0 auto" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <ActionBtn icon="ti-arrow-left" label="Retour" primary onClick={onRetour} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ActionBtn icon="ti-file-invoice" label="Voir la facture" c={t.blue} bg={t.blueSoft} border={t.blueMid} onClick={() => onVoirFacture(item)} />
          <ActionBtn icon="ti-pencil" label="Modifier" onClick={() => onEdit(item)} />
          <ActionBtn icon="ti-trash" label="Supprimer" c={t.red} bg={t.redSoft} border={t.redSoft} onClick={() => onDelete(item)} />
        </div>
      </div>

      {/* ── HERO CARD ── */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "16px 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap", marginBottom: 18 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg,${t.blueMid},${t.blueSoft})`,
              border: `2px solid ${t.blueMid}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 10px rgba(37,99,235,0.15)",
            }}>
              <i className="ti ti-receipt" style={{ fontSize: 22, color: t.blue }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{item.desc}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, color: t.blue,
                  background: t.blueSoft, border: `1px solid ${t.blueMid}`,
                  padding: "3px 10px", borderRadius: 6, letterSpacing: ".3px",
                }}>
                  <i className="ti ti-hash" style={{ marginRight: 5, fontSize: 11 }} />
                  {item.id}
                </span>
                <Badge label={item.cat} style={catColor} />
                <Badge label={item.statut} style={statColor} />
                {hasFacture(item)
                  ? <Badge label="Justificatif joint" style={{ bg: t.blueSoft, color: t.blue }} />
                  : <Badge label="Sans justificatif" style={{ bg: t.bg, color: t.sub }} />}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "12px 16px" }}>
            <div>
              <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>Montant engagé</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: t.red, marginTop: 3, lineHeight: 1 }}>{fmt(item.montant)} <span style={{ fontSize: 13, color: t.muted, fontWeight: 500 }}>GNF</span></div>
            </div>
            <Badge label={item.statut} style={statColor} />
          </div>
        </div>
      </div>

      {/* ── DÉTAIL ── */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>
            <i className="ti ti-file-invoice" style={{ fontSize: 14, color: t.muted, marginRight: 7 }} />
            Détails de la dépense
          </span>
        </div>
        <div style={{ padding: "6px 18px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0 32px" }}>
            <div>
              <InfoItem icon="ti-file-description" label="Désignation" value={item.desc} />
              <InfoItem icon="ti-building-store" label="Fournisseur" value={item.fournisseur || "Non renseigné"} />
              <InfoItem icon="ti-calendar" label="Date" value={item.date} />
              <InfoItem icon="ti-user" label="Responsable" value={item.resp || "Non défini"} />
            </div>
            <div>
              <InfoItem icon="ti-tag" label="Catégorie" value={item.cat} />
              <InfoItem icon="ti-credit-card" label="Mode de paiement" value={item.mode || "Espèces"} />
              <InfoItem icon="ti-hash" label="Quantité" value={String(item.qte || 1)} />
              <InfoItem icon="ti-receipt" label="Référence" value={item.id} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>
            <i className="ti ti-paperclip" style={{ fontSize: 14, color: t.muted, marginRight: 7 }} />
            Facture / justificatif
          </span>
        </div>
        <div style={{ padding: "14px 18px" }}>
          {item.motif && (
            <div style={{ marginBottom: hasFacture(item) ? 14 : 0 }}>
              <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 6 }}>Motif</div>
              <div style={{ fontSize: 13, color: t.sub, lineHeight: 1.5 }}>{item.motif}</div>
            </div>
          )}
          {hasFacture(item) ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 8 }}>{item.fileName}</div>
              <FactureApercu item={item} compact />
              <button type="button" onClick={() => onVoirFacture(item)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, padding: "8px 12px", border: `1px solid ${t.blueMid}`, borderRadius: t.radius, background: t.blueSoft, color: t.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: t.font }}>
                <i className="ti ti-arrows-maximize" style={{ fontSize: 14 }} /> Agrandir
              </button>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: t.sub, padding: "10px 12px", background: t.bg, border: `1px dashed ${t.border}`, borderRadius: t.radius }}>
              Sans justificatif — joignez une facture en modifiant cette dépense.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
/* ═══════════════ MAIN COMPONENT ═══════════════ */
const PER_PAGE = 5;

export default function Depenses() {
  const { showToast } = useToast();
  const [depenses, setDepenses] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStat, setFilterStat] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null); // ⬅️ nouveau
  const [confirmDelDep, setConfirmDelDep] = useState(null);
  const [previewFacture, setPreviewFacture] = useState(null);
  const [factureItem, setFactureItem] = useState(null);


  const filtered = depenses.filter(d => {
    const s = search.toLowerCase();
    return (
      (!s || d.desc.toLowerCase().includes(s) || d.id.toLowerCase().includes(s) || (d.fournisseur || "").toLowerCase().includes(s)) &&
      (!filterCat || d.cat === filterCat) &&
      (!filterStat || d.statut === filterStat)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalMontant = depenses.reduce((a, d) => a + d.montant, 0);
  const maxId = Math.max(...depenses.map(d => parseInt(d.id.split("-")[2] || 0)), 28);
  const nextId = "DEP-2025-0" + String(maxId + 1).padStart(2, "0");

  const handleSave = d => {
    if (depenses.find(x => x.id === d.id)) {
      setDepenses(depenses.map(x => x.id === d.id ? d : x));
      showToast("Dépense mise à jour", "success");
    } else {
      setDepenses([d, ...depenses]);
      showToast("Dépense ajoutée", "success");
    }
    setShowModal(false);
    setEditItem(null);
    setPage(1);
    setFactureItem(d);
  };

  const handleDelete = id => {
    setDepenses(depenses.filter(d => d.id !== id));
    showToast("Dépense supprimée", "error");
  };

  const openAddModal = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const selStyle = {
    padding: "10px 14px", border: `1px solid ${t.border}`, borderRadius: t.radius,
    fontSize: 13, fontFamily: t.font, outline: "none", background: t.surface, cursor: "pointer", color: t.text,
    boxShadow: t.shadow, flexShrink: 0,
  };

  const cardStyle = { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, padding: 18, minWidth: 0 };
  const cardTitle = { fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 };

  const viewed = viewItem ? (depenses.find(x => x.id === viewItem.id) || viewItem) : null;

  if (viewed) return (
    <>
      <FicheDepense
        item={viewed}
        onRetour={() => setViewItem(null)}
        onEdit={item => { setViewItem(item); setEditItem(item); setShowModal(true); }}
        onDelete={item => { setConfirmDelDep(item); }}
        onVoirFacture={setFactureItem}
      />
      {showModal && (
        <Modal key="expense-modal-fiche" onClose={() => { setShowModal(false); setEditItem(null); }} onSave={handleSave} nextId={nextId} initialData={editItem} />
      )}
      {factureItem && (
        <FactureGeneree
          item={factureItem}
          onClose={() => setFactureItem(null)}
          onSavePdf={(d) => { downloadFacturePdf(d); showToast("Facture enregistrée", "success", `${d.id}.pdf téléchargé.`); }}
          onPrint={printFacture}
        />
      )}
      {previewFacture && (
        <FacturePreview item={previewFacture} onClose={() => setPreviewFacture(null)} />
      )}
      <ConfirmModal
        isOpen={!!confirmDelDep}
        title="Supprimer la dépense"
        message={confirmDelDep ? `Voulez-vous vraiment supprimer la dépense "${confirmDelDep.desc}" ? Cette action est irréversible.` : ""}
        onConfirm={() => { handleDelete(confirmDelDep.id); setConfirmDelDep(null); setViewItem(null); }}
        onCancel={() => setConfirmDelDep(null)}
      />
    </>
  );

  return (
    <div style={{ fontFamily: t.font, color: t.text }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: t.text }}>Gestion des dépenses</h1>
          <p style={{ fontSize: 13, color: t.sub, margin: 0, marginTop: 4 }}>Suivez et gérez toutes les dépenses de l'établissement</p>
        </div>
        <button onClick={openAddModal} style={{ display: "flex", alignItems: "center", gap: 7, background: t.blue, color: "#fff", border: "none", borderRadius: t.radius, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, fontFamily: t.font, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}>
          <i className="ti ti-plus" style={{ fontSize: 14 }} /> Ajouter une dépense
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard icon={<i className="ti ti-briefcase" style={{ color: t.blue, fontSize: 19 }} />} iconBg={t.blueSoft} label="Dépenses totales" value={fmt(totalMontant) + " GNF"} />
        <StatCard icon={<i className="ti ti-calendar" style={{ color: t.amber, fontSize: 19 }} />} iconBg={t.amberSoft} label="Ce mois (Mai)" value="8 650 000 GNF" />
        <StatCard icon={<i className="ti ti-chart-pie" style={{ color: t.green, fontSize: 19 }} />} iconBg={t.greenSoft} label="Budget restant" value="6 350 000 GNF" />
        <StatCard icon={<i className="ti ti-receipt" style={{ color: t.red, fontSize: 19 }} />} iconBg={t.redSoft} label="Nb dépenses" value={depenses.length} />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 14, marginBottom: 20 }}>
        {/* Line chart */}
        <div style={cardStyle}>
          <div style={{ ...cardTitle, marginBottom: 8 }}>Revenus vs dépenses — 12 derniers mois</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: t.sub }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: t.blue, display: "inline-block" }}></span>Revenus
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: t.sub }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: t.red, display: "inline-block" }}></span>Dépenses
            </div>
          </div>
          <div style={{ height: 200, width: "100%", minWidth: 0 }}><LineChart /></div>
        </div>

        {/* Répartition par catégorie : liste chiffrée, sans graphique */}
        <div style={cardStyle}>
          <div style={cardTitle}>Répartition par catégorie</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {REPARTITION_CAT.map(c => (
              <div key={c.label}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontSize: 11.5, color: t.muted, whiteSpace: "nowrap" }}>
                    <strong style={{ fontSize: 13, color: t.text, fontWeight: 700 }}>{fmt(c.montant)}</strong> GNF · {c.pct}%
                  </span>
                </div>
                <div style={{ height: 6, background: t.border, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${c.pct}%`, background: t.blue, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: `1px solid ${t.border}`, marginTop: 14, paddingTop: 10 }}>
            <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>Total</span>
            <strong style={{ fontSize: 15, color: t.text }}>{fmt(REPARTITION_TOTAL)} <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>GNF</span></strong>
          </div>
        </div>
      </div>

      {/* ── Alerts + Activity ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 14, marginBottom: 20, alignItems: "start" }}>
        {/* Alerts */}
        <div style={cardStyle}>
          <div style={cardTitle}><i className="ti ti-bell-ringing" style={{ color: t.red, fontSize: 16 }}></i> Alertes budgétaires</div>
          {ALERTS.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < ALERTS.length - 1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.level === "red" ? t.red : t.amber, marginTop: 5, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{a.title}</div>
                <div style={{ fontSize: 11.5, color: t.muted, marginTop: 2 }}>{a.msg} — {a.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div style={cardStyle}>
          <div style={cardTitle}><i className="ti ti-bolt" style={{ color: t.amber, fontSize: 16 }}></i> Activités récentes</div>
          {ACTIVITIES.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < ACTIVITIES.length - 1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: actBg[a.type], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {actIcon[a.type]}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{a.label}</div>
                <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>{a.desc}</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{a.time} · {a.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px", minWidth: 0 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.muted, fontSize: 15 }}></i>
          <input
            type="text" placeholder="Rechercher une dépense..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ ...selStyle, width: "100%", paddingLeft: 36, boxSizing: "border-box", cursor: "text" }}
          />
        </div>
        <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }} style={selStyle}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStat} onChange={e => { setFilterStat(e.target.value); setPage(1); }} style={selStyle}>
          <option value="">Tous statuts</option>
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", border: `1px solid ${t.border}`, borderRadius: t.radius, background: t.surface, fontSize: 12.5, fontWeight: 600, fontFamily: t.font, cursor: "pointer", color: t.sub, boxShadow: t.shadow }}>
          <i className="ti ti-download" style={{ fontSize: 15 }} /> Exporter
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, boxShadow: t.shadow, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 620 }}>
            <colgroup>
              <col style={{ width: 150 }} /><col style={{ width: 130 }} /><col /><col style={{ width: 130 }} /><col style={{ width: 90 }} /><col style={{ width: 100 }} /><col style={{ width: 90 }} /><col style={{ width: 140 }} /><col style={{ width: 34 }} />
            </colgroup>
            <thead>
              <tr style={{ background: t.bg }}>
                {["Référence", "Catégorie", "Description", "Montant", "Date", "Statut", "Responsable", "Actions", ""].map(h => (
                  <th key={h} style={{ padding: "12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: t.muted, textTransform: "uppercase", letterSpacing: ".4px", borderBottom: `1px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((d) => (
                <tr key={d.id}
                  onClick={() => setViewItem(d)}
                  style={{ borderBottom: `1px solid ${t.border}`, cursor: "pointer", transition: "background .12s" }}
                  onMouseEnter={el => el.currentTarget.style.background = t.bg}
                  onMouseLeave={el => el.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "11px 12px", fontSize: 11.5, color: t.muted, fontWeight: 600 }}>{d.id}</td>
                  <td style={{ padding: "11px 12px" }}>
                    <Badge label={d.cat} style={CAT_COLORS[d.cat] || { bg: NEUTRAL, color: t.sub }} />
                  </td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: t.text }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.desc}</div>
                    {hasFacture(d)
                      ? <span style={{ fontSize: 10, fontWeight: 600, color: t.blue, background: t.blueSoft, padding: "2px 7px", borderRadius: 20, display: "inline-block", marginTop: 4 }}>Justificatif</span>
                      : <span style={{ fontSize: 10, fontWeight: 600, color: t.sub, background: t.bg, border: `1px solid ${t.border}`, padding: "2px 7px", borderRadius: 20, display: "inline-block", marginTop: 4 }}>Sans justificatif</span>}
                  </td>
                  <td style={{ padding: "11px 12px", fontSize: 13, fontWeight: 700, color: t.red }}>{fmt(d.montant)} GNF</td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: t.sub }}>{d.date}</td>
                  <td style={{ padding: "11px 12px" }}>
                    <Badge label={d.statut} style={STAT_COLORS[d.statut] || { bg: NEUTRAL, color: t.sub }} />
                  </td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: t.sub }}>{d.resp}</td>
                  <td style={{ padding: "11px 12px" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 6 }}>
                      <button title="Voir la facture" onClick={e => { e.stopPropagation(); setFactureItem(d); }} style={{ background: t.blueSoft, color: t.blue, border: `1px solid ${t.blueMid}`, borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, fontFamily: t.font, cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <i className="ti ti-file-invoice" style={{ fontSize: 14 }} />
                      </button>
                      <button title="Modifier" onClick={e => { e.stopPropagation(); setEditItem(d); setShowModal(true); }} style={{ background: t.surface, color: t.sub, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, fontFamily: t.font, cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center" }}>
                        <i className="ti ti-pencil" style={{ fontSize: 14 }} />
                      </button>
                      <button title="Supprimer" onClick={e => { e.stopPropagation(); setConfirmDelDep(d); }} style={{ background: t.redSoft, color: t.red, border: "none", borderRadius: t.radius, padding: "5px 8px", fontSize: 12.5, fontWeight: 600, fontFamily: t.font, cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center" }}>
                        <i className="ti ti-trash" style={{ fontSize: 14 }} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: "11px 10px" }}>
                    <i className="ti ti-chevron-right" style={{ fontSize: 15, color: t.muted }} />
                  </td>
                </tr>
              ))}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 48, textAlign: "center", color: t.muted, fontSize: 13 }}>
                    <i className="ti ti-search" style={{ fontSize: 28, display: "block", marginBottom: 10, color: t.border }} />
                    Aucune dépense trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination reste en dehors, donc fixe */}

      </div>

      <AnimatePresence mode="wait">
        {showModal && <Modal key="expense-modal" onClose={() => { setShowModal(false); setEditItem(null); }} onSave={handleSave} nextId={nextId} initialData={editItem} />}
      </AnimatePresence>

      {factureItem && (
        <FactureGeneree
          item={factureItem}
          onClose={() => setFactureItem(null)}
          onSavePdf={(d) => { downloadFacturePdf(d); showToast("Facture enregistrée", "success", `${d.id}.pdf téléchargé.`); }}
          onPrint={printFacture}
        />
      )}
      {previewFacture && (
        <FacturePreview item={previewFacture} onClose={() => setPreviewFacture(null)} />
      )}

      <ConfirmModal
        isOpen={!!confirmDelDep}
        title="Supprimer la dépense"
        message={confirmDelDep ? `Voulez-vous vraiment supprimer la dépense "${confirmDelDep.desc}" ? Cette action est irréversible.` : ""}
        onConfirm={() => { handleDelete(confirmDelDep.id); setConfirmDelDep(null); }}
        onCancel={() => setConfirmDelDep(null)}
      />
    </div>
  );
}
