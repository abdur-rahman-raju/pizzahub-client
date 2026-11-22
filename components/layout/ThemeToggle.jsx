"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(null); // null = এখনো জানা নেই

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // স্টোরেজ বন্ধ থাকলেও থিম এই সেশনে বদলাবে
    }
    setDark(next);
  }

  if (dark === null) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border bg-card text-foreground shadow-lg transition-colors hover:bg-accent"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}