"use client";

import { useState } from "react";
import { X, Upload, FileText, CheckCircle2, Clock } from "lucide-react";
import { submitStudentAssignment } from "@/lib/actions/assignments";

interface SubmissionModalProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    subjectName: string;
    deadline: string;
    maxMarks: number;
    status: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmissionModal({ assignment, onClose, onSuccess }: SubmissionModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setSubmitting(true);
    try {
      // Simulate file upload to Cloudflare R2
      const fakeFileKey = `submissions/${assignment.id}/${file.name}`;
      await submitStudentAssignment(assignment.id, fakeFileKey);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#F9F8F4] border border-[#E7E5E4] w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
          <div>
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
              {assignment.subjectName}
            </span>
            <h2 className="text-lg font-medium text-[#1C1917]">{assignment.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#78716C]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-[#F2EFE9] rounded-2xl text-xs text-[#1C1917] space-y-2">
          <p className="font-normal leading-relaxed">{assignment.description}</p>
          <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-2 border-t border-[#E7E5E4]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Deadline: {new Date(assignment.deadline).toLocaleString()}
            </span>
            <span className="font-medium">Max Marks: {assignment.maxMarks}</span>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
            <h3 className="text-base font-medium text-[#1C1917]">Assignment Submitted!</h3>
            <p className="text-xs text-[#78716C]">Your work has been uploaded successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="border-2 border-dashed border-[#E7E5E4] hover:border-[#1C1917] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center transition-all bg-[#F9F8F4] cursor-pointer">
              <Upload className="w-8 h-8 text-[#78716C]" />
              <div className="text-xs text-[#1C1917] font-medium">
                {file ? file.name : "Click or drag PDF / document to upload"}
              </div>
              <p className="text-[10px] text-[#78716C]">PDF, ZIP, DOCX up to 25MB</p>
              <input
                type="file"
                required
                accept=".pdf,.docx,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mt-2 px-4 py-1.5 bg-[#1C1917] text-white text-xs rounded-full font-medium cursor-pointer hover:bg-[#332F2C]"
              >
                Select File
              </label>
            </div>

            {file && (
              <div className="flex items-center gap-2 text-xs text-[#1C1917] bg-[#F2EFE9] p-2.5 rounded-xl">
                <FileText className="w-4 h-4 text-[#78716C]" />
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-[10px] text-[#78716C]">{(file.size / 1024).toFixed(0)} KB</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || submitting}
              className="w-full py-3 bg-[#1C1917] text-white font-medium text-xs rounded-full hover:bg-[#332F2C] disabled:opacity-50 transition-all shadow-md"
            >
              {submitting ? "Uploading Submission..." : "Submit Assignment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
