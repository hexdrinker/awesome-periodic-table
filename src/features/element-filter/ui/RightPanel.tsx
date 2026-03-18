import {
  CATEGORY_COLORS,
  ELEMENT_CATEGORIES,
  usePeriodicTableQuery,
} from '../../../entities/element'
import type { ElementCategory } from '../../../entities/element'
import { getCategoryLabel, translations, useAppStore } from '../../../shared'

export function RightPanel() {
  const { filterCategory, setFilterCategory, language } = useAppStore()
  const { data: elements = [], isLoading, isError } = usePeriodicTableQuery()
  const copy = translations[language]
  const filterCategories: { category: ElementCategory; count: number }[] = [
    ...ELEMENT_CATEGORIES.map((category) => ({
      category,
      count: elements.filter((element) => element.category === category).length,
    })),
  ]
  const maxCount = Math.max(...filterCategories.map(({ count }) => count), 1)

  return (
    <div
      className="fixed right-0 top-16 bottom-0 z-40 flex flex-col gap-5 p-6 select-none"
      style={{
        width: '280px',
        background: 'var(--app-bg-panel)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="p-5 rounded" style={{ background: 'var(--app-bg-elev)' }}>
        <h3
          className="font-inter tracking-widest mb-4"
          style={{ fontSize: '12px', letterSpacing: '0.18em', color: '#ff59e3' }}
        >
          {copy.rightPanel.categoryFilters}
        </h3>
        <div
          className="mb-4 font-inter tracking-wider"
          style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'var(--text-subtle)' }}
        >
          {isLoading ? copy.rightPanel.loading : isError ? copy.rightPanel.unavailable : copy.rightPanel.live}
        </div>
        <div className="space-y-4">
          {filterCategories.map(({ category, count }) => {
            const color = CATEGORY_COLORS[category]
            const active = filterCategory === category
            return (
              <button
                key={category}
                onClick={() => setFilterCategory(active ? null : category)}
                disabled={isLoading || isError}
                className="w-full text-left transition-opacity"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isLoading || isError ? 'default' : 'pointer',
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
                      width: `${(count / maxCount) * 100}%`,
                      background: color,
                      minWidth: '15%',
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4 rounded" style={{ background: 'var(--app-bg-elev)' }}>
        <div className="flex justify-between items-center">
          <span
            className="font-inter tracking-wider"
            style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}
          >
            {copy.rightPanel.totalElements}
          </span>
          <span className="font-space text-primary font-semibold text-base">
            {elements.length || (isLoading ? '...' : '0')}
          </span>
        </div>
        {filterCategory && (
          <button
            onClick={() => setFilterCategory(null)}
            className="mt-3 w-full font-inter tracking-wider text-center py-2 rounded transition-colors"
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
