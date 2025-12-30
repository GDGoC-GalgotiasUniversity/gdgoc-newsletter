import NewsletterSearch from '@/components/NewsletterSearch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getNewsletters() {
  try {
    // Determine API URL based on environment or default to local
    // Use the backend URL (usually port 5000) for server-side fetching
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
    <main className="newsletter-page min-h-screen py-16">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-lg tracking-widest text-[var(--primary-purple)] mb-2 font-semibold">
            UNIVERSITY EDITION
          </p>
          <h1 className="mb-3">Google Developer Groups</h1>
          <p className="newsletter-subtitle text-2xl">On Campus Galgotias University</p>

          <div className="flex justify-center items-center gap-3 text-[var(--primary-purple)] text-lg tracking-wider my-4">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
            <span>•</span>
            <span>NEWSLETTER</span>
          </div>

          {/* Diamond Divider */}
          <div className="diamond-divider">✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</div>

          {/* Top Divider Line */}
          <div className="newsletter-divider"></div>
        </div>

        {/* Newsletter Grid with Search Functionality */}
        <NewsletterSearch newsletters={newsletters} />
        
        {/* Bottom Divider */}
        <div className="newsletter-divider mt-12"></div>
      </div>
    </main>
  );
}