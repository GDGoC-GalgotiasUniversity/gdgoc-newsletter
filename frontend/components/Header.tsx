'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Header() {
    const { user, logout } = useAuth();
    
    // --- EASTER EGG STATE ---
    const [showRibbon, setShowRibbon] = useState(false);

    useEffect(() => {
        // Generate a number between 0 and 1.
        // REMEMBER TO LOWER THIS (e.g., to 0.10) later!
        if (Math.random() < 0.08) {
            setShowRibbon(true);
        }
    }, []);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        /* 1. Main Background */
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
                            <div className="flex gap-4 whitespace-nowrap">
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
                        <h1 className="font-gothic text-5xl md:text-7xl lg:text-8xl leading-none text-[var(--brand-purple)] tracking-wide drop-shadow-md group-hover:opacity-90 transition-opacity duration-300">
                            {/* --- EASTER EGG RIBBON LOGIC --- */}
                            <span className="relative inline-block">
                                G
                                {showRibbon && (
                                    <span 
                                        // UPDATED CLASSES FOR "PERKED" LOOK:
                                        // 1. Removed negative top/left: Now uses 'top-0' and 'left-0' to sit directly ON the box.
                                        // 2. Added '-ml-1' (negative margin left) on desktop to tuck it slightly tighter to the serif.
                                        // 3. Kept 'z-10' to ensure it sits on top of the text ink.
                                        // 4. Slight rotation (-12deg) to look naturally tied.
                                        className="absolute top-0 left-0 md:-ml-2 md:mt-1 z-10 text-sm md:text-xl pointer-events-none select-none -rotate-12 opacity-100 transition-all duration-700"
                                        aria-hidden="true"
                                        title="A gift from the developers!"
                                    >
                                        🎀
                                    </span>
                                )}
                            </span>
                            oogle Developer Groups
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
            <div className="border-t border-b border-[var(--ink-black)] py-2 bg-[var(--paper-bg)] sticky top-0 z-50 shadow-sm">
                <nav className="max-w-6xl mx-auto flex justify-center flex-wrap gap-4 md:gap-8 text-xs md:text-sm font-sans-accent font-bold tracking-widest uppercase">
                    {[
                        { name: "Front Page", href: "/" },
                        { name: "Archives", href: "/newsletter" },
                        { name: "About Us", href: "/about" },
                        { name: "Socials", href: "https://gdg-socials.vercel.app/", external: true },
                    ].map((item) => (
                        <Link 
                            key={item.name}
                            href={item.href} 
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            className="relative group px-3 py-1 overflow-hidden transition-all duration-300 hover:text-[var(--brand-purple)]"
                        >
                            <span className="relative z-10">{item.name}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--brand-purple)] transition-all duration-300 group-hover:w-full"></span>
                            <span className="absolute top-0 left-0 w-full h-full bg-[var(--brand-purple)]/5 -translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link 
                            href="/admin" 
                            className="relative overflow-hidden px-4 py-1 text-red-700 font-black border-2 border-red-700 transition-all duration-300 hover:text-white group"
                        >
                            <span className="relative z-10">Editor's Desk</span>
                            <span className="absolute inset-0 bg-red-700 translate-x-[-101%] transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}