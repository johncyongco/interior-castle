import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

const catechismUrl = 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM'

export default function CccPage() {
  const dateStamp = useMemo(() => new Date().toISOString(), [])

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,236,199,0.12),transparent_26%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.42))]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/castle-gate.png')] bg-cover bg-center opacity-[0.03]" />

      <div className="relative flex h-full flex-col px-6 py-10 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/room"
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Back to Room
            </Link>
            <p className="text-xs uppercase tracking-[0.28em] text-[#c6a47a]">CCC Window</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-soft">
            <iframe
              title="Catechism of the Catholic Church"
              src={catechismUrl}
              className="h-[72vh] w-full rounded-2xl border-0 bg-black"
              data-loaded-at={dateStamp}
            />
          </div>

          <a
            href={catechismUrl}
            target="_blank"
            rel="noreferrer"
            className="text-center text-xs text-[#c6a47a] underline decoration-white/20 underline-offset-4 transition hover:text-[#e7cba9]"
          >
            Open Catechism index directly
          </a>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
