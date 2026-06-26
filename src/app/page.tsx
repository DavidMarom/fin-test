import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Random User Explorer</span>
        <h1 className={styles.title}>Explore Profiles, Save Your Favourites</h1>
        <p className={styles.subtitle}>
          Fetch random profiles from around the world, filter by name or country,
          and build your personal collection.
        </p>
        <div className={styles.actions}>
          <Link href="/fetch" className={styles.btn}>Fetch People</Link>
          <Link href="/history" className={styles.btnOutline}>View Saved</Link>
        </div>
      </div>

      <div className={styles.cardStrip}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🌍</div>
          Random profiles
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🔍</div>
          Filter &amp; search
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>💾</div>
          Save &amp; manage
        </div>
      </div>
    </main>
  );
}
