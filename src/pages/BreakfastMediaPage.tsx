import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function BreakfastMediaPage() {
  const navigate = useNavigate()
  const videoId = 'mnOTH_3dprI'
  const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`

  const backToBreakfast = () => {
    window.sessionStorage.setItem('spero-room-entry', 'door')
    navigate('/breakfast')
  }

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,244,220,0.12),transparent_26%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.42))]" />

      <div className="relative flex h-full flex-col px-6 py-10 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={backToBreakfast}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Back to Breakfast
            </button>
          </div>

          <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.05] p-2 backdrop-blur-xl shadow-soft sm:p-4">
            <iframe
              title="YouTube Video"
              src={youtubeUrl}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="h-full w-full rounded-2xl border-0 bg-black"
            />
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noreferrer"
            className="text-center text-xs text-[#c6a47a] underline decoration-white/20 underline-offset-4 transition hover:text-[#e7cba9]"
          >
            Open on YouTube
          </a>

          <p className="serif text-center text-[13px] leading-5 text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            &ldquo;I am with you always, until the end of the age.&rdquo;
          </p>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
