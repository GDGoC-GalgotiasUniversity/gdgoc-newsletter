'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// @ts-ignore
import AdminUsers from '@/components/AdminUsers'; 

interface Newsletter {
    _id: string;
    title: string;
    status: 'draft' | 'published';
    slug: string;
    excerpt?: string;
    createdAt: string;
    publishedAt?: string;
}

export default function AdminDashboard() {
    const router = useRouter();

    // State for Data
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [allNewsletters, setAllNewsletters] = useState<Newsletter[]>([]); // Store full list for filtering
    const [loading, setLoading] = useState(true);

    // State for UI/Auth
    const [userName, setUserName] = useState('Editor');
    const [showUsers, setShowUsers] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- Fetch Data ---
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        // Auth Check
        if (!storedToken || user.role !== 'admin') {
            router.push('/login');
            return;
        }

        setToken(storedToken);
        setUserName(user.name?.split(' ')[0] || 'Editor');

        const fetchNewsletters = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

                // Note: Using the route that returns ALL newsletters (drafts + public)
                const res = await fetch(`${apiUrl}/admin/newsletters/all`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });

                const data = await res.json();

                if (data.success || Array.isArray(data.data)) {
                    const items = data.data || [];
                    setAllNewsletters(items); // Save backup for search
                    setNewsletters(items);    // Set display list
                }
            } catch (err) {
                console.error('Failed to fetch ledger:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsletters();
    }, [router]);

    // --- Search Handler (Teammate's Feature) ---
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setCurrentPage(1); // Reset to first page on search

        if (!query.trim()) {
            setNewsletters(allNewsletters);
        } else {
            const filtered = allNewsletters.filter(n =>
                n.title.toLowerCase().includes(query) ||
                n.excerpt?.toLowerCase().includes(query) ||
                n.slug.toLowerCase().includes(query)
            );
            setNewsletters(filtered);
        }
    };

    // --- Delete Action ---
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to burn this draft? This action cannot be undone.')) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        try {
            await fetch(`${apiUrl}/admin/newsletters/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            // Update both lists
            setNewsletters((prev) => prev.filter((n) => n._id !== id));
            setAllNewsletters((prev) => prev.filter((n) => n._id !== id));
        } catch (err) {
            alert('Could not delete newsletter');
        }
    };

    // --- Pagination Logic ---
    const totalPages = Math.ceil(newsletters.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentNewsletters = newsletters.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    // --- Calculated Stats ---
    const publishedCount = allNewsletters.filter(n => n.status === 'published').length;
    const draftCount = allNewsletters.filter(n => n.status === 'draft').length;

    if (loading) return <div className="min-h-screen bg-[var(--paper-bg)] flex items-center justify-center font-serif animate-pulse">Loading Archives...</div>;

    return (
        <main className="min-h-screen bg-[var(--paper-bg)] text-[var(--ink-black)] py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* --- HEADER SECTION --- */}
                <header className="mb-12 border-b-4 border-double border-[var(--ink-black)] pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <p className="font-sans-accent text-[var(--brand-purple)] text-xs mb-2">INTERNAL USE ONLY • RESTRICTED ACCESS</p>
                        <h1 className="font-gothic text-6xl text-[var(--ink-black)]">Editor's Desk</h1>
                        <p className="font-serif italic text-xl text-[var(--ink-gray)]">
                            Welcome back, {userName}. You have <span className="text-[var(--brand-purple)] font-bold">{draftCount} drafts</span> pending review.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowUsers(true)}
                            className="inline-flex items-center gap-2 border-2 border-[var(--ink-black)] bg-white text-[var(--ink-black)] font-sans-accent text-sm px-6 py-3 hover:bg-[var(--paper-accent)] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Manage Users
                        </button>

                        <Link
                            href="/admin/new"
                            className="inline-flex items-center gap-2 bg-[var(--brand-purple)] text-white font-sans-accent text-sm px-6 py-3 hover:bg-[var(--ink-black)] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <span className="text-xl leading-none">+</span> Draft New Issue
                        </Link>
                    </div>
                </header>

                {/* --- STATS ROW --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Stat Card 1 */}
                    <div className="border border-[var(--ink-black)] p-6 bg-[var(--paper-accent)] relative overflow-hidden group">
                        <div className="font-sans-accent text-xs text-[var(--ink-gray)] uppercase tracking-wider mb-2">Total Circulation</div>
                        <div className="font-serif text-5xl font-bold text-[var(--ink-black)]">{allNewsletters.length}</div>
                        <div className="absolute -right-4 -bottom-4 text-9xl text-[var(--ink-black)] opacity-5 group-hover:opacity-10 transition-opacity font-gothic">N</div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="border border-[var(--ink-black)] p-6 bg-white relative overflow-hidden">
                        <div className="font-sans-accent text-xs text-[var(--ink-gray)] uppercase tracking-wider mb-2">Published Issues</div>
                        <div className="font-serif text-5xl font-bold text-green-700">{publishedCount}</div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="border border-[var(--ink-black)] p-6 bg-white relative overflow-hidden">
                        <div className="font-sans-accent text-xs text-[var(--ink-gray)] uppercase tracking-wider mb-2">Drafts Pending</div>
                        <div className="font-serif text-5xl font-bold text-orange-600">{draftCount}</div>
                    </div>
                </div>

                {/* --- THE LEDGER (Table) --- */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <h2 className="font-serif text-2xl font-bold italic whitespace-nowrap">Issue Manifest</h2>
                            <div className="h-[1px] bg-[var(--ink-black)] flex-1 md:w-24 opacity-20"></div>
                        </div>

                        {/* SEARCH BAR (Teammate's Feature - Styled) */}
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Search archives..."
                                onChange={handleSearch}
                                className="w-full bg-white border border-[var(--ink-black)] px-4 py-2 font-serif text-sm focus:outline-none focus:border-[var(--brand-purple)] focus:shadow-[2px_2px_0px_0px_rgba(74,20,140,0.2)]"
                            />
                            <svg className="w-4 h-4 text-[var(--ink-gray)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="border-2 border-[var(--ink-black)] bg-white shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[var(--paper-accent)] border-b-2 border-[var(--ink-black)]">
                                <tr>
                                    <th className="font-sans-accent text-xs p-4 border-r border-[var(--ink-black)] w-16">#</th>
                                    <th className="font-sans-accent text-xs p-4 border-r border-[var(--ink-black)]">Headline</th>
                                    <th className="font-sans-accent text-xs p-4 border-r border-[var(--ink-black)]">Status</th>
                                    <th className="font-sans-accent text-xs p-4 border-r border-[var(--ink-black)]">Date</th>
                                    <th className="font-sans-accent text-xs p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="font-serif text-sm">
                                {currentNewsletters.map((newsletter, index) => (
                                    <tr
                                        key={newsletter._id}
                                        onClick={() => router.push(`/newsletter/${newsletter.slug}`)}
                                        className="border-b border-[var(--ink-black)] hover:bg-[var(--paper-bg)] transition-colors group cursor-pointer"
                                    >
                                        <td className="p-4 border-r border-[var(--ink-black)] text-[var(--ink-gray)]">
                                            {/* Adjusted index to be continuous across pages */}
                                            {String(startIndex + index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="p-4 border-r border-[var(--ink-black)]">
                                            <div className="font-bold text-lg text-[var(--ink-black)] mb-1">{newsletter.title}</div>
                                            <div className="font-sans text-xs text-[var(--ink-gray)] font-mono">/{newsletter.slug}</div>
                                        </td>
                                        <td className="p-4 border-r border-[var(--ink-black)]">
                                            <span className={`inline-block px-2 py-1 text-xs font-sans-accent border ${newsletter.status === 'published'
                                                ? 'border-green-600 text-green-700 bg-green-50'
                                                : 'border-orange-400 text-orange-700 bg-orange-50'
                                                }`}>
                                                {newsletter.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 border-r border-[var(--ink-black)] text-[var(--ink-gray)]">
                                            {new Date(newsletter.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            <Link
                                                href={`/admin/edit/${newsletter._id}`}
                                                className="text-[var(--brand-purple)] hover:underline font-bold text-xs uppercase tracking-wider"
                                                onClick={(e) => e.stopPropagation()} // Prevent row click
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click
                                                    handleDelete(newsletter._id);
                                                }}
                                                className="text-red-700 hover:underline font-bold text-xs uppercase tracking-wider"
                                            >
                                                Burn
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {newsletters.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-[var(--ink-gray)] italic">
                                            {allNewsletters.length === 0
                                                ? "No records found in the archives."
                                                : "No matching issues found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION CONTROLS --- */}
                    {newsletters.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                            <div className="font-sans-accent text-xs text-[var(--ink-gray)]">
                                Showing <span className="font-bold text-[var(--ink-black)]">{startIndex + 1}</span> to <span className="font-bold text-[var(--ink-black)]">{Math.min(startIndex + itemsPerPage, newsletters.length)}</span> of {newsletters.length} records
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-4 py-2 border border-[var(--ink-black)] bg-white hover:bg-[var(--paper-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-accent text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                >
                                    <span>←</span> Prev
                                </button>
                                
                                <span className="font-serif italic px-2">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-4 py-2 border border-[var(--ink-black)] bg-white hover:bg-[var(--paper-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-accent text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                >
                                    Next <span>→</span>
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* --- USERS MODAL (Teammate's Feature - Styled) --- */}
                {showUsers && (
                    <div className="fixed inset-0 bg-[rgba(44,44,44,0.6)] backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-[var(--paper-bg)] border-4 border-double border-[var(--ink-black)] rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]">

                            {/* Modal Header */}
                            <div className="sticky top-0 bg-[var(--paper-accent)] border-b-2 border-[var(--ink-black)] p-6 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="font-gothic text-3xl text-[var(--ink-black)]">Registered Personnel</h2>
                                    <p className="font-sans-accent text-xs text-[var(--brand-purple)]">CONFIDENTIAL RECORDS</p>
                                </div>
                                <button
                                    onClick={() => setShowUsers(false)}
                                    className="w-8 h-8 flex items-center justify-center border border-[var(--ink-black)] bg-white hover:bg-red-50 text-[var(--ink-black)] hover:text-red-700 font-bold transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {token && <AdminUsers token={token} />}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}