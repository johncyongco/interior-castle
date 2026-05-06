import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

const DEFAULT_SOULS = [
  'Deceased family members',
  'Forgotten souls in Purgatory',
  'Souls with no one to pray for them',
  'Souls of priests and religious',
  'Souls who died suddenly',
  'Friends and benefactors',
]

const STORAGE_KEY = 'spero-friends-of-the-suffering-souls'

export default function SoulsDetailPage() {
  const [souls, setSouls] = useState<string[]>([])
  const [soulInput, setSoulInput] = useState('')
  const location = useLocation()
  const backToCommunity = location.state?.from === 'room' ? '/room' : '/community/friends-of-the-suffering'

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw) as string[]
      if (Array.isArray(parsed)) {
        setSouls(parsed.filter((name) => typeof name === 'string' && name.trim().length > 0))
      }
    } catch {
      setSouls([])
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(souls))
    } catch {
      return
    }
  }, [souls])

  function addSoul() {
    const nextSoul = soulInput.trim()
    if (!nextSoul) return

    setSouls((current) => (current.includes(nextSoul) ? current : [...current, nextSoul]))
    setSoulInput('')
  }

  function removeSoul(name: string) {
    setSouls((current) => current.filter((soul) => soul !== name))
  }

  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-[url('/Purgatory.png')] bg-cover"
        style={{ backgroundPosition: 'center center' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,220,170,0.18),transparent_35%),linear-gradient(180deg,rgba(18,13,11,0.20),rgba(18,13,11,0.78))]" />
      <div className="relative flex h-full flex-col px-6 py-10 pb-28 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex min-h-full flex-col"
        >
          <div className="flex items-center justify-between">
            <Link to={backToCommunity} className="text-xs text-[#c6a47a] transition hover:text-[#e7cba9]">
              Back
            </Link>
          </div>

          <div className="mt-4 space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Souls</p>
            <h1 className="serif text-2xl text-[#e7cba9]">Add Names for Prayer</h1>
            <p className="text-sm leading-5 text-white/70">
              Add the names of souls you want to remember in prayer.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {DEFAULT_SOULS.map((soul) => (
                  <div
                    key={soul}
                    className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white/75"
                  >
                    {soul}
                  </div>
                ))}
                {souls.map((soul) => (
                  <div
                    key={soul}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/85"
                  >
                    <span>{soul}</span>
                    <button
                      type="button"
                      onClick={() => removeSoul(soul)}
                      className="text-[10px] uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft space-y-3">
              <label className="text-[10px] uppercase tracking-[0.22em] text-white/45" htmlFor="soul-name">
                Add a name
              </label>
              <div className="flex gap-2">
                <input
                  id="soul-name"
                  value={soulInput}
                  onChange={(event) => setSoulInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addSoul()
                    }
                  }}
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold/50"
                  placeholder="Enter a soul name"
                />
                <button
                  type="button"
                  onClick={addSoul}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:bg-white/15 hover:text-white"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
