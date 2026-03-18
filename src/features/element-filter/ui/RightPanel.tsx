import { useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  CATEGORY_COLORS,
  DEFAULT_FILTER_TEMPERATURE_K,
  ELEMENT_CATEGORIES,
  getElementStateAtTemperature,
  PHYSICAL_STATES,
  usePeriodicTableQuery,
} from '../../../entities/element'
import type { ElementCategory, PhysicalState } from '../../../entities/element'
import { getCategoryLabel, translations, useAppStore } from '../../../shared'

const PHYSICAL_STATE_COLORS: Record<PhysicalState, string> = {
  solid: '#a1faff',
  liquid: '#ffd166',
  gas: '#ff59e3',
}

export function RightPanel() {
  const {
    filterCategory,
    setFilterCategory,
    filterStates,
    toggleFilterState,
    filterTemperature,
    setFilterTemperature,
    clearFilters,
    language,
  } = useAppStore()
  const { data: elements = [], isLoading, isError } = usePeriodicTableQuery()
  const [openSections, setOpenSections] = useState({
    categories: true,
    states: true,
  })
  const copy = translations[language]
  const isUnavailable = isLoading || isError

  const elementsWithState = useMemo(
    () =>
      elements.map((element) => ({
        element,
        physicalState: getElementStateAtTemperature(element, filterTemperature),
      })),
    [elements, filterTemperature],
  )

  const filterCategories: { category: ElementCategory; count: number }[] = useMemo(
    () =>
      ELEMENT_CATEGORIES.map((category) => ({
        category,
        count: elements.filter((element) => element.category === category).length,
      })),
    [elements],
  )

  const stateCounts = useMemo(
    () =>
      PHYSICAL_STATES.map((state) => ({
        state,
        count: elementsWithState.filter((entry) => entry.physicalState === state).length,
      })),
    [elementsWithState],
  )

  const unknownStateCount = useMemo(
    () => elementsWithState.filter((entry) => entry.physicalState === 'unknown').length,
    [elementsWithState],
  )

  const filteredCount = useMemo(
    () =>
      elementsWithState.filter(({ element, physicalState }) => {
        const matchesCategory =
          filterCategory === null || element.category === filterCategory
        const matchesPhysicalState =
          filterStates.length === 0 ||
          (physicalState !== 'unknown' && filterStates.includes(physicalState))

        return matchesCategory && matchesPhysicalState
      }).length,
    [elementsWithState, filterCategory, filterStates],
  )

  const categoryMaxCount = Math.max(
    ...filterCategories.map(({ count }) => count),
    1,
  )
  const temperatureMax = useMemo(() => {
    const knownTemperatures = elements.flatMap(({ meltingPoint, boilingPoint }) => (
      [meltingPoint, boilingPoint].filter(
        (value): value is number => value != null && Number.isFinite(value),
      )
    ))
    const peak = Math.max(DEFAULT_FILTER_TEMPERATURE_K, ...knownTemperatures)

    return Math.max(4000, Math.ceil(peak / 250) * 250)
  }, [elements])
  const hasActiveFilters =
    filterCategory !== null ||
    filterStates.length > 0 ||
    filterTemperature !== DEFAULT_FILTER_TEMPERATURE_K

  function toggleSection(section: 'categories' | 'states') {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }))
  }

  return (
    <div
      className="fixed right-0 top-16 bottom-0 z-40 flex flex-col gap-5 overflow-y-auto p-6 select-none"
      style={{
        width: '320px',
        background: 'var(--app-bg-panel)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <FilterSection
        title={copy.rightPanel.categoryFilters}
        subtitle={
          isLoading
            ? copy.rightPanel.loading
            : isError
              ? copy.rightPanel.unavailable
              : copy.rightPanel.live
        }
        open={openSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-4">
          {filterCategories.map(({ category, count }) => {
            const color = CATEGORY_COLORS[category]
            const active = filterCategory === category
            return (
              <button
                key={category}
                onClick={() => setFilterCategory(active ? null : category)}
                disabled={isUnavailable}
                className="w-full text-left transition-opacity"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isUnavailable ? 'default' : 'pointer',
                  opacity: filterCategory && !active ? 0.4 : 1,
                }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span
                    className="font-inter tracking-wider"
                    style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--text-muted)' }}
                  >
                    {getCategoryLabel(category, language)}
                  </span>
                  <span
                    className="font-inter font-semibold tracking-wider"
                    style={{ fontSize: '12px', color, letterSpacing: '0.08em' }}
                  >
                    {count} {copy.rightPanel.elements}
                  </span>
                </div>
                <div className="category-bar w-full" style={{ background: 'var(--track-color)' }}>
                  <div
                    className="category-bar transition-all duration-300"
                    style={{
                      width: `${(count / categoryMaxCount) * 100}%`,
                      background: color,
                      minWidth: count === 0 ? '0%' : '15%',
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection
        title={copy.rightPanel.stateFilters}
        subtitle={formatTemperature(filterTemperature)}
        open={openSections.states}
        onToggle={() => toggleSection('states')}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div
                className="font-inter tracking-wider"
                style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-subtle)' }}
              >
                {copy.rightPanel.temperature}
              </div>
              <div className="font-space font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                {filterTemperature} K
              </div>
            </div>
            <button
              type="button"
              className="filter-ghost-button"
              onClick={() => setFilterTemperature(DEFAULT_FILTER_TEMPERATURE_K)}
              disabled={isUnavailable}
            >
              {copy.rightPanel.roomTemperature}
            </button>
          </div>

          <div>
            <input
              type="range"
              min={0}
              max={temperatureMax}
              step={1}
              value={filterTemperature}
              onChange={(event) => setFilterTemperature(Number(event.target.value))}
              disabled={isUnavailable}
              className="temperature-slider"
            />
            <div
              className="mt-2 flex justify-between font-inter"
              style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'var(--text-subtle)' }}
            >
              <span>0 K</span>
              <span>{formatCelsius(filterTemperature)}</span>
              <span>{temperatureMax} K</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stateCounts.map(({ state, count }) => {
              const active = filterStates.includes(state)
              const color = PHYSICAL_STATE_COLORS[state]

              return (
                <button
                  key={state}
                  type="button"
                  className={`filter-chip ${active ? 'active' : ''}`}
                  onClick={() => toggleFilterState(state)}
                  disabled={isUnavailable}
                  style={{
                    '--filter-chip-color': color,
                  } as CSSProperties}
                >
                  <span>{getPhysicalStateLabel(state, language, copy)}</span>
                  <span>{count}</span>
                </button>
              )
            })}
          </div>

          <div
            className="font-inter leading-relaxed"
            style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'var(--text-subtle)' }}
          >
            {copy.rightPanel.stateUnknown}: {unknownStateCount}
          </div>
        </div>
      </FilterSection>

      <div className="p-4 rounded" style={{ background: 'var(--app-bg-elev)' }}>
        <div className="space-y-3">
          <SummaryRow
            label={copy.rightPanel.filteredElements}
            value={isLoading ? '...' : String(filteredCount)}
          />
          <SummaryRow
            label={copy.rightPanel.totalElements}
            value={isLoading ? '...' : String(elements.length)}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 w-full font-inter tracking-wider text-center py-2 rounded transition-colors"
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              background: 'var(--app-bg-soft)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {copy.rightPanel.clearFilter}
          </button>
        )}
      </div>
    </div>
  )
}

