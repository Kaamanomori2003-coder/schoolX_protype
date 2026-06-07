import { useState } from "react";

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const INITIAL_USERS = [
  { id:1, nom:"M. Soumah",   email:"soumah@schoolx.gn",   role:"Administrateur", statut:"Actif"    },
  { id:2, nom:"A. Diallo",   email:"diallo@schoolx.gn",   role:"Comptable",      statut:"Actif"    },
  { id:3, nom:"M. Konaté",   email:"konate@schoolx.gn",   role:"Directeur",      statut:"Actif"    },
  { id:4, nom:"F. Camara",   email:"camara@schoolx.gn",   role:"Enseignant",     statut:"Inactif"  },
  { id:5, nom:"B. Barry",    email:"barry@schoolx.gn",    role:"RH",             statut:"Actif"    },
];

const ROLES = ["Administrateur","Directeur","Comptable","RH","Enseignant","Secrétaire"];

const PERMISSIONS_DATA = {
  modules: ["Notes","Paiements","RH","Dépenses","Paramètres","Rapports"],
  roles:   ["Directeur","Comptable","RH","Enseignant","Secrétaire"],
  matrix: {
    "Notes":       [true, false, false, true,  false],
    "Paiements":   [true, true,  false, false, false],
    "RH":          [true, false, true,  false, false],
    "Dépenses":    [true, true,  false, false, false],
    "Paramètres":  [true, false, false, false, false],
    "Rapports":    [true, true,  true,  false, false],
  },
};

const CATEGORIES_DEP = ["Salaires","Fournitures scolaires","Maintenance","Électricité","Eau","Internet","Événements scolaires","Transport"];
const POSTES_RH      = ["Directeur","Enseignant","Comptable","Secrétaire","Agent d'entretien","Gardien"];
const MODES_PAIEMENT = ["Espèces","Virement bancaire","Mobile Money","Chèque"];
const EVAL_TYPES     = ["Devoir","Examen","TP","Interrogation","Oral"];

const CONNEXIONS = [
  { user:"M. Soumah", date:"07/06/2025 08:15", ip:"192.168.1.10", statut:"Succès"  },
  { user:"A. Diallo", date:"06/06/2025 14:30", ip:"192.168.1.14", statut:"Succès"  },
  { user:"M. Konaté", date:"05/06/2025 09:00", ip:"192.168.1.22", statut:"Échec"   },
  { user:"M. Soumah", date:"04/06/2025 17:45", ip:"192.168.1.10", statut:"Succès"  },
];

const SAUVEGARDES = [
  { date:"07/06/2025 06:00", type:"Automatique", taille:"12.4 MB", statut:"Succès"  },
  { date:"06/06/2025 06:00", type:"Automatique", taille:"12.1 MB", statut:"Succès"  },
  { date:"05/06/2025 14:22", type:"Manuelle",    taille:"11.9 MB", statut:"Succès"  },
];

