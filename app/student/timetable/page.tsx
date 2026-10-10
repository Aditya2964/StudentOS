import { BentoCard } from "@/components/ui/bento-card";
import { Clock, MapPin, User, Calendar } from "lucide-react";
import { getTimetableData } from "@/lib/actions/timetable";
import { getCurrentUser } from "@/lib/auth/session";

const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function StudentTimetablePage() {
  const currentUser = await getCurrentUser();
  const classId = currentUser?.studentProfile?.classId || undefined;
  const data = await getTimetableData(classId);

  // Group slots by day of week
  const groupedDays = [1, 2, 3, 4, 5, 6].map((dayNum) => {
    const slots = data.timetableSlots
      .filter((s) => s.dayOfWeek === dayNum)
      .map((s) => ({
        time: `${s.startTime} — ${s.endTime}`,
        subject: s.subjectName || "Subject",
        code: s.subjectCode || "COURSE",
        teacher: s.teacherName,
        room: s.room,
      }));

    return {
      day: DAY_NAMES[dayNum],
      slots,
    };
  });

  const hasAnySlots = data.timetableSlots.length > 0;

  const fallbackSchedule = [
    {
      day: "Monday",
      slots: [
        { time: "09:00 — 10:00", subject: "Database Management Systems", code: "CS501", teacher: "Prof. Smith", room: "Room 302" },
        { time: "10:00 — 11:00", subject: "Operating Systems", code: "CS502", teacher: "Dr. Miller", room: "Lab 2" },
        { time: "11:30 — 12:30", subject: "Computer Networks", code: "CS503", teacher: "Prof. Davis", room: "Room 304" },
      ],
    },
    {
      day: "Tuesday",
      slots: [
        { time: "09:00 — 10:00", subject: "Computer Networks Lab", code: "CS503L", teacher: "Prof. Davis", room: "Lab 4" },
        { time: "10:00 — 12:00", subject: "Database Systems Lab", code: "CS501L", teacher: "Prof. Smith", room: "Lab 1" },
      ],
    },
    {
      day: "Wednesday",
      slots: [
        { time: "09:00 — 10:00", subject: "Software Engineering", code: "CS504", teacher: "Dr. Wilson", room: "Room 301" },
        { time: "10:00 — 11:00", subject: "Operating Systems", code: "CS502", teacher: "Dr. Miller", room: "Room 302" },
      ],
    },
  ];

  const weeklySchedule = hasAnySlots ? groupedDays.filter((g) => g.slots.length > 0) : fallbackSchedule;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Class Timetable</h1>
          <p className="text-xs text-[#78716C] mt-1">Weekly schedule, class timings, teachers, and room allocations</p>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium">
          <Calendar className="w-4 h-4 text-[#FACC15]" />
          <span>{data.activeClassName ? `Class: ${data.activeClassName}` : "Semester 5 • Section A"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {weeklySchedule.map((dayGroup) => (
          <BentoCard key={dayGroup.day} title={dayGroup.day} subtitle={`${dayGroup.slots.length} Classes`}>
            <div className="flex flex-col gap-3 pt-2">
              {dayGroup.slots.map((slot, idx) => (
                <div key={idx} className="p-3.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-amber-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {slot.time}
                    </span>
                    <span className="bg-[#E7E5E4] text-[#1C1917] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {slot.code}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#1C1917] mt-0.5">{slot.subject}</h4>

                  <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-1 border-t border-[#E7E5E4]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {slot.teacher}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {slot.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}
