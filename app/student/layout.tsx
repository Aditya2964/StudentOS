import { NavPill, NavItem } from "@/components/ui/nav-pill";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  BookOpen,
  Clock,
  Award,
  BarChart3,
  Bell,
  Flame,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { AIChatPanel } from "@/components/ai/ai-chat-panel";
import { requireStudent } from "@/lib/auth/rbac";

const studentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: <LayoutDashboard /> },
  { label: "Attendance", href: "/student/attendance", icon: <CalendarCheck /> },
  { label: "Assignments", href: "/student/assignments", icon: <FileText />, badge: "2" },
  { label: "Notes", href: "/student/notes", icon: <BookOpen /> },
  { label: "Timetable", href: "/student/timetable", icon: <Clock /> },
  { label: "Achievements", href: "/student/achievements", icon: <Award /> },
  { label: "Records", href: "/student/records", icon: <BarChart3 /> },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStudent();
  const displayName = session.user.name || "Student";
  const initials = getInitials(displayName);
  const studentId = session.user.studentProfile?.studentId || "StudentOS";

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE6DE] text-[#1C1917] p-4 md:p-6 lg:p-8 relative">
      {/* Top Header */}
      <header className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-medium tracking-tight text-[#1C1917]">
              Student<span className="bg-[#1C1917] text-[#FACC15] px-2 py-0.5 rounded-lg ml-0.5 text-base">OS</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 bg-[#F9F8F4] px-3 py-1 rounded-full border border-[#E7E5E4] text-xs text-[#78716C]">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-[#1C1917]">ID: {studentId}</span>
          </div>
        </div>

        {/* Floating Pill Navigation */}
        <NavPill items={studentNavItems} />

        {/* User Pill */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-[#F9F8F4] border border-[#E7E5E4] text-[#78716C] hover:text-[#1C1917] transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
          </button>
          
          <div className="flex items-center gap-2 bg-[#F9F8F4] border border-[#E7E5E4] px-3 py-1.5 rounded-full shadow-xs">
            <div className="w-6 h-6 rounded-full bg-[#1C1917] text-[#FACC15] flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <span className="text-xs font-medium text-[#1C1917]">{displayName}</span>
            <Link href="/api/auth/logout" title="Sign out" className="text-[#78716C] hover:text-red-600 ml-1">
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto">{children}</main>

      {/* Floating AI Chat Panel */}
      <AIChatPanel />
    </div>
  );
}

