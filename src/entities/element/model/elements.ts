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

export interface Element {
  atomicNumber: number
  symbol: string
  name: string
  atomicWeight: number
  period: number
  group: number | null
  xPos: number  // 0-indexed column in display grid
  yPos: number  // 0-indexed row (0-6 main, 8-9 f-block)
  category: ElementCategory
  meltingPoint: number | null
  boilingPoint: number | null
  density: number | null
  electronConfig: string
}

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali-metal': '#c3ff96',
  'alkaline-earth-metal': '#ffd166',
  'transition-metal': '#a1faff',
  'post-transition-metal': '#74c2e1',
  'metalloid': '#c77dff',
  'nonmetal': '#06d6a0',
  'halogen': '#ffd700',
  'noble-gas': '#ff59e3',
  'lanthanide': '#ff9f9f',
  'actinide': '#ffb347',
  'unknown': '#6b7280',
}

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali Metals',
  'alkaline-earth-metal': 'Alkaline Earth Metals',
  'transition-metal': 'Transition Metals',
  'post-transition-metal': 'Post-Transition Metals',
  'metalloid': 'Metalloids',
  'nonmetal': 'Nonmetals',
  'halogen': 'Halogens',
  'noble-gas': 'Noble Gases',
  'lanthanide': 'Lanthanides',
  'actinide': 'Actinides',
  'unknown': 'Unknown',
}

