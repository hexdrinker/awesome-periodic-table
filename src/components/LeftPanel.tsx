import { useStore } from '../store/useStore'
import { CATEGORY_COLORS } from '../data/elements'

const STABILITY_BARS = [3, 5, 4, 7, 5, 6, 4]

export function LeftPanel() {
  const { selectedElement, hoveredElement } = useStore()
  const el = selectedElement ?? hoveredElement

  return (
    <div className="fixed bottom-24 left-6 z-40 select-none" style={{ maxWidth: '220px' }}>
      {/* Title block */}
      <div className="mb-6">
        <h1 className="font-space font-semibold text-white leading-tight" style={{ fontSize: '28px' }}>
          Quantum 3D
        </h1>
        <h2
          className="font-space font-bold tracking-widest text-white"
          style={{ fontSize: '13px', letterSpacing: '0.28em' }}
        >
          PERIODIC TABLE
        </h2>
        <p
          className="font-inter text-gray-500 mt-2 leading-relaxed"
          style={{ fontSize: '9px', letterSpacing: '0.06em', lineHeight: '1.6' }}
        >
          SIMULATED ATOMIC LANDSCAPE RENDERED<br />
          AT 10⁻¹⁰ SCALE. NAVIGATE THE CUBES TO<br />
          INSPECT ISOTOPE STABILITY AND<br />
          ELECTRON SHELL CONFIGURATION.
        </p>
      </div>

      {/* Selected element info */}
      {el && (
        <div className="mb-5 p-3 rounded" style={{ background: 'rgba(22, 26, 34, 0.7)' }}>
          <div
            className="font-space font-bold text-2xl"
            style={{ color: CATEGORY_COLORS[el.category] }}
          >
            {el.symbol}
          </div>
          <div className="font-space text-white text-sm font-medium">{el.name}</div>
          <div className="mt-2 space-y-1">
            <DataRow label="Atomic #" value={String(el.atomicNumber)} />
            <DataRow label="Weight" value={`${el.atomicWeight} u`} />
            {el.meltingPoint && <DataRow label="Melting" value={`${el.meltingPoint} K`} />}
            {el.boilingPoint && <DataRow label="Boiling" value={`${el.boilingPoint} K`} />}
            {el.density && <DataRow label="Density" value={`${el.density} g/cm³`} />}
          </div>
          <div
            className="font-inter text-gray-500 mt-2 tracking-wider"
            style={{ fontSize: '9px', letterSpacing: '0.1em' }}
          >
            {el.electronConfig}
          </div>
        </div>
      )}

      {/* Stability Index */}
      <div className="mb-4">
        <span
          className="font-inter text-gray-500 tracking-widest block mb-2"
          style={{ fontSize: '9px', letterSpacing: '0.18em' }}
        >
          STABILITY INDEX
        </span>
        <div className="flex items-end gap-1" style={{ height: '28px' }}>
          {STABILITY_BARS.map((h, i) => (
            <div
              key={i}
              className="stability-bar"
              style={{
                height: `${h * 4}px`,
                opacity: 0.4 + i * 0.08,
                background: '#a1faff',
              }}
            />
          ))}
        </div>
      </div>

      {/* Flux Variance */}
      <div>
        <span
          className="font-inter tracking-widest block mb-1"
          style={{ fontSize: '9px', letterSpacing: '0.18em', color: '#ff59e3' }}
        >
          FLUX VARIANCE
        </span>
        <span className="font-inter text-white text-sm">1.024e-12 μs</span>
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="font-inter text-gray-600" style={{ fontSize: '9px', letterSpacing: '0.08em' }}>
        {label.toUpperCase()}
      </span>
      <span className="font-inter text-gray-300" style={{ fontSize: '9px' }}>
        {value}
      </span>
    </div>
  )
}
