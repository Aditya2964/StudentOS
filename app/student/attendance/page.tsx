import { AttendanceTrendChart } from "@/components/attendance/attendance-trend-chart";
import { AttendanceCalendar } from "@/components/attendance/attendance-calendar";
import { StatItem } from "@/components/ui/stat-item";
import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { CalendarCheck, Flame, AlertCircle, ShieldCheck } from "lucide-react";
import { getStudentAttendanceDataAction } from "@/lib/actions/attendance";

export default async function StudentAttendancePage() {
  const data = await getStudentAttendanceDataAction();

  const isCritical = data.stats.statusLabel === "CRITICAL";
  const isWarning = data.stats.statusLabel === "WARNING";

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium text-[#1C1917]">Attendance Hub</h1>
            {data.isLive && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Biometric Records
              </span>
            )}
          </div>
          <p className="text-xs text-[#78716C] mt-1">Official daily biometric attendance record and actionable projections</p>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium">
          <CalendarCheck className="w-4 h-4 text-[#FACC15]" />
          <span>Requirement: 75% Overall</span>
        </div>
      </div>

      {/* Actionable Prediction Banner */}
      <div
        className={`p-4 rounded-[2rem] border flex items-center gap-3 text-xs ${
          isCritical
            ? "bg-rose-50 border-rose-200 text-rose-900"
            : isWarning
            ? "bg-amber-50 border-amber-200 text-amber-900"
            : "bg-[#F9F8F4] border-[#E7E5E4] text-[#1C1917]"
        }`}
      >
        <AlertCircle
          className={`w-5 h-5 shrink-0 ${
            isCritical ? "text-rose-600" : isWarning ? "text-amber-500" : "text-emerald-600"
          }`}
        />
        <span className="leading-relaxed font-medium">
          Actionable Projection: {data.prediction.predictionSentence}
        </span>
      </div>

      {/* Metric Cards Row */}
      <BentoGrid>
        <BentoCard colSpan="col-span-1">
          <StatItem
            label="Overall Attendance"
            value={data.stats.percentage}
            unit="%"
            icon={<CalendarCheck className={isCritical ? "text-rose-500" : "text-emerald-600"} />}
            trend={{
              value: data.stats.statusLabel,
              isPositive: data.stats.percentage >= 75,
            }}
          />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem
            label="Current Streak"
            value={data.streak.currentStreak}
            unit="days"
            icon={<Flame className="text-amber-500 fill-amber-500" />}
            trend={{
              value: `Best: ${data.streak.longestStreak} days`,
              isPositive: true,
            }}
          />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem
            label="Present Days"
            value={data.stats.presentDays}
            unit="days"
            trend={{
              value: `${data.stats.absentDays} missed`,
              isPositive: data.stats.absentDays <= 5,
            }}
          />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem
            label="Total Working Days"
            value={data.stats.workingDays}
            unit="days"
            trend={{
              value: "Verified",
              isPositive: true,
            }}
          />
        </BentoCard>

        {/* Trend Chart (2 columns) */}
        <BentoCard title="Attendance Trend" subtitle="Monthly Percentage" colSpan="col-span-2">
          <AttendanceTrendChart data={data.trend} />
        </BentoCard>

        {/* Calendar Grid (2 columns) */}
        <BentoCard
          title="Attendance Calendar"
          subtitle="Click dates for check-in/out details"
          colSpan="col-span-2"
        >
          <AttendanceCalendar records={data.calendarRecords} />
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
