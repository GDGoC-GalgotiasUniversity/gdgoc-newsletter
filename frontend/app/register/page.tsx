'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext'; // Import hook

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth(); // Get login function
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // 🟢 USE CONTEXT LOGIN
      login(data.token, data.user);
      
      // Show Success Telegram
      setSuccess(true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS VIEW (Telegram)
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--paper-bg)] px-4">
        <div className="max-w-lg w-full bg-[#fdfbf7] border-4 border-double border-[var(--ink-black)] p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] relative overflow-hidden">
            
            {/* Header with Logo */}
            <div className="flex justify-between items-end border-b-2 border-[var(--ink-black)] pb-4 mb-6">
                <div className="flex flex-col items-start gap-2">
                    <div className="relative w-48 h-12">
                       <Image 
                         src="/final-gdg-logo.svg" 
                         alt="GDG Logo" 
                         fill
                         className="object-contain object-left"
                         priority
                       />
                    </div>
                    <p className="font-mono text-xs text-[var(--ink-gray)] uppercase tracking-widest">
                        Official Correspondence
                    </p>
                </div>
                
                <div className="text-right">
                    <div className="border-2 border-[var(--brand-purple)] rounded-full w-16 h-16 flex items-center justify-center rotate-12 opacity-80">
                        <span className="font-sans-accent text-[10px] text-[var(--brand-purple)] text-center font-bold leading-tight">
                            PRIORITY<br/>MAIL
                        </span>
                    </div>
                </div>
            </div>

            <div className="font-mono text-lg leading-relaxed text-[var(--ink-black)] space-y-4 mb-8">
                <p>TO: {formData.name.toUpperCase()}</p>
                <p>STATUS: <span className="bg-green-100 text-green-800 px-1 font-bold">APPROVED</span></p>
                <div className="border-l-4 border-[var(--brand-purple)] pl-4 py-2 italic bg-[var(--paper-accent)]">
                   "MEMBERSHIP CONFIRMED. YOUR PRESS PASS HAS BEEN ISSUED. WELCOME TO THE CLUB."
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[var(--ink-black)] border-dashed">
                <Link 
                    href="/" 
                    className="flex-1 bg-[var(--brand-purple)] text-white font-sans-accent text-center text-sm py-3 hover:bg-[var(--ink-black)] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    Return to Front Page
                </Link>
                
                <Link 
                    href="/newsletter" 
                    className="flex-1 bg-white border border-[var(--ink-black)] text-[var(--ink-black)] font-sans-accent text-center text-sm py-3 hover:bg-[var(--paper-accent)] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    View Newsletters
                </Link>
            </div>
            
            <div className="absolute -bottom-8 -right-8 -z-10 opacity-5 pointer-events-none rotate-[-15deg]">
                <span className="font-gothic text-9xl">GDG</span>
            </div>
        </div>
      </main>
    );
  }

  // STANDARD FORM VIEW (Same as before)
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--paper-bg)] px-4">
      <div className="w-full max-w-md bg-[var(--paper-accent)] border-2 border-[var(--ink-black)] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="text-center mb-8">
          <h1 className="font-gothic text-4xl text-[var(--brand-purple)] mb-2">New Reader</h1>
          <p className="font-serif italic text-sm">Create a profile to personalize your experience.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-700 text-sm font-sans-accent">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-sans-accent text-xs font-bold mb-1 uppercase">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-[var(--ink-black)] bg-white focus:outline-none focus:border-[var(--brand-purple)] font-serif"
              placeholder="Ada Lovelace"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

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
            {loading ? 'Processing...' : 'Join the Club'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-[var(--ink-black)] pt-4 flex flex-col gap-2">
           <span className="font-serif italic text-sm">Already have a pass?</span>
           <Link href="/login" className="font-sans-accent text-xs font-bold text-[var(--brand-purple)] hover:underline">
             SIGN IN HERE
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