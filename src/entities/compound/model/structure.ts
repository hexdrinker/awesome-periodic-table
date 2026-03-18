const DEFAULT_BOND_LENGTH = 1.45

const ELEMENT_SYMBOLS = new Set([
  'H',
  'He',
  'Li',
  'Be',
  'B',
  'C',
  'N',
  'O',
  'F',
  'Ne',
  'Na',
  'Mg',
  'Al',
  'Si',
  'P',
  'S',
  'Cl',
  'Ar',
  'K',
  'Ca',
  'Br',
  'I',
  'Ti',
  'Fe',
  'Cu',
  'Zn',
  'Ba',
]) as Set<string>

const AROMATIC_SYMBOLS: Record<string, string> = {
  b: 'B',
  c: 'C',
  n: 'N',
  o: 'O',
  p: 'P',
  s: 'S',
}

type Vector3 = [number, number, number]

interface ParsedAtom {
  aromatic: boolean
  index: number
  symbol: string
}

interface ParsedBond {
  from: number
  order: number
  to: number
}

export interface MoleculeAtom {
  aromatic: boolean
  index: number
  position: Vector3
  symbol: string
}

export interface MoleculeBond {
  from: number
  order: number
  to: number
}

export interface MoleculeModel {
  atoms: MoleculeAtom[]
  bonds: MoleculeBond[]
  stats: {
    atomCount: number
    bondCount: number
    fragmentCount: number
    multipleBondCount: number
    ringCount: number
    uniqueElements: string[]
  }
}

export function buildMoleculeModel(
  canonicalSmiles: string | null | undefined,
  molecularFormula: string | null | undefined,
) {
  const parsed = canonicalSmiles ? parseSmiles(canonicalSmiles) : null

  if (parsed && parsed.atoms.length > 0) {
    const enriched = enrichWithFormulaHydrogens(parsed.atoms, parsed.bonds, molecularFormula)
    return createModel(enriched.atoms, enriched.bonds)
  }

  const fallback = createFormulaFallback(molecularFormula)

  if (fallback.atoms.length > 0) {
    return createModel(fallback.atoms, fallback.bonds)
  }

  return createModel(
    [
      { aromatic: false, index: 0, symbol: 'C' },
      { aromatic: false, index: 1, symbol: 'O' },
      { aromatic: false, index: 2, symbol: 'H' },
    ],
    [
      { from: 0, order: 1, to: 1 },
      { from: 0, order: 1, to: 2 },
    ],
  )
}

function createModel(atoms: ParsedAtom[], bonds: ParsedBond[]): MoleculeModel {
  const positions = layoutAtoms(atoms, bonds)
  const fragments = countFragments(atoms.length, bonds)
  const ringCount = Math.max(0, bonds.length - atoms.length + fragments)
  const uniqueElements = Array.from(new Set(atoms.map((atom) => atom.symbol))).sort()

  return {
    atoms: atoms.map((atom, index) => ({
      aromatic: atom.aromatic,
      index: atom.index,
      position: positions[index],
      symbol: atom.symbol,
    })),
    bonds,
    stats: {
      atomCount: atoms.length,
      bondCount: bonds.length,
      fragmentCount: fragments,
      multipleBondCount: bonds.filter((bond) => bond.order > 1).length,
      ringCount,
      uniqueElements,
    },
  }
}

