import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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

export default function BreakfastPage() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [coordinatePanel, setCoordinatePanel] = useState<CoordinatePanel>({
    label: 'Breakfast',
    source: 'Tap the panorama',
    lon: null,
    lat: null,
  })

  const hotspotRanges = [
    { lonMin: 144.54, lonMax: -179, latMin: -2.61, latMax: 21.68 },
    { lonMin: 96, lonMax: 96, latMin: -2.61, latMax: -2.61 },
    { lonMin: 166.01, lonMax: 167.44, latMin: -22.67, latMax: 21.68 },
  ]

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
      loader.load('/Breakfast.png', (texture) => {
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

        for (const range of hotspotRanges) {
          if (
            isLonInRange(hitLon, range.lonMin, range.lonMax) &&
            hitLat >= range.latMin &&
            hitLat <= range.latMax
          ) {
            setCoordinatePanel({
              label: 'Video Hotspot',
              source: 'Wall hotspot',
              lon: Number(hitLon.toFixed(2)),
              lat: Number(hitLat.toFixed(2)),
            })
            navigate('/breakfast/media')
            return
          }
        }

        setCoordinatePanel({
          label: 'Breakfast Panorama',
          source: 'Wall click',
          lon: Number(hitLon.toFixed(2)),
          lat: Number(hitLat.toFixed(2)),
        })
        console.log('Breakfast coordinate', {
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
        <p className="serif text-xs text-[#e7cba9]/55 sm:text-sm">Breakfast</p>
      </div>
      <div className="absolute bottom-24 left-0 right-0 z-10 flex justify-center">
        <button
          type="button"
          onClick={() => navigate('/room')}
          className="rounded-3xl border border-white/14 bg-white/[0.05] px-6 py-3 text-sm text-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.1)] transition hover:bg-white/[0.1]"
        >
          Back to Room
        </button>
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
