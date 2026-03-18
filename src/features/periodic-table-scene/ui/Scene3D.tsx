import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { ElementCube, elements } from '../../../entities/element'
import { sceneThemePalettes, useAppStore } from '../../../shared'
import type { ResolvedTheme } from '../../../shared'

const TABLE_CAMERA_POS = new THREE.Vector3(10.5, 15.5, 19.5)
const TABLE_CAMERA_TARGET = new THREE.Vector3(10.5, 0.2, 4.8)

function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const { controlMode, autoRotate, setControlMode } = useAppStore()
  const initialCameraPos = TABLE_CAMERA_POS
  const cameraTarget = TABLE_CAMERA_TARGET

  useEffect(() => {
    camera.position.copy(initialCameraPos)
    controlsRef.current?.target.copy(cameraTarget)
    controlsRef.current?.update()
  }, [camera, initialCameraPos, cameraTarget])

  useFrame(() => {
    if (!controlsRef.current) return

    if (controlMode === 'zoom-in') {
      camera.position.lerp(
        camera.position.clone().multiplyScalar(0.97).add(cameraTarget.clone().multiplyScalar(0.03)),
        0.05
      )
    } else if (controlMode === 'zoom-out') {
      const dir = camera.position.clone().sub(cameraTarget).normalize()
      camera.position.add(dir.multiplyScalar(0.08))
    }

    if (controlMode === 'reset') {
      camera.position.lerp(initialCameraPos, 0.05)
      controlsRef.current.target.lerp(cameraTarget, 0.05)
      if (camera.position.distanceTo(initialCameraPos) < 0.1) {
        setControlMode('none')
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      target={cameraTarget}
      enableDamping
      dampingFactor={0.06}
      autoRotate={autoRotate || controlMode === 'rotate'}
      autoRotateSpeed={1}
      rotateSpeed={1}
      maxPolarAngle={Math.PI - 0.01}
      minPolarAngle={0.01}
      minDistance={6}
      maxDistance={60}
    />
  )
}

function FloorGrid({ theme }: { theme: ResolvedTheme }) {
  const palette = sceneThemePalettes[theme]

  return (
    <gridHelper
      args={[44, 44, palette.gridMajor, palette.gridMinor]}
      position={[10.5, -0.4, 4.8]}
    />
  )
}

export function Scene3D({ theme }: { theme: ResolvedTheme }) {
  const palette = sceneThemePalettes[theme]

  return (
    <>
      <ambientLight intensity={palette.ambient} />
      <directionalLight
        position={[18, 24, 18]}
        intensity={palette.primaryDirectional}
        color="#a1faff"
        castShadow
      />
      <directionalLight position={[-8, 12, -6]} intensity={palette.secondaryDirectional} color="#ff59e3" />
      <pointLight
        position={[10.5, 5.5, 8]}
        intensity={palette.primaryPoint}
        color="#a1faff"
        distance={24}
        decay={2}
      />
      <pointLight position={[17, 4, 6]} intensity={palette.secondaryPoint} color="#ff59e3" distance={16} decay={2} />
      <pointLight position={[3, 4, 6]} intensity={palette.tertiaryPoint} color="#c3ff96" distance={16} decay={2} />

      {palette.showStars && (
        <Stars
          radius={120}
          depth={60}
          count={2200}
          factor={2.2}
          saturation={0}
          fade
          speed={0.2}
        />
      )}

      <FloorGrid theme={theme} />

      {elements.map((el) => (
        <ElementCube key={el.atomicNumber} element={el} />
      ))}

      <CameraController />

      <EffectComposer>
        <Bloom
          intensity={palette.bloom}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.7}
        />
      </EffectComposer>
    </>
  )
}
