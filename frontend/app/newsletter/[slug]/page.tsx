'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Newsletter {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  featured: boolean;
}

export default function NewsletterPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedContent, setHighlightedContent] = useState('');

  useEffect(() => {
    fetchNewsletter();
  }, [slug]);

  useEffect(() => {
    if (newsletter) {
      highlightSearchTerms();
    }
  }, [searchQuery, newsletter]);

  const fetchNewsletter = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/newsletters/${slug}`);
      const data = await res.json();
      if (data.success) {
        setNewsletter(data.data);
      } else {
        setError('Newsletter not found');
      }
    } catch (error) {
      setError('Failed to fetch newsletter');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const highlightSearchTerms = () => {
    if (!searchQuery.trim() || !newsletter) {
      setHighlightedContent(newsletter?.content || '');
      return;
    }

    const query = searchQuery.toLowerCase();
    let highlighted = newsletter.content;

    // Highlight in content
    const regex = new RegExp(`(${query})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark style="background-color: #fbbf24; padding: 2px 4px; border-radius: 3px;">$1</mark>');

    setHighlightedContent(highlighted);
  };

  const searchMatches = () => {
    if (!searchQuery.trim() || !newsletter) return 0;

    const query = searchQuery.toLowerCase();
    const titleMatches = (newsletter.title.toLowerCase().match(new RegExp(query, 'g')) || []).length;
    const contentMatches = (newsletter.content.toLowerCase().match(new RegExp(query, 'g')) || []).length;

    return titleMatches + contentMatches;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !newsletter) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Back to Newsletters
            </Link>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Newsletters
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Admin Panel
          </Link>
        </div>
      </nav>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {newsletter.featured && (
          <div className="mb-6 inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold">
            Featured
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{newsletter.title}</h1>

        <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <span>By {newsletter.author}</span>
          <span>{new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-blue-50 p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Search in this newsletter
          </label>
          <input
            type="text"
            placeholder="Search by heading or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <p className="mt-3 text-sm text-gray-600">
              Found <span className="font-semibold text-blue-600">{searchMatches()}</span> match{searchMatches() !== 1 ? 'es' : ''} for "{searchQuery}"
            </p>
          )}
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            {newsletter.excerpt}
          </p>
          <div 
            className="text-gray-800 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to All Newsletters
          </Link>
        </div>
      </article>
    </div>
  );
}
