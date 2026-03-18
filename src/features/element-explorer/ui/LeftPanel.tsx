import { CATEGORY_COLORS } from '../../../entities/element'
import { translations, useAppStore } from '../../../shared'

const STABILITY_BARS = [3, 5, 4, 7, 5, 6, 4]

export function LeftPanel() {
  const { selectedElement, hoveredElement, language } = useAppStore()
  const el = selectedElement ?? hoveredElement
  const copy = translations[language]

  return (
    <div className="fixed bottom-24 left-6 z-40 select-none" style={{ maxWidth: '260px' }}>
      <div className="mb-6">
        <h1 className="font-space font-semibold leading-tight" style={{ fontSize: '34px', color: 'var(--text-primary)' }}>
          {copy.leftPanel.title}
        </h1>
        <h2
          className="font-space font-bold tracking-widest"
          style={{ fontSize: '16px', letterSpacing: '0.24em', color: 'var(--text-primary)' }}
        >
          {copy.leftPanel.subtitle}
        </h2>
        <p
          className="font-inter mt-2 leading-relaxed"
          style={{
            fontSize: '11px',
            letterSpacing: '0.06em',
            lineHeight: '1.6',
            color: 'var(--text-muted)',
          }}
        >
          {copy.leftPanel.description.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      {el && (
        <div
          className="mb-5 p-4 rounded"
          style={{ background: 'var(--app-bg-card)', boxShadow: '0 10px 32px var(--shadow-glow)' }}
        >
          <div
            className="font-space font-bold text-2xl"
            style={{ color: CATEGORY_COLORS[el.category] }}
          >
            {el.symbol}
          </div>
          <div className="font-space text-base font-medium" style={{ color: 'var(--text-primary)' }}>
            {el.name}
          </div>
          <div className="mt-2 space-y-1">
            <DataRow label={copy.leftPanel.atomicNumber} value={String(el.atomicNumber)} />
            <DataRow label={copy.leftPanel.weight} value={`${el.atomicWeight} u`} />
            {el.meltingPoint && <DataRow label={copy.leftPanel.melting} value={`${el.meltingPoint} K`} />}
            {el.boilingPoint && <DataRow label={copy.leftPanel.boiling} value={`${el.boilingPoint} K`} />}
            {el.density && <DataRow label={copy.leftPanel.density} value={`${el.density} g/cm³`} />}
          </div>
          <div
            className="font-inter mt-2 tracking-wider"
            style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-muted)' }}
          >
            {el.electronConfig}
          </div>
        </div>
      )}

      <div className="mb-4">
        <span
          className="font-inter tracking-widest block mb-2"
          style={{ fontSize: '11px', letterSpacing: '0.16em', color: 'var(--text-muted)' }}
        >
          {copy.leftPanel.stabilityIndex}
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
          style={{ fontSize: '11px', letterSpacing: '0.16em', color: '#ff59e3' }}
        >
          {copy.leftPanel.fluxVariance}
        </span>
        <span className="font-inter text-base" style={{ color: 'var(--text-primary)' }}>
          1.024e-12 μs
        </span>
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="font-inter" style={{ fontSize: '11px', letterSpacing: '0.06em', color: 'var(--text-subtle)' }}>
        {label}
      </span>
      <span className="font-inter" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
        {value}
      </span>
    </div>
  )
}
