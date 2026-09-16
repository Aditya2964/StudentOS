"use client";

import { useState } from "react";
import { BentoCard } from "@/components/ui/bento-card";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";

export default function TeacherNotesUploadPage() {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [subjectCode, setSubjectCode] = useState("CS501");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      setTitle("");
      setUnit("");
      setFile(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Course Materials & Notes Upload</h1>
          <p className="text-xs text-[#78716C] mt-1">Upload PDF lecture notes, unit slides, and previous papers to Cloudflare R2</p>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium">
          <UploadCloud className="w-4 h-4 text-[#FACC15]" />
          <span>R2 Storage Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BentoCard title="Upload PDF Note" subtitle="Publish to Cloudflare R2" colSpan="col-span-1">
          <form onSubmit={handleUpload} className="flex flex-col gap-3 pt-2">
            <input
              type="text"
              required
              placeholder="Material Title (e.g. Unit 3 Normalization)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs"
            />
            <input
              type="text"
              required
              placeholder="Unit Name (e.g. Unit 3)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs"
            />
            <select
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E7E5E4] rounded-xl text-xs"
            >
              <option value="CS501">CS501 — Database Management Systems</option>
              <option value="CS502">CS502 — Operating Systems</option>
              <option value="CS503">CS503 — Computer Networks</option>
            </select>

            <div className="border-2 border-dashed border-[#E7E5E4] p-4 rounded-xl text-center bg-[#F9F8F4] cursor-pointer">
              <input
                type="file"
                required
                accept=".pdf,.docx,.pptx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="teacher-file"
              />
              <label htmlFor="teacher-file" className="text-xs text-[#1C1917] font-medium cursor-pointer">
                {file ? file.name : "Choose File to Upload"}
              </label>
            </div>

            {uploaded && (
              <p className="text-xs text-emerald-700 font-medium text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Published to Cloudflare R2!
              </p>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-2.5 bg-[#1C1917] text-white text-xs font-medium rounded-full hover:bg-[#332F2C] disabled:opacity-50"
            >
              {uploading ? "Publishing to R2..." : "Publish Study Material"}
            </button>
          </form>
        </BentoCard>
      </div>
    </div>
  );
}
