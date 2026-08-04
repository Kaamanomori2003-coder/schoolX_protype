import { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

const ICONS = {
    success: { icon: "ti-circle-check", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", bar: "#16a34a" },
    error: { icon: "ti-circle-x", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", bar: "#dc2626" },
    danger: { icon: "ti-circle-x", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", bar: "#dc2626" },
    warning: { icon: "ti-alert-triangle", color: "#d97706", bg: "#fffbeb", border: "#fde68a", bar: "#d97706" },
    info: { icon: "ti-info-circle", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", bar: "#2563eb" },
};

const VALID_TYPES = ["success", "error", "danger", "warning", "info"];

function ToastItem({ toast, onRemove }) {
    const t = ICONS[toast.type] || ICONS.success;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            style={{
                position: "relative",
                overflow: "hidden",
                background: t.bg,
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                padding: "14px 42px 16px 14px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
                minWidth: 280,
                maxWidth: 380,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
            }}
        >
            {/* Icône */}
            <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(255,255,255,0.7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
                <i className={`ti ${t.icon}`} style={{ fontSize: 20, color: t.color }} />
            </div>

            {/* Texte */}
            <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                    {toast.title}
                </div>
                {toast.message && (
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 4, lineHeight: 1.4 }}>
                        {toast.message}
                    </div>
                )}
            </div>

            {/* Bouton fermer */}
            <button
                onClick={() => onRemove(toast.id)}
                style={{
                    position: "absolute", top: 10, right: 10,
                    background: "none", border: "none", cursor: "pointer",
                    color: "#94a3b8", fontSize: 16, lineHeight: 1,
                    padding: "4px", borderRadius: 6, display: "flex",
                    alignItems: "center", justifyContent: "center",
                }}
            >✕</button>

            {/* Barre de progression */}
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: toast.duration / 1000, ease: "linear" }}
                style={{
                    position: "absolute", bottom: 0, left: 0,
                    height: 4, background: t.bar, borderRadius: "0 0 0 12px",
                    transformOrigin: "left", width: "100%",
                }}
            />
        </motion.div>
    );
}

function ToastContainer({ toasts, removeToast }) {
    return (
        <div style={{
            position: "fixed", top: 24, right: 24,
            zIndex: 999999,
            display: "flex", flexDirection: "column", gap: 12,
            pointerEvents: "none",
        }}>
            <AnimatePresence mode="popLayout">
                {toasts.map(t => (
                    <div key={t.id} style={{ pointerEvents: "auto" }}>
                        <ToastItem toast={t} onRemove={removeToast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const removeToast = useCallback((id) => {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Flexible signatures:
    // showToast("Title", "success", "Message detail")
    // showToast("Message text", "error")
    // showToast("Message text")
    const showToast = useCallback((title, param2 = "success", param3 = "", duration = 4000) => {
        let type = "success";
        let message = "";

        if (VALID_TYPES.includes(param2)) {
            type = param2 === "danger" ? "error" : param2;
            message = param3 || "";
        } else {
            message = param2 || "";
            type = VALID_TYPES.includes(param3) ? (param3 === "danger" ? "error" : param3) : "success";
        }

        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, title, message, type, duration }]);
        timers.current[id] = setTimeout(() => removeToast(id), duration);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast doit être utilisé à l'intérieur de ToastProvider");
    return ctx;
}