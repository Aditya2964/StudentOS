"use client";

import { useState, useTransition } from "react";
import {
  BookOpen,
  Building2,
  Calendar,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { BentoCard } from "@/components/ui/bento-card";
import {
  addSubjectAction,
  deleteSubjectAction,
  addClassAction,
  deleteClassAction,
  addSemesterAction,
  deleteSemesterAction,
} from "@/lib/actions/academic";

interface Semester {
  id: string;
  name: string;
  academicYear: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

interface ClassItem {
  id: string;
  name: string;
  department: string;
  semesterId: string | null;
  semesterName?: string | null;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  credits: number;
  semesterId: string | null;
  semesterName?: string | null;
}

interface AcademicClientProps {
  initialSemesters: Semester[];
  initialClasses: ClassItem[];
  initialSubjects: SubjectItem[];
}

export default function AcademicClient({
  initialSemesters,
  initialClasses,
  initialSubjects,
}: AcademicClientProps) {
  const [activeTab, setActiveTab] = useState<"SUBJECTS" | "CLASSES" | "SEMESTERS">("SUBJECTS");
  const [semestersList, setSemestersList] = useState<Semester[]>(initialSemesters);
  const [classesList, setClassesList] = useState<ClassItem[]>(initialClasses);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>(initialSubjects);

  const [showModal, setShowModal] = useState<"SUBJECT" | "CLASS" | "SEMESTER" | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "subject" | "class" | "semester"; id: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Subject Form
  const [subjectForm, setSubjectForm] = useState({ name: "", code: "", credits: 3, semesterId: "" });
  // Class Form
  const [classForm, setClassForm] = useState({ name: "", department: "", semesterId: "" });
  // Semester Form
  const [semesterForm, setSemesterForm] = useState({
    name: "",
    academicYear: "2026-2027",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    startTransition(async () => {
      const res = await addSubjectAction({
        name: subjectForm.name,
        code: subjectForm.code,
        credits: Number(subjectForm.credits),
        semesterId: subjectForm.semesterId || undefined,
      });
      setFormLoading(false);

      if (res.success && res.subject) {
        const semesterObj = semestersList.find((s) => s.id === res.subject.semesterId);
        setSubjectsList((prev) => [
          {
            ...res.subject,
            semesterName: semesterObj ? semesterObj.name : null,
          },
          ...prev,
        ]);
        setShowModal(null);
        setSubjectForm({ name: "", code: "", credits: 3, semesterId: "" });
        showToast("success", `Subject "${res.subject.name}" added successfully.`);
      } else {
        setFormError(res.error || "Failed to add subject.");
      }
    });
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    startTransition(async () => {
      const res = await addClassAction({
        name: classForm.name,
        department: classForm.department,
        semesterId: classForm.semesterId || undefined,
      });
      setFormLoading(false);

      if (res.success && res.class) {
        const semesterObj = semestersList.find((s) => s.id === res.class.semesterId);
        setClassesList((prev) => [
          {
            ...res.class,
            semesterName: semesterObj ? semesterObj.name : null,
          },
          ...prev,
        ]);
        setShowModal(null);
        setClassForm({ name: "", department: "", semesterId: "" });
        showToast("success", `Class "${res.class.name}" created successfully.`);
      } else {
        setFormError(res.error || "Failed to add class.");
      }
    });
  };

  const handleAddSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    startTransition(async () => {
      const res = await addSemesterAction({
        name: semesterForm.name,
        academicYear: semesterForm.academicYear,
        startDate: semesterForm.startDate,
        endDate: semesterForm.endDate,
        isCurrent: semesterForm.isCurrent,
      });
      setFormLoading(false);

      if (res.success && res.semester) {
        setSemestersList((prev) => [res.semester, ...prev]);
        setShowModal(null);
        setSemesterForm({
          name: "",
          academicYear: "2026-2027",
          startDate: "",
          endDate: "",
          isCurrent: false,
        });
        showToast("success", `Semester "${res.semester.name}" added successfully.`);
      } else {
        setFormError(res.error || "Failed to add semester.");
      }
    });
  };

  const handleDelete = (type: "subject" | "class" | "semester", id: string) => {
    startTransition(async () => {
      if (type === "subject") {
        const res = await deleteSubjectAction(id);
        if (res.success) {
          setSubjectsList((prev) => prev.filter((s) => s.id !== id));
          showToast("success", "Subject removed.");
        } else showToast("error", res.error || "Failed to delete.");
      } else if (type === "class") {
        const res = await deleteClassAction(id);
        if (res.success) {
          setClassesList((prev) => prev.filter((c) => c.id !== id));
          showToast("success", "Class division removed.");
        } else showToast("error", res.error || "Failed to delete.");
      } else if (type === "semester") {
        const res = await deleteSemesterAction(id);
        if (res.success) {
          setSemestersList((prev) => prev.filter((s) => s.id !== id));
          showToast("success", "Semester removed.");
        } else showToast("error", res.error || "Failed to delete.");
      }
      setDeleteConfirm(null);
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium transition-all animate-in fade-in slide-in-from-top-4 ${
            toast.type === "success"
              ? "bg-[#1C1917] text-white border-stone-800"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Academic Structure</h1>
          <p className="text-xs text-[#78716C] mt-1">
            Configure Courses, Class Sections, and Academic Semesters
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "SUBJECTS" && (
            <button
              onClick={() => {
                setFormError(null);
                setShowModal("SUBJECT");
              }}
              className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#332F2C] text-white px-4 py-2.5 rounded-full text-xs font-medium transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4 text-[#FACC15]" />
              <span>Add Subject</span>
            </button>
          )}

          {activeTab === "CLASSES" && (
            <button
              onClick={() => {
                setFormError(null);
                setShowModal("CLASS");
              }}
              className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#332F2C] text-white px-4 py-2.5 rounded-full text-xs font-medium transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4 text-[#FACC15]" />
              <span>Add Class</span>
            </button>
          )}

          {activeTab === "SEMESTERS" && (
            <button
              onClick={() => {
                setFormError(null);
                setShowModal("SEMESTER");
              }}
              className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#332F2C] text-white px-4 py-2.5 rounded-full text-xs font-medium transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4 text-[#FACC15]" />
              <span>Add Semester</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-[#F2EFE9] p-1.5 rounded-full border border-[#E7E5E4] w-fit">
        <button
          onClick={() => setActiveTab("SUBJECTS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === "SUBJECTS"
              ? "bg-[#1C1917] text-white shadow-xs"
              : "text-[#78716C] hover:text-[#1C1917]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#FACC15]" />
          <span>Subjects ({subjectsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("CLASSES")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === "CLASSES"
              ? "bg-[#1C1917] text-white shadow-xs"
              : "text-[#78716C] hover:text-[#1C1917]"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-[#FACC15]" />
          <span>Classes ({classesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("SEMESTERS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === "SEMESTERS"
              ? "bg-[#1C1917] text-white shadow-xs"
              : "text-[#78716C] hover:text-[#1C1917]"
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#FACC15]" />
          <span>Semesters ({semestersList.length})</span>
        </button>
      </div>

      {/* TAB 1: SUBJECTS */}
      {activeTab === "SUBJECTS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectsList.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#F9F8F4] rounded-[2rem] border border-[#E7E5E4] text-[#78716C] text-xs">
              No subjects added yet. Click &quot;Add Subject&quot; above to add your first course.
            </div>
          ) : (
            subjectsList.map((subj) => (
              <BentoCard
                key={subj.id}
                title={subj.name}
                subtitle={`${subj.code} • ${subj.credits} Credits`}
                badge={
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                    {subj.semesterName || "General"}
                  </span>
                }
              >
                <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E4] mt-3">
                  <span className="text-xs text-[#78716C]">Credits: {subj.credits}</span>
                  <button
                    onClick={() => setDeleteConfirm({ type: "subject", id: subj.id })}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </BentoCard>
            ))
          )}
        </div>
      )}

      {/* TAB 2: CLASSES */}
      {activeTab === "CLASSES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesList.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#F9F8F4] rounded-[2rem] border border-[#E7E5E4] text-[#78716C] text-xs">
              No class sections created yet. Click &quot;Add Class&quot; above to create one.
            </div>
          ) : (
            classesList.map((cls) => (
              <BentoCard
                key={cls.id}
                title={cls.name}
                subtitle={`Department: ${cls.department}`}
                badge={
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 uppercase">
                    {cls.semesterName || "Active"}
                  </span>
                }
              >
                <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E4] mt-3">
                  <span className="text-xs text-[#78716C]">{cls.department}</span>
                  <button
                    onClick={() => setDeleteConfirm({ type: "class", id: cls.id })}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </BentoCard>
            ))
          )}
        </div>
      )}

      {/* TAB 3: SEMESTERS */}
      {activeTab === "SEMESTERS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {semestersList.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#F9F8F4] rounded-[2rem] border border-[#E7E5E4] text-[#78716C] text-xs">
              No semesters registered yet. Click &quot;Add Semester&quot; above.
            </div>
          ) : (
            semestersList.map((sem) => (
              <BentoCard
                key={sem.id}
                title={sem.name}
                subtitle={`Academic Year: ${sem.academicYear}`}
                badge={
                  sem.isCurrent ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 uppercase">
                      Current Term
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-[#78716C] uppercase">
                      Archive
                    </span>
                  )
                }
              >
                <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E4] mt-3 text-xs text-[#78716C]">
                  <span>
                    {new Date(sem.startDate).toLocaleDateString()} —{" "}
                    {new Date(sem.endDate).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setDeleteConfirm({ type: "semester", id: sem.id })}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Semester"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </BentoCard>
            ))
          )}
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {showModal === "SUBJECT" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1C1917]" />
                <h3 className="font-semibold text-base text-[#1C1917]">Add New Subject</h3>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubject} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management Systems"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS501"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={subjectForm.credits}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })
                    }
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Assigned Semester (Optional)
                </label>
                <select
                  value={subjectForm.semesterId}
                  onChange={(e) => setSubjectForm({ ...subjectForm, semesterId: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                >
                  <option value="">-- None / General --</option>
                  {semestersList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.academicYear})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full mt-2 py-3 bg-[#1C1917] hover:bg-[#332F2C] text-white rounded-full text-xs font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#FACC15]" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#FACC15]" />
                    <span>Create Subject</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CLASS */}
      {showModal === "CLASS" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#1C1917]" />
                <h3 className="font-semibold text-base text-[#1C1917]">Add Class Division</h3>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddClass} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Class / Section Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-A 3rd Year"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={classForm.department}
                  onChange={(e) => setClassForm({ ...classForm, department: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Semester (Optional)
                </label>
                <select
                  value={classForm.semesterId}
                  onChange={(e) => setClassForm({ ...classForm, semesterId: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                >
                  <option value="">-- None --</option>
                  {semestersList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.academicYear})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full mt-2 py-3 bg-[#1C1917] hover:bg-[#332F2C] text-white rounded-full text-xs font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#FACC15]" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#FACC15]" />
                    <span>Create Class</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SEMESTER */}
      {showModal === "SEMESTER" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1C1917]" />
                <h3 className="font-semibold text-base text-[#1C1917]">Add Academic Semester</h3>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSemester} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Semester Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semester 5 (Fall 2026)"
                  value={semesterForm.name}
                  onChange={(e) => setSemesterForm({ ...semesterForm, name: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Academic Year
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-2027"
                  value={semesterForm.academicYear}
                  onChange={(e) =>
                    setSemesterForm({ ...semesterForm, academicYear: e.target.value })
                  }
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={semesterForm.startDate}
                    onChange={(e) =>
                      setSemesterForm({ ...semesterForm, startDate: e.target.value })
                    }
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">End Date</label>
                  <input
                    type="date"
                    required
                    value={semesterForm.endDate}
                    onChange={(e) => setSemesterForm({ ...semesterForm, endDate: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={semesterForm.isCurrent}
                  onChange={(e) =>
                    setSemesterForm({ ...semesterForm, isCurrent: e.target.checked })
                  }
                  className="rounded border-[#E7E5E4] text-[#1C1917] focus:ring-[#1C1917]"
                />
                <label htmlFor="isCurrent" className="text-xs text-[#1C1917]">
                  Set as Current Active Semester
                </label>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full mt-2 py-3 bg-[#1C1917] hover:bg-[#332F2C] text-white rounded-full text-xs font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#FACC15]" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#FACC15]" />
                    <span>Create Semester</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white border border-[#E7E5E4] rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="font-semibold text-sm text-[#1C1917]">Confirm Deletion</h3>
            <p className="text-xs text-[#78716C]">
              Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-full border border-[#E7E5E4] text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.type, deleteConfirm.id)}
                disabled={isPending}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
