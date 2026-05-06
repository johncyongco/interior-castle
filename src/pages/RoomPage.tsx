import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function RoomPage() {
  const panoramaRef = useRef<HTMLDivElement | null>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const offsetXRef = useRef(0)
  const offsetYRef = useRef(0)
  const [dragStyle, setDragStyle] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

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

  function getClientPoint(event: PointerEvent<HTMLDivElement>) {
    return { x: event.clientX, y: event.clientY }
  }

  function updateDrag(deltaX: number, deltaY: number) {
    offsetXRef.current += deltaX * 0.3
    offsetYRef.current += deltaY * 0.12
    setDragStyle({ x: offsetXRef.current, y: offsetYRef.current })
  }

  return (
    <ScreenContainer>
      <div
        ref={panoramaRef}
        className="absolute inset-0 overflow-hidden select-none touch-none bg-black"
        style={{ perspective: '1400px', touchAction: 'none' }}
        onPointerDown={(event) => {
          setIsDragging(true)
          isDraggingRef.current = true
          const { x, y } = getClientPoint(event)
          startXRef.current = x
          startYRef.current = y
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!isDraggingRef.current) return
          const { x, y } = getClientPoint(event)
          const deltaX = x - startXRef.current
          const deltaY = y - startYRef.current
          startXRef.current = x
          startYRef.current = y
          updateDrag(deltaX, deltaY)
        }}
        onPointerUp={() => {
          isDraggingRef.current = false
          setIsDragging(false)
        }}
        onPointerCancel={() => {
          isDraggingRef.current = false
          setIsDragging(false)
        }}
        onLostPointerCapture={() => {
          isDraggingRef.current = false
          setIsDragging(false)
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[130%] w-[130%] max-w-none"
          style={{
            backgroundImage: "url('/room1.png')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            transform: `translate3d(calc(-50% + ${dragStyle.x}px), calc(-50% + ${dragStyle.y}px), 0)
              rotateY(${dragStyle.x * 0.02}deg)
              rotateX(${dragStyle.y * -0.015}deg)
              scale(1.15)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 180ms ease-out',
            willChange: 'transform',
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-white/15 bg-black/30 px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl">
            360
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative flex h-full flex-col px-6 py-10 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/saints"
              className="pointer-events-auto rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Saints
            </Link>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
