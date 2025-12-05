'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [tenantId, setTenantId] = useState('dc80542d-3084-42d4-9259-7279ea60a206');
  const [password, setPassword] = useState('password'); // Default demo password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', {
        tenantId,
        password
      });

      if (res.data.tenantId) {
        localStorage.setItem('tenantId', res.data.tenantId);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError('Invalid Tenant ID or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2 text-indigo-600 font-bold text-2xl tracking-tight">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
          <TrendingUp size={24} />
        </div>
        Xeno Insights
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500 mb-8">Sign in to access your dashboard.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="tenantId" className="block text-sm font-medium text-slate-700 mb-1">
              Tenant ID
            </label>
            <input
              id="tenantId"
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. dc80542d..."
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Access Dashboard
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Demo ID: dc80542d-3084-42d4-9259-7279ea60a206</p>
          <p>Default Password: password</p>
        </div>
      </div>
    </div>
  );
}
