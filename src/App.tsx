import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene3D } from './components/Scene3D'
import { Navbar } from './components/Navbar'
import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'
import { BottomControls } from './components/BottomControls'

function LoadingFallback() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#0b0e14' }}
    >
      <div className="text-center">
        <div
          className="font-space font-semibold tracking-widest text-primary mb-2"
          style={{ fontSize: '12px', letterSpacing: '0.3em' }}
        >
          QUANTUM OBSERVATORY
        </div>
        <div
          className="font-inter text-gray-600 tracking-widest"
          style={{ fontSize: '10px', letterSpacing: '0.2em' }}
        >
          INITIALIZING ATOMIC LATTICE...
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0b0e14', position: 'relative' }}>
      {/* 3D Canvas */}
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ fov: 55, near: 0.1, far: 500, position: [12, 16, 22] }}
        gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.1 }}
        shadows
      >
        <color attach="background" args={['#0b0e14']} />
        <fog attach="fog" args={['#0b0e14', 40, 120]} />
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <Suspense fallback={<LoadingFallback />}>
        <Navbar />
        <LeftPanel />
        <RightPanel />
        <BottomControls />
      </Suspense>
    </div>
  )
}
