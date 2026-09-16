import { cn } from "@/lib/utils";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "surface" | "glass" | "dark";
  colSpan?: "col-span-1" | "col-span-2" | "col-span-3" | "col-span-4" | "col-span-full";
}

export function BentoCard({
  title,
  subtitle,
  badge,
  action,
  variant = "glass",
  colSpan,
  children,
  className,
  ...props
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden",
        variant === "glass" && "bento-card-glass",
        variant === "surface" && "bg-[#F9F8F4] border border-[#E7E5E4] shadow-xs",
        variant === "dark" && "bg-[#1A1A1A] text-[#D6D3D1] border border-stone-800 shadow-md",
        colSpan,
        className
      )}
      {...props}
    >
      {(title || subtitle || action || badge) && (
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex flex-col gap-0.5">
            {title && (
              <h3
                className={cn(
                  "text-base font-medium tracking-tight",
                  variant === "dark" ? "text-white" : "text-[#1C1917]"
                )}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className={cn(
                  "text-xs font-normal",
                  variant === "dark" ? "text-[#A8A29E]" : "text-[#78716C]"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {badge}
            {action}
          </div>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-[1600px] mx-auto", className)}>
      {children}
    </div>
  );
}
