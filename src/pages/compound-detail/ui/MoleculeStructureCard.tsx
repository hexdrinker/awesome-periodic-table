import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { MoleculeModel } from '@/entities/compound/model/structure'
import { useAppStore } from '@/shared'

interface MoleculeStructureCardProps {
  displayName: string
  highlights: Array<{ label: string; value: string }>
  model: MoleculeModel
  modelNote: string
  title: string
}

export function MoleculeStructureCard({
  displayName,
  highlights,
  model,
  modelNote,
  title,
}: MoleculeStructureCardProps) {
  const language = useAppStore((state) => state.language)

  return (
    <section
      className="rounded-[30px] p-6 md:p-7"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--app-bg-card) 94%, transparent), color-mix(in srgb, var(--app-bg-card) 82%, transparent))',
        boxShadow: '0 24px 80px color-mix(in srgb, var(--shadow-glow) 42%, transparent)',
      }}
    >
      <div
        className="font-inter uppercase"
        style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'var(--text-muted)' }}
      >
        {title}
      </div>

      <div
        className="mt-5 h-[320px] overflow-hidden rounded-[28px]"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, color-mix(in srgb, #ffffff 10%, transparent), transparent 38%), linear-gradient(180deg, #0a1217, #040709 72%)',
          boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--outline-soft) 75%, transparent)',
        }}
      >
        <Canvas camera={{ fov: 34, position: [0, 0, 9] }} dpr={[1, 2]}>
          <color attach="background" args={['#071014']} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 6, 5]} intensity={1.6} color="#ffffff" />
          <pointLight position={[-5, -3, 4]} intensity={10} distance={18} color="#a1faff" />
          <pointLight position={[4, 2, -5]} intensity={7} distance={18} color="#ff59e3" />
          <MoleculeScene language={language} model={model} />
          <OrbitControls
            autoRotate
            autoRotateSpeed={1.2}
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.8}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Canvas>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {highlights.map((highlight) => (
          <div
            key={highlight.label}
            className="rounded-[20px] px-4 py-4"
            style={{
              background: 'color-mix(in srgb, var(--app-bg-elev) 88%, transparent)',
              boxShadow:
                'inset 0 0 0 1px color-mix(in srgb, var(--outline-soft) 88%, transparent)',
            }}
          >
            <div
              className="font-inter uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-subtle)' }}
            >
              {highlight.label}
            </div>
            <div
              className="mt-3 font-space text-sm font-medium leading-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {highlight.value}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 font-inter leading-7"
        style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
      >
        {displayName} · {modelNote}
      </div>
    </section>
  )
}

function MoleculeScene({
  language,
  model,
}: {
  language: 'en' | 'ko'
  model: MoleculeModel
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredAtomIndex, setHoveredAtomIndex] = useState<number | null>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return
    }

    groupRef.current.rotation.y += delta * 0.18
    groupRef.current.rotation.x = Math.sin(performance.now() / 2400) * 0.12
  })

  return (
    <group ref={groupRef}>
      {model.bonds.map((bond) => (
        <BondMesh
          key={`${bond.from}-${bond.to}-${bond.order}`}
          bondOrder={bond.order}
          end={model.atoms[bond.to].position}
          start={model.atoms[bond.from].position}
        />
      ))}

      {model.atoms.map((atom) => (
        <mesh
          key={`${atom.symbol}-${atom.index}`}
          position={atom.position}
          onPointerOut={() => setHoveredAtomIndex((current) => (current === atom.index ? null : current))}
          onPointerOver={() => setHoveredAtomIndex(atom.index)}
        >
          <sphereGeometry args={[getAtomRadius(atom.symbol), 28, 28]} />
          <meshStandardMaterial
            color={getAtomColor(atom.symbol)}
            emissive={getAtomEmissive(atom.symbol)}
            emissiveIntensity={0.45}
            metalness={0.18}
            roughness={0.22}
          />
          {hoveredAtomIndex === atom.index && (
            <Html center distanceFactor={8.2} position={[0, getAtomRadius(atom.symbol) + 0.45, 0]}>
              <div
                className="pointer-events-none rounded-full px-3 py-2 font-inter"
                style={{
                  background: 'color-mix(in srgb, var(--app-bg-card) 82%, transparent)',
                  backdropFilter: 'blur(12px)',
                  boxShadow:
                    '0 20px 40px color-mix(in srgb, var(--shadow-glow) 28%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--outline-soft) 78%, transparent)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatElementTooltip(atom.symbol, language)}
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  )
}

function BondMesh({
  bondOrder,
  end,
  start,
}: {
  bondOrder: number
  end: [number, number, number]
  start: [number, number, number]
}) {
  const geometry = useMemo(() => {
    const startVector = new THREE.Vector3(...start)
    const endVector = new THREE.Vector3(...end)
    const midpoint = startVector.clone().lerp(endVector, 0.5)
    const direction = endVector.clone().sub(startVector)
    const length = direction.length()
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    )

    return { length, midpoint, quaternion }
  }, [end, start])

  return (
    <mesh
      position={geometry.midpoint}
      quaternion={geometry.quaternion}
      scale={[1, geometry.length, 1]}
    >
      <cylinderGeometry args={[getBondRadius(bondOrder), getBondRadius(bondOrder), 1, 16]} />
      <meshStandardMaterial
        color="#d9edef"
        emissive="#94f7ff"
        emissiveIntensity={0.18}
        metalness={0.28}
        roughness={0.18}
      />
    </mesh>
  )
}

function getBondRadius(order: number) {
  if (order >= 3) {
    return 0.08
  }

  if (order > 1) {
    return 0.07
  }

  return 0.055
}

function getAtomRadius(symbol: string) {
  switch (symbol) {
    case 'H':
      return 0.18
    case 'O':
    case 'N':
    case 'F':
      return 0.28
    case 'S':
    case 'P':
    case 'Cl':
      return 0.31
    case 'Na':
    case 'K':
    case 'Ca':
      return 0.34
    default:
      return 0.3
  }
}

function getAtomColor(symbol: string) {
  switch (symbol) {
    case 'H':
      return '#f7fbff'
    case 'C':
      return '#b7c3cb'
    case 'N':
      return '#8fdcff'
    case 'O':
      return '#ff8bb7'
    case 'S':
      return '#ffe083'
    case 'P':
      return '#ffb87b'
    case 'Cl':
      return '#a7ffbf'
    case 'F':
      return '#d6ffc2'
    case 'Na':
    case 'K':
      return '#b7bbff'
    case 'Ca':
      return '#e7d7ff'
    default:
      return '#d7e1e7'
  }
}

function getAtomEmissive(symbol: string) {
  switch (symbol) {
    case 'O':
      return '#e1407f'
    case 'N':
      return '#0fa1d8'
    case 'Cl':
    case 'F':
      return '#30b861'
    case 'S':
      return '#d9ab1c'
    default:
      return '#4d646c'
  }
}

function formatElementTooltip(symbol: string, language: 'en' | 'ko') {
  const element = ELEMENT_LABELS[symbol]

  if (!element) {
    return symbol
  }

  if (language === 'ko') {
    return `${symbol} · ${element.ko}`
  }

  return `${symbol} · ${element.en}`
}

const ELEMENT_LABELS: Record<string, { en: string; ko: string }> = {
  B: { en: 'Boron', ko: '붕소' },
  Br: { en: 'Bromine', ko: '브로민' },
  C: { en: 'Carbon', ko: '탄소' },
  Ca: { en: 'Calcium', ko: '칼슘' },
  Cl: { en: 'Chlorine', ko: '염소' },
  F: { en: 'Fluorine', ko: '플루오린' },
  H: { en: 'Hydrogen', ko: '수소' },
  I: { en: 'Iodine', ko: '아이오딘' },
  K: { en: 'Potassium', ko: '칼륨' },
  N: { en: 'Nitrogen', ko: '질소' },
  Na: { en: 'Sodium', ko: '나트륨' },
  O: { en: 'Oxygen', ko: '산소' },
  P: { en: 'Phosphorus', ko: '인' },
  S: { en: 'Sulfur', ko: '황' },
  Si: { en: 'Silicon', ko: '규소' },
}
