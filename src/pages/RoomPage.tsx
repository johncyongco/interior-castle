import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { Viewer } from '@photo-sphere-viewer/core'

export default function RoomPage() {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const viewerInstanceRef = useRef<Viewer | null>(null)

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const container = viewerRef.current
    if (!container) return undefined

    const viewer = new Viewer({
      container,
      panorama: '/room1.png',
      loadingTxt: 'Loading room...',
      defaultYaw: '0deg',
      defaultPitch: '0deg',
      mousemove: true,
      touchmoveTwoFingers: true,
      navbar: false,
      keyboard: false,
      mousewheelCtrlKey: false,
      caption: '',
    })

    viewerInstanceRef.current = viewer

    return () => {
      document.body.style.overflow = previousBodyOverflow
      viewer.destroy()
      viewerInstanceRef.current = null
    }
  }, [])

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div
        ref={viewerRef}
        className="absolute inset-0 overflow-hidden touch-none select-none"
        style={{ touchAction: 'none' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full border border-white/15 bg-black/30 px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl">
          360
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
