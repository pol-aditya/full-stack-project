'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [accountType, setAccountType] = useState<'employee' | 'recruiter'>('employee');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password, accountType);
      } else {
        await register(formData.email, formData.password, formData.name, accountType);
      }
      router.push(accountType === 'recruiter' ? '/recruiter' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-colors dark:bg-slate-900 dark:shadow-[0_30px_80px_rgba(2,6,23,0.65)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            JobSeeker AI
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            {isLogin ? 'Welcome back' : 'Get started with us'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/40">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-300">
            Login As
          </p>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setAccountType('employee')}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                accountType === 'employee'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Employee
            </button>
            <button
              type="button"
              onClick={() => setAccountType('recruiter')}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                accountType === 'recruiter'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Recruiter
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="John Doe"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="........"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-1.5 dark:border-slate-700 dark:bg-slate-950">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setFormData({ email: '', password: '', name: '' });
                }}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isLogin
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-300'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setFormData({ email: '', password: '', name: '' });
                }}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  !isLogin
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-300'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-gray-600 dark:text-slate-300">
            {isLogin
              ? 'New here? Choose Sign Up to create an account.'
              : 'Already registered? Switch back to Login.'}
          </p>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-slate-400">
            Current role: {accountType === 'recruiter' ? 'Recruiter account' : 'Employee account'}
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-slate-700 dark:bg-slate-950/80">
          <p className="text-xs text-gray-600 dark:text-slate-300">
            <span className="font-semibold text-blue-600">Demo Credentials:</span>
            <br />
            Email: demo@example.com
            <br />
            Password: demo123
          </p>
        </div>
      </div>
    </div>
  );
}
