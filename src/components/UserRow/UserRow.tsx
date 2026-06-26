"use client";

import Image from "next/image";
import type { User } from "@/types/user";
import styles from "./UserRow.module.css";

interface UserRowProps {
  user: User;
  onClick: (user: User) => void;
}

export function UserRow({ user, onClick }: UserRowProps) {
  const fullName = [user.title, user.first, user.last].filter(Boolean).join(" ");

  return (
    <li className={styles.row} onClick={() => onClick(user)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(user); }}
    >
      <Image
        src={user.thumbnail}
        alt={fullName}
        width={48}
        height={48}
        className={styles.avatar}
        unoptimized
      />
      <div className={styles.info}>
        <span className={styles.name}>{fullName}</span>
        <span className={styles.meta}>
          {user.gender} · {user.country}
        </span>
      </div>
      <div className={styles.contact}>
        <span className={styles.phone}>{user.phone}</span>
        <span className={styles.email}>{user.email}</span>
      </div>
    </li>
  );
}
