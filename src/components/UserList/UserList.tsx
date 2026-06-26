"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";
import { UserRow } from "@/components/UserRow/UserRow";
import { FilterInput } from "@/components/FilterInput/FilterInput";
import styles from "./UserList.module.css";

interface UserListProps {
  users: User[];
  source: "fetch" | "history";
  emptyMessage?: string;
}

function filterUsers(users: User[], query: string): User[] {
  if (!query.trim()) return users;
  const q = query.toLowerCase();
  return users.filter(
    (u) =>
      `${u.first} ${u.last}`.toLowerCase().includes(q) ||
      u.country.toLowerCase().includes(q)
  );
}

export function UserList({ users, source, emptyMessage = "No users found." }: UserListProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = filterUsers(users, query);

  function handleClick(user: User) {
    router.push(`/profile/${user.id}?source=${source}`);
  }

  return (
    <div className={styles.container}>
      <FilterInput onFilter={setQuery} />
      {filtered.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <ul className={styles.list}>
          {filtered.map((u) => (
            <UserRow key={u.id} user={u} onClick={handleClick} />
          ))}
        </ul>
      )}
    </div>
  );
}
