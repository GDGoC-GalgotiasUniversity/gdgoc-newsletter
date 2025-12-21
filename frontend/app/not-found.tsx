import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
            <div className="text-center">
                {/* Google Colored 404 */}
                <div className="flex justify-center items-center gap-1 mb-6">
                    <span className="text-7xl font-normal text-[var(--google-blue)]">4</span>
                    <span className="text-7xl font-normal text-[var(--google-red)]">0</span>
                    <span className="text-7xl font-normal text-[var(--google-yellow)]">4</span>
                </div>

                <h1 className="text-2xl font-normal mb-3">Page not found</h1>
                <p className="text-[var(--gray-500)] mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex justify-center gap-4">
                    <Link href="/" className="btn-primary">
                        Go Home
                    </Link>
                    <Link href="/newsletter" className="btn-secondary">
                        Browse Newsletters
                    </Link>
                </div>
            </div>
        </main>
    );
}
