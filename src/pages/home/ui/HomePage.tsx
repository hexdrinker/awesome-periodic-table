import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { BottomControls } from '@/features/camera-control'
import { LeftPanel } from '@/features/element-explorer'
import { RightPanel } from '@/features/element-filter'
import { Scene3D } from '@/features/periodic-table-scene'
import { Navbar } from '@/features/preferences'
import { sceneThemePalettes, translations, useAppStore, useResolvedTheme } from '@/shared'

function LoadingFallback() {
  const language = useAppStore((state) => state.language)
  const resolvedTheme = useResolvedTheme()
  const palette = sceneThemePalettes[resolvedTheme]
  const copy = translations[language]

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: palette.background }}
    >
      <div className="text-center">
        <div
          className="font-space font-semibold tracking-widest mb-2"
          style={{ fontSize: '14px', letterSpacing: '0.3em', color: 'var(--accent)' }}
        >
          {copy.brand}
        </div>
        <div
          className="font-inter tracking-widest"
          style={{ fontSize: '12px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}
        >
          {copy.loading.subtitle}
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  const setSelectedElement = useAppStore((state) => state.setSelectedElement)
  const setHoveredElement = useAppStore((state) => state.setHoveredElement)
  const resolvedTheme = useResolvedTheme()
  const palette = sceneThemePalettes[resolvedTheme]

  useEffect(() => {
    setSelectedElement(null)
    setHoveredElement(null)
  }, [setHoveredElement, setSelectedElement])

  return (
    <div className="ui-shell" style={{ width: '100vw', height: '100vh', background: palette.background, position: 'relative' }}>
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ fov: 48, near: 0.1, far: 500, position: [10.5, 15.5, 19.5] }}
        gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.1 }}
        shadows
      >
        <color attach="background" args={[palette.background]} />
        <fog attach="fog" args={[palette.fog, 40, 120]} />
        <Suspense fallback={null}>
          <Scene3D theme={resolvedTheme} />
        </Suspense>
      </Canvas>

      <Suspense fallback={<LoadingFallback />}>
        <Navbar />
        <LeftPanel />
        <RightPanel />
        <BottomControls />
      </Suspense>
    </div>
  )
}
