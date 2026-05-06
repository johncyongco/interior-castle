import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { clearReflectionHistory, loadReflectionHistory, type ReflectionEntry } from '../lib/reflectionJournal'

export default function ReflectionHistoryPage() {
  const navigate = useNavigate()
  const history = loadReflectionHistory()

  function clearHistory() {
    clearReflectionHistory()
    navigate('/reflection')
  }

  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-[url('/mirror.png')] bg-cover opacity-12"
        style={{ backgroundPosition: 'center 34%' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,236,199,0.11),transparent_22%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.48))]" />
      <div className="relative flex h-full flex-col px-6 py-10 pb-28 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex min-h-full flex-col"
        >
          <div className="flex items-center justify-between">
            <Link to="/reflection" className="text-xs text-[#c6a47a] transition hover:text-[#e7cba9]">
              Back
            </Link>
            <button
              type="button"
              onClick={clearHistory}
              className="rounded-full border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
            >
              Clear history
            </button>
          </div>

          <div className="mt-4 space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Your Reflections</p>
            <h1 className="serif text-2xl text-[#e7cba9]">Saved Entries</h1>
            <p className="text-center text-sm text-[#c6a47a]">
              Saved entries and the quotes they surfaced.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {history.length > 0 ? (
              history.map((entry) => (
                <ReflectionEntryCard key={`${entry.createdAt}-${entry.question}`} entry={entry} />
              ))
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
                <p className="text-sm leading-6 text-white/55">No saved reflections yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}

function ReflectionEntryCard({ entry }: { entry: ReflectionEntry }) {
  return (
    <div className="space-y-2 rounded-3xl border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl shadow-soft">
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#c6a47a]">{entry.title}</p>
        <p className="text-sm text-white/85">{entry.question}</p>
      </div>
      <p className="serif text-lg leading-snug text-white/95">{entry.passage}</p>
      <p className="text-xs text-white/40">{new Date(entry.createdAt).toLocaleString()}</p>
    </div>
  )
}
