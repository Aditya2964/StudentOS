import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { StatItem } from "@/components/ui/stat-item";
import { FileSpreadsheet, UploadCloud, Users, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Teacher Portal</h1>
          <p className="text-xs text-[#78716C] mt-1">Welcome back, Prof. Sarah Smith • Computer Science Department</p>
        </div>

        <Link
          href="/teacher/notes"
          className="flex items-center gap-2 bg-[#1C1917] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-[#332F2C] transition-all shadow-md"
        >
          <UploadCloud className="w-4 h-4 text-[#FACC15]" />
          <span>Upload Course Notes</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <BentoGrid>
        <BentoCard colSpan="col-span-1">
          <StatItem label="Assigned Classes" value="3" unit="sections" icon={<Users />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Active Assignments" value="4" unit="active" icon={<FileSpreadsheet />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Submissions Pending Review" value="18" unit="pending" icon={<CheckCircle2 className="text-amber-500" />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Uploaded Materials" value="12" unit="PDFs" icon={<UploadCloud />} />
        </BentoCard>

        {/* Quick Shortcuts */}
        <BentoCard title="Class Management Shortcuts" subtitle="Direct Management Links" colSpan="col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/teacher/assignments"
              className="p-4 bg-[#F9F8F4] hover:bg-[#F2EFE9] border border-[#E7E5E4] rounded-2xl flex items-center justify-between transition-all group"
            >
              <div>
                <h4 className="text-xs font-medium text-[#1C1917]">Create Assignment</h4>
                <p className="text-[10px] text-[#78716C]">Set deadlines & attach resources</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#1C1917] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/teacher/notes"
              className="p-4 bg-[#F9F8F4] hover:bg-[#F2EFE9] border border-[#E7E5E4] rounded-2xl flex items-center justify-between transition-all group"
            >
              <div>
                <h4 className="text-xs font-medium text-[#1C1917]">Upload Study Material</h4>
                <p className="text-[10px] text-[#78716C]">Publish unit PDFs to Cloudflare R2</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#1C1917] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </BentoCard>

        <BentoCard title="Recent Submissions" subtitle="Needs Grading" colSpan="col-span-2">
          <div className="flex flex-col gap-2 pt-2 text-xs">
            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#1C1917]">Alex Johnson — DBMS Problem Set 3</h4>
                <p className="text-[10px] text-[#78716C]">Submitted Aug 14 at 4:20 PM</p>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Review Needed
              </span>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
