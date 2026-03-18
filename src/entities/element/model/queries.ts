import { useQuery } from '@tanstack/react-query'
import { fetchElementDetail, fetchPeriodicTable } from '@/entities/element/api/pubchem'
import { fetchWikipediaElementSummary } from '@/entities/element/api/wikipedia'
import type { AppLanguage } from '@/shared'
import { mapElementDetailResponse, mapPeriodicTableResponse } from './mappers'

export const elementQueryKeys = {
  all: ['elements'] as const,
  list: () => [...elementQueryKeys.all, 'list'] as const,
  detail: (atomicNumber: number, language: AppLanguage) =>
    [...elementQueryKeys.all, 'detail', atomicNumber, language] as const,
}

export function usePeriodicTableQuery() {
  return useQuery({
    queryKey: elementQueryKeys.list(),
    queryFn: async () => mapPeriodicTableResponse(await fetchPeriodicTable()),
    staleTime: Infinity,
  })
}

export function useElementDetailQuery(
  atomicNumber: number | null | undefined,
  language: AppLanguage,
) {
  return useQuery({
    queryKey: elementQueryKeys.detail(atomicNumber ?? 0, language),
    queryFn: async () => {
      const detail = mapElementDetailResponse(await fetchElementDetail(atomicNumber ?? 0))

      try {
        const summary = await fetchWikipediaElementSummary(detail.name, language)

        if (summary) {
          return {
            ...detail,
            physicalDescription: summary.text,
            physicalDescriptionSource: 'wikipedia' as const,
            physicalDescriptionUrl: summary.url,
          }
        }
      } catch {
        // Keep PubChem data when Wikipedia is unavailable.
      }

      return detail
    },
    enabled: atomicNumber != null,
    staleTime: Infinity,
  })
}
