'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNewsletterPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    contentMarkdown: '',
    status: 'draft',
    coverImage: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Check Auth on Load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!storedToken || !userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    
    if (user.role !== 'admin') {
      router.push('/'); 
      return;
    }

    setToken(storedToken);
  }, [router]);

  // 2. Auto-generate Slug from Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const autoSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, '');   
      
    setFormData(prev => ({ ...prev, title, slug: autoSlug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // --- FIX IS HERE: Removed '/api' from the path ---
      // Backend route is defined as router.post('/admin/newsletters') in newsletters.js
      // and mounted at root '/' in server.js
      const res = await fetch(`${apiUrl}/admin/newsletters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      // Handle non-JSON errors (like 404 HTML pages)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // If we get here, the URL is likely still wrong or the server crashed
        const text = await res.text();
        console.error("Non-JSON Response:", text);
        throw new Error(`Server returned a non-JSON response (${res.status}). Check console for details.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create newsletter');
      }

      // Success!
      router.push('/admin');

    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null; 

  return (
    <main className="min-h-screen bg-[var(--paper-bg)] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white border-2 border-[var(--ink-black)] p-8 shadow-lg">
        
        <h1 className="font-gothic text-4xl mb-6 text-[var(--brand-purple)]">Draft New Issue</h1>
        
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 mb-6 text-sm font-sans-accent">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-serif">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold font-sans-accent uppercase mb-2">Headline</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full p-3 border border-gray-300 focus:border-[var(--brand-purple)] outline-none"
                placeholder="e.g. The Cloud Jam Recap"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-sans-accent uppercase mb-2">URL Slug</label>
              <input 
                type="text" 
                required
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-600 font-mono text-sm"
                placeholder="auto-generated-slug"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-sans-accent uppercase mb-2">Short Excerpt</label>
            <textarea 
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              className="w-full p-3 border border-gray-300 focus:border-[var(--brand-purple)] outline-none"
              placeholder="A brief summary..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-sans-accent uppercase mb-2">Article Content (Markdown)</label>
            <textarea 
              rows={15}
              required
              value={formData.contentMarkdown}
              onChange={(e) => setFormData({...formData, contentMarkdown: e.target.value})}
              className="w-full p-3 border border-gray-300 focus:border-[var(--brand-purple)] outline-none font-mono text-sm"
              placeholder="# Section 1&#10;Write your content here..."
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
             <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={() => setFormData({...formData, status: 'draft'})}
                  />
                  <span className="text-sm">Save as Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={() => setFormData({...formData, status: 'published'})}
                  />
                  <span className="text-sm font-bold text-green-700">Publish Immediately</span>
                </label>
             </div>

             <button 
               type="submit" 
               disabled={loading}
               className="bg-[var(--brand-purple)] text-white px-8 py-3 font-sans-accent font-bold hover:bg-[var(--ink-black)] transition-colors disabled:opacity-50"
             >
               {loading ? 'Saving...' : 'Save Issue'}
             </button>
          </div>

        </form>
      </div>
    </main>
  );
}