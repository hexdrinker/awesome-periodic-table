export interface CompoundSearchResult {
  cid: number
  title: string
  molecularFormula: string | null
  molecularWeight: string | null
  iupacName: string | null
  canonicalSmiles: string | null
  localizationKey?: string
}

export interface CompoundDetail extends CompoundSearchResult {
  synonyms: string[]
}
