import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { SlowFade } from '../components/SlowFade'
import { getGuidanceLevel, useInteriorStore } from '../store/interiorStore'

function roomCopy(state: ReturnType<typeof useInteriorStore.getState>['state'], depth: number) {
  const guidance = getGuidanceLevel(depth)

  if (state === 'tempted') {
    return ['You are being drawn outward. Return inward.']
  }

  if (state === 'distracted') {
    if (guidance === 'silent') {
      return ['Return.']
    }

    return ['You are split by many things. Let one thing remain.']
  }

  if (state === 'numb') {
    if (guidance === 'silent') {
      return ['Remain.']
    }

    return ['Stay still. A small honest word is enough.']
  }

  if (state === 'peaceful') {
    if (depth < 3) {
      return ['Stay here.', 'You are in His presence. Stay as you are.']
    }

    return ['Remain.', 'You are in His presence. Stay as you are.']
  }

  if (guidance === 'silent') {
    return ['Return.']
  }

  return ['You are scattered. Let us gather.', 'Take a moment to come back to the here.']
}

export default function RoomPage() {
  const state = useInteriorStore((store) => store.state)
  const depth = useInteriorStore((store) => store.depth)
  const lines = roomCopy(state, depth)
  const navigate = useNavigate()

  return (
    <ScreenContainer>
      <div className="relative flex h-full flex-col gap-5">
        <div
          className="absolute inset-0 bg-[url('/chair-room.png')] bg-cover opacity-22"
          style={{ backgroundPosition: 'center 28%' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative flex h-full flex-1 items-center px-6 py-10 pb-28"
        >
          <div className="grid w-full gap-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Link
                  to="/saints"
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
                >
                  Saints
                </Link>
              </div>
              <h2 className="serif text-2xl tracking-wide text-[#e7cba9]">Room</h2>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,236,199,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(214,185,140,0.08),transparent_48%)]" />
              <div className="relative space-y-4 py-10 text-center">
                {lines.map((line) => (
                  <SlowFade key={line}>
                    <p className="serif text-2xl leading-snug text-white/95">{line}</p>
                  </SlowFade>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button onClick={() => navigate('/prayer')} className="btn-gold w-full">
                Begin
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
