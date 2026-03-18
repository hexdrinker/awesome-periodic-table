import { useQuery } from '@tanstack/react-query'
import {
  fetchCompoundSynonymsByCid,
  fetchCompoundsByCid,
} from '@/entities/compound/api/pubchem'
import { CURATED_COMPOUND_CIDS } from '@/entities/compound/model/cids'
import type { CompoundDetail, CompoundSearchResult } from '@/entities/compound/model/compound'
import { getCuratedCompoundPage } from '@/entities/compound/model/curated'

const COMPOUND_PAGE_SIZE = 20

export const compoundQueryKeys = {
  all: ['compounds'] as const,
  page: (page: number, pageSize: number) =>
    [...compoundQueryKeys.all, 'page', page, pageSize] as const,
  detail: (cid: number) => [...compoundQueryKeys.all, 'detail', cid] as const,
}

function mapCompoundProperties(compounds: Array<{
  CID: number
  Title?: string
  MolecularFormula?: string
  MolecularWeight?: string
  IUPACName?: string
  CanonicalSMILES?: string
  ConnectivitySMILES?: string
}>) {
  return compounds.map((compound) => ({
    cid: compound.CID,
    title: compound.Title?.trim() || compound.IUPACName?.trim() || `CID ${compound.CID}`,
    molecularFormula: compound.MolecularFormula?.trim() || null,
    molecularWeight: compound.MolecularWeight?.trim() || null,
    iupacName: compound.IUPACName?.trim() || null,
    canonicalSmiles:
      compound.ConnectivitySMILES?.trim() || compound.CanonicalSMILES?.trim() || null,
  })) satisfies CompoundSearchResult[]
}

function isUsableCompound(compound: CompoundSearchResult) {
  return Boolean(
    compound.title ||
      compound.molecularFormula ||
      compound.molecularWeight ||
      compound.iupacName ||
      compound.canonicalSmiles,
  )
}

export function useCompoundPageQuery(page: number, pageSize = COMPOUND_PAGE_SIZE) {
  return useQuery({
    queryKey: compoundQueryKeys.page(page, pageSize),
    queryFn: async () => {
      const curatedPage = getCuratedCompoundPage(page, pageSize)
      const cids = curatedPage.compounds
        .map((entry) => CURATED_COMPOUND_CIDS[entry.key])
        .filter((cid): cid is number => Number.isInteger(cid) && cid > 0)
      const response = await fetchCompoundsByCid(cids)
      const compoundsByCid = new Map(
        mapCompoundProperties(response.PropertyTable?.Properties ?? [])
          .filter(isUsableCompound)
          .map((compound) => [compound.cid, compound] as const),
      )
      const resolvedCompounds = curatedPage.compounds.flatMap((entry) => {
        const cid = CURATED_COMPOUND_CIDS[entry.key]
        const compound = compoundsByCid.get(cid)

        if (!compound) {
          return []
        }

        return [
          {
            ...compound,
            title: entry.englishName,
            localizationKey: entry.key,
          } satisfies CompoundSearchResult,
        ]
      })

      return {
        compounds: resolvedCompounds,
        hasNextPage: page < curatedPage.totalPages,
        totalCount: curatedPage.totalCount,
        totalPages: curatedPage.totalPages,
      }
    },
    staleTime: Infinity,
  })
}

export function useCompoundDetailQuery(cid: number | null | undefined) {
  return useQuery({
    queryKey: compoundQueryKeys.detail(cid ?? 0),
    queryFn: async () => {
      const [propertiesResponse, synonymsResponse] = await Promise.all([
        fetchCompoundsByCid([cid ?? 0]),
        fetchCompoundSynonymsByCid(cid ?? 0),
      ])

      const compound = mapCompoundProperties(propertiesResponse.PropertyTable?.Properties ?? [])[0]

      if (!compound) {
        return null
      }

      const synonyms =
        synonymsResponse.InformationList?.Information?.[0]?.Synonym
          ?.map((synonym) => synonym.trim())
          .filter(Boolean)
          .slice(0, 10) ?? []

      return {
        ...compound,
        synonyms,
      } satisfies CompoundDetail
    },
    enabled: cid != null,
    staleTime: 1000 * 60 * 10,
  })
}
