"use client";

import { useState } from "react";
import { BentoCard } from "@/components/ui/bento-card";
import { SubmissionModal } from "@/components/assignments/submission-modal";
import { FileText, Clock, CheckCircle2, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  subjectName: string;
  subjectCode: string;
  deadline: string;
  maxMarks: number;
  status: "NOT_STARTED" | "DUE_SOON" | "SUBMITTED" | "OVERDUE";
  submittedAt?: string;
  grade?: number;
}

export default function StudentAssignmentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [activeAssignment, setActiveAssignment] = useState<AssignmentItem | null>(null);

  const [assignments, setAssignments] = useState<AssignmentItem[]>([
    {
      id: "asgn-1",
      title: "DBMS Relational Algebra & ER Diagrams",
      description: "Complete Problem Set 3 covering ER to relational schema mapping, dependency preservation, and BCNF normalization rules.",
      subjectName: "Database Management Systems",
      subjectCode: "CS501",
      deadline: "2026-08-15T23:59:00Z",
      maxMarks: 100,
      status: "DUE_SOON",
    },
    {
      id: "asgn-2",
      title: "Operating Systems Process Synchronization",
      description: "Implement Producer-Consumer and Readers-Writers synchronization problem solutions using POSIX semaphores in C/C++.",
      subjectName: "Operating Systems",
      subjectCode: "CS502",
      deadline: "2026-08-18T23:59:00Z",
      maxMarks: 50,
      status: "NOT_STARTED",
    },
    {
      id: "asgn-3",
      title: "Computer Networks Packet Sniffing Lab",
      description: "Analyze Wireshark PCAP files and write down packet header breakdown for TCP 3-way handshake and HTTP headers.",
      subjectName: "Computer Networks",
      subjectCode: "CS503",
      deadline: "2026-08-10T23:59:00Z",
      maxMarks: 100,
      status: "SUBMITTED",
      submittedAt: "2026-08-09T16:20:00Z",
      grade: 92,
    },
  ]);

  const filteredAssignments = assignments.filter((a) => {
    if (selectedStatus === "ALL") return true;
    return a.status === selectedStatus;
  });

  const handleSubmissionSuccess = () => {
    if (!activeAssignment) return;
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === activeAssignment.id
          ? { ...a, status: "SUBMITTED", submittedAt: new Date().toISOString() }
          : a
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Assignments & Submissions</h1>
          <p className="text-xs text-[#78716C] mt-1">Track deadlines, submit coursework, and view teacher feedback</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#F2EFE9] p-1 rounded-full border border-[#E7E5E4] overflow-x-auto">
          {["ALL", "DUE_SOON", "NOT_STARTED", "SUBMITTED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                selectedStatus === st
                  ? "bg-[#1C1917] text-white shadow-xs"
                  : "text-[#78716C] hover:text-[#1C1917]"
              )}
            >
              {st === "ALL" ? "All Assignments" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((item) => (
          <BentoCard
            key={item.id}
            title={item.title}
            subtitle={`${item.subjectName} (${item.subjectCode})`}
            badge={
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                  item.status === "DUE_SOON" && "bg-amber-100 text-amber-900",
                  item.status === "NOT_STARTED" && "bg-[#E7E5E4] text-[#78716C]",
                  item.status === "SUBMITTED" && "bg-emerald-100 text-emerald-900",
                  item.status === "OVERDUE" && "bg-rose-100 text-rose-900"
                )}
              >
                {item.status.replace("_", " ")}
              </span>
            }
          >
            <div className="flex flex-col justify-between h-full pt-2 gap-4">
              <p className="text-xs text-[#78716C] leading-relaxed line-clamp-3">
                {item.description}
              </p>

              <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Due: {new Date(item.deadline).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-[#1C1917]">Max: {item.maxMarks} pts</span>
                </div>

                {item.status === "SUBMITTED" && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E5E4] text-emerald-700 font-medium text-[11px]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Submitted
                    </span>
                    {item.grade !== undefined && <span>Grade: {item.grade}/100</span>}
                  </div>
                )}
              </div>

              {item.status !== "SUBMITTED" ? (
                <button
                  onClick={() => setActiveAssignment(item)}
                  className="w-full py-2.5 bg-[#1C1917] hover:bg-[#332F2C] text-white text-xs font-medium rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Submit Work</span>
                </button>
              ) : (
                <div className="text-center text-xs text-emerald-700 font-medium py-1">
                  ✓ Submission Received
                </div>
              )}
            </div>
          </BentoCard>
        ))}
      </div>

      {/* Submission Modal */}
      {activeAssignment && (
        <SubmissionModal
          assignment={activeAssignment}
          onClose={() => setActiveAssignment(null)}
          onSuccess={handleSubmissionSuccess}
        />
      )}
    </div>
  );
}
