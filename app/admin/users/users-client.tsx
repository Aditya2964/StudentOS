"use client";

import { useState, useTransition } from "react";
import {
  UserPlus, Trash2, X, GraduationCap, ShieldCheck, UserCheck,
  Search, Mail, Lock, IdCard, Building2, BookUser, AlertCircle,
  CheckCircle2, Loader2,
} from "lucide-react";
import { addUserAction, deleteUserAction, UserRole } from "@/lib/actions/users";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  studentProfile: { userId: string; studentId: string; rollNumber: string | null } | null;
  teacherProfile: { userId: string; teacherId: string; department: string | null } | null;
};

const ROLE_CONFIG = {
  STUDENT: { label: "Student", icon: <UserCheck className="w-3.5 h-3.5" />, color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  TEACHER: { label: "Teacher", icon: <GraduationCap className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  ADMIN: { label: "Admin", icon: <ShieldCheck className="w-3.5 h-3.5" />, color: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
};

export default function UsersClient({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | UserRole>("ALL");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "STUDENT" as UserRole,
    studentId: "", rollNumber: "", teacherId: "", department: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "ALL" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    if (!form.name || !form.email || !form.password) {
      setFormError("Name, email and password are required.");
      setFormLoading(false);
      return;
    }

    startTransition(async () => {
      const result = await addUserAction(form);
      setFormLoading(false);
      if (result.success) {
        setShowModal(false);
        setForm({ name: "", email: "", password: "", role: "STUDENT", studentId: "", rollNumber: "", teacherId: "", department: "" });
        // Optimistically add to list for instant UI feedback
        const newUser: UserProfile = {
          id: result.userId || `temp-${Date.now()}`,
          name: form.name,
          email: form.email,
          role: form.role,
          createdAt: new Date(),
          studentProfile: form.role === "STUDENT" ? { userId: "", studentId: form.studentId || "—", rollNumber: form.rollNumber || null } : null,
          teacherProfile: form.role === "TEACHER" ? { userId: "", teacherId: form.teacherId || "—", department: form.department || null } : null,
        };
        setUsers((prev) => [...prev, newUser]);
        showToast("success", `${form.name} added successfully.`);
      } else {
        setFormError(result.error || "Failed to add user.");
      }
    });
  };

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      setDeleteConfirm(null);
      if (result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showToast("success", "User removed from the system.");
      } else {
        showToast("error", result.error || "Failed to delete user.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-12">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium transition-all ${
          toast.type === "success" ? "bg-emerald-900 text-emerald-100" : "bg-red-900 text-red-100"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">User Directory & Roles</h1>
          <p className="text-xs text-[#78716C] mt-1">
            {users.length} total users — {users.filter((u) => u.role === "STUDENT").length} Students,{" "}
            {users.filter((u) => u.role === "TEACHER").length} Teachers,{" "}
            {users.filter((u) => u.role === "ADMIN").length} Admins
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#332F2C] text-white px-5 py-2.5 rounded-full text-xs font-medium transition-all shadow-md"
        >
          <UserPlus className="w-4 h-4 text-[#FACC15]" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-full text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
          />
        </div>
        <div className="flex items-center gap-1 bg-[#F2EFE9] p-1 rounded-full border border-[#E7E5E4]">
          {(["ALL", "STUDENT", "TEACHER", "ADMIN"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterRole === role ? "bg-[#1C1917] text-white shadow-sm" : "text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              {role === "ALL" ? "All" : ROLE_CONFIG[role].label + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* User Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#78716C] text-sm">
          No users found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((u) => {
            const cfg = ROLE_CONFIG[u.role];
            const idLabel = u.role === "STUDENT"
              ? u.studentProfile?.studentId
              : u.role === "TEACHER"
              ? u.teacherProfile?.teacherId
              : "ADM";
            const sub = u.role === "TEACHER" ? u.teacherProfile?.department : u.studentProfile?.rollNumber;

            return (
              <div key={u.id} className="bg-[#F9F8F4] border border-[#E7E5E4] rounded-[1.75rem] p-5 flex flex-col gap-3 hover:shadow-md transition-all group">
                {/* Role badge + delete */}
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  {/* Delete button */}
                  {deleteConfirm === u.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={isPending}
                        className="text-[10px] bg-red-600 text-white px-2 py-1 rounded-full font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                      >
                        {isPending ? "..." : "Confirm"}
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} className="text-[#78716C] hover:text-[#1C1917]">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(u.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-[#78716C] hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Remove user"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#FACC15] flex items-center justify-center text-sm font-bold shrink-0">
                    {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1C1917] truncate">{u.name}</p>
                    <p className="text-xs text-[#78716C] truncate">{u.email}</p>
                  </div>
                </div>

                {/* ID + Extra info */}
                <div className="pt-1 border-t border-[#E7E5E4] flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#1C1917] bg-[#E7E5E4] px-2 py-0.5 rounded-lg">
                    {idLabel || "—"}
                  </span>
                  {sub && <span className="text-[11px] text-[#78716C]">{sub}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2rem] p-6 w-full max-w-md shadow-2xl flex flex-col gap-5">

            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#1C1917]">Add New User</h2>
                <p className="text-xs text-[#78716C] mt-0.5">Create a student, teacher, or admin account</p>
              </div>
              <button onClick={() => { setShowModal(false); setFormError(null); }} className="p-2 rounded-full hover:bg-[#E7E5E4] text-[#78716C] transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#EAE6DE] p-1 rounded-full border border-[#E7E5E4]">
              {(["STUDENT", "TEACHER", "ADMIN"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-full text-[11px] font-medium transition-all ${
                    form.role === role ? "bg-[#1C1917] text-white shadow-sm" : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  {ROLE_CONFIG[role].icon}
                  {ROLE_CONFIG[role].label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              {/* Name */}
              <div className="relative">
                <BookUser className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                <input
                  required value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Full Name *"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                <input
                  required type="email" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Email Address *"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                <input
                  required type="password" value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Temporary Password *"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                />
              </div>

              {/* Student-specific fields */}
              {form.role === "STUDENT" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <IdCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                    <input
                      value={form.studentId}
                      onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                      placeholder="Student ID (e.g. 2024CS101)"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                    />
                  </div>
                  <div className="relative">
                    <IdCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                    <input
                      value={form.rollNumber}
                      onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))}
                      placeholder="Roll Number"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                    />
                  </div>
                </div>
              )}

              {/* Teacher-specific fields */}
              {form.role === "TEACHER" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <IdCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                    <input
                      value={form.teacherId}
                      onChange={(e) => setForm((f) => ({ ...f, teacherId: e.target.value }))}
                      placeholder="Teacher ID (e.g. TCH-501)"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                    />
                  </div>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                    <input
                      value={form.department}
                      onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                      placeholder="Department"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={formLoading || isPending}
                className="w-full mt-1 py-3 bg-[#1C1917] hover:bg-[#332F2C] text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {formLoading || isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating User...</>
                ) : (
                  <><UserPlus className="w-4 h-4 text-[#FACC15]" /> Create {ROLE_CONFIG[form.role].label}</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
