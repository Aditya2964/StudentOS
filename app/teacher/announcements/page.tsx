import { getAnnouncementsAction } from "@/lib/actions/announcements";
import TeacherAnnouncementsClient from "./teacher-announcements-client";

export default async function TeacherAnnouncementsPage() {
  const announcements = await getAnnouncementsAction();

  return <TeacherAnnouncementsClient initialAnnouncements={announcements} />;
}
