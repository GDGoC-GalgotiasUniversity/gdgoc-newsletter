import NewsletterSearch from '@/components/NewsletterSearch';

async function getNewsletters() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Fetching newsletters from:', `${apiUrl}/api/newsletters`);
    
    const response = await fetch(`${apiUrl}/api/newsletters`, {
      cache: 'no-store', // Don't cache to always get fresh data
    });

    console.log('Newsletter API response status:', response.status);

    if (!response.ok) {
      console.error('Failed to fetch newsletters:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('Newsletters received:', data.data?.length || 0);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return [];
  }
}

export default async function NewsletterPage() {
  const newsletters = await getNewsletters();
  return (
    <main className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-center">Newsletters</h1>
          <p className="text-lg text-[var(--gray-700)] text-center">
            Browse through our collection of newsletters and stay updated with GDGoC activities.
          </p>
        </div>

        {/* Newsletter Grid */}
        <NewsletterSearch newsletters={newsletters} />
      </div>
    </main>
  );
}