"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, UserCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { loginUserAction } from "@/lib/auth/session";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TEACHER" | "ADMIN">("STUDENT");
  const [email, setEmail] = useState("name@student.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = (role: "STUDENT" | "TEACHER" | "ADMIN") => {
    setSelectedRole(role);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginUserAction({
        email,
        password,
        role: selectedRole,
      });

      if (result.success && result.redirectTo) {
        window.location.href = result.redirectTo;
      } else {
        setError(result.error || "Invalid credentials. Please check your email and password.");
        setLoading(false);
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Authentication failed. Please check credentials.");
      setLoading(false);
    }
  };



  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#EAE6DE]">
      <div className="w-full max-w-md bento-card-glass p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-xl border border-[#E7E5E4]">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1C1917] text-[#FACC15] mb-1 shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-[#1C1917]">
            Sign in to <span className="font-semibold">StudentOS</span>
          </h1>
          <p className="text-xs text-[#78716C]">
            Centralized Academic & Biometric Attendance Platform
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#F2EFE9] p-1.5 rounded-full border border-[#E7E5E4]">
          <button
            type="button"
            onClick={() => handleRoleChange("STUDENT")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-medium transition-all ${selectedRole === "STUDENT"
                ? "bg-[#1C1917] text-white shadow-sm"
                : "text-[#78716C] hover:text-[#1C1917]"
              }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Student
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("TEACHER")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-medium transition-all ${selectedRole === "TEACHER"
                ? "bg-[#1C1917] text-white shadow-sm"
                : "text-[#78716C] hover:text-[#1C1917]"
              }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Teacher
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("ADMIN")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-medium transition-all ${selectedRole === "ADMIN"
                ? "bg-[#1C1917] text-white shadow-sm"
                : "text-[#78716C] hover:text-[#1C1917]"
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" />
            Admin
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-[#78716C] ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@studentos.edu"
                className="w-full pl-10 pr-4 py-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-medium uppercase tracking-wider text-[#78716C]">
                Password
              </label>
              <a href="#" className="text-xs text-[#78716C] hover:text-[#1C1917]">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#1C1917] hover:bg-[#332F2C] text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign in as {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E7E5E4]">
          <Link href="/" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
            ← Back to StudentOS Home
          </Link>
        </div>

      </div>
    </div>
  );
}
