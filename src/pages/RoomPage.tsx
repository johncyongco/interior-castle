import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { useInteriorStore } from '../store/interiorStore'

const ROOM_SCENES: RoomScene[] = [
  {
    id: 1,
    label: 'Panorama',
    src: '/chair-room.png',
    subtitle: 'A quiet entry with a simple chair and stillness.',
  },
  {
    id: 2,
    label: 'Panorama',
    src: '/room1.png',
    subtitle: 'Warm light gathers across the walls.',
  },
  {
    id: 3,
    label: 'Panorama',
    src: '/room2.png',
    subtitle: 'A deeper, softer atmosphere begins.',
  },
  {
    id: 4,
    label: 'Panorama',
    src: '/room3.png',
    subtitle: 'The light turns quieter and more contemplative.',
  },
]

type RoomScene = {
  id: number
  label: string
  src: string
  subtitle: string
}

export default function RoomPage() {
  const roomStep = useInteriorStore((store) => store.roomStep)
  const setRoomStep = useInteriorStore((store) => store.setRoomStep)
  const advanceRoomStep = useInteriorStore((store) => store.advanceRoomStep)
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
      container.setPointerCapture?.(event.pointerId)
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
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-black/25 text-[10px] font-medium tracking-[0.32em] text-white/60 backdrop-blur-xl">
            360
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isFinalScene) {
                advanceRoomStep()
              }
            }}
            className="mt-auto btn-gold w-full disabled:opacity-60"
            disabled={isFinalScene}
          >
            {roomStep <= 1 ? 'Begin' : isFinalScene ? 'Remain' : 'Continue'}
          </button>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
