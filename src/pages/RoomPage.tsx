import type { MouseEvent, TouchEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

type DragEventLike = {
  clientX?: number
  touches?: Array<{ clientX: number }>
  changedTouches?: Array<{ clientX: number }>
}

function getClientX(event: DragEventLike) {
  return event.clientX ?? event.touches?.[0]?.clientX ?? event.changedTouches?.[0]?.clientX ?? 0
}

export default function RoomPage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLDivElement | null>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const offsetXRef = useRef(0)
  const offsetYRef = useRef(0)
  const [isEntered, setIsEntered] = useState(false)

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

  function handleDown(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) {
    if (!isEntered) {
      setIsEntered(true)
      return
    }

    isDraggingRef.current = true
    startXRef.current = getClientX(event)
    startYRef.current = 'touches' in event ? event.touches[0]?.clientY ?? 0 : event.clientY
  }

  function handleMove(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) {
    if (!isEntered || !isDraggingRef.current || !imageRef.current) return

    const clientX = getClientX(event)
    const clientY = 'touches' in event ? event.touches[0]?.clientY ?? 0 : event.clientY
    const delta = clientX - startXRef.current
    const deltaY = clientY - startYRef.current

    offsetXRef.current += delta * 0.2
    offsetYRef.current += deltaY * 0.12
    startXRef.current = clientX
    startYRef.current = clientY
    imageRef.current.style.setProperty('--drag-x', `${offsetXRef.current}px`)
    imageRef.current.style.setProperty('--drag-y', `${offsetYRef.current}px`)
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
          ref={imageRef}
          className={`absolute inset-0 transition-transform duration-700 ${
            isEntered ? 'scale-[1.14]' : 'scale-100'
          }`}
          style={{
            backgroundImage: `url('/room1.png')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0px center',
            transformOrigin: 'center center',
            transform: isEntered
              ? 'perspective(1400px) translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 0) rotateY(calc(var(--drag-x, 0px) * 0.02)) rotateX(calc(var(--drag-y, 0px) * -0.015)) scale(1.14)'
              : 'scale(1)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />

        {!isEntered ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/15 bg-black/30 px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl">
              Tap to enter
            </div>
          </div>
        ) : null}
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
