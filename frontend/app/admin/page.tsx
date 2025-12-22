'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Newsletter {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  featured: boolean;
}

export default function AdminPanel() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if token exists in cookies by making a request
      const res = await fetch('/api/newsletters?limit=1');
      if (res.ok) {
        setIsAuthenticated(true);
        fetchNewsletters();
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/newsletters?limit=100');
      const data = await res.json();
      if (data.success) {
        setNewsletters(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.excerpt || !formData.author) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert('Newsletter created successfully!');
        setFormData({ title: '', content: '', excerpt: '', author: '' });
        setShowForm(false);
        fetchNewsletters();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to create newsletter');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      const res = await fetch(`/api/newsletters/${slug}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert('Newsletter deleted successfully!');
        fetchNewsletters();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to delete newsletter');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              ← Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create Newsletter Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {showForm ? 'Cancel' : '+ Create Newsletter'}
          </button>
        </div>

        {/* Create Newsletter Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Newsletter</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Newsletter title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the newsletter"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Full newsletter content"
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Newsletter'}
              </button>
            </form>
          </div>
        )}

        {/* Newsletters List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Newsletters ({newsletters.length})
            </h2>
          </div>

          {loading ? (
            <div className="px-8 py-12 text-center">
              <p className="text-gray-600">Loading newsletters...</p>
            </div>
          ) : newsletters.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <p className="text-gray-600">No newsletters yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Author
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Published
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {newsletters.map((newsletter) => (
                    <tr key={newsletter._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-8 py-4">
                        <Link
                          href={`/newsletter/${newsletter.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {newsletter.title}
                        </Link>
                      </td>
                      <td className="px-8 py-4 text-gray-600">{newsletter.author}</td>
                      <td className="px-8 py-4 text-gray-600">
                        {new Date(newsletter.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4">
                        <button
                          onClick={() => handleDelete(newsletter.slug)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
