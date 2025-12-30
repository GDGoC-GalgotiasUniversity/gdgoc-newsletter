'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useMemo } from 'react';
import ImageCarousel from './ImageCarousel';

interface Newsletter {
  _id: string;
  title: string;
  slug: string;
  contentHtml?: string;
  contentMarkdown?: string;
  publishedAt?: string;
  createdAt: string;
  coverImage?: string;
  gallery?: string[];
  excerpt?: string;
}

export default function NewsletterDetail({ newsletter }: { newsletter: Newsletter }) {
  const content = newsletter.contentHtml || newsletter.contentMarkdown || '';
  const date = newsletter.publishedAt || newsletter.createdAt;

  // Debug logging
  console.log('NewsletterDetail received newsletter:', newsletter);
  console.log('Gallery field:', newsletter.gallery);

  // Combine cover image and gallery images for carousel
  // Cover image appears first if it exists
  const carouselImages = useMemo(() => {
    const images: string[] = [];
    if (newsletter.coverImage) {
      images.push(newsletter.coverImage);
    }
    if (newsletter.gallery && newsletter.gallery.length > 0) {
      images.push(...newsletter.gallery);
    }
    return images;
  }, [newsletter.coverImage, newsletter.gallery]);

  // --- Feature 1: Calculate Reading Time ---
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // --- Feature 2: Share Functions ---
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = `Check out this newsletter: ${newsletter.title}\n\nRead here: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <article className="min-h-screen bg-[var(--paper-bg)] text-[#1c1917] font-serif pb-24">

      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-[var(--paper-bg)]/80 backdrop-blur-md border-b border-[#e7e5e4] px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link
            href="/newsletter"
            className="text-sm font-sans font-bold tracking-widest text-[#57534e] hover:text-[#7e22ce] transition-colors uppercase"
          >
            ← Back to Archives
          </Link>
          <div className="flex items-center gap-3 text-xs font-sans text-[#a8a29e]">
            <span>{format(new Date(date), 'MMMM d, yyyy')}</span>
            <span>•</span>
            <span className="font-bold text-[#7e22ce]">{readTime} min read</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 mt-12">
        <header className="mb-12 text-center">
          {/* Unified carousel - displays cover image (first) + gallery images */}
          {carouselImages.length > 0 && (
            <div className="mb-10">
              <ImageCarousel images={carouselImages} />
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-black text-[#1c1917] mb-6 leading-tight">
            {newsletter.title}
          </h1>

          {newsletter.excerpt && (
            <p className="text-xl text-[#57534e] italic leading-relaxed max-w-2xl mx-auto">
              {newsletter.excerpt}
            </p>
          )}

          <div className="mt-8 flex justify-center">
            <div className="h-1 w-24 bg-[#7e22ce] rounded-full"></div>
          </div>
        </header>

        {/* Content Area */}
        <div className="
          prose prose-lg prose-stone max-w-none
          prose-headings:font-bold prose-headings:text-[#1c1917]
          prose-p:leading-loose prose-p:text-[#44403c]
          prose-a:text-[#7e22ce] prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-[#7e22ce] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-black/5 prose-blockquote:py-2 prose-blockquote:pr-4
          prose-img:rounded-xl prose-img:shadow-md
          prose-li:marker:text-[#7e22ce]
        ">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        {/* --- Share Section --- */}
        <div className="mt-20 pt-10 border-t border-[#e7e5e4] flex flex-col items-center gap-4">
          <p className="font-sans text-sm text-[#a8a29e] tracking-widest uppercase">
            Share this issue
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleCopyLink}
              className="px-6 py-2 rounded-full border border-[#e7e5e4] hover:border-[#7e22ce] hover:text-[#7e22ce] transition-colors font-sans text-sm font-bold bg-white/50"
            >
              Copy Link
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="px-6 py-2 rounded-full border border-[#e7e5e4] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors font-sans text-sm font-bold bg-white/50"
            >
              WhatsApp
            </button>
          </div>
        </div>

      </main>
    </article>
  );
}