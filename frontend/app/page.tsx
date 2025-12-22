'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Newsletter {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  featured: boolean;
}

export default function Home() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNewsletters, setFilteredNewsletters] = useState<Newsletter[]>([]);

  useEffect(() => {
    fetchNewsletters();
  }, [page]);

  useEffect(() => {
    filterNewsletters();
  }, [searchQuery, newsletters]);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/newsletters?page=${page}&limit=6`);
      const data = await res.json();
      if (data.success) {
        setNewsletters(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNewsletters = () => {
    if (!searchQuery.trim()) {
      setFilteredNewsletters(newsletters);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = newsletters.filter(
      (newsletter) =>
        newsletter.title.toLowerCase().includes(query) ||
        newsletter.excerpt.toLowerCase().includes(query) ||
        newsletter.author.toLowerCase().includes(query)
    );
    setFilteredNewsletters(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">GDG Newsletter</h1>
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Admin Panel
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">GDG On Campus Newsletter</h2>
          <p className="text-xl text-blue-100 mb-8">
            Stay updated with the latest news and events from Galgotias University
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search newsletters by title, content, or author..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </section>

      {/* Newsletters Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading newsletters...</p>
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchQuery ? 'No newsletters match your search.' : 'No newsletters available yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {filteredNewsletters.length} newsletter{filteredNewsletters.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNewsletters.map((newsletter) => (
                <Link
                  key={newsletter._id}
                  href={`/newsletter/${newsletter.slug}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {newsletter.featured && (
                      <div className="bg-yellow-400 text-yellow-900 px-4 py-2 text-sm font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                        {newsletter.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {newsletter.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{newsletter.author}</span>
                        <span>
                          {new Date(newsletter.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !searchQuery && (
              <div className="flex justify-center gap-4 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
