import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Random Users</h1>
      <p className={styles.subtitle}>Explore random profiles or view your saved collection.</p>
      <div className={styles.actions}>
        <Link href="/fetch" className={styles.btn}>
          Fetch
        </Link>
        <Link href="/history" className={styles.btnOutline}>
          History
        </Link>
      </div>
    </main>
  );
}
