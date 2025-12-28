'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

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
                    
                    {/* The content itself with styles override */}
                    <ReactMarkdown
                        components={{
                            // Override Paragraphs for that newspaper look
                            p: ({node, ...props}) => <p className="mb-6" {...props} />,
                            
                            // Override Headings
                            h1: ({node, ...props}) => <h2 className="text-3xl font-bold text-[var(--brand-purple)] mt-12 mb-6 font-serif border-b border-[var(--brand-purple)] pb-2" {...props} />,
                            h2: ({node, ...props}) => <h3 className="text-2xl font-bold text-[var(--ink-black)] mt-10 mb-4 font-serif" {...props} />,
                            h3: ({node, ...props}) => <h4 className="text-xl font-bold text-[var(--ink-black)] mt-8 mb-2 font-serif uppercase tracking-wide" {...props} />,
                            
                            // Override Blockquotes (The "Pull Quote" style)
                            blockquote: ({node, ...props}) => (
                                <blockquote className="border-l-4 border-[var(--brand-purple)] pl-6 py-2 my-8 italic text-2xl text-[var(--brand-purple)] bg-[var(--paper-accent)] font-serif">
                                    {props.children}
                                </blockquote>
                            ),

                            // Override Lists
                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 marker:text-[var(--brand-purple)]" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 marker:font-bold" {...props} />,
                            
                            // Override Links
                            a: ({node, ...props}) => <a className="text-[var(--brand-purple)] underline decoration-dotted hover:decoration-solid underline-offset-4" {...props} />,
                        }}
                    >
                        {newsletter.contentMarkdown}
                    </ReactMarkdown>

                    {/* End Sign-off */}
                    <div className="mt-16 flex justify-center">
                        <div className="text-center">
                            <div className="font-gothic text-4xl text-[var(--ink-black)] mb-2">***</div>
                            <p className="font-sans-accent text-xs text-[var(--ink-gray)] uppercase">End of Transmission</p>
                        </div>
                    </div>

                </div>
            </div>
            
        </article>
    );
}