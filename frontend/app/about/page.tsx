import Link from 'next/link'
import AnimatedLogo from '@/components/AnimatedLogo'

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 max-w-6xl py-12">
      <section className="text-center mb-12">
        <div className="inline-block p-4 bg-[var(--paper-accent)] rounded-full mb-4">
          <AnimatedLogo className="w-12 h-12" />
        </div>

        <h1 className="font-gothic text-2xl sm:text-4xl md:text-6xl text-[var(--brand-purple)] leading-tight mb-4">
          GDG — On Campus, Galgotias University
        </h1>

        <p className="max-w-2xl mx-auto text-[var(--ink-gray)] font-serif text-base sm:text-lg">
          GDGOC Galgotias University is where curious minds meet cool tech. Our newsletter brings you the inside scoop on everything we're up to—events, projects, learning resources, and the occasional meme that's too good not to share.
        </p>
      </section>

     

      <section className="mb-10">
        <h2 className="font-gothic text-4xl text-[var(--ink-black)] mb-10 text-center">The Team</h2>
        </section>

        <section className="mb-16">
          <div className="text-center">
            <a href="https://res.cloudinary.com/dnxydyvwg/image/upload/v1767109943/20251230193808532_admchc.jpg" target="_blank" rel="noopener noreferrer" className="inline-block">
              {/* group photo from Cloudinary */}
              <img src="https://res.cloudinary.com/dnxydyvwg/image/upload/v1767109943/20251230193808532_admchc.jpg" alt="GDGOC Core Members" className="mx-auto w-full max-w-4xl rounded-lg object-cover" />
            </a>
          </div>
        </section>

      <section className="text-center py-6">
        <p className="font-serif text-[var(--ink-gray)] text-sm">That's all folks! Keep building cool stuff ✌️</p>
      </section>
    </main>
  )
}
