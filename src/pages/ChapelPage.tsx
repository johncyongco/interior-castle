import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import ScreenContainer from '../components/ScreenContainer'
import { supabase } from '../lib/supabase'
import { isAgoraAvailable, startTalking, stopTalking, joinChannel as agoraJoin, leaveChannel } from '../lib/agora'
import { openPopup } from '../components/RoomPopups'

const USERNAME_KEY = 'spero-chapel-username'

function vector3ToSpherical(point: THREE.Vector3) {
  const radius = point.length()
  const lon = THREE.MathUtils.radToDeg(Math.atan2(point.z, point.x))
  const lat = THREE.MathUtils.radToDeg(Math.asin(point.y / radius))
  return { lon, lat }
}

function sphericalToVector3(lonDeg: number, latDeg: number, radius = 499) {
  const lon = THREE.MathUtils.degToRad(lonDeg)
  const lat = THREE.MathUtils.degToRad(latDeg)
  return new THREE.Vector3(radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.sin(lon))
}

type CoordinatePanel = { label: string; source: string; lon: number | null; lat: number | null }
type HotspotPoint = { id: string; label: string; lon: number; lat: number; onClick: () => void }
type PrayerChannel = { id: string; name: string; mode: string; type: 'public' | 'private'; creator: string; userCount: number }

const STORAGE_KEY = 'spero-chapel-channels'

async function loadChannels(): Promise<PrayerChannel[]> {
  if (!supabase) {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  }
  const { data } = await supabase.from('prayer_rooms').select('*').order('created_at', { ascending: false })
  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    mode: r.mode,
    type: r.type,
    creator: r.creator,
    userCount: r.user_count,
    password: r.password,
  }))
}

async function saveChannel(channel: PrayerChannel) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    existing.push(channel)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    return
  }
  await supabase.from('prayer_rooms').insert({
    id: channel.id,
    name: channel.name,
    mode: channel.mode,
    type: channel.type,
    creator: channel.creator,
    user_count: channel.userCount,
    password: channel.password || null,
  })
}

async function deleteChannelFromDB(id: string) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter((c: any) => c.id !== id)))
    return
  }
  const { error } = await supabase.from('prayer_rooms').delete().eq('id', id)
  if (error) console.error('Supabase delete error:', error)
}

async function updateRoomCount(id: string, count: number) {
  if (!supabase) return
  await supabase.from('prayer_rooms').update({ user_count: count }).eq('id', id)
}

