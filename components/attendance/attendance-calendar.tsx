"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AttendanceDayRecord {
  date: string; // YYYY-MM-DD
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "HOLIDAY";
  checkIn?: string | null;
  checkOut?: string | null;
}

interface AttendanceCalendarProps {
  records: AttendanceDayRecord[];
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState<AttendanceDayRecord | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Map YYYY-MM-DD date strings to records
  const recordMap = new Map<string, AttendanceDayRecord>();
  records.forEach((r) => recordMap.set(r.date, r));

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Month Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#78716C]" />
          <span className="text-base font-medium text-[#1C1917]">
            {monthNames[month]} {year}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#78716C] hover:text-[#1C1917] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#78716C] hover:text-[#1C1917] transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wider text-[#78716C] py-1 border-b border-[#E7E5E4]">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-10" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const rec = recordMap.get(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => rec && setSelectedRecord(rec)}
              className={cn(
                "h-10 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all relative group border border-transparent",
                rec?.status === "PRESENT" && "bg-emerald-100/70 text-emerald-900 border-emerald-200 hover:bg-emerald-200",
                rec?.status === "ABSENT" && "bg-rose-100/70 text-rose-900 border-rose-200 hover:bg-rose-200",
                rec?.status === "HALF_DAY" && "bg-amber-100/70 text-amber-900 border-amber-200 hover:bg-amber-200",
                rec?.status === "HOLIDAY" && "bg-blue-100/70 text-blue-900 border-blue-200 hover:bg-blue-200",
                !rec && "bg-[#F9F8F4] text-[#78716C] hover:bg-[#F2EFE9]"
              )}
            >
              <span>{day}</span>
              {rec?.status === "PRESENT" && <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />}
              {rec?.status === "ABSENT" && <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail Card */}
      {selectedRecord && (
        <div className="mt-2 p-4 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            {selectedRecord.status === "PRESENT" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : selectedRecord.status === "ABSENT" ? (
              <XCircle className="w-5 h-5 text-rose-600" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600" />
            )}
            <div>
              <p className="text-xs font-semibold text-[#1C1917]">
                {selectedRecord.date} — Status: {selectedRecord.status}
              </p>
              <p className="text-[11px] text-[#78716C]">
                Check-In: {selectedRecord.checkIn || "N/A"} | Check-Out: {selectedRecord.checkOut || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRecord(null)}
            className="text-xs text-[#78716C] hover:text-[#1C1917]"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
