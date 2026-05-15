import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function RoomEntryPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,244,220,0.12),transparent_26%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.42))]" />
      <div className="relative flex h-full items-stretch justify-stretch">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          type="button"
          aria-label="Enter the room"
          onClick={() => {
            window.sessionStorage.setItem('spero-room-entry', 'door')
            navigate('/room')
          }}
          className="group relative block h-full w-full overflow-hidden transition duration-300 ease-out active:scale-[0.999]"
        >
          <img
            src="/Door.png"
            alt="Door"
            className="absolute inset-0 h-full w-full select-none object-cover object-center drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.12),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.28))]" />
          <div className="pointer-events-none absolute inset-x-0 top-6 px-6 text-center">
            <p className="serif text-sm tracking-[0.22em] text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              John 10:9
            </p>
            <p className="mt-2 text-[13px] leading-5 text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              I am the gate. Whoever enters through me will be saved.
            </p>
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[9px] uppercase tracking-[0.26em] text-white/70 backdrop-blur-sm">
              Enter
            </span>
          </div>
        </motion.button>
      </div>
    </ScreenContainer>
  )
}