export default function ChapelPage() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const hotspotRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const instructionRef = useRef<HTMLDivElement | null>(null)
  const [username, setUsername] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const [chapelPassword, setChapelPassword] = useState('')
  const [chapelPasswordError, setChapelPasswordError] = useState('')
  const [coordinatePanel, setCoordinatePanel] = useState<CoordinatePanel>({ label: 'Chapel', source: 'Tap the panorama', lon: null, lat: null })
  const [showMenu, setShowMenu] = useState(false)
  const [menuView, setMenuView] = useState<'menu' | 'create' | 'browse'>('menu')
  const [channels, setChannels] = useState<PrayerChannel[]>([])
  const [newName, setNewName] = useState('')
  const [newMode, setNewMode] = useState('Rosary')
  const [newType, setNewType] = useState<'public' | 'private'>('public')
  const [newPassword, setNewPassword] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  const [joinPasswordId, setJoinPasswordId] = useState<string | null>(null)
  const [activeRoomView, setActiveRoomView] = useState<PrayerChannel | null>(null)
  const [prayerRoomCount, setPrayerRoomCount] = useState(1)
  const [alwaysOn, setAlwaysOn] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(USERNAME_KEY)
    if (saved) { setUsername(saved); setShowPrompt(false) }
    setIsAdmin(!!localStorage.getItem('spero-admin-email'))
    loadChannels().then(setChannels)
    const interval = setInterval(() => loadChannels().then(setChannels), 5000)
    return () => clearInterval(interval)
  }, [])

  const handleJoin = useCallback(() => {
    if (chapelPassword.trim().toLowerCase() !== 'sursum_corda') {
      setChapelPasswordError('Incorrect password')
      return
    }
    const name = username.trim()
    if (!name) return
    localStorage.setItem(USERNAME_KEY, name)
    setShowPrompt(false)
  }, [username, chapelPassword])

  const joinAgoraChannel = useCallback(async (channel: PrayerChannel) => {
    setPrayerRoomCount(1)
    try {
      const inc = () => setPrayerRoomCount((c) => { const n = c + 1; updateRoomCount(channel.id, n); return n })
      const dec = () => setPrayerRoomCount((c) => { const n = Math.max(0, c - 1); updateRoomCount(channel.id, n); return n })
      await agoraJoin(channel.id, null, username, channel, inc, dec)
    } catch (err) {
      console.error('Failed to join Agora channel:', err)
    }
  }, [username])

  const createChannel = useCallback(() => {
    if (!newName.trim()) return

    const now = Date.now()
    const timestamps = JSON.parse(localStorage.getItem('spero-room-timestamps') || '[]').filter((t: number) => now - t < 60000)
    if (timestamps.length >= 5) return
    timestamps.push(now)
    localStorage.setItem('spero-room-timestamps', JSON.stringify(timestamps))

    const channel: PrayerChannel = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      mode: newMode,
      type: newType,
      creator: username,
      userCount: 1,
      password: newType === 'private' ? newPassword : undefined,
    }
    setChannels((prev) => [channel, ...prev])
    saveChannel(channel)
    setNewName('')
    setNewPassword('')
    setMenuView('menu')
    setShowMenu(false)
    setActiveRoomView(channel)
    joinAgoraChannel(channel)
  }, [newName, newMode, newType, newPassword, username, channels, joinAgoraChannel])

  const joinChannel = useCallback((channel: PrayerChannel) => {
    if (channel.type === 'private') {
      setJoinPasswordId(channel.id)
      return
    }
    setShowMenu(false)
    setActiveRoomView(channel)
    joinAgoraChannel(channel)
  }, [username, joinAgoraChannel])

  const deleteChannel = useCallback((id: string) => {
    setChannels((prev) => prev.filter(c => c.id !== id))
    deleteChannelFromDB(id)
  }, [])

  const confirmJoinPassword = useCallback(() => {
    const ch = channels.find(c => c.id === joinPasswordId)
    if (!ch) return
    if (ch.password && joinPassword !== ch.password) return
    setShowMenu(false)
    setActiveRoomView(ch)
    joinAgoraChannel(ch)
    setJoinPasswordId(null)
    setJoinPassword('')
  }, [joinPasswordId, channels, username, joinAgoraChannel, joinPassword])

  useEffect(() => {
    if (showPrompt || !username) return
    if (!supabase) return
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
    let lon = -0.70
    let lat = 13.68
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
      loader.load('/Chapel.png', (texture) => { texture.colorSpace = THREE.SRGBColorSpace; material.map = texture; material.needsUpdate = true })

      const ourLadyGroup = new THREE.Group()
      ourLadyGroup.position.copy(sphericalToVector3(24, 7, 496.2))
      ourLadyGroup.lookAt(0, 0, 0)
      scene.add(ourLadyGroup)

      const ourLadyBorderGeometry = new THREE.PlaneGeometry(36, 46)
      const ourLadyBorderMaterial = new THREE.MeshBasicMaterial({ color: 0x6a4b2f, transparent: true, opacity: 0.92 })
      const ourLadyBorder = new THREE.Mesh(ourLadyBorderGeometry, ourLadyBorderMaterial)
      ourLadyGroup.add(ourLadyBorder)

      const ourLadyMattingGeometry = new THREE.PlaneGeometry(33, 43)
      const ourLadyMattingMaterial = new THREE.MeshBasicMaterial({ color: 0x17120f, transparent: true, opacity: 0.92 })
      const ourLadyMatting = new THREE.Mesh(ourLadyMattingGeometry, ourLadyMattingMaterial)
      ourLadyMatting.position.z = 0.12
      ourLadyGroup.add(ourLadyMatting)

      const ourLadyImageGeometry = new THREE.PlaneGeometry(30, 40)
      const ourLadyImageMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const ourLadyImage = new THREE.Mesh(ourLadyImageGeometry, ourLadyImageMaterial)
      ourLadyImage.position.z = 0.2
      ourLadyGroup.add(ourLadyImage)

      const ourLadyInteractiveObjects: THREE.Object3D[] = [ourLadyBorder, ourLadyMatting, ourLadyImage]

      const ourLadyImageTexture = loader.load('/Our%20Lady%20of%20Graces.png', (texture) => { texture.colorSpace = THREE.SRGBColorSpace; ourLadyImageMaterial.map = texture; ourLadyImageMaterial.needsUpdate = true })
      const updateSize = () => { if (!renderer) return; camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)) }
      const getPoint = (event: PointerEvent | TouchEvent) => {
        if ('touches' in event) { const touch = event.touches[0] ?? event.changedTouches[0]; return { x: touch?.clientX ?? 0, y: touch?.clientY ?? 0 } }
        return { x: event.clientX, y: event.clientY }
      }
      const onPointerDown = (event: PointerEvent) => { isDragging = true; dragDistance = 0; const point = getPoint(event); startX = point.x; startY = point.y; lastDragTime = performance.now(); event.currentTarget.setPointerCapture(event.pointerId) }
      const onPointerMove = (event: PointerEvent) => { if (!isDragging) return; const point = getPoint(event); const deltaX = point.x - startX; const deltaY = point.y - startY; dragDistance += Math.hypot(deltaX, deltaY); startX = point.x; startY = point.y; lastDragTime = performance.now(); lon += deltaX * 0.12; lat -= deltaY * 0.08 }
      const onPointerUp = () => { isDragging = false }
      const onCanvasClick = (event: MouseEvent) => {
        if (dragDistance > 6) return; const rect = renderer?.domElement.getBoundingClientRect(); if (!renderer || !rect) return
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        raycaster.setFromCamera(pointer, camera); const intersections = raycaster.intersectObject(mesh, false); if (!intersections.length) return
        const hit = intersections[0].point; const { lon: hitLon, lat: hitLat } = vector3ToSpherical(hit)

        if (Math.abs(hitLon - (-179.70)) < 8.4 && Math.abs(hitLat - 6.7) < 8.4) {
          openPopup('adoration')
          setCoordinatePanel({ label: 'Adoration', source: 'Hidden hotspot', lon: Number(hitLon.toFixed(2)), lat: Number(hitLat.toFixed(2)) })
          return
        }

        const ourLadyFrameHits = raycaster.intersectObjects(ourLadyInteractiveObjects, false)
        if (ourLadyFrameHits.length) {
          openPopup('salve-regina')
          setCoordinatePanel({ label: 'Our Lady', source: 'Frame hotspot', lon: Number(hitLon.toFixed(2)), lat: Number(hitLat.toFixed(2)) })
          return
        }

        setCoordinatePanel({ label: 'Chapel', source: 'Wall click', lon: Number(hitLon.toFixed(2)), lat: Number(hitLat.toFixed(2)) })
        console.log('Chapel coordinate', { lon: Number(hitLon.toFixed(2)), lat: Number(hitLat.toFixed(2)) })
      }
      mount.addEventListener('pointerdown', onPointerDown); window.addEventListener('pointermove', onPointerMove); window.addEventListener('pointerup', onPointerUp); window.addEventListener('pointercancel', onPointerUp); window.addEventListener('resize', updateSize); renderer.domElement.addEventListener('click', onCanvasClick)
      const cameraDirection = new THREE.Vector3(); let frameCount = 0
      const animate = () => {
        frameId = window.requestAnimationFrame(animate); frameCount++; const timeSinceDrag = performance.now() - lastDragTime
        if (timeSinceDrag > 2000 && frameCount % 12 !== 0) return
        lat = Math.max(-85, Math.min(85, lat)); const phi = THREE.MathUtils.degToRad(90 - lat); const theta = THREE.MathUtils.degToRad(lon)
        camera.lookAt(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta))
        camera.getWorldDirection(cameraDirection)
        const chapelHotspots: HotspotPoint[] = [
          { id: 'heart-icon', label: 'Heart Icon', lon: -155.94, lat: 7.94, onClick: () => { setShowMenu(true); setMenuView('menu') } },
        ]
        chapelHotspots.forEach((hotspot) => {
          const element = hotspotRefs.current[hotspot.id]; if (!element) return
          const point = sphericalToVector3(hotspot.lon, hotspot.lat); const visible = point.dot(cameraDirection) > 0
          if (!visible) { element.style.opacity = '0'; element.style.pointerEvents = 'none'; return }
          const projected = point.clone().project(camera); const x = (projected.x * 0.5 + 0.5) * window.innerWidth; const y = (-projected.y * 0.5 + 0.5) * window.innerHeight
          element.style.opacity = '1'; element.style.pointerEvents = 'auto'; element.style.transform = `translate(${x}px, ${y}px)`
        })
        const instructionEl = instructionRef.current
        if (instructionEl) {
          const instrPoint = sphericalToVector3(-0.70, 13.68); const instrVisible = instrPoint.dot(cameraDirection) > 0
          if (!instrVisible) { instructionEl.style.opacity = '0' } else { const ip = instrPoint.clone().project(camera); instructionEl.style.opacity = '1'; instructionEl.style.transform = `translate(${(ip.x * 0.5 + 0.5) * window.innerWidth}px, ${(-ip.y * 0.5 + 0.5) * window.innerHeight}px)` }
        }
        renderer?.render(scene, camera)
      }
      animate()
      return () => {
        window.cancelAnimationFrame(frameId); mount.removeEventListener('pointerdown', onPointerDown); window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerup', onPointerUp); window.removeEventListener('pointercancel', onPointerUp); window.removeEventListener('resize', updateSize); renderer?.domElement.removeEventListener('click', onCanvasClick)
        material.dispose(); geometry.dispose(); ourLadyImageTexture.dispose(); ourLadyImageMaterial.dispose(); ourLadyImageGeometry.dispose(); ourLadyMattingMaterial.dispose(); ourLadyMattingGeometry.dispose(); ourLadyBorderMaterial.dispose(); ourLadyBorderGeometry.dispose(); renderer?.dispose(); if (renderer?.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
        document.body.style.overflow = previousBodyOverflow; document.body.style.touchAction = previousBodyTouchAction
      }
    } catch { document.body.style.overflow = previousBodyOverflow; document.body.style.touchAction = previousBodyTouchAction }
  }, [showPrompt])

  if (showPrompt) {
    return (
      <ScreenContainer>
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[url('/Chapel.png')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="serif text-lg text-[#e7cba9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-xl">Welcome to the Chapel</p>
          <input
            value={chapelPassword}
            onChange={(e) => { setChapelPassword(e.target.value); setChapelPasswordError('') }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleJoin() }}
            type="password" autoComplete="off"
            placeholder="Password"
            className="mt-6 w-full max-w-xs rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-center text-base text-white outline-none placeholder:text-white/30 backdrop-blur-xl transition focus:border-white/30"
            autoFocus
          />
          {chapelPasswordError && <p className="mt-2 text-xs text-red-400/70">{chapelPasswordError}</p>}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleJoin() }}
            placeholder="Your name"
            className="mt-3 w-full max-w-xs rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-center text-base text-white outline-none placeholder:text-white/30 backdrop-blur-xl transition focus:border-white/30"
          />
          <button type="button" onClick={handleJoin} className="mt-4 w-full max-w-xs rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.1)] transition hover:bg-white/[0.1]">Enter the Chapel</button>
        </div>
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/Chapel.png')] bg-cover bg-center opacity-20" style={{ backgroundPosition: 'center center' }} />
      <div ref={mountRef} className="absolute inset-0 touch-none select-none" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
      <div className="pointer-events-none absolute bottom-24 left-0 right-0 z-20 flex justify-center">
        <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[9px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-[10px]">360</div>
      </div>
      <div className="absolute top-6 left-0 right-0 z-10 flex justify-center">
        <p className="serif text-xs text-[#e7cba9]/55 sm:text-sm">Chapel</p>
      </div>

      {/* Heart hotspot marker */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div ref={(el) => { hotspotRefs.current['heart-icon'] = el }} className="pointer-events-none absolute left-0 top-0">
          <button type="button" onClick={() => { setShowMenu(true); setMenuView('menu') }} aria-label="Prayer Rooms" className="pointer-events-auto absolute left-0 top-0 z-[60] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#e7cba9]/20 stroke-[#e7cba9]/40 stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Instruction text */}
      <div ref={instructionRef} className="pointer-events-none absolute left-0 top-0 z-20 max-w-[200px]" style={{ opacity: 0 }}>
        <div className="-translate-x-1/2 -translate-y-1/2 text-center">
          <p className="serif text-[10px] leading-tight text-[#e7cba9]/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Navigate to Right Side of Chapel Altar and click the heart icon to join prayer room</p>
        </div>
      </div>

      {/* Heart icon popup menu */}
      {showMenu && !activeRoomView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-50 flex items-start justify-center bg-black/50 px-6 pt-6 pb-24 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="w-full max-w-sm max-h-[80vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f0c09cc] p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.5)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {menuView === 'menu' && (
                <div className="space-y-4">
                  <p className="serif text-center text-lg text-[#e7cba9]">Prayer Rooms</p>
                  <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/40">{isAgoraAvailable() ? 'Voice rooms available' : 'No Agora ID set — local only'}</p>
                  <button type="button" onClick={() => setMenuView('create')} className="w-full rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/[0.1]">Create Room</button>
                  <button type="button" onClick={() => setMenuView('browse')} className="w-full rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/[0.1]">Browse Rooms ({channels.length})</button>
                  <button type="button" onClick={() => setShowMenu(false)} className="w-full text-xs text-white/40 transition hover:text-white/60">Cancel</button>
                </div>
              )}

              {menuView === 'create' && (
                <div className="space-y-4">
                  <p className="serif text-center text-lg text-[#e7cba9]">Create a Prayer Room</p>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Room name" className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-white outline-none placeholder:text-white/30 backdrop-blur-xl" />
                  <div className="flex gap-2">
                    {['Rosary', 'Divine Mercy', 'Scripture', 'Free Prayer'].map((m) => (
                      <button key={m} type="button" onClick={() => setNewMode(m)} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] transition ${newMode === m ? 'bg-[#e7cba9]/20 text-[#e7cba9]' : 'bg-white/5 text-white/40 hover:text-white/60'}`}>{m}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setNewType('public')} className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.15em] transition ${newType === 'public' ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-white/40'}`}>Public</button>
                    <button type="button" onClick={() => setNewType('private')} className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.15em] transition ${newType === 'private' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-white/40'}`}>Private</button>
                  </div>
                  {newType === 'private' && <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" autoComplete="off" placeholder="Room password" className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-white outline-none placeholder:text-white/30 backdrop-blur-xl" />}
                  <button type="button" onClick={createChannel} className="w-full rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/[0.1]">Create & Join</button>
                  <button type="button" onClick={() => setMenuView('menu')} className="w-full text-xs text-white/40 transition hover:text-white/60">Back</button>
                </div>
              )}

              {menuView === 'browse' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="serif text-lg text-[#e7cba9]">Browse Rooms</p>
                    <button type="button" onClick={() => setMenuView('menu')} className="text-xs text-white/40 transition hover:text-white/60">Back</button>
                  </div>
                  {channels.length === 0 ? (
                    <p className="text-center text-sm text-white/40">No rooms yet. Create one!</p>
                  ) : (
                    channels.map((ch) => (
                      <div key={ch.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-xl">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-white/80">{ch.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-white/40">
                            <span>{ch.mode}</span>
                            <span>·</span>
                            <span className={ch.type === 'public' ? 'text-green-400/60' : 'text-amber-400/60'}>{ch.type}</span>
                            <span>·</span>
                            <span>{ch.creator}</span>
                            <span>·</span>
                            <span>{ch.userCount} in room</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {(ch.creator === username || isAdmin) && (
                            <button type="button" onClick={() => deleteChannel(ch.id)} className="rounded-full border border-red-500/10 bg-red-500/5 px-2 py-1 text-[9px] text-red-400/50 transition hover:bg-red-500/15">Delete</button>
                          )}
                          <button type="button" onClick={() => joinChannel(ch)} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/60 transition hover:bg-white/20">Join</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Password prompt for private rooms */}
              {joinPasswordId && (
                <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
                  <p className="text-xs text-white/60">Enter room password</p>
                  <input value={joinPassword} onChange={(e) => setJoinPassword(e.target.value)} type="password" autoComplete="off" placeholder="Password" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-base text-white outline-none placeholder:text-white/30" autoFocus />
                  <div className="flex gap-2">
                    <button type="button" onClick={confirmJoinPassword} className="rounded-2xl bg-white/10 px-4 py-2 text-xs text-white/70 transition hover:bg-white/20">Join</button>
                    <button type="button" onClick={() => { setJoinPasswordId(null); setJoinPassword('') }} className="rounded-2xl bg-white/5 px-4 py-2 text-xs text-white/40 transition hover:bg-white/10">Cancel</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Prayer Room bar */}
        {activeRoomView && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="absolute bottom-24 left-4 right-4 z-50 mx-auto max-w-sm">
            <div className="rounded-3xl border border-white/10 bg-[#0f0c09cc] p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/90">{activeRoomView.name}</p>
                  <p className="text-[10px] text-white/40">{activeRoomView.mode} · {prayerRoomCount} in room</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onMouseDown={alwaysOn ? undefined : startTalking}
                  onMouseUp={alwaysOn ? undefined : stopTalking}
                  onTouchStart={alwaysOn ? undefined : startTalking}
                  onTouchEnd={alwaysOn ? undefined : stopTalking}
                  onClick={async () => {
                    if (alwaysOn) {
                      await stopTalking()
                      setAlwaysOn(false)
                    }
                  }}
                  className={`touch-none select-none flex-1 rounded-3xl border px-4 py-3 text-sm backdrop-blur-xl transition ${
                    alwaysOn
                      ? 'border-green-500/30 bg-green-500/10 text-green-400'
                      : 'border-white/14 bg-white/[0.05] text-white/80 active:bg-green-500/20 active:text-green-400 active:border-green-500/30'
                  }`}
                >
                  {alwaysOn ? 'On' : 'Push to Talk'}
                </button>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const next = !alwaysOn
                      setAlwaysOn(next)
                      if (next) await startTalking()
                      else await stopTalking()
                    }}
                    className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] transition ${
                      alwaysOn
                        ? 'border-green-500/30 bg-green-500/10 text-green-400'
                        : 'border-white/10 bg-white/5 text-white/40'
                    }`}
                  >
                    Always On
                  </button>
                  <button type="button" onClick={async () => { await leaveChannel(); if (activeRoomView) updateRoomCount(activeRoomView.id, 0); setActiveRoomView(null); setPrayerRoomCount(0); setAlwaysOn(false) }} className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] text-red-400/70 transition hover:bg-red-500/20">Leave</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }} className="pointer-events-none absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30 sm:right-6">
        <div className="hidden min-w-[11rem] rounded-2xl border border-white/12 bg-[#120e0bcc] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:min-w-[14rem]">
          <div className="mb-2 text-[9px] tracking-[0.32em] text-white/45">Coordinate Panel</div>
          <div className="mb-1 text-[11px] tracking-[0.2em] text-white/90">{coordinatePanel.label}</div>
          <div className="mb-2 text-[9px] tracking-[0.22em] text-amber-100/70">{coordinatePanel.source}</div>
          <div className="flex items-center justify-between gap-4"><span className="text-white/45">Lon</span><span className="font-mono text-[11px] tracking-[0.12em] text-white/90">{coordinatePanel.lon === null ? '--' : coordinatePanel.lon.toFixed(2)}</span></div>
          <div className="mt-1 flex items-center justify-between gap-4"><span className="text-white/45">Lat</span><span className="font-mono text-[11px] tracking-[0.12em] text-white/90">{coordinatePanel.lat === null ? '--' : coordinatePanel.lat.toFixed(2)}</span></div>
        </div>
      </motion.div>
    </ScreenContainer>
  )
}
