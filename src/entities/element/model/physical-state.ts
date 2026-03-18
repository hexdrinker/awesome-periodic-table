import type { Element } from './elements'

export type PhysicalState = 'solid' | 'liquid' | 'gas'
export type ElementPhysicalState = PhysicalState | 'unknown'

export const PHYSICAL_STATES: PhysicalState[] = ['solid', 'liquid', 'gas']
export const DEFAULT_FILTER_TEMPERATURE_K = 298

export function getElementStateAtTemperature(
  element: Pick<Element, 'meltingPoint' | 'boilingPoint' | 'standardState'>,
  temperatureK: number,
): ElementPhysicalState {
  const meltingPoint = element.meltingPoint
  const boilingPoint = element.boilingPoint

  if (meltingPoint != null && temperatureK < meltingPoint) {
    return 'solid'
  }

  if (boilingPoint != null && temperatureK >= boilingPoint) {
    return 'gas'
  }

  if (meltingPoint != null && boilingPoint != null) {
    return 'liquid'
  }

  if (isNearRoomTemperature(temperatureK)) {
    return normalizeStandardState(element.standardState)
  }

  return 'unknown'
}

function normalizeStandardState(standardState: string | null): ElementPhysicalState {
  const normalized = standardState?.trim().toLowerCase()

  if (!normalized) {
    return 'unknown'
  }

  if (normalized.includes('solid')) {
    return 'solid'
  }

  if (normalized.includes('liquid')) {
    return 'liquid'
  }

  if (normalized.includes('gas')) {
    return 'gas'
  }

  return 'unknown'
}

function isNearRoomTemperature(temperatureK: number) {
  return Math.abs(temperatureK - DEFAULT_FILTER_TEMPERATURE_K) <= 12
}
