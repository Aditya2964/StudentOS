"use client";

import { useState } from "react";
import { evaluateStudentAchievements, StudentAchievementProgress } from "@/lib/gamification/achievement-evaluator";
import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { Trophy, Lock, CheckCircle2, Flame, Award, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentAchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const achievementProgress: StudentAchievementProgress[] = evaluateStudentAchievements(32, 4, [
    "ach-1",
    "ach-2",
    "ach-3",
    "ach-7",
  ]);

  const filteredAchievements = achievementProgress.filter((item) => {
    if (selectedCategory === "ALL") return true;
    return item.achievement.category === selectedCategory;
  });

  const unlockedCount = achievementProgress.filter((a) => a.isUnlocked).length;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Badges & Achievements</h1>
          <p className="text-xs text-[#78716C] mt-1">Earn achievements and boost XP through consistency</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#1C1917] text-[#FACC15] px-4 py-2 rounded-full text-xs font-semibold shadow-xs">
            <Trophy className="w-4 h-4 text-[#FACC15]" />
            <span>{unlockedCount} / {achievementProgress.length} Badges Unlocked</span>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1 bg-[#F2EFE9] p-1 rounded-full border border-[#E7E5E4] overflow-x-auto w-fit">
        {["ALL", "ATTENDANCE", "ASSIGNMENT", "LEARNING", "ACADEMIC"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
              selectedCategory === cat
                ? "bg-[#1C1917] text-white shadow-xs"
                : "text-[#78716C] hover:text-[#1C1917]"
            )}
          >
            {cat === "ALL" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <BentoGrid>
        {filteredAchievements.map((item) => {
          const { achievement, isUnlocked, currentCount, requirementCount, progressPercentage } = item;

          return (
            <BentoCard
              key={achievement.id}
              title={achievement.title}
              subtitle={achievement.category}
              variant={isUnlocked ? "glass" : "surface"}
              badge={
                isUnlocked ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    UNLOCKED
                  </span>
                ) : (
                  <span className="bg-[#E7E5E4] text-[#78716C] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#78716C]" />
                    LOCKED
                  </span>
                )
              }
            >
              <div className="flex flex-col justify-between h-full pt-2 gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs",
                      isUnlocked ? "bg-amber-100 border border-amber-200" : "bg-[#E7E5E4] grayscale opacity-60"
                    )}
                  >
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="text-xs text-[#78716C] leading-relaxed">{achievement.description}</p>
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">+{achievement.xpReward} XP</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#78716C]">Progress</span>
                    <span className="font-mono text-[#1C1917] font-medium">
                      {currentCount} / {requirementCount} {achievement.category === "ATTENDANCE" ? "days" : "items"}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isUnlocked ? "bg-emerald-600" : "bg-[#1C1917]"
                      )}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  {!isUnlocked && (
                    <p className="text-[10px] text-[#78716C] text-right">
                      {requirementCount - currentCount} remaining
                    </p>
                  )}
                </div>
              </div>
            </BentoCard>
          );
        })}
      </BentoGrid>
    </div>
  );
}
