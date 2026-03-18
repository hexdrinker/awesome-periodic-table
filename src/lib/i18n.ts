import type { ElementCategory } from '../data/elements'
import type { AppLanguage } from '../store/useStore'

const categoryLabels: Record<AppLanguage, Record<ElementCategory, string>> = {
  en: {
    'alkali-metal': 'Alkali Metals',
    'alkaline-earth-metal': 'Alkaline Earth Metals',
    'transition-metal': 'Transition Metals',
    'post-transition-metal': 'Post-Transition Metals',
    'metalloid': 'Metalloids',
    'nonmetal': 'Nonmetals',
    'halogen': 'Halogens',
    'noble-gas': 'Noble Gases',
    'lanthanide': 'Lanthanides',
    'actinide': 'Actinides',
    'unknown': 'Unknown',
  },
  ko: {
    'alkali-metal': '알칼리 금속',
    'alkaline-earth-metal': '알칼리 토금속',
    'transition-metal': '전이 금속',
    'post-transition-metal': '전이 후 금속',
    'metalloid': '준금속',
    'nonmetal': '비금속',
    'halogen': '할로젠',
    'noble-gas': '비활성 기체',
    'lanthanide': '란타넘족',
    'actinide': '악티늄족',
    'unknown': '미분류',
  },
}

export const translations = {
  en: {
    brand: 'QUANTUM OBSERVATORY',
    tabs: {
      table: 'TABLE',
      isotopes: 'ISOTOPES',
      lab: 'LAB',
    },
    topBar: {
      language: 'LANG',
      theme: 'THEME',
      english: 'English',
      korean: 'Korean',
      system: 'System',
      dark: 'Dark',
      light: 'Light',
    },
    loading: {
      subtitle: 'INITIALIZING ATOMIC LATTICE...',
    },
    leftPanel: {
      title: 'Quantum 3D',
      subtitle: 'PERIODIC TABLE',
      description: [
        'SIMULATED ATOMIC LANDSCAPE RENDERED',
        'AT 10⁻¹⁰ SCALE. NAVIGATE THE CUBES TO',
        'INSPECT ISOTOPE STABILITY AND',
        'ELECTRON SHELL CONFIGURATION.',
      ],
      atomicNumber: 'Atomic #',
      weight: 'Weight',
      melting: 'Melting',
      boiling: 'Boiling',
      density: 'Density',
      stabilityIndex: 'STABILITY INDEX',
      fluxVariance: 'FLUX VARIANCE',
    },
    rightPanel: {
      systemStatus: 'SYSTEM STATUS',
      quantumCore: 'QUANTUM CORE',
      active: 'ACTIVE',
      observationLink: 'OBSERVATION LINK',
      locked: 'LOCKED',
      categoryFilters: 'CATEGORY FILTERS',
      totalElements: 'TOTAL ELEMENTS',
      clearFilter: 'CLEAR FILTER',
      elements: 'ELEMENTS',
    },
    controls: {
      zoomIn: 'ZOOM IN',
      zoomOut: 'ZOOM OUT',
      rotate: 'ROTATE',
      orbit: 'ORBIT',
      reset: 'RESET',
    },
    tooltip: {
      meltingPoint: 'MP',
    },
  },
  ko: {
    brand: 'QUANTUM OBSERVATORY',
    tabs: {
      table: '주기율표',
      isotopes: '동위원소',
      lab: '랩',
    },
    topBar: {
      language: '언어',
      theme: '테마',
      english: 'English',
      korean: '한국어',
      system: '시스템',
      dark: '다크',
      light: '라이트',
    },
    loading: {
      subtitle: '원자 격자를 초기화하는 중...',
    },
    leftPanel: {
      title: 'Quantum 3D',
      subtitle: '주기율표',
      description: [
        '시뮬레이션한 원자 지형을',
        '10⁻¹⁰ 스케일로 렌더링했습니다.',
        '큐브를 탐색하며 동위원소 안정성과',
        '전자 껍질 구성을 확인해보세요.',
      ],
      atomicNumber: '원자번호',
      weight: '원자량',
      melting: '융점',
      boiling: '끓는점',
      density: '밀도',
      stabilityIndex: '안정성 지수',
      fluxVariance: '플럭스 분산',
    },
    rightPanel: {
      systemStatus: '시스템 상태',
      quantumCore: '퀀텀 코어',
      active: '활성',
      observationLink: '관측 링크',
      locked: '잠김',
      categoryFilters: '카테고리 필터',
      totalElements: '전체 원소',
      clearFilter: '필터 해제',
      elements: '원소',
    },
    controls: {
      zoomIn: '확대',
      zoomOut: '축소',
      rotate: '회전',
      orbit: '궤도',
      reset: '초기화',
    },
    tooltip: {
      meltingPoint: '융점',
    },
  },
} as const

export function getCategoryLabel(category: ElementCategory, language: AppLanguage) {
  return categoryLabels[language][category]
}
