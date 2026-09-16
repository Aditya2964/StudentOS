"use client";

import { useState } from "react";
import { BentoCard } from "@/components/ui/bento-card";
import { Plus, FileSpreadsheet, Clock, Upload, CheckCircle2 } from "lucide-react";

export default function TeacherAssignmentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("CS501");
  const [deadline, setDeadline] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Assignment "${title}" created successfully!`);
    setShowCreateModal(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Manage Assignments</h1>
          <p className="text-xs text-[#78716C] mt-1">Create course assignments, set deadlines, and review student submissions</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#1C1917] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-[#332F2C] transition-all shadow-md"
        >
          <Plus className="w-4 h-4 text-[#FACC15]" />
          <span>Create New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BentoCard title="DBMS Relational Algebra Set 3" subtitle="CS501 • CS-A 3rd Year">
          <div className="flex flex-col justify-between h-full pt-2 gap-4">
            <p className="text-xs text-[#78716C] leading-relaxed">
              Problem Set 3 covering ER to relational schema mapping and normalization rules.
            </p>
            <div className="p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl flex justify-between text-xs text-[#78716C]">
              <span>Deadline: Aug 15, 2026</span>
              <span className="font-medium text-[#1C1917]">Submissions: 28/35</span>
            </div>
          </div>
        </BentoCard>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#F9F8F4] border border-[#E7E5E4] w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-4">
            <h2 className="text-lg font-medium text-[#1C1917]">Create Assignment</h2>
            <form onSubmit={handleCreateAssignment} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Assignment Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-xs"
              />
              <textarea
                required
                rows={3}
                placeholder="Instructions & Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-xs resize-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E7E5E4] rounded-xl text-xs"
                />
                <input
                  type="number"
                  required
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  placeholder="Max Marks"
                  className="w-full px-3 py-2 bg-white border border-[#E7E5E4] rounded-xl text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-[#78716C] hover:text-[#1C1917]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1C1917] text-white text-xs rounded-full font-medium"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
