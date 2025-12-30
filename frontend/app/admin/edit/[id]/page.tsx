'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import NewsletterEditor from '@/components/NewsletterEditor';

export default function EditNewsletterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if key is verified
    const keyVerified = localStorage.getItem('adminKeyVerified');
    if (!keyVerified) {
      router.push('/admin-key');
      return;
    }

    setIsAuthorized(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchNewsletter(id, token);
  }, [id, router]);

  const fetchNewsletter = async (newsletterId: string, token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/admin/newsletters/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch newsletters');

      const data = await response.json();
      const newsletter = data.data.find((n: any) => n._id === newsletterId);

      if (!newsletter) throw new Error('Newsletter not found');

      // Transform contentMarkdown to contentHtml for the editor
      setInitialData({
        ...newsletter,
        contentHtml: newsletter.contentMarkdown,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Transform contentHtml to contentMarkdown for backend compatibility
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        contentMarkdown: formData.contentHtml, // Backend expects contentMarkdown
        template: formData.template,
        status: formData.status,
        coverImage: formData.coverImage,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/admin/newsletters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update newsletter');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#f5e6d3' }}>
        <div className="container text-center py-8">
          <p style={{ color: '#6b4c9a' }}>Loading newsletter...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="newsletter-page min-h-screen py-16">
      <div className="container max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-lg tracking-widest text-[var(--primary-purple)] mb-2 font-semibold">
            EDIT NEWSLETTER
          </p>
          <h1 className="mb-3">Edit Newsletter</h1>
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
        {initialData && (
          <div className="rounded-lg p-8 newsletter-page" style={{ backgroundColor: '#fff', border: '2px solid #000' }}>
            <NewsletterEditor
              initialData={initialData}
              onSubmit={handleSubmit}
              isLoading={isSaving}
            />
          </div>
        )}

        {/* Bottom Divider */}
        <div className="newsletter-divider mt-12"></div>
      </div>
    </main>
  );
}
