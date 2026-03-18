import { translations, useAppStore } from '../../../shared'
import type { ControlMode } from '../../../shared'

const controls: Array<{
  id: Exclude<ControlMode, 'none'>
  labelKey: keyof (typeof translations)['en']['controls']
  icon: JSX.Element
}> = [
  {
    id: 'zoom-in',
    labelKey: 'zoomIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
      </svg>
    ),
  },
  {
    id: 'zoom-out',
    labelKey: 'zoomOut',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35M8 11h6" />
      </svg>
    ),
  },
  {
    id: 'rotate',
    labelKey: 'rotate',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    id: 'orbit',
    labelKey: 'orbit',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    id: 'reset',
    labelKey: 'reset',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M3 3v5h5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M21 21v-5h-5" />
      </svg>
    ),
  },
]

export function BottomControls() {
  const { controlMode, setControlMode, autoRotate, setAutoRotate, language } = useAppStore()
  const copy = translations[language]

  const handleClick = (id: Exclude<ControlMode, 'none'>) => {
    if (id === 'rotate') {
      setAutoRotate(!autoRotate)
      setControlMode(autoRotate ? 'none' : 'rotate')
    } else if (id === 'reset') {
      setControlMode('reset')
      setAutoRotate(false)
      setTimeout(() => setControlMode('none'), 2000)
    } else {
      setAutoRotate(false)
      setControlMode(controlMode === id ? 'none' : id)
    }
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-7 py-4 rounded-full select-none"
      style={{
        background: 'var(--app-bg-nav)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--outline-soft)',
      }}
    >
      {controls.map((ctrl) => {
        const isActive =
          ctrl.id === 'rotate' ? autoRotate : controlMode === ctrl.id
        return (
          <button
            key={ctrl.id}
            onClick={() => handleClick(ctrl.id)}
            className={`ctrl-btn ${isActive ? 'active' : ''}`}
          >
            {ctrl.icon}
            <span style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
              {copy.controls[ctrl.labelKey]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
