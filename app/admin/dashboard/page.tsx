import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { StatItem } from "@/components/ui/stat-item";
import { DarkLogCard } from "@/components/ui/dark-log-card";
import { ShieldCheck, Users, RefreshCw, FileSpreadsheet, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const mockLogs = [
    { id: "1", timestamp: "16:05:12", message: "Biometric API sync finished: 1,220 imported, 25 failed.", type: "success" as const },
    { id: "2", timestamp: "14:12:00", message: "Excel import batch 'Aug14_Biometric.xlsx' processed.", type: "info" as const },
    { id: "3", timestamp: "09:30:10", message: "Student account '2024CS105' registered.", type: "info" as const },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">System Administration</h1>
          <p className="text-xs text-[#78716C] mt-1">Institutional Biometric Attendance & Academic Operations</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/attendance/import"
            className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2.5 rounded-full text-xs font-medium hover:bg-[#332F2C] transition-all shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#FACC15]" />
            <span>Import Excel/CSV</span>
          </Link>
        </div>
      </div>

      <BentoGrid>
        <BentoCard colSpan="col-span-1">
          <StatItem label="Total Enrolled Students" value="1,245" unit="students" icon={<Users />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Faculty Members" value="48" unit="teachers" icon={<Building2 />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="API Sync Status" value="Online" icon={<RefreshCw className="text-emerald-500" />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Sync Accuracy" value="99.2" unit="%" icon={<CheckCircle2 className="text-emerald-500" />} />
        </BentoCard>

        <div className="col-span-2">
          <DarkLogCard logs={mockLogs} />
        </div>
      </BentoGrid>
    </div>
  );
}
