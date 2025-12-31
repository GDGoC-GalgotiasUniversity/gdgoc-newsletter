'use client';

import { useState } from 'react';

export default function SubscriptionBox() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully subscribed!');
                setEmail('');

                // Reset to idle after 5 seconds
                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                }, 5000);
            } else if (response.status === 409 || data.alreadySubscribed) {
                setStatus('duplicate');
                setMessage(data.message || 'You are already subscribed!');
                setEmail('');

                // Reset to idle after 4 seconds
                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                }, 4000);
            } else {
                setStatus('error');
                setMessage(data.message || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setStatus('error');
            setMessage('Network error. Please check your connection and try again.');
        }
    };

    return (
        <div className="bg-[var(--paper-accent)] p-6 border-2 border-[var(--brand-purple)] border-dashed relative rounded-lg overflow-hidden">
            {/* Success Overlay with Stamp */}
            {status === 'success' && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="relative">
                        {/* Stamp Effect */}
                        <div className="border-4 border-green-600 rounded-lg px-8 py-4 rotate-[-5deg] shadow-xl bg-white/50">
                            <div className="flex items-center gap-3">
                                <svg
                                    className="w-12 h-12 text-green-600 animate-bounce"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <div>
                                    <div className="font-gothic text-3xl text-green-600 font-bold tracking-wider">
                                        SUBSCRIBED
                                    </div>
                                    <div className="font-sans-accent text-xs text-green-700 tracking-widest">
                                        WELCOME ABOARD!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-sm font-serif text-gray-700 text-center px-4">
                        {message}
                    </p>
                </div>
            )}

            {/* Duplicate Subscriber Overlay */}
            {status === 'duplicate' && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="relative">
                        <div className="border-4 border-blue-600 rounded-lg px-8 py-4 rotate-[3deg] shadow-xl bg-white/50">
                            <div className="flex items-center gap-3">
                                <svg
                                    className="w-12 h-12 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div>
                                    <div className="font-gothic text-2xl text-blue-600 font-bold tracking-wider">
                                        ALREADY SUBSCRIBED
                                    </div>
                                    <div className="font-sans-accent text-xs text-blue-700 tracking-widest">
                                        YOU'RE ON THE LIST!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-sm font-serif text-gray-700 text-center px-4">
                        {message}
                    </p>
                </div>
            )}

            {/* Badge */}
            <div className="md:absolute md:-top-3 md:left-1/2 md:-translate-x-1/2 bg-white px-3 py-1 border border-gray-200 rounded-full font-sans-accent text-[var(--brand-purple)] text-[10px] font-bold tracking-widest shadow-sm mb-3 md:mb-0">
                SUBSCRIBE
            </div>

            {/* Title */}
            <h3 className="font-gothic text-3xl text-center mb-2 mt-2">Join the Club</h3>

            {/* Description */}
            <p className="text-center font-serif italic text-sm mb-4 text-gray-600">
                Get the latest campus updates delivered via carrier pigeon (or email).
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="bg-white border border-gray-300 rounded px-4 py-2 font-serif text-sm focus:outline-none focus:border-[var(--brand-purple)] focus:ring-1 focus:ring-[var(--brand-purple)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[var(--brand-purple)] text-white font-sans-accent text-xs font-bold py-3 rounded hover:bg-black transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                    {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            SUBSCRIBING...
                        </span>
                    ) : (
                        'SIGN ME UP'
                    )}
                </button>

                {/* Error Message */}
                {status === 'error' && message && (
                    <div className="text-red-600 text-xs font-sans-accent text-center mt-1 animate-fadeIn">
                        {message}
                    </div>
                )}
            </form>

            {/* CSS for animations */}
            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
