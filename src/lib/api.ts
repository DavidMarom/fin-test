import type { User } from "@/types/user";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000") + "/api";

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch saved users");
  return res.json();
}

export async function saveUser(user: User): Promise<User> {
  const res = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to save user");
  return res.json();
}

export async function updateUser(
  id: string,
  patch: { title?: string; first?: string; last?: string }
): Promise<User> {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE}/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
}
