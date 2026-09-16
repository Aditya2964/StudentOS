import Link from "next/link";
import { BentoCard } from "@/components/ui/bento-card";
import { ArrowUpRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceCardProps {
  percentage: number;
  statusLabel: "SAFE" | "WARNING" | "CRITICAL";
  predictionSentence: string;
  className?: string;
}

export function AttendanceCard({
  percentage,
  statusLabel,
  predictionSentence,
  className,
}: AttendanceCardProps) {
  return (
    <BentoCard
      title="Biometric Attendance"
      subtitle="Official Daily Record"
      colSpan="col-span-2"
      action={
        <Link
          href="/attendance"
          className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#78716C] hover:text-[#1C1917] transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      }
      badge={
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1",
            statusLabel === "SAFE" && "bg-emerald-100 text-emerald-800",
            statusLabel === "WARNING" && "bg-amber-100 text-amber-800",
            statusLabel === "CRITICAL" && "bg-rose-100 text-rose-800"
          )}
        >
          {statusLabel === "SAFE" ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          ) : statusLabel === "WARNING" ? (
            <AlertTriangle className="w-3 h-3 text-amber-600" />
          ) : (
            <XCircle className="w-3 h-3 text-rose-600" />
          )}
          {statusLabel}
        </span>
      }
      className={className}
    >
      <div className="flex flex-col justify-between h-full pt-2 gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-light tracking-tight text-[#1C1917]">
            {percentage}%
          </span>
          <span className="text-xs text-[#78716C] font-medium">Target: 75%</span>
        </div>

        <div className="p-3.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl text-xs text-[#1C1917] leading-relaxed flex items-start gap-2">
          <span className="text-amber-500 font-bold shrink-0">💡</span>
          <span>{predictionSentence}</span>
        </div>
      </div>
    </BentoCard>
  );
}
