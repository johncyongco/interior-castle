import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { getTeachingById } from '../lib/communityTeachings'

export default function TeachingDetailPage() {
  const { teachingId } = useParams()
  const teaching = getTeachingById(teachingId)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const longPressTimerRef = useRef<number | null>(null)
  const fossLink = 'https://fossnovena.org/'
  const soulsToPrayFor = [
    'Deceased family members',
    'Forgotten souls in Purgatory',
    'Souls with no one to pray for them',
    'Souls of priests and religious',
    'Souls who died suddenly',
    'Friends and benefactors',
  ]

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current)
      }
    }
  }, [])

  function startPreview() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current)
    }

    longPressTimerRef.current = window.setTimeout(() => {
      setIsPreviewing(true)
      void videoRef.current?.play().catch(() => undefined)
    }, 450)
  }

  function stopPreview() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    if (isPreviewing) {
      videoRef.current?.pause()
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
      setIsPreviewing(false)
    }
  }

  function triggerPreview() {
    if (isPreviewing) return

    setIsPreviewing(true)
    void videoRef.current?.play().catch(() => undefined)
  }

  const isFriendsOfTheSuffering = teaching.id === 'friends-of-the-suffering'

  return (
    <ScreenContainer>
      {isFriendsOfTheSuffering ? (
        <div
          className="absolute inset-0 select-none touch-none"
          onPointerDown={(event) => {
            event.preventDefault()
            startPreview()
          }}
          onPointerUp={stopPreview}
          onPointerCancel={stopPreview}
          onPointerLeave={stopPreview}
          onContextMenu={(event) => event.preventDefault()}
        >
          <div
            className="absolute inset-0 bg-[url('/Purgatory.png')] bg-cover"
            style={{ backgroundPosition: 'center center' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,220,170,0.18),transparent_35%),linear-gradient(180deg,rgba(18,13,11,0.20),rgba(18,13,11,0.78))]" />
          <video
            ref={videoRef}
            src="/Purgatory-video.mp4"
            draggable={false}
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isPreviewing ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-[url('/altar.png')] bg-cover opacity-10"
            style={{ backgroundPosition: 'center 24%' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.1),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.06),rgba(15,12,9,0.48))]" />
        </>
      )}
      <div className={`relative flex h-full flex-col px-6 py-10 pb-40 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
        isFriendsOfTheSuffering ? 'select-none' : ''
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative z-20 flex min-h-full flex-col"
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

          {isFriendsOfTheSuffering && !isPreviewing ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={triggerPreview}
                className="rounded-full border border-white/15 bg-black/15 px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-white/60 backdrop-blur-md shadow-soft transition hover:bg-black/20"
                aria-label="Play Purgatory video"
              >
                Play
              </button>
            </div>
          ) : null}

          {isFriendsOfTheSuffering ? (
            <div className="mt-5 space-y-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Prayer</p>
                <h2 className="mt-2 serif text-xl text-[#e7cba9]">
                  The Importance of Praying for Souls
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Souls</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {soulsToPrayFor.map((soul) => (
                    <div
                      key={soul}
                      className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white/75"
                    >
                      {soul}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Become Friends of the Suffering</p>
                <h2 className="mt-2 serif text-xl text-[#e7cba9]">Friends of the Suffering Souls</h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  A Catholic lay association conducting a perpetual novena of Masses for the Holy Souls in Purgatory.
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  FOSS began in devotion to Our Lady of Knock, and its perpetual novena offers Masses for the Holy Souls
                  while also promising remembrance after death and a way to surround loved ones with heavenly intercessors.
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Members arrange one Mass each year for the intention, “For the Holy Souls in Purgatory, especially the
                  deceased members of FOSS.” Additional enrollments can be made for family and friends, with the same Mass
                  intention offered in confidence for their spiritual good.
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  At present, members in 50 countries offer more than 35,000 Masses each year for this intention. If you
                  love the Holy Souls and want prayer for yourself and your loved ones, join them at{' '}
                  <a
                    href={fossLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#e7cba9] underline decoration-white/25 underline-offset-4 transition hover:decoration-white/60"
                  >
                    fossnovena.org
                  </a>
                  .
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'ENROL YOURSELF',
                    'ENROL SOMEONE ELSE',
                    'DONATION',
                    'ARRANGE MASS',
                    'CONFIRM MASS',
                  ].map((label) => (
                    <a
                      key={label}
                      href={fossLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 bg-black/15 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/70 transition hover:bg-black/25 hover:text-white"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : teaching.everydayThings && teaching.everydayThings.length > 0 ? (
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
          ) : null}
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
