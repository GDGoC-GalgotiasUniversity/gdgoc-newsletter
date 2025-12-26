import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';
import HeroBackgroundVideo from '@/components/HeroBackgroundVideo';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section with Video Background */}
      <section className="relative py-24 bg-[var(--gray-50)] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <HeroBackgroundVideo />
        </div>

        {/* Content */}
        <div className="container text-center relative z-10">
          {/* Video Logo */}
      <br/><br/><br/>

          <h1 className="text-5xl font-normal mb-6">
            GDGoC <span className="text-[var(--google-blue)]">Galgotias University</span>
          </h1>
          <p className="text-xl text-[var(--gray-700)] max-w-2xl mx-auto mb-10">
            Stay updated with the latest events, workshops, and community highlights
            from Google Developer Groups on Campus at Galgotias University.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/newsletter" className="btn-primary">
              Browse Newsletters
            </Link>
           
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center mb-12">What We Share</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--google-blue)] mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2">Events</h3>
              <p>Workshops, hackathons, and tech talks happening on campus.</p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--google-red)] mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mb-2">Community</h3>
              <p>Spotlights on members and their achievements in tech.</p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--google-green)] mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-2">Resources</h3>
              <p>Learning materials, tutorials, and Google technologies.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}