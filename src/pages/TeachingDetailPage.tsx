import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { getTeachingById } from '../lib/communityTeachings'

export default function TeachingDetailPage() {
  const { teachingId } = useParams()
  const teaching = getTeachingById(teachingId)

  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-[url('/altar.png')] bg-cover opacity-10"
        style={{ backgroundPosition: 'center 24%' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.1),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.06),rgba(15,12,9,0.48))]" />
      <div className="relative flex h-full flex-col px-6 py-10 pb-40 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="flex min-h-full flex-col"
        >
          <div className="flex items-center justify-between">
            <Link to="/community" className="text-xs text-[#c6a47a] transition hover:text-[#e7cba9]">
              Back
            </Link>
          </div>

          <div className="mt-4 space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">USCCB NABRE</p>
            <h1 className="serif text-2xl text-[#e7cba9]">{teaching.title}</h1>
            {teaching.text.trim() ? <p className="text-sm leading-5 text-white/70">{teaching.text}</p> : null}
          </div>

          {teaching.everydayThings && teaching.everydayThings.length > 0 ? (
            <div className="mt-5 space-y-3">
              {teaching.everydayThings.map((thing) => (
                <div
                  key={thing.name}
                  className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-soft"
                >
                  <p className="serif text-xl text-[#e7cba9]">{thing.name}</p>
                  <div className="space-y-4">
                    {thing.verses.map((verse) => (
                      <div key={verse.reference} className="space-y-1 border-t border-white/8 pt-4 first:border-t-0 first:pt-0">
                        <p className="text-sm font-medium text-[#e7cba9]">{verse.reference}</p>
                        <p className="text-sm leading-7 text-white/70">{verse.excerpt}</p>
                        <a
                          href={verse.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block text-xs text-[#c6a47a] transition hover:text-[#e7cba9]"
                        >
                          Read full chapter on USCCB
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : teaching.text.trim() || teaching.verses.length > 0 ? (
            <div className="mt-5 space-y-4 rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-soft">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Verses</p>
                {teaching.verses.map((verse) => (
                  <div key={verse.reference} className="space-y-1 border-t border-white/8 pt-4 first:border-t-0 first:pt-0">
                    <p className="text-sm font-medium text-[#e7cba9]">{verse.reference}</p>
                    <p className="text-sm leading-7 text-white/70">{verse.excerpt}</p>
                    <a
                      href={verse.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs text-[#c6a47a] transition hover:text-[#e7cba9]"
                    >
                      Read full chapter on USCCB
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl shadow-soft">
              <div className="min-h-40 rounded-2xl border border-dashed border-white/10 bg-black/10" />
            </div>
          )}
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
