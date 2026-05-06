import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { SlowFade } from '../components/SlowFade'
import { getGuidanceLevel, useInteriorStore } from '../store/interiorStore'

type RoomScene = {
  id: number
  label: string
  src: string
  subtitle: string
}

const ROOM_SCENES: RoomScene[] = [
  {
    id: 1,
    label: 'Room',
    src: '/chair-room.png',
    subtitle: 'A quiet entry with a simple chair and stillness.',
  },
  {
    id: 2,
    label: 'Room',
    src: '/room1.png',
    subtitle: 'Warm light gathers across the walls.',
  },
  {
    id: 3,
    label: 'Room',
    src: '/room2.png',
    subtitle: 'A deeper, softer atmosphere begins.',
  },
  {
    id: 4,
    label: 'Room',
    src: '/room3.png',
    subtitle: 'The light turns quieter and more contemplative.',
  },
]

function roomCopy(state: ReturnType<typeof useInteriorStore.getState>['state'], roomStep: number) {
  const guidance = getGuidanceLevel(roomStep)

  if (state === 'tempted') {
    return ['You are being drawn outward. Return inward.']
  }

  if (state === 'distracted') {
    if (guidance === 'silent') {
      return ['Return.']
    }

    return ['You are split by many things. Let one thing remain.']
  }

  if (state === 'numb') {
    if (guidance === 'silent') {
      return ['Remain.']
    }

    return ['Stay still. A small honest word is enough.']
  }

  if (state === 'peaceful') {
    if (roomStep < 3) {
      return ['Stay here.', 'You are in His presence. Stay as you are.']
    }

    return ['Remain.', 'You are in His presence. Stay as you are.']
  }

  if (guidance === 'silent') {
    return ['Return.']
  }

  return ['You are scattered. Let us gather.', 'Take a moment to come back to the here.']
}

export default function RoomPage() {
  const mood = useInteriorStore((store) => store.mood)
  const roomStep = useInteriorStore((store) => store.roomStep)
  const setRoomStep = useInteriorStore((store) => store.setRoomStep)
  const advanceRoomStep = useInteriorStore((store) => store.advanceRoomStep)
  const lines = useMemo(() => roomCopy(mood, roomStep), [mood, roomStep])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const textureRef = useRef<THREE.Texture | null>(null)
  const frameRef = useRef<number | null>(null)
  const lonRef = useRef(0)
  const latRef = useRef(0)
  const isDraggingRef = useRef(false)
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null)

  const currentScene = ROOM_SCENES[Math.min(Math.max(roomStep, 1), ROOM_SCENES.length) - 1]
  const isFinalScene = roomStep >= ROOM_SCENES.length

  useEffect(() => {
    if (roomStep < 1) {
      setRoomStep(1)
    }
  }, [roomStep, setRoomStep])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100)
    camera.position.set(0, 0, 0.1)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    materialRef.current = material
    meshRef.current = mesh

    const updateSize = () => {
      const nextWidth = window.innerWidth
      const nextHeight = window.innerHeight
      camera.aspect = nextWidth / nextHeight
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
    }

    const onPointerDown = (event: PointerEvent) => {
      isDraggingRef.current = true
      lastPointerRef.current = { x: event.clientX, y: event.clientY }
      if (event.target instanceof HTMLElement) {
        event.target.setPointerCapture?.(event.pointerId)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current || !lastPointerRef.current) return

      const deltaX = event.clientX - lastPointerRef.current.x
      const deltaY = event.clientY - lastPointerRef.current.y
      lastPointerRef.current = { x: event.clientX, y: event.clientY }

      lonRef.current += deltaX * 0.1
      latRef.current -= deltaY * 0.1
    }

    const onPointerUp = () => {
      isDraggingRef.current = false
      lastPointerRef.current = null
    }

    const onResize = () => updateSize()

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('resize', onResize)

    const animate = () => {
      frameRef.current = window.requestAnimationFrame(animate)

      latRef.current = Math.max(-85, Math.min(85, latRef.current))

      const phi = THREE.MathUtils.degToRad(90 - latRef.current)
      const theta = THREE.MathUtils.degToRad(lonRef.current)

      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta),
      )

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }

      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('resize', onResize)

      textureRef.current?.dispose()
      material.dispose()
      geometry.dispose()
      renderer.dispose()

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  useEffect(() => {
    const material = materialRef.current
    if (!material) return undefined

    const loader = new THREE.TextureLoader()
    let cancelled = false

    loader.load(currentScene.src, (texture) => {
      if (cancelled) {
        texture.dispose()
        return
      }

      textureRef.current?.dispose()
      texture.colorSpace = THREE.SRGBColorSpace
      textureRef.current = texture
      material.map = texture
      material.needsUpdate = true
    })

    return () => {
      cancelled = true
    }
  }, [currentScene.src])

  return (
    <ScreenContainer>
      <div ref={containerRef} className="absolute inset-0 bg-black touch-none cursor-grab active:cursor-grabbing" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
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
            <div className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-right backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/45">360 Panorama</p>
              <p className="text-xs text-white/70">{currentScene.label}</p>
              <p className="max-w-[14rem] text-[10px] leading-4 text-white/45">{currentScene.subtitle}</p>
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-white/60 backdrop-blur-xl">
            Drag to look around
          </div>

          <div className="mt-auto grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,236,199,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(214,185,140,0.08),transparent_48%)]" />
              <div className="relative space-y-4 py-8 text-center">
                {lines.map((line) => (
                  <SlowFade key={line}>
                    <p className="serif text-2xl leading-snug text-white/95">{line}</p>
                  </SlowFade>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isFinalScene) {
                  advanceRoomStep()
                }
              }}
              className="btn-gold w-full disabled:opacity-60"
              disabled={isFinalScene}
            >
              {roomStep <= 1 ? 'Begin' : isFinalScene ? 'Remain' : 'Continue'}
            </button>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
