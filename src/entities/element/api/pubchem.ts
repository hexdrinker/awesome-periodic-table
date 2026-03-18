import { httpClient } from '../../../shared/api/http-client'

export interface PubChemPeriodicTableResponse {
  Table: {
    Columns: {
      Column: string[]
    }
    Row: Array<{
      Cell: string[]
    }>
  }
}

export interface PubChemStringValue {
  StringWithMarkup?: Array<{
    String: string
  }>
}

export interface PubChemInformation {
  Name?: string
  Value?: PubChemStringValue
}

export interface PubChemSection {
  TOCHeading?: string
  Description?: string
  Information?: PubChemInformation[]
  Section?: PubChemSection[]
}

export interface PubChemElementDetailResponse {
  Record: {
    RecordNumber: number
    RecordTitle: string
    Section?: PubChemSection[]
  }
}

export async function fetchPeriodicTable() {
  return httpClient
    .get('rest/pug/periodictable/JSON')
    .json<PubChemPeriodicTableResponse>()
}

export async function fetchElementDetail(atomicNumber: number) {
  return httpClient
    .get(`rest/pug_view/data/element/${atomicNumber}/JSON`)
    .json<PubChemElementDetailResponse>()
}
