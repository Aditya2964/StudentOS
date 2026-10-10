"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Terminal, KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { loginUserAction } from "@/lib/auth/session";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@studentos.edu");
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
        role: "ADMIN",
      });

      if (result.success && result.redirectTo) {
        window.location.href = result.redirectTo;
      } else {
        setError(result.error || "Authentication failed. Invalid administrator credentials.");
        setLoading(false);
      }
    } catch (err: unknown) {
      setError((err as Error).message || "System error. Please check server connection.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[#09090B] text-white relative overflow-hidden selection:bg-[#FACC15] selection:text-black">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md bg-[#121215]/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl border border-stone-800 relative z-10">

        {/* Security Clearance Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-700/80 flex items-center justify-center text-[#FACC15] shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121215] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] text-[10px] font-mono font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <Terminal className="w-3 h-3" />
              <span>Root Institutional Clearance</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white pt-1">
              Admin Console
            </h1>
            <p className="text-xs text-stone-400">
              Biometric Attendance Engine & System Governance
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

        {/* Administrator Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 flex items-center justify-between ml-1">
              <span>Admin Identifier / Email</span>
              <span className="text-[10px] text-stone-500">Secured</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@studentos.edu"
                className="w-full pl-10 pr-4 py-3 bg-[#18181D] border border-stone-800 rounded-2xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Master Security Key
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-stone-400 hover:text-[#FACC15] flex items-center gap-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#18181D] border border-stone-800 rounded-2xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-semibold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Verifying Administrative Key...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-black" />
                <span>Authorize & Enter Console</span>
                <ArrowRight className="w-4 h-4 text-black ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Fast Autofill Badge */}
        <div className="pt-2 border-t border-stone-800/80 flex flex-col gap-2.5 text-center">
          <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>Development Quick-Fill:</span>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@studentos.edu");
                setPassword("password123");
              }}
              className="text-[#FACC15] hover:underline font-mono text-[11px]"
            >
              Fill Default Credentials
            </button>
          </div>

          <a
            href="/api/demo-login?role=admin"
            className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-mono rounded-xl border border-stone-800 transition-all flex items-center justify-center gap-1.5"
          >
            <span>⚡ Instant Live Admin Session</span>
          </a>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-300 transition-colors">
            ← Home
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login/teacher" className="hover:text-stone-300 transition-colors">
              Teacher Portal
            </Link>
            <span>•</span>
            <Link href="/login/student" className="hover:text-stone-300 transition-colors">
              Student Portal
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
