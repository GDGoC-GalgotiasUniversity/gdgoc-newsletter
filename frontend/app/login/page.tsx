'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Using localhost:5000 as defined in backend/.env
            const res = await fetch('http://localhost:5000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Invalid email or password');
            }

            // Save token and user info to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                name: data.name,
                email: data.email,
                role: data.role
            }));

            console.log('Login successful:', data.message);

            // Redirect based on role
            if (data.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-[var(--gray-50)]">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="card p-10">
                    {/* Logo */}
                    <div className="flex justify-center gap-2 mb-6">
                        <span className="w-3 h-3 rounded-full bg-[var(--google-blue)]"></span>
                        <span className="w-3 h-3 rounded-full bg-[var(--google-red)]"></span>
                        <span className="w-3 h-3 rounded-full bg-[var(--google-yellow)]"></span>
                        <span className="w-3 h-3 rounded-full bg-[var(--google-green)]"></span>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl mb-2">Sign in</h1>
                        <p className="text-[var(--gray-500)]">to get early access to GDGoCGU newsletter</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full"
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full"
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-[var(--gray-700)]">
                                <input type="checkbox" className="rounded border-[var(--gray-300)]" />
                                Remember me
                            </label>
                            <a href="#" className="text-[var(--google-blue)] hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--gray-200)] text-center">
                        <p className="text-sm text-[var(--gray-500)]">
                            By signing in, you agree to our terms and conditions.
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-[var(--gray-500)]">
                    <Link href="/" className="text-[var(--google-blue)] hover:underline">
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </main>
    );
}