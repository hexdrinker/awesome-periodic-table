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

export const SHELL_LABELS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'] as const

type SupportedLanguage = 'en' | 'ko'

type ShellGuide = {
  description: string
  isOutermost: boolean
  label: string
  level: number
  maxElectrons: number
  value: string
}

type AtomStructureGuide = {
  modelNote: string
  outerShell: string
  reason: string
}

export function getElectronShellDistribution(atomicNumber: number) {
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

export function getShellGuides(atomicNumber: number, language: SupportedLanguage): ShellGuide[] {
  const shellCounts = getElectronShellDistribution(atomicNumber)
  const outermostIndex = shellCounts.length - 1

  return shellCounts.map((count, index) => {
    const level = index + 1
    const isOutermost = index === outermostIndex

    return {
      description: getShellDescription(level, isOutermost, language),
      isOutermost,
      label: `${SHELL_LABELS[index]} ${level}`,
      level,
      maxElectrons: 2 * level ** 2,
      value:
        language === 'ko'
          ? `${count} 전자 · 최대 ${2 * level ** 2}`
          : `${count} electrons · up to ${2 * level ** 2}`,
    }
  })
}

export function getAtomStructureGuide(params: {
  atomicNumber: number
  electronConfig: string
  language: SupportedLanguage
  symbol: string
}): AtomStructureGuide {
  const { atomicNumber, electronConfig, language, symbol } = params
  const shellCounts = getElectronShellDistribution(atomicNumber)
  const distribution = shellCounts.join(' • ')
  const outermostIndex = shellCounts.length - 1
  const outermostLabel = SHELL_LABELS[outermostIndex]
  const outermostCount = shellCounts[outermostIndex] ?? 0

  return {
    modelNote:
      language === 'ko'
        ? '이 구조도는 실제 전자 구름 모양이 아니라, 주에너지 준위별 전자 수를 읽기 쉽게 단순화한 보어식 레이어 모델입니다.'
        : 'This diagram is a simplified Bohr-style layer model. It shows electrons by principal energy level, not the exact shape of the electron cloud.',
    outerShell:
      language === 'ko'
        ? `${outermostLabel}층 · ${outermostCount} 전자`
        : `${outermostLabel} shell · ${outermostCount} electrons`,
    reason:
      language === 'ko'
        ? `${symbol}의 ${atomicNumber}개 전자는 에너지가 낮은 오비탈부터 먼저 채워집니다. 그래서 ${electronConfig} 배치가 이 구조도에서는 ${distribution}처럼 보이고, 가장 바깥 ${outermostLabel}층 전자가 결합과 반응성에 가장 큰 영향을 줍니다.`
        : `${symbol} has ${atomicNumber} electrons, and they fill lower-energy orbitals first. That is why the configuration ${electronConfig} appears here as ${distribution}, with the outer ${outermostLabel} shell contributing most to bonding and reactivity.`,
  }
}

function getShellDescription(level: number, isOutermost: boolean, language: SupportedLanguage) {
  if (language === 'ko') {
    if (isOutermost) {
      return `핵에서 ${level}번째 주에너지 준위이며, 현재 점유된 가장 바깥 껍질입니다. 이 층의 전자가 결합, 이온화, 반응성을 가장 직접적으로 좌우합니다.`
    }

    if (level === 1) {
      return '원자핵에 가장 가까운 첫 껍질로, 가장 낮은 에너지의 코어 전자가 채워지는 층입니다.'
    }

    return `핵에서 ${level}번째 주에너지 준위로, 안쪽 전자층을 이루며 바깥 전자를 일부 차폐해 전체 에너지 구조를 안정화합니다.`
  }

  if (isOutermost) {
    return `This is principal shell n=${level}, the outermost occupied layer. Electrons here most directly control bonding, ionization, and reactivity.`
  }

  if (level === 1) {
    return 'This is the innermost shell, closest to the nucleus, where the lowest-energy core electrons reside.'
  }

  return `This is principal shell n=${level}, an inner layer that helps shield outer electrons and stabilize the atom's overall energy structure.`
}
