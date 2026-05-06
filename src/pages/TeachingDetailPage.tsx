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
          {!isPreviewing ? (
            <button
              type="button"
              onClick={triggerPreview}
              className="absolute inset-0 z-20 flex items-center justify-center select-none"
              aria-label="Play Purgatory video"
            >
              <div className="rounded-full border border-white/15 bg-black/15 px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-white/60 backdrop-blur-md shadow-soft transition hover:bg-black/20">
                Play
              </div>
            </button>
          ) : null}
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
          className={`flex min-h-full flex-col ${isFriendsOfTheSuffering ? 'pointer-events-none' : ''}`}
        >
          <div className="flex items-center justify-between">
            <Link
              to="/community"
              className={`text-xs text-[#c6a47a] transition hover:text-[#e7cba9] ${
                isFriendsOfTheSuffering ? 'pointer-events-auto' : ''
              }`}
            >
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
          ) : null}
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
