import { getAnnouncementsAction } from "@/lib/actions/announcements";
import StudentAnnouncementsClient from "./student-announcements-client";

export default async function StudentAnnouncementsPage() {
  const announcements = await getAnnouncementsAction();

  return <StudentAnnouncementsClient initialAnnouncements={announcements} />;
}
