export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown'

export const ELEMENT_CATEGORIES: ElementCategory[] = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown',
]

export interface Element {
  atomicNumber: number
  symbol: string
  name: string
  atomicWeight: number
  period: number
  group: number | null
  xPos: number
  yPos: number
  category: ElementCategory
  meltingPoint: number | null
  boilingPoint: number | null
  density: number | null
  electronConfig: string
  standardState: string | null
  oxidationStates: string | null
  yearDiscovered: string | null
  atomicRadius: number | null
  ionizationEnergy: number | null
  electronAffinity: number | null
  electronegativity: number | null
  cpkHexColor: string | null
}

export interface ElementDetail {
  atomicNumber: number
  name: string
  atomicWeightText: string | null
  electronConfig: string | null
  category: ElementCategory | null
  period: number | null
  group: number | null
  density: number | null
  meltingPoint: number | null
  boilingPoint: number | null
  oxidationStates: string | null
  atomicRadius: number | null
  ionizationEnergy: number | null
  electronAffinity: number | null
  electronegativity: number | null
  physicalDescription: string | null
  physicalDescriptionSource: 'wikipedia' | 'pubchem' | null
  physicalDescriptionUrl: string | null
}

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali-metal': '#c3ff96',
  'alkaline-earth-metal': '#ffd166',
  'transition-metal': '#a1faff',
  'post-transition-metal': '#74c2e1',
  'metalloid': '#c77dff',
  nonmetal: '#06d6a0',
  halogen: '#ffd700',
  'noble-gas': '#ff59e3',
  lanthanide: '#ff9f9f',
  actinide: '#ffb347',
  unknown: '#6b7280',
}

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali Metals',
  'alkaline-earth-metal': 'Alkaline Earth Metals',
  'transition-metal': 'Transition Metals',
  'post-transition-metal': 'Post-Transition Metals',
  metalloid: 'Metalloids',
  nonmetal: 'Nonmetals',
  halogen: 'Halogens',
  'noble-gas': 'Noble Gases',
  lanthanide: 'Lanthanides',
  actinide: 'Actinides',
  unknown: 'Unknown',
}
