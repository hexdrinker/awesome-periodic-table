import type { CSSProperties } from 'react'
import { SHELL_LABELS, getElectronShellDistribution } from './atomStructure'

interface AtomOrbitalDisplayProps {
  accentColor: string
  atomicNumber: number
  symbol: string
}

export function AtomOrbitalDisplay({
  accentColor,
  atomicNumber,
  symbol,
}: AtomOrbitalDisplayProps) {
  const shells = getElectronShellDistribution(atomicNumber)

  return (
    <div className="atom-visual-shell" style={{ '--atom-accent': accentColor } as CSSProperties}>
      <div className="atom-visual-grid" />

      {shells.map((count, shellIndex) => {
        const radius = 68 + shellIndex * 28

        return (
          <div
            key={`${shellIndex}-${count}`}
            className="atom-orbit"
            style={
              {
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                animationDuration: `${18 + shellIndex * 4}s`,
              } as CSSProperties
            }
          >
            {Array.from({ length: count }).map((_, electronIndex) => {
              const angle = (360 / count) * electronIndex

              return (
                <span
                  key={`${shellIndex}-${electronIndex}`}
                  className="atom-electron"
                  style={
                    {
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                    } as CSSProperties
                  }
                />
              )
            })}
          </div>
        )
      })}

      <div className="atom-nucleus">
        <div className="atom-nucleus-symbol">{symbol}</div>
        <div className="atom-nucleus-number">{atomicNumber}</div>
      </div>

      <div className="atom-shell-legend">
        {shells.map((count, index) => (
          <div key={`${SHELL_LABELS[index]}-${count}`} className="atom-shell-chip">
            <span>{SHELL_LABELS[index]}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
