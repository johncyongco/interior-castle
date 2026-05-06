import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { SoftCard } from '../components/SoftCard'
import { PrimaryButton } from '../components/PrimaryButton'

const DIVINE_MERCY_STEPS = [
  'Make the Sign of the Cross.',
  'Pray the optional opening prayers, if desired.',
  'Say the Our Father, Hail Mary, and Apostles’ Creed.',
  'On each decade, pray the Eternal Father prayer.',
  'On each ten beads, pray for the sake of His sorrowful Passion.',
  'Conclude with Holy God, Holy Mighty One, Holy Immortal One.',
]

export default function DivineMercyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const stepText = DIVINE_MERCY_STEPS[Math.min(step, DIVINE_MERCY_STEPS.length - 1)]

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[url('/candle.png')] bg-cover bg-center opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.12),transparent_28%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.52))]" />

      <div className="relative flex h-full flex-col px-6 py-10 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/prayer"
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Back
            </Link>
            <p className="text-xs uppercase tracking-[0.28em] text-[#c6a47a]">Divine Mercy</p>
          </div>

          <div className="mt-5 space-y-2 text-center">
            <h1 className="serif text-2xl tracking-wide text-[#e7cba9]">Divine Mercy Chaplet</h1>
            <p className="mx-auto max-w-xs text-sm leading-6 text-[#c6a47a]">
              A guided chaplet based on the official public prayer structure.
            </p>
          </div>

          <SoftCard className="mt-8 space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                Step {step + 1} of {DIVINE_MERCY_STEPS.length}
              </p>
              <p className="serif text-2xl text-white">{stepText}</p>
            </div>

            <div className="flex gap-3">
              <PrimaryButton
                onClick={() => setStep((current) => Math.max(current - 1, 0))}
                className="flex-1"
                disabled={step === 0}
              >
                Previous
              </PrimaryButton>
              <PrimaryButton
                onClick={() => setStep((current) => Math.min(current + 1, DIVINE_MERCY_STEPS.length - 1))}
                className="flex-1"
              >
                Next
              </PrimaryButton>
              <PrimaryButton onClick={() => setStep(0)} className="flex-1">
                Restart
              </PrimaryButton>
            </div>
          </SoftCard>

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft space-y-3">
            <p className="text-sm leading-7 text-white/70">
              The chaplet uses ordinary rosary beads. This is a compact guide for the core sequence; it can later be
              expanded with the optional opening prayers, the closing prayer, and bead-by-bead prompts.
            </p>
            <a
              href="https://www.thedivinemercy.org/message/devotions/pray-the-chaplet"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#c6a47a] underline decoration-white/20 underline-offset-4 transition hover:text-[#e7cba9]"
            >
              Source on the Divine Mercy site
            </a>
          </div>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={() => navigate('/prayer')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:bg-white/10"
            >
              Return to Prayer
            </button>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
