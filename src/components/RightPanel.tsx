import { useStore } from '../store/useStore'
import { elements, CATEGORY_COLORS, CATEGORY_LABELS } from '../data/elements'
import type { ElementCategory } from '../data/elements'

const FILTER_CATEGORIES: { category: ElementCategory; count: number }[] = [
  { category: 'noble-gas', count: elements.filter((e) => e.category === 'noble-gas').length },
  { category: 'alkali-metal', count: elements.filter((e) => e.category === 'alkali-metal').length },
  { category: 'halogen', count: elements.filter((e) => e.category === 'halogen').length },
  { category: 'transition-metal', count: elements.filter((e) => e.category === 'transition-metal').length },
  { category: 'lanthanide', count: elements.filter((e) => e.category === 'lanthanide').length },
  { category: 'actinide', count: elements.filter((e) => e.category === 'actinide').length },
]

export function RightPanel() {
  const { filterCategory, setFilterCategory } = useStore()

  return (
    <div
      className="fixed right-0 top-14 bottom-0 z-40 flex flex-col gap-4 p-5 select-none"
      style={{ width: '240px', background: 'rgba(11, 14, 20, 0.6)' }}
    >
      {/* System Status */}
      <div className="p-4 rounded" style={{ background: '#10131a' }}>
        <h3
          className="font-inter text-gray-300 tracking-widest mb-3"
          style={{ fontSize: '10px', letterSpacing: '0.2em' }}
        >
          SYSTEM STATUS
        </h3>
        <StatusRow label="QUANTUM CORE" status="ACTIVE" color="#c3ff96" />
        <StatusRow label="OBSERVATION LINK" status="LOCKED" color="#ff59e3" />
      </div>

      {/* Category Filters */}
      <div className="p-4 rounded flex-1" style={{ background: '#10131a' }}>
        <h3
          className="font-inter tracking-widest mb-4"
          style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#ff59e3' }}
        >
          CATEGORY FILTERS
        </h3>
        <div className="space-y-4">
          {FILTER_CATEGORIES.map(({ category, count }) => {
            const color = CATEGORY_COLORS[category]
            const active = filterCategory === category
            return (
              <button
                key={category}
                onClick={() => setFilterCategory(active ? null : category)}
                className="w-full text-left transition-opacity"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: filterCategory && !active ? 0.4 : 1,
                }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span
                    className="font-inter text-gray-400 tracking-wider"
                    style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                  >
                    {CATEGORY_LABELS[category].toUpperCase()}
                  </span>
                  <span
                    className="font-inter font-semibold tracking-wider"
                    style={{ fontSize: '10px', color, letterSpacing: '0.1em' }}
                  >
                    {count} ELEMENTS
                  </span>
                </div>
                <div className="category-bar w-full" style={{ background: '#1c2028' }}>
                  <div
                    className="category-bar transition-all duration-300"
                    style={{
                      width: `${(count / 40) * 100}%`,
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

      {/* Element count summary */}
      <div className="p-3 rounded" style={{ background: '#10131a' }}>
        <div className="flex justify-between items-center">
          <span
            className="font-inter text-gray-500 tracking-wider"
            style={{ fontSize: '9px', letterSpacing: '0.15em' }}
          >
            TOTAL ELEMENTS
          </span>
          <span className="font-space text-primary font-semibold text-sm">118</span>
        </div>
        {filterCategory && (
          <button
            onClick={() => setFilterCategory(null)}
            className="mt-2 w-full font-inter tracking-wider text-center py-1 rounded transition-colors"
            style={{
              fontSize: '9px',
              letterSpacing: '0.1em',
              color: '#a1faff',
              background: 'rgba(161, 250, 255, 0.08)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            CLEAR FILTER
          </button>
        )}
      </div>
    </div>
  )
}

function StatusRow({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, flexShrink: 0 }} />
      <span className="font-inter text-gray-500 tracking-wider flex-1" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
        {label}
      </span>
      <span className="font-inter font-semibold tracking-wider" style={{ fontSize: '9px', color, letterSpacing: '0.1em' }}>
        {status}
      </span>
    </div>
  )
}
