import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { SoftCard } from '../components/SoftCard'
import { PrimaryButton } from '../components/PrimaryButton'

type MysterySetKey = 'joyful' | 'sorrowful' | 'glorious' | 'luminous'

const MYSTERY_SETS: Record<
  MysterySetKey,
  {
    title: string
    dayLabel: string
    mysteries: string[]
  }
> = {
  joyful: {
    title: 'Joyful Mysteries',
    dayLabel: 'Monday and Saturday',
    mysteries: [
      'The Annunciation',
      'The Visitation',
      'The Nativity',
      'The Presentation',
      'The Finding of Jesus in the Temple',
    ],
  },
  sorrowful: {
    title: 'Sorrowful Mysteries',
    dayLabel: 'Tuesday and Friday',
    mysteries: [
      'The Agony in the Garden',
      'The Scourging at the Pillar',
      'The Crowning with Thorns',
      'The Carrying of the Cross',
      'The Crucifixion',
    ],
  },
  glorious: {
    title: 'Glorious Mysteries',
    dayLabel: 'Wednesday and Sunday',
    mysteries: [
      'The Resurrection',
      'The Ascension',
      'The Descent of the Holy Spirit',
      'The Assumption of Mary',
      'The Coronation of Mary',
    ],
  },
  luminous: {
    title: 'Luminous Mysteries',
    dayLabel: 'Thursday',
    mysteries: [
      'The Baptism of Jesus',
      'The Wedding at Cana',
      'The Proclamation of the Kingdom',
      'The Transfiguration',
      'The Institution of the Eucharist',
    ],
  },
}

const ROSARY_STEPS = [
  'Make the Sign of the Cross and offer your intention.',
  'Pray the Apostles’ Creed.',
  'Pray the Our Father.',
  'Pray three Hail Marys for faith, hope, and charity.',
  'Pray the Glory Be.',
  'Pray the first decade with its mystery.',
  'Continue through the remaining decades.',
  'Conclude with the Hail Holy Queen and final prayers.',
]

const OPENING_PRAYERS = ['Sign of the Cross', 'Apostles’ Creed', 'Our Father', 'Three Hail Marys', 'Glory Be']
const CLOSING_PRAYERS = ['Hail Holy Queen', 'Final prayer for the Church and the faithful departed', 'Sign of the Cross']

function getMysterySetForToday(): MysterySetKey {
  const day = new Date().getDay()
  if (day === 1 || day === 6) return 'joyful'
  if (day === 2 || day === 5) return 'sorrowful'
  if (day === 3 || day === 0) return 'glorious'
  return 'luminous'
}

export default function RosaryPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [mysterySet, setMysterySet] = useState<MysterySetKey>(getMysterySetForToday())

  const stepText = useMemo(() => ROSARY_STEPS[Math.min(step, ROSARY_STEPS.length - 1)], [step])
  const activeMysteries = MYSTERY_SETS[mysterySet]
  const decadeNumber = Math.min(Math.max(step - 5, 0), 4)
  const activeMystery = activeMysteries.mysteries[decadeNumber]

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
            <p className="text-xs uppercase tracking-[0.28em] text-[#c6a47a]">Rosary Guide</p>
          </div>

          <div className="mt-5 space-y-2 text-center">
            <h1 className="serif text-2xl tracking-wide text-[#e7cba9]">Rosary</h1>
            <p className="mx-auto max-w-xs text-sm leading-6 text-[#c6a47a]">
              A full guided rosary with the day-based mystery sets and the core prayer flow.
            </p>
          </div>

          <SoftCard className="mt-8 space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Choose Mysteries</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(MYSTERY_SETS) as MysterySetKey[]).map((key) => {
                  const set = MYSTERY_SETS[key]
                  const isActive = mysterySet === key

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setMysterySet(key)
                        setStep(5)
                      }}
                      className={`rounded-2xl border px-3 py-3 text-left transition ${
                        isActive
                          ? 'border-[#e7cba9]/40 bg-[#e7cba9]/10 text-[#e7cba9]'
                          : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10'
                      }`}
                    >
                      <div className="serif text-base">{set.title}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/45">{set.dayLabel}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Today&apos;s Suggestion</p>
              <p className="serif mt-2 text-xl text-white">{activeMysteries.title}</p>
              <p className="mt-1 text-sm text-white/65">{activeMysteries.dayLabel}</p>
            </div>
          </SoftCard>

          <SoftCard className="mt-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                Step {step + 1} of {ROSARY_STEPS.length}
              </p>
              <p className="serif text-2xl text-white">{stepText}</p>
              {step === 5 ? (
                <p className="text-sm leading-6 text-white/65">
                  Pray the first decade while meditating on {activeMystery}.
                </p>
              ) : null}
              {step > 5 && step < 10 ? (
                <p className="text-sm leading-6 text-white/65">
                  Pray decade {decadeNumber + 1} with {activeMystery}.
                </p>
              ) : null}
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
                onClick={() => setStep((current) => Math.min(current + 1, ROSARY_STEPS.length - 1))}
                className="flex-1"
              >
                Next
              </PrimaryButton>
              <PrimaryButton onClick={() => setStep(0)} className="flex-1">
                Restart
              </PrimaryButton>
            </div>
          </SoftCard>

          <div className="mt-4 space-y-4 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Opening Prayers</p>
              <div className="space-y-2">
                {OPENING_PRAYERS.map((prayer) => (
                  <div key={prayer} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                    {prayer}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Mysteries</p>
              <div className="grid gap-2">
                {activeMysteries.mysteries.map((mystery, index) => (
                  <div key={mystery} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">Decade {index + 1}</p>
                    <p className="serif text-lg text-white">{mystery}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Closing Prayers</p>
              <div className="space-y-2">
                {CLOSING_PRAYERS.map((prayer) => (
                  <div key={prayer} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                    {prayer}
                  </div>
                ))}
              </div>
            </div>
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
