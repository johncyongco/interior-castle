import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { SoftCard } from '../components/SoftCard'

const DELIVERANCE_STEPS = [
  'Prayer for Protection',
  'Prayer to Take Authority',
  'Prayer for Protection before a Deliverance Session',
  'Prayer to Break Seals and Consecrations',
  'Prayer To Break Curses and Spells',
  'Prayer of Deliverance (I) and (II)',
]

export default function DeliverancePrayerPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[url('/candle.png')] bg-cover bg-center opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.12),transparent_28%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.52))]" />

      <div className="relative flex h-full flex-col px-6 py-10 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/prayer"
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Back
            </Link>
            <p className="text-xs uppercase tracking-[0.28em] text-[#c6a47a]">AMOE Prayer</p>
          </div>

          <div className="mt-3 space-y-2 text-center">
            <h1 className="serif text-2xl tracking-wide text-[#e7cba9]">Deliverance Prayer</h1>
            <p className="mx-auto max-w-xs text-sm leading-6 text-[#c6a47a]">
              The AMOE handbook organizes the session into a sequence of protection, authority, and deliverance prayers.
            </p>
          </div>

          <SoftCard className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Session Flow</p>
            <div className="space-y-3">
              {DELIVERANCE_STEPS.map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="serif text-lg text-white">{step}</p>
                </div>
              ))}
            </div>
          </SoftCard>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft space-y-3">
            <p className="text-sm leading-7 text-white/70">
              Paste the exact AMOE Philippines wording here when you have the SharePoint text. Until then, this page
              preserves the structure and makes the intended flow clear.
            </p>
            <a
              href="https://teamholyrosary.com/guide-to-prayer-of-deliverance-by-fr-syquia/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#c6a47a] underline decoration-white/20 underline-offset-4 transition hover:text-[#e7cba9]"
            >
              Deliverance guide reference
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
