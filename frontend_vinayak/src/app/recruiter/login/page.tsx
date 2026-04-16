'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecruiterAuth } from '@/contexts/RecruiterAuthContext';

export default function RecruiterLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login, register } = useRecruiterAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      router.push('/recruiter/portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Recruiter Portal</h1>
        <p className="text-white/80 mb-6">{isLogin ? 'Login as recruiter' : 'Create recruiter account'}</p>

        {error && <div className="mb-4 rounded bg-red-500/20 border border-red-400/40 px-4 py-3 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Recruiter Name"
              className="w-full rounded-lg border border-white/25 bg-black/20 px-4 py-3 outline-none focus:border-cyan-300"
              required
            />
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="email@company.com"
            className="w-full rounded-lg border border-white/25 bg-black/20 px-4 py-3 outline-none focus:border-cyan-300"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Password"
            className="w-full rounded-lg border border-white/25 bg-black/20 px-4 py-3 outline-none focus:border-cyan-300"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-400 text-slate-900 font-semibold py-3 hover:bg-cyan-300 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isLogin ? 'Recruiter Login' : 'Create Recruiter Account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsLogin((prev) => !prev);
            setError('');
          }}
          className="w-full mt-4 text-sm text-cyan-200 hover:text-cyan-100"
        >
          {isLogin ? 'Need recruiter account? Sign up' : 'Already recruiter? Login'}
        </button>
      </div>
    </div>
  );
}
