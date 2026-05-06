import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

type Hotspot = {
  id: string
  label: string
  shortLabel: string
  lon: number
  lat: number
  onClick: () => void
}

type HotspotPoint = Hotspot & {
  point: THREE.Vector3
}

const OFFSET = -120

function fixLon(lon: number) {
  let fixed = lon + OFFSET
  if (fixed < -180) fixed += 360
  if (fixed > 180) fixed -= 360
  return fixed
}

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

export default function RoomPage() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const catechismUrl = 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM'
  const hotspotRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const hotspotPoints: HotspotPoint[] = [
    {
      id: 'crucifix',
      label: 'Crucifix',
      shortLabel: 'Cross',
      lon: fixLon(-150),
      lat: 10,
      onClick: () => navigate('/prayer'),
      point: sphericalToVector3(fixLon(-150), 10),
    },
    {
      id: 'bible',
      label: 'Bible',
      shortLabel: 'Bible',
      lon: fixLon(-70),
      lat: -12,
      onClick: () => navigate('/daily-gospel'),
      point: sphericalToVector3(fixLon(-70), -12),
    },
    {
      id: 'cc',
      label: 'CC',
      shortLabel: 'CC',
      lon: fixLon(-30),
      lat: 8,
      onClick: () => window.open(catechismUrl, '_blank', 'noopener,noreferrer'),
      point: sphericalToVector3(fixLon(-30), 8),
    },
  ]

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyTouchAction = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    const mount = mountRef.current
    if (!mount) return undefined

    let renderer: THREE.WebGLRenderer | null = null
    let frameId = 0
    let isDragging = false
    let startX = 0
    let startY = 0
    let lon = 0
    let lat = 0
    const cameraDirection = new THREE.Vector3()
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let dragDistance = 0

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
      loader.load('/room1.png', (texture) => {
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

        console.log('Panorama coordinate', {
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
        camera.getWorldDirection(cameraDirection)

        hotspotPoints.forEach((hotspot) => {
          const element = hotspotRefs.current[hotspot.id]
          if (!element) return

          const relative = hotspot.point.clone()
          const visible = relative.dot(cameraDirection) > 0

          if (!visible) {
            element.style.opacity = '0'
            element.style.pointerEvents = 'none'
            return
          }

          const projected = hotspot.point.clone().project(camera)
          const x = (projected.x * 0.5 + 0.5) * window.innerWidth
          const y = (-projected.y * 0.5 + 0.5) * window.innerHeight

          element.style.opacity = '1'
          element.style.pointerEvents = 'auto'
          element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
        })
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
      return undefined
    }
  }, [])

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div ref={mountRef} className="absolute inset-0 touch-none select-none" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.45))]" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[9px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-[10px]">
          360
        </div>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        {hotspotPoints.map((hotspot) => (
          <button
            key={hotspot.id}
            ref={(element) => {
              hotspotRefs.current[hotspot.id] = element
            }}
            type="button"
            onClick={hotspot.onClick}
            aria-label={`${hotspot.label} hotspot`}
            title={hotspot.label}
            className="pointer-events-auto absolute left-0 top-0 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/45 px-2.5 py-1.5 text-[8px] uppercase tracking-[0.24em] text-white/80 backdrop-blur-xl transition hover:bg-black/60 hover:text-white sm:min-h-0 sm:min-w-0 sm:px-3 sm:py-2 sm:text-[9px] sm:tracking-[0.3em]"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-[#e7cba9] shadow-[0_0_12px_rgba(231,203,169,0.85)] sm:h-2.5 sm:w-2.5" />
            <span className="whitespace-nowrap">{hotspot.shortLabel}</span>
          </button>
        ))}
      </div>

      <div className="pointer-events-none relative flex h-full flex-col px-4 py-6 pb-[max(7rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:py-10 sm:pb-28">
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
