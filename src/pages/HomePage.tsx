import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInteriorStore, type InteriorState } from '../store/interiorStore'
import { logInteriorState } from '../lib/speroIdentity'
import ScreenContainer from '../components/ScreenContainer'
import ChoiceButton from '../components/ChoiceButton'

const options: InteriorState[] = ['restless', 'distracted', 'tempted', 'numb', 'peaceful']

const labels: Record<InteriorState, string> = {
  restless: 'Restless',
  distracted: 'Distracted',
  tempted: 'Tempted',
  numb: 'Numb',
  peaceful: 'Peaceful',
}

export default function HomePage() {
  const navigate = useNavigate()
  const setMood = useInteriorStore((store) => store.setMood)
  const setTemptationStep = useInteriorStore((store) => store.setTemptationStep)
  const setRoomStep = useInteriorStore((store) => store.setRoomStep)

  return (
    <ScreenContainer>
      <div className="gate-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,244,220,0.12),transparent_26%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.42))]" />
      <div className="relative flex h-full items-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="grid w-full gap-8 text-center"
          style={{ gridTemplateRows: 'auto auto auto' }}
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-[#c6a47a]">
              Interior Castle
            </p>
            <h1 className="serif text-2xl">Where are you today?</h1>
            <p className="text-sm text-[#c6a47a]">
              Be honest. This helps us guide you inward.
            </p>
          </div>

          <div className="relative mx-auto w-[min(76vw,20rem)]">
            <button
              type="button"
              onClick={() => navigate('/room')}
              aria-label="Enter the room"
              className="group relative block w-full overflow-hidden rounded-[28px] transition duration-300 ease-out hover:scale-[1.01] active:scale-[0.99]"
            >
              <img
                src="/Door.png"
                alt="Door"
                className="block h-auto w-full select-none object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.12),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.28))]" />
              <div className="pointer-events-none absolute inset-x-0 top-4 px-6 text-center">
                <p className="serif text-sm tracking-[0.22em] text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  John 10:9 NABRE
                </p>
                <p className="mt-2 text-[13px] leading-5 text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  I am the gate. Whoever enters through me will be saved.
                </p>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[9px] uppercase tracking-[0.26em] text-white/70 backdrop-blur-sm">
                  Enter
                </span>
              </div>
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option) => (
              <ChoiceButton
                key={option}
                label={labels[option]}
                onClick={() => {
                  setMood(option)
                  void logInteriorState(option)
                  if (option === 'tempted') {
                    setTemptationStep(0)
                    navigate('/temptation')
                  } else {
                    setRoomStep(1)
                    navigate('/prayer')
                  }
                }}
              >
              </ChoiceButton>
            ))}
          </div>

          <p className="text-xs text-[#8c7a65]">
            You can change this anytime.
          </p>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
