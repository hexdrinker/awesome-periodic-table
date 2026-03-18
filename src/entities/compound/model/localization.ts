import { CURATED_COMPOUNDS } from '@/entities/compound/model/curated'
import type { AppLanguage } from '@/shared/model/app-store'

const localizedNameMap = new Map<string, { englishName: string; koreanName: string }>()

for (const entry of CURATED_COMPOUNDS) {
  const labels = [entry.englishName, entry.query, ...(entry.aliases ?? [])]

  for (const label of labels) {
    localizedNameMap.set(normalizeCompoundLabel(label), {
      englishName: entry.englishName,
      koreanName: entry.koreanName,
    })
  }
}

export function getLocalizedCompoundDisplay(
  title: string,
  language: AppLanguage,
  localizationKey?: string,
) {
  if (language !== 'ko') {
    return {
      primaryName: title,
      secondaryName: null,
    }
  }

  const byKey = localizationKey
    ? CURATED_COMPOUNDS.find((entry) => entry.key === localizationKey)
    : null
  const localizedEntry =
    byKey ??
    localizedNameMap.get(normalizeCompoundLabel(title))

  if (!localizedEntry) {
    return {
      primaryName: title,
      secondaryName: null,
    }
  }

  return {
    primaryName: localizedEntry.koreanName,
    secondaryName: localizedEntry.englishName,
  }
}

function normalizeCompoundLabel(label: string) {
  return label.trim().toLowerCase().replace(/\s+/g, ' ')
}
