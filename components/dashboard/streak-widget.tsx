import { BentoCard } from "@/components/ui/bento-card";
import { Flame, Trophy } from "lucide-react";
import Link from "next/link";

interface StreakWidgetProps {
  currentStreak: number;
  nextMilestoneTitle: string;
  nextMilestoneCount: number;
}

export function StreakWidget({
  currentStreak = 32,
  nextMilestoneTitle = "Consistency Champion",
  nextMilestoneCount = 60,
}: StreakWidgetProps) {
  const progressPercent = Math.min(100, Math.round((currentStreak / nextMilestoneCount) * 100));
  const daysRemaining = Math.max(0, nextMilestoneCount - currentStreak);

  return (
    <BentoCard
      title="Attendance Streak"
      subtitle="Consecutive Working Days"
      colSpan="col-span-1"
      action={
        <Link href="/achievements" className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">
          Badges →
        </Link>
      }
    >
      <div className="flex flex-col justify-between h-full pt-1 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 shadow-xs shrink-0">
            <Flame className="w-6 h-6 fill-amber-500 animate-bounce" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-light text-[#1C1917]">{currentStreak}</span>
              <span className="text-xs font-medium text-[#78716C]">Days</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
              Streak Active 🔥
            </span>
          </div>
        </div>

        {/* Next Achievement Progress */}
        <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {nextMilestoneTitle}
            </span>
            <span className="text-[#78716C] font-mono text-[11px]">
              {currentStreak} / {nextMilestoneCount}d
            </span>
          </div>

          <div className="w-full h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1C1917] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-[#78716C] text-right">
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Achievement Unlocked! 🎉"}
          </p>
        </div>
      </div>
    </BentoCard>
  );
}
