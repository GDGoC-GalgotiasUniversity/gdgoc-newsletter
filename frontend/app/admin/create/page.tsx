'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NewsletterEditor from '@/components/NewsletterEditor';

export default function NewNewsletterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check standard Auth Token & Role
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setError('');

    try {
      // Validate form data
      if (!formData.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.slug?.trim()) {
        throw new Error('Slug is required');
      }
      if (!formData.contentHtml?.trim()) {
        throw new Error('Content is required');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Transform contentHtml to contentMarkdown for backend compatibility
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        contentMarkdown: formData.contentHtml, // Backend expects contentMarkdown
        template: formData.template,
        status: formData.status,
        coverImage: formData.coverImage,
        gallery: formData.gallery || [],
      };

      console.log('📝 Submitting newsletter:', {
        title: payload.title,
        slug: payload.slug,
        status: payload.status,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/newsletters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin-key');
        return;
      }

      if (!response.ok) {
        console.error('❌ API Error:', responseData);
        throw new Error(responseData.message || `Failed to create newsletter (${response.status})`);
      }

      console.log('✅ Newsletter created successfully');
      router.push('/admin');
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#f5e6d3' }}>
        <div className="container text-center py-8">
          <p style={{ color: '#6b4c9a' }}>Checking authorization...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="newsletter-page min-h-screen py-16">
      <div className="container max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-lg tracking-widest text-(--primary-purple) mb-2 font-semibold">

            CREATE NEWSLETTER
          </p>
          <h1 className="mb-3">Create Newsletter</h1>
          <div className="diamond-divider">✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</div>
          <div className="newsletter-divider"></div>
        </div>

        {/* Back Link */}
        <Link href="/admin" className="inline-flex items-center mb-6" style={{ color: '#6b4c9a' }}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admin
        </Link>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#fde2e4', color: '#c5192d', border: '1px solid #f1919b' }}>
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="rounded-lg p-8 newsletter-page" style={{ backgroundColor: '#fff', border: '2px solid #000' }}>
          <NewsletterEditor onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Bottom Divider */}
        <div className="newsletter-divider mt-12"></div>
      </div>
    </main>
  );
}
