import type {
  PubChemElementDetailResponse,
  PubChemPeriodicTableResponse,
  PubChemSection,
} from '@/entities/element/api/pubchem'
import type { Element, ElementCategory, ElementDetail } from './elements'

const COLUMN_INDEX = {
  atomicNumber: 0,
  symbol: 1,
  name: 2,
  atomicMass: 3,
  cpkHexColor: 4,
  electronConfiguration: 5,
  electronegativity: 6,
  atomicRadius: 7,
  ionizationEnergy: 8,
  electronAffinity: 9,
  oxidationStates: 10,
  standardState: 11,
  meltingPoint: 12,
  boilingPoint: 13,
  density: 14,
  groupBlock: 15,
  yearDiscovered: 16,
} as const

export function mapPeriodicTableResponse(response: PubChemPeriodicTableResponse): Element[] {
  return response.Table.Row.map(({ Cell }) => {
    const atomicNumber = toNumber(Cell[COLUMN_INDEX.atomicNumber]) ?? 0
    const period = getPeriodFromAtomicNumber(atomicNumber)
    const group = getGroupFromAtomicNumber(atomicNumber, Cell[COLUMN_INDEX.groupBlock])
    const category = toCategory(Cell[COLUMN_INDEX.groupBlock], atomicNumber)
    const { xPos, yPos } = getDisplayPosition(atomicNumber, period, group)

    return {
      atomicNumber,
      symbol: Cell[COLUMN_INDEX.symbol] ?? '',
      name: Cell[COLUMN_INDEX.name] ?? '',
      atomicWeight: toNumber(Cell[COLUMN_INDEX.atomicMass]) ?? atomicNumber,
      period,
      group,
      xPos,
      yPos,
      category,
      meltingPoint: toNumber(Cell[COLUMN_INDEX.meltingPoint]),
      boilingPoint: toNumber(Cell[COLUMN_INDEX.boilingPoint]),
      density: toNumber(Cell[COLUMN_INDEX.density]),
      electronConfig: formatElectronConfiguration(Cell[COLUMN_INDEX.electronConfiguration] ?? ''),
      standardState: toNullableText(Cell[COLUMN_INDEX.standardState]),
      oxidationStates: toNullableText(Cell[COLUMN_INDEX.oxidationStates]),
      yearDiscovered: toNullableText(Cell[COLUMN_INDEX.yearDiscovered]),
      atomicRadius: toNumber(Cell[COLUMN_INDEX.atomicRadius]),
      ionizationEnergy: toNumber(Cell[COLUMN_INDEX.ionizationEnergy]),
      electronAffinity: toNumber(Cell[COLUMN_INDEX.electronAffinity]),
      electronegativity: toNumber(Cell[COLUMN_INDEX.electronegativity]),
      cpkHexColor: normalizeHex(Cell[COLUMN_INDEX.cpkHexColor]),
    }
  })
}

export function mapElementDetailResponse(response: PubChemElementDetailResponse): ElementDetail {
  const sections = response.Record.Section ?? []

  return {
    atomicNumber: response.Record.RecordNumber,
    name: response.Record.RecordTitle,
    atomicWeightText: getSectionValue(sections, 'Atomic Weight'),
    electronConfig: formatElectronConfiguration(getSectionValue(sections, 'Electron Configuration')),
    category: toCategory(getSectionValue(sections, 'Element Classification'), response.Record.RecordNumber),
    period: toNumber(getSectionValue(sections, 'Element Period Number')),
    group: toNumber(getSectionValue(sections, 'Element Group Number')),
    density: toNumber(getSectionValue(sections, 'Density')),
    meltingPoint: toNumber(getSectionValue(sections, 'Melting Point')),
    boilingPoint: toNumber(getSectionValue(sections, 'Boiling Point')),
    oxidationStates: toNullableText(getSectionValue(sections, 'Oxidation States')),
    atomicRadius: toNumber(getSectionValue(sections, 'Atomic Radius')),
    ionizationEnergy: toNumber(getSectionValue(sections, 'Ionization Energy')),
    electronAffinity: toNumber(getSectionValue(sections, 'Electron Affinity')),
    electronegativity: toNumber(getSectionValue(sections, 'Electronegativity')),
    physicalDescription: toNullableText(getSectionValue(sections, 'Physical Description')),
  }
}

function getSectionValue(sections: PubChemSection[], heading: string): string | null {
  const section = findSectionByHeading(sections, heading)

  if (!section) {
    return null
  }

  const infoValue = section.Information
    ?.flatMap((info) => info.Value?.StringWithMarkup ?? [])
    .map((entry) => entry.String.trim())
    .find(Boolean)

  if (infoValue) {
    return infoValue
  }

  return section.Description?.trim() || null
}

function findSectionByHeading(sections: PubChemSection[], heading: string): PubChemSection | null {
  for (const section of sections) {
    if (section.TOCHeading === heading) {
      return section
    }

    const nestedSection = findSectionByHeading(section.Section ?? [], heading)
    if (nestedSection) {
      return nestedSection
    }
  }

  return null
}

