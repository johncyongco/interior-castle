import { useState, useRef } from 'react'
import ScreenContainer from '../components/ScreenContainer'

export default function FirstMansionPage() {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      {playing ? (
        <video
          ref={videoRef}
          src="/First%20Mansion.mp4"
          autoPlay
          playsInline
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[url('/1st%20Mansion.jpg')] bg-cover bg-center bg-no-repeat"
          style={{ backgroundPosition: 'center center' }}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,244,220,0.1),transparent_28%),linear-gradient(180deg,rgba(12,10,8,0.08),rgba(12,10,8,0.45))]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
          >
            <svg viewBox="0 0 24 24" className="h-14 w-14 fill-white/60 transition hover:fill-white/80 hover:scale-105">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] left-0 right-0 z-20 flex justify-center">
        <p className="serif text-xs text-[#e7cba9]/55 sm:text-sm">You are in the 1st Mansion</p>
      </div>
    </ScreenContainer>
  )
}
