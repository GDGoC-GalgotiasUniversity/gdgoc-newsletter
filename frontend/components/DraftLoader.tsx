'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NewsletterDetail from './NewsletterDetail';

export default function DraftLoader({ slug }: { slug: string }) {
    const [newsletter, setNewsletter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDraft = async () => {
            const token = localStorage.getItem('token');
            // If no token, we can't fetch a draft. Show 404 immediately.
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await fetch(`${apiUrl}/api/newsletters/${slug}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setNewsletter(data.data);
                } else {
                    // Start checking authentication if we got a 404 even with a token (maybe not admin?)
                    // But for now, just assume not found.
                    setError('Not Found');
                }
            } catch (err) {
                console.error("Draft fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDraft();
    }, [slug]);

    if (loading) {
        return (
            <main className="py-24 min-h-screen bg-[var(--paper-bg)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-purple)] mx-auto mb-4"></div>
                    <p className="font-serif italic text-[var(--ink-gray)]">Checking Archives for Draft...</p>
                </div>
            </main>
        );
    }

    if (newsletter) {
        return (
            <div>
                <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-xs font-bold border-b border-yellow-300">
                    PREVIEW MODE: Viewing Draft
                </div>
                <NewsletterDetail newsletter={newsletter} />
            </div>
        );
    }

    // Default 404 View
    return (
        <main className="py-24 min-h-screen bg-[var(--paper-bg)] flex items-center justify-center">
            <div className="container text-center max-w-lg p-8 border-2 border-dashed border-[var(--brand-purple)]">
                <h1 className="font-gothic text-4xl mb-4 text-[var(--brand-purple)]">404</h1>
                <h2 className="font-serif text-2xl mb-4">Newsletter Not Found</h2>
                <p className="mb-8 font-sans text-[var(--ink-gray)]">
                    The article you are looking for has either been retracted or never existed in the archives.
                </p>
                <Link href="/newsletter" className="btn-classic">
                    Return to Archives
                </Link>
            </div>
        </main>
    );
}
