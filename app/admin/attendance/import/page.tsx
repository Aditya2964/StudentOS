"use client";

import { useState } from "react";
import { BentoCard } from "@/components/ui/bento-card";
import { FileSpreadsheet, Upload, AlertCircle, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { importExcelAttendanceAction } from "@/lib/actions/attendance";
import type { AttendanceImportResult } from "@/lib/attendance/types";

export default function AdminAttendanceImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [report, setReport] = useState<AttendanceImportResult | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await importExcelAttendanceAction(formData);

      if (!res.success || !res.report) {
        setErrorMessage(res.error || "Failed to process spreadsheet.");
        setReport(null);
      } else {
        setReport(res.report);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred during import.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Excel / CSV Attendance Import</h1>
          <p className="text-xs text-[#78716C] mt-1">Upload official biometric spreadsheets (SheetJS batch parsing & duplicate detection)</p>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium">
          <FileSpreadsheet className="w-4 h-4 text-[#FACC15]" />
          <span>SheetJS Engine</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BentoCard title="Spreadsheet Upload" subtitle="Support .xlsx, .xls, .csv" colSpan="col-span-1">
          <form onSubmit={handleImport} className="flex flex-col gap-4 pt-2">
            <div className="border-2 border-dashed border-[#E7E5E4] p-6 rounded-2xl text-center bg-[#F9F8F4] flex flex-col items-center gap-2 cursor-pointer">
              <Upload className="w-8 h-8 text-[#78716C]" />
              <label htmlFor="csv-file" className="text-xs text-[#1C1917] font-medium cursor-pointer">
                {file ? file.name : "Click to select biometric spreadsheet"}
              </label>
              <span className="text-[10px] text-[#78716C]">Expected columns: Student ID, Date, Check In, Check Out, Status</span>
              <input
                type="file"
                required
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setErrorMessage(null);
                }}
                className="hidden"
                id="csv-file"
              />
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-3 bg-[#1C1917] text-white text-xs font-medium rounded-full hover:bg-[#332F2C] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FACC15]" />
                  <span>Processing Spreadsheet...</span>
                </>
              ) : (
                <span>Start Import Process</span>
              )}
            </button>
          </form>
        </BentoCard>

        {/* Report Display */}
        {report && (
          <BentoCard title="Import Report Summary" subtitle={`Batch Execution Results ${report.importId ? `(#${report.importId.slice(0, 8)})` : ""}`} colSpan="col-span-2">
            <div className="flex flex-col gap-4 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl">
                  <span className="text-2xl font-light text-[#1C1917]">{report.totalProcessed}</span>
                  <p className="text-[10px] text-[#78716C] uppercase tracking-wider mt-1 font-medium">Processed</p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
                  <span className="text-2xl font-light">{report.importedCount}</span>
                  <p className="text-[10px] uppercase tracking-wider mt-1 font-semibold">Imported</p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900">
                  <span className="text-2xl font-light">{report.duplicateCount}</span>
                  <p className="text-[10px] uppercase tracking-wider mt-1 font-semibold">Duplicates</p>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900">
                  <span className="text-2xl font-light">{report.failedCount}</span>
                  <p className="text-[10px] uppercase tracking-wider mt-1 font-semibold">Failed</p>
                </div>
              </div>

              {report.errors.length > 0 && (
                <div className="mt-2 p-3 bg-rose-50/50 border border-rose-200 rounded-2xl max-h-48 overflow-y-auto">
                  <p className="text-xs font-semibold text-rose-800 mb-2">Import Warnings & Issues:</p>
                  <div className="flex flex-col gap-1 text-[11px] text-rose-700">
                    {report.errors.slice(0, 10).map((err, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-500 mt-0.5" />
                        <span>Row {err.rowNumber} ({err.studentId}): {err.reason}</span>
                      </div>
                    ))}
                    {report.errors.length > 10 && (
                      <p className="text-[10px] text-rose-500 font-medium mt-1">
                        ...and {report.errors.length - 10} more rows with warnings.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </BentoCard>
        )}
      </div>
    </div>
  );
}
