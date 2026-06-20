import { useEffect, useRef, useState } from "react";

/* ── DATA ─────────────────────────────────────────────────────── */
const stats = [
  {
    label: "Total Élèves", value: "1 243", icon: "ti-users",
    gradient: "linear-gradient(135deg,#1d4ed8 0%,#6366f1 100%)",
    glow: "rgba(99,102,241,0.35)", trend: "+12", trendLabel: "ce mois", up: true,
    sparkline: [80,85,78,90,88,95,100],
  },
  {
    label: "Professeurs", value: "87", icon: "ti-school",
    gradient: "linear-gradient(135deg,#0891b2 0%,#06b6d4 100%)",
    glow: "rgba(6,182,212,0.35)", trend: "+2", trendLabel: "nouveaux", up: true,
    sparkline: [60,65,62,70,68,75,80],
  },
  {
    label: "Paiements reçus", value: "4.85M", sub: "GNF", icon: "ti-credit-card",
    gradient: "linear-gradient(135deg,#d97706 0%,#f59e0b 100%)",
    glow: "rgba(245,158,11,0.35)", trend: "+8%", trendLabel: "vs avant", up: true,
    sparkline: [55,70,60,80,75,90,100],
  },
  {
    label: "Dépenses", value: "1.2M", sub: "GNF", icon: "ti-trending-down",
    gradient: "linear-gradient(135deg,#dc2626 0%,#f87171 100%)",
    glow: "rgba(248,113,113,0.35)", trend: "-3%", trendLabel: "vs avant", up: false,
    sparkline: [90,85,88,80,82,75,70],
  },
];

const paiements = [
  { mois: "Jan", v: 3200000 },
  { mois: "Fév", v: 4100000 },
  { mois: "Mar", v: 3800000 },
  { mois: "Avr", v: 4600000 },
  { mois: "Mai", v: 4850000 },
];

const students = [
  { name: "Aminata Diallo",   classe: "Terminale A", status: "Payé",       initials: "AD", color: "#dbeafe", tc: "#1e40af", avg: 15.8 },
  { name: "Mamadou Bah",      classe: "3ème B",      status: "En attente", initials: "MB", color: "#dcfce7", tc: "#166534", avg: 11.2 },
  { name: "Fatoumata Camara", classe: "Seconde C",   status: "Payé",       initials: "FC", color: "#fef9c3", tc: "#854d0e", avg: 14.6 },
  { name: "Ibrahima Sow",     classe: "Terminale D", status: "Impayé",     initials: "IS", color: "#fee2e2", tc: "#991b1b", avg: 8.3  },
  { name: "Mariama Kouyaté",  classe: "1ère S",      status: "Payé",       initials: "MK", color: "#f3e8ff", tc: "#6b21a8", avg: 17.2 },
];

const alertes = [
  { t: "12 élèves avec frais impayés",    icon: "ti-alert-circle",    c: "#ef4444", bg: "rgba(239,68,68,0.08)",   action: "Voir liste" },
  { t: "3 professeurs absents",           icon: "ti-user-off",        c: "#f59e0b", bg: "rgba(245,158,11,0.08)",  action: "Gérer"      },
  { t: "Réunion parents — Vendredi 16h",  icon: "ti-calendar-event",  c: "#6366f1", bg: "rgba(99,102,241,0.08)", action: "Détails"    },
  { t: "Bulletins T2 prêts à générer",    icon: "ti-certificate",     c: "#10b981", bg: "rgba(16,185,129,0.08)",  action: "Générer"    },
];

