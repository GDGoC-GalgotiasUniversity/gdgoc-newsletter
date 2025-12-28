'use client';

import Link from 'next/link';


interface Newsletter {
    title: string;
    contentMarkdown: string;
    publishedAt?: string;
    slug: string;
    coverImage?: string;
    excerpt?: string;
}

export default function NewsletterDetail({ newsletter }: { newsletter: Newsletter }) {
    // Format Date: "Saturday, December 27, 2025"
    const dateStr = newsletter.publishedAt
        ? new Date(newsletter.publishedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : 'Draft Preview';

    return (
        <article className="min-h-screen bg-[var(--paper-bg)] pb-24 pt-8">

            {/* --- ARTICLE HEADER --- */}
            <div className="container mx-auto px-4 max-w-3xl text-center mb-12">
                {/* Breadcrumb / Top Tag */}
                <div className="flex justify-center items-center gap-3 mb-6 font-sans-accent text-xs text-[var(--brand-purple)] tracking-widest">
                    <Link href="/" className="hover:underline">FRONT PAGE</Link>
                    <span>/</span>
                    <Link href="/newsletter" className="hover:underline">ARCHIVES</Link>
                    <span>/</span>
                    <span className="font-bold">ARTICLE</span>
                </div>

                {/* Headline */}
                <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 text-[var(--ink-black)]">
                    {newsletter.title}
                </h1>

                {/* Metadata Row */}
                <div className="border-t border-b border-[var(--border-color)] py-3 flex flex-col md:flex-row justify-between items-center text-sm font-sans-accent text-[var(--ink-gray)] gap-2">
                    <span>
                        <span className="font-bold text-[var(--ink-black)]">By GDGoC Team</span> &bull; Galgotias University
                    </span>
                    <span className="uppercase tracking-wider">
                        {dateStr}
                    </span>
                </div>

                {/* Excerpt / Short Description */}
                {newsletter.excerpt && (
                    <div className="mt-8 text-2xl md:text-3xl font-serif italic text-[var(--ink-black)] opacity-80 leading-relaxed border-l-4 border-[var(--brand-purple)] pl-6 py-2">
                        {newsletter.excerpt}
                    </div>
                )}
            </div>

            {/* --- CONTENT BODY --- */}
            <div className="container mx-auto px-4 max-w-3xl">

                {/* Optional Cover Image */}
                {newsletter.coverImage && (
                    <div className="w-full aspect-video relative mb-12 border-4 border-double border-[var(--ink-black)] p-1 bg-white">
                        <img
                            src={newsletter.coverImage}
                            alt={newsletter.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="text-center mt-2 font-sans-accent text-xs text-[var(--ink-gray)] italic">
                            Figure 1.1: Event visual documentation
                        </div>
                    </div>
                )}

                {/* Markdown Content */}
                <div className="prose prose-lg max-w-none font-serif text-[var(--ink-black)] leading-loose text-justify">

                    {/* The content itself with styles override via Prose classes to match previous aesthetic */}
                    <div
                        className="
                            prose-p:mb-6 prose-p:font-serif
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-[var(--ink-black)]
                            prose-h1:text-3xl prose-h1:text-[var(--brand-purple)] prose-h1:mt-12 prose-h1:mb-6 prose-h1:border-b prose-h1:border-[var(--brand-purple)] prose-h1:pb-2
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:uppercase prose-h3:tracking-wide prose-h3:mt-8 prose-h3:mb-2
                            prose-blockquote:border-l-4 prose-blockquote:border-[var(--brand-purple)] prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:text-[var(--brand-purple)] prose-blockquote:bg-[var(--paper-accent)] prose-blockquote:not-italic
                            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:marker:text-[var(--brand-purple)]
                            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:marker:font-bold
                            prose-a:text-[var(--brand-purple)] prose-a:underline prose-a:decoration-dotted hover:prose-a:decoration-solid prose-a:underline-offset-4
                            max-w-none
                        "
                        dangerouslySetInnerHTML={{ __html: newsletter.contentMarkdown }}
                    />

                    {/* End Sign-off */}
                    <div className="mt-16 flex justify-center">
                        <div className="text-center">
                            <div className="font-gothic text-4xl text-[var(--ink-black)] mb-2">***</div>
                            <p className="font-sans-accent text-xs text-[var(--ink-gray)] uppercase">End of Transmission</p>
                        </div>
                    </div>

                </div>
            </div>

        </article >
    );
}