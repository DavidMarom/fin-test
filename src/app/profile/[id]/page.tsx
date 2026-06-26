"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { saveUser, updateUser, deleteUser } from "@/lib/api";
import type { User } from "@/types/user";
import styles from "./profile.module.css";

function birthYear(dob: string): number {
  return new Date(dob).getFullYear();
}

interface ProfilePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string }>;
}

export default function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { id } = use(params);
  const { source } = use(searchParams);
  const router = useRouter();

  const { fetchedUsers, savedUsers, updateFetchedUser, updateSavedUser, addSavedUser, removeSavedUser } = useUserStore();

  const fromHistory = source === "history";

  const original: User | undefined = fromHistory
    ? savedUsers.find((u) => u.id === id)
    : fetchedUsers.find((u) => u.id === id);

  const [nameFirst, setNameFirst] = useState(original?.first ?? "");
  const [nameLast, setNameLast] = useState(original?.last ?? "");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (original) {
      setNameFirst(original.first);
      setNameLast(original.last);
    }
  }, [original?.id]);

  if (!original) {
    return (
      <div className={styles.notFound}>
        <p>פרופיל לא נמצא.</p>
        <button className={styles.backBtn} onClick={() => router.back()}>← חזרה</button>
      </div>
    );
  }

  const fullName = [original.title, nameFirst, nameLast].filter(Boolean).join(" ");

  async function handleSave() {
    if (!original) return;
    setBusy(true);
    setFeedback(null);
    try {
      const toSave: User = { ...original, first: nameFirst, last: nameLast };
      await saveUser(toSave);
      addSavedUser(toSave);
      updateFetchedUser(id, { first: nameFirst, last: nameLast });
      setFeedback("נשמר בהצלחה!");
    } catch {
      setFeedback("שגיאה בשמירה.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate() {
    if (!original) return;
    setBusy(true);
    setFeedback(null);
    try {
      if (fromHistory) {
        await updateUser(id, { first: nameFirst, last: nameLast });
        updateSavedUser(id, { first: nameFirst, last: nameLast });
      } else {
        updateFetchedUser(id, { first: nameFirst, last: nameLast });
      }
      setFeedback("עודכן בהצלחה!");
    } catch {
      setFeedback("שגיאה בעדכון.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    setFeedback(null);
    try {
      await deleteUser(id);
      removeSavedUser(id);
      router.back();
    } catch {
      setFeedback("שגיאה במחיקה.");
      setBusy(false);
    }
  }

  return (
    <div className={styles.page} dir="rtl">
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>← חזרה</button>
        <h1 className={styles.heading}>פרופיל</h1>
      </header>

      <div className={styles.body}>
        <div className={styles.profileCard}>
          <Image
            src={original.picture}
            alt={fullName}
            width={80}
            height={80}
            className={styles.avatar}
            unoptimized
            priority
          />
          <div className={styles.profileMeta}>
            <span className={styles.profileName}>{fullName}</span>
            <span className={styles.profileSub}>{original.gender} · {original.country}</span>
          </div>
        </div>

        <section className={styles.section}>
          <dl className={styles.grid}>
            <dt className={styles.label}>מגדר</dt>
            <dd className={`${styles.value} ltr-field`}>{original.gender}</dd>

            <dt className={styles.label}>שם</dt>
            <dd className={styles.nameFields}>
              <input
                dir="ltr"
                className={`${styles.input} ltr-field`}
                value={nameFirst}
                onChange={(e) => setNameFirst(e.target.value)}
                placeholder="First"
                aria-label="First name"
              />
              <input
                dir="ltr"
                className={`${styles.input} ltr-field`}
                value={nameLast}
                onChange={(e) => setNameLast(e.target.value)}
                placeholder="Last"
                aria-label="Last name"
              />
            </dd>

            <dt className={styles.label}>גיל</dt>
            <dd className={`${styles.value} ltr-field`}>
              {original.age} ({birthYear(original.dob)})
            </dd>

            <dt className={styles.label}>כתובת</dt>
            <dd className={`${styles.value} ltr-field`}>
              {original.street}, {original.city}, {original.state}
            </dd>

            <dt className={styles.label}>מדינה</dt>
            <dd className={`${styles.value} ltr-field`}>{original.country}</dd>

            <dt className={styles.label}>אימייל</dt>
            <dd className={`${styles.value} ltr-field`}>{original.email}</dd>

            <dt className={styles.label}>טלפון</dt>
            <dd className={`${styles.value} ltr-field`}>{original.phone}</dd>
          </dl>
        </section>

        {feedback && <p className={styles.feedback}>{feedback}</p>}

        <div className={styles.actions}>
          {!fromHistory && (
            <button className={styles.btnPrimary} onClick={handleSave} disabled={busy}>
              שמור
            </button>
          )}
          <button className={styles.btnSecondary} onClick={handleUpdate} disabled={busy}>
            עדכן
          </button>
          {fromHistory && (
            <button className={styles.btnDanger} onClick={handleDelete} disabled={busy}>
              מחק
            </button>
          )}
          <button className={styles.btnGhost} onClick={() => router.back()} disabled={busy}>
            חזרה
          </button>
        </div>
      </div>
    </div>
  );
}
