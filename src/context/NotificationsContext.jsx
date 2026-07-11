import { createContext, useContext, useState, useCallback } from "react";

const NotificationsContext = createContext(null);

export const PAGE_META = {
  "Gestion RH":              { icon: "ti-briefcase",      c: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  "Gestion des paiements":   { icon: "ti-credit-card",    c: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  "Gestion des dépenses":    { icon: "ti-chart-pie",      c: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  "Gestion des notes":       { icon: "ti-clipboard-list", c: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  "Gestion des élèves":      { icon: "ti-users",          c: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};
export const DEFAULT_META = { icon: "ti-bell", c: "#64748b", bg: "rgba(100,116,139,0.1)" };

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // notif = { id, source: "Gestion RH", titre, message, date? }
  const addNotification = useCallback((notif) => {
    setNotifications(prev => {
      if (prev.some(n => n.id === notif.id)) return prev; // évite les doublons à chaque re-render
      return [{ ...notif, lu: false, date: notif.date || new Date().toLocaleDateString("fr-FR") }, ...prev];
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.lu).length;

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, markAsRead, markAllRead, removeNotification, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications doit être utilisé à l'intérieur de NotificationsProvider");
  return ctx;
}