function toCategory(groupBlock: string | null | undefined, atomicNumber: number): ElementCategory {
  const normalized = groupBlock?.trim().toLowerCase()

  if (atomicNumber >= 57 && atomicNumber <= 71) {
    return 'lanthanide'
  }

  if (atomicNumber >= 89 && atomicNumber <= 103) {
    return 'actinide'
  }

  switch (normalized) {
    case 'alkali metal':
      return 'alkali-metal'
    case 'alkaline earth metal':
      return 'alkaline-earth-metal'
    case 'transition metal':
      return 'transition-metal'
    case 'post-transition metal':
      return 'post-transition-metal'
    case 'metalloid':
      return 'metalloid'
    case 'nonmetal':
      return 'nonmetal'
    case 'halogen':
      return 'halogen'
    case 'noble gas':
      return 'noble-gas'
    case 'lanthanide':
      return 'lanthanide'
    case 'actinide':
      return 'actinide'
    default:
      return 'unknown'
  }
}

function getDisplayPosition(
  atomicNumber: number,
  period: number,
  group: number | null,
): { xPos: number; yPos: number } {
  if (atomicNumber >= 57 && atomicNumber <= 71) {
    return { xPos: atomicNumber - 55, yPos: 8 }
  }

  if (atomicNumber >= 89 && atomicNumber <= 103) {
    return { xPos: atomicNumber - 87, yPos: 9 }
  }

  return {
    xPos: Math.max((group ?? 1) - 1, 0),
    yPos: Math.max(period - 1, 0),
  }
}

function getPeriodFromAtomicNumber(atomicNumber: number): number {
  if (atomicNumber <= 2) return 1
  if (atomicNumber <= 10) return 2
  if (atomicNumber <= 18) return 3
  if (atomicNumber <= 36) return 4
  if (atomicNumber <= 54) return 5
  if (atomicNumber <= 86) return 6
  return 7
}

function getGroupFromAtomicNumber(atomicNumber: number, groupBlock: string | null | undefined) {
  if (atomicNumber >= 57 && atomicNumber <= 71) {
    return null
  }

  if (atomicNumber >= 89 && atomicNumber <= 103) {
    return null
  }

  const normalized = groupBlock?.trim().toLowerCase()

  switch (atomicNumber) {
    case 1:
    case 3:
    case 11:
    case 19:
    case 37:
    case 55:
    case 87:
      return 1
    case 2:
    case 10:
    case 18:
    case 36:
    case 54:
    case 86:
    case 118:
      return 18
    default:
      break
  }

  if (normalized === 'alkali metal') return 1
  if (normalized === 'alkaline earth metal') return 2
  if (normalized === 'halogen') return 17
  if (normalized === 'noble gas') return 18

  const transitionGroup = getTransitionGroup(atomicNumber)
  if (transitionGroup) {
    return transitionGroup
  }

  return getPBlockGroup(atomicNumber)
}

function getTransitionGroup(atomicNumber: number): number | null {
  const period4 = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  const period5 = [39, 40, 41, 42, 43, 44, 45, 46, 47, 48]
  const period6 = [72, 73, 74, 75, 76, 77, 78, 79, 80]
  const period7 = [104, 105, 106, 107, 108, 109, 110, 111, 112]
  const sets = [period4, period5, period6, period7]

  for (const set of sets) {
    const index = set.indexOf(atomicNumber)
    if (index >= 0) {
      return index + 3
    }
  }

  return null
}

function getPBlockGroup(atomicNumber: number): number | null {
  const pBlockRows = [
    [5, 6, 7, 8, 9, 10],
    [13, 14, 15, 16, 17, 18],
    [31, 32, 33, 34, 35, 36],
    [49, 50, 51, 52, 53, 54],
    [81, 82, 83, 84, 85, 86],
    [113, 114, 115, 116, 117, 118],
  ]

  for (const row of pBlockRows) {
    const index = row.indexOf(atomicNumber)
    if (index >= 0) {
      return index + 13
    }
  }

  const sBlockGroup =
    atomicNumber === 4 ||
    atomicNumber === 12 ||
    atomicNumber === 20 ||
    atomicNumber === 38 ||
    atomicNumber === 56 ||
    atomicNumber === 88
      ? 2
      : null

  return sBlockGroup
}

function toNumber(value: string | null | undefined): number | null {
  if (!value) {
    return null
  }

  const normalized = value.replace(/,/g, '').trim()
  const match = normalized.match(/-?\d+(\.\d+)?/)

  if (!match) {
    return null
  }

  const parsed = Number(match[0])
  return Number.isFinite(parsed) ? parsed : null
}

function toNullableText(value: string | null | undefined) {
  const normalized = value?.trim()

  if (!normalized) {
    return null
  }

  return normalized
}

function normalizeHex(value: string | null | undefined) {
  const normalized = value?.trim()

  if (!normalized) {
    return null
  }

  return normalized.startsWith('#') ? normalized : `#${normalized}`
}

function formatElectronConfiguration(value: string | null | undefined) {
  if (!value) {
    return ''
  }

  return value.replace(/([spdfg])(\d+)/gi, (_, orbital: string, exponent: string) =>
    `${orbital}${exponent.replace(/[0-9]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(digit)])}`,
  )
}

export function formatDisplayNumber(value: number | null, fractionDigits = 3) {
  if (value == null) {
    return null
  }

  if (Number.isInteger(value)) {
    return String(value)
  }

  return value.toFixed(fractionDigits).replace(/\.?0+$/, '')
}
