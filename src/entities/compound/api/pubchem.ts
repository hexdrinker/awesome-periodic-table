import { httpClient } from '@/shared/api/http-client'

export interface PubChemCompoundPropertyResponse {
  PropertyTable?: {
    Properties?: Array<{
      CID: number
      Title?: string
      MolecularFormula?: string
      MolecularWeight?: string
      IUPACName?: string
      CanonicalSMILES?: string
      ConnectivitySMILES?: string
    }>
  }
}

export interface PubChemCompoundSynonymsResponse {
  InformationList?: {
    Information?: Array<{
      CID: number
      Synonym?: string[]
    }>
  }
}

const COMPOUND_PROPERTY_FIELDS = [
  'Title',
  'MolecularFormula',
  'MolecularWeight',
  'IUPACName',
  'ConnectivitySMILES',
].join(',')

async function fetchCompoundProperties(path: string) {
  const response = await httpClient.get(path, {
    throwHttpErrors: false,
  })

  if (response.status === 404) {
    return { PropertyTable: { Properties: [] } } satisfies PubChemCompoundPropertyResponse
  }

  return response.json<PubChemCompoundPropertyResponse>()
}

export async function fetchCompoundsByCid(cids: number[]) {
  if (cids.length === 0) {
    return { PropertyTable: { Properties: [] } } satisfies PubChemCompoundPropertyResponse
  }

  return fetchCompoundProperties(
    `rest/pug/compound/cid/${cids.join(',')}/property/${COMPOUND_PROPERTY_FIELDS}/JSON`,
  )
}

export async function fetchCompoundSynonymsByCid(cid: number) {
  const response = await httpClient.get(`rest/pug/compound/cid/${cid}/synonyms/JSON`, {
    throwHttpErrors: false,
  })

  if (response.status === 404) {
    return { InformationList: { Information: [] } } satisfies PubChemCompoundSynonymsResponse
  }

  return response.json<PubChemCompoundSynonymsResponse>()
}
