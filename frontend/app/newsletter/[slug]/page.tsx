import Link from 'next/link';

// Mock data - replace with actual API call
const getNewsletter = (slug: string) => {
  return {
    slug,
    title: `${slug.split('-')[0].charAt(0).toUpperCase() + slug.split('-')[0].slice(1)} ${slug.split('-')[1]} Newsletter`,
    date: 'January 15, 2024',
    author: 'GDGoC Team',
    content: `
      <h2>Welcome to this edition!</h2>
      <p>We're excited to share the latest updates from Google Developer Groups on Campus at Galgotias University. This month has been packed with amazing events, learning opportunities, and community growth.</p>
      
      <h3>🎉 Event Highlights</h3>
      <p>This month, we organized several workshops focusing on:</p>
      <ul>
        <li>Introduction to Firebase and Cloud Functions</li>
        <li>Building Progressive Web Apps with Angular</li>
        <li>Machine Learning with TensorFlow.js</li>
      </ul>
      
      <h3>🌟 Community Spotlight</h3>
      <p>Congratulations to our members who achieved Google Cloud certifications this month! Your dedication to learning inspires us all.</p>
      
      <h3>📅 Upcoming Events</h3>
      <p>Mark your calendars for our upcoming hackathon next month. More details coming soon!</p>
      
      <p>Stay tuned for more updates from GDGoC Galgotias University. Follow us on social media for the latest announcements!</p>
    `,
  };
};

export default async function NewsletterSlugPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const newsletter = getNewsletter(slug);

  return (
    <main className="py-12">
      <div className="container">
        {/* Back Link */}
        <Link
          href="/newsletter"
          className="inline-flex items-center text-[var(--google-blue)] hover:underline mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back 
        </Link>

        <article className="max-w-3xl">
          {/* Header */}
          <header className="mb-10 pb-8 border-b border-[var(--gray-200)]">
            {/* Color Dots */}
            <div className="flex gap-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-[var(--google-blue)]"></span>
              <span className="w-3 h-3 rounded-full bg-[var(--google-red)]"></span>
              <span className="w-3 h-3 rounded-full bg-[var(--google-yellow)]"></span>
              <span className="w-3 h-3 rounded-full bg-[var(--google-green)]"></span>
            </div>

            <h1 className="text-4xl mb-4">{newsletter.title}</h1>

            <div className="flex items-center gap-4 text-[var(--gray-500)]">
              <span>{newsletter.date}</span>
              <span>•</span>
              <span>By {newsletter.author}</span>
            </div>
          </header>

          {/* Content */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: newsletter.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-[var(--gray-200)]">
            <p className="text-[var(--gray-500)] text-sm mb-4">Share this newsletter</p>
            <div className="flex gap-3">
              <button className="btn-secondary text-sm py-2 px-4">
                Twitter
              </button>
              <button className="btn-secondary text-sm py-2 px-4">
                LinkedIn
              </button>
              <button className="btn-secondary text-sm py-2 px-4">
                Copy Link
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}