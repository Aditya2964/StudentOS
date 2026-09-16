import { StatItem } from "@/components/ui/stat-item";
import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { Flame, Trophy, Award, CheckCircle2, BookOpen, Star } from "lucide-react";

export default function StudentRecordsPage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Personal Records</h1>
          <p className="text-xs text-[#78716C] mt-1">Your academic milestone highlights and progress metrics</p>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1917] text-[#FACC15] px-4 py-2 rounded-full text-xs font-semibold">
          <Star className="w-4 h-4 fill-[#FACC15]" />
          <span>Total Earned XP: 850 XP</span>
        </div>
      </div>

      {/* Record Highlights Bento Grid */}
      <BentoGrid>
        <BentoCard colSpan="col-span-1">
          <StatItem label="Longest Attendance Streak" value="32" unit="days" icon={<Flame className="text-amber-500" />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Highest Attendance %" value="92.4" unit="%" icon={<Trophy className="text-amber-500" />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Assignments Completed" value="14" unit="submitted" icon={<CheckCircle2 className="text-emerald-500" />} />
        </BentoCard>

        <BentoCard colSpan="col-span-1">
          <StatItem label="Study Sessions" value="28" unit="completed" icon={<BookOpen className="text-blue-500" />} />
        </BentoCard>

        {/* Milestone Milestones Breakdown */}
        <BentoCard title="Academic Milestones" subtitle="Personal Accomplishments" colSpan="col-span-2">
          <div className="flex flex-col gap-3 pt-2">
            <div className="p-3.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#1C1917]">30-Day Monthly Streak Master</h4>
                  <p className="text-[10px] text-[#78716C]">Achieved on Aug 01, 2026 (+200 XP)</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">VERIFIED</span>
            </div>

            <div className="p-3.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#1C1917]">Perfect On-Time Assignment Submission</h4>
                  <p className="text-[10px] text-[#78716C]">Completed 10 assignments on time (+300 XP)</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">VERIFIED</span>
            </div>
          </div>
        </BentoCard>

        <BentoCard title="XP Breakdown" subtitle="Earned Activity Points" colSpan="col-span-2">
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center justify-between p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl text-xs">
              <span className="font-medium text-[#1C1917]">Daily Biometric Attendance (+10 XP per day)</span>
              <span className="font-mono text-stone-600 font-semibold">+320 XP</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl text-xs">
              <span className="font-medium text-[#1C1917]">Early Assignment Submissions (+30 XP each)</span>
              <span className="font-mono text-stone-600 font-semibold">+180 XP</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl text-xs">
              <span className="font-medium text-[#1C1917]">Achievement Unlocks (+50 XP each)</span>
              <span className="font-mono text-stone-600 font-semibold">+350 XP</span>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
