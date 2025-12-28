import Link from 'next/link';
import NewsletterDetail from '@/components/NewsletterDetail';
import DraftLoader from '@/components/DraftLoader';

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
    return <DraftLoader slug={slug} />;
  }

  return <NewsletterDetail newsletter={newsletter} />;
}