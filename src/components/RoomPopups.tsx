import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getActivePrayerRoom, leaveChannel, subscribeToJoinState } from '../lib/agora'

type PopupState = 'none' | 'st-teresa' | 'st-therese' | 'gospel'

let setActiveGlobal: ((state: PopupState) => void) | null = null

export function openPopup(state: 'st-teresa' | 'st-therese' | 'gospel') {
  setActiveGlobal?.(state)
}

export default function RoomPopups() {
  const navigate = useNavigate()
  const [active, setActive] = useState<PopupState>('none')
  const [activeRoom, setActiveRoom] = useState(getActivePrayerRoom())

  useEffect(() => {
    setActiveGlobal = setActive
    return () => { setActiveGlobal = null }
  }, [])

  useEffect(() => {
    return subscribeToJoinState(() => {
      setActiveRoom(getActivePrayerRoom())
    })
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
      </AnimatePresence>

      {/* Floating mini player for active prayer room */}
      {activeRoom && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-[#120e0bcc] px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
              <div className="min-w-0">
                <p className="truncate text-xs text-white/80">{activeRoom.name}</p>
                <p className="text-[9px] text-white/40">{activeRoom.mode} · Live</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const id = activeRoom.id
                  window.location.href = `/chapel/room/${id}`
                }}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] text-white/70 transition hover:bg-white/20"
              >
                Open
              </button>
              <button
                type="button"
                onClick={async () => {
                  await leaveChannel()
                }}
                className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] text-red-400/70 transition hover:bg-red-500/20"
              >
                Leave
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>,
    document.body,
  )
}
