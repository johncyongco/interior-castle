import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import ScreenContainer from '../components/ScreenContainer'
import { supabase } from '../lib/supabase'

const USERNAME_KEY = 'spero-chapel-username'

function vector3ToSpherical(point: THREE.Vector3) {
  const radius = point.length()
  const lon = THREE.MathUtils.radToDeg(Math.atan2(point.z, point.x))
  const lat = THREE.MathUtils.radToDeg(Math.asin(point.y / radius))
  return { lon, lat }
}

type CoordinatePanel = {
  label: string
  source: string
  lon: number | null
  lat: number | null
}

type PrayerMode = {
  id: string
  name: string
  type: 'public' | 'private'
  creator: string
}

type HotspotPoint = {
  id: string
  label: string
  lon: number
  lat: number
  onClick: () => void
}

function sphericalToVector3(lonDeg: number, latDeg: number, radius = 499) {
  const lon = THREE.MathUtils.degToRad(lonDeg)
  const lat = THREE.MathUtils.degToRad(latDeg)
  return new THREE.Vector3(radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.sin(lon))
}

export default function ChapelPage() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const hotspotRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const instructionRef = useRef<HTMLDivElement | null>(null)
  const [username, setUsername] = useState('')
  const [showPrompt, setShowPrompt] = useState(true)
  const [modes, setModes] = useState<PrayerMode[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newModeName, setNewModeName] = useState('')
  const [newModeType, setNewModeType] = useState<'public' | 'private'>('public')
  const [coordinatePanel, setCoordinatePanel] = useState<CoordinatePanel>({ label: 'Chapel', source: 'Tap the panorama', lon: null, lat: null })

  const chapelHotspots: HotspotPoint[] = [
    {
      id: 'heart-icon',
      label: 'Heart Icon',
      lon: -155.94,
      lat: 7.94,
      onClick: () => console.log('Prayer room — coming soon'),
    },
  ]

  useEffect(() => {
    const saved = localStorage.getItem(USERNAME_KEY)
    if (saved) {
      setUsername(saved)
      setShowPrompt(false)
    }
  }, [])

  const handleJoin = useCallback(() => {
    const name = username.trim()
    if (!name) return
    localStorage.setItem(USERNAME_KEY, name)
    setShowPrompt(false)
  }, [username])

  const createMode = useCallback(() => {
    const name = newModeName.trim()
    if (!name) return
    const mode: PrayerMode = {
      id: crypto.randomUUID(),
      name,
      type: newModeType,
      creator: username,
    }
    setModes((prev) => [...prev, mode])
    setNewModeName('')
    setShowCreate(false)
  }, [newModeName, newModeType, username])

  const joinMode = useCallback((mode: PrayerMode) => {
    if (mode.type === 'private') {
      const code = prompt('Enter the passcode for this prayer mode:')
      if (!code) return
    }
    // Join the prayer mode — for now just console
    console.log(`${username} joined ${mode.name}`)
  }, [username])

  useEffect(() => {
    if (showPrompt || !username) return
    if (!supabase) return
    // Future: sync prayer modes via Supabase
  }, [showPrompt, username])

  useEffect(() => {
    if (showPrompt) return

    const previousBodyOverflow = document.body.style.overflow
    const previousBodyTouchAction = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer | null = null
    let frameId = 0
    let isDragging = false
    let startX = 0
    let startY = 0
    let lon = 0
    let lat = 0
    let dragDistance = 0
    let lastDragTime = performance.now()
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    try {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100)
      camera.position.set(0, 0, 0.1)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.style.touchAction = 'none'
      mount.appendChild(renderer.domElement)

      const geometry = new THREE.SphereGeometry(500, 60, 40)
      geometry.scale(-1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      const loader = new THREE.TextureLoader()
      loader.load('/Chapel.png', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        material.map = texture
        material.needsUpdate = true
      })

      const updateSize = () => {
        if (!renderer) return
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      }

      const getPoint = (event: PointerEvent | TouchEvent) => {
        if ('touches' in event) {
          const touch = event.touches[0] ?? event.changedTouches[0]
          return { x: touch?.clientX ?? 0, y: touch?.clientY ?? 0 }
        }
        return { x: event.clientX, y: event.clientY }
      }

      const onPointerDown = (event: PointerEvent) => {
        isDragging = true
        dragDistance = 0
        const point = getPoint(event)
        startX = point.x
        startY = point.y
        lastDragTime = performance.now()
        event.currentTarget.setPointerCapture(event.pointerId)
      }

      const onPointerMove = (event: PointerEvent) => {
        if (!isDragging) return
        const point = getPoint(event)
        const deltaX = point.x - startX
        const deltaY = point.y - startY
        dragDistance += Math.hypot(deltaX, deltaY)
        startX = point.x
        startY = point.y
        lastDragTime = performance.now()
        lon += deltaX * 0.12
        lat -= deltaY * 0.08
      }

      const onPointerUp = () => { isDragging = false }

      const onCanvasClick = (event: MouseEvent) => {
        if (dragDistance > 6) return
        const rect = renderer?.domElement.getBoundingClientRect()
        if (!renderer || !rect) return
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        raycaster.setFromCamera(pointer, camera)
        const intersections = raycaster.intersectObject(mesh, false)
        if (!intersections.length) return
        const hit = intersections[0].point
        const { lon: hitLon, lat: hitLat } = vector3ToSpherical(hit)
        setCoordinatePanel({ label: 'Chapel', source: 'Wall click', lon: Number(hitLon.toFixed(2)), lat: Number(hitLat.toFixed(2)) })
        console.log('Chapel coordinate', { lon: Number(hitLon.toFixed(2)), lat: Number(hitLat.toFixed(2)) })
      }

      mount.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
      window.addEventListener('resize', updateSize)
      renderer.domElement.addEventListener('click', onCanvasClick)

      const cameraDirection = new THREE.Vector3()
      let frameCount = 0
      const animate = () => {
        frameId = window.requestAnimationFrame(animate)
        frameCount++
        const timeSinceDrag = performance.now() - lastDragTime
        if (timeSinceDrag > 2000 && frameCount % 12 !== 0) return
        lat = Math.max(-85, Math.min(85, lat))
        const phi = THREE.MathUtils.degToRad(90 - lat)
        const theta = THREE.MathUtils.degToRad(lon)
        camera.lookAt(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta))
        camera.getWorldDirection(cameraDirection)

        chapelHotspots.forEach((hotspot) => {
          const element = hotspotRefs.current[hotspot.id]
          if (!element) return
          const point = sphericalToVector3(hotspot.lon, hotspot.lat)
          const visible = point.dot(cameraDirection) > 0
          if (!visible) {
            element.style.opacity = '0'
            element.style.pointerEvents = 'none'
            return
          }
          const projected = point.clone().project(camera)
          const x = (projected.x * 0.5 + 0.5) * window.innerWidth
          const y = (-projected.y * 0.5 + 0.5) * window.innerHeight
          element.style.opacity = '1'
          element.style.pointerEvents = 'auto'
          element.style.transform = `translate(${x}px, ${y}px)`
        })

        const instructionEl = instructionRef.current
        if (instructionEl) {
          const instrPoint = sphericalToVector3(-0.70, 13.68)
          const instrVisible = instrPoint.dot(cameraDirection) > 0
          if (!instrVisible) {
            instructionEl.style.opacity = '0'
          } else {
            const instrProjected = instrPoint.clone().project(camera)
            const ix = (instrProjected.x * 0.5 + 0.5) * window.innerWidth
            const iy = (-instrProjected.y * 0.5 + 0.5) * window.innerHeight
            instructionEl.style.opacity = '1'
            instructionEl.style.transform = `translate(${ix}px, ${iy}px)`
          }
        }

        renderer?.render(scene, camera)
      }
      animate()

      return () => {
        window.cancelAnimationFrame(frameId)
        mount.removeEventListener('pointerdown', onPointerDown)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
        window.removeEventListener('pointercancel', onPointerUp)
        window.removeEventListener('resize', updateSize)
        renderer?.domElement.removeEventListener('click', onCanvasClick)
        material.dispose()
        geometry.dispose()
        renderer?.dispose()
        if (renderer?.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
        document.body.style.overflow = previousBodyOverflow
        document.body.style.touchAction = previousBodyTouchAction
      }
    } catch {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.touchAction = previousBodyTouchAction
    }
  }, [showPrompt])

  if (showPrompt) {
    return (
      <ScreenContainer>
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[url('/Chapel.png')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="serif text-lg text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-xl">Welcome to the Chapel</p>
          <p className="mt-2 text-xs text-white/50">Enter a name to join</p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleJoin() }}
            placeholder="Your name"
            className="mt-6 w-full max-w-xs rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-center text-sm text-white outline-none placeholder:text-white/30 backdrop-blur-xl transition focus:border-white/30"
            autoFocus
          />
          <button
            type="button"
            onClick={handleJoin}
            className="mt-4 w-full max-w-xs rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.1)] transition hover:bg-white/[0.1]"
          >
            Enter the Chapel
          </button>
        </div>
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/Chapel.png')] bg-cover bg-center"
        style={{ backgroundPosition: 'center center' }}
      />
      <div ref={mountRef} className="absolute inset-0 touch-none select-none" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
      <div className="pointer-events-none absolute bottom-24 left-0 right-0 z-20 flex justify-center">
        <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[9px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-[10px]">
          360
        </div>
      </div>

      <div className="absolute top-6 left-0 right-0 z-10 flex justify-center">
        <p className="serif text-xs text-[#e7cba9]/55 sm:text-sm">Chapel</p>
      </div>

      {/* Hotspot markers */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {chapelHotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            ref={(el) => { hotspotRefs.current[hotspot.id] = el }}
            className="pointer-events-none absolute left-0 top-0"
          >
            <button
              type="button"
              onClick={hotspot.onClick}
              aria-label={hotspot.label}
              className="pointer-events-auto absolute left-0 top-0 z-[60] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#e7cba9]/20 stroke-[#e7cba9]/40 stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Instruction text at -0.70, 13.68 */}
      <div
        ref={instructionRef}
        className="pointer-events-none absolute left-0 top-0 z-20 max-w-[200px]"
        style={{ opacity: 0 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 text-center">
          <p className="serif text-[10px] leading-tight text-[#e7cba9]/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Navigate to Right Side of Chapel Altar and click the heart icon to join prayer room
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        className="pointer-events-none absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30 sm:right-6"
      >
        <div className="min-w-[11rem] rounded-2xl border border-white/12 bg-[#120e0bcc] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:min-w-[14rem]">
          <div className="mb-2 text-[9px] tracking-[0.32em] text-white/45">Coordinate Panel</div>
          <div className="mb-1 text-[11px] tracking-[0.2em] text-white/90">{coordinatePanel.label}</div>
          <div className="mb-2 text-[9px] tracking-[0.22em] text-amber-100/70">{coordinatePanel.source}</div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/45">Lon</span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-white/90">{coordinatePanel.lon === null ? '--' : coordinatePanel.lon.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-4">
            <span className="text-white/45">Lat</span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-white/90">{coordinatePanel.lat === null ? '--' : coordinatePanel.lat.toFixed(2)}</span>
          </div>
        </div>
      </motion.div>
    </ScreenContainer>
  )
}
