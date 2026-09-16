import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

interface DarkLogCardProps {
  title?: string;
  logs: LogEntry[];
  maxHeight?: string;
  className?: string;
}

export function DarkLogCard({
  title = "Audit & Synchronization Logs",
  logs,
  maxHeight = "max-h-64",
  className,
}: DarkLogCardProps) {
  return (
    <div
      className={cn(
        "bg-[#1A1A1A] text-[#D6D3D1] p-6 rounded-[2rem] border border-stone-800 shadow-xl flex flex-col gap-4 font-mono text-xs",
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2 text-stone-300 font-sans font-medium text-sm">
          <Terminal className="w-4 h-4 text-[#FACC15]" />
          <span>{title}</span>
        </div>
        <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-400 font-sans">
          {logs.length} entries
        </span>
      </div>

      <div className={cn("overflow-y-auto space-y-2 pr-2 custom-scrollbar", maxHeight)}>
        {logs.length === 0 ? (
          <p className="text-stone-500 italic text-center py-4">No log entries available.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 py-1 border-b border-stone-800/40 last:border-none">
              <span className="text-stone-500 shrink-0 select-none">{log.timestamp}</span>
              <span
                className={cn(
                  "flex-1 break-all",
                  log.type === "success" && "text-emerald-400",
                  log.type === "warning" && "text-amber-400",
                  log.type === "error" && "text-rose-400",
                  (!log.type || log.type === "info") && "text-stone-300"
                )}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
