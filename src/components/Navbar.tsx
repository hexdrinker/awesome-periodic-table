import { useState } from 'react'

const tabs = ['TABLE', 'ISOTOPES', 'LAB']

export function Navbar() {
  const [activeTab, setActiveTab] = useState('TABLE')
  const [searchVal, setSearchVal] = useState('')

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 h-14"
      style={{ background: 'rgba(11, 14, 20, 0.85)', backdropFilter: 'blur(12px)' }}
    >
      {/* Brand */}
      <span
        className="font-space font-semibold tracking-[0.22em] text-sm text-white mr-10 select-none"
        style={{ letterSpacing: '0.22em' }}
      >
        QUANTUM OBSERVATORY
      </span>

      {/* Nav tabs */}
      <div className="flex items-center gap-8 mr-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-inter text-xs tracking-widest transition-colors duration-200 pb-1 ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.14em' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: '#10131a' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="SEARCH ELEMENTS..."
            className="bg-transparent text-gray-400 text-xs outline-none w-32 font-inter tracking-wider placeholder-gray-700"
            style={{ letterSpacing: '0.06em', fontSize: '10px' }}
          />
        </div>

        {/* Settings icon */}
        <button
          className="text-gray-500 hover:text-gray-300 transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* User icon */}
        <button
          className="text-gray-500 hover:text-gray-300 transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
