'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NewsletterEditor from '@/components/NewsletterEditor';

export default function CreateNewsletterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if key is verified
    const keyVerified = localStorage.getItem('adminKeyVerified');
    if (!keyVerified) {
      router.push('/admin-key');
      return;
    }

    // Allow access with just key verification
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

      const token = localStorage.getItem('adminToken') || 'key-verified';

      console.log('📝 Submitting newsletter:', {
        title: formData.title,
        slug: formData.slug,
        status: formData.status,
        token: token === 'key-verified' ? 'key-verified' : 'jwt-token',
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
      <main className="py-8 bg-[var(--gray-50)] min-h-[calc(100vh-64px)]">
        <div className="container text-center">
          <p>Checking authorization...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#f5e6d3' }}>
      <div className="container max-w-3xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center mb-6" style={{ color: '#6b4c9a' }}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admin
          </Link>
          <h1 className="text-4xl font-bold" style={{ color: '#6b4c9a' }}>Create Newsletter</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#fde2e4', color: '#c5192d', border: '1px solid #f1919b' }}>
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="rounded-lg p-8" style={{ backgroundColor: '#fff' }}>
          <NewsletterEditor onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
