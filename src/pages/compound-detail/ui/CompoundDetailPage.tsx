import { useEffect, useMemo, type CSSProperties } from 'react'
import {
  buildMoleculeModel,
  getCompoundInsight,
  getLocalizedCompoundDisplay,
  useCompoundDetailQuery,
} from '@/entities/compound'
import { Navbar } from '@/features/preferences'
import {
  sceneThemePalettes,
  translations,
  useAppStore,
  useResolvedTheme,
} from '@/shared'
import { MoleculeStructureCard } from './MoleculeStructureCard'

interface CompoundDetailPageProps {
  cid: number
}

export function CompoundDetailPage({ cid }: CompoundDetailPageProps) {
  const language = useAppStore((state) => state.language)
  const setSelectedElement = useAppStore((state) => state.setSelectedElement)
  const setHoveredElement = useAppStore((state) => state.setHoveredElement)
  const resolvedTheme = useResolvedTheme()
  const palette = sceneThemePalettes[resolvedTheme]
  const copy = translations[language]
  const { data: compound, isLoading, isError } = useCompoundDetailQuery(cid)
  const localizationKey =
    typeof window === 'undefined'
      ? null
      : new URLSearchParams(window.location.search).get('key')
  const display = compound
    ? getLocalizedCompoundDisplay(compound.title, language, localizationKey ?? undefined)
    : null
  const displayName = display?.primaryName ?? compound?.title ?? null
  const moleculeModel = useMemo(
    () =>
      compound
        ? buildMoleculeModel(compound.canonicalSmiles, compound.molecularFormula)
        : null,
    [compound],
  )
  const insight = useMemo(
    () =>
      compound && moleculeModel && displayName
        ? getCompoundInsight({
            compound,
            displayName,
            language,
            localizationKey: localizationKey ?? undefined,
            model: moleculeModel,
          })
        : null,
    [compound, displayName, language, localizationKey, moleculeModel],
  )

  useEffect(() => {
    setSelectedElement(null)
    setHoveredElement(null)
  }, [setHoveredElement, setSelectedElement])

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const appRoot = document.getElementById('root')
    const previousRootOverflow = root.style.overflow
    const previousBodyOverflow = body.style.overflow
    const previousRootHeight = root.style.height
    const previousBodyHeight = body.style.height
    const previousAppRootOverflow = appRoot?.style.overflow ?? ''
    const previousAppRootHeight = appRoot?.style.height ?? ''

    root.style.overflow = 'auto'
    body.style.overflow = 'auto'
    root.style.height = 'auto'
    body.style.height = 'auto'
    if (appRoot) {
      appRoot.style.overflow = 'visible'
      appRoot.style.height = 'auto'
    }

    return () => {
      root.style.overflow = previousRootOverflow
      body.style.overflow = previousBodyOverflow
      root.style.height = previousRootHeight
      body.style.height = previousBodyHeight
      if (appRoot) {
        appRoot.style.overflow = previousAppRootOverflow
        appRoot.style.height = previousAppRootHeight
      }
    }
  }, [])

  return (
    <div
      className="min-h-screen"
      style={
        {
          background: `
            radial-gradient(circle at 14% 18%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 30%),
            radial-gradient(circle at 82% 12%, color-mix(in srgb, #ff59e3 12%, transparent), transparent 24%),
            ${palette.background}
          `,
        } as CSSProperties
      }
    >
      <Navbar />

      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-24 md:px-8 md:pb-14">
        {isLoading ? (
          <StateCard title={copy.compoundPanel.loading} body={copy.compoundPanel.subtitle} />
        ) : isError ? (
          <StateCard title={copy.leftPanel.detailError} body={copy.rightPanel.unavailable} />
        ) : !compound ? (
          <StateCard title={copy.compoundPanel.notFoundTitle} body={copy.compoundPanel.notFoundBody} />
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-[minmax(300px,0.84fr)_minmax(0,1.16fr)]">
              <section
                className="rounded-[30px] p-6 md:p-7"
                style={{
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, var(--app-bg-card) 94%, transparent), color-mix(in srgb, var(--app-bg-card) 82%, transparent))',
                  boxShadow: '0 24px 80px color-mix(in srgb, var(--shadow-glow) 50%, transparent)',
                }}
              >
                <div
                  className="font-inter uppercase"
                  style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#ff59e3' }}
                >
                  {copy.compoundPanel.detailLabel}
                </div>
                <h1 className="mt-4 font-space text-4xl font-bold leading-none md:text-6xl">
                  {displayName}
                </h1>
                {display?.secondaryName && (
                  <div
                    className="mt-3 font-inter"
                    style={{ fontSize: '16px', color: 'var(--text-secondary)' }}
                  >
                    {display.secondaryName}
                  </div>
                )}
                <div
                  className="mt-4 font-inter uppercase"
                  style={{ fontSize: '11px', letterSpacing: '0.16em', color: 'var(--accent)' }}
                >
                  CID {compound.cid}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <DetailChip label={copy.compoundPanel.molecularFormula} value={compound.molecularFormula} />
                  <DetailChip label={copy.compoundPanel.molecularWeight} value={compound.molecularWeight} />
                  <DetailChip label={copy.compoundPanel.iupacName} value={compound.iupacName} />
                  <DetailChip label={copy.compoundPanel.smiles} value={compound.canonicalSmiles} mono />
                </div>
              </section>

              {moleculeModel && insight && displayName && (
                <MoleculeStructureCard
                  displayName={displayName}
                  highlights={insight.highlights}
                  model={moleculeModel}
                  modelNote={copy.compoundPanel.modelNote}
                  title={copy.compoundPanel.visualizationLabel}
                />
              )}
            </div>

            {insight && (
              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(300px,0.98fr)]">
                <div className="space-y-6">
                  <InfoCard title={copy.compoundPanel.overviewLabel} body={insight.summary} />
                </div>

                <div className="space-y-6">
                  <ListCard
                    empty={copy.compoundPanel.noUses}
                    items={insight.uses}
                    title={copy.compoundPanel.usesLabel}
                  />
                  <SynonymCard
                    empty={copy.compoundPanel.noSynonyms}
                    synonyms={compound.synonyms}
                    title={copy.compoundPanel.synonymsLabel}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function DetailChip({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string | null
  mono?: boolean
}) {
  return (
    <div
      className="rounded-[22px] p-4"
      style={{
        background: 'color-mix(in srgb, var(--app-bg-elev) 88%, transparent)',
        boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--outline-soft) 90%, transparent)',
      }}
    >
      <div
        className="font-inter uppercase"
        style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-subtle)' }}
      >
        {label}
      </div>
      <div
        className={`mt-3 ${mono ? 'font-mono' : 'font-inter'}`}
        style={{
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'var(--text-primary)',
          wordBreak: 'break-word',
        }}
      >
        {value || '—'}
      </div>
    </div>
  )
}

