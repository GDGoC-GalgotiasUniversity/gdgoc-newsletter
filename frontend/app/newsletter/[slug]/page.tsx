import Link from 'next/link';
import NewsletterDetail from '@/components/NewsletterDetail';

async function getNewsletter(slug: string) {
  try {
    // FIX: Add localhost fallback like you have in the main list page
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    console.log(`Fetching newsletter: ${slug} from ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}/api/newsletters/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    return null;
  }
}

export default async function NewsletterSlugPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const newsletter = await getNewsletter(slug);

  if (!newsletter) {
    return (
      <main className="py-24 min-h-screen bg-[var(--paper-bg)] flex items-center justify-center">
        <div className="container text-center max-w-lg p-8 border-2 border-dashed border-[var(--brand-purple)]">
          <h1 className="font-gothic text-4xl mb-4 text-[var(--brand-purple)]">404</h1>
          <h2 className="font-serif text-2xl mb-4">Newsletter Not Found</h2>
          <p className="mb-8 font-sans text-[var(--ink-gray)]">
            The article you are looking for has either been retracted or never existed in the archives.
          </p>
          <Link href="/newsletter" className="btn-classic">
            Return to Archives
          </Link>
        </div>
      </main>
    );
  }

  return <NewsletterDetail newsletter={newsletter} />;
}