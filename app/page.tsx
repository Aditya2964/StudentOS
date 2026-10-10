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
            href="/login/student"
            className="flex flex-col items-center justify-between p-6 bg-[#F9F8F4] hover:bg-[#F2EFE9] border border-[#E7E5E4] rounded-[2rem] transition-all group shadow-xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-4 group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6 text-[#1C1917]" />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                Learner Hub
              </span>
              <h2 className="text-lg font-medium text-[#1C1917] mt-2">Student Portal</h2>
              <p className="text-xs text-[#78716C] mt-1">View attendance, streaks, assignments & study materials</p>
            </div>
            <div className="mt-6 flex items-center text-xs font-medium text-[#1C1917] group-hover:translate-x-1 transition-transform">
              Student Sign In <ArrowRight className="w-4 h-4 ml-1 text-amber-600" />
            </div>
          </Link>

          <Link
            href="/login/teacher"
            className="flex flex-col items-center justify-between p-6 bg-[#F9F8F4] hover:bg-[#F2EFE9] border border-[#E7E5E4] rounded-[2rem] transition-all group shadow-xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 border border-emerald-200/60 flex items-center justify-center text-emerald-700 mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-emerald-800" />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                Faculty Desk
              </span>
              <h2 className="text-lg font-medium text-[#1C1917] mt-2">Teacher Portal</h2>
              <p className="text-xs text-[#78716C] mt-1">Upload materials, manage assignments & reviews</p>
            </div>
            <div className="mt-6 flex items-center text-xs font-medium text-[#1C1917] group-hover:translate-x-1 transition-transform">
              Faculty Sign In <ArrowRight className="w-4 h-4 ml-1 text-emerald-700" />
            </div>
          </Link>

          <Link
            href="/login/admin"
            className="flex flex-col items-center justify-between p-6 bg-[#121214] text-[#D6D3D1] hover:bg-[#1A1A1E] border border-stone-800 rounded-[2rem] transition-all group shadow-md hover:shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center text-[#FACC15] mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-[#FACC15]" />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#FACC15] bg-[#FACC15]/10 px-2.5 py-0.5 rounded-full border border-[#FACC15]/20">
                Institutional Ops
              </span>
              <h2 className="text-lg font-medium text-white mt-2">Admin Portal</h2>
              <p className="text-xs text-[#A8A29E] mt-1">Biometric CSV/API sync, users & academic configurations</p>
            </div>
            <div className="mt-6 flex items-center text-xs font-medium text-[#FACC15] group-hover:translate-x-1 transition-transform">
              Admin Console <ArrowRight className="w-4 h-4 ml-1 text-[#FACC15]" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
