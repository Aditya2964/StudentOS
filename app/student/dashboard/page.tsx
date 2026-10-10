import { AttendanceCard } from "@/components/dashboard/attendance-card";
import { StreakWidget } from "@/components/dashboard/streak-widget";
import { ScheduleCard } from "@/components/timetable/schedule-card";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { BentoGrid, BentoCard } from "@/components/ui/bento-card";
import { FileText, BookOpen, Calendar, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/session";
import { getStudentNotificationsAction } from "@/lib/actions/announcements";
import { getTimetableData } from "@/lib/actions/timetable";
import { getStudentAttendanceDataAction } from "@/lib/actions/attendance";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  const firstName = user?.name ? user.name.split(" ")[0] : "Student";
  const roll = user?.studentProfile?.rollNumber ? `Roll No: ${user.studentProfile.rollNumber}` : "Computer Science & Engineering";
  const studentId = user?.studentProfile?.studentId ? ` • ID: ${user.studentProfile.studentId}` : "";

  // 1. Fetch live notifications / announcements
  const liveNotifications = await getStudentNotificationsAction(user?.id);

  // 2. Fetch live attendance & streak metrics
  const attendanceData = await getStudentAttendanceDataAction(user?.studentProfile?.id);

  // 3. Fetch live timetable
  const timetableData = await getTimetableData();
  const todayDayOfWeek = new Date().getDay() || 7; // 1 = Mon ... 7 = Sun
  const todaySlots = timetableData.timetableSlots.filter((s) => s.dayOfWeek === todayDayOfWeek);

  const displaySchedule =
    todaySlots.length > 0
      ? todaySlots.map((s, idx) => ({
          id: s.id,
          time: `${s.startTime} — ${s.endTime}`,
          subject: s.subjectName || "Subject",
          code: s.subjectCode || "COURSE",
          teacher: s.teacherName,
          room: s.room,
          isNext: idx === 0,
        }))
      : timetableData.timetableSlots.length > 0
      ? timetableData.timetableSlots.slice(0, 3).map((s, idx) => ({
          id: s.id,
          time: `${s.startTime} — ${s.endTime}`,
          subject: s.subjectName || "Subject",
          code: s.subjectCode || "COURSE",
          teacher: s.teacherName,
          room: s.room,
          isNext: idx === 0,
        }))
      : [
          { id: "1", time: "09:00 — 10:00", subject: "Database Management", code: "CS501", teacher: "Prof. Smith", room: "Room 302", isNext: true },
          { id: "2", time: "10:00 — 11:00", subject: "Operating Systems", code: "CS502", teacher: "Dr. Miller", room: "Lab 2" },
          { id: "3", time: "11:30 — 12:30", subject: "Computer Networks", code: "CS503", teacher: "Prof. Davis", room: "Room 304" },
        ];


  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#1C1917]">
            Good Morning, {firstName} 👋
          </h1>
          <p className="text-xs md:text-sm text-[#78716C] mt-1">
            {roll}{studentId}
          </p>
        </div>

        <Link
          href="/notes"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white rounded-full text-xs font-medium hover:bg-[#332F2C] transition-all shadow-md self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#FACC15]" />
          <span>Ask AI Assistant</span>
        </Link>
      </div>

      {/* Main Bento Grid */}
      <BentoGrid>
        {/* Row 1: Attendance + Streak + Today's Schedule */}
        <AttendanceCard
          percentage={attendanceData.stats.percentage}
          statusLabel={attendanceData.stats.statusLabel}
          predictionSentence={attendanceData.prediction.predictionSentence}
        />

        <StreakWidget
          currentStreak={attendanceData.streak.currentStreak}
          nextMilestoneTitle={attendanceData.streak.currentStreak >= 30 ? "Consistency Legend" : "Consistency Champion"}
          nextMilestoneCount={attendanceData.streak.currentStreak >= 30 ? 60 : 30}
        />

        <ScheduleCard classes={displaySchedule} />

        {/* Row 2: Upcoming Assignments + Study Notes Shortcut + Notifications */}
        <BentoCard
          title="Upcoming Assignments"
          subtitle="Deadlines & Status"
          colSpan="col-span-2"
          action={
            <Link href="/assignments" className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">
              View All →
            </Link>
          }
        >
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#1C1917]">DBMS Relational Algebra Set 3</h4>
                  <p className="text-[10px] text-[#78716C]">Due Tomorrow • 100 Marks</p>
                </div>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                DUE SOON
              </span>
            </div>

            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-stone-100 text-[#78716C]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#1C1917]">OS Process Sync Implementation</h4>
                  <p className="text-[10px] text-[#78716C]">Due 18 Aug • 50 Marks</p>
                </div>
              </div>
              <span className="bg-[#E7E5E4] text-[#78716C] text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                NOT STARTED
              </span>
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title="Recent Study Notes"
          subtitle="Course PDF Materials"
          colSpan="col-span-1"
          action={
            <Link href="/notes" className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">
              Browse →
            </Link>
          }
        >
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <div>
                  <h4 className="text-xs font-medium text-[#1C1917]">DBMS Unit 3 Normalization</h4>
                  <p className="text-[10px] text-[#78716C]">PDF • 2.4 MB</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <div>
                  <h4 className="text-xs font-medium text-[#1C1917]">OS Unit 2 Semaphore Locks</h4>
                  <p className="text-[10px] text-[#78716C]">PDF • 1.8 MB</p>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        <div className="col-span-1">
          <NotificationCenter notifications={liveNotifications} />
        </div>
      </BentoGrid>
    </div>
  );
}
