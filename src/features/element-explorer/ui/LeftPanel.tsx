import { CATEGORY_COLORS, useElementDetailQuery } from '@/entities/element'
import { translations, useAppStore } from '@/shared'

export function LeftPanel() {
  const { selectedElement, hoveredElement, language } = useAppStore()
  const el = selectedElement ?? hoveredElement
  const { data: selectedDetail, isFetching, isError } = useElementDetailQuery(
    selectedElement?.atomicNumber,
    language,
  )
  const copy = translations[language]
  const detail = selectedElement ? selectedDetail : null
  const electronConfig = detail?.electronConfig || el?.electronConfig || ''
  const weightValue = detail?.atomicWeightText
    ? `${detail.atomicWeightText} u`
    : el
      ? `${formatAtomicWeight(el.atomicWeight)} u`
      : ''
  const standardState = el?.standardState ?? null
  const oxidationStates = detail?.oxidationStates ?? el?.oxidationStates ?? null
  const physicalDescription = detail?.physicalDescription
  const physicalDescriptionSourceLabel =
    detail?.physicalDescriptionSource === 'wikipedia' ? 'Wikipedia' : 'PubChem'

  return (
    <div
      className="fixed top-[4.75rem] bottom-24 left-6 z-40 flex flex-col justify-between select-none pointer-events-none"
      style={{ maxWidth: '260px' }}
    >
      <div>
        {el && (
          <div
            className="p-4 rounded"
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
              <DataRow label={copy.leftPanel.weight} value={weightValue} />
              {el.meltingPoint && <DataRow label={copy.leftPanel.melting} value={`${formatNumber(el.meltingPoint)} K`} />}
              {el.boilingPoint && <DataRow label={copy.leftPanel.boiling} value={`${formatNumber(el.boilingPoint)} K`} />}
              {el.density && <DataRow label={copy.leftPanel.density} value={`${formatNumber(el.density)} g/cm³`} />}
              {standardState && <DataRow label={copy.leftPanel.standardState} value={standardState} />}
              {oxidationStates && <DataRow label={copy.leftPanel.oxidationStates} value={oxidationStates} />}
            </div>
            <div
              className="font-inter mt-2 tracking-wider"
              style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-muted)' }}
            >
              {electronConfig}
            </div>
            {selectedElement && (
              <div
                className="font-inter mt-3"
                style={{ fontSize: '10px', lineHeight: '1.6', color: 'var(--text-subtle)' }}
              >
                {isFetching
                  ? copy.leftPanel.detailLoading
                  : isError
                    ? copy.leftPanel.detailError
                    : physicalDescription}
                {!isFetching && !isError && physicalDescription && detail?.physicalDescriptionUrl && (
                  <div className="mt-2">
                    <a
                      href={detail.physicalDescriptionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="detail-source-link"
                    >
                      {language === 'ko'
                        ? `${physicalDescriptionSourceLabel}에서 보기`
                        : `Read on ${physicalDescriptionSourceLabel}`}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <div>
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
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto,minmax(0,1fr)] items-start gap-x-4">
      <span
        className="font-inter shrink-0"
        style={{ fontSize: '11px', letterSpacing: '0.06em', color: 'var(--text-subtle)' }}
      >
        {label}
      </span>
      <span
        className="font-inter min-w-0 text-right break-words"
        style={{ fontSize: '11px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
      >
        {value}
      </span>
    </div>
  )
}

function formatAtomicWeight(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, '')
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, '')
}
