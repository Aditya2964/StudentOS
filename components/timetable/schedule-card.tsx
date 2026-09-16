import { BentoCard } from "@/components/ui/bento-card";
import { Clock, MapPin, User } from "lucide-react";
import Link from "next/link";

export interface ClassScheduleItem {
  id: string;
  time: string; // e.g. "09:00 — 10:00"
  subject: string;
  code: string;
  teacher: string;
  room: string;
  isNext?: boolean;
}

interface ScheduleCardProps {
  classes: ClassScheduleItem[];
}

export function ScheduleCard({ classes }: ScheduleCardProps) {
  return (
    <BentoCard
      title="Today's Schedule"
      subtitle="Class Timetable"
      colSpan="col-span-1"
      action={
        <Link href="/timetable" className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">
          Full Schedule →
        </Link>
      }
    >
      <div className="flex flex-col gap-2.5 pt-1">
        {classes.length === 0 ? (
          <p className="text-xs text-[#78716C] italic py-4 text-center">No classes scheduled for today.</p>
        ) : (
          classes.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all flex flex-col gap-1 ${
                item.isNext
                  ? "bg-[#1C1917] text-white border-[#1C1917] shadow-md"
                  : "bg-[#F9F8F4] border-[#E7E5E4] text-[#1C1917]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-medium flex items-center gap-1 ${item.isNext ? "text-[#FACC15]" : "text-[#78716C]"}`}>
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
                {item.isNext && (
                  <span className="bg-[#FACC15] text-[#1C1917] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    NEXT CLASS
                  </span>
                )}
              </div>

              <div className="font-medium text-xs mt-0.5">
                {item.subject} <span className={`text-[10px] ${item.isNext ? "text-stone-400" : "text-[#78716C]"}`}>({item.code})</span>
              </div>

              <div className={`flex items-center justify-between text-[10px] mt-1 ${item.isNext ? "text-stone-300" : "text-[#78716C]"}`}>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {item.teacher}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.room}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </BentoCard>
  );
}
