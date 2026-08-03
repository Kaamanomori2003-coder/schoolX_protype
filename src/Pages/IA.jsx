import { useState, useRef, useEffect, useCallback } from "react";

/* ─── THEME ──────────────────────────────────────────────────── */
const t = {
  bg:"#f7f8fa", surface:"#ffffff", border:"#eaecf0",
  blue:"#2563eb", blueSoft:"#eff6ff", blueMid:"#dbeafe",
  blueDark:"#1a3ed4",
  text:"#111827", sub:"#6b7280", muted:"#9ca3af",
  green:"#059669", greenSoft:"#f0fdf4",
  radius:"12px", radiusLg:"18px",
  shadow:"0 1px 3px rgba(0,0,0,0.06)",
  shadowMd:"0 4px 16px rgba(0,0,0,0.08)",
  font:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

/* ─── SUGGESTIONS ────────────────────────────────────────────── */
const SUGGESTIONS = [
  { icon:"ti-file-text",      label:"Créer un bulletin",        prompt:"Aide-moi à rédiger un bulletin scolaire pour un élève de Terminale." },
  { icon:"ti-speakerphone",   label:"Rédiger une annonce",      prompt:"Rédige une annonce professionnelle pour informer les parents d'une réunion." },
  { icon:"ti-book",           label:"Préparer un cours",        prompt:"Aide-moi à préparer un plan de cours sur les mathématiques pour la Terminale." },
  { icon:"ti-chart-bar",      label:"Analyser les résultats",   prompt:"Comment analyser et améliorer les résultats scolaires de ma classe ?" },
  { icon:"ti-calendar",       label:"Emploi du temps",          prompt:"Comment créer un emploi du temps optimal pour un lycée avec 8 classes ?" },
  { icon:"ti-message-circle", label:"Répondre à un parent",     prompt:"Aide-moi à rédiger une réponse professionnelle à un parent mécontent." },
];

/* ─── HISTORIQUE MOCK ────────────────────────────────────────── */
const HIST_INIT = [
  { id:1, titre:"Bulletin élève Aminata",    date:"Aujourd'hui",     apercu:"Aide-moi à rédiger un bulletin…", epingle:true  },
  { id:2, titre:"Analyse des résultats T1",  date:"Aujourd'hui",     apercu:"Comment analyser les résultats…", epingle:false },
  { id:3, titre:"Annonce réunion parents",   date:"Hier",            apercu:"Rédige une annonce pour…",        epingle:false },
  { id:4, titre:"Plan de cours Maths",       date:"Hier",            apercu:"Prépare un plan de cours…",       epingle:false },
  { id:5, titre:"Emploi du temps optimal",   date:"Cette semaine",   apercu:"Comment créer un emploi…",        epingle:false },
  { id:6, titre:"Réponse parent Bah",        date:"Cette semaine",   apercu:"Aide-moi à rédiger une réponse…", epingle:false },
  { id:7, titre:"Rapport mensuel jan. 2025", date:"Ce mois-ci",      apercu:"Fais un résumé des activités…",   epingle:false },
];

/* ─── FORMATER TEXTE IA (markdown simple) ───────────────────── */
function FormatText({ text }) {
  const lines = text.split("\n");
  return (
    <div style={{ lineHeight:1.7 }}>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <div key={i} style={{ fontWeight:700, fontSize:15, color:t.text, margin:"10px 0 4px" }}>{line.replace("## ","")}</div>;
        if (line.startsWith("# "))  return <div key={i} style={{ fontWeight:800, fontSize:16, color:t.text, margin:"12px 0 6px" }}>{line.replace("# ","")}</div>;
        if (line.startsWith("- ") || line.startsWith("• ")) return (
          <div key={i} style={{ display:"flex", gap:8, margin:"3px 0" }}>
            <span style={{ color:t.blue, fontWeight:700, flexShrink:0 }}>•</span>
            <span>{line.replace(/^[-•] /,"")}</span>
          </div>
        );
        if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontWeight:700 }}>{line.slice(2,-2)}</div>;
        if (line.trim()==="") return <div key={i} style={{ height:6 }} />;
        // Gras inline
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <div key={i}>
            {parts.map((p, j) =>
              p.startsWith("**") && p.endsWith("**")
                ? <strong key={j}>{p.slice(2,-2)}</strong>
                : <span key={j}>{p}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── DOTS ANIMATION ─────────────────────────────────────────── */
function ThinkingDots() {
  return (
    <div style={{ display:"flex", gap:5, alignItems:"center", padding:"14px 18px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:"18px 18px 18px 4px", boxShadow:t.shadow }}>
      <style>{`
        @keyframes dot-bounce {
          0%,80%,100%{ transform:translateY(0); opacity:.4 }
          40%        { transform:translateY(-6px); opacity:1 }
        }
      `}</style>
      {[0,1,2].map(i=>(
        <div key={i} style={{
          width:8, height:8, borderRadius:"50%", background:t.blue,
          animation:`dot-bounce 1.2s ease-in-out infinite`,
          animationDelay:`${i*0.18}s`,
        }} />
      ))}
      <span style={{ fontSize:12, color:t.muted, marginLeft:6, fontStyle:"italic" }}>SchoolX AI réfléchit…</span>
    </div>
  );
}

/* ─── AVATAR IA ──────────────────────────────────────────────── */
const AIAvatar = ({ size=32 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${t.blueDark},${t.blue})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 2px 8px rgba(37,99,235,0.3)` }}>
    <i className="ti ti-sparkles" style={{ fontSize:size*0.45, color:"#fff" }} />
  </div>
);

/* ─── PAGE PRINCIPALE ────────────────────────────────────────── */
export default function IA() {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [hist,        setHist]        = useState(HIST_INIT);
  const [histSearch,  setHistSearch]  = useState("");
  const [menuMsg,     setMenuMsg]     = useState(null); // id message avec menu ouvert
  const [copiedId,    setCopiedId]    = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [userScrolled, setUserScrolled]   = useState(false);
  const [histMenu,    setHistMenu]    = useState(null);
  const [renameId,    setRenameId]    = useState(null);
  const [renameVal,   setRenameVal]   = useState("");

  const messagesEndRef = useRef(null);
  const scrollAreaRef  = useRef(null);
  const textareaRef    = useRef(null);
  const msgIdRef       = useRef(0);

  /* ── Auto-scroll ── */
  const scrollToBottom = useCallback((force=false) => {
    if (!userScrolled || force) {
      messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
    }
  }, [userScrolled]);

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setShowScrollBtn(!atBottom);
    setUserScrolled(!atBottom);
  };

  /* ── Auto-resize textarea ── */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  /* ── Copier message ── */
  const copyMsg = (id, text) => {
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopiedId(id);
    setTimeout(()=>setCopiedId(null), 2000);
  };

  /* ── Envoyer message ── */
  const sendMessage = async (texte) => {
    const userMsg = texte || input.trim();
    if (!userMsg || loading) return;

    const uid = ++msgIdRef.current;
    const aid = ++msgIdRef.current;

    const newMsgs = [...messages, { id:uid, role:"user", text:userMsg, ts:new Date() }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    setUserScrolled(false);

    // Ajouter à l'historique
    setHist(prev=>[
      { id:Date.now(), titre:userMsg.slice(0,40)+(userMsg.length>40?"…":""), date:"Aujourd'hui", apercu:userMsg, epingle:false },
      ...prev,
    ]);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system:`Tu es SchoolX AI, l'assistant intelligent intégré à SchoolX, une plateforme SaaS de gestion scolaire en Afrique francophone (Guinée).
Tu aides les directeurs d'école avec : gestion des élèves, professeurs, notes, paiements, bulletins, emplois du temps, annonces, documents.
Réponds toujours en français, de façon claire, structurée et professionnelle.
Utilise des listes et titres en markdown quand c'est pertinent.
Sois concis, précis et bienveillant.`,
          messages: newMsgs.map(m=>({ role:m.role==="user"?"user":"assistant", content:m.text })),
        }),
      });

      const data    = await response.json();
      const reponse = data.content?.[0]?.text || "Désolé, je n'ai pas pu générer de réponse.";
      setMessages(prev=>[...prev, { id:aid, role:"assistant", text:reponse, ts:new Date() }]);
    } catch {
      setMessages(prev=>[...prev, { id:aid, role:"assistant", text:"❌ Erreur de connexion. Vérifiez votre connexion internet et réessayez.", ts:new Date() }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* ── Historique filtré ── */
  const filteredHist = hist.filter(h=>h.titre.toLowerCase().includes(histSearch.toLowerCase()));
  const grouped = {
    "Aujourd'hui":  filteredHist.filter(h=>h.date==="Aujourd'hui"),
    "Hier":         filteredHist.filter(h=>h.date==="Hier"),
    "Cette semaine":filteredHist.filter(h=>h.date==="Cette semaine"),
    "Ce mois-ci":   filteredHist.filter(h=>h.date==="Ce mois-ci"),
  };
  const epingles = filteredHist.filter(h=>h.epingle);

  const toggleEpingle = (id) => setHist(prev=>prev.map(h=>h.id===id?{...h,epingle:!h.epingle}:h));
  const deleteHist    = (id) => setHist(prev=>prev.filter(h=>h.id!==id));
  const renameHist    = (id, val) => { setHist(prev=>prev.map(h=>h.id===id?{...h,titre:val}:h)); setRenameId(null); };

  return (
    <div style={{ fontFamily:t.font, color:t.text, height:"calc(100vh - 64px - 56px)", display:"flex", gap:0, overflow:"hidden", borderRadius:t.radiusLg, border:`1px solid ${t.border}`, background:t.surface, boxShadow:t.shadowMd }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes dot-bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-6px);opacity:1}}
        .msg-hover:hover .msg-actions { opacity:1!important; }
        .hist-item:hover { background:#f8fafc!important; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:99px; }
      `}</style>

      {/* ══════════════════════════════════════
          SIDEBAR HISTORIQUE
      ══════════════════════════════════════ */}
      {showSidebar && (
        <div style={{ width:240, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", background:t.bg, flexShrink:0, animation:"slideIn .25s ease" }}>
          {/* Header sidebar */}
          <div style={{ padding:"14px 14px 10px", borderBottom:`1px solid ${t.border}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:700, color:t.text }}>Historique</div>
              <button onClick={()=>{ setMessages([]); }} title="Nouvelle conversation"
                style={{ width:28, height:28, borderRadius:8, border:`1px solid ${t.border}`, background:t.surface, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub, transition:"all .15s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=t.blueSoft;e.currentTarget.style.color=t.blue;e.currentTarget.style.borderColor=t.blueMid;}}
                onMouseLeave={e=>{e.currentTarget.style.background=t.surface;e.currentTarget.style.color=t.sub;e.currentTarget.style.borderColor=t.border;}}
              >
                <i className="ti ti-plus" style={{ fontSize:14 }} />
              </button>
            </div>
            {/* Recherche */}
            <div style={{ position:"relative" }}>
              <i className="ti ti-search" style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", fontSize:13, color:t.muted }} />
              <input type="text" placeholder="Rechercher…" value={histSearch} onChange={e=>setHistSearch(e.target.value)}
                style={{ width:"100%", padding:"7px 8px 7px 28px", border:`1px solid ${t.border}`, borderRadius:8, fontSize:12, outline:"none", boxSizing:"border-box", fontFamily:t.font, background:t.surface, color:t.text }}
                onFocus={e=>e.currentTarget.style.borderColor=t.blue}
                onBlur={e=>e.currentTarget.style.borderColor=t.border}
              />
            </div>
          </div>

          {/* Listes */}
          <div style={{ flex:1, overflowY:"auto", padding:"8px 8px" }}>

            {/* Épinglés */}
            {epingles.length>0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".6px", padding:"4px 8px", marginBottom:4 }}>Épinglés</div>
                {epingles.map(h=>(<HistItem key={h.id} h={h} menuId={histMenu} setMenuId={setHistMenu} renameId={renameId} renameVal={renameVal} setRenameId={setRenameId} setRenameVal={setRenameVal} onRename={renameHist} onDelete={deleteHist} onToggleEpingle={toggleEpingle} />))}
              </div>
            )}

            {/* Groupes */}
            {Object.entries(grouped).map(([grp,items])=> items.filter(h=>!h.epingle).length>0 && (
              <div key={grp} style={{ marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:".6px", padding:"4px 8px", marginBottom:4 }}>{grp}</div>
                {items.filter(h=>!h.epingle).map(h=>(<HistItem key={h.id} h={h} menuId={histMenu} setMenuId={setHistMenu} renameId={renameId} renameVal={renameVal} setRenameId={setRenameId} setRenameVal={setRenameVal} onRename={renameHist} onDelete={deleteHist} onToggleEpingle={toggleEpingle} />))}
              </div>
            ))}

            {filteredHist.length===0 && (
              <div style={{ padding:"20px 8px", textAlign:"center", fontSize:12, color:t.muted }}>
                <i className="ti ti-search" style={{ fontSize:22, display:"block", marginBottom:6, color:t.border }} />
                Aucun résultat
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          ZONE PRINCIPALE
      ══════════════════════════════════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* ── TOP BAR ── */}
        <div style={{ padding:"12px 20px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, background:t.surface }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={()=>setShowSidebar(!showSidebar)}
              style={{ width:32, height:32, borderRadius:8, border:`1px solid ${t.border}`, background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.sub, transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.background=t.bg;e.currentTarget.style.color=t.text;}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=t.sub;}}
            >
              <i className={`ti ${showSidebar?"ti-layout-sidebar-left-collapse":"ti-layout-sidebar-left-expand"}`} style={{ fontSize:16 }} />
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <AIAvatar size={30} />
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:t.text, lineHeight:1 }}>SchoolX AI</div>
                <div style={{ fontSize:10, color:t.green, fontWeight:600, marginTop:2, display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:t.green }} />
                  En ligne
                </div>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:6 }}>
            <button title="Nouvelle conversation" onClick={()=>setMessages([])} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", border:`1px solid ${t.border}`, borderRadius:8, background:t.surface, fontSize:12, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font, transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.background=t.blueSoft;e.currentTarget.style.color=t.blue;e.currentTarget.style.borderColor=t.blueMid;}}
              onMouseLeave={e=>{e.currentTarget.style.background=t.surface;e.currentTarget.style.color=t.sub;e.currentTarget.style.borderColor=t.border;}}
            >
              <i className="ti ti-plus" style={{ fontSize:13 }} /> Nouvelle
            </button>
          </div>
        </div>

        {/* ── ZONE MESSAGES ── */}
        <div ref={scrollAreaRef} onScroll={handleScroll} style={{ flex:1, overflowY:"auto", padding:"24px 0", position:"relative" }}>

          {/* PAGE VIDE */}
          {messages.length===0 && (
            <div style={{ maxWidth:620, margin:"0 auto", padding:"0 24px", animation:"fadeUp .5s ease" }}>
              {/* Logo central */}
              <div style={{ textAlign:"center", marginBottom:36 }}>
                <div style={{ width:72, height:72, borderRadius:20, background:`linear-gradient(135deg,${t.blueDark},${t.blue})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:`0 8px 28px rgba(37,99,235,0.35)` }}>
                  <i className="ti ti-sparkles" style={{ fontSize:34, color:"#fff" }} />
                </div>
                <h2 style={{ fontSize:24, fontWeight:800, color:t.text, margin:"0 0 8px", letterSpacing:"-0.4px" }}>Comment puis-je vous aider aujourd'hui ?</h2>
                <p style={{ fontSize:14, color:t.muted, margin:0 }}>Posez-moi n'importe quelle question sur la gestion de votre école.</p>
              </div>

              {/* Suggestions */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {SUGGESTIONS.map((s,i)=>(
                  <button key={s.label} onClick={()=>sendMessage(s.prompt)} style={{
                    display:"flex", alignItems:"flex-start", gap:12, padding:"14px 16px",
                    border:`1px solid ${t.border}`, borderRadius:t.radiusLg,
                    background:t.surface, cursor:"pointer", textAlign:"left",
                    fontFamily:t.font, transition:"all .2s",
                    animation:`fadeUp .4s ease ${i*60}ms both`,
                    boxShadow:t.shadow,
                  }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=t.blue; e.currentTarget.style.background=t.blueSoft; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 6px 20px rgba(37,99,235,0.12)`; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=t.border; e.currentTarget.style.background=t.surface; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=t.shadow; }}
                  >
                    <div style={{ width:34, height:34, borderRadius:10, background:t.blueSoft, border:`1px solid ${t.blueMid}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={`ti ${s.icon}`} style={{ fontSize:16, color:t.blue }} />
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:3 }}>{s.label}</div>
                      <div style={{ fontSize:11, color:t.muted, lineHeight:1.4 }}>{s.prompt.slice(0,55)}…</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          <div style={{ maxWidth:700, margin:"0 auto", padding:"0 20px", display:"flex", flexDirection:"column", gap:20 }}>
            {messages.map((msg)=>(
              <div key={msg.id} className="msg-hover" style={{ display:"flex", flexDirection:msg.role==="user"?"row-reverse":"row", gap:10, alignItems:"flex-end", animation:"fadeUp .3s ease" }}>

                {/* Avatar IA */}
                {msg.role==="assistant" && <AIAvatar size={30} />}

                {/* Avatar user */}
                {msg.role==="user" && (
                  <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#374151,#111827)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, fontWeight:700, color:"#fff" }}>
                    DI
                  </div>
                )}

                <div style={{ maxWidth:"75%", display:"flex", flexDirection:"column", alignItems:msg.role==="user"?"flex-end":"flex-start", gap:4 }}>
                  {/* Bulle */}
                  <div style={{
                    padding:"12px 16px", position:"relative",
                    borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                    background:msg.role==="user"?`linear-gradient(135deg,${t.blue},${t.blueDark})`:`${t.surface}`,
                    color:msg.role==="user"?"#fff":t.text,
                    fontSize:13, lineHeight:1.6,
                    border:msg.role==="user"?"none":`1px solid ${t.border}`,
                    boxShadow:msg.role==="user"?`0 4px 16px rgba(37,99,235,0.25)`:t.shadow,
                  }}>
                    {msg.role==="assistant"
                      ? <FormatText text={msg.text} />
                      : <span>{msg.text}</span>
                    }
                  </div>

                  {/* Actions message */}
                  <div className="msg-actions" style={{ display:"flex", gap:4, opacity:0, transition:"opacity .15s" }}>
                    <button onClick={()=>copyMsg(msg.id, msg.text)} title="Copier" style={{ padding:"3px 8px", border:`1px solid ${t.border}`, borderRadius:6, background:t.surface, fontSize:10, fontWeight:600, cursor:"pointer", color:copiedId===msg.id?t.green:t.muted, fontFamily:t.font, display:"flex", alignItems:"center", gap:4, transition:"all .15s" }}>
                      <i className={`ti ${copiedId===msg.id?"ti-check":"ti-copy"}`} style={{ fontSize:11 }} />
                      {copiedId===msg.id?"Copié":"Copier"}
                    </button>
                    {msg.role==="assistant" && (
                      <button onClick={()=>{ const last=messages.filter(m=>m.role==="user").pop(); if(last) sendMessage(last.text); }} title="Régénérer" style={{ padding:"3px 8px", border:`1px solid ${t.border}`, borderRadius:6, background:t.surface, fontSize:10, fontWeight:600, cursor:"pointer", color:t.muted, fontFamily:t.font, display:"flex", alignItems:"center", gap:4 }}>
                        <i className="ti ti-refresh" style={{ fontSize:11 }} /> Régénérer
                      </button>
                    )}
                    <div style={{ display:"flex", gap:2 }}>
                      {["👍","👎"].map(e=>(
                        <button key={e} style={{ padding:"3px 6px", border:`1px solid ${t.border}`, borderRadius:6, background:t.surface, fontSize:11, cursor:"pointer" }}>{e}</button>
                      ))}
                    </div>
                    <span style={{ fontSize:10, color:t.muted, padding:"3px 6px", display:"flex", alignItems:"center" }}>
                      {msg.ts?.toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"})}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display:"flex", gap:10, alignItems:"flex-end", animation:"fadeIn .3s ease" }}>
                <AIAvatar size={30} />
                <ThinkingDots />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bouton scroll bas */}
        {showScrollBtn && (
          <div style={{ position:"absolute", bottom:100, left:"50%", transform:"translateX(-50%)", zIndex:10, animation:"fadeIn .2s ease" }}>
            <button onClick={()=>{ setUserScrolled(false); scrollToBottom(true); }}
              style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", border:`1px solid ${t.border}`, borderRadius:99, background:t.surface, boxShadow:t.shadowMd, fontSize:12, fontWeight:600, cursor:"pointer", color:t.sub, fontFamily:t.font }}>
              <i className="ti ti-arrow-down" style={{ fontSize:13 }} /> Revenir au dernier message
            </button>
          </div>
        )}

        {/* ── COMPOSER ── */}
        <div style={{ padding:"12px 20px 14px", borderTop:`1px solid ${t.border}`, background:t.surface, flexShrink:0 }}>
          <div style={{ maxWidth:700, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, background:t.bg, border:`1.5px solid ${t.border}`, borderRadius:28, padding:"10px 14px", transition:"border .2s, box-shadow .2s" }}
              onFocusCapture={e=>{ e.currentTarget.style.borderColor=t.blue; e.currentTarget.style.boxShadow=`0 0 0 3px rgba(37,99,235,0.1)`; }}
              onBlurCapture={e=>{ e.currentTarget.style.borderColor=t.border; e.currentTarget.style.boxShadow="none"; }}
            >
              {/* Bouton pièce jointe */}
              <button title="Joindre un fichier" style={{ width:32, height:32, borderRadius:9, border:`1px solid ${t.border}`, background:t.surface, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.muted, flexShrink:0, transition:"all .15s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=t.blueSoft;e.currentTarget.style.color=t.blue;e.currentTarget.style.borderColor=t.blueMid;}}
                onMouseLeave={e=>{e.currentTarget.style.background=t.surface;e.currentTarget.style.color=t.muted;e.currentTarget.style.borderColor=t.border;}}
              >
                <i className="ti ti-paperclip" style={{ fontSize:15 }} />
              </button>

              {/* Textarea auto-grow */}
              <textarea
                ref={textareaRef}
                placeholder="Posez votre question…"
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                style={{
                  flex:1, border:"none", outline:"none", resize:"none",
                  fontSize:14, fontFamily:t.font, color:t.text,
                  background:"transparent", lineHeight:1.6,
                  maxHeight:140, overflowY:"auto",
                  padding:"4px 0",
                }}
              />

              {/* Bouton envoyer */}
              <button
                onClick={()=>sendMessage()}
                disabled={!input.trim()||loading}
                style={{
                  width:36, height:36, borderRadius:"50%", border:"none",
                  background:input.trim()&&!loading?`linear-gradient(135deg,${t.blue},${t.blueDark})`:"#e5e7eb",
                  color:input.trim()&&!loading?"#fff":"#9ca3af",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:input.trim()&&!loading?"pointer":"not-allowed",
                  flexShrink:0, transition:"all .2s",
                  boxShadow:input.trim()&&!loading?`0 2px 10px rgba(37,99,235,0.4)`:"none",
                }}
                onMouseEnter={e=>{ if(input.trim()&&!loading){ e.currentTarget.style.transform="scale(1.08)"; e.currentTarget.style.boxShadow=`0 4px 16px rgba(37,99,235,0.5)`; } }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=input.trim()&&!loading?`0 2px 10px rgba(37,99,235,0.4)`:"none"; }}
              >
                <i className="ti ti-send" style={{ fontSize:16 }} />
              </button>
            </div>

            {/* Info bas */}
            <div style={{ textAlign:"center", fontSize:11, color:t.muted, marginTop:8 }}>
              Entrée pour envoyer · Maj+Entrée pour un saut de ligne · SchoolX AI peut faire des erreurs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ITEM HISTORIQUE ────────────────────────────────────────── */
function HistItem({ h, menuId, setMenuId, renameId, renameVal, setRenameId, setRenameVal, onRename, onDelete, onToggleEpingle }) {
  const isMenu = menuId===h.id;
  const isRename = renameId===h.id;
  return (
    <div className="hist-item" style={{ position:"relative", borderRadius:9, transition:"background .15s", marginBottom:2 }}>
      {isRename ? (
        <div style={{ padding:"6px 8px" }}>
          <input autoFocus value={renameVal} onChange={e=>setRenameVal(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") onRename(h.id,renameVal); if(e.key==="Escape") setRenameId(null); }}
            style={{ width:"100%", padding:"5px 8px", border:`1.5px solid #2563eb`, borderRadius:7, fontSize:12, outline:"none", boxSizing:"border-box", fontFamily:"'Inter',sans-serif" }}
            onBlur={()=>onRename(h.id,renameVal)}
          />
        </div>
      ) : (
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 8px", cursor:"pointer", borderRadius:9 }}>
          {h.epingle && <i className="ti ti-pin" style={{ fontSize:10, color:"#2563eb", flexShrink:0 }} />}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:500, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.titre}</div>
            <div style={{ fontSize:10, color:"#9ca3af", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.apercu}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();setMenuId(isMenu?null:h.id);}} style={{ width:22, height:22, borderRadius:5, border:"none", background:"transparent", cursor:"pointer", color:"#9ca3af", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <i className="ti ti-dots-vertical" style={{ fontSize:13 }} />
          </button>
        </div>
      )}
      {/* Dropdown menu */}
      {isMenu && (
        <div style={{ position:"absolute", right:4, top:34, background:"#fff", border:"1px solid #eaecf0", borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,0.1)", zIndex:50, minWidth:150, overflow:"hidden", animation:"fadeIn .15s ease" }}>
          {[
            { icon:"ti-pencil",   label:"Renommer",  action:()=>{ setRenameId(h.id); setRenameVal(h.titre); setMenuId(null); } },
            { icon:"ti-pin",      label:h.epingle?"Désépingler":"Épingler", action:()=>{ onToggleEpingle(h.id); setMenuId(null); } },
            { icon:"ti-trash",    label:"Supprimer", action:()=>{ onDelete(h.id); setMenuId(null); }, danger:true },
          ].map(item=>(
            <button key={item.label} onClick={item.action} style={{ width:"100%", padding:"9px 14px", border:"none", background:"transparent", fontSize:12, fontWeight:500, cursor:"pointer", color:item.danger?"#dc2626":"#111827", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", gap:8, textAlign:"left", transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=item.danger?"#fef2f2":"#f8fafc"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize:13 }} />{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}