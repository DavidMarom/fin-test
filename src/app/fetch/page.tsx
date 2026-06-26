"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { fetchRandomUsers } from "@/lib/randomuser";
import { UserList, Skeleton } from "@/components";
import styles from "./fetch.module.css";

export default function FetchPage() {
  const { fetchedUsers, setFetchedUsers } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchedUsers.length > 0) return;
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const users = await fetchRandomUsers(10);
      setFetchedUsers(users);
    } catch {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← Back</Link>
        <h1 className={styles.title}>Random Profiles</h1>
        <button className={styles.refetch} onClick={load} disabled={loading}>
          {loading ? "Loading…" : "Refetch"}
        </button>
      </header>

      {loading && <Skeleton rows={10} />}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <UserList
          users={fetchedUsers}
          source="fetch"
          emptyMessage="No users match your filter."
        />
      )}
    </div>
  );
}
