import { getAllUsers } from "@/lib/actions/users";
import { getAcademicData } from "@/lib/actions/academic";
import UsersClient from "./users-client";

export default async function AdminUsersPage() {
  const users = await getAllUsers();
  const academicData = await getAcademicData();

  return <UsersClient initialUsers={users} availableClasses={academicData.classes} />;
}
