import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { elements } from '../data/elements'
import { ElementCube } from './ElementCube'
import { useStore } from '../store/useStore'

const INITIAL_CAMERA_POS = new THREE.Vector3(12, 16, 22)
const CAMERA_TARGET = new THREE.Vector3(10.5, 0, 5.5)

function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const { controlMode, autoRotate, setControlMode } = useStore()

  useEffect(() => {
    camera.position.copy(INITIAL_CAMERA_POS)
  }, [camera])

  useFrame(() => {
    if (!controlsRef.current) return

    if (controlMode === 'zoom-in') {
      camera.position.lerp(
        camera.position.clone().multiplyScalar(0.97).add(CAMERA_TARGET.clone().multiplyScalar(0.03)),
        0.05
      )
    } else if (controlMode === 'zoom-out') {
      const dir = camera.position.clone().sub(CAMERA_TARGET).normalize()
      camera.position.add(dir.multiplyScalar(0.08))
    }

    if (controlMode === 'reset') {
      camera.position.lerp(INITIAL_CAMERA_POS, 0.05)
      controlsRef.current.target.lerp(CAMERA_TARGET, 0.05)
      if (camera.position.distanceTo(INITIAL_CAMERA_POS) < 0.1) {
        setControlMode('none')
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      target={CAMERA_TARGET}
      enableDamping
      dampingFactor={0.06}
      autoRotate={autoRotate || controlMode === 'rotate'}
      autoRotateSpeed={0.4}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={0.2}
      minDistance={6}
      maxDistance={60}
    />
  )
}

function FloorGrid() {
  return (
    <gridHelper
      args={[40, 40, '#1a2030', '#111620']}
      position={[10.5, -0.46, 5.5]}
    />
  )
}

export function Scene3D() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[20, 30, 20]}
        intensity={0.8}
        color="#a1faff"
        castShadow
      />
      <directionalLight position={[-10, 15, -10]} intensity={0.3} color="#ff59e3" />
      <pointLight position={[10, 8, 5]} intensity={1.2} color="#a1faff" distance={30} decay={2} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#c3ff96" distance={20} decay={2} />
      <pointLight position={[20, 5, 10]} intensity={0.5} color="#ff59e3" distance={20} decay={2} />

      {/* Background stars */}
      <Stars
        radius={120}
        depth={60}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Floor grid */}
      <FloorGrid />

      {/* Element cubes */}
      {elements.map((el) => (
        <ElementCube key={el.atomicNumber} element={el} />
      ))}

      {/* Camera controls */}
      <CameraController />

      {/* Post-processing glow */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.7}
        />
      </EffectComposer>
    </>
  )
}
