import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { getTimetableData } from "@/lib/actions/timetable";

export default async function StudentExamsPage() {
  const data = await getTimetableData();

  const fallbackExams = [
    {
      id: "ex-1",
      type: "Midterm Examination",
      subjectName: "Database Management Systems",
      subjectCode: "CS501",
      date: "2026-08-21",
      time: "10:00 AM — 12:00 PM",
      room: "Exam Hall A (3rd Floor)",
      instructions: "Bring college ID card, admit card, and standard blue/black pens. No programmable calculators.",
    },
    {
      id: "ex-2",
      type: "Midterm Examination",
      subjectName: "Operating Systems",
      subjectCode: "CS502",
      date: "2026-08-23",
      time: "10:00 AM — 12:00 PM",
      room: "Exam Hall B (2nd Floor)",
      instructions: "Covering Units 1 to 3. Arrive 15 minutes before exam start time.",
    },
    {
      id: "ex-3",
      type: "Midterm Examination",
      subjectName: "Computer Networks",
      subjectCode: "CS503",
      date: "2026-08-25",
      time: "02:00 PM — 04:00 PM",
      room: "Exam Hall A (3rd Floor)",
      instructions: "Bring network diagram drawing templates and ID card.",
    },
  ];

  const exams =
    data.exams.length > 0
      ? data.exams.map((e) => ({
          id: e.id,
          type: e.examType,
          subjectName: e.subjectName || "Subject",
          subjectCode: e.subjectCode || "EXAM",
          date: e.date,
          time: `${e.startTime} — ${e.endTime}`,
          room: e.room,
          instructions: e.instructions || "Bring valid Student ID card.",
        }))
      : fallbackExams;


  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Examination Schedule</h1>
          <p className="text-xs text-[#78716C] mt-1">Official midterms, finals, room seating, and exam guidelines</p>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium">
          <Calendar className="w-4 h-4 text-[#FACC15]" />
          <span>Fall Semester 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <BentoCard
            key={exam.id}
            title={exam.subjectName}
            subtitle={exam.subjectCode}
            badge={
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {exam.type}
              </span>
            }
          >
            <div className="flex flex-col justify-between h-full pt-3 gap-4">
              <div className="p-3.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between text-[#1C1917] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    {new Date(exam.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-[#78716C]">
                    <Clock className="w-3.5 h-3.5" />
                    {exam.time}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[#78716C] text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#1C1917]" />
                  <span>{exam.room}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F2EFE9] rounded-xl text-[11px] text-[#78716C] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{exam.instructions}</p>
              </div>
            </div>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}
