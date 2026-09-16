import { getTimetableData } from "@/lib/actions/timetable";
import TimetableClient from "./timetable-client";

export default async function AdminTimetablePage() {
  const data = await getTimetableData();

  return (
    <TimetableClient
      initialClasses={data.classes}
      initialSubjects={data.subjects}
      initialTeachers={data.teachers}
      initialSlots={data.timetableSlots}
      initialExams={data.exams}
    />
  );
}
