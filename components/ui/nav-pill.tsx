"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface NavPillProps {
  items: NavItem[];
  className?: string;
}

export function NavPill({ items, className }: NavPillProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "inline-flex items-center gap-1.5 p-1.5 rounded-full nav-pill-glass shadow-xs border border-[#E7E5E4] max-w-full overflow-x-auto no-scrollbar",
        className
      )}
    >
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300",
              isActive
                ? "bg-[#1C1917] text-white shadow-sm"
                : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#F2EFE9]"
            )}
          >
            {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-semibold rounded-full",
                  isActive ? "bg-[#FACC15] text-[#1C1917]" : "bg-[#E7E5E4] text-[#78716C]"
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
