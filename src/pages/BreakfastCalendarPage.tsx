import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function BreakfastCalendarPage() {
  const navigate = useNavigate()

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
              title="Daily Mass Calendar"
              src="https://calendar.google.com/calendar/embed?src=t0goendl3jsjbcuemc06g6r3o4%40group.calendar.google.com&ctz=Asia%2FManila"
              className="h-full w-full rounded-2xl border-0 bg-black"
            />
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
