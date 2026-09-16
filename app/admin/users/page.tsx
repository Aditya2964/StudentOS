import { getAllUsers } from "@/lib/actions/users";
import UsersClient from "./users-client";

export default async function AdminUsersPage() {
  const users = await getAllUsers();
  return <UsersClient initialUsers={users} />;
}
