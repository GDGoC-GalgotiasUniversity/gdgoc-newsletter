import Link from 'next/link';
import Image from 'next/image';

// Mock data - replace with actual API call
const newsletters = [
  {
    slug: 'kickstarter-event',
    title: 'Kickstarter Session: GDG on Campus Galgotias University',
    date: 'December 21, 2025',
    category: 'Community Builders',
    excerpt: 'An inspiring kickstart session marking the arrival of GDG on Campus Galgotias University with talks, networking, and future plans.',
    location: 'GDG ON CAMPUS GALGOTIAS UNIVERSITY',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'cloud-study-jam',
    title: 'Cloud Study Jams: Query Session',
    date: 'October 26, 2025',
    category: 'Cloud Study Jam',
    excerpt: 'A detailed query session for Cloud Study Jams where participants discovered doubts, concepts, and learning paths in cloud computing.',
    location: 'GDG ON CAMPUS GALGOTIAS UNIVERSITY',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'meghon-workshop',
    title: 'Meghon Se Sakshatkar: Google Cloud Workshop',
    date: 'November 18, 2025',
    category: 'Cloud Workshops',
    excerpt: 'A full-day Google Cloud workshop combining conceptual learning with hands-on labs and live cloud deployments.',
    location: 'GDG ON CAMPUS GALGOTIAS UNIVERSITY',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'devfest-2025',
    title: 'DevFest Noida 2025 Experience',
    date: 'December 06, 2025',
    category: 'Events',
    excerpt: 'An inspiring experience at DevFest Noida 2025 filled with learning, networking, and community energy.',
    location: 'GDG ON CAMPUS GALGOTIAS UNIVERSITY',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
];

export default function NewsletterPage() {
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
            <span>TUESDAY, DECEMBER 21, 2025</span>
            <span>•</span>
            <span>NEWSLETTER</span>
          </div>

          {/* Diamond Divider */}
          <div className="diamond-divider">✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</div>

          {/* Top Divider Line */}
          <div className="newsletter-divider"></div>
        </div>

        {/* Latest Stories Section */}
        <div className="mb-12">
          <h2 className="newsletter-section-title">Latest Stories</h2>

          {/* Newsletter Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {newsletters.map((newsletter) => (
              <Link
                key={newsletter.slug}
                href={`/newsletter/${newsletter.slug}`}
                className="card group block overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={newsletter.image}
                    alt={newsletter.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  {/* Category Badge */}
                  <div className="newsletter-badge">{newsletter.category}</div>

                  {/* Title */}
                  <h3 className="mb-3 group-hover:text-[var(--accent-purple)] transition-colors duration-300 font-bold">
                    {newsletter.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[var(--dark-text)] text-lg leading-relaxed mb-4">
                    {newsletter.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="text-sm text-[var(--gray-700)] space-y-1">
                    <p className="font-semibold tracking-wider">
                      {newsletter.location}
                    </p>
                    <p>
                      {newsletter.date}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="newsletter-divider mt-12"></div>
      </div>
    </main>
  );
}
