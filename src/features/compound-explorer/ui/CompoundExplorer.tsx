import { useMemo, useState } from 'react'
import type { CompoundSearchResult } from '@/entities/compound'
import {
  getLocalizedCompoundDisplay,
  useCompoundPageQuery,
} from '@/entities/compound'
import { translations, useAppStore } from '@/shared'
import { navigateToCompoundDetail } from '@/shared/lib/router'

const COMPOUNDS_PER_PAGE = 20

export function CompoundExplorer() {
  const language = useAppStore((state) => state.language)
  const copy = translations[language]
  const [currentPage, setCurrentPage] = useState(1)
  const { data: compoundPage, isFetching: isPageFetching, isError: isPageError } =
    useCompoundPageQuery(currentPage, COMPOUNDS_PER_PAGE)
  const visibleCompounds = compoundPage?.compounds ?? []
  const resultCount = compoundPage?.totalCount ?? 0
  const totalPages = Math.max(1, compoundPage?.totalPages ?? 1)
  const pageNumbers = useMemo(() => {
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)
    const adjustedStartPage = Math.max(1, endPage - 4)

    return Array.from(
      { length: endPage - adjustedStartPage + 1 },
      (_, index) => adjustedStartPage + index,
    )
  }, [currentPage, totalPages])

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-5">
        <section
          className="rounded-[28px] p-6"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--app-bg-card) 94%, transparent), color-mix(in srgb, var(--app-bg-card) 82%, transparent))',
            boxShadow: '0 24px 80px color-mix(in srgb, var(--shadow-glow) 50%, transparent)',
          }}
        >
          <h1 className="font-space text-4xl font-bold leading-none md:text-5xl">
            {language === 'ko' ? (
              <>
                화합물
                <br />
                라이브러리
              </>
            ) : (
              copy.compoundPanel.pageTitle
            )}
          </h1>
          <div className="mt-6 rounded-[24px] p-5" style={{ background: 'var(--app-bg-elev)' }}>
            <div className="flex items-center justify-between gap-3">
              <div
                className="font-inter tracking-widest uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--text-muted)' }}
              >
                {copy.compoundPanel.curatedListLabel}
              </div>
              <div className="font-space text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {resultCount}
              </div>
            </div>
            <div
              className="mt-3 font-inter leading-relaxed"
              style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
            >
              {copy.compoundPanel.curatedListSummary}
            </div>
          </div>
        </section>
      </aside>

      <section className="min-w-0">
        {isPageFetching ? (
          <ExplorerState
            title={copy.compoundPanel.loading}
            body={copy.compoundPanel.curatedListDescription}
          />
        ) : isPageError ? (
          <ExplorerState
            title={copy.leftPanel.detailError}
            body={copy.rightPanel.unavailable}
          />
        ) : visibleCompounds.length === 0 ? (
          <ExplorerState
            title={copy.compoundPanel.noResultsTitle}
            body={copy.compoundPanel.noResultsBody}
          />
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              {visibleCompounds.map((compound) => (
                <CompoundCard key={compound.cid} compound={compound} />
              ))}
            </div>

            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] p-4"
              style={{ background: 'var(--app-bg-elev)' }}
            >
              <div
                className="font-inter uppercase"
                style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}
              >
                {`${copy.compoundPanel.pageStatus} ${currentPage} / ${totalPages}`}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {pageNumbers.map((page) => {
                  const isActive = page === currentPage

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className="filter-ghost-button"
                      aria-current={isActive ? 'page' : undefined}
                      style={
                        isActive
                          ? {
                              color: 'var(--text-primary)',
                              background: 'color-mix(in srgb, var(--accent) 14%, var(--app-bg-soft))',
                            }
                          : undefined
                      }
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function CompoundCard({ compound }: { compound: CompoundSearchResult }) {
  const language = useAppStore((state) => state.language)
  const copy = translations[language]
  const display = getLocalizedCompoundDisplay(
    compound.title,
    language,
    compound.localizationKey,
  )

  return (
    <button
      type="button"
      onClick={() => navigateToCompoundDetail(compound.cid, compound.localizationKey)}
      className="rounded-[26px] p-5"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--app-bg-card) 94%, transparent), color-mix(in srgb, var(--app-bg-card) 82%, transparent))',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div className="min-w-0">
        <div
          className="font-space text-2xl font-bold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {display.primaryName}
        </div>
        {display.secondaryName && (
          <div
            className="mt-2 font-inter"
            style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
          >
            {display.secondaryName}
          </div>
        )}
        <div
          className="mt-2 font-inter uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--accent)' }}
        >
          CID {compound.cid}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <CompoundRow label={copy.compoundPanel.molecularFormula} value={compound.molecularFormula} />
        <CompoundRow label={copy.compoundPanel.molecularWeight} value={compound.molecularWeight} />
        <CompoundRow label={copy.compoundPanel.iupacName} value={compound.iupacName} />
        <CompoundRow label={copy.compoundPanel.smiles} value={compound.canonicalSmiles} mono />
      </div>
    </button>
  )
}

function CompoundRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string | null
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="font-inter uppercase"
        style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-subtle)' }}
      >
        {label}
      </span>
      <span
        className={mono ? 'font-mono' : 'font-inter'}
        style={{
          fontSize: '13px',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          wordBreak: 'break-word',
        }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function ExplorerState({ title, body }: { title: string; body: string }) {
  return (
    <section
      className="rounded-[28px] p-8"
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
