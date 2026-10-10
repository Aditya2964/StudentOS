"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, BookOpen, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, Building2 } from "lucide-react";
import { loginUserAction } from "@/lib/auth/session";

export default function TeacherLoginPage() {
  const [email, setEmail] = useState("teacher@studentos.edu");
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
        role: "TEACHER",
      });

      if (result.success && result.redirectTo) {
        window.location.href = result.redirectTo;
      } else {
        setError(result.error || "Authentication failed. Invalid faculty credentials.");
        setLoading(false);
      }
    } catch (err: unknown) {
      setError((err as Error).message || "System error. Please check server connection.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[#071912] text-white relative overflow-hidden selection:bg-emerald-400 selection:text-black">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/3 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Scholarly Crest Motif */}
      <div className="w-full max-w-md bg-[#0D261C]/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl border border-emerald-800/40 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-[#0A1F17] border border-emerald-600/30 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-950/50">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <Building2 className="w-3 h-3 text-emerald-400" />
              <span>Academic Faculty Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white pt-1">
              Educator Sign In
            </h1>
            <p className="text-xs text-emerald-200/70">
              Curriculum Notes, Assignments & Grade Management
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs rounded-2xl">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Faculty Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-emerald-200/70 flex items-center justify-between ml-1">
              <span>Faculty Email Address</span>
              <span className="text-[10px] text-emerald-400/60">Institutional ID</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@studentos.edu"
                className="w-full pl-10 pr-4 py-3 bg-[#081C15] border border-emerald-800/50 rounded-2xl text-sm text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-medium uppercase tracking-wider text-emerald-200/70">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-emerald-300/70 hover:text-emerald-200 flex items-center gap-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#081C15] border border-emerald-800/50 rounded-2xl text-sm text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-[#051610] font-semibold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating Faculty Profile...</span>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                <span>Enter Educator Portal</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Quick Autofill Badge */}
        <div className="pt-2 border-t border-emerald-800/40 flex flex-col gap-2.5 text-center">
          <div className="flex items-center justify-between text-[11px] text-emerald-200/70 px-1">
            <span>Demo Faculty Credentials:</span>
            <button
              type="button"
              onClick={() => {
                setEmail("teacher@studentos.edu");
                setPassword("password123");
              }}
              className="text-emerald-300 hover:underline font-mono text-[11px]"
            >
              Fill Default
            </button>
          </div>

          <a
            href="/api/demo-login?role=teacher"
            className="w-full py-2 bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-200 text-xs rounded-xl border border-emerald-700/40 transition-all flex items-center justify-center gap-1.5"
          >
            <span>⚡ Instant Demo Educator Access</span>
          </a>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40 text-xs text-emerald-400/60">
          <Link href="/" className="hover:text-emerald-200 transition-colors">
            ← Home
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login/student" className="hover:text-emerald-200 transition-colors">
              Student Portal
            </Link>
            <span>•</span>
            <Link href="/login/admin" className="hover:text-emerald-200 transition-colors">
              Admin Console
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
