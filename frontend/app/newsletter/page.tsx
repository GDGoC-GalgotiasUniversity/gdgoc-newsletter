import Link from 'next/link';
import Image from 'next/image';

// Mock data - replace with actual API call
const newsletters = [
  {
    slug: 'kickstarter-event',
    title: 'Kickstarter Event',
    date: 'November 21, 2025',
    excerpt: 'Highlights from our Kickstarter Event events and announcements. New year, new opportunities!',
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'cloud-study-jam',
    title: 'Cloud Study Jam',
    date: 'December 21, 2025',
    excerpt: 'Highlights from our Cloud Study Jam events and announcements. New year, new opportunities!',
    color: 'red',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'mar-2025',
    title: 'March 2025 Newsletter',
    date: 'March 15, 2025',
    excerpt: 'Spring events and community highlights. Get ready for exciting workshops!',
    color: 'green',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'june-2025',
    title: 'June 2025 Newsletter',
    date: 'June 15, 2025',
    excerpt: 'Summer kickoff, hackathon recaps, and special guest speakers.',
    color: 'yellow',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
];

const colorMap: Record<string, string> = {
  blue: 'var(--google-blue)',
  red: 'var(--google-red)',
  yellow: 'var(--google-yellow)',
  green: 'var(--google-green)',
};

export default function NewsletterPage() {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {newsletters.map((newsletter, index) => (
            <Link
              key={newsletter.slug}
              href={`/newsletter/${newsletter.slug}`}
              className="card group block overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={newsletter.image}
                  alt={newsletter.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              {/* Color Bar */}
              <div
                className="h-1"
                style={{ backgroundColor: colorMap[newsletter.color] }}
              />

              <div className="p-6">
                <p className="text-sm text-[var(--gray-500)] mb-2">{newsletter.date}</p>
                <h3 className="group-hover:text-[var(--google-blue)] transition mb-3">
                  {newsletter.title}
                </h3>
                <p className="text-[var(--gray-700)] text-sm">{newsletter.excerpt}</p>

                <div className="mt-4 flex items-center text-[var(--google-blue)] text-sm font-medium">
                  Read more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}