export const elements: Element[] = [
  // Period 1
  { atomicNumber: 1,   symbol: 'H',  name: 'Hydrogen',      atomicWeight: 1.008,    period: 1, group: 1,    xPos: 0,  yPos: 0, category: 'nonmetal',            meltingPoint: 14,    boilingPoint: 20,    density: 0.00009,  electronConfig: '1s¹' },
  { atomicNumber: 2,   symbol: 'He', name: 'Helium',        atomicWeight: 4.003,    period: 1, group: 18,   xPos: 17, yPos: 0, category: 'noble-gas',           meltingPoint: null,  boilingPoint: 4,     density: 0.000179, electronConfig: '1s²' },
  // Period 2
  { atomicNumber: 3,   symbol: 'Li', name: 'Lithium',       atomicWeight: 6.941,    period: 2, group: 1,    xPos: 0,  yPos: 1, category: 'alkali-metal',        meltingPoint: 454,   boilingPoint: 1615,  density: 0.535,    electronConfig: '[He] 2s¹' },
  { atomicNumber: 4,   symbol: 'Be', name: 'Beryllium',     atomicWeight: 9.012,    period: 2, group: 2,    xPos: 1,  yPos: 1, category: 'alkaline-earth-metal', meltingPoint: 1560,  boilingPoint: 2744,  density: 1.85,     electronConfig: '[He] 2s²' },
  { atomicNumber: 5,   symbol: 'B',  name: 'Boron',         atomicWeight: 10.811,   period: 2, group: 13,   xPos: 12, yPos: 1, category: 'metalloid',           meltingPoint: 2349,  boilingPoint: 4200,  density: 2.34,     electronConfig: '[He] 2s² 2p¹' },
  { atomicNumber: 6,   symbol: 'C',  name: 'Carbon',        atomicWeight: 12.011,   period: 2, group: 14,   xPos: 13, yPos: 1, category: 'nonmetal',            meltingPoint: 3800,  boilingPoint: 4300,  density: 2.267,    electronConfig: '[He] 2s² 2p²' },
  { atomicNumber: 7,   symbol: 'N',  name: 'Nitrogen',      atomicWeight: 14.007,   period: 2, group: 15,   xPos: 14, yPos: 1, category: 'nonmetal',            meltingPoint: 63,    boilingPoint: 77,    density: 0.00125,  electronConfig: '[He] 2s² 2p³' },
  { atomicNumber: 8,   symbol: 'O',  name: 'Oxygen',        atomicWeight: 15.999,   period: 2, group: 16,   xPos: 15, yPos: 1, category: 'nonmetal',            meltingPoint: 54,    boilingPoint: 90,    density: 0.00143,  electronConfig: '[He] 2s² 2p⁴' },
  { atomicNumber: 9,   symbol: 'F',  name: 'Fluorine',      atomicWeight: 18.998,   period: 2, group: 17,   xPos: 16, yPos: 1, category: 'halogen',             meltingPoint: 54,    boilingPoint: 85,    density: 0.0017,   electronConfig: '[He] 2s² 2p⁵' },
  { atomicNumber: 10,  symbol: 'Ne', name: 'Neon',          atomicWeight: 20.180,   period: 2, group: 18,   xPos: 17, yPos: 1, category: 'noble-gas',           meltingPoint: 25,    boilingPoint: 27,    density: 0.0009,   electronConfig: '[He] 2s² 2p⁶' },
  // Period 3
  { atomicNumber: 11,  symbol: 'Na', name: 'Sodium',        atomicWeight: 22.990,   period: 3, group: 1,    xPos: 0,  yPos: 2, category: 'alkali-metal',        meltingPoint: 371,   boilingPoint: 1156,  density: 0.971,    electronConfig: '[Ne] 3s¹' },
  { atomicNumber: 12,  symbol: 'Mg', name: 'Magnesium',     atomicWeight: 24.305,   period: 3, group: 2,    xPos: 1,  yPos: 2, category: 'alkaline-earth-metal', meltingPoint: 923,   boilingPoint: 1363,  density: 1.738,    electronConfig: '[Ne] 3s²' },
  { atomicNumber: 13,  symbol: 'Al', name: 'Aluminum',      atomicWeight: 26.982,   period: 3, group: 13,   xPos: 12, yPos: 2, category: 'post-transition-metal', meltingPoint: 933,  boilingPoint: 2792,  density: 2.698,    electronConfig: '[Ne] 3s² 3p¹' },
  { atomicNumber: 14,  symbol: 'Si', name: 'Silicon',       atomicWeight: 28.086,   period: 3, group: 14,   xPos: 13, yPos: 2, category: 'metalloid',           meltingPoint: 1687,  boilingPoint: 3538,  density: 2.33,     electronConfig: '[Ne] 3s² 3p²' },
  { atomicNumber: 15,  symbol: 'P',  name: 'Phosphorus',    atomicWeight: 30.974,   period: 3, group: 15,   xPos: 14, yPos: 2, category: 'nonmetal',            meltingPoint: 317,   boilingPoint: 550,   density: 1.82,     electronConfig: '[Ne] 3s² 3p³' },
  { atomicNumber: 16,  symbol: 'S',  name: 'Sulfur',        atomicWeight: 32.065,   period: 3, group: 16,   xPos: 15, yPos: 2, category: 'nonmetal',            meltingPoint: 388,   boilingPoint: 718,   density: 2.067,    electronConfig: '[Ne] 3s² 3p⁴' },
  { atomicNumber: 17,  symbol: 'Cl', name: 'Chlorine',      atomicWeight: 35.453,   period: 3, group: 17,   xPos: 16, yPos: 2, category: 'halogen',             meltingPoint: 172,   boilingPoint: 239,   density: 0.00321,  electronConfig: '[Ne] 3s² 3p⁵' },
  { atomicNumber: 18,  symbol: 'Ar', name: 'Argon',         atomicWeight: 39.948,   period: 3, group: 18,   xPos: 17, yPos: 2, category: 'noble-gas',           meltingPoint: 84,    boilingPoint: 87,    density: 0.00178,  electronConfig: '[Ne] 3s² 3p⁶' },
  // Period 4
  { atomicNumber: 19,  symbol: 'K',  name: 'Potassium',     atomicWeight: 39.098,   period: 4, group: 1,    xPos: 0,  yPos: 3, category: 'alkali-metal',        meltingPoint: 337,   boilingPoint: 1032,  density: 0.862,    electronConfig: '[Ar] 4s¹' },
  { atomicNumber: 20,  symbol: 'Ca', name: 'Calcium',       atomicWeight: 40.078,   period: 4, group: 2,    xPos: 1,  yPos: 3, category: 'alkaline-earth-metal', meltingPoint: 1115,  boilingPoint: 1757,  density: 1.54,     electronConfig: '[Ar] 4s²' },
  { atomicNumber: 21,  symbol: 'Sc', name: 'Scandium',      atomicWeight: 44.956,   period: 4, group: 3,    xPos: 2,  yPos: 3, category: 'transition-metal',    meltingPoint: 1814,  boilingPoint: 3109,  density: 2.989,    electronConfig: '[Ar] 3d¹ 4s²' },
  { atomicNumber: 22,  symbol: 'Ti', name: 'Titanium',      atomicWeight: 47.867,   period: 4, group: 4,    xPos: 3,  yPos: 3, category: 'transition-metal',    meltingPoint: 1941,  boilingPoint: 3560,  density: 4.507,    electronConfig: '[Ar] 3d² 4s²' },
  { atomicNumber: 23,  symbol: 'V',  name: 'Vanadium',      atomicWeight: 50.942,   period: 4, group: 5,    xPos: 4,  yPos: 3, category: 'transition-metal',    meltingPoint: 2183,  boilingPoint: 3680,  density: 6.0,      electronConfig: '[Ar] 3d³ 4s²' },
  { atomicNumber: 24,  symbol: 'Cr', name: 'Chromium',      atomicWeight: 51.996,   period: 4, group: 6,    xPos: 5,  yPos: 3, category: 'transition-metal',    meltingPoint: 2180,  boilingPoint: 2944,  density: 7.19,     electronConfig: '[Ar] 3d⁵ 4s¹' },
  { atomicNumber: 25,  symbol: 'Mn', name: 'Manganese',     atomicWeight: 54.938,   period: 4, group: 7,    xPos: 6,  yPos: 3, category: 'transition-metal',    meltingPoint: 1519,  boilingPoint: 2334,  density: 7.47,     electronConfig: '[Ar] 3d⁵ 4s²' },
  { atomicNumber: 26,  symbol: 'Fe', name: 'Iron',          atomicWeight: 55.845,   period: 4, group: 8,    xPos: 7,  yPos: 3, category: 'transition-metal',    meltingPoint: 1811,  boilingPoint: 3134,  density: 7.874,    electronConfig: '[Ar] 3d⁶ 4s²' },
  { atomicNumber: 27,  symbol: 'Co', name: 'Cobalt',        atomicWeight: 58.933,   period: 4, group: 9,    xPos: 8,  yPos: 3, category: 'transition-metal',    meltingPoint: 1768,  boilingPoint: 3200,  density: 8.9,      electronConfig: '[Ar] 3d⁷ 4s²' },
  { atomicNumber: 28,  symbol: 'Ni', name: 'Nickel',        atomicWeight: 58.693,   period: 4, group: 10,   xPos: 9,  yPos: 3, category: 'transition-metal',    meltingPoint: 1728,  boilingPoint: 3186,  density: 8.908,    electronConfig: '[Ar] 3d⁸ 4s²' },
  { atomicNumber: 29,  symbol: 'Cu', name: 'Copper',        atomicWeight: 63.546,   period: 4, group: 11,   xPos: 10, yPos: 3, category: 'transition-metal',    meltingPoint: 1358,  boilingPoint: 2835,  density: 8.96,     electronConfig: '[Ar] 3d¹⁰ 4s¹' },
  { atomicNumber: 30,  symbol: 'Zn', name: 'Zinc',          atomicWeight: 65.38,    period: 4, group: 12,   xPos: 11, yPos: 3, category: 'transition-metal',    meltingPoint: 693,   boilingPoint: 1180,  density: 7.14,     electronConfig: '[Ar] 3d¹⁰ 4s²' },
  { atomicNumber: 31,  symbol: 'Ga', name: 'Gallium',       atomicWeight: 69.723,   period: 4, group: 13,   xPos: 12, yPos: 3, category: 'post-transition-metal', meltingPoint: 303,  boilingPoint: 2477,  density: 5.91,     electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹' },
  { atomicNumber: 32,  symbol: 'Ge', name: 'Germanium',     atomicWeight: 72.630,   period: 4, group: 14,   xPos: 13, yPos: 3, category: 'metalloid',           meltingPoint: 1211,  boilingPoint: 3106,  density: 5.323,    electronConfig: '[Ar] 3d¹⁰ 4s² 4p²' },
  { atomicNumber: 33,  symbol: 'As', name: 'Arsenic',       atomicWeight: 74.922,   period: 4, group: 15,   xPos: 14, yPos: 3, category: 'metalloid',           meltingPoint: 1090,  boilingPoint: 887,   density: 5.727,    electronConfig: '[Ar] 3d¹⁰ 4s² 4p³' },
  { atomicNumber: 34,  symbol: 'Se', name: 'Selenium',      atomicWeight: 78.971,   period: 4, group: 16,   xPos: 15, yPos: 3, category: 'nonmetal',            meltingPoint: 494,   boilingPoint: 958,   density: 4.81,     electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴' },
  { atomicNumber: 35,  symbol: 'Br', name: 'Bromine',       atomicWeight: 79.904,   period: 4, group: 17,   xPos: 16, yPos: 3, category: 'halogen',             meltingPoint: 266,   boilingPoint: 332,   density: 3.11,     electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵' },
  { atomicNumber: 36,  symbol: 'Kr', name: 'Krypton',       atomicWeight: 83.798,   period: 4, group: 18,   xPos: 17, yPos: 3, category: 'noble-gas',           meltingPoint: 116,   boilingPoint: 120,   density: 0.00374,  electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶' },
  // Period 5
  { atomicNumber: 37,  symbol: 'Rb', name: 'Rubidium',      atomicWeight: 85.468,   period: 5, group: 1,    xPos: 0,  yPos: 4, category: 'alkali-metal',        meltingPoint: 312,   boilingPoint: 961,   density: 1.532,    electronConfig: '[Kr] 5s¹' },
  { atomicNumber: 38,  symbol: 'Sr', name: 'Strontium',     atomicWeight: 87.62,    period: 5, group: 2,    xPos: 1,  yPos: 4, category: 'alkaline-earth-metal', meltingPoint: 1050,  boilingPoint: 1655,  density: 2.64,     electronConfig: '[Kr] 5s²' },
  { atomicNumber: 39,  symbol: 'Y',  name: 'Yttrium',       atomicWeight: 88.906,   period: 5, group: 3,    xPos: 2,  yPos: 4, category: 'transition-metal',    meltingPoint: 1799,  boilingPoint: 3609,  density: 4.472,    electronConfig: '[Kr] 4d¹ 5s²' },
  { atomicNumber: 40,  symbol: 'Zr', name: 'Zirconium',     atomicWeight: 91.224,   period: 5, group: 4,    xPos: 3,  yPos: 4, category: 'transition-metal',    meltingPoint: 2128,  boilingPoint: 4682,  density: 6.511,    electronConfig: '[Kr] 4d² 5s²' },
  { atomicNumber: 41,  symbol: 'Nb', name: 'Niobium',       atomicWeight: 92.906,   period: 5, group: 5,    xPos: 4,  yPos: 4, category: 'transition-metal',    meltingPoint: 2750,  boilingPoint: 5017,  density: 8.57,     electronConfig: '[Kr] 4d⁴ 5s¹' },
  { atomicNumber: 42,  symbol: 'Mo', name: 'Molybdenum',    atomicWeight: 95.96,    period: 5, group: 6,    xPos: 5,  yPos: 4, category: 'transition-metal',    meltingPoint: 2896,  boilingPoint: 4912,  density: 10.28,    electronConfig: '[Kr] 4d⁵ 5s¹' },
  { atomicNumber: 43,  symbol: 'Tc', name: 'Technetium',    atomicWeight: 98,       period: 5, group: 7,    xPos: 6,  yPos: 4, category: 'transition-metal',    meltingPoint: 2430,  boilingPoint: 4538,  density: 11.0,     electronConfig: '[Kr] 4d⁵ 5s²' },
  { atomicNumber: 44,  symbol: 'Ru', name: 'Ruthenium',     atomicWeight: 101.07,   period: 5, group: 8,    xPos: 7,  yPos: 4, category: 'transition-metal',    meltingPoint: 2607,  boilingPoint: 4423,  density: 12.45,    electronConfig: '[Kr] 4d⁷ 5s¹' },
  { atomicNumber: 45,  symbol: 'Rh', name: 'Rhodium',       atomicWeight: 102.906,  period: 5, group: 9,    xPos: 8,  yPos: 4, category: 'transition-metal',    meltingPoint: 2237,  boilingPoint: 3968,  density: 12.41,    electronConfig: '[Kr] 4d⁸ 5s¹' },
  { atomicNumber: 46,  symbol: 'Pd', name: 'Palladium',     atomicWeight: 106.42,   period: 5, group: 10,   xPos: 9,  yPos: 4, category: 'transition-metal',    meltingPoint: 1828,  boilingPoint: 3236,  density: 12.023,   electronConfig: '[Kr] 4d¹⁰' },
  { atomicNumber: 47,  symbol: 'Ag', name: 'Silver',        atomicWeight: 107.868,  period: 5, group: 11,   xPos: 10, yPos: 4, category: 'transition-metal',    meltingPoint: 1235,  boilingPoint: 2435,  density: 10.501,   electronConfig: '[Kr] 4d¹⁰ 5s¹' },
  { atomicNumber: 48,  symbol: 'Cd', name: 'Cadmium',       atomicWeight: 112.411,  period: 5, group: 12,   xPos: 11, yPos: 4, category: 'transition-metal',    meltingPoint: 594,   boilingPoint: 1040,  density: 8.65,     electronConfig: '[Kr] 4d¹⁰ 5s²' },
  { atomicNumber: 49,  symbol: 'In', name: 'Indium',        atomicWeight: 114.818,  period: 5, group: 13,   xPos: 12, yPos: 4, category: 'post-transition-metal', meltingPoint: 430,  boilingPoint: 2345,  density: 7.31,     electronConfig: '[Kr] 4d¹⁰ 5s² 5p¹' },
  { atomicNumber: 50,  symbol: 'Sn', name: 'Tin',           atomicWeight: 118.710,  period: 5, group: 14,   xPos: 13, yPos: 4, category: 'post-transition-metal', meltingPoint: 505,  boilingPoint: 2875,  density: 7.287,    electronConfig: '[Kr] 4d¹⁰ 5s² 5p²' },
  { atomicNumber: 51,  symbol: 'Sb', name: 'Antimony',      atomicWeight: 121.760,  period: 5, group: 15,   xPos: 14, yPos: 4, category: 'metalloid',           meltingPoint: 904,   boilingPoint: 1860,  density: 6.685,    electronConfig: '[Kr] 4d¹⁰ 5s² 5p³' },
  { atomicNumber: 52,  symbol: 'Te', name: 'Tellurium',     atomicWeight: 127.60,   period: 5, group: 16,   xPos: 15, yPos: 4, category: 'metalloid',           meltingPoint: 723,   boilingPoint: 1261,  density: 6.232,    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁴' },
  { atomicNumber: 53,  symbol: 'I',  name: 'Iodine',        atomicWeight: 126.904,  period: 5, group: 17,   xPos: 16, yPos: 4, category: 'halogen',             meltingPoint: 387,   boilingPoint: 457,   density: 4.93,     electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵' },
  { atomicNumber: 54,  symbol: 'Xe', name: 'Xenon',         atomicWeight: 131.293,  period: 5, group: 18,   xPos: 17, yPos: 4, category: 'noble-gas',           meltingPoint: 161,   boilingPoint: 165,   density: 0.005887, electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶' },
  // Period 6
  { atomicNumber: 55,  symbol: 'Cs', name: 'Cesium',        atomicWeight: 132.905,  period: 6, group: 1,    xPos: 0,  yPos: 5, category: 'alkali-metal',        meltingPoint: 302,   boilingPoint: 944,   density: 1.873,    electronConfig: '[Xe] 6s¹' },
  { atomicNumber: 56,  symbol: 'Ba', name: 'Barium',        atomicWeight: 137.327,  period: 6, group: 2,    xPos: 1,  yPos: 5, category: 'alkaline-earth-metal', meltingPoint: 1000,  boilingPoint: 2170,  density: 3.594,    electronConfig: '[Xe] 6s²' },
  // Lanthanides (f-block row 1, yPos=8)
  { atomicNumber: 57,  symbol: 'La', name: 'Lanthanum',     atomicWeight: 138.905,  period: 6, group: null, xPos: 2,  yPos: 8, category: 'lanthanide',          meltingPoint: 1193,  boilingPoint: 3737,  density: 6.162,    electronConfig: '[Xe] 5d¹ 6s²' },
  { atomicNumber: 58,  symbol: 'Ce', name: 'Cerium',        atomicWeight: 140.116,  period: 6, group: null, xPos: 3,  yPos: 8, category: 'lanthanide',          meltingPoint: 1068,  boilingPoint: 3716,  density: 6.77,     electronConfig: '[Xe] 4f¹ 5d¹ 6s²' },
  { atomicNumber: 59,  symbol: 'Pr', name: 'Praseodymium',  atomicWeight: 140.908,  period: 6, group: null, xPos: 4,  yPos: 8, category: 'lanthanide',          meltingPoint: 1208,  boilingPoint: 3793,  density: 6.773,    electronConfig: '[Xe] 4f³ 6s²' },
  { atomicNumber: 60,  symbol: 'Nd', name: 'Neodymium',     atomicWeight: 144.242,  period: 6, group: null, xPos: 5,  yPos: 8, category: 'lanthanide',          meltingPoint: 1297,  boilingPoint: 3347,  density: 7.007,    electronConfig: '[Xe] 4f⁴ 6s²' },
  { atomicNumber: 61,  symbol: 'Pm', name: 'Promethium',    atomicWeight: 145,      period: 6, group: null, xPos: 6,  yPos: 8, category: 'lanthanide',          meltingPoint: 1315,  boilingPoint: 3273,  density: 7.26,     electronConfig: '[Xe] 4f⁵ 6s²' },
  { atomicNumber: 62,  symbol: 'Sm', name: 'Samarium',      atomicWeight: 150.36,   period: 6, group: null, xPos: 7,  yPos: 8, category: 'lanthanide',          meltingPoint: 1345,  boilingPoint: 2067,  density: 7.52,     electronConfig: '[Xe] 4f⁶ 6s²' },
  { atomicNumber: 63,  symbol: 'Eu', name: 'Europium',      atomicWeight: 151.964,  period: 6, group: null, xPos: 8,  yPos: 8, category: 'lanthanide',          meltingPoint: 1099,  boilingPoint: 1802,  density: 5.243,    electronConfig: '[Xe] 4f⁷ 6s²' },
  { atomicNumber: 64,  symbol: 'Gd', name: 'Gadolinium',    atomicWeight: 157.25,   period: 6, group: null, xPos: 9,  yPos: 8, category: 'lanthanide',          meltingPoint: 1585,  boilingPoint: 3546,  density: 7.9,      electronConfig: '[Xe] 4f⁷ 5d¹ 6s²' },
  { atomicNumber: 65,  symbol: 'Tb', name: 'Terbium',       atomicWeight: 158.925,  period: 6, group: null, xPos: 10, yPos: 8, category: 'lanthanide',          meltingPoint: 1629,  boilingPoint: 3503,  density: 8.23,     electronConfig: '[Xe] 4f⁹ 6s²' },
  { atomicNumber: 66,  symbol: 'Dy', name: 'Dysprosium',    atomicWeight: 162.500,  period: 6, group: null, xPos: 11, yPos: 8, category: 'lanthanide',          meltingPoint: 1680,  boilingPoint: 2840,  density: 8.55,     electronConfig: '[Xe] 4f¹⁰ 6s²' },
  { atomicNumber: 67,  symbol: 'Ho', name: 'Holmium',       atomicWeight: 164.930,  period: 6, group: null, xPos: 12, yPos: 8, category: 'lanthanide',          meltingPoint: 1734,  boilingPoint: 2993,  density: 8.79,     electronConfig: '[Xe] 4f¹¹ 6s²' },
  { atomicNumber: 68,  symbol: 'Er', name: 'Erbium',        atomicWeight: 167.259,  period: 6, group: null, xPos: 13, yPos: 8, category: 'lanthanide',          meltingPoint: 1802,  boilingPoint: 3141,  density: 9.066,    electronConfig: '[Xe] 4f¹² 6s²' },
  { atomicNumber: 69,  symbol: 'Tm', name: 'Thulium',       atomicWeight: 168.934,  period: 6, group: null, xPos: 14, yPos: 8, category: 'lanthanide',          meltingPoint: 1818,  boilingPoint: 2223,  density: 9.321,    electronConfig: '[Xe] 4f¹³ 6s²' },
  { atomicNumber: 70,  symbol: 'Yb', name: 'Ytterbium',     atomicWeight: 173.054,  period: 6, group: null, xPos: 15, yPos: 8, category: 'lanthanide',          meltingPoint: 1097,  boilingPoint: 1469,  density: 6.965,    electronConfig: '[Xe] 4f¹⁴ 6s²' },
  { atomicNumber: 71,  symbol: 'Lu', name: 'Lutetium',      atomicWeight: 174.967,  period: 6, group: null, xPos: 16, yPos: 8, category: 'lanthanide',          meltingPoint: 1925,  boilingPoint: 3675,  density: 9.84,     electronConfig: '[Xe] 4f¹⁴ 5d¹ 6s²' },
  // Period 6 continued (after lanthanides)
  { atomicNumber: 72,  symbol: 'Hf', name: 'Hafnium',       atomicWeight: 178.49,   period: 6, group: 4,    xPos: 3,  yPos: 5, category: 'transition-metal',    meltingPoint: 2506,  boilingPoint: 4876,  density: 13.31,    electronConfig: '[Xe] 4f¹⁴ 5d² 6s²' },
  { atomicNumber: 73,  symbol: 'Ta', name: 'Tantalum',      atomicWeight: 180.948,  period: 6, group: 5,    xPos: 4,  yPos: 5, category: 'transition-metal',    meltingPoint: 3290,  boilingPoint: 5731,  density: 16.69,    electronConfig: '[Xe] 4f¹⁴ 5d³ 6s²' },
  { atomicNumber: 74,  symbol: 'W',  name: 'Tungsten',      atomicWeight: 183.84,   period: 6, group: 6,    xPos: 5,  yPos: 5, category: 'transition-metal',    meltingPoint: 3695,  boilingPoint: 5828,  density: 19.25,    electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²' },
  { atomicNumber: 75,  symbol: 'Re', name: 'Rhenium',       atomicWeight: 186.207,  period: 6, group: 7,    xPos: 6,  yPos: 5, category: 'transition-metal',    meltingPoint: 3459,  boilingPoint: 5869,  density: 21.02,    electronConfig: '[Xe] 4f¹⁴ 5d⁵ 6s²' },
  { atomicNumber: 76,  symbol: 'Os', name: 'Osmium',        atomicWeight: 190.23,   period: 6, group: 8,    xPos: 7,  yPos: 5, category: 'transition-metal',    meltingPoint: 3306,  boilingPoint: 5285,  density: 22.587,   electronConfig: '[Xe] 4f¹⁴ 5d⁶ 6s²' },
  { atomicNumber: 77,  symbol: 'Ir', name: 'Iridium',       atomicWeight: 192.217,  period: 6, group: 9,    xPos: 8,  yPos: 5, category: 'transition-metal',    meltingPoint: 2719,  boilingPoint: 4403,  density: 22.562,   electronConfig: '[Xe] 4f¹⁴ 5d⁷ 6s²' },
  { atomicNumber: 78,  symbol: 'Pt', name: 'Platinum',      atomicWeight: 195.084,  period: 6, group: 10,   xPos: 9,  yPos: 5, category: 'transition-metal',    meltingPoint: 2041,  boilingPoint: 4098,  density: 21.46,    electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹' },
  { atomicNumber: 79,  symbol: 'Au', name: 'Gold',          atomicWeight: 196.967,  period: 6, group: 11,   xPos: 10, yPos: 5, category: 'transition-metal',    meltingPoint: 1337,  boilingPoint: 3129,  density: 19.282,   electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },
  { atomicNumber: 80,  symbol: 'Hg', name: 'Mercury',       atomicWeight: 200.59,   period: 6, group: 12,   xPos: 11, yPos: 5, category: 'post-transition-metal', meltingPoint: 234,  boilingPoint: 630,   density: 13.534,   electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²' },
  { atomicNumber: 81,  symbol: 'Tl', name: 'Thallium',      atomicWeight: 204.383,  period: 6, group: 13,   xPos: 12, yPos: 5, category: 'post-transition-metal', meltingPoint: 577,  boilingPoint: 1746,  density: 11.85,    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹' },
  { atomicNumber: 82,  symbol: 'Pb', name: 'Lead',          atomicWeight: 207.2,    period: 6, group: 14,   xPos: 13, yPos: 5, category: 'post-transition-metal', meltingPoint: 601,  boilingPoint: 2022,  density: 11.342,   electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²' },
  { atomicNumber: 83,  symbol: 'Bi', name: 'Bismuth',       atomicWeight: 208.980,  period: 6, group: 15,   xPos: 14, yPos: 5, category: 'post-transition-metal', meltingPoint: 544,  boilingPoint: 1837,  density: 9.807,    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³' },
  { atomicNumber: 84,  symbol: 'Po', name: 'Polonium',      atomicWeight: 209,      period: 6, group: 16,   xPos: 15, yPos: 5, category: 'post-transition-metal', meltingPoint: 527,  boilingPoint: 1235,  density: 9.196,    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴' },
  { atomicNumber: 85,  symbol: 'At', name: 'Astatine',      atomicWeight: 210,      period: 6, group: 17,   xPos: 16, yPos: 5, category: 'halogen',             meltingPoint: 575,   boilingPoint: 610,   density: 7.0,      electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵' },
  { atomicNumber: 86,  symbol: 'Rn', name: 'Radon',         atomicWeight: 222,      period: 6, group: 18,   xPos: 17, yPos: 5, category: 'noble-gas',           meltingPoint: 202,   boilingPoint: 212,   density: 0.00973,  electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶' },
  // Period 7
  { atomicNumber: 87,  symbol: 'Fr', name: 'Francium',      atomicWeight: 223,      period: 7, group: 1,    xPos: 0,  yPos: 6, category: 'alkali-metal',        meltingPoint: 300,   boilingPoint: 950,   density: 1.87,     electronConfig: '[Rn] 7s¹' },
  { atomicNumber: 88,  symbol: 'Ra', name: 'Radium',        atomicWeight: 226,      period: 7, group: 2,    xPos: 1,  yPos: 6, category: 'alkaline-earth-metal', meltingPoint: 973,   boilingPoint: 2010,  density: 5.5,      electronConfig: '[Rn] 7s²' },
  // Actinides (f-block row 2, yPos=9)
  { atomicNumber: 89,  symbol: 'Ac', name: 'Actinium',      atomicWeight: 227,      period: 7, group: null, xPos: 2,  yPos: 9, category: 'actinide',            meltingPoint: 1323,  boilingPoint: 3471,  density: 10.07,    electronConfig: '[Rn] 6d¹ 7s²' },
  { atomicNumber: 90,  symbol: 'Th', name: 'Thorium',       atomicWeight: 232.038,  period: 7, group: null, xPos: 3,  yPos: 9, category: 'actinide',            meltingPoint: 2115,  boilingPoint: 5061,  density: 11.72,    electronConfig: '[Rn] 6d² 7s²' },
  { atomicNumber: 91,  symbol: 'Pa', name: 'Protactinium',  atomicWeight: 231.036,  period: 7, group: null, xPos: 4,  yPos: 9, category: 'actinide',            meltingPoint: 1841,  boilingPoint: 4300,  density: 15.37,    electronConfig: '[Rn] 5f² 6d¹ 7s²' },
  { atomicNumber: 92,  symbol: 'U',  name: 'Uranium',       atomicWeight: 238.029,  period: 7, group: null, xPos: 5,  yPos: 9, category: 'actinide',            meltingPoint: 1405,  boilingPoint: 4404,  density: 19.1,     electronConfig: '[Rn] 5f³ 6d¹ 7s²' },
  { atomicNumber: 93,  symbol: 'Np', name: 'Neptunium',     atomicWeight: 237,      period: 7, group: null, xPos: 6,  yPos: 9, category: 'actinide',            meltingPoint: 912,   boilingPoint: 4175,  density: 20.45,    electronConfig: '[Rn] 5f⁴ 6d¹ 7s²' },
  { atomicNumber: 94,  symbol: 'Pu', name: 'Plutonium',     atomicWeight: 244,      period: 7, group: null, xPos: 7,  yPos: 9, category: 'actinide',            meltingPoint: 913,   boilingPoint: 3501,  density: 19.816,   electronConfig: '[Rn] 5f⁶ 7s²' },
  { atomicNumber: 95,  symbol: 'Am', name: 'Americium',     atomicWeight: 243,      period: 7, group: null, xPos: 8,  yPos: 9, category: 'actinide',            meltingPoint: 1449,  boilingPoint: 2880,  density: 13.67,    electronConfig: '[Rn] 5f⁷ 7s²' },
  { atomicNumber: 96,  symbol: 'Cm', name: 'Curium',        atomicWeight: 247,      period: 7, group: null, xPos: 9,  yPos: 9, category: 'actinide',            meltingPoint: 1613,  boilingPoint: 3383,  density: 13.51,    electronConfig: '[Rn] 5f⁷ 6d¹ 7s²' },
  { atomicNumber: 97,  symbol: 'Bk', name: 'Berkelium',     atomicWeight: 247,      period: 7, group: null, xPos: 10, yPos: 9, category: 'actinide',            meltingPoint: 1259,  boilingPoint: 2900,  density: 14.78,    electronConfig: '[Rn] 5f⁹ 7s²' },
  { atomicNumber: 98,  symbol: 'Cf', name: 'Californium',   atomicWeight: 251,      period: 7, group: null, xPos: 11, yPos: 9, category: 'actinide',            meltingPoint: 1173,  boilingPoint: 1743,  density: 15.1,     electronConfig: '[Rn] 5f¹⁰ 7s²' },
  { atomicNumber: 99,  symbol: 'Es', name: 'Einsteinium',   atomicWeight: 252,      period: 7, group: null, xPos: 12, yPos: 9, category: 'actinide',            meltingPoint: 1133,  boilingPoint: null,  density: 8.84,     electronConfig: '[Rn] 5f¹¹ 7s²' },
  { atomicNumber: 100, symbol: 'Fm', name: 'Fermium',       atomicWeight: 257,      period: 7, group: null, xPos: 13, yPos: 9, category: 'actinide',            meltingPoint: 1800,  boilingPoint: null,  density: null,     electronConfig: '[Rn] 5f¹² 7s²' },
  { atomicNumber: 101, symbol: 'Md', name: 'Mendelevium',   atomicWeight: 258,      period: 7, group: null, xPos: 14, yPos: 9, category: 'actinide',            meltingPoint: 1100,  boilingPoint: null,  density: null,     electronConfig: '[Rn] 5f¹³ 7s²' },
  { atomicNumber: 102, symbol: 'No', name: 'Nobelium',      atomicWeight: 259,      period: 7, group: null, xPos: 15, yPos: 9, category: 'actinide',            meltingPoint: 1100,  boilingPoint: null,  density: null,     electronConfig: '[Rn] 5f¹⁴ 7s²' },
  { atomicNumber: 103, symbol: 'Lr', name: 'Lawrencium',    atomicWeight: 262,      period: 7, group: null, xPos: 16, yPos: 9, category: 'actinide',            meltingPoint: 1900,  boilingPoint: null,  density: null,     electronConfig: '[Rn] 5f¹⁴ 7s² 7p¹' },
  // Period 7 continued
  { atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordium', atomicWeight: 267,      period: 7, group: 4,    xPos: 3,  yPos: 6, category: 'transition-metal',    meltingPoint: null,  boilingPoint: null,  density: 23.2,     electronConfig: '[Rn] 5f¹⁴ 6d² 7s²' },
  { atomicNumber: 105, symbol: 'Db', name: 'Dubnium',       atomicWeight: 268,      period: 7, group: 5,    xPos: 4,  yPos: 6, category: 'transition-metal',    meltingPoint: null,  boilingPoint: null,  density: 29.3,     electronConfig: '[Rn] 5f¹⁴ 6d³ 7s²' },
  { atomicNumber: 106, symbol: 'Sg', name: 'Seaborgium',    atomicWeight: 271,      period: 7, group: 6,    xPos: 5,  yPos: 6, category: 'transition-metal',    meltingPoint: null,  boilingPoint: null,  density: 35.0,     electronConfig: '[Rn] 5f¹⁴ 6d⁴ 7s²' },
  { atomicNumber: 107, symbol: 'Bh', name: 'Bohrium',       atomicWeight: 272,      period: 7, group: 7,    xPos: 6,  yPos: 6, category: 'transition-metal',    meltingPoint: null,  boilingPoint: null,  density: 37.1,     electronConfig: '[Rn] 5f¹⁴ 6d⁵ 7s²' },
  { atomicNumber: 108, symbol: 'Hs', name: 'Hassium',       atomicWeight: 277,      period: 7, group: 8,    xPos: 7,  yPos: 6, category: 'transition-metal',    meltingPoint: null,  boilingPoint: null,  density: 40.7,     electronConfig: '[Rn] 5f¹⁴ 6d⁶ 7s²' },
  { atomicNumber: 109, symbol: 'Mt', name: 'Meitnerium',    atomicWeight: 276,      period: 7, group: 9,    xPos: 8,  yPos: 6, category: 'unknown',             meltingPoint: null,  boilingPoint: null,  density: 37.4,     electronConfig: '[Rn] 5f¹⁴ 6d⁷ 7s²' },
  { atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtium',  atomicWeight: 281,      period: 7, group: 10,   xPos: 9,  yPos: 6, category: 'unknown',             meltingPoint: null,  boilingPoint: null,  density: 34.8,     electronConfig: '[Rn] 5f¹⁴ 6d⁸ 7s²' },
  { atomicNumber: 111, symbol: 'Rg', name: 'Roentgenium',   atomicWeight: 280,      period: 7, group: 11,   xPos: 10, yPos: 6, category: 'unknown',             meltingPoint: null,  boilingPoint: null,  density: 28.7,     electronConfig: '[Rn] 5f¹⁴ 6d⁹ 7s²' },
  { atomicNumber: 112, symbol: 'Cn', name: 'Copernicium',   atomicWeight: 285,      period: 7, group: 12,   xPos: 11, yPos: 6, category: 'post-transition-metal', meltingPoint: null,  boilingPoint: null,  density: 23.7,     electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s²' },
  { atomicNumber: 113, symbol: 'Nh', name: 'Nihonium',      atomicWeight: 284,      period: 7, group: 13,   xPos: 12, yPos: 6, category: 'unknown',             meltingPoint: 700,   boilingPoint: 1430,  density: 16.0,     electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹' },
  { atomicNumber: 114, symbol: 'Fl', name: 'Flerovium',     atomicWeight: 289,      period: 7, group: 14,   xPos: 13, yPos: 6, category: 'unknown',             meltingPoint: null,  boilingPoint: null,  density: 14.0,     electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²' },
  { atomicNumber: 115, symbol: 'Mc', name: 'Moscovium',     atomicWeight: 288,      period: 7, group: 15,   xPos: 14, yPos: 6, category: 'unknown',             meltingPoint: 670,   boilingPoint: 1400,  density: 13.5,     electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³' },
  { atomicNumber: 116, symbol: 'Lv', name: 'Livermorium',   atomicWeight: 293,      period: 7, group: 16,   xPos: 15, yPos: 6, category: 'unknown',             meltingPoint: 709,   boilingPoint: 1085,  density: 12.9,     electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴' },
  { atomicNumber: 117, symbol: 'Ts', name: 'Tennessine',    atomicWeight: 294,      period: 7, group: 17,   xPos: 16, yPos: 6, category: 'unknown',             meltingPoint: 723,   boilingPoint: 883,   density: 7.17,     electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵' },
  { atomicNumber: 118, symbol: 'Og', name: 'Oganesson',     atomicWeight: 294,      period: 7, group: 18,   xPos: 17, yPos: 6, category: 'unknown',             meltingPoint: 325,   boilingPoint: 450,   density: 4.95,     electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶' },
]
