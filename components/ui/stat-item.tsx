import { cn } from "@/lib/utils";

interface StatItemProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export function StatItem({
  label,
  value,
  unit,
  trend,
  icon,
  className,
}: StatItemProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[#78716C]">
          {label}
        </span>
        {icon && <div className="text-[#78716C] w-4 h-4">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-4xl md:text-5xl font-light tracking-tight text-[#1C1917]">
          {value}
        </span>
        {unit && <span className="text-sm font-normal text-[#78716C]">{unit}</span>}
      </div>

      {trend && (
        <div className="flex items-center gap-1 mt-1 text-xs">
          <span
            className={cn(
              "font-medium px-1.5 py-0.5 rounded-full text-[10px]",
              trend.isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}
