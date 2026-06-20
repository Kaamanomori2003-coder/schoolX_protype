import { useState } from "react";

const t = {
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
};

const matiereColors = {
  "Mathématiques":   { color:"#2563eb", bg:"#eff6ff",  icon:"ti-math-function"  },
  "Français":        { color:"#7c3aed", bg:"#f5f3ff",  icon:"ti-pencil"         },
  "Physique-Chimie": { color:"#0891b2", bg:"#ecfeff",  icon:"ti-flask"          },
  "Histoire-Géo":    { color:"#d97706", bg:"#fffbeb",  icon:"ti-globe"          },
  "Anglais":         { color:"#059669", bg:"#f0fdf4",  icon:"ti-language"       },
  "SVT":             { color:"#16a34a", bg:"#f0fdf4",  icon:"ti-leaf"           },
  "Informatique":    { color:"#0369a1", bg:"#e0f2fe",  icon:"ti-device-laptop"  },
  "Philosophie":     { color:"#9333ea", bg:"#faf5ff",  icon:"ti-bulb"           },
};
const getColor = (nom) => matiereColors[nom] || { color:t.blue, bg:t.blueSoft, icon:"ti-book" };

const DATA = [
  { id:1, nom:"Mathématiques",   professeur:"Dr. Mamadou Diallo",  heures:6, classe:"Terminale A", coefficient:5 },
  { id:2, nom:"Français",        professeur:"Mme Fatoumata Bah",   heures:4, classe:"Terminale A", coefficient:4 },
  { id:3, nom:"Physique-Chimie", professeur:"M. Ousmane Kouyaté",  heures:4, classe:"Terminale S", coefficient:4 },
  { id:4, nom:"Histoire-Géo",    professeur:"M. Ibrahima Camara",  heures:3, classe:"3ème B",      coefficient:3 },
  { id:5, nom:"Anglais",         professeur:"Mme Aïssatou Sow",    heures:3, classe:"Seconde C",   coefficient:3 },
  { id:6, nom:"SVT",             professeur:"Mme Kadiatou Traoré", heures:3, classe:"1ère S",      coefficient:3 },
  { id:7, nom:"Informatique",    professeur:"M. Sekou Barry",      heures:2, classe:"Terminale D", coefficient:2 },
  { id:8, nom:"Philosophie",     professeur:"Mme Mariama Condé",   heures:2, classe:"Terminale A", coefficient:3 },
];

const emptyForm = { nom:"", professeur:"", heures:"", classe:"", coefficient:"" };

const Field = ({ label, placeholder, value, onChange }) => (
  <div>
    <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>{label}</label>
    <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text }}
      onFocus={e => e.currentTarget.style.borderColor=t.blue}
      onBlur={e  => e.currentTarget.style.borderColor=t.border}
    />
  </div>
);

