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
