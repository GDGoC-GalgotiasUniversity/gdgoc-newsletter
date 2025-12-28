'use client';

import { useState, useRef } from 'react';

interface NewsletterEditorProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export default function NewsletterEditor({ onSubmit, initialData, isLoading }: NewsletterEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    contentHtml: initialData?.contentHtml || initialData?.contentMarkdown || '',
    template: initialData?.template || 'default',
    status: initialData?.status || 'draft',
    coverImage: initialData?.coverImage || '',
  });

  const editorRef = useRef<HTMLDivElement>(null);

  const templates = {
    default: `<h2 style="color: #6b4c9a; font-size: 28px; margin-bottom: 20px;">Newsletter Title</h2>
<p style="color: #555; line-height: 1.8; margin-bottom: 15px;">Welcome to our newsletter! Share your latest updates and news with your community.</p>
<hr style="border: none; border-top: 2px solid #d4a574; margin: 30px 0;">
<h3 style="color: #6b4c9a; font-size: 20px; margin-top: 25px; margin-bottom: 15px;">Section Title</h3>
<p style="color: #555; line-height: 1.8;">Add your content here. You can include multiple sections, images, and links.</p>`,

    'event-recap': `<div style="background: linear-gradient(135deg, #6b4c9a 0%, #d4a574 100%); padding: 30px; border-radius: 10px; color: white; margin-bottom: 30px;">
  <h2 style="margin: 0; font-size: 32px; margin-bottom: 10px;">Event Recap</h2>
  <p style="margin: 0; font-size: 16px; opacity: 0.9;">A summary of our amazing event</p>
</div>
<h3 style="color: #6b4c9a; font-size: 22px; margin-bottom: 15px;">Highlights</h3>
<ul style="color: #555; line-height: 2; margin-bottom: 20px;">
  <li>Amazing keynote speakers</li>
  <li>Interactive workshops</li>
  <li>Networking opportunities</li>
  <li>Great food and fun</li>
</ul>
<p style="color: #555; line-height: 1.8; font-style: italic;">Thank you to everyone who attended!</p>`,

    workshop: `<div style="border-left: 4px solid #d4a574; padding-left: 20px; margin-bottom: 30px;">
  <h2 style="color: #6b4c9a; margin: 0 0 10px 0;">Workshop: Your Topic Here</h2>
  <p style="color: #8b6ba8; margin: 0; font-size: 14px;">Date • Time • Location</p>
</div>
<h3 style="color: #6b4c9a; font-size: 20px; margin-bottom: 15px;">What You'll Learn</h3>
<ol style="color: #555; line-height: 2; margin-bottom: 20px;">
  <li>Introduction to the topic</li>
  <li>Core concepts and principles</li>
  <li>Practical hands-on experience</li>
  <li>Q&A and discussion</li>
</ol>
<p style="background: #f5e6d3; padding: 15px; border-radius: 8px; color: #6b4c9a;"><strong>Register now!</strong> Limited seats available.</p>`,

    announcement: `<div style="background: #fef3e6; border: 2px solid #d4a574; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
  <h2 style="color: #6b4c9a; margin-top: 0; font-size: 28px;">📢 Important Announcement</h2>
  <p style="color: #555; line-height: 1.8; font-size: 16px;">We're excited to share some big news with our community!</p>
</div>
<h3 style="color: #6b4c9a; font-size: 20px; margin-bottom: 15px;">What's New</h3>
<p style="color: #555; line-height: 1.8; margin-bottom: 15px;">Describe the announcement in detail. Explain what it means for your community and what actions they should take.</p>
<p style="color: #555; line-height: 1.8;"><strong>Next Steps:</strong> Here's what you need to do next...</p>`
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Upload failed');

      // Full URL for the image
      const fullImageUrl = `${apiUrl}${data.imageUrl}`;

      setFormData(prev => ({
        ...prev,
        coverImage: fullImageUrl
      }));

    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTemplate = e.target.value as keyof typeof templates;
    setFormData(prev => ({
      ...prev,
      template: selectedTemplate,
      contentHtml: templates[selectedTemplate],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Auto-generate slug from title if title is being changed
    if (name === 'title' && !initialData) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generatedSlug,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      contentHtml: e.target.value,
    }));
  };

  const insertTag = (tag: string, closeTag?: string) => {
    const textarea = document.querySelector('textarea[name="contentHtml"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.contentHtml.substring(start, end);
    const close = closeTag || tag;

    const newContent =
      formData.contentHtml.substring(0, start) +
      `<${tag}>${selectedText}</${close}>` +
      formData.contentHtml.substring(end);

    setFormData(prev => ({
      ...prev,
      contentHtml: newContent,
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + tag.length + 2;
      textarea.selectionEnd = start + tag.length + 2 + selectedText.length;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate slug format
    if (!formData.slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
      alert('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!formData.contentHtml.trim()) {
      alert('Content is required');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Section - Title, Slug, Excerpt, Cover */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6b4c9a' }}>
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Newsletter title"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
            style={{ borderColor: '#d4a574', '--tw-ring-color': '#6b4c9a' } as any}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6b4c9a' }}>
            Slug (URL-friendly)
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="newsletter-slug"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
            style={{ borderColor: '#d4a574', '--tw-ring-color': '#6b4c9a' } as any}
            required
          />
          <p className="text-xs mt-1" style={{ color: '#8b6ba8' }}>
            {formData.slug ? (
              formData.slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) ? (
                <span style={{ color: '#22863a' }}>✓ Valid slug</span>
              ) : (
                <span style={{ color: '#cb2431' }}>✗ Invalid: use lowercase, numbers, and hyphens only</span>
              )
            ) : (
              'Auto-generated from title'
            )}
          </p>
        </div>
      </div>

      {/* Excerpt and Template */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6b4c9a' }}>
            Short Description
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            placeholder="Brief summary of the newsletter"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
            style={{ borderColor: '#d4a574', '--tw-ring-color': '#6b4c9a' } as any}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6b4c9a' }}>
            Template
          </label>
          <select
            name="template"
            value={formData.template}
            onChange={handleTemplateChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition mb-3"
            style={{ borderColor: '#d4a574', '--tw-ring-color': '#6b4c9a' } as any}
          >
            <option value="default">Default</option>
            <option value="event-recap">Event Recap</option>
            <option value="workshop">Workshop</option>
            <option value="announcement">Announcement</option>
          </select>

          <label className="block text-sm font-semibold mb-2" style={{ color: '#6b4c9a' }}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
            style={{ borderColor: '#d4a574', '--tw-ring-color': '#6b4c9a' } as any}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#6b4c9a' }}>
          Cover Image URL
        </label>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                disabled={uploading}
              />
              {uploading && <span className="text-sm text-gray-500 self-center">Uploading...</span>}
            </div>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              placeholder="or paste image URL"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
              style={{ borderColor: '#d4a574', '--tw-ring-color': '#6b4c9a' } as any}
            />
            <p className="text-xs mt-1" style={{ color: '#8b6ba8' }}>Upload an image or paste a URL</p>
          </div>
          {formData.coverImage && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border" style={{ borderColor: '#d4a574' }}>
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e5d5c8" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%236b4c9a" font-size="12"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Editor and Preview Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Editor */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6b4c9a' }}>
            Content (HTML)
          </label>

          {/* Formatting Toolbar */}
          <div className="mb-3 p-3 rounded-lg flex flex-wrap gap-2" style={{ backgroundColor: '#f5e6d3' }}>
            <button
              type="button"
              onClick={() => insertTag('h2', 'h2')}
              className="px-2 py-1 border rounded text-xs hover:opacity-80 transition"
              style={{ backgroundColor: '#fff', borderColor: '#d4a574', color: '#6b4c9a' }}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertTag('h3', 'h3')}
              className="px-2 py-1 border rounded text-xs hover:opacity-80 transition"
              style={{ backgroundColor: '#fff', borderColor: '#d4a574', color: '#6b4c9a' }}
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => insertTag('p', 'p')}
              className="px-2 py-1 border rounded text-xs hover:opacity-80 transition"
              style={{ backgroundColor: '#fff', borderColor: '#d4a574', color: '#6b4c9a' }}
            >
              P
            </button>
            <button
              type="button"
              onClick={() => insertTag('strong', 'strong')}
              className="px-2 py-1 border rounded text-xs hover:opacity-80 transition font-bold"
              style={{ backgroundColor: '#fff', borderColor: '#d4a574', color: '#6b4c9a' }}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertTag('em', 'em')}
              className="px-2 py-1 border rounded text-xs hover:opacity-80 transition italic"
              style={{ backgroundColor: '#fff', borderColor: '#d4a574', color: '#6b4c9a' }}
            >
              I
            </button>
            <button
              type="button"
              onClick={() => insertTag('ul', 'ul')}
              className="px-2 py-1 border rounded text-xs hover:opacity-80 transition"
              style={{ backgroundColor: '#fff', borderColor: '#d4a574', color: '#6b4c9a' }}
            >
              UL
            </button>
            <button
              type="button"
              onClick={() => insertTag('li', 'li')}
              className="px-2 py-1 border rounded text-xs hover:opacity-80 transition"
              style={{ backgroundColor: '#fff', borderColor: '#d4a574', color: '#6b4c9a' }}
            >
              LI
            </button>
            <button
              type="button"
              onClick={() => insertTag('a href=""', 'a')}
              className="px-2 py-1 border rounded text-xs hover:opacity-80 transition"
              style={{ backgroundColor: '#fff', borderColor: '#d4a574', color: '#6b4c9a' }}
            >
              Link
            </button>
          </div>

          <textarea
            name="contentHtml"
            value={formData.contentHtml}
            onChange={handleEditorChange}
            placeholder="Enter HTML content here..."
            rows={16}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm transition"
            style={{ borderColor: '#d4a574', '--tw-ring-color': '#6b4c9a' } as any}
            required
          />
          <p className="text-xs mt-1" style={{ color: '#8b6ba8' }}>HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, etc.</p>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6b4c9a' }}>
            Live Preview
          </label>
          <div
            className="p-6 border rounded-lg prose prose-sm max-w-none overflow-y-auto"
            style={{ borderColor: '#d4a574', backgroundColor: '#fafaf8', height: '500px' }}
            dangerouslySetInnerHTML={{ __html: formData.contentHtml }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50 hover:shadow-lg"
          style={{ backgroundColor: '#6b4c9a' }}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Newsletter' : 'Create Newsletter'}
        </button>
      </div>
    </form >
  );
}
