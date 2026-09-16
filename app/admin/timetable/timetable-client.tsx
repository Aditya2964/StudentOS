"use client";

import { useState, useTransition } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  GraduationCap,
  FileSpreadsheet,
} from "lucide-react";
import { BentoCard } from "@/components/ui/bento-card";
import {
  addTimetableSlotAction,
  deleteTimetableSlotAction,
  addExamAction,
  deleteExamAction,
} from "@/lib/actions/timetable";

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

interface ClassItem {
  id: string;
  name: string;
  department: string;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
}

interface TeacherItem {
  id: string;
  teacherId: string;
  name: string;
  department: string | null;
}

interface TimetableSlot {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  className: string | null;
  subjectName: string | null;
  subjectCode: string | null;
  teacherName: string;
}

interface ExamItem {
  id: string;
  examType: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  instructions: string | null;
  subjectName: string | null;
  subjectCode: string | null;
}

interface TimetableClientProps {
  initialClasses: ClassItem[];
  initialSubjects: SubjectItem[];
  initialTeachers: TeacherItem[];
  initialSlots: TimetableSlot[];
  initialExams: ExamItem[];
}

export default function TimetableClient({
  initialClasses,
  initialSubjects,
  initialTeachers,
  initialSlots,
  initialExams,
}: TimetableClientProps) {
  const [activeTab, setActiveTab] = useState<"TIMETABLE" | "EXAMS">("TIMETABLE");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("ALL");

  const [slotsList, setSlotsList] = useState<TimetableSlot[]>(initialSlots);
  const [examsList, setExamsList] = useState<ExamItem[]>(initialExams);

  const [showModal, setShowModal] = useState<"SLOT" | "EXAM" | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "slot" | "exam"; id: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Slot form
  const [slotForm, setSlotForm] = useState({
    classId: initialClasses[0]?.id || "",
    subjectId: initialSubjects[0]?.id || "",
    teacherId: "",
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
    room: "Room 301",
  });

  // Exam form
  const [examForm, setExamForm] = useState({
    examType: "Midterm Examination",
    subjectId: initialSubjects[0]?.id || "",
    date: "",
    startTime: "10:00",
    endTime: "13:00",
    room: "Exam Hall A",
    instructions: "Bring student ID card and approved scientific calculator.",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    startTransition(async () => {
      const res = await addTimetableSlotAction({
        classId: slotForm.classId,
        subjectId: slotForm.subjectId,
        teacherId: slotForm.teacherId || undefined,
        dayOfWeek: Number(slotForm.dayOfWeek),
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
        room: slotForm.room,
      });
      setFormLoading(false);

      if (res.success && res.slot) {
        const cls = initialClasses.find((c) => c.id === res.slot.classId);
        const subj = initialSubjects.find((s) => s.id === res.slot.subjectId);
        const tch = initialTeachers.find((t) => t.id === res.slot.teacherId);

        const newSlot: TimetableSlot = {
          ...res.slot,
          className: cls ? cls.name : null,
          subjectName: subj ? subj.name : null,
          subjectCode: subj ? subj.code : null,
          teacherName: tch ? tch.name : "Faculty",
        };

        setSlotsList((prev) => [...prev, newSlot]);
        setShowModal(null);
        showToast("success", "Timetable slot added successfully.");
      } else {
        setFormError(res.error || "Failed to add timetable slot.");
      }
    });
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    startTransition(async () => {
      const res = await addExamAction({
        examType: examForm.examType,
        subjectId: examForm.subjectId,
        date: examForm.date,
        startTime: examForm.startTime,
        endTime: examForm.endTime,
        room: examForm.room,
        instructions: examForm.instructions,
      });
      setFormLoading(false);

      if (res.success && res.exam) {
        const subj = initialSubjects.find((s) => s.id === res.exam.subjectId);
        const newExam: ExamItem = {
          ...res.exam,
          subjectName: subj ? subj.name : null,
          subjectCode: subj ? subj.code : null,
        };

        setExamsList((prev) => [newExam, ...prev]);
        setShowModal(null);
        showToast("success", "Exam scheduled successfully.");
      } else {
        setFormError(res.error || "Failed to schedule exam.");
      }
    });
  };

  const handleDelete = (type: "slot" | "exam", id: string) => {
    startTransition(async () => {
      if (type === "slot") {
        const res = await deleteTimetableSlotAction(id);
        if (res.success) {
          setSlotsList((prev) => prev.filter((s) => s.id !== id));
          showToast("success", "Timetable slot removed.");
        } else showToast("error", res.error || "Failed to delete slot.");
      } else if (type === "exam") {
        const res = await deleteExamAction(id);
        if (res.success) {
          setExamsList((prev) => prev.filter((e) => e.id !== id));
          showToast("success", "Exam schedule removed.");
        } else showToast("error", res.error || "Failed to delete exam.");
      }
      setDeleteConfirm(null);
    });
  };

  const filteredSlots = slotsList.filter((s) => {
    const matchDay = s.dayOfWeek === selectedDay;
    const matchClass = selectedClassFilter === "ALL" || s.classId === selectedClassFilter;
    return matchDay && matchClass;
  });

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
          <h1 className="text-2xl font-medium text-[#1C1917]">Timetable & Exam Manager</h1>
          <p className="text-xs text-[#78716C] mt-1">
            Configure weekly class schedules, lecture rooms, and exam timetables
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "TIMETABLE" && (
            <button
              onClick={() => {
                setFormError(null);
                setShowModal("SLOT");
              }}
              className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#332F2C] text-white px-4 py-2.5 rounded-full text-xs font-medium transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4 text-[#FACC15]" />
              <span>Add Timetable Slot</span>
            </button>
          )}

          {activeTab === "EXAMS" && (
            <button
              onClick={() => {
                setFormError(null);
                setShowModal("EXAM");
              }}
              className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#332F2C] text-white px-4 py-2.5 rounded-full text-xs font-medium transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4 text-[#FACC15]" />
              <span>Schedule Exam</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#F2EFE9] p-1.5 rounded-full border border-[#E7E5E4] w-fit">
          <button
            onClick={() => setActiveTab("TIMETABLE")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === "TIMETABLE"
                ? "bg-[#1C1917] text-white shadow-xs"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>Weekly Timetable ({slotsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("EXAMS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === "EXAMS"
                ? "bg-[#1C1917] text-white shadow-xs"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>Examination Dates ({examsList.length})</span>
          </button>
        </div>

        {activeTab === "TIMETABLE" && initialClasses.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#78716C] font-medium">Filter Class:</span>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-full text-xs text-[#1C1917] outline-none"
            >
              <option value="ALL">All Classes</option>
              {initialClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: WEEKLY TIMETABLE */}
      {activeTab === "TIMETABLE" && (
        <div className="flex flex-col gap-6">
          {/* Day of Week Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAYS.map((day) => {
              const dayCount = slotsList.filter((s) => s.dayOfWeek === day.id).length;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedDay === day.id
                      ? "bg-[#1C1917] text-white shadow-xs"
                      : "bg-[#F9F8F4] text-[#78716C] border border-[#E7E5E4] hover:text-[#1C1917]"
                  }`}
                >
                  <span>{day.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedDay === day.id
                        ? "bg-stone-700 text-white"
                        : "bg-[#E7E5E4] text-[#1C1917]"
                    }`}
                  >
                    {dayCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slots List for Selected Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlots.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-[#F9F8F4] rounded-[2rem] border border-[#E7E5E4] text-[#78716C] text-xs">
                No classes scheduled for {DAYS.find((d) => d.id === selectedDay)?.name}. Click
                &quot;Add Timetable Slot&quot; to assign a lecture or lab.
              </div>
            ) : (
              filteredSlots.map((slot) => (
                <BentoCard
                  key={slot.id}
                  title={slot.subjectName || "Subject"}
                  subtitle={`${slot.startTime} — ${slot.endTime}`}
                  badge={
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                      {slot.subjectCode || "COURSE"}
                    </span>
                  }
                >
                  <div className="flex flex-col gap-2 pt-2 text-xs">
                    <div className="flex items-center justify-between text-[#78716C]">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {slot.teacherName}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-[#1C1917]">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {slot.room}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E7E5E4] mt-2">
                      <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                        {slot.className || "General"}
                      </span>
                      <button
                        onClick={() => setDeleteConfirm({ type: "slot", id: slot.id })}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </BentoCard>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EXAM SCHEDULES */}
      {activeTab === "EXAMS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examsList.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#F9F8F4] rounded-[2rem] border border-[#E7E5E4] text-[#78716C] text-xs">
              No examination dates scheduled yet. Click &quot;Schedule Exam&quot; above.
            </div>
          ) : (
            examsList.map((exam) => (
              <BentoCard
                key={exam.id}
                title={exam.subjectName || "Subject"}
                subtitle={`${exam.examType} • ${exam.date}`}
                badge={
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 uppercase">
                    {exam.subjectCode || "EXAM"}
                  </span>
                }
              >
                <div className="flex flex-col gap-2 pt-2 text-xs">
                  <div className="flex items-center justify-between text-[#78716C]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.startTime} — {exam.endTime}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-[#1C1917]">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" />
                      {exam.room}
                    </span>
                  </div>

                  {exam.instructions && (
                    <p className="text-[11px] text-[#78716C] bg-[#F2EFE9] p-2.5 rounded-xl mt-1">
                      {exam.instructions}
                    </p>
                  )}

                  <div className="flex items-center justify-end pt-3 border-t border-[#E7E5E4] mt-2">
                    <button
                      onClick={() => setDeleteConfirm({ type: "exam", id: exam.id })}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </BentoCard>
            ))
          )}
        </div>
      )}

      {/* MODAL: ADD TIMETABLE SLOT */}
      {showModal === "SLOT" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1C1917]" />
                <h3 className="font-semibold text-base text-[#1C1917]">Add Timetable Slot</h3>
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

            <form onSubmit={handleAddSlot} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">Class Section</label>
                <select
                  required
                  value={slotForm.classId}
                  onChange={(e) => setSlotForm({ ...slotForm, classId: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                >
                  <option value="">-- Select Class --</option>
                  {initialClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">Course / Subject</label>
                <select
                  required
                  value={slotForm.subjectId}
                  onChange={(e) => setSlotForm({ ...slotForm, subjectId: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                >
                  <option value="">-- Select Subject --</option>
                  {initialSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">Teacher / Faculty</label>
                <select
                  value={slotForm.teacherId}
                  onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                >
                  <option value="">-- Optional / Unassigned --</option>
                  {initialTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department || "Faculty"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">Day of Week</label>
                  <select
                    value={slotForm.dayOfWeek}
                    onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: Number(e.target.value) })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">Room / Lab</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 302"
                    value={slotForm.room}
                    onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="09:00"
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00"
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>
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
                    <span>Save Timetable Slot</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE EXAM */}
      {showModal === "EXAM" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1C1917]" />
                <h3 className="font-semibold text-base text-[#1C1917]">Schedule Examination</h3>
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

            <form onSubmit={handleAddExam} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">Exam Type</label>
                <select
                  value={examForm.examType}
                  onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                >
                  <option value="Midterm Examination">Midterm Examination</option>
                  <option value="Final Semester Examination">Final Semester Examination</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Lab Practical Exam">Lab Practical Exam</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">Subject</label>
                <select
                  required
                  value={examForm.subjectId}
                  onChange={(e) => setExamForm({ ...examForm, subjectId: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                >
                  <option value="">-- Select Subject --</option>
                  {initialSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={examForm.date}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">Room / Hall</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exam Hall A"
                    value={examForm.room}
                    onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00"
                    value={examForm.startTime}
                    onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#78716C] uppercase">End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="13:00"
                    value={examForm.endTime}
                    onChange={(e) => setExamForm({ ...examForm, endTime: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring scientific calculator, no electronic watches."
                  value={examForm.instructions}
                  onChange={(e) => setExamForm({ ...examForm, instructions: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs focus:ring-1 focus:ring-[#1C1917] outline-none resize-none"
                />
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
                    <span>Publish Exam Schedule</span>
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
              Are you sure you want to remove this {deleteConfirm.type === "slot" ? "timetable slot" : "exam schedule"}?
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
