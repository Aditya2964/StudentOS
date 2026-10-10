import { NavPill, NavItem } from "@/components/ui/nav-pill";
import {
  LayoutDashboard,
  FileSpreadsheet,
  UploadCloud,
  Megaphone,
  GraduationCap,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { requireTeacher } from "@/lib/auth/rbac";

const teacherNavItems: NavItem[] = [
  { label: "Overview", href: "/teacher/dashboard", icon: <LayoutDashboard /> },
  { label: "Assignments", href: "/teacher/assignments", icon: <FileSpreadsheet /> },
  { label: "Upload Notes", href: "/teacher/notes", icon: <UploadCloud /> },
  { label: "Announcements", href: "/teacher/announcements", icon: <Megaphone /> },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await requireTeacher();
  const displayName = session.user.name || "Faculty";
  const initials = getInitials(displayName);
  const department = session.user.teacherProfile?.department || "Faculty";

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE6DE] text-[#1C1917] p-4 md:p-6 lg:p-8">
      <header className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/teacher/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-medium tracking-tight text-[#1C1917]">
              Student<span className="bg-[#1C1917] text-[#FACC15] px-2 py-0.5 rounded-lg ml-0.5 text-base">OS</span>
            </span>
          </Link>
          <span className="bg-[#F2EFE9] border border-[#E7E5E4] px-3 py-1 rounded-full text-xs font-medium text-[#78716C]">
            {department}
          </span>
        </div>

        <NavPill items={teacherNavItems} />

        <div className="flex items-center gap-2 bg-[#F9F8F4] border border-[#E7E5E4] px-3 py-1.5 rounded-full shadow-xs">
          <div className="w-6 h-6 rounded-full bg-[#1C1917] text-[#FACC15] flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
          <span className="text-xs font-medium text-[#1C1917]">{displayName}</span>
          <Link href="/api/auth/logout" title="Sign out" className="text-[#78716C] hover:text-red-600 ml-1">
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto">{children}</main>
    </div>
  );
}

