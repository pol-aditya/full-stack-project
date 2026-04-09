'use client';

import { useEffect, useState } from 'react';

const THEME_KEY = 'jobseeker-theme';

function SunIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 transition ${active ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </svg>
  );
}

function MoonIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 transition ${active ? 'text-white' : 'text-slate-300'}`} fill="currentColor">
      <path d="M20.7 14.4A8.7 8.7 0 0 1 9.6 3.3a9 9 0 1 0 11.1 11.1Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextIsDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    document.documentElement.classList.toggle('dark', nextIsDark);
    setIsDark(nextIsDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    document.documentElement.classList.toggle('dark', nextIsDark);
    window.localStorage.setItem(THEME_KEY, nextIsDark ? 'dark' : 'light');
    setIsDark(nextIsDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex h-16 w-[122px] items-center rounded-full p-2 transition duration-300 ${
        mounted && isDark
          ? 'bg-[#111318] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
          : 'bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]'
      }`}
    >
      <span
        className={`absolute left-2 top-2 h-12 w-12 rounded-full bg-[#1458eb] shadow-lg transition-transform duration-300 ${
          mounted && isDark ? 'translate-x-[58px]' : 'translate-x-0'
        }`}
      />
      <span className="relative z-10 grid w-full grid-cols-2 place-items-center">
        <span className="flex h-12 w-12 items-center justify-center">
          <SunIcon active={!isDark} />
        </span>
        <span className="flex h-12 w-12 items-center justify-center">
          <MoonIcon active={isDark} />
        </span>
      </span>
    </button>
  );
}