/* ═══════════════════════════════════════════════
   STYLE HELPERS
═══════════════════════════════════════════════ */
const card = { background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:24, marginBottom:24 };
const lbl  = { fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 };
const inp  = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"'Outfit',sans-serif", color:"#0f172a", background:"#fff" };
const sectionTitle = (icon, text) => (
  <div style={{ fontSize:15, fontWeight:700, marginBottom:20, display:"flex", alignItems:"center", gap:8, paddingBottom:12, borderBottom:"1px solid #f1f5f9" }}>
    <i className={`ti ${icon}`} style={{ color:"#1a3ed4", fontSize:18 }} />{text}
  </div>
);
const Badge = ({ label, ok }) => (
  <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, fontWeight:500, background:ok?"#dcfce7":"#fee2e2", color:ok?"#166534":"#991b1b" }}>{label}</span>
);
const BtnPrimary = ({ onClick, children, color="#1a3ed4" }) => (
  <button onClick={onClick} style={{ padding:"9px 16px", border:"none", borderRadius:8, background:color, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif", display:"flex", alignItems:"center", gap:6 }}>
    {children}
  </button>
);
const BtnOutline = ({ onClick, children }) => (
  <button onClick={onClick} style={{ padding:"9px 16px", border:"1px solid #e2e8f0", borderRadius:8, background:"#fff", color:"#334155", fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
    {children}
  </button>
);
const Toggle = ({ value, onChange }) => (
  <div onClick={()=>onChange(!value)} style={{ width:42, height:24, borderRadius:12, background:value?"#1a3ed4":"#cbd5e1", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
    <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:value?21:3, transition:"left .2s" }} />
  </div>
);

/* ═══════════════════════════════════════════════
   SIDEBAR MENU
═══════════════════════════════════════════════ */
const MENU = [
  { id:"etablissement", icon:"ti-school",        label:"Établissement"     },
  { id:"utilisateurs",  icon:"ti-users",          label:"Utilisateurs"      },
  { id:"permissions",   icon:"ti-shield-check",   label:"Permissions"       },
  { id:"notes",         icon:"ti-clipboard-list", label:"Notes"             },
  { id:"paiements",     icon:"ti-credit-card",    label:"Paiements"         },
  { id:"rh",            icon:"ti-briefcase",      label:"RH"                },
  { id:"depenses",      icon:"ti-wallet",         label:"Dépenses"          },
  { id:"notifications", icon:"ti-bell",           label:"Notifications"     },
  { id:"sauvegarde",    icon:"ti-database",       label:"Sauvegarde"        },
  { id:"securite",      icon:"ti-lock",           label:"Sécurité"          },
  { id:"apparence",     icon:"ti-palette",        label:"Apparence"         },
  { id:"annee",         icon:"ti-calendar",       label:"Année scolaire"    },
];

/* ═══════════════════════════════════════════════
   SECTIONS
═══════════════════════════════════════════════ */
function SectionEtablissement() {
  const [form, setForm] = useState({ nomEcole:"SchoolX", adresse:"Conakry, Guinée", telephone:"622 00 00 00", email:"contact@schoolx.gn", anneeScolaire:"2024/2025", devise:"GNF", siteWeb:"www.schoolx.gn", description:"Établissement d'enseignement général" });
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };
  return (
    <div>
      {sectionTitle("ti-school","Informations de l'établissement")}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {[["Nom de l'école","nomEcole"],["Adresse","adresse"],["Téléphone","telephone"],["Email","email"],["Année scolaire","anneeScolaire"],["Devise","devise"],["Site web","siteWeb"]].map(([l,k])=>(
          <div key={k}>
            <label style={lbl}>{l}</label>
            <input value={form[k]} onChange={e=>set(k,e.target.value)} style={inp} />
          </div>
        ))}
        <div>
          <label style={lbl}>Description</label>
          <textarea value={form.description} onChange={e=>set("description",e.target.value)} style={{...inp,height:70,resize:"vertical"}} />
        </div>
      </div>
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Logo de l'école</label>
        <label style={{ display:"flex", alignItems:"center", gap:12, border:"1px dashed #e2e8f0", borderRadius:8, padding:14, cursor:"pointer" }}>
          <div style={{ width:52, height:52, borderRadius:10, background:"#1a3ed4", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:22, fontWeight:800 }}>S</div>
          <div>
            <div style={{ fontSize:13, fontWeight:600 }}>Changer le logo</div>
            <div style={{ fontSize:12, color:"#94a3b8" }}>PNG, JPG — max 2 MB</div>
          </div>
          <input type="file" accept="image/*" style={{ display:"none" }} />
        </label>
      </div>
      <div style={{ padding:16, background:"#f8fafc", borderRadius:10, marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#64748b", marginBottom:8 }}>Aperçu</div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:10, background:"#1a3ed4", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:20, fontWeight:800 }}>S</div>
          <div>
            <div style={{ fontSize:16, fontWeight:700 }}>{form.nomEcole}</div>
            <div style={{ fontSize:12, color:"#64748b" }}>{form.adresse} · {form.email}</div>
          </div>
        </div>
      </div>
      <BtnPrimary onClick={save} color={saved?"#16a34a":"#1a3ed4"}>
        <i className={`ti ${saved?"ti-check":"ti-device-floppy"}`} />
        {saved?"Enregistré !":"Enregistrer les modifications"}
      </BtnPrimary>
    </div>
  );
}

function SectionUtilisateurs() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom:"", email:"", role:"Enseignant", statut:"Actif" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const add = () => {
    if (!form.nom||!form.email) return;
    setUsers(u=>[...u,{id:Date.now(),...form}]);
    setForm({ nom:"", email:"", role:"Enseignant", statut:"Actif" });
    setShowModal(false);
  };
  const toggle = id => setUsers(u=>u.map(x=>x.id===id?{...x,statut:x.statut==="Actif"?"Inactif":"Actif"}:x));

  const roleColors = { "Administrateur":{bg:"#dbeafe",color:"#1e40af"}, "Directeur":{bg:"#f3e8ff",color:"#6b21a8"}, "Comptable":{bg:"#fef9c3",color:"#854d0e"}, "RH":{bg:"#dcfce7",color:"#166534"}, "Enseignant":{bg:"#f0fdf4",color:"#14532d"}, "Secrétaire":{bg:"#fce7f3",color:"#9d174d"} };

  return (
    <div>
      {sectionTitle("ti-users","Gestion des utilisateurs")}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <BtnPrimary onClick={()=>setShowModal(true)}><i className="ti ti-plus" /> Nouveau compte</BtnPrimary>
      </div>
      <div style={{ border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
              {["Nom","Email","Rôle","Statut","Actions"].map(h=>(
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u,i)=>(
              <tr key={u.id} style={{ borderBottom:"1px solid #f1f5f9", background:i%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"11px 14px", fontSize:13, fontWeight:600 }}>{u.nom}</td>
                <td style={{ padding:"11px 14px", fontSize:13, color:"#64748b" }}>{u.email}</td>
                <td style={{ padding:"11px 14px" }}><span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, fontWeight:500, ...roleColors[u.role] }}>{u.role}</span></td>
                <td style={{ padding:"11px 14px" }}><Badge label={u.statut} ok={u.statut==="Actif"} /></td>
                <td style={{ padding:"11px 14px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>toggle(u.id)} style={{ fontSize:11, padding:"4px 10px", border:"1px solid #e2e8f0", borderRadius:6, background:"#fff", cursor:"pointer" }}>
                      {u.statut==="Actif"?"Désactiver":"Activer"}
                    </button>
                    <button style={{ fontSize:11, padding:"4px 10px", border:"1px solid #e2e8f0", borderRadius:6, background:"#fff", cursor:"pointer" }}>Modifier</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:"#fff", borderRadius:14, padding:26, width:420, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <h2 style={{ fontSize:16, fontWeight:700, margin:0 }}>Nouveau compte</h2>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#94a3b8" }}>✕</button>
            </div>
            {[["Nom complet","nom","text"],["Email","email","email"]].map(([l,k,t])=>(
              <div key={k} style={{ marginBottom:14 }}>
                <label style={lbl}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} style={inp} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>Rôle</label>
              <select value={form.role} onChange={e=>set("role",e.target.value)} style={inp}>
                {ROLES.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              <BtnOutline onClick={()=>setShowModal(false)}>Annuler</BtnOutline>
              <BtnPrimary onClick={add}>Créer le compte</BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionPermissions() {
  const [matrix, setMatrix] = useState(PERMISSIONS_DATA.matrix);
  const toggle = (mod, ri) => setMatrix(m=>({ ...m, [mod]:m[mod].map((v,i)=>i===ri?!v:v) }));
  return (
    <div>
      {sectionTitle("ti-shield-check","Permissions et accès")}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              <th style={{ padding:"10px 14px", textAlign:"left", fontSize:12, fontWeight:600, color:"#64748b", borderBottom:"1px solid #e2e8f0" }}>Module</th>
              {PERMISSIONS_DATA.roles.map(r=>(
                <th key={r} style={{ padding:"10px 14px", textAlign:"center", fontSize:12, fontWeight:600, color:"#64748b", borderBottom:"1px solid #e2e8f0" }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS_DATA.modules.map((mod,i)=>(
              <tr key={mod} style={{ borderBottom:"1px solid #f1f5f9", background:i%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"11px 14px", fontSize:13, fontWeight:500 }}>{mod}</td>
                {matrix[mod].map((v,ri)=>(
                  <td key={ri} style={{ padding:"11px 14px", textAlign:"center" }}>
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      <Toggle value={v} onChange={()=>toggle(mod,ri)} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
        <BtnPrimary onClick={()=>{}}>
          <i className="ti ti-device-floppy" /> Enregistrer
        </BtnPrimary>
      </div>
    </div>
  );
}

function SectionNotes() {
  const [config, setConfig] = useState({ noteMax:20, seuilAdmission:10, seuilExcellence:16 });
  const [evals, setEvals] = useState(EVAL_TYPES.map(t=>({ type:t, coeff:1 })));
  const set = (k,v) => setConfig(c=>({...c,[k]:v}));
  return (
    <div>
      {sectionTitle("ti-clipboard-list","Paramètres des notes")}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[["Note maximale","noteMax"],["Seuil d'admission","seuilAdmission"],["Seuil d'excellence","seuilExcellence"]].map(([l,k])=>(
          <div key={k}>
            <label style={lbl}>{l}</label>
            <input type="number" value={config[k]} onChange={e=>set(k,e.target.value)} style={inp} />
          </div>
        ))}
      </div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Types d'évaluation & coefficients</div>
      <div style={{ border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
              {["Type","Coefficient","Actif"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {evals.map((e,i)=>(
              <tr key={e.type} style={{ borderBottom:"1px solid #f1f5f9" }}>
                <td style={{ padding:"10px 14px", fontSize:13 }}>{e.type}</td>
                <td style={{ padding:"10px 14px" }}>
                  <input type="number" value={e.coeff} min={1} max={5}
                    onChange={ev=>setEvals(arr=>arr.map((x,j)=>j===i?{...x,coeff:ev.target.value}:x))}
                    style={{...inp,width:70}} />
                </td>
                <td style={{ padding:"10px 14px" }}><Toggle value={true} onChange={()=>{}} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
        <BtnPrimary onClick={()=>{}}><i className="ti ti-device-floppy" /> Enregistrer</BtnPrimary>
      </div>
    </div>
  );
}

function SectionPaiements() {
  const [config, setConfig] = useState({ fraisScolarite:"850000", fraisInscription:"150000", penaliteRetard:"5", remiseMax:"20" });
  const [modes, setModes] = useState(MODES_PAIEMENT.map(m=>({ mode:m, actif:true })));
  const set = (k,v) => setConfig(c=>({...c,[k]:v}));
  return (
    <div>
      {sectionTitle("ti-credit-card","Paramètres des paiements")}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        {[["Frais de scolarité (GNF)","fraisScolarite"],["Frais d'inscription (GNF)","fraisInscription"],["Pénalité de retard (%)","penaliteRetard"],["Remise maximale (%)","remiseMax"]].map(([l,k])=>(
          <div key={k}>
            <label style={lbl}>{l}</label>
            <input type="number" value={config[k]} onChange={e=>set(k,e.target.value)} style={inp} />
          </div>
        ))}
      </div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Modes de paiement acceptés</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {modes.map((m,i)=>(
          <div key={m.mode} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", border:"1px solid #e2e8f0", borderRadius:9 }}>
            <span style={{ fontSize:13, fontWeight:500 }}>{m.mode}</span>
            <Toggle value={m.actif} onChange={v=>setModes(arr=>arr.map((x,j)=>j===i?{...x,actif:v}:x))} />
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <BtnPrimary onClick={()=>{}}><i className="ti ti-device-floppy" /> Enregistrer</BtnPrimary>
      </div>
    </div>
  );
}

function SectionRH() {
  const [postes, setPostes] = useState(POSTES_RH.map(p=>({ poste:p, salaire:"1500000", conges:21, heures:40 })));
  return (
    <div>
      {sectionTitle("ti-briefcase","Paramètres RH")}
      <div style={{ border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
              {["Poste","Salaire de base (GNF)","Congés annuels (j)","Heures/semaine"].map(h=>(
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {postes.map((p,i)=>(
              <tr key={p.poste} style={{ borderBottom:"1px solid #f1f5f9", background:i%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"10px 14px", fontSize:13, fontWeight:500 }}>{p.poste}</td>
                {["salaire","conges","heures"].map(k=>(
                  <td key={k} style={{ padding:"10px 14px" }}>
                    <input type="number" value={p[k]}
                      onChange={ev=>setPostes(arr=>arr.map((x,j)=>j===i?{...x,[k]:ev.target.value}:x))}
                      style={{...inp,width:130}} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
        <BtnPrimary onClick={()=>{}}><i className="ti ti-device-floppy" /> Enregistrer</BtnPrimary>
      </div>
    </div>
  );
}

function SectionDepenses() {
  const [cats, setCats] = useState(CATEGORIES_DEP.map(c=>({ cat:c, budget:"500000", alerte:80 })));
  return (
    <div>
      {sectionTitle("ti-wallet","Paramètres des dépenses")}
      <div style={{ border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
              {["Catégorie","Budget mensuel (GNF)","Seuil d'alerte (%)"].map(h=>(
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cats.map((c,i)=>(
              <tr key={c.cat} style={{ borderBottom:"1px solid #f1f5f9", background:i%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"10px 14px", fontSize:13, fontWeight:500 }}>{c.cat}</td>
                {["budget","alerte"].map(k=>(
                  <td key={k} style={{ padding:"10px 14px" }}>
                    <input type="number" value={c[k]}
                      onChange={ev=>setCats(arr=>arr.map((x,j)=>j===i?{...x,[k]:ev.target.value}:x))}
                      style={{...inp,width:140}} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
        <BtnPrimary onClick={()=>{}}><i className="ti ti-device-floppy" /> Enregistrer</BtnPrimary>
      </div>
    </div>
  );
}

function SectionNotifications() {
  const [cfg, setCfg] = useState({
    emailActif:true, smsActif:false, alerteRetard:true,
    alerteFinanciere:true, alerteNote:false, alerteSauvegarde:true,
    emailAdmin:"admin@schoolx.gn", smsNumero:"+224 622 00 00 00"
  });
  const set = (k,v) => setCfg(c=>({...c,[k]:v}));
  const rows = [
    ["emailActif","Notifications par email"],
    ["smsActif","Notifications par SMS"],
    ["alerteRetard","Alertes retard de paiement"],
    ["alerteFinanciere","Alertes financières"],
    ["alerteNote","Alertes nouvelles notes"],
    ["alerteSauvegarde","Alertes sauvegarde"],
  ];
  return (
    <div>
      {sectionTitle("ti-bell","Notifications")}
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
        {rows.map(([k,l])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", border:"1px solid #e2e8f0", borderRadius:9 }}>
            <span style={{ fontSize:13, fontWeight:500 }}>{l}</span>
            <Toggle value={cfg[k]} onChange={v=>set(k,v)} />
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <div>
          <label style={lbl}>Email administrateur</label>
          <input value={cfg.emailAdmin} onChange={e=>set("emailAdmin",e.target.value)} style={inp} />
        </div>
        <div>
          <label style={lbl}>Numéro SMS</label>
          <input value={cfg.smsNumero} onChange={e=>set("smsNumero",e.target.value)} style={inp} />
        </div>
      </div>
      <BtnPrimary onClick={()=>{}}><i className="ti ti-device-floppy" /> Enregistrer</BtnPrimary>
    </div>
  );
}

function SectionSauvegarde() {
  const [auto, setAuto] = useState(true);
  const [freq, setFreq] = useState("Quotidienne");
  return (
    <div>
      {sectionTitle("ti-database","Sauvegarde et restauration")}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
        {[
          { icon:"ti-download", label:"Sauvegarde manuelle", desc:"Créer une sauvegarde maintenant", color:"#1a3ed4", action:"Lancer" },
          { icon:"ti-upload",   label:"Restaurer",           desc:"Restaurer depuis une sauvegarde",  color:"#f59e0b", action:"Restaurer" },
          { icon:"ti-file-zip", label:"Exporter BDD",        desc:"Exporter en format SQL/CSV",       color:"#8b5cf6", action:"Exporter" },
          { icon:"ti-archive",  label:"Archiver",            desc:"Archiver l'année en cours",        color:"#64748b", action:"Archiver" },
        ].map(b=>(
          <div key={b.label} style={{ border:"1px solid #e2e8f0", borderRadius:10, padding:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:b.color+"1a", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className={`ti ${b.icon}`} style={{ color:b.color, fontSize:18 }} />
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{b.label}</div>
                <div style={{ fontSize:12, color:"#94a3b8" }}>{b.desc}</div>
              </div>
            </div>
            <BtnPrimary onClick={()=>{}} color={b.color}>{b.action}</BtnPrimary>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", border:"1px solid #e2e8f0", borderRadius:9, marginBottom:20 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600 }}>Sauvegarde automatique</div>
          <div style={{ fontSize:12, color:"#94a3b8" }}>Fréquence : {freq}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <select value={freq} onChange={e=>setFreq(e.target.value)} style={{...inp,width:"auto"}}>
            {["Quotidienne","Hebdomadaire","Mensuelle"].map(f=><option key={f}>{f}</option>)}
          </select>
          <Toggle value={auto} onChange={setAuto} />
        </div>
      </div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Historique des sauvegardes</div>
      <div style={{ border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
              {["Date","Type","Taille","Statut","Action"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {SAUVEGARDES.map((s,i)=>(
              <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}>
                <td style={{ padding:"10px 14px", fontSize:13 }}>{s.date}</td>
                <td style={{ padding:"10px 14px", fontSize:13, color:"#64748b" }}>{s.type}</td>
                <td style={{ padding:"10px 14px", fontSize:13 }}>{s.taille}</td>
                <td style={{ padding:"10px 14px" }}><Badge label={s.statut} ok={s.statut==="Succès"} /></td>
                <td style={{ padding:"10px 14px" }}>
                  <button style={{ fontSize:11, padding:"4px 10px", border:"1px solid #e2e8f0", borderRadius:6, background:"#fff", cursor:"pointer" }}>Restaurer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionSecurite() {
  const [pwd, setPwd] = useState({ actuel:"", nouveau:"", confirm:"" });
  const [twofa, setTwofa] = useState(false);
  const set = (k,v) => setPwd(p=>({...p,[k]:v}));
  return (
    <div>
      {sectionTitle("ti-lock","Sécurité")}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        <div style={{ border:"1px solid #e2e8f0", borderRadius:10, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Changer le mot de passe</div>
          {[["Mot de passe actuel","actuel"],["Nouveau mot de passe","nouveau"],["Confirmer","confirm"]].map(([l,k])=>(
            <div key={k} style={{ marginBottom:14 }}>
              <label style={lbl}>{l}</label>
              <input type="password" value={pwd[k]} onChange={e=>set(k,e.target.value)} style={inp} />
            </div>
          ))}
          <BtnPrimary onClick={()=>{}}><i className="ti ti-key" /> Mettre à jour</BtnPrimary>
        </div>
        <div style={{ border:"1px solid #e2e8f0", borderRadius:10, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Double authentification (2FA)</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>Activer le 2FA</div>
              <div style={{ fontSize:12, color:"#94a3b8" }}>Code envoyé par SMS ou email</div>
            </div>
            <Toggle value={twofa} onChange={setTwofa} />
          </div>
          {twofa && <div style={{ padding:12, background:"#dcfce7", borderRadius:8, fontSize:12, color:"#166534" }}>✓ Double authentification activée. Un code sera envoyé à chaque connexion.</div>}
        </div>
      </div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Historique des connexions</div>
      <div style={{ border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
              {["Utilisateur","Date & heure","Adresse IP","Statut"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {CONNEXIONS.map((c,i)=>(
              <tr key={i} style={{ borderBottom:"1px solid #f1f5f9", background:i%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"10px 14px", fontSize:13, fontWeight:500 }}>{c.user}</td>
                <td style={{ padding:"10px 14px", fontSize:13, color:"#64748b" }}>{c.date}</td>
                <td style={{ padding:"10px 14px", fontSize:13, color:"#64748b" }}>{c.ip}</td>
                <td style={{ padding:"10px 14px" }}><Badge label={c.statut} ok={c.statut==="Succès"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionApparence() {
  const [theme, setTheme] = useState("Clair");
  const [langue, setLangue] = useState("Français");
  const [couleur, setCouleur] = useState("#1a3ed4");
  const colors = ["#1a3ed4","#7c3aed","#059669","#dc2626","#d97706","#0891b2","#db2777","#374151"];
  return (
    <div>
      {sectionTitle("ti-palette","Apparence")}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        <div>
          <label style={lbl}>Thème</label>
          <div style={{ display:"flex", gap:10 }}>
            {["Clair","Sombre"].map(t=>(
              <button key={t} onClick={()=>setTheme(t)} style={{
                flex:1, padding:"10px 0", borderRadius:9,
                border:theme===t?"2px solid #1a3ed4":"1px solid #e2e8f0",
                background:theme===t?"#dbeafe":"#fff",
                color:theme===t?"#1e40af":"#334155",
                fontSize:13, fontWeight:theme===t?600:400, cursor:"pointer"
              }}>{t==="Clair"?"☀️ Clair":"🌙 Sombre"}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Langue</label>
          <select value={langue} onChange={e=>setLangue(e.target.value)} style={inp}>
            {["Français","English","Arabe"].map(l=><option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom:24 }}>
        <label style={lbl}>Couleur principale</label>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {colors.map(c=>(
            <div key={c} onClick={()=>setCouleur(c)} style={{
              width:38, height:38, borderRadius:"50%", background:c, cursor:"pointer",
              border:couleur===c?"3px solid #0f172a":"3px solid transparent",
              transition:"border .15s"
            }} />
          ))}
        </div>
      </div>
      <div style={{ padding:16, background:"#f8fafc", borderRadius:10, marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#64748b", marginBottom:10 }}>Aperçu</div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:9, background:couleur, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18, fontWeight:800 }}>S</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700 }}>SchoolX</div>
            <div style={{ fontSize:12, color:"#64748b" }}>Thème {theme} · {langue}</div>
          </div>
          <button style={{ marginLeft:"auto", padding:"8px 14px", background:couleur, color:"#fff", border:"none", borderRadius:8, fontSize:12, cursor:"pointer" }}>Bouton exemple</button>
        </div>
      </div>
      <BtnPrimary onClick={()=>{}}><i className="ti ti-device-floppy" /> Enregistrer</BtnPrimary>
    </div>
  );
}

function SectionAnnee() {
  const [annees, setAnnees] = useState([
    { annee:"2024/2025", statut:"Active",   eleves:342, debut:"01/09/2024", fin:"30/06/2025" },
    { annee:"2023/2024", statut:"Clôturée", eleves:310, debut:"01/09/2023", fin:"30/06/2024" },
    { annee:"2022/2023", statut:"Archivée", eleves:298, debut:"01/09/2022", fin:"30/06/2023" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ annee:"", debut:"", fin:"" });
  const statColors = { "Active":{bg:"#dcfce7",color:"#166534"}, "Clôturée":{bg:"#fef9c3",color:"#854d0e"}, "Archivée":{bg:"#f1f5f9",color:"#475569"} };
  return (
    <div>
      {sectionTitle("ti-calendar","Année scolaire")}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <BtnPrimary onClick={()=>setShowModal(true)}><i className="ti ti-plus" /> Nouvelle année</BtnPrimary>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
        {annees.map((a,i)=>(
          <div key={a.annee} style={{ border:"1px solid #e2e8f0", borderRadius:10, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:42, height:42, borderRadius:9, background:a.statut==="Active"?"#dbeafe":"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ti ti-calendar" style={{ fontSize:20, color:a.statut==="Active"?"#1e40af":"#94a3b8" }} />
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700 }}>{a.annee}</div>
                <div style={{ fontSize:12, color:"#94a3b8" }}>{a.debut} → {a.fin} · {a.eleves} élèves</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:500, ...statColors[a.statut] }}>{a.statut}</span>
              {a.statut==="Active" && <BtnPrimary onClick={()=>{}} color="#f59e0b"><i className="ti ti-lock" /> Clôturer</BtnPrimary>}
              {a.statut==="Clôturée" && <BtnPrimary onClick={()=>{}} color="#64748b"><i className="ti ti-archive" /> Archiver</BtnPrimary>}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:"#fff", borderRadius:14, padding:26, width:380, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <h2 style={{ fontSize:16, fontWeight:700, margin:0 }}>Nouvelle année scolaire</h2>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#94a3b8" }}>✕</button>
            </div>
            {[["Année (ex: 2025/2026)","annee","text"],["Date de début","debut","date"],["Date de fin","fin","date"]].map(([l,k,t])=>(
              <div key={k} style={{ marginBottom:14 }}>
                <label style={lbl}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={inp} />
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              <BtnOutline onClick={()=>setShowModal(false)}>Annuler</BtnOutline>
              <BtnPrimary onClick={()=>{ if(!form.annee) return; setAnnees(a=>[{ annee:form.annee, statut:"Active", eleves:0, debut:form.debut, fin:form.fin },...a]); setShowModal(false); }}>Créer</BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
const SECTIONS = {
  etablissement: SectionEtablissement,
  utilisateurs:  SectionUtilisateurs,
  permissions:   SectionPermissions,
  notes:         SectionNotes,
  paiements:     SectionPaiements,
  rh:            SectionRH,
  depenses:      SectionDepenses,
  notifications: SectionNotifications,
  sauvegarde:    SectionSauvegarde,
  securite:      SectionSecurite,
  apparence:     SectionApparence,
  annee:         SectionAnnee,
};

export default function Parametres() {
  const [active, setActive] = useState("etablissement");
  const Section = SECTIONS[active];

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", color:"#0f172a" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Paramètres</h1>
        <p style={{ fontSize:13, color:"#64748b", marginTop:4 }}>Configuration générale de SchoolX</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:20, alignItems:"start" }}>
        {/* Sidebar */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden", position:"sticky", top:16 }}>
          {MENU.map(m => (
            <button key={m.id} onClick={()=>setActive(m.id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"12px 16px", background:active===m.id?"#eff6ff":"#fff",
              border:"none", borderLeft:active===m.id?"3px solid #1a3ed4":"3px solid transparent",
              color:active===m.id?"#1a3ed4":"#334155",
              fontSize:13, fontWeight:active===m.id?600:400,
              cursor:"pointer", textAlign:"left", fontFamily:"'Outfit',sans-serif",
              transition:"background .15s"
            }}>
              <i className={`ti ${m.icon}`} style={{ fontSize:16 }} />
              {m.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:28 }}>
          <Section />
        </div>
      </div>
    </div>
  );
}