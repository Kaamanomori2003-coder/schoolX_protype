import { useState, useRef, useEffect } from "react";

/* ─── THEME ──────────────────────────────────────────────────── */
const t = {
  bg:"#f7f8fa", surface:"#ffffff", border:"#eaecf0",
  blue:"#2563eb", blueSoft:"#eff6ff", blueMid:"#dbeafe",
  text:"#111827", sub:"#6b7280", muted:"#9ca3af",
  green:"#059669", greenSoft:"#f0fdf4",
  amber:"#d97706", amberSoft:"#fffbeb",
  red:"#dc2626", redSoft:"#fef2f2",
  purple:"#7c3aed", purpleSoft:"#f5f3ff",
  radius:"10px", radiusLg:"14px",
  shadow:"0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── DATA ───────────────────────────────────────────────────── */
const CONVS = [
  {
    id:1, nom:"Mamadou Diallo", role:"Professeur", avatar:"MD",
    online:true, nonLu:2, archive:false,
    dernier:"D'accord, je transmettrai aux élèves.",
    heure:"09:42",
    messages:[
      { id:1, from:"them", texte:"Bonjour M. le Directeur, est-ce que les cours de demain sont maintenus ?", heure:"09:30", lu:true },
      { id:2, from:"me",   texte:"Bonjour M. Diallo, oui les cours sont maintenus. Merci de prévenir vos élèves.", heure:"09:38", lu:true },
      { id:3, from:"them", texte:"D'accord, je transmettrai aux élèves.", heure:"09:42", lu:false },
    ],
  },
  {
    id:2, nom:"Fatoumata Bah", role:"Professeur", avatar:"FB",
    online:false, nonLu:0, archive:false,
    dernier:"Merci pour l'information.",
    heure:"Hier",
    messages:[
      { id:1, from:"me",   texte:"Mme Bah, veuillez remettre les relevés de notes avant vendredi.", heure:"14:00", lu:true },
      { id:2, from:"them", texte:"Bien reçu, je les prépare.", heure:"14:15", lu:true },
      { id:3, from:"them", texte:"Merci pour l'information.", heure:"14:16", lu:true },
    ],
  },
  {
    id:3, nom:"Aminata Diallo (Parent)", role:"Parent", avatar:"AD",
    online:false, nonLu:1, archive:false,
    dernier:"Quand sont les résultats du trimestre ?",
    heure:"Lun",
    messages:[
      { id:1, from:"them", texte:"Bonjour, je souhaitais avoir des nouvelles de ma fille Mariama.", heure:"10:00", lu:true },
      { id:2, from:"me",   texte:"Bonjour Mme Diallo. Mariama va très bien, elle travaille sérieusement.", heure:"10:05", lu:true },
      { id:3, from:"them", texte:"Quand sont les résultats du trimestre ?", heure:"10:10", lu:false },
    ],
  },
  {
    id:4, nom:"Kadiatou Traoré", role:"Employé", avatar:"KT",
    online:true, nonLu:0, archive:false,
    dernier:"C'est noté, je m'en occupe.",
    heure:"Dim",
    messages:[
      { id:1, from:"me",   texte:"Mme Traoré, il faut nettoyer la salle B avant lundi.", heure:"08:00", lu:true },
      { id:2, from:"them", texte:"C'est noté, je m'en occupe.", heure:"08:12", lu:true },
    ],
  },
  {
    id:5, nom:"Classe Terminale A", role:"Groupe", avatar:"TA",
    online:false, nonLu:0, archive:false,
    dernier:"Annonce envoyée à 28 élèves",
    heure:"Ven",
    messages:[
      { id:1, from:"me", texte:"📢 Rappel : Contrôle de mathématiques mercredi. Préparez vos cahiers.", heure:"11:00", lu:true, type:"annonce" },
    ],
  },
  {
    id:6, nom:"Ibrahima Sow (Parent)", role:"Parent", avatar:"IS",
    online:false, nonLu:0, archive:true,
    dernier:"Merci beaucoup.",
    heure:"12 Jan",
    messages:[
      { id:1, from:"them", texte:"Bonjour directeur, mon fils Ibrahima était malade cette semaine.", heure:"09:00", lu:true },
      { id:2, from:"me",   texte:"Merci de l'information, son absence est justifiée.", heure:"09:10", lu:true },
      { id:3, from:"them", texte:"Merci beaucoup.", heure:"09:11", lu:true },
    ],
  },
];

const roleColor = (r) => ({
  "Professeur": { c:"#2563eb", bg:"#eff6ff"  },
  "Parent":     { c:"#059669", bg:"#f0fdf4"  },
  "Employé":    { c:"#d97706", bg:"#fffbeb"  },
  "Groupe":     { c:"#7c3aed", bg:"#f5f3ff"  },
}[r] || { c:t.sub, bg:t.bg });

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
const Avatar = ({ label, size=36, color=t.blue, bg=t.blueSoft }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:700, flexShrink:0 }}>
    {label}
  </div>
);

