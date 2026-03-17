import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Mesh } from 'three'
import type { Element } from '../data/elements'
import { CATEGORY_COLORS } from '../data/elements'
import { useStore } from '../store/useStore'

interface ElementCubeProps {
  element: Element
}

const SPACING = 1.25
const CUBE_SIZE = 0.88
const CUBE_HEIGHT = 0.88

export function ElementCube({ element }: ElementCubeProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { setHoveredElement, setSelectedElement, selectedElement, filterCategory } = useStore()

  const catColor = CATEGORY_COLORS[element.category]
  const isSelected = selectedElement?.atomicNumber === element.atomicNumber
  const isFiltered = filterCategory !== null && element.category !== filterCategory

  const x = element.xPos * SPACING
  const z = element.yPos * SPACING

  const targetScale = hovered || isSelected ? 1.12 : 1.0
  const targetEmissive = hovered || isSelected ? 0.75 : isFiltered ? 0.05 : 0.28

  const color = useMemo(() => new THREE.Color(catColor), [catColor])
  const baseColor = useMemo(() => new THREE.Color('#1a1f2a'), [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, delta * 8)
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 10)
    )
  })

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={meshRef}
        castShadow
        onPointerEnter={(e) => {
          e.stopPropagation()
          setHovered(true)
          setHoveredElement(element)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setHovered(false)
          setHoveredElement(null)
          document.body.style.cursor = 'default'
        }}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedElement(isSelected ? null : element)
        }}
      >
        <boxGeometry args={[CUBE_SIZE, CUBE_HEIGHT, CUBE_SIZE]} />
        <meshStandardMaterial
          color={isFiltered ? '#111418' : baseColor}
          emissive={color}
          emissiveIntensity={targetEmissive}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Atomic number - top left */}
      <Text
        position={[-CUBE_SIZE * 0.28, CUBE_HEIGHT * 0.51, -CUBE_SIZE * 0.28]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.13}
        color={isFiltered ? '#333' : catColor}
        anchorX="left"
        anchorY="top"
        font={undefined}
        depthOffset={-1}
      >
        {element.atomicNumber}
      </Text>

      {/* Symbol */}
      <Text
        position={[0, CUBE_HEIGHT * 0.51, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.32}
        color={isFiltered ? '#2a2f3a' : '#e8f4f8'}
        anchorX="center"
        anchorY="middle"
        font={undefined}
        depthOffset={-1}
        fontWeight={600}
      >
        {element.symbol}
      </Text>

      {/* Atomic weight - bottom */}
      <Text
        position={[0, CUBE_HEIGHT * 0.51, CUBE_SIZE * 0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.1}
        color={isFiltered ? '#333' : catColor}
        anchorX="center"
        anchorY="bottom"
        font={undefined}
        depthOffset={-1}
      >
        {typeof element.atomicWeight === 'number'
          ? element.atomicWeight % 1 === 0
            ? `(${element.atomicWeight})`
            : element.atomicWeight.toFixed(3)
          : element.atomicWeight}
      </Text>

      {/* Hover tooltip */}
      {(hovered || isSelected) && !isFiltered && (
        <Html position={[0, CUBE_HEIGHT + 0.5, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
          <div className="glass-tooltip px-3 py-2 min-w-[130px]">
            <div
              className="text-xs font-space font-semibold tracking-wider mb-1"
              style={{ color: catColor }}
            >
              {element.symbol} — {element.atomicNumber}
            </div>
            <div className="text-white text-sm font-space font-medium">{element.name}</div>
            <div className="text-gray-400 text-xs mt-1 font-inter" style={{ fontSize: '10px' }}>
              {element.atomicWeight} u
            </div>
            {element.meltingPoint && (
              <div className="text-gray-500 text-xs font-inter" style={{ fontSize: '10px' }}>
                MP: {element.meltingPoint} K
              </div>
            )}
            <div className="text-gray-600 text-xs font-inter capitalize mt-1" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>
              {element.category.replace(/-/g, ' ')}
            </div>
          </div>
        </Html>
      )}

      {/* Edge glow outline for selected */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(CUBE_SIZE + 0.02, CUBE_HEIGHT + 0.02, CUBE_SIZE + 0.02)]} />
          <lineBasicMaterial color={catColor} transparent opacity={0.8} />
        </lineSegments>
      )}
    </group>
  )
}
