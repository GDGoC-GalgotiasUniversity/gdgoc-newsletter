'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminStats from '@/components/AdminStats';
import AdminUsers from '@/components/AdminUsers';
import './admin.css';

export default function AdminPage() {
    const router = useRouter();
    const [newsletters, setNewsletters] = useState<any[]>([]);
    const [allNewsletters, setAllNewsletters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string>('');
    const [showUsers, setShowUsers] = useState(false);

    useEffect(() => {
        // Check if key is verified
        const keyVerified = localStorage.getItem('adminKeyVerified');
        if (!keyVerified) {
            router.push('/admin-key');
            return;
        }

        const adminToken = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');

        // Allow access with just key verification
        setToken(adminToken || 'key-verified');
        
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Fetch newsletters - use real token if available, otherwise fetch public newsletters
        if (adminToken) {
            fetchNewsletters(adminToken);
        } else {
            fetchPublicNewsletters();
        }
    }, [router]);

    const fetchNewsletters = async (token: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/newsletters/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                router.push('/admin-key');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch newsletters');
            }

            const data = await response.json();
            setAllNewsletters(data.data || []);
            setNewsletters(data.data || []);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPublicNewsletters = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletters`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch newsletters');
            }

            const data = await response.json();
            setAllNewsletters(data.data || []);
            setNewsletters(data.data || []);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this newsletter?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/admin');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/newsletters/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to delete');

            setNewsletters(prev => prev.filter(n => n._id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminKeyVerified');
        router.push('/admin-key');
    };

    if (isLoading) {
        return (
            <main className="py-8 bg-[var(--gray-50)] min-h-[calc(100vh-64px)]">
                <div className="container text-center">
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="newsletter-page min-h-screen py-16">
            <div className="container max-w-6xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <p className="text-lg tracking-widest text-[var(--primary-purple)] mb-2 font-semibold">
                        ADMIN PANEL
                    </p>
                    <h1 className="mb-3">Newsletter Manager</h1>
                    <p className="newsletter-subtitle text-2xl">Manage Your Content</p>

                    <div className="flex justify-center items-center gap-3 text-[var(--primary-purple)] text-lg tracking-wider my-4">
                        {user && <span>{user.name}</span>}
                        <span>•</span>
                        <span>ADMINISTRATOR</span>
                    </div>

                    {/* Diamond Divider */}
                    <div className="diamond-divider">✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</div>

                    {/* Top Divider Line */}
                    <div className="newsletter-divider"></div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mb-8 flex-wrap">
                        <Link 
                            href="/admin/new" 
                            className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition btn-primary"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Newsletter
                        </Link>
                        <button
                            onClick={() => setShowUsers(!showUsers)}
                            className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition btn-secondary"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Users
                        </button>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition"
                            style={{ backgroundColor: '#e8d4c4', color: '#6b4c9a' }}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#fde2e4', color: '#c5192d', border: '1px solid #f1919b' }}>
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                <AdminStats
                    totalNewsletters={newsletters.length}
                    publishedNewsletters={newsletters.filter(n => n.status === 'published').length}
                    draftNewsletters={newsletters.filter(n => n.status === 'draft').length}
                />

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: '#8b6ba8' }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search newsletters..."
                            onChange={(e) => {
                                const query = e.target.value.toLowerCase();
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
                            }}
                            className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition text-sm"
                            style={{ borderColor: '#d4a574', '--tw-ring-color': '#6b4c9a' } as any}
                        />
                    </div>
                </div>

                {/* Newsletter Table */}
                <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#fff', border: '2px solid #000' }}>
                    {newsletters.length > 0 ? (
                        <table className="w-full">
                            <thead style={{ backgroundColor: '#f5e6d3', borderBottom: '2px solid #d4a574' }}>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: '#6b4c9a' }}>Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: '#6b4c9a' }}>Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: '#6b4c9a' }}>Status</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold" style={{ color: '#6b4c9a' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderTop: '1px solid #e5d5c8' }}>
                                {newsletters.map((newsletter, index) => (
                                    <tr 
                                        key={newsletter._id} 
                                        style={{ 
                                            backgroundColor: index % 2 === 0 ? '#fafaf8' : '#fff',
                                            borderBottom: '1px solid #e5d5c8'
                                        }}
                                        className="hover:opacity-80 transition"
                                    >
                                        <td className="px-4 py-2">
                                            <span className="font-medium text-sm" style={{ color: '#6b4c9a' }}>{newsletter.title}</span>
                                        </td>
                                        <td className="px-4 py-2 text-sm" style={{ color: '#8b6ba8' }}>
                                            {new Date(newsletter.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className="inline-flex px-2 py-1 text-xs font-semibold rounded"
                                                style={{
                                                    backgroundColor: newsletter.status === 'published'
                                                        ? '#d4a574'
                                                        : '#e8d4c4',
                                                    color: newsletter.status === 'published'
                                                        ? '#fff'
                                                        : '#6b4c9a'
                                                }}
                                            >
                                                {newsletter.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <Link 
                                                href={`/admin/edit/${newsletter._id}`} 
                                                className="font-medium mr-3 transition text-xs"
                                                style={{ color: '#6b4c9a' }}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(newsletter._id)}
                                                className="font-medium transition text-xs"
                                                style={{ color: '#c5192d' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="flex justify-center gap-3 mb-4">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6b4c9a' }}></span>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d4a574' }}></span>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6b4c9a' }}></span>
                            </div>
                            <h3 className="mb-2 text-sm font-semibold" style={{ color: '#6b4c9a' }}>No newsletters yet</h3>
                            <p className="text-xs mb-4" style={{ color: '#8b6ba8' }}>Create your first newsletter to get started.</p>
                            <Link 
                                href="/admin/new" 
                                className="inline-block px-4 py-2 rounded-lg font-medium transition btn-primary text-sm"
                            >
                                Create Newsletter
                            </Link>
                        </div>
                    )}
                </div>

                {/* Bottom Divider */}
                <div className="newsletter-divider mt-8"></div>

                {/* Users Modal/Section */}
                {showUsers && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#f5e6d3', border: '2px solid #000' }}>
                            <div className="sticky top-0 border-b p-6 flex justify-between items-center" style={{ backgroundColor: '#f5e6d3', borderColor: '#d4a574', borderWidth: '2px' }}>
                                <h2 className="text-2xl font-bold" style={{ color: '#6b4c9a' }}>Registered Users</h2>
                                <button
                                    onClick={() => setShowUsers(false)}
                                    className="transition"
                                    style={{ color: '#8b6ba8' }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
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