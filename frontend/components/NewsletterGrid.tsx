'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import AnimatedLogo from './AnimatedLogo';

interface Newsletter {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt: string;
}

interface NewsletterGridProps {
  newsletters: Newsletter[];
}

const colorMap: Record<string, string> = {
  blue: 'var(--google-blue)',
  red: 'var(--google-red)',
  yellow: 'var(--google-yellow)',
  green: 'var(--google-green)',
};

const colors = ['blue', 'red', 'yellow', 'green'];

export default function NewsletterGrid({ newsletters }: NewsletterGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (id: string) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  return (
    <div className="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsletters.length > 0 ? (
        newsletters.map((newsletter, index) => (
          <Link
            key={newsletter._id}
            href={`/newsletter/${newsletter.slug}`}
            className="card group block overflow-hidden effect-scrunch h-full border-2 border-transparent hover:border-[#6F4E37] rounded-xl transition-all duration-300 hover:shadow-lg p-2 hover:bg-[#F5E6D3]"
          >
            <div className="relative h-48 w-full overflow-hidden bg-[var(--gray-200)] rounded-lg">
              {newsletter.coverImage ? (
                <img
                  src={newsletter.coverImage}
                  alt={newsletter.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={() => handleImageError(newsletter._id)}
                />
              ) : !imageErrors.has(newsletter._id) ? (
                <Image
                  src={`https://images.unsplash.com/photo-${1540575467063 + (index % 10)}?auto=format&fit=crop&w=800&q=80`}
                  alt={newsletter.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  onError={() => handleImageError(newsletter._id)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#6b4c9a] to-[#d4a574] flex items-center justify-center">
                  <span className="text-white text-sm">No image</span>
                </div>
              )}
            </div>
            {/* Color Bar */}
            <div
              className="h-1"
              style={{ backgroundColor: colorMap[colors[index % colors.length]] }}
            />

            <div className="p-6">
              <p className="text-sm text-[var(--gray-500)] mb-2">
                {new Date(newsletter.publishedAt || newsletter.createdAt).toISOString().split('T')[0]}
              </p>
              <hr className="border-t border-[#6F4E37] mb-3" />
              <h3 className="group-hover:text-[var(--google-blue)] transition mb-3">
                {newsletter.title}
              </h3>
              <p className="text-[var(--gray-700)] text-sm">{newsletter.excerpt}</p>

              <div className="mt-4 flex items-center text-[var(--google-blue)] text-sm font-medium">
                Read more
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-2 text-center py-12">
          <div className="mb-4">
            <AnimatedLogo className="w-12 h-12" />
          </div>
          <h3 className="text-xl mb-2">No newsletters yet</h3>
          <p className="text-[var(--gray-500)]">Check back soon for updates from GDGoC!</p>
        </div>
      )}
    </div>
  );
}
