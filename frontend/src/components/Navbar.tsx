'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-blue-600">
            🎯 JobSeeker AI
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-6">
                <Link href="/dashboard" className="hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link href="/profile" className="hover:text-blue-600 transition">
                  Profile
                </Link>
                <Link href="/resume" className="hover:text-blue-600 transition">
                  Resume
                </Link>
                <Link href="/quiz" className="hover:text-blue-600 transition">
                  Learn
                </Link>
                <Link href="/interview-prep" className="hover:text-blue-600 transition">
                  Interview
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
