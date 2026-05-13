import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

type PopupState = 'none' | 'st-teresa' | 'st-therese' | 'gospel' | 'narnia'

let setActiveGlobal: ((state: PopupState) => void) | null = null

export function openPopup(state: 'st-teresa' | 'st-therese' | 'gospel' | 'narnia') {
  setActiveGlobal?.(state)
}

export default function RoomPopups() {
  const navigate = useNavigate()
  const [active, setActive] = useState<PopupState>('none')
  const [narniaAnswer, setNarniaAnswer] = useState('')
  const [narniaError, setNarniaError] = useState('')

  useEffect(() => {
    setActiveGlobal = setActive
    return () => { setActiveGlobal = null }
  }, [])

  const dateString = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  return createPortal(
    <>
      <AnimatePresence>
        {active === 'gospel' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex h-[80vh] w-full max-w-lg flex-col rounded-3xl border border-white/10 bg-[#0f0c09cc] p-4 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between pb-2">
                <p className="text-xs uppercase tracking-[0.28em] text-[#c6a47a]">{dateString}</p>
                <button
                  type="button"
                  onClick={() => setActive('none')}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] text-white/70 backdrop-blur-xl transition hover:shadow-glow"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 rounded-2xl border border-white/10 bg-black p-2">
                <iframe
                  title="Daily Gospel Reading"
                  src={`https://living-bread.com/?date=${dateString}`}
                  className="h-full w-full rounded-xl border-0 bg-black"
                />
              </div>
              <a
                href={`https://living-bread.com/?date=${dateString}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-center text-[10px] text-[#c6a47a] underline decoration-white/20 underline-offset-4 transition hover:text-[#e7cba9]"
              >
                Open on living-bread.com
              </a>
            </motion.div>
          </motion.div>
        )}

        {active === 'st-teresa' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#0f0c09cc] p-6 text-center backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
            >
              <p className="serif text-lg leading-relaxed text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-xl">
                St. Teresa of Ávila
              </p>
              <p className="mt-4 text-sm leading-6 text-[#e7cba9]/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                &ldquo;Let nothing disturb you. Let nothing frighten you. All things pass away. God never changes. Patience obtains all things. Whoever has God lacks nothing. God alone suffices.&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setActive('none')}
                className="mt-6 rounded-3xl border border-white/14 bg-white/[0.05] px-6 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:bg-white/[0.1]"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}

        {active === 'st-therese' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#0f0c09cc] p-6 text-center backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
            >
              <p className="serif text-base leading-relaxed text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-lg">
                Miraculous Invocation to St. Thérèse
              </p>
              <div className="mt-4 space-y-3 text-left text-sm leading-6 text-[#e7cba9]/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                <p>O Glorious St. Thérèse, whom Almighty God has raised up to aid and inspire the human family, I implore your Miraculous Intercession.</p>
                <p>You are so powerful in obtaining every need of body and spirit from the Heart of God. Holy Mother Church proclaims you &ldquo;Prodigy of Miracles&hellip; the greatest saint of Modern Times.&rdquo;</p>
                <p>Now I fervently beseech you to answer my petition <em>(mention in silence here)</em> and to carry out your promises of spending heaven doing good on earth&hellip; of letting fall from Heaven a Shower of Roses.</p>
                <p>Little Flower, give me your childlike faith, to see the Face of God in the people and experiences of my life, and to love God with full confidence.</p>
                <p>St. Thérèse, my Carmelite Sister, I will fulfill your plea &ldquo;to be made known everywhere&rdquo; and I will continue to lead others to Jesus through you.</p>
                <p className="pt-2 text-center text-[#e7cba9]">Amen.</p>
              </div>
              <button
                type="button"
                onClick={() => setActive('none')}
                className="mt-6 rounded-3xl border border-white/14 bg-white/[0.05] px-6 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:bg-white/[0.1]"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}

        {active === 'narnia' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0f0c09cc] p-6 text-center backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
            >
              <p className="serif text-lg leading-relaxed text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">A Riddle</p>
              <p className="mt-3 text-sm leading-6 text-[#e7cba9]/80">&ldquo;Where did Reepicheep finally rest?&rdquo;</p>
              <input
                value={narniaAnswer}
                onChange={(e) => { setNarniaAnswer(e.target.value); setNarniaError('') }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const a = narniaAnswer.trim().toLowerCase()
                    if (a.includes('aslan') && (a.includes('country') || a.includes('home'))) {
                      try { window.sessionStorage.setItem('spero-room-entry', 'door') } catch {}
                      setActive('none')
                      setNarniaAnswer('')
                      navigate('/narnia')
                    } else {
                      setNarniaError('Not quite. Try again.')
                    }
                  }
                }}
                placeholder="Your answer..."
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center text-base text-white outline-none placeholder:text-white/30 backdrop-blur-xl transition focus:border-white/30"
                autoFocus
              />
              {narniaError && <p className="mt-2 text-xs text-red-400/70">{narniaError}</p>}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const a = narniaAnswer.trim().toLowerCase()
                    if (a.includes('aslan') && (a.includes('country') || a.includes('home'))) {
                      try { window.sessionStorage.setItem('spero-room-entry', 'door') } catch {}
                      setActive('none')
                      setNarniaAnswer('')
                      navigate('/narnia')
                    } else {
                      setNarniaError('Not quite. Try again.')
                    }
                  }}
                  className="flex-1 rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/[0.1]"
                >
                  Enter Narnia
                </button>
                <button type="button" onClick={() => { setActive('none'); setNarniaAnswer(''); setNarniaError('') }} className="rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-2 text-xs text-white/60 backdrop-blur-xl transition hover:bg-white/[0.1]">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>,
    document.body,
  )
}
