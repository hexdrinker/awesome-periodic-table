import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { translations, useAppStore } from '../../../shared'
import type { ThemeMode } from '../../../shared'

const tabs = ['table', 'isotopes', 'lab'] as const
const languageOptions = ['en', 'ko'] as const
const themeOptions = ['system', 'dark', 'light'] as const

export function Navbar() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('table')
  const [openMenu, setOpenMenu] = useState<'language' | 'theme' | null>(null)
  const { language, setLanguage, theme, setTheme } = useAppStore()
  const copy = translations[language]
  const menusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menusRef.current?.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-7 h-16"
      style={{
        background: 'var(--app-bg-nav)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--outline-soft)',
      }}
    >
      <span
        className="font-space font-semibold tracking-[0.22em] text-base mr-10 select-none"
        style={{ letterSpacing: '0.22em' }}
      >
        {copy.brand}
      </span>

      <div className="flex items-center gap-8 mr-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`header-tab ${activeTab === tab ? 'active' : ''}`}
            style={{ letterSpacing: '0.14em' }}
          >
            {copy.tabs[tab]}
          </button>
        ))}
      </div>

      <div ref={menusRef} className="flex items-center gap-3">
        <Dropdown
          isOpen={openMenu === 'language'}
          onToggle={() => setOpenMenu(openMenu === 'language' ? null : 'language')}
          triggerValue={language === 'en' ? copy.topBar.english : copy.topBar.korean}
        >
          {languageOptions.map((option) => (
            <DropdownItem
              key={option}
              active={language === option}
              label={option === 'en' ? copy.topBar.english : copy.topBar.korean}
              onClick={() => {
                setLanguage(option)
                setOpenMenu(null)
              }}
            />
          ))}
        </Dropdown>

        <Dropdown
          isOpen={openMenu === 'theme'}
          onToggle={() => setOpenMenu(openMenu === 'theme' ? null : 'theme')}
          triggerIcon={<ThemeIcon theme={theme} />}
          triggerValue={copy.topBar[theme]}
        >
          {themeOptions.map((option) => (
            <DropdownItem
              key={option}
              active={theme === option}
              icon={<ThemeIcon theme={option} />}
              label={copy.topBar[option]}
              onClick={() => {
                setTheme(option)
                setOpenMenu(null)
              }}
            />
          ))}
        </Dropdown>
      </div>
    </nav>
  )
}

function Dropdown({
  isOpen,
  onToggle,
  triggerIcon,
  triggerValue,
  children,
}: {
  isOpen: boolean
  onToggle: () => void
  triggerIcon?: ReactNode
  triggerValue: string
  children: ReactNode
}) {
  return (
    <div className="header-dropdown">
      <button
        type="button"
        className={`header-dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {triggerIcon && <span className="header-dropdown-trigger-icon">{triggerIcon}</span>}
        <span className="header-dropdown-trigger-value">{triggerValue}</span>
        <ChevronIcon open={isOpen} />
      </button>
      {isOpen && (
        <div className="header-dropdown-menu" role="menu">
          {children}
        </div>
      )}
    </div>
  )
}

function DropdownItem({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon?: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`header-dropdown-item ${active ? 'active' : ''}`}
      onClick={onClick}
      role="menuitemradio"
      aria-checked={active}
    >
      {icon && <span className="header-dropdown-item-icon">{icon}</span>}
      <span>{label}</span>
    </button>
  )
}

function ThemeIcon({ theme }: { theme: ThemeMode }) {
  if (theme === 'light') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2 12h2.2M19.8 12H22M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" />
      </svg>
    )
  }

  if (theme === 'dark') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M20 15.2A8.5 8.5 0 1 1 11 4a6.9 6.9 0 0 0 9 11.2Z" />
      </svg>
    )
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="11" rx="2" />
      <path d="M8 19.5h8M10 15.5v4M14 15.5v4" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
