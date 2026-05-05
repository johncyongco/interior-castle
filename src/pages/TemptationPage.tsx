import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenContainer from '../components/ScreenContainer'
import { useInteriorStore } from '../store/interiorStore'

const steps = [
  'This is a desire.\nIt is not you.',
  'Do not fight it.\nFlee from it.',
  'Stay still.\nLet it pass.',
  'Return inward.\nYou are free.',
  'Hold on to what is true.',
]

export default function TemptationPage() {
  const navigate = useNavigate()
  const step = useInteriorStore((store) => store.temptationStep)
  const setStep = useInteriorStore((store) => store.setTemptationStep)
  const increaseDepth = useInteriorStore((store) => store.increaseDepth)

  useEffect(() => {
    if (step < 0 || step >= steps.length) {
      setStep(0)
    }
  }, [setStep, step])

  const currentStep = Math.min(Math.max(step, 0), steps.length - 1)
  const isFinalStep = currentStep === steps.length - 1

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_42%),linear-gradient(180deg,rgba(15,12,9,0.12),rgba(15,12,9,0.56))]" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative flex h-full flex-col px-6 py-10"
      >
        <div className="flex items-center justify-between text-xs text-white/45">
          <span>Temptation</span>
          <button
            type="button"
            onClick={() => navigate('/room')}
            className="transition hover:text-[#e7cba9]"
          >
            Skip
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="space-y-3">
            <h1 className="serif text-2xl text-[#e7cba9]">Temptation Passage</h1>
            <p className="text-sm text-[#c6a47a]">Phase {currentStep + 1} of {steps.length}</p>
          </div>

          <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-black/15 shadow-[0_0_50px_rgba(214,185,140,0.12)]">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-black/20 shadow-[0_0_40px_rgba(214,185,140,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
              <img
                src="/temptation-passage.gif"
                alt="Temptation passage"
                className="h-full w-full object-cover opacity-85"
              />
            </div>
          </div>

          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="serif mt-8 whitespace-pre-line text-3xl leading-tight text-[#e7cba9]"
          >
            {steps[currentStep]}
          </motion.p>

          <div className="mt-8 flex items-center gap-2">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === currentStep ? 'bg-[#e7cba9]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="btn-gold w-full"
            onClick={() => {
              if (isFinalStep) {
                increaseDepth()
                navigate('/community')
                return
              }
              setStep(currentStep + 1)
            }}
          >
            {isFinalStep ? 'Sursum Corda' : 'Next'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/room')}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:bg-white/10"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </ScreenContainer>
  )
}
