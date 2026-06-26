import styles from "./Skeleton.module.css";

interface SkeletonProps {
  rows?: number;
}

export function Skeleton({ rows = 10 }: SkeletonProps) {
  return (
    <ul className={styles.list} aria-busy="true" aria-label="Loading…">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className={styles.row}>
          <span className={styles.avatar} />
          <span className={styles.lines}>
            <span className={styles.lineShort} />
            <span className={styles.lineLong} />
          </span>
        </li>
      ))}
    </ul>
  );
}
