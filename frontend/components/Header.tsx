'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        /* 1. Main Background changed to var(--paper-bg) to match the rest of the site */
        <header className="w-full bg-[var(--paper-bg)] text-[var(--ink-black)] font-serif border-b-4 border-double border-[var(--ink-black)]">
            
            {/* === TIER 1: UTILITY BAR === */}
            <div className="border-b border-[var(--ink-gray)]/30">
                <div className="max-w-6xl mx-auto px-4 py-1 flex justify-between items-center text-[10px] md:text-xs font-sans-accent tracking-widest uppercase text-[var(--ink-gray)]">
                    <div>{today}</div>
                    <div>
                        {user ? (
                            <div className="flex gap-4 items-center">
                                <span>Ed. {user.name}</span>
                                <button onClick={logout} className="hover:text-[var(--brand-purple)] underline">Sign Out</button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Link href="/login" className="hover:text-[var(--brand-purple)]">Log In</Link>
                                <Link href="/register" className="hover:text-[var(--brand-purple)]">Subscribe</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* === TIER 2: THE MASTHEAD === */}
            <div className="py-8 text-center px-4">
                <div className="relative inline-block">
                    {/* Decorative Side Text */}
                    <span className="hidden md:block absolute -left-24 top-1/2 -translate-y-1/2 font-sans-accent text-[10px] tracking-widest -rotate-90 text-[var(--ink-gray)] origin-center">
                        EST. 2025
                    </span>
                    
                    <Link href="/" className="group block">
                        {/* 2. Title Changed back to "Google Developer Groups" */}
                        <h1 className="font-gothic text-5xl md:text-7xl lg:text-8xl leading-none text-[var(--brand-purple)] group-hover:opacity-90 transition-opacity duration-300">
                            Google Developer Groups
                        </h1>
                        
                        <div className="flex items-center justify-center gap-3 mt-3">
                             <div className="h-[1px] bg-[var(--ink-black)] w-12 hidden md:block"></div>
                             <p className="font-serif italic text-lg md:text-xl text-[var(--ink-gray)]">
                                On Campus Galgotias University
                             </p>
                             <div className="h-[1px] bg-[var(--ink-black)] w-12 hidden md:block"></div>
                        </div>
                    </Link>

                    <span className="hidden md:block absolute -right-24 top-1/2 -translate-y-1/2 font-sans-accent text-[10px] tracking-widest rotate-90 text-[var(--ink-gray)] origin-center">
                        VOL. I
                    </span>
                </div>
            </div>

            {/* === TIER 3: NAVIGATION === */}
            {/* 3. Sticky Nav Background changed from white to var(--paper-bg) */}
            <div className="border-t border-b border-[var(--ink-black)] py-2 bg-[var(--paper-bg)] sticky top-0 z-50 shadow-sm">
                <nav className="max-w-6xl mx-auto flex justify-center flex-wrap gap-6 md:gap-12 text-xs md:text-sm font-sans-accent font-bold tracking-widest uppercase">
                    
                    <Link href="/" className="hover:text-[var(--brand-purple)] hover:underline decoration-2 underline-offset-4">
                        Front Page
                    </Link>
                    
                    <Link href="/newsletter" className="hover:text-[var(--brand-purple)] hover:underline decoration-2 underline-offset-4">
                        Archives
                    </Link>
                    
                    <Link href="/about" className="hover:text-[var(--brand-purple)] hover:underline decoration-2 underline-offset-4">
                        About Us
                    </Link>

                    {user?.role === 'admin' && (
                        <Link href="/admin" className="text-red-700 hover:text-red-900 bg-red-50 px-2 rounded-sm border border-red-100">
                            Editor's Desk
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}