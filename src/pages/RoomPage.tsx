import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function RoomPage() {
  const mountRef = useRef<HTMLDivElement | null>(null)

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
        startX = point.x
        startY = point.y

        lon += deltaX * 0.12
        lat -= deltaY * 0.08
      }

      const onPointerUp = () => {
        isDragging = false
      }

      mount.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
      window.addEventListener('resize', updateSize)

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
