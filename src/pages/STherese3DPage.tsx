import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenContainer from '../components/ScreenContainer'

export default function STherese3DPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,244,220,0.12),transparent_28%),linear-gradient(180deg,rgba(15,12,9,0.06),rgba(15,12,9,0.5))]" />

      <div className="relative flex h-full flex-col px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                window.sessionStorage.setItem('spero-room-entry', 'door')
                navigate('/room')
              }}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Back to Room
            </button>
          </div>

          <div className="mt-6 flex flex-1 items-center justify-center">
            <div className="w-full max-w-[520px] rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl shadow-soft">
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-black">
                <iframe
                  title="Statue Sainte Thérèse de l'Enfant-Jésus"
                  src="https://sketchfab.com/models/a1560a95227b456bb84a02bdf4fb5eb2/embed"
                  className="h-[56vh] w-full border-0 bg-black sm:h-[62vh]"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
