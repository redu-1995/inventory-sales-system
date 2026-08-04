import React from "react";
import { AlertTriangle, ShoppingBag, Info, Check } from "lucide-react";

const getNotificationIcon = (type) => {
  switch (type) {
    case "LOW_STOCK":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "SALE":
      return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
    default:
      return <Info className="w-4 h-4 text-blue-500" />;
  }
};

export default function NotificationItem({ item, onMarkRead }) {
  return (
    <div
      className={`px-4 py-3 flex items-start gap-3 transition ${
        item.is_read ? "bg-white opacity-70" : "bg-slate-50/80"
      } hover:bg-slate-100/70`}
    >
      <div className="mt-0.5">{getNotificationIcon(item.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{item.message}</p>
        <span className="text-[10px] text-slate-400 mt-1 block">
          {item.created_at || "Just now"}
        </span>
      </div>
      {!item.is_read && (
        <button
          onClick={() => onMarkRead(item.id)}
          title="Mark as read"
          className="text-slate-400 hover:text-blue-600 transition p-1"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}