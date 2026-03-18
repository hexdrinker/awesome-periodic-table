import type { CompoundDetail } from '@/entities/compound/model/compound'
import type { MoleculeModel } from '@/entities/compound/model/structure'
import type { AppLanguage } from '@/shared/model/app-store'

export interface CompoundInsight {
  highlights: Array<{ label: string; value: string }>
  summary: string
  uses: string[]
}

export function getCompoundInsight(params: {
  compound: CompoundDetail
  displayName: string
  language: AppLanguage
  localizationKey?: string
  model: MoleculeModel
}) {
  const { compound, displayName, language, localizationKey, model } = params
  const override = localizationKey ? COMPOUND_OVERRIDES[localizationKey] : undefined
  const family = inferCompoundFamily(compound)
  const summary = override?.summary?.[language] ?? buildSummary({ compound, displayName, family, language })
  const uses = override?.uses?.[language] ?? family.uses[language]

  return {
    highlights: buildHighlights({ family, language, model }),
    summary,
    uses,
  } satisfies CompoundInsight
}

function buildSummary(params: {
  compound: CompoundDetail
  displayName: string
  family: FamilyProfile
  language: AppLanguage
}) {
  const { compound, displayName, family, language } = params
  const formula = compound.molecularFormula ? ` ${compound.molecularFormula}` : ''
  const weight = compound.molecularWeight
    ? language === 'ko'
      ? `분자량은 ${compound.molecularWeight}입니다.`
      : `Its molecular weight is ${compound.molecularWeight}.`
    : ''

  if (language === 'ko') {
    const iupacSentence = compound.iupacName ? `IUPAC명은 ${compound.iupacName}입니다.` : ''
    return `${displayName}은(는)${formula ? `${formula} 조성을 갖는 ` : ' '} ${family.description.ko} ${weight} ${iupacSentence}`.trim()
  }

  const iupacSentence = compound.iupacName ? `Its IUPAC name is ${compound.iupacName}.` : ''
  return `${displayName} is ${family.description.en}${formula ? ` with the formula ${formula.trim()}` : ''}. ${weight} ${iupacSentence}`.trim()
}

function buildHighlights(params: {
  family: FamilyProfile
  language: AppLanguage
  model: MoleculeModel
}) {
  const { family, language, model } = params
  const topology =
    model.stats.ringCount > 0
      ? language === 'ko'
        ? `고리 ${model.stats.ringCount} · 다중 결합 ${model.stats.multipleBondCount}`
        : `${model.stats.ringCount} ring · ${model.stats.multipleBondCount} multiple bonds`
      : language === 'ko'
        ? `사슬형 · 다중 결합 ${model.stats.multipleBondCount}`
        : `chain-like · ${model.stats.multipleBondCount} multiple bonds`

  return [
    {
      label: language === 'ko' ? '분류' : 'Family',
      value: family.label[language],
    },
    {
      label: language === 'ko' ? '원소 구성' : 'Elements',
      value: model.stats.uniqueElements.join(' · '),
    },
    {
      label: language === 'ko' ? '구조 특징' : 'Topology',
      value: topology,
    },
  ]
}

type FamilyProfile = {
  description: Record<AppLanguage, string>
  label: Record<AppLanguage, string>
  uses: Record<AppLanguage, string[]>
}

function inferCompoundFamily(compound: CompoundDetail): FamilyProfile {
  const searchText = `${compound.title} ${compound.iupacName ?? ''}`.toLowerCase()

  for (const rule of FAMILY_RULES) {
    if (rule.match(searchText, compound)) {
      return rule.profile
    }
  }

  return FAMILY_PROFILES.organic
}