const statusStyle = {
  "Payé":       { bg: "rgba(16,185,129,0.12)", color: "#059669" },
  "En attente": { bg: "rgba(245,158,11,0.12)", color: "#d97706" },
  "Impayé":     { bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
};

/* ── SPARKLINE SVG ──────────────────────────────────────────────── */
function Sparkline({ data, color }) {
  const w = 80, h = 32;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const area = `M0,${h} L${pts.split(" ").map(p => p).join(" L")} L${w},${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── BAR CHART ─────────────────────────────────────────────────── */
function BarChart() {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    const init = () => {
      if (!window.Chart || !ref.current) return;
      if (inst.current) { inst.current.destroy(); inst.current = null; }
      inst.current = new window.Chart(ref.current, {
        type: "bar",
        data: {
          labels: paiements.map(p => p.mois),
          datasets: [{
            data: paiements.map(p => p.v),
            backgroundColor: paiements.map((_, i) =>
              i === paiements.length - 1
                ? "rgba(99,102,241,0.95)"
                : "rgba(99,102,241,0.18)"
            ),
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: "rgba(99,102,241,0.85)",
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0f172a",
              titleColor: "#94a3b8",
              bodyColor: "#f8fafc",
              padding: 12,
              cornerRadius: 10,
              callbacks: { label: c => "  " + (c.raw / 1000000).toFixed(2) + "M GNF" },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { color: "#64748b", font: { size: 11, family: "'Outfit',sans-serif", weight: "500" } },
            },
            y: {
              grid: { color: "rgba(148,163,184,0.08)", drawTicks: false },
              border: { display: false },
              ticks: {
                color: "#64748b",
                padding: 10,
                font: { size: 10, family: "'Outfit',sans-serif" },
                callback: v => (v / 1000000).toFixed(1) + "M",
              },
            },
          },
        },
      });
    };
    if (window.Chart) { init(); }
    else {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => { if (inst.current) { inst.current.destroy(); inst.current = null; } };
  }, []);

  return <div style={{ position: "relative", width: "100%", height: 200 }}><canvas ref={ref} /></div>;
}

/* ── DONUT CHART ──────────────────────────────────────────────── */
function DonutChart() {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    const init = () => {
      if (!window.Chart || !ref.current) return;
      if (inst.current) { inst.current.destroy(); inst.current = null; }
      inst.current = new window.Chart(ref.current, {
        type: "doughnut",
        data: {
          labels: ["Payé", "En attente", "Impayé"],
          datasets: [{
            data: [68, 22, 10],
            backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
            borderWidth: 0,
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "72%",
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0f172a",
              titleColor: "#94a3b8",
              bodyColor: "#f8fafc",
              padding: 12,
              cornerRadius: 10,
              callbacks: { label: c => "  " + c.label + " : " + c.raw + "%" },
            },
          },
        },
      });
    };
    if (window.Chart) { init(); }
    else {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => { if (inst.current) { inst.current.destroy(); inst.current = null; } };
  }, []);

  return <div style={{ position: "relative", width: "100%", height: 160 }}><canvas ref={ref} /></div>;
}

/* ── DASHBOARD ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", color: "#0f172a" }}>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Année scolaire 2025/2026 · En direct</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
            Bonjour, Administrateur 👋
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            Voici ce qui se passe dans votre établissement aujourd'hui.
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg,#1d4ed8,#6366f1)",
          color: "#fff", border: "none", borderRadius: 11,
          padding: "11px 20px", fontSize: 13, fontWeight: 600,
          cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          fontFamily: "'Outfit',sans-serif",
        }}>
          <i className="ti ti-plus" style={{ fontSize: 15 }} />
          Ajouter un élève
        </button>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={s.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              borderRadius: 18, overflow: "hidden", cursor: "default",
              background: hovered === i ? "#fff" : "#fff",
              border: `1px solid ${hovered === i ? "rgba(99,102,241,0.2)" : "#f1f5f9"}`,
              boxShadow: hovered === i ? `0 20px 50px ${s.glow}` : "0 2px 8px rgba(0,0,0,0.04)",
              transform: hovered === i ? "translateY(-5px)" : "translateY(0)",
              transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
            }}
          >
            {/* Top gradient band */}
            <div style={{ background: s.gradient, padding: "16px 18px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`ti ${s.icon}`} style={{ fontSize: 19, color: "white" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1 }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{s.sub}</div>}
                </div>
              </div>
            </div>
            {/* Bottom info */}
            <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".5px" }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.up ? "#059669" : "#dc2626" }}>{s.trend}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{s.trendLabel}</span>
                </div>
              </div>
              <Sparkline data={s.sparkline} color={s.up ? "#10b981" : "#ef4444"} />
            </div>
          </div>
        ))}
      </div>

      {/* ── ROW 2 : BARCHART + DONUT + STUDENTS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Bar chart */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Paiements mensuels</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>5 derniers mois · GNF</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", borderRadius: 8, padding: "5px 10px" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: "linear-gradient(135deg,#1d4ed8,#6366f1)" }} />
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>Paiements</span>
            </div>
          </div>
          <BarChart />
        </div>

        {/* Donut */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Statut paiements</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>1 243 élèves</div>
          <DonutChart />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            {[
              { label: "Payé",       pct: "68%", color: "#10b981" },
              { label: "En attente", pct: "22%", color: "#f59e0b" },
              { label: "Impayé",     pct: "10%", color: "#ef4444" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 12, color: "#64748b" }}>{l.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{l.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Students */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Dernières inscriptions</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Élèves récemment ajoutés</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {students.map((s, i) => (
              <div key={s.name}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 8px", borderRadius: 10,
                  borderBottom: i < students.length - 1 ? "1px solid #f8fafc" : "none",
                  transition: "background .15s", cursor: "default",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.color, color: s.tc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                  {s.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{s.classe}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 600, background: statusStyle[s.status].bg, color: statusStyle[s.status].color, display: "block", marginBottom: 2 }}>{s.status}</span>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{s.avg}/20</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ALERTES ── */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Alertes & rappels</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Actions requises aujourd'hui</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(239,68,68,0.1)", color: "#dc2626", padding: "4px 10px", borderRadius: 20 }}>4 nouvelles</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {alertes.map(a => (
            <div key={a.t}
              style={{
                display: "flex", alignItems: "center", gap: 13,
                background: a.bg, borderRadius: 12,
                padding: "13px 16px",
                transition: "transform .2s, box-shadow .2s", cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <i className={`ti ${a.icon}`} style={{ fontSize: 18, color: a.c }} />
              </div>
              <span style={{ fontSize: 13, color: "#1e293b", flex: 1, lineHeight: 1.4, fontWeight: 500 }}>{a.t}</span>
              <button style={{
                fontSize: 11, fontWeight: 700, color: a.c,
                background: "none", border: "none", cursor: "pointer",
                flexShrink: 0, padding: 0, fontFamily: "'Outfit',sans-serif",
                whiteSpace: "nowrap",
              }}>{a.action} →</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
