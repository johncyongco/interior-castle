import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenContainer from '../components/ScreenContainer'
import { SoftCard } from '../components/SoftCard'
import { PrimaryButton } from '../components/PrimaryButton'
import { useInteriorStore } from '../store/interiorStore'

function prayerIntroCopy(state: ReturnType<typeof useInteriorStore.getState>['state']) {
  if (state === 'restless') return ['You are scattered.', 'Let us gather.']
  if (state === 'distracted') return ['You are split by many things.', 'Let one thing remain.']
  if (state === 'numb') return ['Stay still.', 'A small honest word is enough.']
  if (state === 'peaceful') return ['Stay here.', 'You are in His presence.']
  return ['Return.', 'Come back to the center.']
}

function PrayerIndex() {
  const navigate = useNavigate()
  const state = useInteriorStore((store) => store.state)
  const setRoomStep = useInteriorStore((store) => store.setRoomStep)
  const [hasBegun, setHasBegun] = useState(false)
  const introLines = useMemo(() => prayerIntroCopy(state), [state])

  useEffect(() => {
    setHasBegun(false)
  }, [state])

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[url('/candle.png')] bg-cover bg-center opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.12),transparent_28%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.5))]" />
      <div className="relative flex h-full flex-col px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="space-y-2 text-center pt-2">
            <h1 className="serif text-2xl tracking-wide text-[#e7cba9]">Prayer</h1>
            <p className="mx-auto max-w-xs text-sm leading-6 text-[#c6a47a]">Choose your mode</p>
          </div>

          {!hasBegun ? (
            <SoftCard className="mt-8 space-y-5 text-center">
              <div className="space-y-2">
                {introLines.map((line) => (
                  <p key={line} className="serif text-2xl leading-snug text-white/95">
                    {line}
                  </p>
                ))}
              </div>
              <p className="text-sm leading-6 text-white/65">
                This is the pause before prayer begins.
              </p>
              <PrimaryButton
                onClick={() => {
                  setRoomStep(1)
                  setHasBegun(true)
                }}
                className="w-full"
              >
                Begin
              </PrimaryButton>
            </SoftCard>
          ) : (
            <SoftCard className="mt-8 space-y-3">
              <button onClick={() => navigate('/prayer/silent')} className="quiet-button w-full">
                <div className="font-medium">Silent Prayer</div>
                <div className="mt-1 text-sm text-white/65">Set a timer and be still.</div>
              </button>
              <button onClick={() => navigate('/prayer/guided')} className="quiet-button w-full">
                <div className="font-medium">Guided Recollection</div>
                <div className="mt-1 text-sm text-white/65">Step-by-step interior gathering</div>
              </button>
              <button onClick={() => navigate('/prayer/presence')} className="quiet-button w-full">
                <div className="font-medium">Presence Mode</div>
                <div className="mt-1 text-sm text-white/65">Start and remain in God's presence.</div>
              </button>
              <button onClick={() => navigate('/prayer/time')} className="quiet-button w-full">
                <div className="font-medium">Set Your Prayer Time</div>
                <div className="mt-1 text-sm text-white/65">Mock for now. Choose a time for later.</div>
              </button>
            </SoftCard>
          )}

          <p className="mt-auto pt-6 text-center text-xs text-[#8c7a65]">You can return at any time.</p>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}

