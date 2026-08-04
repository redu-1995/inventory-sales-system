// src/components/Header/NotificationDropdown.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  AlertTriangle, 
  XCircle, 
  PackageCheck, 
  ShoppingBag, 
  CreditCard, 
  UserPlus, 
  CheckCheck, 
  ArrowRight 
} from "lucide-react";

export default function NotificationDropdown({ notifications = [], onMarkRead, onMarkAllRead, onClose }) {
  // Category configs limited strictly to core business entities
  const getCategoryConfig = (type) => {
    switch (type) {
      case "LOW_STOCK":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
          actionText: "View Inventory",
          bg: "bg-amber-500/10",
        };
      case "OUT_OF_STOCK":
        return {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          actionText: "Restock Now",
          bg: "bg-red-500/10",
        };
      case "PURCHASE_ORDER":
        return {
          icon: <PackageCheck className="w-4 h-4 text-blue-500" />,
          actionText: "View PO",
          bg: "bg-blue-500/10",
        };
      case "SALE":
        return {
          icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />,
          actionText: "View Sale",
          bg: "bg-emerald-500/10",
        };
      case "PAYMENT":
        return {
          icon: <CreditCard className="w-4 h-4 text-teal-500" />,
          actionText: "View Invoice",
          bg: "bg-teal-500/10",
        };
      case "CUSTOMER":
        return {
          icon: <UserPlus className="w-4 h-4 text-indigo-500" />,
          actionText: "View Customer",
          bg: "bg-indigo-500/10",
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-slate-500" />,
          actionText: "View Details",
          bg: "bg-slate-500/10",
        };
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="text-sm font-semibold text-slate-800">Notifications</span>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No notifications available
          </div>
        ) : (
          notifications.map((notif) => {
            const config = getCategoryConfig(notif.notification_type);
            const targetLink = notif.link || "#";

            return (
              <div
                key={notif.id}
                className={`p-3.5 hover:bg-slate-50 transition flex items-start gap-3 ${
                  !notif.is_read ? "bg-blue-50/20" : ""
                }`}
              >
                {/* Category Icon Badge */}
                <div className={`p-2 rounded-xl flex-shrink-0 ${config.bg}`}>
                  {config.icon}
                </div>

                {/* Details & Action */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {notif.title}
                    </span>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Actionable Link Button */}
                    {targetLink !== "#" && (
                      <Link
                        to={targetLink}
                        onClick={() => {
                          if (!notif.is_read) onMarkRead(notif.id);
                          if (onClose) onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                      >
                        <span>{config.actionText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}