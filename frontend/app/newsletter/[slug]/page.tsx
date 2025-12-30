import Link from 'next/link';
import NewsletterDetail from '@/components/NewsletterDetail';
import DraftLoader from '@/components/DraftLoader';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getNewsletter(slug: string) {
  try {
    // FIX: Add localhost fallback like you have in the main list page
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


    const response = await fetch(`${apiUrl}/api/newsletters/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.log(`❌ Failed to fetch newsletter: ${response.status}`);
      return null;
    }

    const data = await response.json();
    // console.log('✅ Newsletter fetched:', {
    //   title: data.data?.title,
    //   slug: data.data?.slug,
    //   hasGallery: !!data.data?.gallery,
    //   galleryCount: data.data?.gallery?.length || 0,
    //   gallery: data.data?.gallery || [],
    // });
    return data.data;
  } catch (error) {
    console.error(" Error fetching newsletter:", error);
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