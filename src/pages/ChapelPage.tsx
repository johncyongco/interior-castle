import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import ScreenContainer from '../components/ScreenContainer'
import { supabase } from '../lib/supabase'

const USERNAME_KEY = 'spero-chapel-username'

type PrayerMode = {
  id: string
  name: string
  type: 'public' | 'private'
  creator: string
}

export default function ChapelPage() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [username, setUsername] = useState('')
  const [showPrompt, setShowPrompt] = useState(true)
  const [modes, setModes] = useState<PrayerMode[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newModeName, setNewModeName] = useState('')
  const [newModeType, setNewModeType] = useState<'public' | 'private'>('public')

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

      mount.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
      window.addEventListener('resize', updateSize)

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
      <div className="pointer-events-none absolute bottom-24 left-0 right-0 z-20 flex justify-center">
        <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[9px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-[10px]">
          360
        </div>
      </div>

      <div className="absolute top-6 left-0 right-0 z-10 flex justify-center">
        <p className="serif text-xs text-[#e7cba9]/55 sm:text-sm">Chapel</p>
      </div>

      {/* Prayer Modes Panel */}
      <div className="absolute right-4 top-16 z-20 w-56 space-y-2">
        <div className="rounded-2xl border border-white/12 bg-[#120e0bcc] px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-1.5 text-[9px] tracking-[0.28em] text-white/45">Prayer Modes</div>
          {modes.length === 0 ? (
            <div className="text-[10px] text-white/40">No active modes</div>
          ) : (
            modes.map((mode) => (
              <div key={mode.id} className="flex items-center justify-between gap-2 py-1">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${mode.type === 'public' ? 'bg-green-400/70' : 'bg-amber-400/70'}`} />
                  <span className="truncate text-[11px] tracking-[0.1em] text-white/80">{mode.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => joinMode(mode)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] text-white/60 transition hover:bg-white/20"
                >
                  Join
                </button>
              </div>
            ))
          )}
        </div>

        {showCreate ? (
          <div className="rounded-2xl border border-white/12 bg-[#120e0bcc] px-3 py-2.5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <input
              value={newModeName}
              onChange={(e) => setNewModeName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') createMode() }}
              placeholder="Mode name"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white outline-none placeholder:text-white/30"
              autoFocus
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNewModeType('public')}
                className={`rounded-full px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] transition ${newModeType === 'public' ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-white/40'}`}
              >
                Public
              </button>
              <button
                type="button"
                onClick={() => setNewModeType('private')}
                className={`rounded-full px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] transition ${newModeType === 'private' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-white/40'}`}
              >
                Private
              </button>
              <button
                type="button"
                onClick={createMode}
                className="ml-auto rounded-full bg-white/10 px-3 py-1 text-[8px] uppercase tracking-[0.15em] text-white/70 transition hover:bg-white/20"
              >
                Create
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] py-2 text-[10px] uppercase tracking-[0.2em] text-white/40 backdrop-blur-xl transition hover:bg-white/[0.06] hover:text-white/60"
          >
            + New Prayer Mode
          </button>
        )}
      </div>
    </ScreenContainer>
  )
}
