import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { teachings } from '../lib/communityTeachings'

export default function CommunityPage() {
  const navigate = useNavigate()
  const [isPurgatoryPreviewing, setIsPurgatoryPreviewing] = useState(false)
  const purgatoryVideoRef = useRef<HTMLVideoElement | null>(null)
  const longPressTimerRef = useRef<number | null>(null)
  const suppressNextClickRef = useRef(false)

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current)
      }
    }
  }, [])

  function startPurgatoryPreview() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current)
    }

    longPressTimerRef.current = window.setTimeout(() => {
      suppressNextClickRef.current = true
      setIsPurgatoryPreviewing(true)
      void purgatoryVideoRef.current?.play().catch(() => undefined)
    }, 450)
  }

  function stopPurgatoryPreview() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    if (isPurgatoryPreviewing) {
      purgatoryVideoRef.current?.pause()
      if (purgatoryVideoRef.current) {
        purgatoryVideoRef.current.currentTime = 0
      }
      setIsPurgatoryPreviewing(false)
    }
  }

  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-[url('/altar.png')] bg-cover opacity-10"
        style={{ backgroundPosition: 'center 24%' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.1),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.06),rgba(15,12,9,0.48))]" />
      <div className="relative flex h-full flex-col px-6 py-10 pb-28 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="flex min-h-full flex-col"
        >
          <div className="space-y-2 text-center">
            <h1 className="serif text-2xl text-center mb-3 text-[#e7cba9]">Community</h1>
          </div>

          <div className="mt-4 space-y-2">
            <div className="space-y-2">
              {teachings.map((teaching) => {
                const isFriendsOfTheSufferingCard = teaching.id === 'friends-of-the-suffering'

                return (
                <button
                  key={teaching.id}
                  type="button"
                  onClick={() => {
                    if (isFriendsOfTheSufferingCard && suppressNextClickRef.current) {
                      suppressNextClickRef.current = false
                      return
                    }

                    navigate(`/community/${teaching.id}`)
                  }}
                  className={`relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-left backdrop-blur-xl shadow-soft transition hover:bg-white/[0.08] ${
                    isFriendsOfTheSufferingCard ? 'min-h-32' : ''
                  }`}
                  onPointerDown={isFriendsOfTheSufferingCard ? startPurgatoryPreview : undefined}
                  onPointerUp={isFriendsOfTheSufferingCard ? stopPurgatoryPreview : undefined}
                  onPointerCancel={isFriendsOfTheSufferingCard ? stopPurgatoryPreview : undefined}
                  onPointerLeave={isFriendsOfTheSufferingCard ? stopPurgatoryPreview : undefined}
                  onContextMenu={isFriendsOfTheSufferingCard ? (event) => event.preventDefault() : undefined}
                  style={
                    isFriendsOfTheSufferingCard
                      ? {
                          backgroundImage:
                            "linear-gradient(180deg, rgba(18, 13, 11, 0.24), rgba(18, 13, 11, 0.82)), url('/Purgatory.png')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center center',
                        }
                      : undefined
                  }
                >
                  {isFriendsOfTheSufferingCard ? (
                    <>
                      <video
                        ref={purgatoryVideoRef}
                        src="/Purgatory-video.mp4"
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                          isPurgatoryPreviewing ? 'opacity-100' : 'opacity-0'
                        }`}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,220,170,0.18),transparent_35%)]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </>
                  ) : null}
                  <div className="relative z-10 space-y-1">
                    <h2
                      className={`serif text-lg ${
                        isFriendsOfTheSufferingCard
                          ? 'text-[#f3dfc0] drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]'
                          : 'text-[#e7cba9]'
                      }`}
                    >
                      {teaching.title}
                    </h2>
                    {teaching.text.trim() ? (
                      <p className="text-sm leading-5 text-white/70">{teaching.text}</p>
                    ) : null}
                  </div>
                </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-soft">
            <div className="space-y-2">
              <h2 className="serif text-lg text-[#e7cba9]">Companion</h2>
              <p className="text-sm leading-5 text-white/70">
                Open the companion prayer space.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/companion')}
              className="btn-gold mt-3 w-full"
            >
              Open Companion
            </button>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