const FAMILY_PROFILES = {
  acid: {
    description: {
      en: 'an acidic compound used widely in pH control, synthesis, and industrial processing',
      ko: '산성 성질을 띠며 pH 조절, 합성, 산업 공정에 폭넓게 쓰이는 화합물입니다.',
    },
    label: {
      en: 'Acidic compound',
      ko: '산성 화합물',
    },
    uses: {
      en: [
        'Used as a laboratory reagent for neutralization, etching, or solution preparation.',
        'Acts as a precursor or processing aid in fertilizers, batteries, surface treatment, or materials synthesis.',
        'Often appears in quality control, cleaning, and controlled-reaction workflows.',
      ],
      ko: [
        '중화, 식각, 용액 조제 같은 실험실 시약 용도로 자주 사용됩니다.',
        '비료, 배터리, 표면 처리, 소재 합성 공정의 원료나 보조제로 활용됩니다.',
        '세정, 품질 관리, 반응 조건 제어가 필요한 산업 공정에서 널리 쓰입니다.',
      ],
    },
  },
  alcohol: {
    description: {
      en: 'an alcohol or polyol that serves as a versatile solvent and process intermediate',
      ko: '용매와 공정 중간체로 널리 쓰이는 알코올 또는 폴리올 계열 화합물입니다.',
    },
    label: {
      en: 'Alcohol / polyol',
      ko: '알코올 / 폴리올',
    },
    uses: {
      en: [
        'Frequently used as a solvent in extraction, cleaning, coating, and formulation work.',
        'Appears in disinfecting, preservation, antifreeze, or moisture-control products depending on the specific molecule.',
        'Acts as a feedstock in esterification, polymer, and pharmaceutical synthesis routes.',
      ],
      ko: [
        '추출, 세정, 코팅, 제형화 공정에서 용매로 자주 사용됩니다.',
        '분자 종류에 따라 소독, 보존, 부동, 보습 관련 제품에 활용됩니다.',
        '에스터화, 고분자 합성, 의약 합성의 출발 원료나 중간체로 쓰입니다.',
      ],
    },
  },
  amine: {
    description: {
      en: 'a nitrogen-containing molecule known for strong reactivity and broad industrial utility',
      ko: '질소를 포함하며 반응성이 뚜렷하고 산업적 활용도가 높은 화합물입니다.',
    },
    label: {
      en: 'Nitrogen compound',
      ko: '질소계 화합물',
    },
    uses: {
      en: [
        'Used in fertilizers, cleaning systems, and gas treatment or refrigeration processes.',
        'Acts as a building block in resins, fibers, explosives, and pharmaceutical intermediates.',
        'Important in analytical chemistry because its basicity and coordination behavior are easy to track.',
      ],
      ko: [
        '비료, 세정 시스템, 가스 처리, 냉각 공정 등에 활용됩니다.',
        '수지, 섬유, 폭약, 의약 중간체 제조의 기본 빌딩블록이 됩니다.',
        '염기성과 배위 특성이 뚜렷해 분석화학과 반응 연구에서도 중요합니다.',
      ],
    },
  },
  aromatic: {
    description: {
      en: 'an aromatic organic compound with a ring-centered electron system',
      ko: '고리형 전자 구조를 가진 방향족 유기 화합물입니다.',
    },
    label: {
      en: 'Aromatic compound',
      ko: '방향족 화합물',
    },
    uses: {
      en: [
        'Commonly used as a solvent, fragrance precursor, additive, or reaction intermediate.',
        'Provides stable ring chemistry for dyes, polymers, pharmaceuticals, and fine chemicals.',
        'Frequently appears in spectroscopy and organic synthesis education because ring effects are easy to observe.',
      ],
      ko: [
        '용매, 향료 전구체, 첨가제, 반응 중간체로 널리 활용됩니다.',
        '안정한 고리 구조 덕분에 염료, 고분자, 의약, 정밀화학 분야의 기초 원료가 됩니다.',
        '고리 효과를 관찰하기 좋아 분광학과 유기합성 교육용 사례로도 자주 등장합니다.',
      ],
    },
  },
  bioactive: {
    description: {
      en: 'a bioactive organic molecule often discussed in medicine, food science, or physiology',
      ko: '의약, 식품과학, 생리학에서 자주 다뤄지는 생리활성 유기 화합물입니다.',
    },
    label: {
      en: 'Bioactive molecule',
      ko: '생리활성 분자',
    },
    uses: {
      en: [
        'Studied as an active ingredient, biomarker, or receptor-active molecule in health-related research.',
        'Used in pharmaceutical formulation, analytical assays, or food and cosmetic applications depending on the compound.',
        'Important for explaining how small molecular changes alter potency, metabolism, and safety.',
      ],
      ko: [
        '유효성분, 바이오마커, 수용체 작용 분자로서 보건·의약 연구에 활용됩니다.',
        '화합물에 따라 의약 제형, 분석 시험, 식품 또는 화장품 분야에서 사용됩니다.',
        '작은 구조 차이가 효능, 대사, 안전성에 어떤 영향을 주는지 설명하는 대표 사례가 됩니다.',
      ],
    },
  },
  carbohydrate: {
    description: {
      en: 'a carbohydrate or polyhydroxy compound involved in energy storage, taste, or moisture balance',
      ko: '에너지 저장, 감미, 보습과 관련된 탄수화물 또는 다가 알코올 계열 화합물입니다.',
    },
    label: {
      en: 'Carbohydrate family',
      ko: '탄수화물 계열',
    },
    uses: {
      en: [
        'Used in food systems as a sweetener, texture modifier, or fermentation substrate.',
        'Important in biochemistry and metabolism studies because it connects directly to cellular energy flow.',
        'Appears in pharmaceuticals and cosmetics for stabilization, moisture retention, or formulation control.',
      ],
      ko: [
        '식품에서 감미료, 질감 조절제, 발효 기질로 활용됩니다.',
        '세포 에너지 흐름과 직접 연결돼 생화학·대사 연구에서 중요합니다.',
        '보습, 안정화, 제형 조절 목적으로 의약품과 화장품에도 사용됩니다.',
      ],
    },
  },
  gasFeedstock: {
    description: {
      en: 'a small molecule that plays a major role in combustion, gas handling, or chemical feedstock chains',
      ko: '연소, 가스 처리, 화학 원료 공급망에서 중요한 역할을 하는 소분자 화합물입니다.',
    },
    label: {
      en: 'Small-molecule feedstock',
      ko: '소분자 원료',
    },
    uses: {
      en: [
        'Widely used as a fuel, process gas, or platform feedstock in large-scale chemical production.',
        'Important in environmental monitoring because emissions and concentration shifts are easy to measure.',
        'Common in teaching because bonding geometry and oxidation state changes are visually clear.',
      ],
      ko: [
        '연료, 공정 가스, 대규모 화학 생산의 플랫폼 원료로 널리 쓰입니다.',
        '배출량과 농도 변화를 측정하기 쉬워 환경 모니터링에서도 중요합니다.',
        '결합 기하와 산화수 변화를 설명하기 쉬워 교육용 사례로 자주 쓰입니다.',
      ],
    },
  },
  inorganic: {
    description: {
      en: 'an inorganic salt or oxide valued for stability, ionic behavior, and process compatibility',
      ko: '안정성, 이온성, 공정 적합성이 뛰어난 무기 염 또는 산화물 계열 화합물입니다.',
    },
    label: {
      en: 'Inorganic salt / oxide',
      ko: '무기 염 / 산화물',
    },
    uses: {
      en: [
        'Used in water treatment, drying, buffering, mineral processing, and general laboratory work.',
        'Acts as a precursor, filler, pigment, or functional additive in materials manufacturing.',
        'Helpful for teaching ionic interactions, solubility, and crystal-driven properties.',
      ],
      ko: [
        '수처리, 건조, 완충, 광물 공정, 일반 실험실 작업에 폭넓게 쓰입니다.',
        '소재 제조에서 전구체, 충전재, 안료, 기능성 첨가제로 활용됩니다.',
        '이온 상호작용, 용해도, 결정성 물성을 설명하는 교육용 예시로도 적합합니다.',
      ],
    },
  },
  organic: {
    description: {
      en: 'an organic compound that can be interpreted through its bonding pattern and functional groups',
      ko: '결합 패턴과 작용기를 통해 성질을 읽을 수 있는 유기 화합물입니다.',
    },
    label: {
      en: 'Organic compound',
      ko: '유기 화합물',
    },
    uses: {
      en: [
        'Typically used as a solvent, intermediate, additive, or reference material depending on the functional groups present.',
        'Useful in synthesis planning because structure changes can be mapped directly to reactivity shifts.',
        'Often appears in education and analytics as a clean example of connectivity-driven behavior.',
      ],
      ko: [
        '작용기에 따라 용매, 중간체, 첨가제, 표준물질 등으로 활용됩니다.',
        '구조 변화가 반응성 변화로 바로 이어져 합성 설계와 반응 해석에 유용합니다.',
        '연결 구조와 성질의 관계를 보여주기 좋아 교육과 분석 분야에서 자주 쓰입니다.',
      ],
    },
  },
  peroxide: {
    description: {
      en: 'an oxygen-rich oxidizing compound known for strong bleaching and disinfection chemistry',
      ko: '산소 함량이 높고 표백·살균 반응성이 큰 산화성 화합물입니다.',
    },
    label: {
      en: 'Oxidizing peroxide',
      ko: '과산화물',
    },
    uses: {
      en: [
        'Used for bleaching, sterilization, and controlled oxidation in laboratories and manufacturing.',
        'Appears in environmental and biomedical workflows because it decomposes into reactive oxygen species.',
        'Important for demonstrating how weak peroxide bonds influence storage stability and reactivity.',
      ],
      ko: [
        '실험실과 제조 현장에서 표백, 멸균, 산화 반응 제어 용도로 사용됩니다.',
        '활성 산소종을 만들기 쉬워 환경·생물의학 공정에서도 자주 다뤄집니다.',
        '약한 과산화 결합이 저장 안정성과 반응성에 미치는 영향을 설명하는 대표 사례입니다.',
      ],
    },
  },
  water: {
    description: {
      en: 'the most familiar polar molecule, central to solvation, heat transfer, and life processes',
      ko: '용해, 열 전달, 생명 현상의 중심이 되는 가장 대표적인 극성 분자입니다.',
    },
    label: {
      en: 'Polar molecule',
      ko: '극성 분자',
    },
    uses: {
      en: [
        'Serves as the default solvent for chemistry, biology, and most environmental systems.',
        'Used for cooling, cleaning, extraction, and heat management across nearly every industry.',
        'Essential for explaining hydrogen bonding, polarity, and phase behavior in education.',
      ],
      ko: [
        '화학, 생물, 환경계 전반에서 기본 용매 역할을 합니다.',
        '냉각, 세정, 추출, 열 관리 등 거의 모든 산업에서 활용됩니다.',
        '수소결합, 극성, 상변화를 설명하는 교육용 대표 사례이기도 합니다.',
      ],
    },
  },
} satisfies Record<string, FamilyProfile>

