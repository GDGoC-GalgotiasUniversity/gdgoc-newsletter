'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data
const mockNewsletters = [
    { id: 1, slug: 'jan-2024', title: 'January 2024 Newsletter', status: 'published', date: 'Jan 15, 2024' },
    { id: 2, slug: 'feb-2024', title: 'February 2024 Newsletter', status: 'published', date: 'Feb 15, 2024' },
    { id: 3, slug: 'mar-2024', title: 'March 2024 Newsletter', status: 'draft', date: 'Mar 15, 2024' },
];

export default function AdminPage() {
    const [newsletters] = useState(mockNewsletters);

    const stats = [
        { label: 'Total', value: newsletters.length, color: 'var(--google-blue)' },
        { label: 'Published', value: newsletters.filter(n => n.status === 'published').length, color: 'var(--google-green)' },
        { label: 'Drafts', value: newsletters.filter(n => n.status === 'draft').length, color: 'var(--google-yellow)' },
    ];

    return (
        <main className="py-8 bg-[var(--gray-50)] min-h-[calc(100vh-64px)]">
            <div className="container">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl mb-1">Admin Dashboard</h1>
                        <p className="text-[var(--gray-500)]">Manage your newsletters</p>
                    </div>
                    <Link href="/" className="text-[var(--google-blue)] hover:underline text-sm">
                        ← View Site
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="card p-6">
                            <p className="text-sm text-[var(--gray-500)] mb-1">{stat.label}</p>
                            <p className="text-3xl font-normal" style={{ color: stat.color }}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-6">
                    <Link href="/admin/new" className="btn-primary inline-flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Newsletter
                    </Link>
                    <button className="btn-secondary">
                        Export Data
                    </button>
                </div>

                {/* Newsletter Table */}
                <div className="card overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--gray-700)]">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--gray-700)]">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--gray-700)]">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-[var(--gray-700)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-200)]">
                            {newsletters.map((newsletter) => (
                                <tr key={newsletter.id} className="hover:bg-[var(--gray-50)] transition">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-[var(--gray-900)]">{newsletter.title}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--gray-500)]">{newsletter.date}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                                            style={{
                                                backgroundColor: newsletter.status === 'published'
                                                    ? 'rgba(52, 168, 83, 0.1)'
                                                    : 'rgba(251, 188, 4, 0.1)',
                                                color: newsletter.status === 'published'
                                                    ? 'var(--google-green)'
                                                    : 'var(--google-yellow)'
                                            }}
                                        >
                                            {newsletter.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[var(--google-blue)] hover:underline text-sm mr-4">
                                            Edit
                                        </button>
                                        <button className="text-[var(--google-red)] hover:underline text-sm">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {newsletters.length === 0 && (
                    <div className="card p-12 text-center">
                        <div className="flex justify-center gap-2 mb-4">
                            <span className="w-3 h-3 rounded-full bg-[var(--google-blue)]"></span>
                            <span className="w-3 h-3 rounded-full bg-[var(--google-red)]"></span>
                            <span className="w-3 h-3 rounded-full bg-[var(--google-yellow)]"></span>
                            <span className="w-3 h-3 rounded-full bg-[var(--google-green)]"></span>
                        </div>
                        <h3 className="mb-2">No newsletters yet</h3>
                        <p className="text-[var(--gray-500)] mb-4">Create your first newsletter to get started.</p>
                        <button className="btn-primary">Create Newsletter</button>
                    </div>
                )}
            </div>
        </main>
    );
}