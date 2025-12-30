import Link from 'next/link';
import AnimatedLogo from './AnimatedLogo';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-[var(--gray-200)] ">
            <div className="container py-12 ">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2 mt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Link href="/">
                                <AnimatedLogo className="w-8 h-8" />
                            </Link>
                            <a
                                href="https://gdg.community.dev/gdg-on-campus-galgotias-university-greater-noida-india/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[var(--gray-900)] hover:text-[var(--google-blue)] transition"
                            >
                                GDGoC Chapter
                            </a>
                        </div>
                        <p className="text-sm text-[var(--gray-500)] max-w-sm mb-4">
                            Google Developer Groups on Campus at Galgotias University.
                            Building developers who build the future.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            <a
                                href="https://discord.gg/TYEJBsY4YD"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--gray-500)] hover:text-[var(--google-blue)] transition"
                                aria-label="Discord"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/gdgocgu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--gray-500)] hover:text-[var(--google-red)] transition"
                                aria-label="Instagram"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.linkedin.com/company/gdg-on-campus-galgotias-university/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--gray-500)] hover:text-[var(--google-blue)] transition"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a
                                href="https://github.com/GDGoC-GalgotiasUniversity"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--gray-500)] hover:text-[var(--gray-900)] transition"
                                aria-label="GitHub"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-medium text-[var(--gray-900)] mb-4 mt-8">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-[var(--gray-500)] hover:text-[var(--google-blue)] transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/newsletter" className="text-sm text-[var(--gray-500)] hover:text-[var(--google-blue)] transition">
                                    Newsletters
                                </Link>
                            </li>
                            <li>
                                <Link href="https://gdg-socials.vercel.app/" className="text-sm text-[var(--gray-500)] hover:text-[var(--google-blue)] transition">
                                    Linktree
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-medium text-[var(--gray-900)] mb-4 mt-8">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://developers.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[var(--gray-500)] hover:text-[var(--google-blue)] transition"
                                >
                                    Google Developers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://gdg.community.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[var(--gray-500)] hover:text-[var(--google-blue)] transition"
                                >
                                    GDG Community
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://galgotiasuniversity.edu.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[var(--gray-500)] hover:text-[var(--google-blue)] transition"
                                >
                                    Galgotias University
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--gray-200)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[var(--gray-500)]">
                        © {currentYear} <a href="https://gdg.community.dev/gdg-on-campus-galgotias-university-greater-noida-india/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--google-blue)]">GDGoC</a>.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/" className="text-sm text-[var(--gray-500)] hover:text-[var(--google-blue)] transition">
                            Privacy Policy
                        </Link>
                        <Link href="/" className="text-sm text-[var(--gray-500)] hover:text-[var(--google-blue)] transition">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
