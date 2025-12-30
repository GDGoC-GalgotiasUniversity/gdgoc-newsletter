'use client';

import { format } from 'date-fns';

interface NewsletterPreviewProps {
  title: string;
  excerpt: string;
  coverImage: string;
  contentHtml: string;
  status: 'draft' | 'published';
}

export default function NewsletterPreview({
  title,
  excerpt,
  coverImage,
  contentHtml,
  status,
}: NewsletterPreviewProps) {
  const readTime = Math.ceil(contentHtml.split(/\s+/).length / 200);

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 bg-[var(--paper-accent)] border-2 border-[var(--brand-purple)] rounded-lg">
        <div>
          <h3 className="font-bold text-[var(--brand-purple)]">Newsletter Preview</h3>
          <p className="text-xs text-[var(--ink-gray)]">This is how your newsletter will appear to readers</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          status === 'published'
            ? 'bg-green-100 text-green-800'
            : 'bg-orange-100 text-orange-800'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Preview Container */}
      <div className="bg-white border-2 border-[var(--ink-black)] rounded-lg overflow-hidden shadow-lg">
        {/* Navbar */}
        <nav className="sticky top-0 z-10 bg-[var(--paper-bg)]/80 backdrop-blur-md border-b border-[#e7e5e4] px-6 py-4">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div className="text-sm font-sans font-bold tracking-widest text-[#57534e] uppercase">
              ← Back to Archives
            </div>
            <div className="flex items-center gap-3 text-xs font-sans text-[#a8a29e]">
              <span>{format(new Date(), 'MMMM d, yyyy')}</span>
              <span>•</span>
              <span className="font-bold text-[#7e22ce]">{readTime} min read</span>
            </div>
          </div>
        </nav>

        {/* Article Content */}
        <article className="min-h-screen bg-[var(--paper-bg)] text-[#1c1917] font-serif pb-24">
          <main className="max-w-3xl mx-auto px-6 mt-12">
            {/* Header */}
            <header className="mb-12 text-center">
              {coverImage && (
                <div className="mb-10 rounded-xl overflow-hidden shadow-lg border border-[#e7e5e4]">
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
              )}

              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#1c1917]">
                {title || 'Newsletter Title'}
              </h1>

              <p className="text-xl text-[#78716b] mb-8 leading-relaxed max-w-2xl mx-auto">
                {excerpt || 'Newsletter excerpt will appear here...'}
              </p>

              <div className="flex justify-center items-center gap-4 text-sm text-[#a8a29e] font-sans">
                <span>By GDGoC Team</span>
                <span>•</span>
                <span>{format(new Date(), 'MMMM d, yyyy')}</span>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {contentHtml ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#1c1917] prose-p:text-[#1c1917] prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-[#1c1917] prose-em:text-[#78716b]"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              ) : (
                <div className="text-center py-12 text-[#a8a29e]">
                  <p>Start writing your newsletter content...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-[#e7e5e4] text-center text-sm text-[#a8a29e]">
              <p>© {new Date().getFullYear()} Google Developer Groups On Campus. All rights reserved.</p>
            </footer>
          </main>
        </article>
      </div>

      {/* Preview Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-semibold mb-1">💡 Preview Tip:</p>
        <p>This preview shows how your newsletter will look when published. Scroll down to see the full content.</p>
      </div>
    </div>
  );
}
