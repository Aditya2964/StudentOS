import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, UserCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12 bg-[#EAE6DE]">
      <main className="w-full max-w-4xl bento-card-glass p-8 md:p-12 rounded-[2.5rem] flex flex-col items-center text-center gap-8">
        <div className="flex items-center gap-3 bg-[#F9F8F4] border border-[#E7E5E4] px-5 py-2 rounded-full shadow-xs">
          <GraduationCap className="w-5 h-5 text-[#1C1917]" />
          <span className="text-xs uppercase tracking-wider font-medium text-[#78716C]">
            Academic Platform v1.0
          </span>
        </div>

        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1C1917]">
            Student<span className="text-[#FACC15] bg-[#1C1917] px-2 py-0.5 rounded-lg ml-1">OS</span>
          </h1>
          <p className="text-base md:text-lg text-[#78716C] leading-relaxed font-normal">
            Everything a student needs for college, in one place. Centralizing official biometric attendance, assignment workflows, study materials, timetable schedules, and AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
          <Link
            href="/student/dashboard"
            className="flex flex-col items-center justify-between p-6 bg-[#F9F8F4] hover:bg-[#F2EFE9] border border-[#E7E5E4] rounded-[2rem] transition-all group"
          >
            <UserCheck className="w-8 h-8 text-[#1C1917] mb-4" />
            <div className="text-center">
              <h2 className="text-lg font-medium text-[#1C1917]">Student Portal</h2>
              <p className="text-xs text-[#78716C] mt-1">View attendance, streaks, assignments & notes</p>
            </div>
            <div className="mt-6 flex items-center text-xs font-medium text-[#1C1917] group-hover:translate-x-1 transition-transform">
              Enter Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/teacher/dashboard"
            className="flex flex-col items-center justify-between p-6 bg-[#F9F8F4] hover:bg-[#F2EFE9] border border-[#E7E5E4] rounded-[2rem] transition-all group"
          >
            <GraduationCap className="w-8 h-8 text-[#1C1917] mb-4" />
            <div className="text-center">
              <h2 className="text-lg font-medium text-[#1C1917]">Teacher Portal</h2>
              <p className="text-xs text-[#78716C] mt-1">Upload materials, manage assignments & reviews</p>
            </div>
            <div className="mt-6 flex items-center text-xs font-medium text-[#1C1917] group-hover:translate-x-1 transition-transform">
              Enter Portal <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard"
            className="flex flex-col items-center justify-between p-6 bg-[#1A1A1A] text-[#D6D3D1] hover:bg-[#262626] rounded-[2rem] transition-all group"
          >
            <ShieldCheck className="w-8 h-8 text-[#FACC15] mb-4" />
            <div className="text-center">
              <h2 className="text-lg font-medium text-white">Admin Portal</h2>
              <p className="text-xs text-[#A8A29E] mt-1">Biometric CSV/API sync, users & academic data</p>
            </div>
            <div className="mt-6 flex items-center text-xs font-medium text-[#FACC15] group-hover:translate-x-1 transition-transform">
              System Admin <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
