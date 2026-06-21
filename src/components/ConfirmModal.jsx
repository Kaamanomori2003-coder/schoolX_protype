import { useEffect } from "react";

/**
 * ConfirmModal - Modale de confirmation personnalisée
 * Props:
 *   isOpen   : boolean
 *   title    : string
 *   message  : string
 *   onConfirm: () => void
 *   onCancel : () => void
 */
export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  // Fermeture avec touche Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "28px 28px 24px",
          width: 380,
          maxWidth: "90vw",
          boxShadow: "0 25px 60px -10px rgba(0,0,0,0.35)",
          animation: "confirmPop 0.2s ease",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "#fee2e2", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 26, margin: "0 auto 16px",
        }}>
          🗑️
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 19, fontWeight: 800, color: "#1e293b",
          textAlign: "center", margin: "0 0 8px",
        }}>
          {title || "Confirmer la suppression"}
        </h3>

        {/* Message */}
        <p style={{
          fontSize: 15, color: "#64748b", textAlign: "center",
          margin: "0 0 24px", lineHeight: 1.5,
        }}>
          {message || "Cette action est irréversible. Voulez-vous continuer ?"}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "11px 0", border: "1px solid #e2e8f0",
              borderRadius: 10, background: "#fff", fontSize: 15,
              fontWeight: 700, cursor: "pointer", color: "#475569",
              fontFamily: "inherit", transition: "0.15s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseOut={(e) => e.currentTarget.style.background = "#fff"}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "11px 0", border: "none",
              borderRadius: 10, background: "#dc2626", fontSize: 15,
              fontWeight: 700, cursor: "pointer", color: "#fff",
              fontFamily: "inherit", transition: "0.15s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#b91c1c"}
            onMouseOut={(e) => e.currentTarget.style.background = "#dc2626"}
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirmPop {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
