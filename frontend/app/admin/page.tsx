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
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    featured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user is authenticated (either user or admin)
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        setIsAuthenticated(true);
        fetchNewsletters();
        return;
      }

      // Check if admin token exists
      const adminRes = await fetch('/api/newsletters?limit=1');
      if (adminRes.ok) {
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const insertTemplate = (template: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n' + template
    }));
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
        setFormData({ title: '', content: '', excerpt: '', author: '', featured: false });
        setShowForm(false);
        setActiveTab('edit');
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
          <div className="bg-black rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Newsletter</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Newsletter title"
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the newsletter"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-4">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-900"
                  />
                  Mark as Featured
                </label>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-700">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-4 py-2 font-medium border-b-2 transition ${
                      activeTab === 'edit'
                        ? 'border-blue-600 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 font-medium border-b-2 transition ${
                      activeTab === 'preview'
                        ? 'border-blue-600 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === 'edit' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Content (HTML + CSS)
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Enter HTML and CSS for your artistic newsletter..."
                      rows={15}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      required
                    />
                  </div>

                  {/* Quick Templates */}
                  <div>
                    <p className="text-sm font-medium text-white mb-3">Quick Templates:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => insertTemplate(`<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px; color: white; text-align: center;">
  <h1 style="font-size: 32px; margin: 0; font-weight: bold;">Your Title Here</h1>
  <p style="font-size: 16px; margin-top: 10px;">Your content here</p>
</div>`)}
                        className="px-3 py-2 bg-purple-900 text-purple-300 rounded text-sm hover:bg-purple-800 transition text-left"
                      >
                        Gradient Card
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTemplate(`<div style="border-left: 4px solid #3b82f6; padding: 20px; background: #1e3a8a; border-radius: 5px; color: white;">
  <h2 style="color: #60a5fa; margin-top: 0;">Important Notice</h2>
  <p style="color: #93c5fd;">Your message here</p>
</div>`)}
                        className="px-3 py-2 bg-blue-900 text-blue-300 rounded text-sm hover:bg-blue-800 transition text-left"
                      >
                        Info Box
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTemplate(`<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
  <div style="background: #1f2937; padding: 20px; border-radius: 8px; text-align: center; color: white;">
    <h3 style="margin-top: 0;">Column 1</h3>
    <p>Content here</p>
  </div>
  <div style="background: #1f2937; padding: 20px; border-radius: 8px; text-align: center; color: white;">
    <h3 style="margin-top: 0;">Column 2</h3>
    <p>Content here</p>
  </div>
</div>`)}
                        className="px-3 py-2 bg-green-900 text-green-300 rounded text-sm hover:bg-green-800 transition text-left"
                      >
                        Two Column
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTemplate(`<div style="background: #78350f; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; text-align: center; color: white;">
  <h2 style="color: #fbbf24; margin-top: 0;">⚠️ Alert</h2>
  <p style="color: #fcd34d;">Your alert message here</p>
</div>`)}
                        className="px-3 py-2 bg-yellow-900 text-yellow-300 rounded text-sm hover:bg-yellow-800 transition text-left"
                      >
                        Alert Box
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div>
                  <p className="text-sm font-medium text-white mb-3">Preview:</p>
                  <div
                    className="border border-gray-700 rounded-lg p-6 bg-gray-900 overflow-auto max-h-96"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </div>
              )}

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
        <div className="bg-black rounded-lg shadow-md overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Newsletters ({newsletters.length})
            </h2>
          </div>

          {loading ? (
            <div className="px-8 py-12 text-center">
              <p className="text-gray-400">Loading newsletters...</p>
            </div>
          ) : newsletters.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <p className="text-gray-400">No newsletters yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white">
                      Title
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white">
                      Author
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white">
                      Published
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white">
                      Featured
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {newsletters.map((newsletter) => (
                    <tr key={newsletter._id} className="border-b border-gray-700 hover:bg-gray-900">
                      <td className="px-8 py-4">
                        <Link
                          href={`/newsletter/${newsletter.slug}`}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          {newsletter.title}
                        </Link>
                      </td>
                      <td className="px-8 py-4 text-gray-300">{newsletter.author}</td>
                      <td className="px-8 py-4 text-gray-300">
                        {new Date(newsletter.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4">
                        {newsletter.featured ? (
                          <span className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
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
