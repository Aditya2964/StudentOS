"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCheck, Flame, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, Award } from "lucide-react";
import { loginUserAction } from "@/lib/auth/session";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("student@studentos.edu");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginUserAction({
        email,
        password,
        role: "STUDENT",
      });

      if (result.success && result.redirectTo) {
        window.location.href = result.redirectTo;
      } else {
        setError(result.error || "Authentication failed. Invalid student credentials.");
        setLoading(false);
      }
    } catch (err: unknown) {
      setError((err as Error).message || "System error. Please check server connection.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[#EAE6DE] text-[#1C1917] relative overflow-hidden selection:bg-[#FACC15] selection:text-[#1C1917]">
      {/* Background Ambience Warmth */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#F9F8F4] backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] flex flex-col gap-6 shadow-xl border border-[#E7E5E4] relative z-10">

        {/* Header Banner */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#1C1917] text-[#FACC15] flex items-center justify-center shadow-md">
              <UserCheck className="w-8 h-8" />
            </div>
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-100/70 border border-amber-200/70 text-amber-900 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Campus Academic Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#1C1917] pt-1">
              Student Sign In
            </h1>
            <p className="text-xs text-[#78716C]">
              Attendance Streaks, Assignments & Course Notes
            </p>
          </div>
        </div>

        {/* Motivational Streak Notice */}
        <div className="p-3 bg-[#F2EFE9] border border-[#E7E5E4] rounded-2xl flex items-center gap-3 text-xs text-[#1C1917]">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[11px] leading-tight text-[#78716C]">
            Sign in daily to protect your <span className="font-semibold text-[#1C1917]">attendance streaks</span> and unlock academic badges!
          </span>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Student Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#78716C] flex items-center justify-between ml-1">
              <span>Student Email / ID</span>
              <span className="text-[10px] text-[#A8A29E]">College Portal</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@studentos.edu"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E7E5E4] rounded-2xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-medium uppercase tracking-wider text-[#78716C]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E7E5E4] rounded-2xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-[#1C1917] hover:bg-[#332F2C] text-white font-medium text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Enter Student Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#FACC15] ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Quick Autofill Badge */}
        <div className="pt-2 border-t border-[#E7E5E4] flex flex-col gap-2.5 text-center">
          <div className="flex items-center justify-between text-[11px] text-[#78716C] px-1">
            <span>Demo Student Credentials:</span>
            <button
              type="button"
              onClick={() => {
                setEmail("student@studentos.edu");
                setPassword("password123");
              }}
              className="text-amber-700 hover:underline font-medium text-[11px]"
            >
              Fill Default
            </button>
          </div>

          <a
            href="/api/demo-login?role=student"
            className="w-full py-2 bg-[#F2EFE9] hover:bg-[#E7E5E4] text-[#1C1917] text-xs font-semibold rounded-xl border border-[#E7E5E4] transition-all flex items-center justify-center gap-1.5"
          >
            <span>⚡ Instant Demo Student Access</span>
          </a>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E7E5E4] text-xs text-[#78716C]">
          <Link href="/" className="hover:text-[#1C1917] transition-colors">
            ← Home
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login/teacher" className="hover:text-[#1C1917] transition-colors">
              Teacher Portal
            </Link>
            <span>•</span>
            <Link href="/login/admin" className="hover:text-[#1C1917] transition-colors">
              Admin Console
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