function parseSmiles(smiles: string) {
  const atoms: ParsedAtom[] = []
  const bonds: ParsedBond[] = []
  const branchStack: number[] = []
  const ringClosures = new Map<string, { atomIndex: number; order: number | null }>()

  let cursor = 0
  let currentAtomIndex: number | null = null
  let pendingBondOrder: number | null = null

  while (cursor < smiles.length) {
    const char = smiles[cursor]

    if (char === '(') {
      if (currentAtomIndex != null) {
        branchStack.push(currentAtomIndex)
      }
      cursor += 1
      continue
    }

    if (char === ')') {
      currentAtomIndex = branchStack.pop() ?? currentAtomIndex
      cursor += 1
      continue
    }

    if (char === '.') {
      currentAtomIndex = null
      pendingBondOrder = null
      cursor += 1
      continue
    }

    if (char in BOND_ORDERS) {
      pendingBondOrder = BOND_ORDERS[char as keyof typeof BOND_ORDERS]
      cursor += 1
      continue
    }

    if (char === '%') {
      const token = smiles.slice(cursor, cursor + 3)
      handleRingToken(token)
      cursor += 3
      continue
    }

    if (/\d/.test(char)) {
      handleRingToken(char)
      cursor += 1
      continue
    }

    if (char === '[') {
      const closingIndex = smiles.indexOf(']', cursor)
      if (closingIndex === -1) {
        break
      }

      const token = smiles.slice(cursor + 1, closingIndex)
      appendAtom(readBracketAtom(token))
      cursor = closingIndex + 1
      continue
    }

    const atomToken = readBareAtom(smiles, cursor)

    if (atomToken) {
      appendAtom(atomToken.atom)
      cursor = atomToken.nextIndex
      continue
    }

    cursor += 1
  }

  return { atoms, bonds }

  function appendAtom(atom: Omit<ParsedAtom, 'index'> | null) {
    if (!atom) {
      pendingBondOrder = null
      return
    }

    const nextAtom: ParsedAtom = { ...atom, index: atoms.length }
    atoms.push(nextAtom)

    if (currentAtomIndex != null) {
      bonds.push({
        from: currentAtomIndex,
        order: pendingBondOrder ?? inferBondOrder(atoms[currentAtomIndex], nextAtom),
        to: nextAtom.index,
      })
    }

    currentAtomIndex = nextAtom.index
    pendingBondOrder = null
  }

  function handleRingToken(token: string) {
    if (currentAtomIndex == null) {
      pendingBondOrder = null
      return
    }

    const existing = ringClosures.get(token)

    if (existing) {
      bonds.push({
        from: existing.atomIndex,
        order:
          pendingBondOrder ?? existing.order ?? inferBondOrder(atoms[existing.atomIndex], atoms[currentAtomIndex]),
        to: currentAtomIndex,
      })
      ringClosures.delete(token)
    } else {
      ringClosures.set(token, { atomIndex: currentAtomIndex, order: pendingBondOrder })
    }

    pendingBondOrder = null
  }
}

function readBracketAtom(token: string): Omit<ParsedAtom, 'index'> | null {
  const match = token.match(/([A-Z][a-z]?|[bcnops])/)

  if (!match) {
    return null
  }

  const raw = match[1]
  const aromatic = raw === raw.toLowerCase()
  return {
    aromatic,
    symbol: aromatic ? AROMATIC_SYMBOLS[raw] ?? raw.toUpperCase() : raw,
  }
}

function readBareAtom(smiles: string, cursor: number) {
  const pair = smiles.slice(cursor, cursor + 2)

  if (ELEMENT_SYMBOLS.has(pair)) {
    return {
      atom: { aromatic: false, symbol: pair },
      nextIndex: cursor + 2,
    }
  }

  const single = smiles[cursor]

  if (AROMATIC_SYMBOLS[single]) {
    return {
      atom: { aromatic: true, symbol: AROMATIC_SYMBOLS[single] },
      nextIndex: cursor + 1,
    }
  }

  if (ELEMENT_SYMBOLS.has(single)) {
    return {
      atom: { aromatic: false, symbol: single },
      nextIndex: cursor + 1,
    }
  }

  return null
}

function inferBondOrder(left: ParsedAtom, right: ParsedAtom) {
  return left.aromatic && right.aromatic ? 1.5 : 1
}

function createFormulaFallback(molecularFormula: string | null | undefined) {
  const parts = parseFormula(molecularFormula)

  if (parts.length === 0) {
    return { atoms: [], bonds: [] }
  }

  const cappedParts = parts.map(({ count, symbol }) => ({
    count: Math.min(count, 6),
    symbol,
  }))
  const heavyEntries = cappedParts.filter(({ symbol }) => symbol !== 'H')

  if (heavyEntries.length === 0) {
    const hydrogenCount = cappedParts.find(({ symbol }) => symbol === 'H')?.count ?? 0
    const atoms = Array.from({ length: hydrogenCount }, (_, index) => ({
      aromatic: false,
      index,
      symbol: 'H',
    })) satisfies ParsedAtom[]
    const bonds = atoms.slice(1).map((atom, index) => ({
      from: index,
      order: 1,
      to: atom.index,
    })) satisfies ParsedBond[]

    return { atoms, bonds }
  }

  const atoms: ParsedAtom[] = []
  const bonds: ParsedBond[] = []

  heavyEntries.forEach(({ count, symbol }) => {
    for (let index = 0; index < count; index += 1) {
      atoms.push({ aromatic: false, index: atoms.length, symbol })
    }
  })

  if (atoms.length === 1) {
    return enrichWithFormulaHydrogens(atoms, bonds, molecularFormula)
  }

  const hostState = atoms.map((atom, index) => ({
    available: getPreferredValence(atom.symbol, atom.aromatic),
    index,
    priority: getSkeletonHostPriority(atom.symbol),
  }))
  const connected = new Set<number>()
  const root = [...hostState].sort(
    (left, right) => right.priority - left.priority || right.available - left.available,
  )[0]

  connected.add(root.index)
  hostState[root.index].available = Math.max(0, hostState[root.index].available)

  while (connected.size < atoms.length) {
    const nextAtom = hostState
      .filter((candidate) => !connected.has(candidate.index))
      .sort((left, right) => right.priority - left.priority || right.available - left.available)[0]

    const host = hostState
      .filter((candidate) => connected.has(candidate.index) && candidate.available > 0)
      .sort((left, right) => right.priority - left.priority || right.available - left.available)[0]

    if (!nextAtom || !host) {
      break
    }

    bonds.push({ from: host.index, order: 1, to: nextAtom.index })
    host.available = Math.max(0, host.available - 1)
    hostState[nextAtom.index].available = Math.max(0, hostState[nextAtom.index].available - 1)
    connected.add(nextAtom.index)
  }

  return enrichWithFormulaHydrogens(atoms, bonds, molecularFormula)
}

