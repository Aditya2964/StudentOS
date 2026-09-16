"use client";

import { useState } from "react";
import { NotesSearch } from "@/components/notes/notes-search";
import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { BookOpen, Download, FileText, Sparkles } from "lucide-react";

interface NoteItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  unit: string;
  fileType: string;
  fileSize: string;
  teacherName: string;
  downloadUrl: string;
}

export default function StudentNotesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  const subjects = [
    { code: "CS501", name: "Database Management Systems" },
    { code: "CS502", name: "Operating Systems" },
    { code: "CS503", name: "Computer Networks" },
  ];

  const notesList: NoteItem[] = [
    {
      id: "n-1",
      title: "ER Modeling & Relational Schema Mapping",
      subjectCode: "CS501",
      subjectName: "Database Management Systems",
      unit: "Unit 1: ER & Relational Model",
      fileType: "PDF",
      fileSize: "2.4 MB",
      teacherName: "Prof. Sarah Smith",
      downloadUrl: "#",
    },
    {
      id: "n-2",
      title: "SQL Normalization Rules & 3NF/BCNF Examples",
      subjectCode: "CS501",
      subjectName: "Database Management Systems",
      unit: "Unit 3: Normalization",
      fileType: "PDF",
      fileSize: "3.1 MB",
      teacherName: "Prof. Sarah Smith",
      downloadUrl: "#",
    },
    {
      id: "n-3",
      title: "Process Synchronization & Semaphore Locks",
      subjectCode: "CS502",
      subjectName: "Operating Systems",
      unit: "Unit 2: Process Sync",
      fileType: "PDF",
      fileSize: "1.8 MB",
      teacherName: "Dr. Robert Miller",
      downloadUrl: "#",
    },
    {
      id: "n-4",
      title: "TCP/IP Protocol Stack & Subnetting Guide",
      subjectCode: "CS503",
      subjectName: "Computer Networks",
      unit: "Unit 2: Network Layer",
      fileType: "PDF",
      fileSize: "4.2 MB",
      teacherName: "Prof. Alan Davis",
      downloadUrl: "#",
    },
  ];

  const filteredNotes = notesList.filter((n) => {
    const matchesSubject = selectedSubject === "ALL" || n.subjectCode === selectedSubject;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] shadow-xs">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1917]">Notes & Study Materials</h1>
          <p className="text-xs text-[#78716C] mt-1">Official course PDFs, lecture slides, and previous papers</p>
        </div>

        <button className="flex items-center gap-2 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-[#332F2C] transition-all">
          <Sparkles className="w-4 h-4 text-[#FACC15]" />
          <span>Generate AI Summary</span>
        </button>
      </div>

      {/* Instant Search Bar */}
      <NotesSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        subjects={subjects}
      />

      {/* Notes Grid */}
      <BentoGrid>
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#78716C]">
            No study notes found matching your search.
          </div>
        ) : (
          filteredNotes.map((item) => (
            <BentoCard
              key={item.id}
              title={item.title}
              subtitle={item.unit}
              badge={
                <span className="bg-[#E7E5E4] text-[#1C1917] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {item.subjectCode}
                </span>
              }
            >
              <div className="flex flex-col justify-between h-full pt-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-[#F9F8F4] border border-[#E7E5E4] rounded-2xl">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1C1917]">{item.fileType} Document</p>
                    <p className="text-[10px] text-[#78716C]">
                      Size: {item.fileSize} • Uploaded by {item.teacherName}
                    </p>
                  </div>
                </div>

                <a
                  href={item.downloadUrl}
                  className="w-full py-2.5 bg-[#1C1917] hover:bg-[#332F2C] text-white text-xs font-medium rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </BentoCard>
          ))
        )}
      </BentoGrid>
    </div>
  );
}
