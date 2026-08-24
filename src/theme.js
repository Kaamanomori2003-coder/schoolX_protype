export const t = {
  bg:"#f7f8fa", surface:"#ffffff", border:"#eaecf0",
  blue:"#2563eb", blueSoft:"#eff6ff", blueMid:"#dbeafe",
  text:"#111827", sub:"#6b7280", muted:"#9ca3af",
  green:"#059669", greenSoft:"#f0fdf4",
  red:"#dc2626", redSoft:"#fef2f2",
  amber:"#d97706", amberSoft:"#fffbeb",
  purple:"#7c3aed", purpleSoft:"#f5f3ff",
  radius:"10px", radiusLg:"14px",
  shadow:"0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",

  // Tons intermédiaires (bordures de badges) et ombre survolée déjà utilisés
  // par les pages existantes : sans ces clés, les valeurs deviennent undefined
  // silencieusement (pas d'erreur de build, mais perte visuelle).
  greenMid:"#bbf7d0", amberMid:"#fde68a", redMid:"#fecaca", purpleMid:"#ddd6fe",
  shadowMd:"0 4px 12px rgba(0,0,0,0.07)",

  // Rouge foncé réservé au statut « Exclu » (exclusion définitive), pour le
  // distinguer du rouge « Inactif ».
  redDark:"#991b1b",
};

export const chartColors = [t.blue, t.purple, t.green, t.red, t.amber];