const FAMILY_RULES: Array<{
  match: (searchText: string, compound: CompoundDetail) => boolean
  profile: FamilyProfile
}> = [
  {
    match: (searchText) => searchText.includes('water') || searchText.includes('oxidane'),
    profile: FAMILY_PROFILES.water,
  },
  {
    match: (searchText) => searchText.includes('peroxide'),
    profile: FAMILY_PROFILES.peroxide,
  },
  {
    match: (searchText) => searchText.includes('ammonia'),
    profile: FAMILY_PROFILES.amine,
  },
  {
    match: (searchText) => searchText.includes('acid'),
    profile: FAMILY_PROFILES.acid,
  },
  {
    match: (searchText) =>
      searchText.includes('hydroxide') ||
      searchText.includes('ammonium') ||
      searchText.includes('chloride') ||
      searchText.includes('sulfate') ||
      searchText.includes('nitrate') ||
      searchText.includes('carbonate') ||
      searchText.includes('oxide'),
    profile: FAMILY_PROFILES.inorganic,
  },
  {
    match: (searchText) =>
      searchText.includes('ethanol') ||
      searchText.includes('methanol') ||
      searchText.includes('propanol') ||
      searchText.includes('alcohol') ||
      searchText.includes('glycol') ||
      searchText.includes('glycerol'),
    profile: FAMILY_PROFILES.alcohol,
  },
  {
    match: (searchText) =>
      searchText.includes('glucose') ||
      searchText.includes('fructose') ||
      searchText.includes('sucrose') ||
      searchText.includes('lactose') ||
      searchText.includes('maltose') ||
      searchText.includes('starch') ||
      searchText.includes('cellulose') ||
      searchText.includes('xylitol') ||
      searchText.includes('sorbitol'),
    profile: FAMILY_PROFILES.carbohydrate,
  },
  {
    match: (searchText) =>
      searchText.includes('benzene') ||
      searchText.includes('toluene') ||
      searchText.includes('phenol') ||
      searchText.includes('vanillin') ||
      searchText.includes('salicylic'),
    profile: FAMILY_PROFILES.aromatic,
  },
  {
    match: (searchText) =>
      searchText.includes('aspirin') ||
      searchText.includes('acetaminophen') ||
      searchText.includes('ibuprofen') ||
      searchText.includes('caffeine') ||
      searchText.includes('nicotine') ||
      searchText.includes('capsaicin') ||
      searchText.includes('melatonin') ||
      searchText.includes('dopamine') ||
      searchText.includes('serotonin') ||
      searchText.includes('epinephrine'),
    profile: FAMILY_PROFILES.bioactive,
  },
  {
    match: (searchText, compound) =>
      searchText.includes('methane') ||
      searchText.includes('ethane') ||
      searchText.includes('propane') ||
      searchText.includes('butane') ||
      searchText.includes('ethylene') ||
      searchText.includes('propylene') ||
      searchText.includes('acetylene') ||
      compound.molecularFormula === 'CO2' ||
      compound.molecularFormula === 'CO',
    profile: FAMILY_PROFILES.gasFeedstock,
  },
]

