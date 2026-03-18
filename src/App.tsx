import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene3D } from './components/Scene3D'
import { Navbar } from './components/Navbar'
import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'
import { BottomControls } from './components/BottomControls'
import { translations } from './lib/i18n'
import { sceneThemePalettes, useResolvedTheme } from './lib/theme'
import { useStore } from './store/useStore'

function LoadingFallback() {
  const language = useStore((state) => state.language)
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

export default function App() {
  const language = useStore((state) => state.language)
  const resolvedTheme = useResolvedTheme()
  const palette = sceneThemePalettes[resolvedTheme]

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.lang = language
    document.documentElement.style.colorScheme = resolvedTheme
  }, [language, resolvedTheme])

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
