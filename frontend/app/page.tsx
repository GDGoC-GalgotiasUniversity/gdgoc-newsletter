import React from 'react';

// Mocking Next.js Link for the preview environment
const Link = ({ href, children, className }) => (
  <a href={href} className={className} style={{ cursor: 'pointer' }}>
    {children}
  </a>
);

export default function HomePagePreview() {
  // STATIC DATA (Simulating your fallback data)
  const coverStory = {
    title: "Welcome to GDGoC",
    excerpt: "The latest updates from our campus community will appear here soon.",
    slug: "welcome-gdgoc",
    createdAt: new Date()
  };

  const sideStories = [
    { 
      title: "Kickstart Session", 
      excerpt: "The introductory session for our new members will cover our goals for the year...", 
      slug: "kickstart-session",
      coverImage: null
    },
    { 
      title: "Web Development", 
      excerpt: "Beyond the basics of HTML and CSS. Exploring modern frameworks...", 
      slug: "web-dev-basics",
      coverImage: null
    }
  ];

  const hasNewsletters = true;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <main className="container mx-auto px-4 max-w-6xl py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* === LEFT COLUMN: MAIN CONTENT === */}
          <div className="lg:col-span-8 flex flex-col gap-12">

            {/* LEAD STORY */}
            <section className="border-b-2 border-gray-200 pb-8">
              <span className="text-purple-700 text-xs font-bold mb-2 block tracking-wider uppercase">
                COVER STORY &bull; {hasNewsletters ? 'LATEST ISSUE' : 'PREVIEW'}
              </span>

              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4 text-black">
                {coverStory.title}
              </h2>

              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="text-xs text-gray-500 border-t border-b border-gray-300 py-2 w-full md:w-auto self-start font-bold uppercase tracking-wider">
                  By <span className="text-purple-700">GDGoC Team</span> &bull; {coverStory.createdAt.toLocaleDateString()}
                </div>
              </div>

              {/* Dynamic Cover Image Placeholder */}
              <div className="w-full aspect-[16/9] bg-gray-200 mb-6 relative group overflow-hidden border border-black">
                <div className="absolute inset-0 flex items-center justify-center text-purple-700 text-2xl opacity-20 font-bold">
                  [No Cover Image]
                </div>
              </div>

              <div className="text-justify text-lg leading-relaxed font-serif text-black mb-6">
                <p>
                  <span className="float-left text-5xl pr-2 font-bold text-purple-700">
                    {coverStory.excerpt.charAt(0)}
                  </span>
                  {coverStory.excerpt.substring(1)}
                </p>
              </div>

              <Link href={`#`} className="inline-block bg-black text-white px-6 py-3 uppercase text-xs font-bold tracking-widest hover:bg-purple-700 transition-colors">
                Continue Reading &rarr;
              </Link>
            </section>

            {/* SECONDARY STORIES */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-serif font-bold italic">Recent Dispatches</h3>
                <div className="h-[1px] bg-gray-300 flex-1 opacity-50"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sideStories.map((story, i) => (
                  <article key={i} className="flex flex-col gap-3 group items-start">
                    {/* Image Placeholder */}
                    <div className="w-full aspect-[4/3] bg-purple-50 border border-black relative opacity-50 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-purple-900">
                      [No Image]
                    </div>
                    
                    <h4 className="text-xl font-serif font-bold leading-tight group-hover:text-purple-700 transition-colors">
                      <Link href={`#`}>{story.title}</Link>
                    </h4>
                    
                    <p className="text-sm font-sans text-gray-600 line-clamp-3">
                      {story.excerpt}
                    </p>

                    {/* === HIGH VISIBILITY BUTTON === */}
                    <div className="mt-2">
                       <Link 
                         href={`#`} 
                         className="inline-block bg-purple-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                       >
                         Read More
                       </Link>
                    </div>
                    {/* ============================= */}

                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* === RIGHT COLUMN: SIDEBAR === */}
          <aside className="lg:col-span-4 flex flex-col gap-8 lg:border-l lg:border-gray-200 lg:pl-8">

            {/* 1. SUBSCRIPTION BOX */}
            <div className="bg-purple-50 p-6 border-2 border-purple-700 border-dashed relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-purple-700 text-xs font-bold tracking-widest">
                SUBSCRIBE NOW
              </div>
              <h3 className="font-sans text-3xl text-center mb-2 font-black uppercase">Join the Club</h3>
              <p className="text-center font-serif italic text-sm mb-4">
                Get the latest campus updates delivered via carrier pigeon (or email).
              </p>
              <div className="flex flex-col gap-2">
                <input type="email" placeholder="Your email address" className="bg-white border border-black px-3 py-2 font-serif text-sm focus:outline-none focus:border-purple-700" />
                <button className="bg-purple-700 text-white text-xs py-2 font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Sign Me Up
                </button>
              </div>
            </div>

            {/* 2. IN BRIEF / ANNOUNCEMENTS */}
            <div className="flex flex-col gap-0">
              <div className="border-b-4 border-double border-black mb-4 pb-1">
                <h3 className="text-lg font-bold uppercase tracking-wider">In Brief</h3>
              </div>

              {/* List Items */}
              <ul className="flex flex-col gap-4">
                <li className="pb-4 border-b border-gray-300 border-dotted">
                  <span className="text-purple-700 font-bold text-xs block mb-1 tracking-widest">UPCOMING</span>
                  <Link href="#" className="font-serif hover:text-purple-700 font-medium leading-tight block">
                    Hackathon 2025 registration opens this Friday. Teams of 4 required.
                  </Link>
                </li>
                <li className="pb-4 border-b border-gray-300 border-dotted">
                  <span className="text-purple-700 font-bold text-xs block mb-1 tracking-widest">ANNOUNCEMENT</span>
                  <Link href="#" className="font-serif hover:text-purple-700 font-medium leading-tight block">
                    New core team members announced for the Web Dev domain.
                  </Link>
                </li>
                <li className="pb-4 border-b border-gray-300 border-dotted">
                  <span className="text-purple-700 font-bold text-xs block mb-1 tracking-widest">REMINDER</span>
                  <Link href="#" className="font-serif hover:text-purple-700 font-medium leading-tight block">
                    Don't forget to claim your Cloud Study Jam badges before the 30th.
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. WEATHER WIDGET */}
            <div className="border border-black p-4 text-center">
              <div className="font-sans text-2xl text-gray-400 mb-1 uppercase font-bold tracking-tighter">Campus Weather</div>
              <div className="font-serif text-4xl font-bold mb-1">24°C</div>
              <div className="text-xs text-purple-700 font-bold tracking-widest uppercase">SUNNY &bull; CODE COMPILING</div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}