function FilterSection({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string
  subtitle: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="p-5 rounded" style={{ background: 'var(--app-bg-elev)' }}>
      <button type="button" className="filter-section-toggle" onClick={onToggle}>
        <div>
          <div
            className="font-inter tracking-widest"
            style={{ fontSize: '12px', letterSpacing: '0.18em', color: '#ff59e3' }}
          >
            {title}
          </div>
          <div
            className="mt-2 font-inter tracking-wider"
            style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'var(--text-subtle)' }}
          >
            {subtitle}
          </div>
        </div>
        <span className="filter-section-toggle-mark" aria-hidden="true">
          {open ? '-' : '+'}
        </span>
      </button>

      {open && <div className="mt-5">{children}</div>}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span
        className="font-inter tracking-wider"
        style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <span className="font-space text-primary font-semibold text-base">{value}</span>
    </div>
  )
}

function getPhysicalStateLabel(
  state: PhysicalState,
  language: 'en' | 'ko',
  copy: typeof translations.en | typeof translations.ko,
) {
  if (state === 'solid') return copy.rightPanel.solid
  if (state === 'liquid') return copy.rightPanel.liquid
  if (state === 'gas') return copy.rightPanel.gas

  return language === 'ko' ? '미분류' : 'Unknown'
}

function formatTemperature(temperatureK: number) {
  return `${temperatureK} K / ${formatCelsius(temperatureK)}`
}

function formatCelsius(temperatureK: number) {
  return `${Math.round(temperatureK - 273.15)} C`
}
