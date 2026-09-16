"use client";

import { useState } from "react";
import { BentoCard } from "@/components/ui/bento-card";
import { Calendar, User, Tag, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  author: string;
  category: "General" | "Assignment" | "Exam" | "Emergency";
  date: string;
}

export default function StudentAnnouncementsClient({
  initialAnnouncements,
}: {
  initialAnnouncements: AnnouncementItem[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredAnnouncements = initialAnnouncements.filter((a) => {
    if (selectedCategory === "ALL") return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Announcements & Notices</h1>
          <p className="text-xs text-[#78716C] mt-1">
            Official college notices, teacher broadcasts, and emergency alerts
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#F2EFE9] p-1 rounded-full border border-[#E7E5E4] overflow-x-auto">
          {["ALL", "General", "Exam", "Assignment", "Emergency"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-[#1C1917] text-white shadow-xs"
                  : "text-[#78716C] hover:text-[#1C1917]"
              )}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-[#F9F8F4] rounded-[2.5rem] border border-[#E7E5E4] text-[#78716C] text-xs">
            No announcements found in this category.
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <BentoCard
              key={item.id}
              title={item.title}
              subtitle={`Posted by ${item.author}`}
              badge={
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    item.category === "Emergency" && "bg-rose-100 text-rose-900",
                    item.category === "Exam" && "bg-amber-100 text-amber-900",
                    item.category === "General" && "bg-blue-100 text-blue-900",
                    item.category === "Assignment" && "bg-purple-100 text-purple-900"
                  )}
                >
                  {item.category}
                </span>
              }
            >
              <div className="flex flex-col justify-between h-full pt-3 gap-4">
                <p className="text-xs text-[#78716C] leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-3 border-t border-[#E7E5E4]">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {item.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                </div>
              </div>
            </BentoCard>
          ))
        )}
      </div>
    </div>
  );
}
