import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import ScreenContainer from '../components/ScreenContainer'

function sphericalToVector3(lonDeg: number, latDeg: number, radius = 499) {
  const lon = THREE.MathUtils.degToRad(lonDeg)
  const lat = THREE.MathUtils.degToRad(latDeg)
  return new THREE.Vector3(
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.sin(lon),
  )
}

function normalizeLon(lon: number) {
  let normalized = lon
  while (normalized <= -180) normalized += 360
  while (normalized > 180) normalized -= 360
  return normalized
}

function isLonInRange(lon: number, lonMin: number, lonMax: number) {
  const value = normalizeLon(lon)
  const min = normalizeLon(lonMin)
  const max = normalizeLon(lonMax)
  if (min <= max) return value >= min && value <= max
  return value >= min || value <= max
}

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

export default function NarniaPage() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const hotspotRef = useRef<HTMLDivElement | null>(null)
  const [coordinatePanel, setCoordinatePanel] = useState<CoordinatePanel>({
    label: 'Welcome to Narnia',
    source: 'Tap the panorama',
    lon: null,
    lat: null,
  })
  const [showTurkishDelight, setShowTurkishDelight] = useState(false)

  const turkishDelightLon = -39.02
  const turkishDelightLat = -9.19
  const turkishDelightPoint = sphericalToVector3(turkishDelightLon, turkishDelightLat)
  const turkishDelightRange = { lonMin: -39.52, lonMax: -38.52, latMin: -9.69, latMax: -8.69 }

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
      loader.load('/Welcome%20to%20Narnia.png', (texture) => {
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
        lon += deltaX * 0.12
        lat -= deltaY * 0.08
      }

      const onPointerUp = () => {
        isDragging = false
      }

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

        if (
          isLonInRange(hitLon, turkishDelightRange.lonMin, turkishDelightRange.lonMax) &&
          hitLat >= turkishDelightRange.latMin &&
          hitLat <= turkishDelightRange.latMax
        ) {
          setShowTurkishDelight(true)
          return
        }

        setCoordinatePanel({
          label: 'Narnia Panorama',
          source: 'Wall click',
          lon: Number(hitLon.toFixed(2)),
          lat: Number(hitLat.toFixed(2)),
        })
        console.log('Narnia coordinate', {
          lon: Number(hitLon.toFixed(2)),
          lat: Number(hitLat.toFixed(2)),
        })
      }

      mount.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
      window.addEventListener('resize', updateSize)
      renderer.domElement.addEventListener('click', onCanvasClick)

      const cameraDirection = new THREE.Vector3()

      const animate = () => {
        frameId = window.requestAnimationFrame(animate)
        lat = Math.max(-85, Math.min(85, lat))
        const phi = THREE.MathUtils.degToRad(90 - lat)
        const theta = THREE.MathUtils.degToRad(lon)
        camera.lookAt(
          500 * Math.sin(phi) * Math.cos(theta),
          500 * Math.cos(phi),
          500 * Math.sin(phi) * Math.sin(theta),
        )
        camera.getWorldDirection(cameraDirection)

        const element = hotspotRef.current
        if (element) {
          const relative = turkishDelightPoint.clone()
          const visible = relative.dot(cameraDirection) > 0

          if (!visible) {
            element.style.opacity = '0'
            element.style.pointerEvents = 'none'
          } else {
            const projected = turkishDelightPoint.clone().project(camera)
            const x = (projected.x * 0.5 + 0.5) * window.innerWidth
            const y = (-projected.y * 0.5 + 0.5) * window.innerHeight

            element.style.opacity = '1'
            element.style.pointerEvents = 'auto'
            element.style.transform = `translate(${x}px, ${y}px)`
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
        if (renderer?.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement)
        }
        document.body.style.overflow = previousBodyOverflow
        document.body.style.touchAction = previousBodyTouchAction
      }
    } catch {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.touchAction = previousBodyTouchAction
    }
  }, [])

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div ref={mountRef} className="absolute inset-0 touch-none select-none" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
      <div className="absolute top-6 left-0 right-0 z-10 flex justify-center">
        <p className="narnia text-base tracking-wider text-[#d4e8f0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-lg">Welcome to Narnia</p>
      </div>
      <div className="absolute bottom-24 left-0 right-0 z-10 flex flex-col items-center">
        <button
          type="button"
          onClick={() => navigate('/room')}
          className="rounded-3xl border border-white/14 bg-white/[0.05] px-6 py-3 text-sm text-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.1)] transition hover:bg-white/[0.1]"
        >
          Back to Room
        </button>
      </div>

      <div
        ref={hotspotRef}
        className="pointer-events-none absolute left-0 top-0 z-20"
        style={{ opacity: 0 }}
      >
        <img
          src="/Aslan%27s%20Glyph.png"
          alt=""
          aria-hidden="true"
          onClick={() => setShowTurkishDelight(true)}
          className="pointer-events-auto h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-40 transition hover:opacity-60 hover:scale-110"
        />
      </div>

      <AnimatePresence>
        {showTurkishDelight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-sm rounded-3xl border border-white/10 bg-[#0f0c09cc] p-8 text-center backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
            >
              <p className="narnia text-lg leading-relaxed text-[#d4e8f0] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-xl">
                Beware the Turkish Delight
              </p>
              <p className="mt-4 narnia text-base leading-relaxed text-[#b8d4e0] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-lg">
                — what looks sweet can enslave the will.
              </p>
              <p className="mt-6 text-[11px] italic tracking-[0.15em] text-[#8ab0c0]">
                Edmund&rsquo;s lesson
              </p>
              <button
                type="button"
                onClick={() => setShowTurkishDelight(false)}
                className="mt-8 rounded-3xl border border-white/14 bg-white/[0.05] px-6 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:bg-white/[0.1]"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <span className="font-mono text-[11px] tracking-[0.12em] text-white/90">
              {coordinatePanel.lon === null ? '--' : coordinatePanel.lon.toFixed(2)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-4">
            <span className="text-white/45">Lat</span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-white/90">
              {coordinatePanel.lat === null ? '--' : coordinatePanel.lat.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    </ScreenContainer>
  )
}
