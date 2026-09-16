"use client";

import { useState, useTransition } from "react";
import { BentoCard } from "@/components/ui/bento-card";
import {
  Megaphone,
  Send,
  Trash2,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createAnnouncementAction,
  deleteAnnouncementAction,
} from "@/lib/actions/announcements";

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  category: "General" | "Assignment" | "Exam" | "Emergency";
  date: string;
}

export default function TeacherAnnouncementsClient({
  initialAnnouncements,
}: {
  initialAnnouncements: AnnouncementItem[];
}) {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"General" | "Assignment" | "Exam" | "Emergency">("General");
  const [audience, setAudience] = useState("ALL");

  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    startTransition(async () => {
      const res = await createAnnouncementAction({
        title,
        content,
        category,
        audience,
      });
      setLoading(false);

      if (res.success && res.announcement) {
        const newAnn: AnnouncementItem = {
          id: res.announcement.id,
          title: res.announcement.title,
          content: res.announcement.content,
          author: "You",
          authorRole: "TEACHER",
          category: res.announcement.category as "General" | "Assignment" | "Exam" | "Emergency",
          date: new Date().toISOString().split("T")[0],
        };

        setAnnouncements((prev) => [newAnn, ...prev]);
        setTitle("");
        setContent("");
        showToast("success", `Announcement "${res.announcement.title}" broadcasted to students!`);
      } else {
        setFormError(res.error || "Failed to broadcast announcement.");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteAnnouncementAction(id);
      if (res.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        showToast("success", "Announcement removed.");
      } else {
        showToast("error", res.error || "Failed to remove announcement.");
      }
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Publish Announcements</h1>
          <p className="text-xs text-[#78716C] mt-1">
            Broadcast notices and class updates directly to student dashboards and notifications
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium">
          <Megaphone className="w-4 h-4 text-[#FACC15]" />
          <span>Active Notices ({announcements.length})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publish Form */}
        <BentoCard
          title="New Announcement"
          subtitle="Broadcast Notice"
          colSpan="col-span-1"
        >
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 mb-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="flex flex-col gap-3 pt-2">
            <div>
              <label className="text-[11px] font-medium text-[#78716C] uppercase">
                Notice Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DBMS Lab Class Rescheduled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#1C1917]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as "General" | "Assignment" | "Exam" | "Emergency")
                  }
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#1C1917]"
                >
                  <option value="General">General Notice</option>
                  <option value="Assignment">Assignment Notice</option>
                  <option value="Exam">Exam Notice</option>
                  <option value="Emergency">Emergency Alert</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#78716C] uppercase">
                  Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#1C1917]"
                >
                  <option value="ALL">All Students</option>
                  <option value="STUDENTS">Students Only</option>
                  <option value="TEACHERS">Faculty Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#78716C] uppercase">
                Message Content
              </label>
              <textarea
                required
                rows={4}
                placeholder="Type your announcement details here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs resize-none outline-none focus:ring-1 focus:ring-[#1C1917]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#1C1917] hover:bg-[#332F2C] text-white text-xs font-medium rounded-full flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-98 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#FACC15]" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>Broadcast to Students</span>
                </>
              )}
            </button>
          </form>
        </BentoCard>

        {/* Live Published Feed */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1C1917]">Published Notices</h3>
            <span className="text-xs text-[#78716C]">{announcements.length} Active</span>
          </div>

          {announcements.length === 0 ? (
            <div className="p-12 text-center bg-[#F9F8F4] rounded-[2.5rem] border border-[#E7E5E4] text-[#78716C] text-xs">
              No announcements published yet. Fill out the form to broadcast your first notice.
            </div>
          ) : (
            announcements.map((item) => (
              <BentoCard
                key={item.id}
                title={item.title}
                subtitle={`Broadcast by ${item.author}`}
                badge={
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      item.category === "Emergency" && "bg-rose-100 text-rose-900",
                      item.category === "Exam" && "bg-amber-100 text-amber-900",
                      item.category === "General" && "bg-blue-100 text-blue-900",
                      item.category === "Assignment" && "bg-purple-100 text-purple-900"
                    )}
                  >
                    {item.category}
                  </span>
                }
              >
                <div className="flex flex-col gap-3 pt-2">
                  <p className="text-xs text-[#78716C] leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-3 border-t border-[#E7E5E4] mt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Announcement"
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
    </div>
  );
}
