import { useState } from "react";

const t = {
  bg:"#f8faff", surface:"#ffffff", border:"#e8edf5",
  blue:"#2563eb", blueDark:"#1a3ed4", blueDeep:"#0f2490",
  blueSoft:"#eff6ff", blueMid:"#dbeafe",
  text:"#0f172a", sub:"#64748b", muted:"#94a3b8",
  green:"#059669", greenSoft:"#f0fdf4", greenMid:"#bbf7d0",
  amber:"#d97706", amberSoft:"#fffbeb",
  red:"#dc2626", redSoft:"#fef2f2",
  purple:"#7c3aed", purpleSoft:"#f5f3ff",
  radius:"12px", radiusLg:"20px",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

const PLANS = [
  {
    id:"gratuit", nom:"Gratuit", prix:0,
    desc:"Pour démarrer et découvrir",
    features:["Jusqu'à 100 élèves","5 professeurs","Bulletins basiques","Support email"],
    c:t.sub, bg:"#f8fafc",
  },
  {
    id:"standard", nom:"Standard", prix:199000,
    desc:"Pour les écoles en croissance",
    features:["Jusqu'à 500 élèves","50 professeurs","Paiements intégrés","Bulletins numériques","Notifications","Statistiques","Support chat"],
    c:t.blue, bg:t.blueSoft, popular:true,
  },
  {
    id:"premium", nom:"Premium", prix:499000,
    desc:"Pour les grandes écoles",
    features:["Élèves illimités","150 professeurs","Tout Standard +","SMS & Email","Stats avancées","Documents","API & intégrations","Support 24/7"],
    c:t.purple, bg:t.purpleSoft,
  },
];

const TYPES_ECOLE = ["Lycée","Collège","École primaire","Institut","Université","École privée","École publique","Centre de formation"];

/* ── FORCE MOT DE PASSE ── */
const getPasswordStrength = (pwd) => {
  let score = 0;
  const checks = {
    length:   pwd.length >= 8,
    upper:    /[A-Z]/.test(pwd),
    number:   /[0-9]/.test(pwd),
    special:  /[^A-Za-z0-9]/.test(pwd),
  };
  Object.values(checks).forEach(v => { if(v) score++; });
  return { score, checks };
};

const strengthInfo = (score) => [
  { label:"",         color:t.border   },
  { label:"Faible",   color:t.red      },
  { label:"Moyen",    color:t.amber    },
  { label:"Bien",     color:"#f59e0b"  },
  { label:"Fort",     color:t.green    },
][score] || { label:"", color:t.border };

/* ── FIELD ── */
function Field({ label, icon, type="text", value, onChange, placeholder, error, name, onFocusChange, focusField, suffix }) {
  const isFocus = focusField === name;
  return (
    <div>
      {label && <label style={{ fontSize:12, fontWeight:600, color:t.sub, display:"block", marginBottom:6 }}>{label}</label>}
      <div style={{
        display:"flex", alignItems:"center",
        border:`1.5px solid ${error?t.red:isFocus?t.blue:t.border}`,
        borderRadius:t.radius, overflow:"hidden",
        boxShadow:error?`0 0 0 3px rgba(220,38,38,0.08)`:isFocus?`0 0 0 3px rgba(37,99,235,0.1)`:"none",
        transition:"all .2s", background:t.surface,
      }}>
        {icon && (
          <div style={{ padding:"0 13px" }}>
            <i className={`ti ${icon}`} style={{ fontSize:16, color:isFocus?t.blue:t.muted, transition:"color .2s" }} />
          </div>
        )}
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={e=>onChange(e.target.value)}
          onFocus={()=>onFocusChange(name)} onBlur={()=>onFocusChange(null)}
          style={{ flex:1, padding:"11px 0", border:"none", outline:"none", fontSize:13, fontFamily:t.font, color:t.text, background:"transparent", paddingLeft:icon?"0":"13px" }}
        />
        {suffix}
      </div>
      {error && (
        <div style={{ fontSize:11, color:t.red, marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
          <i className="ti ti-alert-circle" style={{ fontSize:12 }} />{error}
        </div>
      )}
    </div>
  );
}

/* ── SELECT ── */
function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      {label && <label style={{ fontSize:12, fontWeight:600, color:t.sub, display:"block", marginBottom:6 }}>{label}</label>}
      <div style={{ position:"relative" }}>
        <select value={value} onChange={e=>onChange(e.target.value)} style={{
          width:"100%", padding:"11px 36px 11px 13px",
          border:`1.5px solid ${t.border}`, borderRadius:t.radius,
          fontSize:13, fontFamily:t.font, color:t.text,
          background:t.surface, outline:"none", appearance:"none", cursor:"pointer",
        }}>
          {options.map(o=><option key={o}>{o}</option>)}
        </select>
        <i className="ti ti-chevron-down" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:15, color:t.muted, pointerEvents:"none" }} />
      </div>
    </div>
  );
}