function enrichWithFormulaHydrogens(
  atoms: ParsedAtom[],
  bonds: ParsedBond[],
  molecularFormula: string | null | undefined,
) {
  const formulaParts = parseFormula(molecularFormula)

  if (formulaParts.length === 0) {
    return { atoms, bonds }
  }

  const formulaCounts = new Map<string, number>()
  const atomCounts = new Map<string, number>()

  formulaParts.forEach(({ count, symbol }) => {
    formulaCounts.set(symbol, (formulaCounts.get(symbol) ?? 0) + count)
  })

  atoms.forEach((atom) => {
    atomCounts.set(atom.symbol, (atomCounts.get(atom.symbol) ?? 0) + 1)
  })

  const missingHydrogenCount = Math.max(0, (formulaCounts.get('H') ?? 0) - (atomCounts.get('H') ?? 0))

  if (missingHydrogenCount === 0) {
    return { atoms, bonds }
  }

  const nextAtoms = atoms.map((atom) => ({ ...atom }))
  const nextBonds = [...bonds]
  const explicitBondOrders = nextAtoms.map(() => 0)

  nextBonds.forEach((bond) => {
    explicitBondOrders[bond.from] += bond.order
    explicitBondOrders[bond.to] += bond.order
  })

  const hydrogenHosts = nextAtoms
    .map((atom, index) => ({
      available: Math.max(0, getPreferredValence(atom.symbol, atom.aromatic) - explicitBondOrders[index]),
      index,
      priority: getHydrogenHostPriority(atom.symbol),
    }))
    .filter((candidate) => candidate.available > 0)
    .sort((left, right) => right.priority - left.priority || right.available - left.available)

  let hydrogensToAdd = missingHydrogenCount

  for (const host of hydrogenHosts) {
    while (host.available > 0 && hydrogensToAdd > 0) {
      const hydrogenIndex = nextAtoms.length
      nextAtoms.push({ aromatic: false, index: hydrogenIndex, symbol: 'H' })
      nextBonds.push({ from: host.index, order: 1, to: hydrogenIndex })
      host.available -= 1
      hydrogensToAdd -= 1
    }

    if (hydrogensToAdd === 0) {
      break
    }
  }

  return { atoms: nextAtoms, bonds: nextBonds }
}

function parseFormula(formula: string | null | undefined) {
  if (!formula) {
    return []
  }

  const matches = formula.matchAll(/([A-Z][a-z]?)(\d*)/g)
  const parts: Array<{ count: number; symbol: string }> = []

  for (const match of matches) {
    const symbol = match[1]
    const count = Number(match[2] || '1')

    if (!Number.isFinite(count) || count <= 0) {
      continue
    }

    parts.push({ count, symbol })
  }

  return parts
}

function getPreferredValence(symbol: string, aromatic: boolean) {
  if (aromatic && (symbol === 'C' || symbol === 'N' || symbol === 'P')) {
    return 3
  }

  switch (symbol) {
    case 'H':
    case 'F':
    case 'Cl':
    case 'Br':
    case 'I':
      return 1
    case 'O':
    case 'S':
      return 2
    case 'N':
    case 'P':
      return 3
    case 'B':
      return 3
    case 'C':
    case 'Si':
      return 4
    default:
      return 2
  }
}

