'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Newsletter {
  _id: string;
  title: string;
  status: 'draft' | 'published';
  slug: string;
  createdAt: string;
  publishedAt?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Editor');

  // --- Fetch Data ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    setUserName(user.name?.split(' ')[0] || 'Editor');

    const fetchNewsletters = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/admin/newsletters/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setNewsletters(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch ledger:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [router]);

  // --- Actions ---
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to burn this draft? This action cannot be undone.')) return;
    
    const token = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      await fetch(`${apiUrl}/api/admin/newsletters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from UI
      setNewsletters((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert('Could not delete newsletter');
    }
  };

  // --- Calculated Stats ---
  const publishedCount = newsletters.filter(n => n.status === 'published').length;
  const draftCount = newsletters.filter(n => n.status === 'draft').length;

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
            
            <div>
                <Link 
                    href="/admin/create" 
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
                <div className="font-serif text-5xl font-bold text-[var(--ink-black)]">{newsletters.length}</div>
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
            <div className="flex items-center gap-4 mb-4">
                <h2 className="font-serif text-2xl font-bold italic">Issue Manifest</h2>
                <div className="h-[1px] bg-[var(--ink-black)] flex-1 opacity-20"></div>
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
                        {newsletters.map((newsletter, index) => (
                            <tr key={newsletter._id} className="border-b border-[var(--ink-black)] hover:bg-[var(--paper-bg)] transition-colors group">
                                <td className="p-4 border-r border-[var(--ink-black)] text-[var(--ink-gray)]">
                                    {String(index + 1).padStart(2, '0')}
                                </td>
                                <td className="p-4 border-r border-[var(--ink-black)]">
                                    <div className="font-bold text-lg text-[var(--ink-black)] mb-1">{newsletter.title}</div>
                                    <div className="font-sans text-xs text-[var(--ink-gray)] font-mono">/{newsletter.slug}</div>
                                </td>
                                <td className="p-4 border-r border-[var(--ink-black)]">
                                    <span className={`inline-block px-2 py-1 text-xs font-sans-accent border ${
                                        newsletter.status === 'published' 
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
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(newsletter._id)}
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
                                    No records found in the archives.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>

      </div>
    </main>
  );
}