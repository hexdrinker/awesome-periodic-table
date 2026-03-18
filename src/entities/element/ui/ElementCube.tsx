import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { LineSegments, Mesh } from 'three'
import { useAppStore, getCategoryLabel, translations } from '../../../shared'
import type { Element } from '../model/elements'
import { CATEGORY_COLORS } from '../model/elements'
import { getElementStateAtTemperature } from '../model/physical-state'

interface ElementCubeProps {
  element: Element
}

const SPACING = 1.14
const CUBE_SIZE = 0.84
const CUBE_HEIGHT = 0.84

export function ElementCube({ element }: ElementCubeProps) {
  const meshRef = useRef<Mesh>(null)
  const outlineRef = useRef<LineSegments>(null)
  const [hovered, setHovered] = useState(false)
  const {
    setHoveredElement,
    setSelectedElement,
    selectedElement,
    filterCategory,
    filterStates,
    filterTemperature,
    language,
  } = useAppStore()
  const copy = translations[language]

  const catColor = CATEGORY_COLORS[element.category]
  const isSelected = selectedElement?.atomicNumber === element.atomicNumber
  const stateAtTemperature = useMemo(
    () => getElementStateAtTemperature(element, filterTemperature),
    [element, filterTemperature],
  )
  const matchesCategory =
    filterCategory === null || element.category === filterCategory
  const matchesPhysicalState =
    filterStates.length === 0 ||
    (stateAtTemperature !== 'unknown' && filterStates.includes(stateAtTemperature))
  const isFiltered = !matchesCategory || !matchesPhysicalState

  const x = element.xPos * SPACING
  const y = 0
  const z = element.yPos * SPACING

  const targetScale = hovered || isSelected ? 1.05 : 1.0
  const targetEmissive = hovered || isSelected ? 1.1 : isFiltered ? 0.04 : 0.58
  const targetOpacity = hovered || isSelected ? 0.9 : isFiltered ? 0.26 : 0.76
  const targetOutlineOpacity =
    hovered || isSelected ? 0.9 : isFiltered ? 0.12 : 0.48

  const color = useMemo(() => new THREE.Color(catColor), [catColor])
  const baseColor = useMemo(() => new THREE.Color('#1a1f2a'), [])
  const rightFaceColor = useMemo(
    () => baseColor.clone().lerp(color, isFiltered ? 0.02 : 0.08),
    [baseColor, color, isFiltered],
  )
  const leftFaceColor = useMemo(
    () => baseColor.clone().lerp(color, isFiltered ? 0.01 : 0.04),
    [baseColor, color, isFiltered],
  )
  const topFaceColor = useMemo(
    () => baseColor.clone().lerp(color, isFiltered ? 0.03 : 0.14),
    [baseColor, color, isFiltered],
  )
  const bottomFaceColor = useMemo(
    () => baseColor.clone().offsetHSL(0, 0, -0.08),
    [baseColor],
  )
  const frontFaceColor = useMemo(
    () => baseColor.clone().lerp(color, isFiltered ? 0.01 : 0.05),
    [baseColor, color, isFiltered],
  )
  const backFaceColor = useMemo(
    () => baseColor.clone().offsetHSL(0, 0, -0.03),
    [baseColor],
  )

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const materials = Array.isArray(meshRef.current.material)
      ? (meshRef.current.material as THREE.MeshPhysicalMaterial[])
      : [meshRef.current.material as THREE.MeshPhysicalMaterial]

    materials.forEach((mat) => {
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        targetEmissive,
        delta * 8,
      )
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 8)
    })

    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 10),
    )

    if (outlineRef.current) {
      const outlineMaterial = outlineRef.current
        .material as THREE.LineBasicMaterial
      outlineMaterial.opacity = THREE.MathUtils.lerp(
        outlineMaterial.opacity,
        targetOutlineOpacity,
        delta * 10,
      )
    }
  })

  return (
    <group position={[x, y, z]}>
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
        <meshPhysicalMaterial
          attach='material-0'
          color={isFiltered ? '#111418' : rightFaceColor}
          emissive={color}
          emissiveIntensity={targetEmissive}
          roughness={0.38}
          metalness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.34}
          transparent
          opacity={targetOpacity}
          reflectivity={0.56}
        />
        <meshPhysicalMaterial
          attach='material-1'
          color={isFiltered ? '#101319' : leftFaceColor}
          emissive={color}
          emissiveIntensity={targetEmissive * 0.55}
          roughness={0.42}
          metalness={0.18}
          clearcoat={0.85}
          clearcoatRoughness={0.4}
          transparent
          opacity={targetOpacity}
          reflectivity={0.48}
        />
        <meshPhysicalMaterial
          attach='material-2'
          color={isFiltered ? '#171c24' : topFaceColor}
          emissive={color}
          emissiveIntensity={targetEmissive * 0.4}
          roughness={0.34}
          metalness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.24}
          transparent
          opacity={targetOpacity}
          reflectivity={0.6}
        />
        <meshPhysicalMaterial
          attach='material-3'
          color={isFiltered ? '#0d1015' : bottomFaceColor}
          emissive={color}
          emissiveIntensity={targetEmissive * 0.15}
          roughness={0.48}
          metalness={0.14}
          clearcoat={0.6}
          clearcoatRoughness={0.45}
          transparent
          opacity={targetOpacity}
          reflectivity={0.36}
        />
        <meshPhysicalMaterial
          attach='material-4'
          color={isFiltered ? '#111418' : frontFaceColor}
          emissive={color}
          emissiveIntensity={targetEmissive * 0.72}
          roughness={0.32}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.28}
          transparent
          opacity={targetOpacity}
          reflectivity={0.52}
        />
        <meshPhysicalMaterial
          attach='material-5'
          color={isFiltered ? '#0f1218' : backFaceColor}
          emissive={color}
          emissiveIntensity={targetEmissive * 0.2}
          roughness={0.44}
          metalness={0.16}
          clearcoat={0.7}
          clearcoatRoughness={0.42}
          transparent
          opacity={targetOpacity}
          reflectivity={0.4}
        />
      </mesh>

      <lineSegments ref={outlineRef}>
        <edgesGeometry
          args={[
            new THREE.BoxGeometry(
              CUBE_SIZE + 0.01,
              CUBE_HEIGHT + 0.01,
              CUBE_SIZE + 0.01,
            ),
          ]}
        />
        <lineBasicMaterial
          color={catColor}
          transparent
          opacity={targetOutlineOpacity}
        />
      </lineSegments>

      <Text
        position={[-CUBE_SIZE * 0.27, CUBE_HEIGHT * 0.51, -CUBE_SIZE * 0.27]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.1}
        color={isFiltered ? '#333' : catColor}
        anchorX='left'
        anchorY='top'
        font={undefined}
        depthOffset={-1}
      >
        {element.atomicNumber}
      </Text>

      <Text
        position={[0, CUBE_HEIGHT * 0.51, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.24}
        color={isFiltered ? '#2a2f3a' : catColor}
        anchorX='center'
        anchorY='middle'
        font={undefined}
        depthOffset={-1}
        fontWeight={600}
      >
        {element.symbol}
      </Text>

      <Text
        position={[0, CUBE_HEIGHT * 0.51, CUBE_SIZE * 0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.075}
        color={isFiltered ? '#333' : catColor}
        anchorX='center'
        anchorY='bottom'
        font={undefined}
        depthOffset={-1}
      >
        {typeof element.atomicWeight === 'number'
          ? element.atomicWeight % 1 === 0
            ? `(${element.atomicWeight})`
            : element.atomicWeight.toFixed(3)
          : element.atomicWeight}
      </Text>

      {(hovered || isSelected) && !isFiltered && (
        <Html
          position={[0, CUBE_HEIGHT + 0.5, 0]}
          center
          distanceFactor={8}
          zIndexRange={[100, 0]}
        >
          <div className='glass-tooltip px-3 py-2 min-w-[130px]'>
            <div
              className='text-xs font-space font-semibold tracking-wider mb-1'
              style={{ color: catColor }}
            >
              {element.symbol} — {element.atomicNumber}
            </div>
            <div className='text-sm font-space font-medium' style={{ color: 'var(--text-primary)' }}>
              {element.name}
            </div>
            <div
              className='text-xs mt-1 font-inter'
              style={{ fontSize: '10px', color: 'var(--text-muted)' }}
            >
              {element.atomicWeight} u
            </div>
            {element.meltingPoint && (
              <div
                className='text-xs font-inter'
                style={{ fontSize: '10px', color: 'var(--text-subtle)' }}
              >
                {copy.tooltip.meltingPoint}: {element.meltingPoint} K
              </div>
            )}
            <div
              className='text-xs font-inter mt-1'
              style={{ fontSize: '9px', letterSpacing: '0.05em', color: 'var(--text-subtle)' }}
            >
              {getCategoryLabel(element.category, language)}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
