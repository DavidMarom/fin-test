"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { getUsers } from "@/lib/api";
import { UserList, Skeleton } from "@/components";
import styles from "./history.module.css";

export default function HistoryPage() {
  const { savedUsers, setSavedUsers } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const users = await getUsers();
      setSavedUsers(users);
    } catch {
      setError("Failed to load saved profiles. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← Back</Link>
        <h1 className={styles.title}>Saved Profiles</h1>
        <button className={styles.refresh} onClick={load} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      {loading && <Skeleton rows={10} />}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <UserList
          users={savedUsers}
          source="history"
          emptyMessage="No saved profiles yet. Fetch some users and save them."
        />
      )}
    </div>
  );
}