function getHydrogenHostPriority(symbol: string) {
  switch (symbol) {
    case 'O':
      return 6
    case 'N':
      return 5
    case 'S':
      return 4
    case 'P':
      return 4
    case 'C':
      return 3
    case 'Si':
      return 3
    default:
      return 1
  }
}

function getSkeletonHostPriority(symbol: string) {
  switch (symbol) {
    case 'C':
    case 'Si':
      return 6
    case 'N':
    case 'P':
      return 5
    case 'S':
      return 4
    case 'O':
      return 3
    default:
      return 2
  }
}

function layoutAtoms(atoms: ParsedAtom[], bonds: ParsedBond[]) {
  const positions = atoms.map<Vector3>((_, index) => {
    const angle = index * GOLDEN_ANGLE
    return [Math.cos(angle) * 2.4, (index % 5) * 0.7 - 1.4, Math.sin(angle) * 2.4]
  })

  for (let step = 0; step < 140; step += 1) {
    const forces = atoms.map<Vector3>(() => [0, 0, 0])

    for (let left = 0; left < atoms.length; left += 1) {
      for (let right = left + 1; right < atoms.length; right += 1) {
        const delta = subtract(positions[left], positions[right])
        const distance = Math.max(length(delta), 0.001)
        const magnitude = 0.055 / (distance * distance)
        const direction = scale(delta, 1 / distance)
        const repulsion = scale(direction, magnitude)

        forces[left] = add(forces[left], repulsion)
        forces[right] = subtract(forces[right], repulsion)
      }
    }

    for (const bond of bonds) {
      const delta = subtract(positions[bond.to], positions[bond.from])
      const distance = Math.max(length(delta), 0.001)
      const restLength =
        bond.order >= 3 ? DEFAULT_BOND_LENGTH * 0.82 : bond.order > 1 ? DEFAULT_BOND_LENGTH * 0.9 : DEFAULT_BOND_LENGTH
      const stretch = distance - restLength
      const direction = scale(delta, 1 / distance)
      const spring = scale(direction, stretch * 0.09)

      forces[bond.from] = add(forces[bond.from], spring)
      forces[bond.to] = subtract(forces[bond.to], spring)
    }

    for (let index = 0; index < positions.length; index += 1) {
      const gravity = scale(positions[index], -0.014)
      const nextForce = add(forces[index], gravity)
      positions[index] = add(positions[index], scale(clampVector(nextForce, 0.28), 0.65))
    }
  }

  const centered = centerPositions(positions)
  const maxRadius = centered.reduce((largest, point) => Math.max(largest, length(point)), 0.001)
  const scaleFactor = maxRadius > 3.1 ? 3.1 / maxRadius : 1

  return centered.map((point) => scale(point, scaleFactor))
}

function countFragments(atomCount: number, bonds: ParsedBond[]) {
  if (atomCount === 0) {
    return 0
  }

  const adjacency = Array.from({ length: atomCount }, () => new Set<number>())

  for (const bond of bonds) {
    adjacency[bond.from].add(bond.to)
    adjacency[bond.to].add(bond.from)
  }

  const visited = new Set<number>()
  let fragments = 0

  for (let start = 0; start < atomCount; start += 1) {
    if (visited.has(start)) {
      continue
    }

    fragments += 1
    const stack = [start]
    visited.add(start)

    while (stack.length > 0) {
      const current = stack.pop()

      if (current == null) {
        continue
      }

      adjacency[current].forEach((neighbor) => {
        if (visited.has(neighbor)) {
          return
        }

        visited.add(neighbor)
        stack.push(neighbor)
      })
    }
  }

  return fragments
}

function centerPositions(positions: Vector3[]) {
  const centroid = positions.reduce<Vector3>(
    (accumulator, point) => add(accumulator, point),
    [0, 0, 0],
  )
  const normalizedCentroid = scale(centroid, 1 / Math.max(positions.length, 1))

  return positions.map((point) => subtract(point, normalizedCentroid))
}

function add(left: Vector3, right: Vector3): Vector3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]]
}

function subtract(left: Vector3, right: Vector3): Vector3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]]
}

function scale(vector: Vector3, factor: number): Vector3 {
  return [vector[0] * factor, vector[1] * factor, vector[2] * factor]
}

function length(vector: Vector3) {
  return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2)
}

function clampVector(vector: Vector3, maxLength: number): Vector3 {
  const size = length(vector)

  if (size <= maxLength || size === 0) {
    return vector
  }

  return scale(vector, maxLength / size)
}

const BOND_ORDERS = {
  '-': 1,
  '=': 2,
  '#': 3,
  ':': 1.5,
} as const

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
