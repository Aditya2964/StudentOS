import { NavPill, NavItem } from "@/components/ui/nav-pill";
import {
  ShieldCheck,
  FileSpreadsheet,
  RefreshCw,
  Terminal,
  Users,
  Building2,
  Calendar,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/rbac";

const adminNavItems: NavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: <ShieldCheck /> },
  { label: "CSV Import", href: "/admin/attendance/import", icon: <FileSpreadsheet /> },
  { label: "API Sync", href: "/admin/attendance/api-sync", icon: <RefreshCw /> },
  { label: "Audit Logs", href: "/admin/attendance/logs", icon: <Terminal /> },
  { label: "Users", href: "/admin/users", icon: <Users /> },
  { label: "Academic", href: "/admin/academic", icon: <Building2 /> },
  { label: "Timetables", href: "/admin/timetable", icon: <Calendar /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const displayName = session.user.name || "System Admin";

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE6DE] text-[#1C1917] p-4 md:p-6 lg:p-8">
      <header className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-medium tracking-tight text-[#1C1917]">
              Student<span className="bg-[#1A1A1A] text-[#FACC15] px-2 py-0.5 rounded-lg ml-0.5 text-base">OS</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 bg-[#1A1A1A] border border-stone-800 text-[#D6D3D1] px-3 py-1 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">API 🟢 Connected</span>
          </div>
        </div>

        <NavPill items={adminNavItems} />

        <div className="flex items-center gap-2 bg-[#1A1A1A] border border-stone-800 text-[#D6D3D1] px-3 py-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#FACC15]" />
          <span className="text-xs font-medium text-white">{displayName}</span>
          <Link href="/api/auth/logout" title="Sign out" className="text-stone-400 hover:text-red-400 ml-1">
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto">{children}</main>
    </div>
  );
}

