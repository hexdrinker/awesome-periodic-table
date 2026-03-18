export type { CompoundDetail, CompoundSearchResult } from '@/entities/compound/model/compound'
export { getCompoundInsight } from '@/entities/compound/model/detail-content'
export { getLocalizedCompoundDisplay } from '@/entities/compound/model/localization'
export { buildMoleculeModel } from '@/entities/compound/model/structure'
export {
  useCompoundDetailQuery,
  useCompoundPageQuery,
} from '@/entities/compound/model/queries'