function SilentPrayerMode() {
  const increaseDepth = useInteriorStore((store) => store.increaseDepth)
  const [paused, setPaused] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(20 * 60)
  const [softBell, setSoftBell] = useState(false)

  useEffect(() => {
    if (paused || secondsLeft === 0) return undefined

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [paused, secondsLeft])

  const timerText = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
    const remainingSeconds = secondsLeft % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }, [secondsLeft])

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[url('/candle.png')] bg-cover bg-center opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.12),transparent_28%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.52))]" />
      <div className="relative flex h-full flex-col px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="space-y-2 text-center pt-2">
            <h1 className="serif text-2xl tracking-wide text-[#e7cba9]">Silent Prayer</h1>
          </div>

          <SoftCard className="mt-8 space-y-5 text-center">
            <div className="relative mx-auto h-36 w-36">
              <div className="absolute inset-5 rounded-full bg-[#e7cba9]/10 blur-2xl" />
              <div
                className="flicker relative mx-auto h-32 w-32 rounded-full bg-[url('/candle.png')] bg-cover shadow-glow"
                style={{ backgroundPosition: 'center center' }}
              />
            </div>
            <div className="serif text-5xl tracking-[0.12em] text-white">{timerText}</div>
            <p className="text-sm leading-6 text-white/70">Remain in His presence. He is here.</p>
            {softBell ? <p className="text-xs uppercase tracking-[0.28em] text-gold">Soft Bell</p> : null}
            <div className="flex justify-center pt-1">
              <button
                onClick={() => {
                  increaseDepth()
                  setPaused((value) => !value)
                }}
                className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm text-white backdrop-blur-xl transition hover:shadow-glow"
                aria-label="Pause"
              >
                {paused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </SoftCard>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 pt-5 text-xs text-white/65">
          <button
            onClick={() => {
              increaseDepth()
              setPaused(true)
              setSecondsLeft(0)
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition hover:shadow-glow"
          >
            End Early
          </button>
          <button
            onClick={() => {
              increaseDepth()
              setSoftBell((value) => !value)
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition hover:shadow-glow"
          >
            Soft Bell
          </button>
        </div>
      </div>
    </ScreenContainer>
  )
}

function GuidedRecollection() {
  const increaseDepth = useInteriorStore((store) => store.increaseDepth)
  const [step, setStep] = useState(0)
  const steps = ['Breathe slowly.', 'Notice what is present.', 'Return your attention inward.']

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.12),transparent_28%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.5))]" />
      <div className="relative flex h-full flex-col justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="space-y-2 text-center">
            <h1 className="serif text-2xl tracking-wide text-[#e7cba9]">Guided Recollection</h1>
          </div>
          <SoftCard className="space-y-4">
            <div className="space-y-3 text-sm leading-6 text-white/75">
              <p>Step-by-step interior gathering</p>
              <p>{steps[step]}</p>
            </div>
            <div className="flex gap-3">
              <PrimaryButton
                onClick={() => {
                  increaseDepth()
                  setStep((current) => Math.min(current + 1, steps.length - 1))
                }}
                className="flex-1"
              >
                Continue
              </PrimaryButton>
              <button
                onClick={() => setStep(steps.length - 1)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:shadow-glow"
              >
                Skip
              </button>
            </div>
          </SoftCard>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}

function PresenceMode() {
  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.12),transparent_28%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.5))]" />
      <div className="relative flex h-full flex-col justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="space-y-2 text-center">
            <h1 className="serif text-2xl tracking-wide text-[#e7cba9]">Presence Mode</h1>
          </div>
          <SoftCard>
            <p className="serif text-center text-2xl text-white">Start and remain in God's presence.</p>
          </SoftCard>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}

function PrayerTimeMock() {
  const navigate = useNavigate()
  const [selectedTime, setSelectedTime] = useState('7:00 AM')

  const choices = ['6:00 AM', '7:00 AM', '12:00 PM', '6:00 PM', '9:00 PM']

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[url('/candle.png')] bg-cover bg-center opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.12),transparent_28%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.5))]" />
      <div className="relative flex h-full flex-col px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="space-y-2 text-center pt-2">
            <h1 className="serif text-2xl tracking-wide text-[#e7cba9]">Set Your Prayer Time</h1>
            <p className="mx-auto max-w-xs text-sm leading-6 text-[#c6a47a]">
              Mock for now. This will become a quiet reminder later.
            </p>
          </div>

          <SoftCard className="mt-8 space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Selected</p>
              <p className="serif text-3xl text-white">{selectedTime}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setSelectedTime(choice)}
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    selectedTime === choice
                      ? 'border-[#e7cba9]/40 bg-[#e7cba9]/10 text-[#e7cba9]'
                      : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>

            <p className="text-xs leading-6 text-white/55">
              This is only a preview. No reminder is saved yet.
            </p>
          </SoftCard>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 pt-5">
          <button
            onClick={() => navigate('/prayer')}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/70 transition hover:shadow-glow"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/prayer')}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/70 transition hover:shadow-glow"
          >
            Continue
          </button>
        </div>
      </div>
    </ScreenContainer>
  )
}

export default function PrayerPage() {
  const location = useLocation()

  if (location.pathname === '/prayer') return <PrayerIndex />
  if (location.pathname === '/prayer/silent') return <SilentPrayerMode />
  if (location.pathname === '/prayer/guided') return <GuidedRecollection />
  if (location.pathname === '/prayer/presence') return <PresenceMode />
  if (location.pathname === '/prayer/time') return <PrayerTimeMock />

  return <PrayerIndex />
}
