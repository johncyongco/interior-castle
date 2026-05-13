import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import ScreenContainer from '../components/ScreenContainer'
import { supabase } from '../lib/supabase'

const USERNAME_KEY = 'spero-chapel-username'

export default function ChapelPage() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [username, setUsername] = useState('')
  const [showPrompt, setShowPrompt] = useState(true)
  const [users, setUsers] = useState<string[]>([])
  const [coordinatePanel, setCoordinatePanel] = useState({ label: 'Chapel', source: 'Tap the panorama', lon: null as number | null, lat: null as number | null })

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

  useEffect(() => {
    if (showPrompt || !username) return
    if (!supabase) {
      setUsers([`${username} (you) — offline mode`])
      return
    }
    const channel = supabase.channel('chapel-presence', {
      config: { presence: { key: username } },
    })
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const present = Object.values(state).flatMap((p: any) => p.map((u: any) => u.username))
        setUsers(present.length ? present : [username])
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setUsers((prev) => (prev.includes(key) ? prev : [...prev, key]))
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setUsers((prev) => prev.filter((u) => u !== key))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ username })
        }
      })
    return () => { channel.unsubscribe().catch(() => {}) }
  }, [showPrompt, username])

  // Three.js panorama
  useEffect(() => {
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
        const radius = hit.length()
        const hitLon = THREE.MathUtils.radToDeg(Math.atan2(hit.z, hit.x))
        const hitLat = THREE.MathUtils.radToDeg(Math.asin(hit.y / radius))
        setCoordinatePanel({ label: 'Chapel', source: 'Wall click', lon: Number(hitLon.toFixed(2)), lat: Number(hitLat.toFixed(2)) })
        console.log('Chapel coordinate', { lon: Number(hitLon.toFixed(2)), lat: Number(hitLat.toFixed(2)) })
      }

      mount.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
      window.addEventListener('resize', updateSize)
      renderer.domElement.addEventListener('click', onCanvasClick)

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
  }, [])

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
        className="absolute inset-0 bg-[url('/Chapel.png')] bg-cover bg-center"
        style={{ backgroundPosition: 'center center' }}
      />
      <div ref={mountRef} className="absolute inset-0 touch-none select-none" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[9px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-[10px]">
          360
        </div>
      </div>

      <div className="absolute top-6 left-0 right-0 z-10 flex justify-center">
        <p className="serif text-xs text-[#e7cba9]/55 sm:text-sm">Chapel</p>
      </div>

      {/* Back to Room — no button, handled by nav bar */}

      {/* Presence panel */}
      <div className="pointer-events-none absolute right-4 top-16 z-20 min-w-[10rem] rounded-2xl border border-white/12 bg-[#120e0bcc] px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mb-1.5 text-[9px] tracking-[0.28em] text-white/45">Praying Together</div>
        {users.length === 0 ? (
          <div className="text-[10px] text-white/40">Loading...</div>
        ) : (
          users.map((u) => (
            <div key={u} className="flex items-center gap-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400/70" />
              <span className="text-[11px] tracking-[0.1em] text-white/80">{u}</span>
            </div>
          ))
        )}
        {!supabase && users.length > 0 && (
          <div className="mt-1 text-[8px] text-amber-400/60">offline mode</div>
        )}
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
