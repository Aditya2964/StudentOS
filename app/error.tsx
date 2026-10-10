"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("StudentOS application boundary error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#EAE6DE] flex items-center justify-center p-6 text-[#1C1917]">
      <div className="w-full max-w-md bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-medium tracking-tight text-[#1C1917]">
            Something unexpected occurred
          </h2>
          <p className="text-xs text-[#78716C] leading-relaxed">
            {error.message || "An unexpected error interrupted the request. You can retry or head back to safety."}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 bg-[#1C1917] text-white text-xs font-medium rounded-full hover:bg-[#332F2C] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="py-3 px-4 bg-[#F2EFE9] text-[#1C1917] text-xs font-medium rounded-full hover:bg-[#E7E5E4] border border-[#E7E5E4] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-[#78716C]" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
