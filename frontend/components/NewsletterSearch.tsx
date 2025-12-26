'use client';

import { useState, useMemo } from 'react';
import NewsletterGrid from './NewsletterGrid';

interface Newsletter {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: string;
  createdAt: string;
}

interface NewsletterSearchProps {
  newsletters: Newsletter[];
}

export default function NewsletterSearch({ newsletters }: NewsletterSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNewsletters = useMemo(() => {
    if (!searchQuery.trim()) {
      return newsletters;
    }

    const query = searchQuery.toLowerCase();

    return newsletters.filter((newsletter) => {
      const title = newsletter.title.toLowerCase();
      const excerpt = newsletter.excerpt.toLowerCase();
      const date = new Date(newsletter.publishedAt || newsletter.createdAt)
        .toISOString()
        .split('T')[0];

      return (
        title.includes(query) ||
        excerpt.includes(query) ||
        date.includes(query)
      );
    });
  }, [searchQuery, newsletters]);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
            placeholder="Search ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--gray-400)] hover:text-[var(--gray-600)] transition"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-[var(--gray-500)] mt-2">
            Found {filteredNewsletters.length} newsletter{filteredNewsletters.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Newsletter Grid */}
      <NewsletterGrid newsletters={filteredNewsletters} />
    </>
  );
}
