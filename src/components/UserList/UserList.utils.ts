import type { User } from "@/types/user";

export function filterUsers(users: User[], query: string): User[] {
  if (!query.trim()) return users;
  const q = query.toLowerCase();
  return users.filter(
    (u) =>
      `${u.first} ${u.last}`.toLowerCase().includes(q) ||
      u.country.toLowerCase().includes(q)
  );
}
