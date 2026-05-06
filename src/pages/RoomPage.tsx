import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import type { MouseEvent, TouchEvent } from 'react'

export default function RoomPage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const offsetXRef = useRef(0)
  const activeImageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyTouchAction = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.touchAction = previousBodyTouchAction
    }
  }, [])

  function getClientX(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) {
    if ('touches' in event) {
      return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? 0
    }

    return event.clientX
  }

  function handleDown(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) {
    isDraggingRef.current = true
    startXRef.current = getClientX(event)
  }

  function handleMove(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) {
    if (!isDraggingRef.current || !activeImageRef.current) return

    const clientX = getClientX(event)
    const delta = clientX - startXRef.current

    offsetXRef.current += delta * 0.2
    startXRef.current = clientX
    activeImageRef.current.style.backgroundPosition = `${offsetXRef.current}px center`
  }

  function handleUp() {
    isDraggingRef.current = false
  }

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden touch-none cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchMove={(event) => {
          handleMove(event)
          event.preventDefault()
        }}
        onTouchEnd={handleUp}
        onTouchCancel={handleUp}
      >
        <div
          ref={activeImageRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/room1.png')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: '0px center',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
      </div>

      <div className="relative flex h-full flex-col px-6 py-10 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/saints"
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Saints
            </Link>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-black/25 text-[10px] font-medium tracking-[0.32em] text-white/60 backdrop-blur-xl">
            360
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
