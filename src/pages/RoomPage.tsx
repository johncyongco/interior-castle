import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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

type RangeHotspot = {
  id: string
  label: string
  shortLabel: string
  lonMin: number
  lonMax: number
  latMin: number
  latMax: number
  onClick: () => void
}

type CoordinatePanel = {
  label: string
  source: string
  lon: number | null
  lat: number | null
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

export default function RoomPage() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const catechismUrl = 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM'
  const hotspotRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [coordinatePanel, setCoordinatePanel] = useState<CoordinatePanel>({
    label: 'Room Inspector',
    source: 'Tap the panorama or the frame',
    lon: null,
    lat: null,
  })
  const pictureFrame = {
    id: 'sample-frame',
    label: 'Sample Frame',
    shortLabel: 'Frame',
    lon: 141.5,
    lat: 7.25,
    radius: 468,
    width: 42,
    height: 28,
    image: '/saint-teresa.png',
    onClick: () => navigate('/saints'),
  }
  const guardianAngel = {
    label: 'Guardian Angel',
    lon: 0,
    lat: 88.5,
    radius: 498.6,
    size: 28,
    image: '/Guardian%20Angel.png',
    onClick: () => navigate('/guardian-angel'),
  }
  const firstMansion = {
    id: 'first-mansion',
    label: 'First Mansion',
    shortLabel: '1st',
    lon: 0.14,
    lat: 4.15,
    onClick: () => navigate('/first-mansion'),
    point: sphericalToVector3(0.14, 4.15),
  }
  const rangeHotspots: RangeHotspot[] = [
    {
      id: 'door',
      label: 'Door',
      shortLabel: 'Door',
      lonMin: 164,
      lonMax: -166,
      latMin: -14.91,
      latMax: 31.95,
      onClick: () => navigate('/gate'),
    },
    {
      id: 'chair',
      label: 'Chair',
      shortLabel: 'Chair',
      lonMin: -127.36,
      lonMax: -114,
      latMin: -25.78,
      latMax: -6.82,
      onClick: () => navigate('/reflection', { state: { from: 'room' } }),
    },
  ]
  const hotspotPoints: HotspotPoint[] = [
    {
      id: 'crucifix',
      label: 'Crucifix',
      shortLabel: 'Cross',
      lon: 86.16,
      lat: 18.41,
      onClick: () => navigate('/prayer'),
      point: sphericalToVector3(86.16, 18.41),
    },
    {
      id: 'bible',
      label: 'Bible',
      shortLabel: 'Bible',
      lon: -70.72,
      lat: -13.18,
      onClick: () => navigate('/daily-gospel'),
      point: sphericalToVector3(-70.72, -13.18),
    },
    {
      id: 'candle',
      label: 'Candle',
      shortLabel: 'Candle',
      lon: -86.33,
      lat: -11.82,
      onClick: () => navigate('/community/friends-of-the-suffering', { state: { from: 'room' } }),
      point: sphericalToVector3(-86.33, -11.82),
    },
    {
      id: 'cc',
      label: 'CC',
      shortLabel: 'CC',
      lon: -113.17,
      lat: 9.4,
      onClick: () => window.location.assign(catechismUrl),
      point: sphericalToVector3(-113.17, 9.4),
    },
    firstMansion,
  ]

  useEffect(() => {
    window.sessionStorage.removeItem('spero-room-entry')
  }, [])

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
      const frameInteractiveObjects: THREE.Object3D[] = []
      const guardianInteractiveObjects: THREE.Object3D[] = []

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

      const frameGroup = new THREE.Group()
      frameGroup.position.copy(sphericalToVector3(pictureFrame.lon, pictureFrame.lat, pictureFrame.radius))
      frameGroup.lookAt(0, 0, 0)
      scene.add(frameGroup)

      const frameBorderGeometry = new THREE.PlaneGeometry(pictureFrame.width, pictureFrame.height)
      const frameBorderMaterial = new THREE.MeshBasicMaterial({
        color: 0x6a4b2f,
        transparent: true,
        opacity: 0.96,
      })
      const frameBorder = new THREE.Mesh(frameBorderGeometry, frameBorderMaterial)
      frameGroup.add(frameBorder)

      const frameMattingGeometry = new THREE.PlaneGeometry(pictureFrame.width - 4, pictureFrame.height - 4)
      const frameMattingMaterial = new THREE.MeshBasicMaterial({
        color: 0x17120f,
        transparent: true,
        opacity: 0.96,
      })
      const frameMatting = new THREE.Mesh(frameMattingGeometry, frameMattingMaterial)
      frameMatting.position.z = 0.12
      frameGroup.add(frameMatting)

      const framedImageGeometry = new THREE.PlaneGeometry(pictureFrame.width - 7, pictureFrame.height - 7)
      const framedImageMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const framedImage = new THREE.Mesh(framedImageGeometry, framedImageMaterial)
      framedImage.position.z = 0.2
      frameGroup.add(framedImage)

      frameInteractiveObjects.push(frameBorder, frameMatting, framedImage)

      const framedImageTexture = loader.load(pictureFrame.image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        framedImageMaterial.map = texture
        framedImageMaterial.needsUpdate = true
      })

      const guardianPlaneGeometry = new THREE.PlaneGeometry(guardianAngel.size, guardianAngel.size)
      const guardianPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
      })
      const guardianPlane = new THREE.Mesh(guardianPlaneGeometry, guardianPlaneMaterial)
      guardianPlane.position.copy(sphericalToVector3(guardianAngel.lon, guardianAngel.lat, guardianAngel.radius))
      guardianPlane.lookAt(0, 0, 0)
      guardianPlane.position.multiplyScalar(1.0002)
      guardianPlane.renderOrder = 2
      scene.add(guardianPlane)

      guardianInteractiveObjects.push(guardianPlane)

      const guardianAngelTexture = loader.load(guardianAngel.image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        guardianPlaneMaterial.map = texture
        guardianPlaneMaterial.needsUpdate = true
      })

      const stThereseGroup = new THREE.Group()
      stThereseGroup.position.copy(sphericalToVector3(127, -13, 496.2))
      stThereseGroup.lookAt(0, 0, 0)
      scene.add(stThereseGroup)

      const stThereseShadowGeometry = new THREE.PlaneGeometry(18, 7)
      const stThereseShadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x120e0b,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      })
      const stThereseShadow = new THREE.Mesh(stThereseShadowGeometry, stThereseShadowMaterial)
      stThereseShadow.position.set(0, -11.5, -0.08)
      stThereseShadow.scale.set(1.35, 0.9, 1)
      stThereseGroup.add(stThereseShadow)

      const stTheresePlaneGeometry = new THREE.PlaneGeometry(68, 85)
      const stTheresePlaneMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          map: { value: null },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D map;
          varying vec2 vUv;
          void main() {
            vec4 tex = texture2D(map, vUv);
            if (tex.a < 0.02) discard;

            float leftLight = (1.0 - vUv.x) * 0.16;
            float bottomLight = (1.0 - vUv.y) * 0.08;
            float rightFalloff = vUv.x * 0.09;
            float edgeFade = smoothstep(0.02, 0.10, vUv.x) * smoothstep(0.02, 0.10, vUv.y) *
              smoothstep(0.02, 0.10, 1.0 - vUv.x) * smoothstep(0.02, 0.10, 1.0 - vUv.y);

            vec3 warm = vec3(1.0, 0.86, 0.68);
            vec3 shaded = tex.rgb * (1.0 - rightFalloff) + warm * (leftLight + bottomLight);
            shaded = mix(shaded, shaded * 0.96, 1.0 - edgeFade);

            gl_FragColor = vec4(shaded, tex.a * 0.98);
          }
        `,
      })
      const stTheresePlane = new THREE.Mesh(stTheresePlaneGeometry, stTheresePlaneMaterial)
      stTheresePlane.position.set(0, -10, 0.06)
      stThereseGroup.add(stTheresePlane)

      const stThereseWrapGeometry = new THREE.PlaneGeometry(70, 87)
      const stThereseWrapMaterial = new THREE.MeshBasicMaterial({
        color: 0xffc98c,
        transparent: true,
        opacity: 0.045,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const stThereseWrap = new THREE.Mesh(stThereseWrapGeometry, stThereseWrapMaterial)
      stThereseWrap.position.set(0, -10, -0.02)
      stThereseGroup.add(stThereseWrap)

      const stThereseTexture = loader.load('/St. Therese.png', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        stTheresePlaneMaterial.uniforms.map.value = texture
        stTheresePlaneMaterial.needsUpdate = true
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
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

      const setPanelFromHit = (label: string, lonValue: number, latValue: number, source: string) => {
        setCoordinatePanel({
          label,
          source,
          lon: Number(lonValue.toFixed(2)),
          lat: Number(latValue.toFixed(2)),
        })
      }

      const onCanvasClick = (event: MouseEvent) => {
        if (dragDistance > 6) return

        const rect = renderer?.domElement.getBoundingClientRect()
        if (!renderer || !rect) return

        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        raycaster.setFromCamera(pointer, camera)

        const guardianHits = raycaster.intersectObjects(guardianInteractiveObjects, false)
        if (guardianHits.length) {
          setPanelFromHit(guardianAngel.label, guardianAngel.lon, guardianAngel.lat, 'Guardian hotspot')
          guardianAngel.onClick()
          return
        }

        const frameHits = raycaster.intersectObjects(frameInteractiveObjects, false)
        if (frameHits.length) {
          setPanelFromHit(pictureFrame.label, pictureFrame.lon, pictureFrame.lat, 'Frame hotspot')
          pictureFrame.onClick()
          return
        }

        const intersections = raycaster.intersectObject(mesh, false)
        if (!intersections.length) return

        const hit = intersections[0].point
        const { lon: hitLon, lat: hitLat } = vector3ToSpherical(hit)

        for (const rangeHotspot of rangeHotspots) {
          if (
            isLonInRange(hitLon, rangeHotspot.lonMin, rangeHotspot.lonMax) &&
            hitLat >= rangeHotspot.latMin &&
            hitLat <= rangeHotspot.latMax
          ) {
            setPanelFromHit(rangeHotspot.label, hitLon, hitLat, 'Wall hotspot')
            rangeHotspot.onClick()
            return
          }
        }

        setPanelFromHit('Panorama', hitLon, hitLat, 'Wall click')
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
          element.style.transform = `translate(${x}px, ${y}px)`
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
        framedImageTexture.dispose()
        framedImageMaterial.dispose()
        framedImageGeometry.dispose()
        frameMattingMaterial.dispose()
        frameMattingGeometry.dispose()
        frameBorderMaterial.dispose()
        frameBorderGeometry.dispose()
        guardianAngelTexture.dispose()
        guardianPlaneMaterial.dispose()
        guardianPlaneGeometry.dispose()
        stThereseTexture.dispose()
        stTheresePlaneMaterial.dispose()
        stTheresePlaneGeometry.dispose()
        stThereseWrapMaterial.dispose()
        stThereseWrapGeometry.dispose()
        stThereseShadowMaterial.dispose()
        stThereseShadowGeometry.dispose()
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
          <div
            key={hotspot.id}
            ref={(element) => {
              hotspotRefs.current[hotspot.id] = element
            }}
            className="pointer-events-none absolute left-0 top-0"
          >
            <button
              type="button"
              onClick={() => {
                setCoordinatePanel({
                  label: hotspot.label,
                  source: 'Hotspot',
                  lon: Number(hotspot.lon.toFixed(2)),
                  lat: Number(hotspot.lat.toFixed(2)),
                })
                hotspot.onClick()
              }}
              aria-label={`${hotspot.label} hotspot`}
              title={hotspot.label}
              className={`pointer-events-auto absolute left-0 top-0 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-transparent bg-transparent text-transparent shadow-none opacity-0 transition hover:opacity-100 ${
                hotspot.id === 'crucifix' || hotspot.id === 'bible'
                  ? 'h-[3.75rem] w-[3.75rem] sm:h-[4.5rem] sm:w-[4.5rem]'
                  : hotspot.id === 'first-mansion'
                    ? 'h-[1.6rem] w-[1.6rem] sm:h-[1.8rem] sm:w-[1.8rem]'
                    : 'h-[2.25rem] w-[2.25rem] sm:h-[2.625rem] sm:w-[2.625rem]'
              }`}
            >
              {hotspot.id === 'first-mansion' ? (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-full w-full text-[#e7cba9]/28 transition hover:text-[#e7cba9]/45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20V10h16v10" />
                  <path d="M6 10V6h3v4" />
                  <path d="M15 10V6h3v4" />
                  <path d="M9 20v-5h6v5" />
                  <path d="M7 20h10" />
                  </svg>
              ) : null}
            </button>
          </div>
        ))}
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
