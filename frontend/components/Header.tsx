'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AnimatedLogo from './AnimatedLogo';

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/newsletter', label: 'Newsletters' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <div className="sticky top-0 z-50 px-2 sm:px-4 py-3 sm:py-6">
            <header className="max-w-6xl mx-auto border border-[var(--gray-200)] bg-white/80 backdrop-blur-md rounded-full shadow-lg px-3 sm:px-6 md:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 group">
                        {/* Animated Logo - Play once, stay on last frame */}
                        <AnimatedLogo className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                        <div className="flex items-baseline gap-1 sm:gap-1.5">
                            <span className="font-medium text-sm sm:text-base md:text-lg text-[var(--gray-900)]">GDGoC</span>
                            <span className="text-[var(--gray-500)] text-xs sm:text-sm md:text-base hidden md:inline">Galgotias University</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1 sm:gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-medium rounded-full transition ${isActive(link.href)
                                    ? 'text-[var(--google-blue)] bg-[rgba(66,133,244,0.08)]'
                                    : 'text-[var(--gray-700)] hover:bg-[var(--gray-100)]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="ml-2 sm:ml-3 md:ml-4 pl-2 sm:pl-3 md:pl-4 border-l border-[var(--gray-200)]">
                            <Link
                                href="/login"
                                className="btn-primary text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-6"
                            >
                                Join
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    );
}
