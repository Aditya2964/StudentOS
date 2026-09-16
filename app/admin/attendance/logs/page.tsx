import { DarkLogCard, LogEntry } from "@/components/ui/dark-log-card";
import { Terminal } from "lucide-react";

export default function AdminAttendanceLogsPage() {
  const auditLogs: LogEntry[] = [
    { id: "1", timestamp: "2026-08-14 16:05:12", message: "API Sync Success: Processed 1,245 biometric punch records. 1,220 imported, 15 duplicates skipped, 10 failed.", type: "success" },
    { id: "2", timestamp: "2026-08-14 14:12:00", message: "CSV Batch Import 'Aug14_Biometric.xlsx' completed by Admin (ID: usr-admin-1).", type: "info" },
    { id: "3", timestamp: "2026-08-13 16:00:05", message: "API Sync Partial: 1,200 processed. 2 invalid student IDs encountered: '2024CS999', '2024CS998'.", type: "warning" },
    { id: "4", timestamp: "2026-08-12 16:00:01", message: "API Sync Success: Processed 1,240 records.", type: "success" },
    { id: "5", timestamp: "2026-08-10 02:00:00", message: "Scheduled Maintenance: Biometric API Endpoint connection re-established.", type: "info" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Import & Sync Audit Logs</h1>
          <p className="text-xs text-[#78716C] mt-1">Historical attendance synchronization and file import error trace reports</p>
        </div>

        <div className="flex items-center gap-2 bg-[#1A1A1A] text-[#FACC15] px-4 py-2 rounded-full text-xs font-mono">
          <Terminal className="w-4 h-4" />
          <span>Audit Log Engine</span>
        </div>
      </div>

      <DarkLogCard title="Institutional Audit Trail" logs={auditLogs} maxHeight="max-h-96" />
    </div>
  );
}
