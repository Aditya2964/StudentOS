"use client";

import { Search, Filter } from "lucide-react";

interface NotesSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedSubject: string;
  onSubjectChange: (subj: string) => void;
  subjects: { code: string; name: string }[];
}

export function NotesSearch({
  searchTerm,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  subjects,
}: NotesSearchProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full bg-[#F9F8F4] border border-[#E7E5E4] p-3 rounded-[2rem] shadow-xs">
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by topic, unit, title, or teacher..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-[#E7E5E4] rounded-full text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917] transition-all"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Filter className="w-4 h-4 text-[#78716C] shrink-0" />
        <select
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="py-2 px-3 bg-white border border-[#E7E5E4] rounded-full text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917] transition-all w-full md:w-auto"
        >
          <option value="ALL">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name} ({s.code})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