const Chip = ({ label, c, bg }) => (
  <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20, background:bg||t.bg, color:c||t.sub, whiteSpace:"nowrap" }}>{label}</span>
);

const StatBox = ({ icon, label, value, c=t.blue, bg=t.blueSoft }) => (
  <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:"13px 15px", display:"flex", alignItems:"center", gap:11, boxShadow:t.shadow }}>
    <div style={{ width:36, height:36, borderRadius:9, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <i className={`ti ${icon}`} style={{ fontSize:17, color:c }} />
    </div>
    <div>
      <div style={{ fontSize:10, color:t.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:".4px" }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:700, color:t.text, marginTop:2, lineHeight:1 }}>{value}</div>
    </div>
  </div>
);

/* ─── MODAL NOUVEAU MESSAGE ──────────────────────────────────── */
function NouveauMessageModal({ onClose, onSend }) {
  const [step,         setStep]         = useState(1);
  const [destinataires,setDestinataires]= useState([]);
  const [sujet,        setSujet]        = useState("");
  const [texte,        setTexte]        = useState("");
  const [autoriser,    setAutoriser]    = useState(true);
  const [programmer,   setProgrammer]   = useState(false);
  const [notif,        setNotif]        = useState(true);

  const opts = [
    { label:"Parent",     icon:"ti-users",    c:"#059669", bg:"#f0fdf4" },
    { label:"Professeur", icon:"ti-school",   c:"#2563eb", bg:"#eff6ff" },
    { label:"Employé",    icon:"ti-briefcase",c:"#d97706", bg:"#fffbeb" },
    { label:"Classe",     icon:"ti-building", c:"#7c3aed", bg:"#f5f3ff" },
  ];

  const toggle = (l) => setDestinataires(prev => prev.includes(l) ? prev.filter(x=>x!==l) : [...prev,l]);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500 }}>
      <div style={{ background:t.surface, borderRadius:16, padding:28, width:"min(520px,94vw)", boxShadow:"0 20px 60px rgba(0,0,0,0.18)", maxHeight:"88vh", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>Nouveau message</h3>
            <p style={{ margin:0, fontSize:12, color:t.muted, marginTop:3 }}>
              {step===1?"Choisissez les destinataires":"Rédigez votre message"}
            </p>
          </div>
          <button onClick={onClose} style={{ background:t.bg, border:"none", borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub }}>
            <i className="ti ti-x" style={{ fontSize:15 }} />
          </button>
        </div>

        {/* Steps indicator */}
        <div style={{ display:"flex", gap:6, marginBottom:22 }}>
          {[1,2].map(s=>(
            <div key={s} style={{ flex:1, height:3, borderRadius:99, background:step>=s?t.blue:t.border, transition:"background .2s" }} />
          ))}
        </div>

        {step===1 ? (
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:t.sub, marginBottom:12, textTransform:"uppercase", letterSpacing:".4px" }}>Envoyer à</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
              {opts.map(o=>(
                <button key={o.label} onClick={()=>toggle(o.label)} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                  border:`1.5px solid ${destinataires.includes(o.label)?o.c:t.border}`,
                  borderRadius:t.radiusLg, background:destinataires.includes(o.label)?o.bg:t.surface,
                  cursor:"pointer", fontFamily:t.font, transition:"all .15s", textAlign:"left",
                }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:o.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={`ti ${o.icon}`} style={{ fontSize:17, color:o.c }} />
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{o.label}s</div>
                    <div style={{ fontSize:11, color:t.muted, marginTop:1 }}>
                      {destinataires.includes(o.label)
                        ? <span style={{ color:o.c }}>✓ Sélectionné</span>
                        : "Cliquer pour sélectionner"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={onClose} style={{ flex:1, padding:"10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>Annuler</button>
              <button onClick={()=>setStep(2)} disabled={destinataires.length===0}
                style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:destinataires.length?t.blue:"#93c5fd", color:"#fff", fontSize:13, fontWeight:600, cursor:destinataires.length?"pointer":"default", fontFamily:t.font }}>
                Continuer →
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Destinataires sélectionnés */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
              {destinataires.map(d=>{
                const o = opts.find(x=>x.label===d);
                return <Chip key={d} label={`${d}s`} c={o?.c} bg={o?.bg} />;
              })}
            </div>

            {/* Sujet */}
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Sujet</label>
              <input type="text" placeholder="Ex : Convocation réunion parents..." value={sujet} onChange={e=>setSujet(e.target.value)}
                style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text }}
                onFocus={e=>e.currentTarget.style.borderColor=t.blue}
                onBlur={e=>e.currentTarget.style.borderColor=t.border}
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:600, color:t.sub, display:"block", marginBottom:5 }}>Message</label>
              <textarea placeholder="Rédigez votre message ici..." value={texte} onChange={e=>setTexte(e.target.value)} rows={5}
                style={{ width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text, resize:"vertical" }}
                onFocus={e=>e.currentTarget.style.borderColor=t.blue}
                onBlur={e=>e.currentTarget.style.borderColor=t.border}
              />
            </div>

            {/* Options */}
            <div style={{ background:t.bg, borderRadius:10, padding:"12px 14px", marginBottom:18, display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"Autoriser les réponses",   val:autoriser,  set:setAutoriser  },
                { label:"Programmer l'envoi",       val:programmer, set:setProgrammer },
                { label:"Envoyer une notification", val:notif,      set:setNotif      },
              ].map(opt=>(
                <div key={opt.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:t.text }}>{opt.label}</span>
                  <button onClick={()=>opt.set(!opt.val)} style={{
                    width:40, height:22, borderRadius:99, border:"none", cursor:"pointer",
                    background:opt.val?t.blue:t.border, position:"relative", transition:"background .2s",
                  }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:opt.val?21:3, transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setStep(1)} style={{ padding:"10px 16px", border:`1px solid ${t.border}`, borderRadius:9, background:t.surface, fontSize:13, fontWeight:500, cursor:"pointer", color:t.sub, fontFamily:t.font }}>← Retour</button>
              <button onClick={()=>{onSend({destinataires,sujet,texte,autoriser,notif});onClose();}}
                disabled={!texte.trim()||!sujet.trim()}
                style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:texte&&sujet?t.blue:"#93c5fd", color:"#fff", fontSize:13, fontWeight:600, cursor:texte&&sujet?"pointer":"default", fontFamily:t.font, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                <i className="ti ti-send" style={{ fontSize:14 }} /> Envoyer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CONVERSATION VIEW ──────────────────────────────────────── */
function ConversationView({ conv, onRetour, onSend }) {
  const [msg,     setMsg]     = useState("");
  const [autoriser,setAutoriser]= useState(true);
  const bottomRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior:"smooth" }); },[conv]);

  const rc = roleColor(conv.role);

  const envoyer = () => {
    if (!msg.trim()) return;
    onSend(conv.id, msg.trim());
    setMsg("");
  };

  const handleKey = (e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); } };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:t.surface }}>

      {/* ── HEADER CONV ── */}
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:12, background:t.surface, flexShrink:0 }}>
        <button onClick={onRetour} style={{ background:"none", border:"none", cursor:"pointer", color:t.muted, display:"flex", padding:4, borderRadius:6 }}
          title="Retour">
          <i className="ti ti-arrow-left" style={{ fontSize:18 }} />
        </button>

        <div style={{ position:"relative", flexShrink:0 }}>
          <Avatar label={conv.avatar} size={38} color={rc.c} bg={rc.bg} />
          {conv.online && (
            <div style={{ position:"absolute", bottom:0, right:0, width:10, height:10, borderRadius:"50%", background:t.green, border:"2px solid #fff" }} />
          )}
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:600, color:t.text }}>{conv.nom}</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
            <Chip label={conv.role} c={rc.c} bg={rc.bg} />
            <span style={{ fontSize:11, color:conv.online?t.green:t.muted }}>
              {conv.online?"● En ligne":"● Hors ligne"}
            </span>
          </div>
        </div>

        <div style={{ display:"flex", gap:6 }}>
          {[
            { icon:"ti-archive",      title:"Archiver"      },
            { icon:"ti-bell",         title:"Notifications" },
            { icon:"ti-dots-vertical",title:"Plus"          },
          ].map(a=>(
            <button key={a.icon} title={a.title} style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${t.border}`, borderRadius:8, background:t.surface, cursor:"pointer", color:t.sub, transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.background=t.bg;e.currentTarget.style.color=t.text}}
              onMouseLeave={e=>{e.currentTarget.style.background=t.surface;e.currentTarget.style.color=t.sub}}
            >
              <i className={`ti ${a.icon}`} style={{ fontSize:15 }} />
            </button>
          ))}
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={{ flex:1, overflowY:"auto", padding:"18px 20px", display:"flex", flexDirection:"column", gap:10, background:t.bg }}>

        {/* Séparateur date */}
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"6px 0" }}>
          <div style={{ flex:1, height:1, background:t.border }} />
          <span style={{ fontSize:11, color:t.muted, fontWeight:500, padding:"2px 10px", background:t.surface, borderRadius:20, border:`1px solid ${t.border}` }}>
            Aujourd'hui
          </span>
          <div style={{ flex:1, height:1, background:t.border }} />
        </div>

        {conv.messages.map((m,i)=>{
          const isMe = m.from==="me";
          const isAnnonce = m.type==="annonce";
          return (
            <div key={m.id} style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start", gap:8, alignItems:"flex-end" }}>
              {!isMe && <Avatar label={conv.avatar} size={28} color={rc.c} bg={rc.bg} />}
              <div style={{ maxWidth:"68%", display:"flex", flexDirection:"column", alignItems:isMe?"flex-end":"flex-start", gap:3 }}>
                <div style={{
                  padding:isAnnonce?"12px 14px":"10px 14px",
                  borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",
                  background:isMe?t.blue:t.surface,
                  color:isMe?"#fff":t.text, fontSize:13,
                  border:isMe?"none":`1px solid ${t.border}`,
                  boxShadow:isMe?"none":t.shadow,
                  lineHeight:1.5,
                  ...(isAnnonce && { background:"#fffbeb", border:`1px solid #fde68a`, color:t.text }),
                }}>
                  {isAnnonce && <div style={{ fontSize:11, fontWeight:700, color:t.amber, marginBottom:5 }}>📢 ANNONCE</div>}
                  {m.texte}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:10, color:t.muted }}>{m.heure}</span>
                  {isMe && (
                    <i className={`ti ${m.lu?"ti-checks":"ti-check"}`} style={{ fontSize:12, color:m.lu?"#60a5fa":t.muted }} />
                  )}
                </div>
              </div>
              {isMe && (
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1d4ed8,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>
                  DI
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── COMPOSITION ── */}
      <div style={{ padding:"12px 16px", borderTop:`1px solid ${t.border}`, background:t.surface, flexShrink:0 }}>
        {/* Option autoriser réponse */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, padding:"6px 10px", background:t.bg, borderRadius:8 }}>
          <span style={{ fontSize:12, color:t.sub }}>Autoriser les réponses</span>
          <button onClick={()=>setAutoriser(!autoriser)} style={{ width:36, height:20, borderRadius:99, border:"none", cursor:"pointer", background:autoriser?t.blue:t.border, position:"relative", transition:"background .2s" }}>
            <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:autoriser?19:3, transition:"left .2s" }} />
          </button>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          {/* Boutons action */}
          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
            {[
              { icon:"ti-paperclip", title:"Pièce jointe" },
              { icon:"ti-speakerphone", title:"Annonce" },
            ].map(a=>(
              <button key={a.icon} title={a.title} style={{ width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${t.border}`, borderRadius:9, background:t.bg, cursor:"pointer", color:t.sub, transition:"all .15s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=t.blue;e.currentTarget.style.color=t.blue}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.sub}}
              >
                <i className={`ti ${a.icon}`} style={{ fontSize:16 }} />
              </button>
            ))}
          </div>

          {/* Champ texte */}
          <div style={{ flex:1, position:"relative" }}>
            <textarea
              placeholder="Écrire un message..."
              value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={handleKey}
              rows={1} style={{
                width:"100%", padding:"9px 12px", border:`1px solid ${t.border}`,
                borderRadius:9, fontSize:13, outline:"none", resize:"none",
                fontFamily:t.font, color:t.text, boxSizing:"border-box",
                transition:"border .15s",
              }}
              onFocus={e=>e.currentTarget.style.borderColor=t.blue}
              onBlur={e=>e.currentTarget.style.borderColor=t.border}
            />
          </div>

          {/* Envoyer */}
          <button onClick={envoyer} disabled={!msg.trim()} style={{
            width:38, height:38, borderRadius:9, border:"none",
            background:msg.trim()?t.blue:"#93c5fd", color:"#fff",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:msg.trim()?"pointer":"default", flexShrink:0,
            boxShadow:msg.trim()?`0 2px 8px rgba(37,99,235,0.3)`:"none",
            transition:"all .15s",
          }}>
            <i className="ti ti-send" style={{ fontSize:16 }} />
          </button>
        </div>
        <div style={{ fontSize:11, color:t.muted, marginTop:6, textAlign:"center" }}>
          Appuyez sur Entrée pour envoyer · Maj+Entrée pour une nouvelle ligne
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE PRINCIPALE ────────────────────────────────────────── */
export default function Messages() {
  const [convs,       setConvs]       = useState(CONVS);
  const [activeConv,  setActiveConv]  = useState(null);
  const [filtre,      setFiltre]      = useState("Tous");
  const [search,      setSearch]      = useState("");
  const [newModal,    setNewModal]    = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),2500); };

  const filtres = [
    { key:"Tous",        icon:"ti-message-circle", label:"Tous"       },
    { key:"NonLu",       icon:"ti-circle-dot",     label:"Non lus"    },
    { key:"Parent",      icon:"ti-users",          label:"Parents"    },
    { key:"Professeur",  icon:"ti-school",         label:"Profs"      },
    { key:"Employé",     icon:"ti-briefcase",      label:"Employés"   },
    { key:"Groupe",      icon:"ti-building",       label:"Groupes"    },
    { key:"Archivé",     icon:"ti-archive",        label:"Archivés"   },
  ];

  const filteredConvs = convs.filter(c=>{
    const ms = `${c.nom} ${c.dernier}`.toLowerCase().includes(search.toLowerCase());
    const mf = filtre==="Tous"       ? !c.archive
             : filtre==="NonLu"      ? c.nonLu>0 && !c.archive
             : filtre==="Archivé"    ? c.archive
             : c.role===filtre && !c.archive;
    return ms && mf;
  });

  const totalNonLu = convs.filter(c=>!c.archive).reduce((a,c)=>a+c.nonLu,0);
  const totalEnvoyes = convs.reduce((a,c)=>a+c.messages.filter(m=>m.from==="me").length,0);
  const totalLus    = convs.reduce((a,c)=>a+c.messages.filter(m=>m.lu).length,0);
  const totalMsgs   = convs.reduce((a,c)=>a+c.messages.length,0);
  const tauxLecture = totalMsgs ? Math.round((totalLus/totalMsgs)*100) : 0;

  const handleSend = (convId, texte) => {
    setConvs(prev=>prev.map(c=>{
      if (c.id!==convId) return c;
      const newMsg = { id:Date.now(), from:"me", texte, heure:new Date().toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"}), lu:false };
      return { ...c, messages:[...c.messages,newMsg], dernier:texte, nonLu:0 };
    }));
    showToast("Message envoyé");
  };

  const handleNewMessage = ({ destinataires, sujet, texte }) => {
    showToast(`Message envoyé à ${destinataires.join(", ")}`);
  };

  const openConv = (c) => {
    setActiveConv(c);
    setConvs(prev=>prev.map(x=>x.id===c.id?{...x,nonLu:0}:x));
    setShowSidebar(false);
  };

  const currentConv = activeConv ? convs.find(c=>c.id===activeConv.id) : null;

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
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Messages</h1>
          <p style={{ fontSize:13, color:t.sub, marginTop:4, margin:0 }}>
            Communiquez avec les parents, professeurs et personnel
            {totalNonLu>0 && <span style={{ marginLeft:8, fontSize:11, fontWeight:700, color:"#fff", background:t.red, padding:"1px 7px", borderRadius:20 }}>{totalNonLu} non lus</span>}
          </p>
        </div>
        <button onClick={()=>setNewModal(true)} style={{ display:"flex", alignItems:"center", gap:7, background:t.blue, color:"#fff", border:"none", borderRadius:t.radius, padding:"10px 18px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font, boxShadow:`0 2px 8px rgba(37,99,235,0.25)` }}>
          <i className="ti ti-pencil-plus" style={{ fontSize:14 }} /> Nouveau message
        </button>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:20 }}>
        <StatBox icon="ti-send"         label="Envoyés"     value={totalEnvoyes}     c={t.blue}   bg={t.blueSoft}   />
        <StatBox icon="ti-eye"          label="Lus"         value={totalLus}         c={t.green}  bg={t.greenSoft}  />
        <StatBox icon="ti-clock"        label="Non lus"     value={totalNonLu}       c={t.amber}  bg={t.amberSoft}  />
        <StatBox icon="ti-chart-bar"    label="Taux lecture" value={`${tauxLecture}%`} c={t.purple} bg={t.purpleSoft} />
      </div>

      {/* LAYOUT 2 COLONNES */}
      <div style={{ display:"grid", gridTemplateColumns:currentConv?"1fr":"1fr", gap:0 }}>
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radiusLg, overflow:"hidden", boxShadow:t.shadow, display:"flex", height:"calc(100vh - 280px)", minHeight:480 }}>

          {/* ── COLONNE GAUCHE : LISTE ── */}
          <div style={{
            width:320, minWidth:280, flexShrink:0,
            borderRight:`1px solid ${t.border}`,
            display:"flex", flexDirection:"column",
            ...(currentConv && window.innerWidth<640 ? { display:"none" } : {}),
          }}>
            {/* Recherche */}
            <div style={{ padding:"12px 12px 8px", borderBottom:`1px solid ${t.border}` }}>
              <div style={{ position:"relative" }}>
                <i className="ti ti-search" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.muted, fontSize:14 }} />
                <input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}
                  style={{ width:"100%", padding:"8px 10px 8px 30px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:t.font, color:t.text, background:t.bg }}
                  onFocus={e=>e.currentTarget.style.borderColor=t.blue}
                  onBlur={e=>e.currentTarget.style.borderColor=t.border}
                />
              </div>
            </div>

            {/* Filtres */}
            <div style={{ padding:"8px 10px", borderBottom:`1px solid ${t.border}`, display:"flex", gap:4, flexWrap:"wrap" }}>
              {filtres.map(f=>(
                <button key={f.key} onClick={()=>setFiltre(f.key)} style={{
                  display:"flex", alignItems:"center", gap:4, padding:"4px 9px",
                  border:`1px solid ${filtre===f.key?t.blue:t.border}`,
                  borderRadius:20, background:filtre===f.key?t.blueSoft:t.surface,
                  color:filtre===f.key?t.blue:t.sub, fontSize:11, fontWeight:filtre===f.key?600:400,
                  cursor:"pointer", fontFamily:t.font, transition:"all .15s",
                }}>
                  <i className={`ti ${f.icon}`} style={{ fontSize:12 }} />
                  {f.label}
                </button>
              ))}
            </div>

            {/* Liste conversations */}
            <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
              {filteredConvs.length===0 ? (
                <div style={{ padding:32, textAlign:"center", color:t.muted, fontSize:13 }}>
                  <i className="ti ti-message-circle" style={{ fontSize:28, display:"block", marginBottom:8, color:t.border }} />
                  Aucun message
                </div>
              ) : filteredConvs.map(c=>{
                const rc  = roleColor(c.role);
                const isActive = currentConv?.id===c.id;
                return (
                  <div key={c.id} onClick={()=>openConv(c)} style={{
                    display:"flex", alignItems:"flex-start", gap:11, padding:"12px 14px",
                    cursor:"pointer", transition:"background .12s",
                    background:isActive?t.blueSoft:"transparent",
                    borderBottom:`1px solid ${t.border}`,
                    borderLeft:`3px solid ${isActive?t.blue:"transparent"}`,
                  }}
                    onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background=t.bg; }}
                    onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="transparent"; }}
                  >
                    {/* Avatar + online */}
                    <div style={{ position:"relative", flexShrink:0 }}>
                      <Avatar label={c.avatar} size={38} color={rc.c} bg={rc.bg} />
                      {c.online && <div style={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", background:t.green, border:"2px solid #fff" }} />}
                    </div>

                    {/* Contenu */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6 }}>
                        <div style={{ fontSize:13, fontWeight:c.nonLu>0?700:500, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                          {c.nom}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
                          <span style={{ fontSize:10, color:t.muted }}>{c.heure}</span>
                          {c.nonLu>0 && (
                            <span style={{ width:18, height:18, borderRadius:"50%", background:t.blue, color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              {c.nonLu}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:5, alignItems:"center", marginTop:3 }}>
                        <Chip label={c.role} c={rc.c} bg={rc.bg} />
                        <span style={{ fontSize:11, color:t.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                          {c.dernier}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── COLONNE DROITE : CONVERSATION ── */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {currentConv ? (
              <ConversationView
                conv={currentConv}
                onRetour={()=>{ setActiveConv(null); setShowSidebar(true); }}
                onSend={handleSend}
              />
            ) : (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, color:t.muted, padding:32, background:t.bg }}>
                <div style={{ width:64, height:64, borderRadius:16, background:t.surface, border:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:t.shadow }}>
                  <i className="ti ti-message-circle" style={{ fontSize:30, color:t.border }} />
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:15, fontWeight:600, color:t.sub, marginBottom:6 }}>Sélectionnez une conversation</div>
                  <div style={{ fontSize:13, color:t.muted }}>Choisissez un message dans la liste ou créez-en un nouveau</div>
                </div>
                <button onClick={()=>setNewModal(true)} style={{ display:"flex", alignItems:"center", gap:7, background:t.blue, color:"#fff", border:"none", borderRadius:t.radius, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:t.font, boxShadow:`0 2px 8px rgba(37,99,235,0.25)` }}>
                  <i className="ti ti-pencil-plus" style={{ fontSize:14 }} /> Nouveau message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL NOUVEAU MESSAGE */}
      {newModal && <NouveauMessageModal onClose={()=>setNewModal(false)} onSend={handleNewMessage} />}
    </div>
  );
}