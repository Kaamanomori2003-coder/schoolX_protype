import { useState } from "react";

const t = {
  bg:"#f8faff", surface:"#ffffff", border:"#e8edf5",
  blue:"#2563eb", blueDark:"#1a3ed4", blueDeep:"#0f2490",
  blueSoft:"#eff6ff", blueMid:"#dbeafe",
  text:"#0f172a", sub:"#64748b", muted:"#94a3b8",
  green:"#059669", red:"#dc2626", redSoft:"#fef2f2",
  radius:"12px", radiusLg:"20px",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

export default function Login({ onLogin, onRegister }) {
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [remember,   setRemember]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [focusField, setFocusField] = useState(null);

  const handleLogin = () => {
    setError("");
    if (!email.trim())    { setError("Veuillez saisir votre adresse email."); return; }
    if (!password.trim()) { setError("Veuillez saisir votre mot de passe."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, nom:"Administrateur", role:"Directeur" });
    }, 1600);
  };

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email:"demo@schoolx.gn", nom:"Directeur Démo", role:"Directeur" });
    }, 900);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:t.font, background:t.bg }}>
      <style>{`
        @keyframes spin    { to { transform:rotate(360deg) } }
        @keyframes fadeUp  { from { opacity:0;transform:translateY(18px) } to { opacity:1;transform:translateY(0) } }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse   { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        .auth-left { display:flex }
        @media(max-width:860px){ .auth-left{display:none!important} .auth-right{padding:28px 20px!important} }
      `}</style>

      {/* ══════════════════════════════════════
          GAUCHE — BRANDING IMMERSIF
      ══════════════════════════════════════ */}
      <div className="auth-left" style={{
        width:480, flexShrink:0, flexDirection:"column",
        background:`linear-gradient(160deg,#1a3ed4 0%,#2563eb 40%,#1230a8 100%)`,
        padding:"44px 48px", position:"relative", overflow:"hidden",
        justifyContent:"space-between",
      }}>
        {/* Formes abstraites */}
        <div style={{ position:"absolute", top:-100, right:-100, width:380, height:380, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-80, left:-60, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"30%", right:"10%", width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"55%", left:"5%", width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:13, position:"relative", zIndex:1 }}>
          <div style={{ width:44, height:44, borderRadius:13, background:"rgba(255,255,255,0.18)", border:"1.5px solid rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)" }}>
            <i className="ti ti-school" style={{ fontSize:22, color:"#fff" }} />
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff", letterSpacing:"-0.4px" }}>SchoolX</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", fontWeight:600, letterSpacing:".8px", textTransform:"uppercase" }}>Plateforme Éducative</div>
          </div>
        </div>

        {/* Centre — Illustration + Slogan */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", position:"relative", zIndex:1, padding:"40px 0" }}>

          {/* Illustration SVG moderne */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:36, animation:"float 5s ease-in-out infinite" }}>
            <div style={{ width:180, height:180, borderRadius:40, background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.18)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 24px 64px rgba(0,0,0,0.25)" }}>
              {/* Mini dashboard illustratif */}
              <div style={{ padding:20, width:"100%", boxSizing:"border-box" }}>
                {/* Barre haut */}
                <div style={{ display:"flex", gap:5, marginBottom:14 }}>
                  {["rgba(255,255,255,0.8)","rgba(255,255,255,0.4)","rgba(255,255,255,0.25)"].map((c,i)=>(
                    <div key={i} style={{ height:7, borderRadius:4, background:c, flex:i===0?2:1 }} />
                  ))}
                </div>
                {/* Stats mini */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
                  {[
                    { c:"rgba(255,255,255,0.85)", h:28 },
                    { c:"rgba(255,255,255,0.5)",  h:28 },
                    { c:"rgba(255,255,255,0.4)",  h:28 },
                    { c:"rgba(255,255,255,0.65)", h:28 },
                  ].map((b,i)=>(
                    <div key={i} style={{ height:b.h, borderRadius:6, background:b.c }} />
                  ))}
                </div>
                {/* Graphe mini */}
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:36 }}>
                  {[60,80,45,90,70,100,55].map((h,i)=>(
                    <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:"3px 3px 0 0", background:`rgba(255,255,255,${0.3+i*0.08})` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:26, fontWeight:800, color:"#fff", lineHeight:1.25, marginBottom:12, letterSpacing:"-0.5px" }}>
              Construisez l'école<br />numérique de demain.
            </div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.7 }}>
              Une plateforme complète pour gérer votre établissement avec efficacité.
            </div>
          </div>

          {/* Features */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { icon:"ti-users",         label:"Gestion intelligente des élèves & professeurs" },
              { icon:"ti-credit-card",   label:"Paiements & comptabilité intégrés"             },
              { icon:"ti-calendar-check",label:"Suivi des présences en temps réel"              },
              { icon:"ti-file-text",     label:"Bulletins numériques automatisés"               },
              { icon:"ti-message-circle",label:"Communication école-parents fluide"             },
            ].map((f,i)=>(
              <div key={f.label} style={{ display:"flex", alignItems:"center", gap:12, animation:`slideIn .4s ease ${i*80}ms both` }}>
                <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,0.14)", border:"1px solid rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={`ti ${f.icon}`} style={{ fontSize:15, color:"rgba(255,255,255,0.9)" }} />
                </div>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.75)", fontWeight:500 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.28)", textAlign:"center", position:"relative", zIndex:1 }}>
          © 2025 SchoolX · Tous droits réservés
        </div>
      </div>

      {/* ══════════════════════════════════════
          DROITE — FORMULAIRE
      ══════════════════════════════════════ */}
      <div className="auth-right" style={{
        flex:1, display:"flex", alignItems:"center",
        justifyContent:"center", padding:"40px 32px",
        background:t.surface,
      }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp .45s ease" }}>

          {/* En-tête */}
          <div style={{ marginBottom:30 }}>
            <h1 style={{ fontSize:26, fontWeight:800, color:t.text, margin:"0 0 8px", letterSpacing:"-0.5px" }}>
              Connexion
            </h1>
            <p style={{ fontSize:14, color:t.muted, margin:0, lineHeight:1.6 }}>
              Connectez-vous à votre établissement SchoolX.
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:t.radius, padding:"11px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:9, fontSize:13, color:t.red, animation:"fadeUp .2s ease" }}>
              <i className="ti ti-alert-circle" style={{ fontSize:16, flexShrink:0 }} />
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:t.sub, display:"block", marginBottom:6 }}>Email ou téléphone</label>
            <div style={{
              display:"flex", alignItems:"center",
              border:`1.5px solid ${focusField==="email" ? t.blue : t.border}`,
              borderRadius:t.radius, overflow:"hidden",
              boxShadow:focusField==="email"?`0 0 0 3px rgba(37,99,235,0.1)`:"none",
              transition:"all .2s",
            }}>
              <div style={{ padding:"0 13px" }}>
                <i className="ti ti-mail" style={{ fontSize:17, color:focusField==="email"?t.blue:t.muted, transition:"color .2s" }} />
              </div>
              <input type="email" placeholder="directeur@ecole.gn" value={email} onChange={e=>setEmail(e.target.value)}
                onKeyDown={handleKey} onFocus={()=>setFocusField("email")} onBlur={()=>setFocusField(null)}
                style={{ flex:1, padding:"12px 0", border:"none", outline:"none", fontSize:13, fontFamily:t.font, color:t.text, background:"transparent" }}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom:10 }}>
            <label style={{ fontSize:12, fontWeight:600, color:t.sub, display:"block", marginBottom:6 }}>Mot de passe</label>
            <div style={{
              display:"flex", alignItems:"center",
              border:`1.5px solid ${focusField==="pass" ? t.blue : t.border}`,
              borderRadius:t.radius, overflow:"hidden",
              boxShadow:focusField==="pass"?`0 0 0 3px rgba(37,99,235,0.1)`:"none",
              transition:"all .2s",
            }}>
              <div style={{ padding:"0 13px" }}>
                <i className="ti ti-lock" style={{ fontSize:17, color:focusField==="pass"?t.blue:t.muted, transition:"color .2s" }} />
              </div>
              <input type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
                onKeyDown={handleKey} onFocus={()=>setFocusField("pass")} onBlur={()=>setFocusField(null)}
                style={{ flex:1, padding:"12px 0", border:"none", outline:"none", fontSize:13, fontFamily:t.font, color:t.text, background:"transparent" }}
              />
              <button onClick={()=>setShowPass(!showPass)} style={{ padding:"0 14px", background:"none", border:"none", cursor:"pointer", color:t.muted, display:"flex", alignItems:"center" }}>
                <i className={`ti ${showPass?"ti-eye-off":"ti-eye"}`} style={{ fontSize:17 }} />
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={()=>setRemember(!remember)}>
              <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${remember?t.blue:t.border}`, background:remember?t.blue:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s" }}>
                {remember && <i className="ti ti-check" style={{ fontSize:11, color:"#fff" }} />}
              </div>
              <span style={{ fontSize:13, color:t.sub }}>Se souvenir de moi</span>
            </label>
            <span style={{ fontSize:13, color:t.blue, fontWeight:600, cursor:"pointer" }}>
              Mot de passe oublié ?
            </span>
          </div>

          {/* Bouton connexion */}
          <button onClick={handleLogin} disabled={loading} style={{
            width:"100%", padding:"14px",
            background:loading?"#93c5fd":`linear-gradient(135deg,${t.blue},${t.blueDark})`,
            color:"#fff", border:"none", borderRadius:t.radius,
            fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer",
            fontFamily:t.font, display:"flex", alignItems:"center",
            justifyContent:"center", gap:9, marginBottom:18,
            boxShadow:"0 4px 18px rgba(37,99,235,0.35)",
            transition:"all .2s",
          }}
            onMouseEnter={e=>{ if(!loading){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(37,99,235,0.45)";} }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 18px rgba(37,99,235,0.35)"; }}
          >
            {loading
              ? <><div style={{ width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .65s linear infinite" }} />Connexion en cours…</>
              : <><i className="ti ti-login" style={{ fontSize:16 }} />Se connecter</>
            }
          </button>

          {/* Accès démo */}
          <button onClick={handleDemo} style={{
            width:"100%", padding:"12px",
            background:t.bg, color:t.sub,
            border:`1.5px solid ${t.border}`, borderRadius:t.radius,
            fontSize:13, fontWeight:600, cursor:"pointer",
            fontFamily:t.font, display:"flex", alignItems:"center",
            justifyContent:"center", gap:9, marginBottom:24,
            transition:"all .2s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=t.blue; e.currentTarget.style.color=t.blue; e.currentTarget.style.background=t.blueSoft; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=t.border; e.currentTarget.style.color=t.sub; e.currentTarget.style.background=t.bg; }}
          >
            <i className="ti ti-bolt" style={{ fontSize:15 }} /> Accès démo rapide
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:t.border }} />
            <span style={{ fontSize:12, color:t.muted }}>Vous n'avez pas encore d'établissement ?</span>
            <div style={{ flex:1, height:1, background:t.border }} />
          </div>

          {/* Bouton créer école */}
          <button onClick={onRegister} style={{
            width:"100%", padding:"13px",
            background:"transparent",
            color:t.blue,
            border:`2px solid ${t.blue}`, borderRadius:t.radius,
            fontSize:14, fontWeight:700, cursor:"pointer",
            fontFamily:t.font, display:"flex", alignItems:"center",
            justifyContent:"center", gap:9,
            transition:"all .2s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background=t.blue; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(37,99,235,0.3)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=t.blue; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
          >
            <i className="ti ti-building-plus" style={{ fontSize:16 }} /> Créer une école
          </button>

          {/* Badges */}
          <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:28, paddingTop:20, borderTop:`1px solid ${t.border}` }}>
            {[
              { icon:"ti-shield-lock",  label:"SSL"              },
              { icon:"ti-lock",         label:"Sécurisé"         },
              { icon:"ti-certificate",  label:"Certifié"         },
            ].map(b=>(
              <div key={b.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <i className={`ti ${b.icon}`} style={{ fontSize:16, color:t.muted }} />
                <span style={{ fontSize:10, color:t.muted, fontWeight:600 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
