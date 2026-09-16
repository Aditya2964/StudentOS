"use client";

import { useState } from "react";
import { Bell, Check, Clock, AlertTriangle, Trophy, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "DEADLINE" | "ATTENDANCE" | "ACHIEVEMENT" | "ANNOUNCEMENT";
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
}

export function NotificationCenter({ notifications: initialNotifications }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-3 w-full bg-[#F9F8F4] border border-[#E7E5E4] p-5 rounded-[2rem]">
      <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1C1917]" />
          <h3 className="text-sm font-medium text-[#1C1917]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-[#1C1917] text-[#FACC15] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <p className="text-xs text-[#78716C] italic text-center py-6">No notifications yet.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-3 rounded-2xl border transition-all flex items-start gap-3 relative group",
                item.read
                  ? "bg-[#F2EFE9]/60 border-transparent text-[#78716C]"
                  : "bg-white border-[#E7E5E4] text-[#1C1917] shadow-xs"
              )}
            >
              <div className="p-2 rounded-full bg-[#F2EFE9] text-[#1C1917] shrink-0 mt-0.5">
                {item.type === "DEADLINE" && <Clock className="w-3.5 h-3.5 text-rose-600" />}
                {item.type === "ATTENDANCE" && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                {item.type === "ACHIEVEMENT" && <Trophy className="w-3.5 h-3.5 text-emerald-600" />}
                {item.type === "ANNOUNCEMENT" && <Megaphone className="w-3.5 h-3.5 text-blue-600" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#1C1917]">{item.title}</h4>
                  <span className="text-[10px] text-[#78716C]">{item.timestamp}</span>
                </div>
                <p className="text-xs text-[#78716C] mt-0.5">{item.message}</p>
              </div>

              {!item.read && (
                <button
                  onClick={() => markAsRead(item.id)}
                  title="Mark as read"
                  className="p-1 rounded-full hover:bg-[#F2EFE9] text-[#78716C] hover:text-[#1C1917] transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
