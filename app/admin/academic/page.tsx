import { getAcademicData } from "@/lib/actions/academic";
import AcademicClient from "./academic-client";

export default async function AdminAcademicPage() {
  const data = await getAcademicData();

  return (
    <AcademicClient
      initialSemesters={data.semesters}
      initialClasses={data.classes}
      initialSubjects={data.subjects}
    />
  );
}
