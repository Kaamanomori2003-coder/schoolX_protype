import { useState } from "react";

const suggestions = [
  "Quels élèves ont les notes les plus basses ?",
  "Donne-moi un résumé des paiements du mois",
  "Comment améliorer les résultats scolaires ?",
  "Quels professeurs sont absents aujourd'hui ?",
];

export default function IA() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Bonjour ! Je suis l'assistant IA de SchoolX. Je peux vous aider à analyser les données de votre école, répondre à vos questions et vous donner des conseils. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (texte) => {
    const userMsg = texte || input.trim();
    if (!userMsg) return;

    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Tu es l'assistant IA de SchoolX, un logiciel de gestion scolaire en Guinée. Tu aides les administrateurs avec les élèves, notes, paiements, professeurs et dépenses. Réponds toujours en français, de façon claire et concise.",
          messages: newMessages.map(m => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await response.json();
      const reponse = data.content?.[0]?.text || "Désolé, je n'ai pas pu répondre.";
      setMessages([...newMessages, { role: "assistant", text: reponse }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", text: "Erreur de connexion. Vérifiez votre connexion internet." }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: "#1a3ed4", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-sparkles" style={{ color: "#fff", fontSize: 18 }} />
          </span>
          Assistant IA SchoolX
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Posez vos questions sur la gestion de l'école</p>
      </div>

      {/* Suggestions */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => sendMessage(s)} style={{
            padding: "7px 14px", border: "1px solid #e2e8f0",
            borderRadius: 20, background: "#fff", fontSize: 12,
            color: "#334155", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            transition: "all 0.15s"
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Zone messages */}
      <div style={{
        flex: 1, background: "#fff", borderRadius: 12,
        border: "1px solid #e2e8f0", padding: 20,
        overflowY: "auto", marginBottom: 16,
        display: "flex", flexDirection: "column", gap: 14
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: "#1a3ed4",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginRight: 10, alignSelf: "flex-end"
              }}>
                <i className="ti ti-sparkles" style={{ color: "#fff", fontSize: 14 }} />
              </div>
            )}
            <div style={{
              maxWidth: "70%", padding: "12px 16px",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? "#1a3ed4" : "#f8fafc",
              color: m.role === "user" ? "#fff" : "#0f172a",
              fontSize: 13, lineHeight: 1.6,
              border: m.role === "user" ? "none" : "1px solid #e2e8f0"
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a3ed4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-sparkles" style={{ color: "#fff", fontSize: 14 }} />
            </div>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px 14px 14px 4px", padding: "12px 16px", display: "flex", gap: 6, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#94a3b8",
                  animation: "pulse 1.2s infinite", animationDelay: `${i * 0.2}s`
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Posez votre question à l'IA..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1, padding: "12px 16px",
            border: "1px solid #e2e8f0", borderRadius: 10,
            fontSize: 13, outline: "none",
            fontFamily: "'Outfit', sans-serif"
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            padding: "12px 20px", background: "#1a3ed4", color: "#fff",
            border: "none", borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
            opacity: loading || !input.trim() ? 0.6 : 1
          }}
        >
          <i className="ti ti-send" style={{ fontSize: 16 }} />
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