const COMPOUND_OVERRIDES: Record<
  string,
  {
    summary?: Record<AppLanguage, string>
    uses?: Record<AppLanguage, string[]>
  }
> = {
  aspirin: {
    summary: {
      en: 'Aspirin is a well-known analgesic and antiplatelet drug built around an aromatic ring and an acetylated salicylate motif. Its structure is a classic example of how small functional-group changes create major pharmacological effects.',
      ko: '아스피린은 방향족 고리와 아세틸화된 살리실산 골격을 가진 대표적인 진통·해열·항혈소판 약물입니다. 작은 작용기 변화가 약리 효과를 크게 바꾸는 사례로 자주 소개됩니다.',
    },
  },
  caffeine: {
    summary: {
      en: 'Caffeine is a nitrogen-rich heterocycle best known as a stimulant found in coffee, tea, and energy drinks. Its compact fused-ring structure makes it a memorable example of a bioactive small molecule.',
      ko: '카페인은 커피, 차, 에너지 음료에 널리 존재하는 각성 성분으로, 질소가 많은 융합 고리 구조를 가진 소분자입니다. 생리활성 분자의 구조-기능 관계를 설명할 때 자주 등장합니다.',
    },
  },
  ethanol: {
    summary: {
      en: 'Ethanol is a small polar alcohol that mixes with water and many organic substances, which is why it is valued as both a solvent and a fuel-related molecule.',
      ko: '에탄올은 물과 여러 유기 물질에 잘 섞이는 작은 극성 알코올로, 용매이면서 연료 관련 분자로도 중요합니다.',
    },
  },
  'sodium-chloride': {
    summary: {
      en: 'Sodium chloride is one of the simplest and most recognizable ionic compounds. Even though this page shows a conceptual molecular view, the material is best known for its repeating crystal lattice rather than a discrete covalent molecule.',
      ko: '염화나트륨은 가장 익숙한 이온성 화합물 중 하나입니다. 이 페이지에서는 개념형 구조로 표현했지만, 실제로는 개별 공유결합 분자보다 반복적인 결정 격자 구조로 이해하는 편이 더 적절합니다.',
    },
  },
  water: {
    summary: {
      en: 'Water is a bent polar molecule whose charge distribution drives hydrogen bonding, unusual boiling behavior, and broad solvent power. It is the benchmark example for intermolecular-force discussions.',
      ko: '물은 굽은 형태의 극성 분자로, 전하 분포 덕분에 수소결합과 높은 끓는점, 강한 용매 성질을 보입니다. 분자 간 힘을 설명할 때 기준이 되는 대표 사례입니다.',
    },
  },
}