export function Matieres() {
  const [search,    setSearch]    = useState("");
  const [viewMode,  setViewMode]  = useState("table");
  const [matieres,  setMatieres]  = useState(DATA);
  const [modal,     setModal]     = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [delId,     setDelId]     = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [toast,     setToast]     = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = matieres.filter(m =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    m.professeur.toLowerCase().includes(search.toLowerCase()) ||
    m.classe.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };

  const openEdit = (m) => {
    setForm({ nom:m.nom, professeur:m.professeur, heures:String(m.heures), classe:m.classe, coefficient:String(m.coefficient) });
    setEditId(m.id);
    setModal(true);
  };

  const save = () => {
    if (!form.nom || !form.professeur) return;
    if (editId) {
      setMatieres(prev => prev.map(m => m.id === editId ? { ...m, ...form, heures:parseInt(form.heures)||0, coefficient:parseInt(form.coefficient)||1 } : m));
      showToast("Matière modifiée");
    } else {
      setMatieres(prev => [...prev, { id:Date.now(), ...form, heures:parseInt(form.heures)||0, coefficient:parseInt(form.coefficient)||1 }]);
      showToast("Matière ajoutée");
    }
    setModal(false);
  };

  const confirmDelete = () => {
    setMatieres(prev => prev.filter(m => m.id !== delId));
    setDelId(null);
    showToast("Matière supprimée", "error");
  };

  const coefMax     = Math.max(...matieres.map(m => m.coefficient), 1);
  const totalHeures = matieres.reduce((a,m)=>a+(m.heures||0), 0);
  const classes     = [...new Set(matieres.map(m => m.classe))].length;
  const toDelete    = matieres.find(m => m.id === delId);

  return (
    <div style={{ fontFamily:t.font, color:t.text }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, background:toast.type==="error"?t.red:t.green, color:"#fff", padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:600, boxShadow:"0 4px 16px rgba(0,0,0,0.15)", display:"flex", alignItems:"center", gap:8 }}>
          <i className={`ti ${toast.type==="error"?"ti-x":"ti-check"}`} style={{ fontSize:15 }} />
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Matières</h1>
          <p style={{ fontSize:13, color:t.sub, marginTop:4, margin:0 }}>Programme des enseignements — {matieres.length} matières</p>
        </div>
        <button onClick={openAdd} style={{ display:"flex", alignItems:"center", gap:7, background:t.blue, color:"#fff", border:"none", borderRadius:t.radius, padding:"10px 18px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font, boxShadow:`0 2px 8px rgba(37,99,235,0.25)` }}>
          <i className="ti ti-plus" style={{ fontSize:14 }} /> Ajouter une matière
        </button>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
        {[
          { icon:"ti-book",  label:"Total matières",   value:matieres.length,   c:t.blue,    bg:t.blueSoft   },
          { icon:"ti-clock", label:"Heures/semaine",   value:`${totalHeures}h`, c:t.amber,   bg:t.amberSoft  },
          { icon:"ti-school",label:"Classes couvertes", value:classes,          c:t.green,   bg:t.greenSoft  },
          { icon:"ti-award", label:"Coef. max",         value:coefMax,          c:t.purple,  bg:t.purpleSoft },
        ].map(s => (
          <div key={s.label} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:t.shadow }}>
            <div style={{ width:38, height:38, borderRadius:9, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={`ti ${s.icon}`} style={{ fontSize:18, color:s.c }} />
            </div>
            <div>
              <div style={{ fontSize:10, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".4px" }}>{s.label}</div>
              <div style={{ fontSize:19, fontWeight:700, color:t.text, marginTop:2, lineHeight:1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:"1 1 200px", minWidth:0 }}>
          <i className="ti ti-search" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:t.muted, fontSize:15 }} />
          <input type="text" placeholder="Rechercher par matière, professeur ou classe..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", padding:"10px 12px 10px 36px", border:`1px solid ${t.border}`, borderRadius:t.radius, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text, background:t.surface, boxShadow:t.shadow }}
            onFocus={e=>e.currentTarget.style.borderColor=t.blue}
            onBlur={e =>e.currentTarget.style.borderColor=t.border}
          />
        </div>
        <div style={{ display:"flex", background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:3, boxShadow:t.shadow }}>
          {[{ mode:"table",icon:"ti-list"},{ mode:"cards",icon:"ti-layout-grid"}].map(v=>(
            <button key={v.mode} onClick={()=>setViewMode(v.mode)} style={{ width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",border:"none",borderRadius:8,cursor:"pointer",background:viewMode===v.mode?t.blue:"transparent",color:viewMode===v.mode?"#fff":t.muted,transition:"all .15s" }}>
              <i className={`ti ${v.icon}`} style={{ fontSize:15 }} />
            </button>
          ))}
        </div>
      </div>

      {/* VUE TABLE */}
      {viewMode==="table" && (
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, boxShadow:t.shadow, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:560 }}>
              <thead>
                <tr style={{ background:t.bg }}>
                  {["Matière","Professeur","Classe","H/sem.","Coefficient","Actions"].map(h=>(
                    <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:t.muted, textTransform:"uppercase", letterSpacing:".4px", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(m=>{
                  const mc = getColor(m.nom);
                  return (
                    <tr key={m.id} style={{ borderBottom:`1px solid ${t.border}`, transition:"background .12s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:32,height:32,borderRadius:8,background:mc.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                            <i className={`ti ${mc.icon}`} style={{ fontSize:15,color:mc.color }} />
                          </div>
                          <span style={{ fontSize:13,fontWeight:600,color:t.text }}>{m.nom}</span>
                        </div>
                      </td>
                      <td style={{ padding:"12px 16px",fontSize:13,color:t.sub }}>{m.professeur}</td>
                      <td style={{ padding:"12px 16px" }}>
                        <span style={{ fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,background:"#f3f4f6",color:t.sub }}>{m.classe}</span>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                          <i className="ti ti-clock" style={{ fontSize:12,color:t.muted }} />
                          <span style={{ fontSize:13,fontWeight:600,color:t.text }}>{m.heures}h</span>
                        </div>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <div style={{ flex:1,maxWidth:56,height:4,background:t.border,borderRadius:99,overflow:"hidden" }}>
                            <div style={{ width:`${(m.coefficient/coefMax)*100}%`,height:"100%",background:mc.color,borderRadius:99 }} />
                          </div>
                          <span style={{ fontSize:12,fontWeight:700,color:mc.color,background:mc.bg,padding:"2px 8px",borderRadius:20 }}>×{m.coefficient}</span>
                        </div>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex",gap:6 }}>
                          <button onClick={()=>openEdit(m)} style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 10px",border:`1px solid ${t.border}`,borderRadius:7,background:t.surface,fontSize:11,fontWeight:600,cursor:"pointer",color:t.sub,fontFamily:t.font }}>
                            <i className="ti ti-edit" style={{ fontSize:12 }} /> Modifier
                          </button>
                          <button onClick={()=>setDelId(m.id)} style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 10px",border:`1px solid #fecaca`,borderRadius:7,background:t.redSoft,fontSize:11,fontWeight:600,cursor:"pointer",color:t.red,fontFamily:t.font }}>
                            <i className="ti ti-trash" style={{ fontSize:12 }} /> Suppr.
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length===0&&(
                  <tr><td colSpan={6} style={{ padding:40,textAlign:"center",color:t.muted,fontSize:13 }}>
                    <i className="ti ti-search" style={{ fontSize:26,display:"block",marginBottom:8,color:t.border }} />
                    Aucune matière trouvée
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length>0&&(
            <div style={{ padding:"10px 16px",borderTop:`1px solid ${t.border}`,background:t.bg,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:12,color:t.muted }}>{filtered.length} matière{filtered.length>1?"s":""}</span>
            </div>
          )}
        </div>
      )}

      {/* VUE CARDS */}
      {viewMode==="cards"&&(
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14 }}>
          {filtered.map(m=>{
            const mc=getColor(m.nom);
            return (
              <div key={m.id} style={{ background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radiusLg,overflow:"hidden",boxShadow:t.shadow,transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadow;e.currentTarget.style.transform="translateY(0)";}}
              >
                <div style={{ height:4,background:mc.color }} />
                <div style={{ padding:"16px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                    <div style={{ width:38,height:38,borderRadius:10,background:mc.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <i className={`ti ${mc.icon}`} style={{ fontSize:18,color:mc.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize:14,fontWeight:700,color:t.text }}>{m.nom}</div>
                      <span style={{ fontSize:11,padding:"1px 7px",borderRadius:20,background:"#f3f4f6",color:t.sub,fontWeight:500 }}>{m.classe}</span>
                    </div>
                  </div>
                  <div style={{ fontSize:12,color:t.sub,marginBottom:12,paddingTop:10,borderTop:`1px solid ${t.border}` }}>
                    <i className="ti ti-user" style={{ marginRight:5,fontSize:12,color:t.muted }} />
                    {m.professeur}
                  </div>
                  <div style={{ display:"flex",gap:8,marginBottom:14 }}>
                    <div style={{ flex:1,background:t.bg,borderRadius:8,padding:"7px 10px",textAlign:"center" }}>
                      <div style={{ fontSize:15,fontWeight:700,color:t.text }}>{m.heures}h</div>
                      <div style={{ fontSize:10,color:t.muted,marginTop:1 }}>par semaine</div>
                    </div>
                    <div style={{ flex:1,background:mc.bg,borderRadius:8,padding:"7px 10px",textAlign:"center" }}>
                      <div style={{ fontSize:15,fontWeight:700,color:mc.color }}>×{m.coefficient}</div>
                      <div style={{ fontSize:10,color:mc.color+"99",marginTop:1 }}>coefficient</div>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    <button onClick={()=>openEdit(m)} style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"7px",border:`1px solid ${t.border}`,borderRadius:8,background:t.surface,fontSize:12,fontWeight:600,cursor:"pointer",color:t.sub,fontFamily:t.font }}>
                      <i className="ti ti-edit" style={{ fontSize:13 }} /> Modifier
                    </button>
                    <button onClick={()=>setDelId(m.id)} style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"7px",border:`1px solid #fecaca`,borderRadius:8,background:t.redSoft,fontSize:12,fontWeight:600,cursor:"pointer",color:t.red,fontFamily:t.font }}>
                      <i className="ti ti-trash" style={{ fontSize:13 }} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL AJOUTER / MODIFIER */}
      {modal&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400 }}>
          <div style={{ background:t.surface,borderRadius:16,padding:28,width:"min(440px,92vw)",boxShadow:"0 20px 60px rgba(0,0,0,0.18)",maxHeight:"88vh",overflowY:"auto" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div>
                <h3 style={{ margin:0,fontSize:16,fontWeight:700 }}>{editId?"Modifier la matière":"Nouvelle matière"}</h3>
                <p style={{ margin:0,fontSize:12,color:t.muted,marginTop:3 }}>Remplissez les informations</p>
              </div>
              <button onClick={()=>setModal(false)} style={{ background:t.bg,border:"none",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.sub }}>
                <i className="ti ti-x" style={{ fontSize:15 }} />
              </button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              <Field label="Nom de la matière" placeholder="Ex : Mathématiques"      value={form.nom}         onChange={v=>setForm({...form,nom:v})} />
              <Field label="Professeur"         placeholder="Ex : Dr. Mamadou Diallo" value={form.professeur}  onChange={v=>setForm({...form,professeur:v})} />
              <Field label="Classe"             placeholder="Ex : Terminale A"        value={form.classe}      onChange={v=>setForm({...form,classe:v})} />
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <Field label="Heures / semaine" placeholder="Ex : 4" value={form.heures}      onChange={v=>setForm({...form,heures:v})} />
                <Field label="Coefficient"      placeholder="Ex : 3"  value={form.coefficient} onChange={v=>setForm({...form,coefficient:v})} />
              </div>
            </div>
            <div style={{ display:"flex",gap:10,marginTop:22 }}>
              <button onClick={()=>setModal(false)} style={{ flex:1,padding:"10px",border:`1px solid ${t.border}`,borderRadius:9,background:t.surface,fontSize:13,fontWeight:500,cursor:"pointer",color:t.sub,fontFamily:t.font }}>Annuler</button>
              <button onClick={save} style={{ flex:1,padding:"10px",border:"none",borderRadius:9,background:t.blue,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:t.font }}>
                {editId?"Enregistrer":"Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUPPRIMER */}
      {delId&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400 }}>
          <div style={{ background:t.surface,borderRadius:16,padding:28,width:"min(360px,90vw)",boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ width:46,height:46,borderRadius:12,background:t.redSoft,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14 }}>
              <i className="ti ti-trash" style={{ fontSize:20,color:t.red }} />
            </div>
            <h3 style={{ margin:0,fontSize:16,fontWeight:700,marginBottom:8 }}>Supprimer la matière</h3>
            <p style={{ fontSize:13,color:t.sub,margin:"0 0 20px" }}>
              Voulez-vous vraiment supprimer <strong>{toDelete?.nom}</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>setDelId(null)} style={{ flex:1,padding:"10px",border:`1px solid ${t.border}`,borderRadius:9,background:t.surface,fontSize:13,fontWeight:500,cursor:"pointer",color:t.sub,fontFamily:t.font }}>Annuler</button>
              <button onClick={confirmDelete} style={{ flex:1,padding:"10px",border:"none",borderRadius:9,background:t.red,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:t.font }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
