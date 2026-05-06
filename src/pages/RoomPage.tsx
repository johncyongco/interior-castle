import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { useInteriorStore } from '../store/interiorStore'

type RoomScene = {
  id: number
  src: string
}

const ROOM_SCENES: RoomScene[] = [
  { id: 1, src: '/chair-room.png' },
  { id: 2, src: '/room1.png' },
  { id: 3, src: '/room2.png' },
  { id: 4, src: '/room3.png' },
]

export default function RoomPage() {
  const roomStep = useInteriorStore((store) => store.roomStep)
  const setRoomStep = useInteriorStore((store) => store.setRoomStep)
  const scene = ROOM_SCENES[Math.min(Math.max(roomStep, 1), ROOM_SCENES.length) - 1]
  const dragRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    x: 0,
    y: 0,
  })
  const [dragPoint, setDragPoint] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (roomStep < 1) {
      setRoomStep(1)
    }
  }, [roomStep, setRoomStep])

  const imageStyle = useMemo(
    () => ({
      transform: `translate3d(calc(-50% + ${dragPoint.x}px), calc(-50% + ${dragPoint.y}px), 0) scale(1.18)`,
    }),
    [dragPoint.x, dragPoint.y],
  )

  function syncDragPoint(nextX: number, nextY: number) {
    setDragPoint({ x: nextX, y: nextY })
  }

  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-black touch-none overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={(event) => {
          dragRef.current.active = true
          dragRef.current.lastX = event.clientX
          dragRef.current.lastY = event.clientY
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!dragRef.current.active) return

          const deltaX = event.clientX - dragRef.current.lastX
          const deltaY = event.clientY - dragRef.current.lastY
          dragRef.current.lastX = event.clientX
          dragRef.current.lastY = event.clientY

          const nextX = dragRef.current.x + deltaX * 0.6
          const nextY = dragRef.current.y + deltaY * 0.6
          dragRef.current.x = Math.max(-280, Math.min(280, nextX))
          dragRef.current.y = Math.max(-180, Math.min(180, nextY))
          syncDragPoint(dragRef.current.x, dragRef.current.y)
        }}
        onPointerUp={() => {
          dragRef.current.active = false
        }}
        onPointerCancel={() => {
          dragRef.current.active = false
        }}
        onTouchStart={(event) => {
          if (event.touches.length === 0) return
          dragRef.current.active = true
          dragRef.current.lastX = event.touches[0].clientX
          dragRef.current.lastY = event.touches[0].clientY
        }}
        onTouchMove={(event) => {
          if (!dragRef.current.active || event.touches.length === 0) return

          const nextX = event.touches[0].clientX
          const nextY = event.touches[0].clientY
          const deltaX = nextX - dragRef.current.lastX
          const deltaY = nextY - dragRef.current.lastY
          dragRef.current.lastX = nextX
          dragRef.current.lastY = nextY

          const updatedX = dragRef.current.x + deltaX * 0.6
          const updatedY = dragRef.current.y + deltaY * 0.6
          dragRef.current.x = Math.max(-280, Math.min(280, updatedX))
          dragRef.current.y = Math.max(-180, Math.min(180, updatedY))
          syncDragPoint(dragRef.current.x, dragRef.current.y)
          event.preventDefault()
        }}
        onTouchEnd={() => {
          dragRef.current.active = false
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
        <img
          src={scene.src}
          alt="Room panorama"
          className="absolute left-1/2 top-1/2 h-[120%] w-[120%] max-w-none select-none object-cover"
          style={imageStyle}
          draggable={false}
        />
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
