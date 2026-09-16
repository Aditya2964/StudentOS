"use client";

import { useState } from "react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { RefreshCw, CheckCircle2, ShieldCheck, Server } from "lucide-react";

export default function AdminAttendanceApiSyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("14 Aug 2026, 4:05 PM");

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date().toLocaleString());
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Biometric API Integration</h1>
          <p className="text-xs text-[#78716C] mt-1">Automatic & Manual Institutional Attendance API Synchronization</p>
        </div>

        <button
          onClick={handleSyncNow}
          disabled={syncing}
          className="flex items-center gap-2 bg-[#1C1917] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-[#332F2C] transition-all shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#FACC15] ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Synchronizing API..." : "Sync Now"}</span>
        </button>
      </div>

      <BentoGrid>
        <BentoCard title="API Connection Status" subtitle="Institutional Machine Endpoint" colSpan="col-span-2">
          <div className="flex flex-col gap-3 pt-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-semibold text-emerald-900">API Status: 🟢 Connected</h4>
                  <p className="text-[11px] text-emerald-700">Endpoint: https://biometrics.college.edu/api/v1/logs</p>
                </div>
              </div>
              <span className="text-xs text-[#78716C]">Last Sync: {lastSync}</span>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
