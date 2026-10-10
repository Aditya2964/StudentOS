import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { StatItem } from "@/components/ui/stat-item";
import { DarkLogCard } from "@/components/ui/dark-log-card";
import {
  Users, RefreshCw, FileSpreadsheet, Building2, CheckCircle2,
  BookOpen, Calendar, UserPlus, ArrowRight, Activity
} from "lucide-react";
import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/actions/users";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const mockLogs = [
    { id: "1", timestamp: currentTime, message: `Biometric API Engine: ${stats.studentCount} student profiles active.`, type: "success" as const },
    { id: "2", timestamp: "14:12:00", message: `Academic Structure: ${stats.classCount} class sections configured.`, type: "info" as const },
    { id: "3", timestamp: "09:30:10", message: `Faculty Registry: ${stats.teacherCount} verified educators active.`, type: "info" as const },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium text-[#1C1917]">System Administration</h1>
            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operational Mode
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1">Institutional Biometric Attendance & Academic Operations</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 bg-[#F2EFE9] hover:bg-[#E7E5E4] text-[#1C1917] px-3.5 py-2 rounded-full text-xs font-medium border border-[#E7E5E4] transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
            <span>Add User</span>
          </Link>

          <Link
            href="/admin/attendance/import"
            className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-[#332F2C] transition-all shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#FACC15]" />
            <span>Import Biometrics</span>
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <BentoGrid>
        <BentoCard colSpan="col-span-1">
          <StatItem
            label="Enrolled Students"
            value={stats.studentCount}
            unit="students"
            icon={<Users className="w-4 h-4 text-blue-600" />}
            trend={{ value: `${stats.studentCount} registered`, isPositive: true }}
          />
          <div className="pt-2">
            <Link href="/admin/users" className="text-[11px] font-medium text-[#78716C] hover:text-[#1C1917] flex items-center gap-1">
              Manage Users <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem
            label="Faculty Members"
            value={stats.teacherCount}
            unit="educators"
            icon={<Building2 className="w-4 h-4 text-emerald-600" />}
            trend={{ value: "Active", isPositive: true }}
          />
          <div className="pt-2">
            <Link href="/admin/users" className="text-[11px] font-medium text-[#78716C] hover:text-[#1C1917] flex items-center gap-1">
              View Teachers <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem
            label="Class Sections"
            value={stats.classCount}
            unit="classes"
            icon={<BookOpen className="w-4 h-4 text-amber-600" />}
          />
          <div className="pt-2">
            <Link href="/admin/academic" className="text-[11px] font-medium text-[#78716C] hover:text-[#1C1917] flex items-center gap-1">
              Academic Setup <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem
            label="Biometric Engine Status"
            value="99.8"
            unit="%"
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            trend={{ value: "API Online", isPositive: true }}
          />
          <div className="pt-2">
            <Link href="/admin/attendance/logs" className="text-[11px] font-medium text-[#78716C] hover:text-[#1C1917] flex items-center gap-1">
              View Punch Logs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </BentoCard>

        {/* Quick Management Shortcuts */}
        <BentoCard
          title="User & Access Administration"
          subtitle="Student & Educator Profiles"
          colSpan="col-span-1"
          action={
            <Link href="/admin/users" className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">
              Manage →
            </Link>
          }
        >
          <div className="flex flex-col gap-2 pt-2 text-xs">
            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1C1917] font-medium">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Student Directory</span>
              </div>
              <span className="font-semibold text-[#1C1917] bg-[#E7E5E4] px-2 py-0.5 rounded-full text-[10px]">
                {stats.studentCount}
              </span>
            </div>

            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1C1917] font-medium">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Faculty Accounts</span>
              </div>
              <span className="font-semibold text-[#1C1917] bg-[#E7E5E4] px-2 py-0.5 rounded-full text-[10px]">
                {stats.teacherCount}
              </span>
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title="Academic Hierarchy Setup"
          subtitle="Semesters, Classes & Subjects"
          colSpan="col-span-1"
          action={
            <Link href="/admin/academic" className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">
              Configure →
            </Link>
          }
        >
          <div className="flex flex-col gap-2 pt-2 text-xs">
            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1C1917] font-medium">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Class Sections</span>
              </div>
              <span className="font-semibold text-[#1C1917] bg-[#E7E5E4] px-2 py-0.5 rounded-full text-[10px]">
                {stats.classCount}
              </span>
            </div>

            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1C1917] font-medium">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Timetable Management</span>
              </div>
              <span className="font-semibold text-[#1C1917] bg-[#E7E5E4] px-2 py-0.5 rounded-full text-[10px]">
                Active
              </span>
            </div>
          </div>
        </BentoCard>

        {/* Audit Log Panel */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <DarkLogCard logs={mockLogs} />
        </div>
      </BentoGrid>
    </div>
  );
}
