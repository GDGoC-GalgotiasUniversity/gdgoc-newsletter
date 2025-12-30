'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext'; // Import hook

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Get login function
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // 🟢 USE CONTEXT LOGIN (Updates Header immediately)
      login(data.token, data.user);

      // Redirect based on Role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--paper-bg)] px-4">
      <div className="w-full max-w-md bg-[var(--paper-accent)] border-2 border-[var(--ink-black)] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="text-center mb-8">
          <h1 className="font-gothic text-4xl text-[var(--brand-purple)] mb-2">Member Login</h1>
          <p className="font-serif italic text-sm">Please identify yourself to access the archives.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-700 text-sm font-sans-accent">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-sans-accent text-xs font-bold mb-1 uppercase">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-[var(--ink-black)] bg-white focus:outline-none focus:border-[var(--brand-purple)] font-serif"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-sans-accent text-xs font-bold mb-1 uppercase">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-[var(--ink-black)] bg-white focus:outline-none focus:border-[var(--brand-purple)] font-serif"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[var(--brand-purple)] text-white font-sans-accent font-bold py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-[var(--ink-black)] pt-4 flex flex-col gap-2">
           <span className="font-serif italic text-sm">New to the campus?</span>
           <Link href="/register" className="font-sans-accent text-xs font-bold text-[var(--brand-purple)] hover:underline">
             CREATE AN ACCOUNT
           </Link>
        </div>

        <div className="mt-2 text-center">
            <Link href="/" className="font-serif italic text-sm hover:underline text-[var(--ink-gray)]">
                &larr; Return to Front Page
            </Link>
        </div>

      </div>
    </main>
  );
}