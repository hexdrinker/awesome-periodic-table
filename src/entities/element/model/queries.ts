import { useQuery } from '@tanstack/react-query'
import { fetchElementDetail, fetchPeriodicTable } from '@/entities/element/api/pubchem'
import { mapElementDetailResponse, mapPeriodicTableResponse } from './mappers'

export const elementQueryKeys = {
  all: ['elements'] as const,
  list: () => [...elementQueryKeys.all, 'list'] as const,
  detail: (atomicNumber: number) =>
    [...elementQueryKeys.all, 'detail', atomicNumber] as const,
}

export function usePeriodicTableQuery() {
  return useQuery({
    queryKey: elementQueryKeys.list(),
    queryFn: async () => mapPeriodicTableResponse(await fetchPeriodicTable()),
    staleTime: Infinity,
  })
}

export function useElementDetailQuery(atomicNumber: number | null | undefined) {
  return useQuery({
    queryKey: elementQueryKeys.detail(atomicNumber ?? 0),
    queryFn: async () => mapElementDetailResponse(await fetchElementDetail(atomicNumber ?? 0)),
    enabled: atomicNumber != null,
    staleTime: Infinity,
  })
}
