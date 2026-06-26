"use client";

import { useRef, useState } from "react";
import styles from "./FilterInput.module.css";

interface FilterInputProps {
  onFilter: (query: string) => void;
  placeholder?: string;
}

export function FilterInput({ onFilter, placeholder = "Filter by name or country…" }: FilterInputProps) {
  const [value, setValue] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setValue(q);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onFilter(q), 300);
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Filter users"
      />
    </div>
  );
}
