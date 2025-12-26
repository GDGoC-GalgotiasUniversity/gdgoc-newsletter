'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewNewsletterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        contentMarkdown: '',
        template: 'default',
        status: 'draft'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Get token from localStorage (assuming it's stored there after login)
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Not authenticated. Please login explicitly first.');
            }

            const res = await fetch('http://localhost:5000/admin/newsletters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create newsletter');
            }

            // Redirect on success
            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="py-8 bg-[var(--gray-50)] min-h-[calc(100vh-64px)]">
            <div className="container max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/admin" className="text-[var(--gray-500)] hover:text-[var(--gray-700)] mb-1 inline-block text-sm">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-medium">Create Newsletter</h1>
                    </div>
                </div>

                <div className="card p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent outline-none transition"
                                placeholder="e.g. January 2024 Roundup"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent outline-none transition font-mono text-sm"
                                placeholder="e.g. jan-2024-roundup"
                            />
                            <p className="text-xs text-[var(--gray-500)] mt-1">Unique identifier for the URL</p>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                                Excerpt
                            </label>
                            <textarea
                                name="excerpt"
                                rows={3}
                                value={formData.excerpt}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent outline-none transition"
                                placeholder="Brief summary for the card view..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                                Content (Markdown) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="contentMarkdown"
                                required
                                rows={10}
                                value={formData.contentMarkdown}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent outline-none transition font-mono text-sm"
                                placeholder="# Heading&#10;&#10;Write your content here in Markdown..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Template */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                                    Template
                                </label>
                                <select
                                    name="template"
                                    value={formData.template}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent outline-none transition bg-white"
                                >
                                    <option value="default">Default</option>
                                    <option value="event-recap">Event Recap</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="announcement">Announcement</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent outline-none transition bg-white"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--gray-200)]">
                            <Link
                                href="/admin"
                                className="px-4 py-2 text-[var(--gray-600)] hover:text-[var(--gray-900)] font-medium transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Create Newsletter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
