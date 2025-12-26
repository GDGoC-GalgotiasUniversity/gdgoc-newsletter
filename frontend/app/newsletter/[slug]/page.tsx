import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';
import NewsletterDetail from '@/components/NewsletterDetail';

async function getNewsletter(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletters/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.data;
  } catch (error) {
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
      <main className="py-12">
        <div className="container text-center">
          <h1 className="text-2xl mb-4">Newsletter not found</h1>
          <Link href="/newsletter" className="text-[var(--google-blue)] hover:underline">
            Back to newsletters
          </Link>
        </div>
      </main>
    );
  }

  return <NewsletterDetail newsletter={newsletter} />;
}