'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function AdminKeyPage() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if already logged in with valid token
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.role === 'admin') {
      // Already logged in as admin, skip key verification
      router.push('/admin');
      return;
    }
    
    // Check if already verified the key
    const verified = localStorage.getItem('adminKeyVerified');
    if (verified) {
      router.push('/admin');
      return;
    }
    setIsReady(true);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simple key verification (you can change this key)
      const ADMIN_KEY = 'admin123'; // Change this to your desired key

      if (key !== ADMIN_KEY) {
        throw new Error('Invalid admin key');
      }

      // Store verification in localStorage
      localStorage.setItem('adminKeyVerified', 'true');
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="py-12 bg-[var(--gray-50)] min-h-screen flex items-center justify-center">
      <div className="container max-w-md">
        {!isReady ? (
          <div className="card p-8 text-center">
            <p style={{ color: '#6b4c9a' }}>Checking access...</p>
          </div>
        ) : (
          <div className="card p-8">
            <div className="flex justify-center mb-6">
              <AnimatedLogo className="w-12 h-12" />
            </div>

            <h1 className="text-2xl mb-2 text-center">Admin Access</h1>
            <p className="text-center text-[var(--gray-500)] mb-8">Enter the admin key to continue</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                  Admin Key
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin key"
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--google-blue)]"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify Key'}
              </button>
            </form>

            <p className="text-center text-sm text-[var(--gray-500)] mt-6">
              <Link href="/" className="text-[var(--google-blue)] hover:underline">
                Back to Home
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
