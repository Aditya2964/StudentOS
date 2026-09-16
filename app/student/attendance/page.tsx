"use client";

import { AttendanceTrendChart, MonthlyTrendPoint } from "@/components/attendance/attendance-trend-chart";
import { AttendanceCalendar, AttendanceDayRecord } from "@/components/attendance/attendance-calendar";
import { StatItem } from "@/components/ui/stat-item";
import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { CalendarCheck, Flame, AlertCircle } from "lucide-react";

export default function StudentAttendancePage() {
  const mockTrendData: MonthlyTrendPoint[] = [
    { month: "Jan", percentage: 92, presentDays: 20, workingDays: 22 },
    { month: "Feb", percentage: 88, presentDays: 18, workingDays: 20 },
    { month: "Mar", percentage: 90, presentDays: 21, workingDays: 23 },
    { month: "Apr", percentage: 85, presentDays: 17, workingDays: 20 },
    { month: "May", percentage: 87.5, presentDays: 21, workingDays: 24 },
  ];

  const mockCalendarRecords: AttendanceDayRecord[] = [
    { date: "2026-08-03", status: "PRESENT", checkIn: "08:52", checkOut: "16:30" },
    { date: "2026-08-04", status: "PRESENT", checkIn: "08:55", checkOut: "16:35" },
    { date: "2026-08-05", status: "PRESENT", checkIn: "08:50", checkOut: "16:30" },
    { date: "2026-08-06", status: "ABSENT" },
    { date: "2026-08-07", status: "PRESENT", checkIn: "08:58", checkOut: "16:25" },
    { date: "2026-08-10", status: "PRESENT", checkIn: "08:45", checkOut: "16:30" },
    { date: "2026-08-11", status: "PRESENT", checkIn: "08:50", checkOut: "16:40" },
    { date: "2026-08-12", status: "PRESENT", checkIn: "08:52", checkOut: "16:30" },
    { date: "2026-08-13", status: "PRESENT", checkIn: "08:50", checkOut: "16:30" },
    { date: "2026-08-14", status: "PRESENT", checkIn: "08:54", checkOut: "16:30" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Attendance Hub</h1>
          <p className="text-xs text-[#78716C] mt-1">Official daily biometric attendance record and predictions</p>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium">
          <CalendarCheck className="w-4 h-4 text-[#FACC15]" />
          <span>Requirement: 75% Overall</span>
        </div>
      </div>

      {/* Prediction Banner */}
      <div className="p-4 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2rem] flex items-center gap-3 text-xs text-[#1C1917]">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
        <span className="leading-relaxed font-medium">
          Actionable Prediction: You have 87.5% attendance. You can miss approximately 14 more working days before reaching the 75% threshold limit.
        </span>
      </div>

      {/* Metric Cards Row */}
      <BentoGrid>
        <BentoCard colSpan="col-span-1">
          <StatItem label="Overall Attendance" value="87.5" unit="%" icon={<CalendarCheck />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Current Streak" value="32" unit="days" icon={<Flame className="text-amber-500" />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Present Days" value="97" unit="days" />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Total Working Days" value="111" unit="days" />
        </BentoCard>

        {/* Trend Chart (2 columns) */}
        <BentoCard title="Attendance Trend" subtitle="Monthly Percentage" colSpan="col-span-2">
          <AttendanceTrendChart data={mockTrendData} />
        </BentoCard>

        {/* Calendar Grid (2 columns) */}
        <BentoCard title="Attendance Calendar" subtitle="Click dates for check-in/out details" colSpan="col-span-2">
          <AttendanceCalendar records={mockCalendarRecords} />
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
