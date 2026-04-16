'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-md backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-blue-700 transition hover:text-blue-800 dark:text-sky-300 dark:hover:text-cyan-300">
            🎯 JobSeeker AI
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-6">
                <Link href="/dashboard" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                  Dashboard
                </Link>
                {user?.role === 'recruiter' ? (
                  <Link href="/recruiter" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                    Recruiter Portal
                  </Link>
                ) : (
                  <Link href="/jobs" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                    Jobs
                  </Link>
                )}
                <Link href="/profile" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                  Profile
                </Link>
                <Link href="/resume" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                  Resume
                </Link>
                <Link href="/jobs" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                  Jobs
                </Link>
                <Link href="/recruiter/login" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                  Recruiter
                </Link>
                <Link href="/quiz" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                  Learn
                </Link>
                <Link href="/interview-prep" className="transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-sky-300">
                  Interview
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                <span className="text-sm text-gray-600 dark:text-slate-300">{user?.name || user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="flex items-center rounded-2xl border border-blue-100 bg-white/80 p-1.5 shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-[0_18px_40px_rgba(8,145,178,0.14)]">
                <Link
                  href="/login"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(6,182,212,0.32)]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