function StateCard({ title, body }: { title: string; body: string }) {
  return (
    <section
      className="rounded-[30px] p-8"
      style={{
        background: 'var(--app-bg-card)',
        boxShadow: '0 24px 80px color-mix(in srgb, var(--shadow-glow) 45%, transparent)',
      }}
    >
      <div className="font-space text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </div>
      <div
        className="mt-3 font-inter leading-7"
        style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
      >
        {body}
      </div>
    </section>
  )
}

function InfoCard({ body, title }: { body: string; title: string }) {
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
        className="mt-5 font-inter leading-8"
        style={{ fontSize: '15px', color: 'var(--text-secondary)' }}
      >
        {body}
      </div>
    </section>
  )
}

function ListCard({
  empty,
  items,
  title,
}: {
  empty: string
  items: string[]
  title: string
}) {
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

      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-[20px] px-4 py-4 font-inter leading-7"
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                background: 'color-mix(in srgb, var(--app-bg-elev) 88%, transparent)',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="mt-4 font-inter leading-7"
          style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
        >
          {empty}
        </div>
      )}
    </section>
  )
}

function SynonymCard({
  empty,
  synonyms,
  title,
}: {
  empty: string
  synonyms: string[]
  title: string
}) {
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

      {synonyms.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {synonyms.map((synonym) => (
            <span
              key={synonym}
              className="rounded-full px-4 py-2 font-inter"
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                background: 'color-mix(in srgb, var(--app-bg-soft) 82%, transparent)',
                boxShadow:
                  'inset 0 0 0 1px color-mix(in srgb, var(--outline-soft) 90%, transparent)',
              }}
            >
              {synonym}
            </span>
          ))}
        </div>
      ) : (
        <div
          className="mt-4 font-inter leading-7"
          style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
        >
          {empty}
        </div>
      )}
    </section>
  )
}
