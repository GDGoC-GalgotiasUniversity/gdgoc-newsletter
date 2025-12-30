import Link from 'next/link';
import WeatherWidget from '@/components/WeatherWidget';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. Fetch Logic (Server Side)
async function getLatestNewsletters() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Ensure we are hitting the PUBLIC endpoint
    const res = await fetch(`${apiUrl}/api/newsletters`, { cache: 'no-store' });

    if (!res.ok) return [];

    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error("Failed to fetch home newsletters", e);
    return [];
  }
}

export default async function HomePage() {
  const newsletters = await getLatestNewsletters();
  const hasNewsletters = newsletters.length > 0;

  // Safe Fallback if no data
  const coverStory = hasNewsletters ? newsletters[0] : {
    title: "Welcome to GDGoC",
    excerpt: "The latest updates from our campus community will appear here soon.",
    slug: "#",
    createdAt: new Date()
  };

  // Sidebar Stories (Take next 2 or use placeholders)
  const sideStories = hasNewsletters ? newsletters.slice(1, 3) : [
    { title: "Kickstart Session", excerpt: "The introductory session...", slug: "#" },
    { title: "Web Development", excerpt: "Beyond the basics...", slug: "#" }
  ];

  return (
    <main className="container mx-auto px-4 max-w-6xl py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* === LEFT COLUMN: MAIN CONTENT === */}
        <div className="lg:col-span-8 flex flex-col gap-12 order-2 lg:order-1">

          {/* LEAD STORY */}
          <section className="border-b-2 border-[var(--border-color)] pb-8">
            <span className="font-sans-accent text-[var(--brand-purple)] text-xs mb-2 block tracking-widest uppercase">
              COVER STORY &bull; {hasNewsletters ? 'LATEST ISSUE' : 'PREVIEW'}
            </span>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4 text-[var(--ink-black)]">
              {coverStory.title}
            </h2>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="font-sans-accent text-xs text-[var(--ink-gray)] border-t border-b border-[var(--ink-gray)] py-2 w-full md:w-auto self-start">
                By <span className="text-[var(--brand-purple)] font-bold">GDGoC Team</span> &bull; {new Date(coverStory.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>

            {/* Dynamic Cover Image */}
            {coverStory.coverImage ? (
              <div className="w-full aspect-[16/9] mb-6 border border-[var(--ink-black)] overflow-hidden group rounded-sm shadow-sm">
                <img
                  src={coverStory.coverImage}
                  alt={coverStory.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full aspect-[16/9] bg-neutral-100 mb-6 relative group overflow-hidden border border-[var(--ink-black)] rounded-sm">
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--paper-accent)] text-[var(--brand-purple)] font-gothic text-2xl opacity-20 group-hover:opacity-30 transition-opacity">
                  [No Cover Image]
                </div>
              </div>
            )}

            <div className="newspaper-columns text-justify text-lg leading-relaxed font-serif text-[var(--ink-black)] mb-8">
              <p className="first-letter:float-left first-letter:text-5xl first-letter:pr-2 first-letter:font-gothic first-letter:text-[var(--brand-purple)]">
                {coverStory.excerpt ? coverStory.excerpt.charAt(0) : 'W'}
              </p>
              <p>
                {coverStory.excerpt ? coverStory.excerpt.substring(1) : "Welcome to the GDGoC Newsletter. This is a placeholder story."}
              </p>
            </div>

            {hasNewsletters ? (
              <Link href={`/newsletter/${coverStory.slug}`} className="inline-block bg-[var(--brand-purple)] text-white px-8 py-3 font-sans-accent font-bold text-sm tracking-wider hover:bg-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                CONTINUE READING &rarr;
              </Link>
            ) : (
              <div className="inline-block px-4 py-2 bg-yellow-50 text-yellow-800 text-sm font-bold border border-yellow-200 rounded">
                No newsletters published yet
              </div>
            )}
          </section>

          {/* SECONDARY STORIES */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold italic">Recent Dispatches</h3>
              <div className="h-[1px] bg-[var(--border-color)] flex-1 opacity-30"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sideStories.map((story: any, i: number) => (
                <article key={i} className="flex flex-col gap-3 group relative top-0 hover:-top-1 transition-all duration-300">
                  {story.coverImage ? (
                    <div className="aspect-[4/3] border border-[var(--ink-black)] relative overflow-hidden rounded-sm shadow-sm group-hover:shadow-md transition-shadow">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-[var(--paper-accent)] border border-[var(--ink-black)] relative opacity-50 flex items-center justify-center font-sans-accent text-xs rounded-sm">
                      [No Image]
                    </div>
                  )}
                  <h4 className="text-lg md:text-xl font-serif font-bold leading-tight group-hover:text-[var(--brand-purple)] transition-colors">
                    <Link href={`/newsletter/${story.slug}`} className="before:absolute before:inset-0">{story.title}</Link>
                  </h4>
                  <p className="text-sm font-sans text-[var(--ink-gray)] line-clamp-3 leading-relaxed">
                    {story.excerpt}
                  </p>
                  <div className="text-xs font-sans-accent text-[var(--brand-purple)] font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    READ FULL STORY &rarr;
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* === RIGHT COLUMN: SIDEBAR === */}
        <aside className="lg:col-span-4 flex flex-col gap-8 lg:border-l lg:border-[var(--border-color)] lg:pl-8 order-1 lg:order-2">

          {/* 1. WEATHER WIDGET (Moved to top for mobile relevance) */}
          <WeatherWidget />

          {/* 2. SUBSCRIPTION BOX */}
          <div className="bg-[var(--paper-accent)] p-6 border-2 border-[var(--brand-purple)] border-dashed relative rounded-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 border border-gray-200 rounded-full font-sans-accent text-[var(--brand-purple)] text-[10px] font-bold tracking-widest shadow-sm">
              SUBSCRIBE
            </div>
            <h3 className="font-gothic text-3xl text-center mb-2 mt-2">Join the Club</h3>
            <p className="text-center font-serif italic text-sm mb-4 text-gray-600">
              Get the latest campus updates delivered via carrier pigeon (or email).
            </p>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="Your email address" className="bg-white border border-gray-300 rounded px-4 py-2 font-serif text-sm focus:outline-none focus:border-[var(--brand-purple)] focus:ring-1 focus:ring-[var(--brand-purple)]" />
              <button className="bg-[var(--brand-purple)] text-white font-sans-accent text-xs font-bold py-3 rounded hover:bg-black transition-colors shadow-md">
                SIGN ME UP
              </button>
            </div>
          </div>

          {/* 3. IN BRIEF / ANNOUNCEMENTS */}
          <div className="flex flex-col gap-0 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b-2 border-gray-100 mb-4 pb-2">
              <h3 className="font-sans-accent text-lg font-bold text-gray-800">In Brief</h3>
            </div>

            {/* List Items */}
            <ul className="flex flex-col gap-5">
              <li className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <span className="text-[var(--brand-purple)] font-bold text-[10px] tracking-wider block mb-1 uppercase">Upcoming</span>
                <Link href="#" className="font-serif hover:text-[var(--brand-purple)] font-medium leading-snug block text-gray-800 hover:underline">
                  Hackathon 2025 registration opens this Friday. Teams of 4 required.
                </Link>
              </li>
              <li className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <span className="text-blue-600 font-bold text-[10px] tracking-wider block mb-1 uppercase">Announcement</span>
                <Link href="#" className="font-serif hover:text-[var(--brand-purple)] font-medium leading-snug block text-gray-800 hover:underline">
                  New core team members announced for the Web Dev domain.
                </Link>
              </li>
              <li className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <span className="text-orange-600 font-bold text-[10px] tracking-wider block mb-1 uppercase">Reminder</span>
                <Link href="#" className="font-serif hover:text-[var(--brand-purple)] font-medium leading-snug block text-gray-800 hover:underline">
                  Don't forget to claim your Cloud Study Jam badges before the 30th.
                </Link>
              </li>
            </ul>
          </div>

        </aside>

      </div>
    </main>
  );
}