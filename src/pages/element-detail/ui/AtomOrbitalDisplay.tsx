import type { CSSProperties } from 'react'

const ORBITAL_SEQUENCE = [
  ['1s', 2],
  ['2s', 2],
  ['2p', 6],
  ['3s', 2],
  ['3p', 6],
  ['4s', 2],
  ['3d', 10],
  ['4p', 6],
  ['5s', 2],
  ['4d', 10],
  ['5p', 6],
  ['6s', 2],
  ['4f', 14],
  ['5d', 10],
  ['6p', 6],
  ['7s', 2],
  ['5f', 14],
  ['6d', 10],
  ['7p', 6],
] as const

const SHELL_LABELS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q']

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

function getElectronShellDistribution(atomicNumber: number) {
  const shellCounts = new Array<number>(7).fill(0)
  let remainingElectrons = atomicNumber

  for (const [orbital, capacity] of ORBITAL_SEQUENCE) {
    if (remainingElectrons <= 0) {
      break
    }

    const shellIndex = Number(orbital[0]) - 1
    const filled = Math.min(remainingElectrons, capacity)
    shellCounts[shellIndex] += filled
    remainingElectrons -= filled
  }

  return shellCounts.filter((count) => count > 0)
}