/* ── STEPS INDICATOR ── */
function StepsBar({ step, total }) {
  const labels = ["Établissement","Directeur","Abonnement","Confirmation"];
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
      {Array.from({length:total}).map((_, i) => {
        const num   = i + 1;
        const done  = step > num;
        const active= step === num;
        return (
          <div key={num} style={{ display:"flex", alignItems:"center", flex:i<total-1?1:"auto" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <div style={{
                width:36, height:36, borderRadius:"50%",
                background:done?t.green:active?t.blue:"transparent",
                border:`2px solid ${done?t.green:active?t.blue:t.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, fontWeight:700,
                color:done||active?"#fff":t.muted,
                boxShadow:active?`0 4px 12px rgba(37,99,235,0.35)`:"none",
                transition:"all .3s ease",
                flexShrink:0,
              }}>
                {done ? <i className="ti ti-check" style={{ fontSize:15 }} /> : num}
              </div>
              <span style={{ fontSize:10, fontWeight:active?700:500, color:done?t.green:active?t.blue:t.muted, whiteSpace:"nowrap", transition:"all .25s" }}>
                {labels[i]}
              </span>
            </div>
            {i < total-1 && (
              <div style={{ flex:1, height:2, background:done?t.green:t.border, margin:"0 8px", marginBottom:20, transition:"background .3s", borderRadius:99 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── PAGE PRINCIPALE ── */
export default function Register({ onSuccess, onBack }) {
  const [step,    setStep]   = useState(1);
  const [done,    setDone]   = useState(false);
  const [loading, setLoading]= useState(false);
  const [focus,   setFocus]  = useState(null);
  const [errors,  setErrors] = useState({});

  const [ecole, setEcole] = useState({
    nom:"", type:"Lycée", statut:"Privé", pays:"Guinée",
    ville:"", adresse:"", logo:null, logoPreview:null,
  });

  const [compte, setCompte] = useState({
    prenom:"", nom:"", telephone:"", email:"", password:"", confirm:"",
  });

  const [planId, setPlanId] = useState("standard");

  /* ── Validation ── */
  const validate1 = () => {
    const e = {};
    if (!ecole.nom.trim())  e.nom  = "Nom de l'établissement requis";
    if (!ecole.ville.trim()) e.ville= "Ville requise";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validate2 = () => {
    const e = {};
    if (!compte.prenom.trim())   e.prenom   = "Prénom requis";
    if (!compte.nom.trim())      e.nom      = "Nom requis";
    if (!compte.email.trim())    e.email    = "Email requis";
    if (!compte.telephone.trim())e.telephone= "Téléphone requis";
    if (!compte.password.trim()) e.password = "Mot de passe requis";
    else if (compte.password.length < 8) e.password = "Minimum 8 caractères";
    if (compte.password !== compte.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step===1 && !validate1()) return;
    if (step===2 && !validate2()) return;
    setErrors({});
    setStep(s=>s+1);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(()=>{ setLoading(false); setDone(true); }, 2000);
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEcole(prev=>({...prev, logo:file, logoPreview:url}));
  };

  const pwStrength = getPasswordStrength(compte.password);
  const sInfo      = strengthInfo(pwStrength.score);
  const planActif  = PLANS.find(p=>p.id===planId);

  return (
    <div style={{ minHeight:"100vh", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"28px 20px", fontFamily:t.font }}>
      <style>{`
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        @keyframes check   { from{stroke-dashoffset:50} to{stroke-dashoffset:0} }
      `}</style>

      <div style={{ width:"100%", maxWidth:600, animation:"fadeUp .4s ease" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:11, marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg,${t.blue},${t.blueDark})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ti ti-school" style={{ fontSize:20, color:"#fff" }} />
          </div>
          <span style={{ fontSize:20, fontWeight:800, color:t.text }}>School<span style={{ color:t.muted }}>X</span></span>
        </div>

        {!done ? (
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, boxShadow:"0 8px 32px rgba(0,0,0,0.07)", overflow:"hidden" }}>

            {/* Header */}
            <div style={{ padding:"28px 32px 0" }}>
              <div style={{ fontSize:11, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".6px", marginBottom:4 }}>
                Étape {step} sur 4
              </div>
              <h2 style={{ fontSize:22, fontWeight:800, color:t.text, margin:"0 0 20px", letterSpacing:"-0.4px" }}>
                {{1:"Votre établissement",2:"Votre compte",3:"Choisir un plan",4:"Confirmation"}[step]}
              </h2>
              <StepsBar step={step} total={4} />
            </div>

            <div style={{ padding:"0 32px 28px" }}>

              {/* ════════ STEP 1 ════════ */}
              {step===1 && (
                <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeUp .3s ease" }}>
                  <Field label="Nom de l'établissement *" icon="ti-building-school" value={ecole.nom} onChange={v=>setEcole({...ecole,nom:v})} placeholder="Ex : Lycée Mixte de Ratoma" error={errors.nom} name="e_nom" focusField={focus} onFocusChange={setFocus} />

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <SelectField label="Type" value={ecole.type} onChange={v=>setEcole({...ecole,type:v})} options={TYPES_ECOLE} />
                    <SelectField label="Statut" value={ecole.statut} onChange={v=>setEcole({...ecole,statut:v})} options={["Privé","Public","Semi-public"]} />
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <SelectField label="Pays" value={ecole.pays} onChange={v=>setEcole({...ecole,pays:v})} options={["Guinée","Sénégal","Côte d'Ivoire","Mali","Burkina Faso","Cameroun","Autre"]} />
                    <Field label="Ville *" icon="ti-map-pin" value={ecole.ville} onChange={v=>setEcole({...ecole,ville:v})} placeholder="Ex : Conakry" error={errors.ville} name="e_ville" focusField={focus} onFocusChange={setFocus} />
                  </div>

                  <Field label="Adresse (optionnel)" icon="ti-map" value={ecole.adresse} onChange={v=>setEcole({...ecole,adresse:v})} placeholder="Ex : Quartier Ratoma, face mosquée" name="e_adresse" focusField={focus} onFocusChange={setFocus} />

                  {/* Logo upload */}
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:t.sub, display:"block", marginBottom:8 }}>Logo de l'établissement (optionnel)</label>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      {ecole.logoPreview ? (
                        <div style={{ width:60, height:60, borderRadius:14, overflow:"hidden", border:`2px solid ${t.blueMid}`, flexShrink:0 }}>
                          <img src={ecole.logoPreview} alt="logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                      ) : (
                        <div style={{ width:60, height:60, borderRadius:14, background:t.bg, border:`2px dashed ${t.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <i className="ti ti-building-school" style={{ fontSize:26, color:t.muted }} />
                        </div>
                      )}
                      <label style={{ flex:1, padding:"10px 14px", border:`1.5px dashed ${t.border}`, borderRadius:t.radius, cursor:"pointer", display:"flex", alignItems:"center", gap:8, fontSize:13, color:t.sub, transition:"all .2s" }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=t.blue;e.currentTarget.style.color=t.blue;e.currentTarget.style.background=t.blueSoft;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.sub;e.currentTarget.style.background="transparent";}}
                      >
                        <i className="ti ti-upload" style={{ fontSize:16 }} />
                        {ecole.logoPreview ? "Changer le logo" : "Choisir un fichier"}
                        <input type="file" accept="image/*" onChange={handleLogo} style={{ display:"none" }} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════ STEP 2 ════════ */}
              {step===2 && (
                <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeUp .3s ease" }}>
                  {/* Résumé école */}
                  <div style={{ padding:"11px 14px", background:t.blueSoft, border:`1px solid ${t.blueMid}`, borderRadius:t.radius, display:"flex", alignItems:"center", gap:9, fontSize:13, color:t.blue }}>
                    <i className="ti ti-building-school" style={{ fontSize:16 }} />
                    <span>École : <strong>{ecole.nom}</strong> — {ecole.ville}</span>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <Field label="Prénom *" icon="ti-user" value={compte.prenom} onChange={v=>setCompte({...compte,prenom:v})} placeholder="Mamadou" error={errors.prenom} name="c_prenom" focusField={focus} onFocusChange={setFocus} />
                    <Field label="Nom *" icon="ti-user" value={compte.nom} onChange={v=>setCompte({...compte,nom:v})} placeholder="Diallo" error={errors.nom} name="c_nom" focusField={focus} onFocusChange={setFocus} />
                  </div>

                  <Field label="Email *" icon="ti-mail" type="email" value={compte.email} onChange={v=>setCompte({...compte,email:v})} placeholder="directeur@ecole.gn" error={errors.email} name="c_email" focusField={focus} onFocusChange={setFocus} />
                  <Field label="Téléphone *" icon="ti-phone" value={compte.telephone} onChange={v=>setCompte({...compte,telephone:v})} placeholder="622 00 11 22" error={errors.telephone} name="c_tel" focusField={focus} onFocusChange={setFocus} />

                  {/* Mot de passe + force */}
                  <div>
                    <Field label="Mot de passe *" icon="ti-lock" type="password" value={compte.password} onChange={v=>setCompte({...compte,password:v})} placeholder="Minimum 8 caractères" error={errors.password} name="c_pwd" focusField={focus} onFocusChange={setFocus} />
                    {compte.password && (
                      <div style={{ marginTop:10 }}>
                        {/* Barre force */}
                        <div style={{ display:"flex", gap:4, marginBottom:8 }}>
                          {[1,2,3,4].map(n=>(
                            <div key={n} style={{ flex:1, height:4, borderRadius:99, background:pwStrength.score>=n?sInfo.color:t.border, transition:"background .3s" }} />
                          ))}
                        </div>
                        {sInfo.label && <div style={{ fontSize:11, fontWeight:600, color:sInfo.color, marginBottom:8 }}>{sInfo.label}</div>}
                        {/* Conditions */}
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                          {[
                            { check:pwStrength.checks.length,  label:"8 caractères"         },
                            { check:pwStrength.checks.upper,   label:"Une majuscule"         },
                            { check:pwStrength.checks.number,  label:"Un chiffre"            },
                            { check:pwStrength.checks.special, label:"Un caractère spécial"  },
                          ].map(c=>(
                            <div key={c.label} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:c.check?t.green:t.muted, transition:"color .2s" }}>
                              <i className={`ti ${c.check?"ti-circle-check":"ti-circle"}`} style={{ fontSize:13 }} />
                              {c.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Field label="Confirmer le mot de passe *" icon="ti-lock-check" type="password" value={compte.confirm} onChange={v=>setCompte({...compte,confirm:v})} placeholder="Répétez le mot de passe" error={errors.confirm} name="c_confirm" focusField={focus} onFocusChange={setFocus} />
                </div>
              )}

              {/* ════════ STEP 3 ════════ */}
              {step===3 && (
                <div style={{ animation:"fadeUp .3s ease" }}>
                  <p style={{ fontSize:13, color:t.muted, marginBottom:18 }}>Choisissez le plan adapté à votre établissement. Vous pourrez changer à tout moment.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {PLANS.map(plan=>{
                      const sel = planId===plan.id;
                      return (
                        <div key={plan.id} onClick={()=>setPlanId(plan.id)} style={{
                          border:`2px solid ${sel?plan.c:t.border}`,
                          borderRadius:t.radiusLg, padding:"18px 20px",
                          background:sel?plan.bg:t.surface,
                          cursor:"pointer", transition:"all .2s", position:"relative",
                          boxShadow:sel?`0 4px 20px rgba(37,99,235,0.15)`:"none",
                        }}
                          onMouseEnter={e=>{ if(!sel){e.currentTarget.style.borderColor=plan.c;e.currentTarget.style.background=plan.bg;} }}
                          onMouseLeave={e=>{ if(!sel){e.currentTarget.style.borderColor=t.border;e.currentTarget.style.background=t.surface;} }}
                        >
                          {plan.popular && (
                            <div style={{ position:"absolute", top:-1, right:16, background:t.blue, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:"0 0 8px 8px", letterSpacing:".4px" }}>POPULAIRE</div>
                          )}
                          {sel && (
                            <div style={{ position:"absolute", top:14, right:16, width:22, height:22, borderRadius:"50%", background:plan.c, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <i className="ti ti-check" style={{ fontSize:12, color:"#fff" }} />
                            </div>
                          )}
                          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                            <div>
                              <div style={{ fontSize:15, fontWeight:800, color:t.text }}>{plan.nom}</div>
                              <div style={{ fontSize:12, color:t.muted, marginTop:2 }}>{plan.desc}</div>
                            </div>
                            <div style={{ textAlign:"right" }}>
                              {plan.prix===0
                                ? <span style={{ fontSize:18, fontWeight:800, color:t.green }}>Gratuit</span>
                                : <><span style={{ fontSize:18, fontWeight:800, color:plan.c }}>{plan.prix.toLocaleString()}</span><span style={{ fontSize:11, color:t.muted }}> GNF/mois</span></>
                              }
                            </div>
                          </div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                            {plan.features.map(f=>(
                              <div key={f} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:sel?plan.c:t.sub }}>
                                <i className="ti ti-check" style={{ fontSize:11, color:sel?plan.c:t.green }} />
                                {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ════════ STEP 4 ════════ */}
              {step===4 && (
                <div style={{ animation:"fadeUp .3s ease" }}>
                  <div style={{ background:t.bg, borderRadius:t.radiusLg, border:`1px solid ${t.border}`, overflow:"hidden", marginBottom:20 }}>
                    <div style={{ padding:"11px 16px", background:t.blue, fontSize:11, fontWeight:700, color:"#fff", textTransform:"uppercase", letterSpacing:".5px" }}>
                      Récapitulatif
                    </div>
                    {[
                      { label:"Établissement", val:ecole.nom,                   icon:"ti-building-school" },
                      { label:"Type",          val:`${ecole.type} · ${ecole.statut}`, icon:"ti-tag"       },
                      { label:"Ville",         val:`${ecole.ville}, ${ecole.pays}`,   icon:"ti-map-pin"   },
                      { label:"Directeur",     val:`${compte.prenom} ${compte.nom}`,  icon:"ti-user"      },
                      { label:"Email",         val:compte.email,                 icon:"ti-mail"           },
                      { label:"Plan choisi",   val:planActif?.nom,               icon:"ti-star"           },
                    ].map(r=>(
                      <div key={r.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", borderBottom:`1px solid ${t.border}` }}>
                        <i className={`ti ${r.icon}`} style={{ fontSize:14, color:t.blue, width:16, flexShrink:0 }} />
                        <span style={{ fontSize:12, color:t.muted, width:110, flexShrink:0 }}>{r.label}</span>
                        <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{r.val}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize:12, color:t.muted, lineHeight:1.6, marginBottom:16, textAlign:"center" }}>
                    En créant votre école, vous acceptez les{" "}
                    <span style={{ color:t.blue, cursor:"pointer" }}>Conditions d'utilisation</span>{" "}
                    et la <span style={{ color:t.blue, cursor:"pointer" }}>Politique de confidentialité</span> de SchoolX.
                  </div>
                </div>
              )}

              {/* ── BOUTONS NAVIGATION ── */}
              <div style={{ display:"flex", gap:10, marginTop:24 }}>
                {step > 1 && (
                  <button onClick={()=>setStep(s=>s-1)} style={{ padding:"12px 18px", border:`1px solid ${t.border}`, borderRadius:t.radius, background:t.surface, fontSize:13, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font, display:"flex", alignItems:"center", gap:7, transition:"all .15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=t.blue; e.currentTarget.style.color=t.blue; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=t.border; e.currentTarget.style.color=t.sub; }}
                  >
                    <i className="ti ti-arrow-left" style={{ fontSize:14 }} /> Retour
                  </button>
                )}
                {step===1 && (
                  <button onClick={onBack} style={{ padding:"12px 18px", border:`1px solid ${t.border}`, borderRadius:t.radius, background:t.surface, fontSize:13, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font, display:"flex", alignItems:"center", gap:7 }}>
                    <i className="ti ti-login" style={{ fontSize:14 }} /> Déjà un compte
                  </button>
                )}

                <button
                  onClick={step<4 ? next : handleSubmit}
                  disabled={loading}
                  style={{
                    flex:1, padding:"13px",
                    background:loading?"#93c5fd":step===4?t.green:`linear-gradient(135deg,${t.blue},${t.blueDark})`,
                    color:"#fff", border:"none", borderRadius:t.radius,
                    fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer",
                    fontFamily:t.font, display:"flex", alignItems:"center",
                    justifyContent:"center", gap:9,
                    boxShadow:step===4?"0 4px 18px rgba(5,150,105,0.35)":"0 4px 18px rgba(37,99,235,0.35)",
                    transition:"all .2s",
                  }}
                  onMouseEnter={e=>{ if(!loading){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(37,99,235,0.4)";} }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=step===4?"0 4px 18px rgba(5,150,105,0.35)":"0 4px 18px rgba(37,99,235,0.35)"; }}
                >
                  {loading ? (
                    <><div style={{ width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .65s linear infinite" }} />Création en cours…</>
                  ) : step < 4 ? (
                    <>Continuer <i className="ti ti-arrow-right" style={{ fontSize:15 }} /></>
                  ) : (
                    <><i className="ti ti-building-plus" style={{ fontSize:16 }} />Créer mon école</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ══ SUCCÈS ══ */
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, padding:"56px 40px", textAlign:"center", boxShadow:"0 8px 32px rgba(0,0,0,0.07)", animation:"scaleIn .45s ease" }}>
            {/* Cercle animé */}
            <div style={{ position:"relative", width:90, height:90, margin:"0 auto 24px" }}>
              <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:t.greenSoft, border:`3px solid ${t.green}`, display:"flex", alignItems:"center", justifyContent:"center", animation:"scaleIn .5s ease" }}>
                <i className="ti ti-circle-check" style={{ fontSize:44, color:t.green }} />
              </div>
            </div>

            <h2 style={{ fontSize:26, fontWeight:800, color:t.text, margin:"0 0 10px", letterSpacing:"-0.5px" }}>
              Votre établissement est prêt ! 🎉
            </h2>
            <p style={{ fontSize:14, color:t.muted, margin:"0 0 28px", lineHeight:1.7 }}>
              Bienvenue sur SchoolX, <strong>{compte.prenom}</strong> !<br />
              L'école <strong>{ecole.nom}</strong> a été créée avec le plan <strong>{planActif?.nom}</strong>.
            </p>

            {/* Résumé compact */}
            <div style={{ background:t.bg, borderRadius:t.radiusLg, padding:"16px 20px", marginBottom:28, textAlign:"left", border:`1px solid ${t.border}` }}>
              {[
                { icon:"ti-building-school", val:ecole.nom     },
                { icon:"ti-mail",            val:compte.email   },
                { icon:"ti-star",            val:`Plan ${planActif?.nom}` },
              ].map(r=>(
                <div key={r.icon} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid ${t.border}` }}>
                  <i className={`ti ${r.icon}`} style={{ fontSize:15, color:t.blue }} />
                  <span style={{ fontSize:13, color:t.text, fontWeight:500 }}>{r.val}</span>
                </div>
              ))}
            </div>

            <button onClick={onSuccess} style={{
              width:"100%", padding:"14px",
              background:`linear-gradient(135deg,${t.blue},${t.blueDark})`,
              color:"#fff", border:"none", borderRadius:t.radius,
              fontSize:14, fontWeight:700, cursor:"pointer",
              fontFamily:t.font, display:"flex", alignItems:"center",
              justifyContent:"center", gap:9,
              boxShadow:"0 4px 18px rgba(37,99,235,0.35)",
              transition:"all .2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(37,99,235,0.45)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 18px rgba(37,99,235,0.35)";}}
            >
              <i className="ti ti-layout-dashboard" style={{ fontSize:17 }} />
              Accéder à mon tableau de bord
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
