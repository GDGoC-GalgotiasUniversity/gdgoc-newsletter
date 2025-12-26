'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import AnimatedLogo from './AnimatedLogo';

interface NewsletterDetailProps {
  newsletter: any;
}

export default function NewsletterDetail({ newsletter }: NewsletterDetailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const matchCount = useMemo(() => {
    if (!searchQuery.trim() || !contentRef.current) return 0;
    
    const text = contentRef.current.innerText.toLowerCase();
    const query = searchQuery.toLowerCase();
    const regex = new RegExp(query, 'g');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }, [searchQuery]);

  useEffect(() => {
    if (!contentRef.current || !searchQuery.trim()) {
      // Reset to original content
      contentRef.current!.innerHTML = newsletter.contentMarkdown;
      return;
    }

    // Create a temporary container to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = newsletter.contentMarkdown;

    // Function to highlight text in nodes
    const highlightTextNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        const query = searchQuery;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        
        if (regex.test(text)) {
          const span = document.createElement('span');
          span.innerHTML = text.replace(
            regex,
            '<mark style="background-color: #fbbf24; padding: 2px 4px; border-radius: 2px;">$1</mark>'
          );
          node.parentNode?.replaceChild(span, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Don't highlight inside script or style tags
        if ((node as Element).tagName !== 'SCRIPT' && (node as Element).tagName !== 'STYLE') {
          Array.from(node.childNodes).forEach(highlightTextNodes);
        }
      }
    };

    highlightTextNodes(temp);
    contentRef.current!.innerHTML = temp.innerHTML;
  }, [searchQuery, newsletter.contentMarkdown]);

  return (
    <main className="py-12">
      <div className="container">
        {/* Back Link */}
        <Link
          href="/newsletter"
          className="inline-flex items-center text-[var(--google-blue)] hover:underline mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <article className="max-w-3xl">
          {/* Header */}
          <header className="mb-10 pb-8 border-b border-[var(--gray-200)]">
            {/* Video Logo */}
            <div className="mb-6">
              <AnimatedLogo className="w-12 h-12" />
            </div>

            <h1 className="text-4xl mb-4">{newsletter.title}</h1>

            <div className="flex items-center gap-4 text-[var(--gray-500)]">
              <span>{new Date(newsletter.publishedAt || newsletter.createdAt).toISOString().split('T')[0]}</span>
              <span>•</span>
              <span>By GDGoC Team</span>
            </div>
          </header>

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
                placeholder="Search keywords or headings in this newsletter..."
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
                Found {matchCount} match{matchCount !== 1 ? 'es' : ''} for "{searchQuery}"
              </p>
            )}
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: newsletter.contentMarkdown }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-[var(--gray-200)]">
            <p className="text-[var(--gray-500)] text-sm mb-4">Share this newsletter</p>
            <div className="flex gap-3">
              <button className="btn-secondary text-sm py-2 px-4">
                Twitter
              </button>
              <button className="btn-secondary text-sm py-2 px-4">
                LinkedIn
              </button>
              <button className="btn-secondary text-sm py-2 px-4">
                Copy Link
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
